import { combineReducers } from 'redux'
import * as types from './types'

const token = localStorage.getItem('token')
const mainStateReducer = {
  dashboardLoading:false,
  userData:null,
  darkMode:false,
  theme:null,
  login:token,
  message:null,
  error:false,
  slideTime: 0,
  waveReady:false,
  data: null,
  videoUrl: "",
  videoBlob: null,
  play: false,
  videoPosition: 0,
  duration: 0,
  isSliding: false
}

// DATA REDUCER
const update_state_reducer = (state = mainStateReducer, { type, payload }) => {
  switch (type) {
    case types.DARK_MODE:
      return {
        ...state,
       darkMode:!state.darkMode,
      }
      case types.THEME:
      return {
        ...state,
       theme:payload,
      }
      case types.LOGIN:
      return {
        ...state,
       login:payload,
      }
      case types.EXPIRE_TOKEN:
        return {
          ...state, 
         message:payload,
         error:!state.error
        }
      case types.WAVE_READY:
        return {
          ...state,
          waveReady:false
        }
      case types.PLAY:
      return {
        ...state,
        play:payload
      }
      case types.WAVE_SLIDE:
      return {
        ...state,
        slideTime:payload
      }
      case types.DATA_FETCHED:
      return {
        ...state,
        data:payload
      }
      case types.GET_VIDEO:
      return {
        ...state,
        videoUrl:payload
      }
      case types.GET_VIDEO_BLOB:
      return {
        ...state,
        videoBlob:payload
      }
      case types.VIDEO_POSITION:
      return {
        ...state,
        videoPosition:payload
      }
      case types.DURATION:
      return {
        ...state,
        duration:payload
      }
      case types.SLIDING:
      return {
        ...state,
        isSliding:payload
      }
    default:
      return state
  }
}

// COMBINED REDUCERS
const reducers = {
  states: update_state_reducer
}

export default combineReducers(reducers)
