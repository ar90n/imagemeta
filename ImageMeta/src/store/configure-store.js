import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from '../reducers';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);

const configureStore = (initialState) => {
    const store = createStoreWithMiddleware(reducers, initialState);
    return store;
}

export default configureStore
