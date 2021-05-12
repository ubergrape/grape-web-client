import fonts from 'grape-theme/dist/fonts'
import { white, grayLight } from 'grape-theme/dist/base-colors'
import prefixSelector from 'grape-web/lib/jss-utils/prefixSelector'

import * as grayTheme from '../input/theme/gray'

const commonInput = {
  font: 'inherit',
  lineHeight: 1.1,
  width: '100%',
  padding: '5px 7px',
  marginLeft: -7,
  color: 'inherit',
  borderRadius: 4,
  outline: 'none',
  border: 'none',
  resize: 'none',
  overflow: 'hidden',
  [`&${prefixSelector('::input-placeholder')}`]: {
    isolate: false,
    color: grayLight,
  },
}

const theme = {
  ...grayTheme,
  tooltipOffset: 0,
}

const inputStyle = {
  ...commonInput,
  background: white,
}

const content = {
  ...theme.styles.content,
  ...fonts.normal,
  whiteSpace: 'nowrap',
}

export const input = {
  ...theme,
  styles: {
    ...theme.styles,
    input: inputStyle,
    inputError: inputStyle,
    inputWarning: inputStyle,
    content,
  },
}

export const string = {
  ...theme,
  styles: {
    ...theme.styles,
    input: {
      ...commonInput,
      background: 'transparent',
      cursor: 'text',
      textOverflow: 'ellipsis',
      '&:hover': {
        isolate: false,
        background: 'rgba(255,255,255,0.5)',
      },
    },
    content,
  },
}
