import EmojiConvertor from 'emoji-js'
import {emojiSheet} from '../../constants/images'

const emoji = new EmojiConvertor()

// emoji.img_sets.apple.sheet = emojiSheet
emoji.use_sheet = true

console.log('weeee')

// https://github.com/ubergrape/chatgrape/issues/839
// https://bugzilla.mozilla.org/show_bug.cgi?id=923007
// if (navigator.userAgent.includes('Firefox') && navigator.platform === 'MacIntel') {
//   emoji.allow_native = false
// }

// emoji.init_env()
emoji.init_colons()

export default emoji

export function getEmojiSliceStyle(id) {
  const img = emoji.find_image(id)
  const sheet_size = emoji.sheet_size * (img.sheet_size + 2) // size of image in pixels
  console.log(sheet_size)
  const sheet_x = 100 * (((img.px * (img.sheet_size + 2)) + 1) / (sheet_size - img.sheet_size))
  const sheet_y = 100 * (((img.py * (img.sheet_size + 2)) + 1) / (sheet_size - img.sheet_size))
  const sheet_sz = 100 * (sheet_size / img.sheet_size)

  return {
    backgroundPosition: `${sheet_x}% ${sheet_y}%`,
    backgroundSize: `${sheet_sz}% ${sheet_sz}%`,
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
