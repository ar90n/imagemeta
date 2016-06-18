import {combineReducers} from 'redux'
import content from './content'
import routes from './routes'

const reducers = combineReducers({
    content,
    routes
})

export default reducers
