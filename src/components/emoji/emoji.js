import jsEmoji from 'grape-js-emoji'
import {emojiSheet} from '../../constants/images'

jsEmoji.sheet_path = emojiSheet
jsEmoji.use_sheet = true

// https://github.com/ubergrape/chatgrape/issues/839
// https://bugzilla.mozilla.org/show_bug.cgi?id=923007
if (~navigator.userAgent.indexOf('Firefox') && navigator.platform === 'MacIntel') {
  jsEmoji.allow_native = false
}

export default jsEmoji
