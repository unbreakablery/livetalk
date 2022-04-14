import * as types from './types'

// INCREMENT COUNTER BY 1
export const darkMode = (value) => ({ type: types.DARK_MODE })
export const setTheme = (value) => ({ type: types.THEME, payload: value })
export const login = (value) => ({ type: types.LOGIN, payload: value })
export const onExpire = (value) => ({ type: types.EXPIRE_TOKEN, payload: value })
export const onWaveReady = (value) => ({ type: types.WAVE_READY, payload: value })
export const onPlay = (value) => ({ type: types.PLAY, payload: value })
export const onSlideWave = (value) => ({ type: types.WAVE_SLIDE, payload: value })
export const onDataFecthed = (value) => ({ type: types.DATA_FETCHED, payload: value })
export const onGetVideo = (value) => ({type: types.GET_VIDEO, payload: value})
export const onGetVideoBlob = (value) => ({type: types.GET_VIDEO_BLOB, payload: value})
export const videoPosition = (value) => ({ type: types.VIDEO_POSITION, payload: value })
export const setGDuration = (value) => ({type: types.DURATION, payload: value})
export const isSliding = (value) => ({type: types.SLIDING, payload:value})