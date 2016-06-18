import React, { Component } from 'react';
import { BackAndroid } from 'react-native';
import { Provider, connect } from 'react-redux';

import { Router, Scene, Actions } from 'react-native-router-flux';

import fetchContent from './actions/content';
import configureStore from './store/configure-store';

import ContentContainer from './containers/ContentContainer';
import About from './components/About';
import Manual from './components/Manual';

const RouterWithRedux = connect()(Router);
const store = configureStore();

const SetBackKeyHandler = () => {
    BackAndroid.addEventListener('hardwareBackPress', () => {
        if( store.getState().routes.scenes.length === 0 )
        {
            return false;
        }

        try {
            Actions.pop();
            return true;
        } catch (err) {
            return false;
        }
    });
}

class Main extends Component {
    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        if(this.props.ImageTag)
        {
            store.dispatch( fetchContent( this.props.ImageTag ) );
        }
    }

    render() {
        SetBackKeyHandler();

        const isContentMode = !!this.props.ImageTag;
        return (
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene key='root'>
                        <Scene key='Content' component={ContentContainer} hideNavBar={isContentMode} />
                        <Scene key='About' component={About} hideNavBar={true}  initial={!isContentMode} />
                        <Scene key='Manual' component={Manual} hideNavBar={true} />
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

export default Main
