import EmojiConvertor from 'grape-js-emoji'
import { getSliceStyle } from 'grape-browser/lib/components/emoji'
import { emojiSheet } from '../../constants/images'

const emoji = new EmojiConvertor()

emoji.img_sets.apple.sheet = emojiSheet
emoji.img_set = 'apple'
emoji.use_sheet = true

// https://github.com/ubergrape/chatgrape/issues/839
// https://bugzilla.mozilla.org/show_bug.cgi?id=923007
const isFirefoxOnOsx =
  navigator.userAgent.includes('Firefox') && navigator.platform === 'MacIntel'
// Since Windows7 can't render emojis natively the decision was
// to render images for all Windows environments
const isWindows = navigator.platform === 'Win32'
if (isFirefoxOnOsx || isWindows) {
  emoji.allow_native = false
}
// only convert an emoji to a colon string since we manually
// render emoji images with the markdown converter
emoji.colons_mode = true

emoji.init_colons()

export default emoji

export const getEmojiSliceStyle = getSliceStyle

export const emojiRegex = /(^|\s):[a-zA-Z0-9-_]+:(?=($|\s))/g

export const style = {
  fontSize: 'inherit',
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '1em',
  height: '1em',
}
