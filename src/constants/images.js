import staticUrl from '../utils/static-url'

const baseUrl = staticUrl('app/images')

export const emojiSheet = `${baseUrl}/emoji_sheet_32_optimized.png`
export const traubyReading = `${baseUrl}/trauby-reading.png`
export const traubyJuggling = `${baseUrl}/trauby-juggling.png`
export const noDetail = `${baseUrl}/no-detail.png`
export const defaultAvatar = `${baseUrl}/avatar.gif`
export const invitedAvatar = `${baseUrl}/avatar_invited.gif`
export const defaultServiceIcon = `${baseUrl}/default-service-icon.png`


// TODO move this somewhere else, this file is for image paths only.
export const defaultRoomIconSlug = 'bulb'
