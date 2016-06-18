import { createAction } from 'redux-actions'
import { NativeModules } from 'react-native'

import MetaParser from '../lib/MetaParser'
import * as types from '../constants/ActionTypes'

const fetchContent = createAction( types.FETCH_CONTENT, ( tag ) => {
    return new Promise( ( resolve , reject ) => {
        NativeModules.ImageStoreManager
                     .getBase64ForTag( tag , resolve, reject );
    }).then( ( b64 ) => {
        return MetaParser.parseImage( b64 );
    }).catch( ( err_str ) => {
        console.log( err_str );
    });
});

export default fetchContent;
