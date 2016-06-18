import { ExifReader } from './ExifReader';

const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
let revLookup = [];
for (let i = 0, len = code.length; i < len; ++i) {
    revLookup[code.charCodeAt(i)] = i
}

class Base64Stream
{
    constructor( b64 )
    {
        this._b64 = b64;
        this._pos = 0;
        this._cache = [];
        this._bitCounter = 0;
        this._bitStorage = 0;
    }

    _parseBase64()
    {
        if( this._b64.length <= this._pos )
        {
            throw new Error( "Reached end of data." );
        }

        if( !'\t\n\f\r '.includes(this._b64[this._pos]) )
        {
            const buffer = revLookup[this._b64.charCodeAt(this._pos)];
            this._bitStorage = this._bitCounter % 4 ? this._bitStorage * 64 + buffer : buffer;
            if (this._bitCounter++ % 4)
            {
                const outByte = 0xFF & this._bitStorage >> (-2 * this._bitCounter & 6);
                this._cache.push( outByte );
            }
        }

        this._pos++;
    }

    isEndOfData()
    {
        return this._b64.length <= this._pos;
    }

    getBytes( bytes, endian = false )
    {
        while( this._cache.length < bytes )
        {
            this._parseBase64();
        }

        let res = []
        const base = endian ? bytes - 1 : 0 ;
        const dir  = endian ? -1 : 1 ;
        for( const i = 0; i < bytes; ++i )
        {
            const ind = base + dir * i;
            res[ind] = this._cache[0];
            this._cache.shift();
        }

        return res;
    }

    getUint8()
    {
        const bytes = this.getBytes( 1 );
        return bytes[0];
    }

    getUint16( endian = false )
    {
        const bytes = this.getBytes( 2, endian );
        return (bytes[1] << 8) | bytes[0];
    }

    getUint32( endian = false)
    {
        const bytes = this.getBytes( 4, endian );
        return (bytes[3] << 24 ) | (bytes[2] << 16 ) | (bytes[1] << 8) | bytes[0];
    }
}

const isJpeg = ( headerBytes ) => {
    return ( headerBytes[0] === 0xff ) && ( headerBytes[1] === 0xd8 );
};

const parseJpegInfo = ( data ) => {
    const info = {};
    const stream = new Base64Stream( data );

    const header = stream.getUint16( true );
    if( header !== 0xffd8 )
    {
        return info;
    }
    info['Image'] = { format: 'JPEG' };

    while( !stream.isEndOfData() )
    {
        const marker = stream.getUint16( true );
        if ( marker === 0xffda )
        {
            break;
        }

        const size = stream.getUint16( true );
        if (marker == 0xffe1)
        {
            const tmp = stream.getBytes( size - 2 );
            const exifData = new Uint8Array(tmp.length + 6);
            exifData[0] = 0xff;
            exifData[1] = 0xd8;
            exifData[2] = 0xff;
            exifData[3] = 0xe1;
            exifData[4] = (size >> 8);
            exifData[5] = (size & 0xff);
            for( let i = 0; i < tmp.length; i++ )
            {
                exifData[i+6] = tmp[i];
            }

            const exifReader = new ExifReader();
            exifReader.load( exifData.buffer );
            const tags = exifReader.getAllTags();
            for( const ifd in tags  )
            {
                info[ifd] = {};
                for( const key in tags[ifd] )
                {
                    if( typeof tags[ifd][key].description === 'string' )
                    {
                        info[ifd][key] = tags[ifd][key].description.trim();
                    }
                    else
                    {
                        info[ifd][key] = tags[ifd][key].description;
                    }
                }
            }
        }
        else if (( 0xffc0 <= marker) && (marker <= 0xffc3))
        {
            stream.getUint8();
            info['Image']['height'] = stream.getUint16( true );
            info['Image']['width'] = stream.getUint16( true );
            info['Image']['bpp'] = 8 * stream.getUint8();
            stream.getBytes(size - 8);
        }
        else
        {
            stream.getBytes(size - 2);
        }
    }

    return info;
};

const isPng = ( headerBytes ) => {
    return ( headerBytes[0] === 0x89 )
        && ( headerBytes[1] === 0x50 )
        && ( headerBytes[2] === 0x4e )
        && ( headerBytes[3] === 0x47 )
        && ( headerBytes[4] === 0x0d )
        && ( headerBytes[5] === 0x0a )
        && ( headerBytes[6] === 0x1a )
        && ( headerBytes[7] === 0x0a );
};

const parsePngInfo = ( data ) => {
    const stream = new Base64Stream( data );
    stream.getBytes( 16 );

    const w = stream.getUint32(true);
    const h = stream.getUint32(true);
    const bpc = stream.getUint8();
    const ct = stream.getUint8();
    const bpp = (ct == 4) ? 2 * bpc :
                (ct == 2) ? 3 * bpc :
                (ct == 6) ? 4 * bpc :
                bpc;
    return {
        Image : {
            format: 'PNG',
            width: w,
            height: h,
            bpp: bpp
        }
    };
};

const isGif = ( headerBytes ) => {
    return ( headerBytes[0] === 0x47 )
        && ( headerBytes[1] === 0x49 )
        && ( headerBytes[2] === 0x46 );
};

const parseGifInfo = ( data ) => {
    const stream = new Base64Stream( data );
    stream.getBytes( 3 );

    const v0 = String.fromCharCode( stream.getUint8() );
    const v1 = String.fromCharCode( stream.getUint8() );
    const v2 = String.fromCharCode( stream.getUint8() );
    const version = v0 + v1 + v2;
    const w = stream.getUint16();
    const h = stream.getUint16();
    const tmp = stream.getUint8();
    const bpp = ((tmp >> 4) & 7) + 1;
    return {
        Image: {
            format: 'GIF',
            version: version,
            width: w,
            height: h,
            bpp: bpp
        }
    };
};

const MetaParser = {
    parseImage( data ) {
        return new Promise( ( resolve, reject ) => {
            const stream = new Base64Stream( data );
            headerBytes = stream.getBytes(8);

            const meta = isJpeg(headerBytes) ? parseJpegInfo(data) :
                         isPng(headerBytes)  ? parsePngInfo(data) :
                         isGif(headerBytes)  ? parseGifInfo(data) :
                         null;

            if( meta )
            {
                resolve( meta );
            }
            else
            {
                reject( "Invalid image format." );
            }
        });
    }
};

export default MetaParser;
