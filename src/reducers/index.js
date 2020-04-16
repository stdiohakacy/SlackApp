import { combineReducers } from 'redux'

import * as actionTypes from '../actions/types'

const intialUserState = {
    currentUser: null,
    isLoading: true
}

const userReducer = (state = intialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        default: return state
    }
}

const rootReducer = combineReducers({
    user: userReducer
})

export default rootReducer
