import { blue, blueLight } from 'grape-theme/dist/base-colors'
import { iconSize } from './../constants'

export default ({ palette }) => ({
  button: {
    display: 'flex',
    width: iconSize + 16,
    height: iconSize + 16,
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center',
  },
  disabledCamera: {
    color: palette.grey[300],
    width: iconSize,
    height: iconSize,
    cursor: 'pointer',
  },
  cameraActive: {
    color: ({ colors }) => colors.button || blue,
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      cursor: 'pointer',
      // TODO Size here should not be needed.
      // https://github.com/cssinjs/react-jss/issues/165
      width: iconSize,
      height: iconSize,
      color: ({ colors }) => colors.button || blueLight,
    },
  },
  camera: {
    width: iconSize,
    height: iconSize,
    '&:hover': {
      isolate: false,
      cursor: 'pointer',
      // TODO Size here should not be needed.
      // https://github.com/cssinjs/react-jss/issues/165
      width: iconSize,
      height: iconSize,
      color: ({ colors }) => colors.button || palette.secondary.A200,
    },
  },
})
