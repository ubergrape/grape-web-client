import * as types from '../constants/actionTypes'

const initialState = {
  uploads: [],
}
const initialUpload = {
  progress: 0,
  isComplete: false,
  isRejected: false,
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.START_FILE_UPLOAD:
      return {
        ...state,
        uploads: [...state.uploads, { ...initialUpload, ...payload }],
      }
    case types.UPDATE_FILE_UPLOAD_PROGRESS: {
      const uploads = state.uploads.map(
        upload =>
          upload.id === payload.id ? { ...upload, ...payload } : upload,
      )
      return { ...state, uploads }
    }
    case types.END_FILE_UPLOAD: {
      const uploads = state.uploads.map(
        upload =>
          upload.id === payload.id ? { ...upload, isComplete: true } : upload,
      )
      return { ...state, uploads }
    }
    case types.HANDLE_FILE_UPLOAD_ERROR: {
      const uploads = state.uploads.map(upload => {
        if (upload.id !== payload.id) return upload
        return {
          ...upload,
          isComplete: true,
          error: payload.err.message,
        }
      })
      return { ...state, uploads }
    }
    case types.HANDLE_REJECTED_FILES: {
      const rejected = payload.map(upload => ({
        ...initialUpload,
        ...upload,
        isComplete: true,
        isRejected: true,
      }))
      return { ...state, uploads: [...state.uploads, ...rejected] }
    }
    case types.HANDLE_UPLOAD_COMPLETE:
      return initialState
    default:
      return state
  }
}
