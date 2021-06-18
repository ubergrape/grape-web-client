import staticUrl from '../utils/static-url'

const baseUrl = staticUrl('app/images')

export const emojiSheet = `${baseUrl}/emoji_sheet_64_optimized.png`
export const noDetail = `${baseUrl}/no-detail.png`
export const defaultAvatar = `${baseUrl}/avatar.gif`
export const invitedAvatar = `${baseUrl}/avatar_invited.gif`
export const defaultServiceIcon = `${baseUrl}/default-service-icon.png`

export const mascot = {
  holdingLock: `${baseUrl}/mascot/holding-lock.png`,
  holdingMail: `${baseUrl}/mascot/holding-mail.png`,
  inSpace: `${baseUrl}/mascot/in-space.gif`,
  juggling: `${baseUrl}/mascot/juggling.png`,
  reading: `${baseUrl}/mascot/reading.png`,
  regular: `${baseUrl}/mascot/regular.png`,
}
