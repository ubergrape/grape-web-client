import * as types from '../constants/actionTypes'

export function showMarkdownTips() {
  return {
    type: types.SHOW_MARKDOWN_TIPS,
  }
}

export function hideMarkdownTips() {
  return {
    type: types.HIDE_MARKDOWN_TIPS,
  }
}
