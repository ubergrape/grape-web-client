import fonts from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
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
  textOverflow: 'ellipsis',
  overflow: 'hidden'
}

const theme = {
  ...grayTheme,
  tooltipOffset: 0
}

const inputStyle = {
  ...commonInput,
  background: colors.white
}

const content = {
  ...theme.styles.content,
  ...fonts.normal,
  whiteSpace: 'nowrap'
}

export const input = {
  ...theme,
  styles: {
    ...theme.styles,
    input: inputStyle,
    inputError: inputStyle,
    inputWarning: inputStyle,
    content
  }
}

export const string = {
  ...theme,
  styles: {
    ...theme.styles,
    input: {
      ...commonInput,
      background: 'transparent',
      cursor: 'text',
      '&:hover': {
        isolate: false,
        background: 'rgba(255,255,255,0.5)'
      }
    },
    content
  }
}
