import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { trackAnalytics, error } from './'

export const showIntro = options => dispatch => {
  dispatch({ type: types.SHOW_INTRO })
  dispatch(trackAnalytics('Started Tutorial', options))
}

export const showNextIntro = () => dispatch => {
  dispatch({ type: types.SHOW_NEXT_INTRO })
}

const hide = dispatch => {
  dispatch({ type: types.HIDE_INTRO })
  api.setProfile({ showIntro: false }).catch(err => {
    dispatch(error(err))
  })
}

export const skipIntro = () => hide

export const doneIntro = () => hide
