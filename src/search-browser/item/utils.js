import find from 'lodash/collection/find'
import isEmpty from 'lodash/lang/isEmpty'

/**
 * Find state meta.
 */
export function getLabel(detail) {
  if (!detail || isEmpty(detail.meta)) return ''
  const label = find(detail.meta, meta => (meta.label === 'State' ||
    meta.label === 'Kind'))
  if (label) return label.value
}
