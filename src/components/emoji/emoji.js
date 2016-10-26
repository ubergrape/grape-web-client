import jsEmoji from 'grape-js-emoji'
import {emojiSheet} from '../../constants/images'

jsEmoji.sheet_path = emojiSheet
jsEmoji.use_sheet = true

// https://github.com/ubergrape/chatgrape/issues/839
// https://bugzilla.mozilla.org/show_bug.cgi?id=923007
if (navigator.userAgent.includes('Firefox') && navigator.platform === 'MacIntel') {
  jsEmoji.allow_native = false
}

jsEmoji.init_colons()

export default jsEmoji

export function getEmojiSliceStyle(id) {
  const px = jsEmoji.data[id][4]
  const py = jsEmoji.data[id][5]
  const mul = 100 / (jsEmoji.sheet_size - 1)

  return {
    backgroundPosition: `${mul * px}% ${mul * py}%`,
    backgroundSize: jsEmoji.sheet_size + '00%',
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
