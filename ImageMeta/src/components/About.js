import React, { Component } from 'react';
import { StyleSheet, Linking, Image, Text, View } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-material-design';

import Package from '../../package.json';
import * as Resources from '../constants/Resources';

const TitleItem = () => {
    const versionTitle = 'Version ' + Package.version;

    return (
        <View style={styles.title} >
            <Image source={{uri:Resources.APP_ICON_KEY}} style={styles.titleImage} />
            <View style={styles.text} >
                <Text style={styles.titleText} >
                    {Package.name}
                </Text>
                <Text style={styles.infoText} >
                    {versionTitle}
                </Text>
            </View>
        </View>
    );
}

const MenuItem = () => {
    return (
        <View style={styles.menu} >
            <Button text='Manual' raised={true} onPress={Actions.Manual} />
            <Button text='Go to store page' raised={true} onPress={()=> Linking.openURL( Resources.STORE_PAGE_URI ) } />
            <Button text='Go to Github page' raised={true} onPress={()=> Linking.openURL( Resources.GITHUB_PAGE_URI ) } />
            <Button text='Go to privacy policy page' raised={true} onPress={()=> Linking.openURL( Resources.PRIVACY_POLICY_PAGE_URI ) } />
        </View>
    );
}

const About = () => {
    return (
        <View style={styles.about} > 
            <TitleItem />
            <MenuItem />
        </View>
    );
}

const styles = StyleSheet.create({
    about : {
        flexDirection: 'column',
        marginTop : 48
    },
    title : {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    menu : {
        flexDirection: 'column',
        flex : 1,
    },
    titleImage: {
        width: 72,
        height: 72,
    },
    text : {
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
    },
    titleText: {
        fontSize: 36,
    },
    infoText: {
        fontSize: 12,
    },
});

export default About
