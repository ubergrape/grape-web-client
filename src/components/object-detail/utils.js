import dotpather from 'dotpather'
import moment from 'moment'

const META_DATES = ['Modified', 'Start', 'End', 'Due', 'Time taken']
const META_DATES_AGO = ['Modified']

/**
 * Get preview image url.
 */
export let getImageUrl = dotpather('preview.image.url')

/**
 * Format date for meta.
 */
export function formatDateMaybe(label, value) {
  if (META_DATES.indexOf(label) < 0) return value

  if (META_DATES_AGO.indexOf(label) >= 0) {
    return moment(value).fromNow()
  }

  return moment(value).format('L HH:mm')
}
