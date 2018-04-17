import EmojiConvertor from 'grape-js-emoji2'
import {emojiSheet} from '../../constants/images'

const emoji = new EmojiConvertor()

emoji.img_sets.apple.sheet = emojiSheet
emoji.img_set = 'apple'
emoji.use_sheet = true

// https://github.com/ubergrape/chatgrape/issues/839
// https://bugzilla.mozilla.org/show_bug.cgi?id=923007
// if (navigator.userAgent.includes('Firefox') && navigator.platform === 'MacIntel') {
//   emoji.allow_native = false
// }
emoji.allow_native = false

emoji.init_env()
emoji.init_colons()

export default emoji

export function getEmojiSliceStyle(id) {
  const img = emoji.find_image(id)
  const sheetSize = emoji.sheet_size * (img.sheet_size + 2) // size of sprite sheet image in pixels
  const sheetX = 100 * (((img.px * (img.sheet_size + 2)) + 1) / (sheetSize - img.sheet_size))
  const sheetY = 100 * (((img.py * (img.sheet_size + 2)) + 1) / (sheetSize - img.sheet_size))
  const sheetZoom = 100 * (sheetSize / img.sheet_size)

  return {
    backgroundPosition: `${sheetX}% ${sheetY}%`,
    backgroundSize: `${sheetZoom}% ${sheetZoom}%`,
    backgroundImage: `url(${emojiSheet})`
  }
}

export const emojiRegex = /(^|\s):[a-zA-Z0-9-_]+:(?=($|\s))/g

export const style = {
  fontSize: 'inherit',
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '1em',
  height: '1em'
}
