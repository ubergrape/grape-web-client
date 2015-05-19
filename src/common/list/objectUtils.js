import find from 'lodash-es/collection/find'
import isEmpty from 'lodash-es/lang/isEmpty'

/**
 * Find state meta.
 */
export function getState(detail) {
  if (!detail || isEmpty(detail.meta)) return
  let state = find(detail.meta, meta => meta.label == 'State')
  if (state) return state.value
}
