import * as types from '../constants/actionTypes'

const initialState = {
  uploading: []
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.START_FILE_UPLOAD:
      return {...state, uploading: [...state.uploading, {...payload, progress: 0}]}
    case types.UPDATE_FILE_UPLOAD_PROGRESS: {
      const uploading = state.uploading.map(upload => (
        upload.id === payload.id ? payload : upload
      ))
      return {...state, uploading}
    }
    case types.END_FILE_UPLOAD: {
      const uploading = state.uploading.map(upload => (
        upload.id === payload.id ? {...upload, complete: true} : upload
      ))
      return {...state, uploading}
    }
    default:
      return state
  }
}
