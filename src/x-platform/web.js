import noop from 'lodash/utility/noop'

const {notify} = window
const notificationsConfig = {
  pageVisibility: true,
  autoClose: 6000
}

/**
 * Create native html notification.
 */
export function createNotification({title, content, icon}, callback = noop) {
  if (!notify) return
  notify.config(notificationsConfig)
  const notification = notify.createNotification(title, {
    icon,
    tag: title,
    body: content,
    onclick: () => {
      window.focus()
      notification.close()
      callback()
    }
  })
}

/**
 * Open an url in browser.
 */
export function openUrl(url, blank = true) {
  if (blank) return window.open(url)
  window.location.href = url
}

/**
 * We can't add badges on the web.
 */
export const addBadge = noop

/**
 * We can't remove badges on the web.
 */
export const removeBadge = noop
