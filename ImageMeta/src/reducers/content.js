import { handleActions } from 'redux-actions'

import * as types from '../constants/ActionTypes'

const defaultState = {
    loading: true,
    content: {}
};

const content = handleActions( {
    [types.FETCH_CONTENT] : ( state, action ) => {
        return Object.assign( {}, state, { loading: false,  content: action.payload } );
    }
}, defaultState );

export default content;
