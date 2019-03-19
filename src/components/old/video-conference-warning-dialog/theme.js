import {
  grayBlueLighter,
  grayDark,
  grayMercury,
  blue,
} from 'grape-theme/dist/base-colors'
import { borderRadius } from 'grape-theme/dist/sizes'
import { small } from 'grape-theme/dist/fonts'
import buttonIcon from '../button/icon'

export default ({ palette }) => ({
  content: {
    borderTop: [3, 'solid', grayBlueLighter],
    display: 'block',
    padding: 20,
  },
  text: {
    ...small,
    color: grayDark,
  },
  description: {
    paddingTop: 7,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  link: {
    height: 48,
    padding: [13, 11],
    cursor: 'pointer',
    border: [1, 'solid', grayMercury],
    borderRadius: borderRadius.big,
    marginTop: 24,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    extend: [
      small,
      buttonIcon('grape', {
        color: palette.text.primary,
        hoverColor: palette.secondary.A200,
        size: 27,
      }),
    ],
  },
  blueLink: {
    cursor: 'pointer',
    color: blue,
  },
  download: {
    marginTop: 12,
  },
  alternative: {
    marginTop: 24,
  },
  bold: {
    fontWeight: 900,
  },
})
