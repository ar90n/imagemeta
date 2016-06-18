import React, { Component } from 'react';
import {  StyleSheet, Image, Text, View } from 'react-native';

import Carousel from 'react-native-carousel';

import * as Resources from '../constants/Resources';

const Manual = () => {
    return (
      <Carousel style={styles.manual} indicatorOffset={0} animate={false}>
        <View style={styles.carouselItem}>
          <Image source={{uri:Resources.MANUAL_IMAGE_KEY_01}} style={styles.manualImage} />
          <View style={styles.manualTextItem}>
            <Text style={styles.manualText} >{ Resources.MANUAL_MESSAGE_01 }</Text>
          </View>
        </View>
        <View style={styles.carouselItem}>
          <Image source={{uri:Resources.MANUAL_IMAGE_KEY_02}} style={styles.manualImage} />
          <View style={styles.manualTextItem}>
            <Text style={styles.manualText} >{ Resources.MANUAL_MESSAGE_02 }</Text>
          </View>
        </View>
        <View style={styles.carouselItem}>
          <Image source={{uri:Resources.MANUAL_IMAGE_KEY_03}} style={styles.manualImage} />
          <View style={styles.manualTextItem}>
            <Text style={styles.manualText} >{ Resources.MANUAL_MESSAGE_03 }</Text>
          </View>
        </View>
      </Carousel>
    );
}

const styles = StyleSheet.create({
    carouselItem: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 48,
        paddingTop: 48,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    manualTextItem: {
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6'
    },
    manualText: {
    },
    manualImage: {
        flex: 1,
    },
});

export default Manual;
