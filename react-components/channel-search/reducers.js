import { combineReducers } from 'redux'

const initialState = {
  show: false,
  search: '',
  items: []
}

export default function reducers(state = initialState, action) {

  switch(action) {
    default:
      return state;
  }

}
