import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

/**
 * Find state meta.
 */
export function getLabel(detail) {
  if (!detail || isEmpty(detail.meta)) return ''
  const label = find(
    detail.meta,
    meta => meta.label === 'State' || meta.label === 'Kind',
  )
  if (label) return label.value
}
