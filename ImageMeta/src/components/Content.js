import React, { Component, PropTypes } from 'react';
import { ListView,
         View,
         Text,
         StyleSheet } from 'react-native';

import MapView from 'react-native-maps';
import GiftedSpinner from 'react-native-gifted-spinner';
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob'

import * as Resources from '../constants/Resources';

const GetPrettyGPS = ( rowData ) => {
    return rowData[0].toString() + '° ' + rowData[1].toString() + "' " + rowData[2].toString() + '"';
}

const RowItem = ( {rowId, rowData} ) => {
    const prettyRowData = ( rowId === 'GPSLatitude' ) ? GetPrettyGPS( rowData ) :
                          ( rowId === 'GPSLongitude' ) ? GetPrettyGPS( rowData ) :
                          ( typeof rowData === 'string' ) ? rowData.trim() :
                          ( typeof rowData === 'number' ) ? Math.round( 1000 * rowData ) / 1000 :
                          rowData;

    return (
        <View style={styles.row} >
            <Text>{rowId}</Text>
            <Text>{prettyRowData}</Text>
        </View>
    );
};

const ShouldShowMap = ( sectionData ) => {
    return sectionData && ( 'GPSLatitude' in sectionData ) && ( 'GPSLongitude' in sectionData );
};

const GpsMapItem = ( { gpsSectionData } ) => {
    const latValues = gpsSectionData['GPSLatitude'];
    const lat = latValues[0] + latValues[1] / 60 + latValues[2] / 3600;

    const lonValues = gpsSectionData['GPSLongitude'];
    const lon =  lonValues[0] + lonValues[1] / 60 + lonValues[2] / 3600;

    const coordinate = {
        latitude: lat,
        longitude: lon,
    };
    const region = {
        ...coordinate,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
      <View style={styles.mapRow} >
        <MapView style={styles.map} initialRegion={region} >
            <MapView.Marker coordinate={coordinate} />
        </MapView>
      </View>
    );
}

const SectionItem = ( { sectionData, sectionId } ) => {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.separator} />
            <View style={styles.section} >
                <Text style={styles.sectionTitle} >{sectionId}</Text>
            </View>
            { ShouldShowMap( sectionData ) ? <GpsMapItem gpsSectionData={sectionData} /> : null  }
        </View>
    );
};

const FooterItem = () => {
    return (
        <View>
            <SectionItem sectionId={"PR"} />
            <AdMobBanner adUnitID={Resources.ADMOB_AD_ID} />
        </View>
    );
};

const SpinnerItem = () => {
    return (
      <View style={styles.spinner}>
          <GiftedSpinner />
      </View>
    );
};

const ContentItem = ( {dataSource} ) => {
    return (
      <ListView
        dataSource={dataSource}
        renderRow={(rowData, sectionId, rowId) => <RowItem rowId={rowId} rowData={rowData} />}
        renderSectionHeader={(sectionData,sectionId) => <SectionItem sectionData={sectionData} sectionId={sectionId} />}
        renderFooter={() => <FooterItem />}
        initialListSize={20}
        pageSize={5}
      />
    );
};

const Content = ( { loading, content } ) => {
    let ds = new ListView.DataSource( {
        rowHasChanged: (r1,r2) => { return r1 !== r2 },
        sectionHeaderHasChanged: (r1,r2) => {return r1 !== r2 },
        getRowData:(dataBlob, sectionId, rowId) => { return dataBlob[sectionId][rowId]; },
        getSectionHeaderData:(dataBlob, sectionId) => { return dataBlob[sectionId]; }
    });
    ds = ds.cloneWithRowsAndSections( content );

    return loading ? <SpinnerItem /> : <ContentItem dataSource={ds} />;
}

Content.propTypes = {
    loading : PropTypes.bool.isRequired,
    content : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#F6F6F6',
        height: 48,
    },
    sectionHeader: {
        flexDirection: 'column',
        backgroundColor: '#F6F6F6'
    },
    section: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical : 16,
    },
    sectionTitle: {
        fontSize : 16,
        fontWeight : 'bold',
        color: '#aaaaaa'
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC'
    },
    spinner: {
        flex:1 ,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapRow: {
        padding: 10,
        backgroundColor: '#F6F6F6'
    },
    map: {
        height: 250,
    },
});

export default Content
