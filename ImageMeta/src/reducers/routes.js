import { handleActions } from 'redux-actions';

import * as types from '../constants/ActionTypes'

const defaultState = {
    scenes: [],
};

const routes = handleActions( {
    [types.POP] : ( state, action ) => {
        const len = state.scenes.length;
        return Object.assign( {}, state, { scenes: state.scenes.splice(0,len-1) } );
    },
    [types.PUSH] : ( state, action ) => {
        return Object.assign( {}, state, { scenes: state.scenes.concat( [action.key] ) } );
    }
}, defaultState );

export default routes;
