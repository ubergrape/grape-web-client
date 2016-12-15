import fonts from 'grape-theme/dist/fonts'
import {white, green, red} from 'grape-theme/dist/base-colors'
import {LinearProgress} from 'grape-web/lib/mui-theme'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

import {verticalSpacing} from '../toast-notification'

const itemBottomSpacing = 10

const textHeight = fonts.normal.fontSize * fonts.normal.lineHeight

const itemHeight = LinearProgress.root.height + textHeight + itemBottomSpacing

// This can be removed once we have a notification component which
// measures its content.
export const calcHeight = (uploads) => {
  // Notification container padding.
  const initialHeight = verticalSpacing * 4 +
    // Title,
    fonts.normal.fontSize * fonts.normal.lineHeight

  return uploads.reduce((height, {isComplete, isRejected, error}, i) => {
    let currHeight = height + (isComplete ? textHeight : itemHeight)
    // Last item doesn't have a margin.
    if (uploads[i + 1] && !isComplete) currHeight += itemBottomSpacing
    if (error || isRejected) currHeight += textHeight
    return currHeight
  }, initialHeight)
}

export const styles = {
  title: {
    extend: fonts.normal,
    color: white
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  progress: {
    height: itemHeight
  },
  progressCompleted: {
    height: textHeight
  },
  progressErrored: {
    height: textHeight * 2
  },
  name: {
    extend: fonts.normal,
    color: white,
    opacity: 0.7,
    '&:after': {
      content: '" \\2714"',
      color: 'transparent'
    }
  },
  nameCompleted: {
    opacity: 1,
    color: green,
    '&:after': {
      color: green
    }
  },
  nameErrored: {
    color: red,
    '&:after': {
      content: '" \\2718"',
      color: red
    }
  },
  error: {
    extend: [ellipsis, fonts.normal],
    color: red
  }
}
