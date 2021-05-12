import { createSelector } from 'reselect'

export const searchBrowserSelector = createSelector(
  state => state.searchBrowser,
  state => state,
)
