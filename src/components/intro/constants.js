import { blue, white } from 'grape-theme/dist/base-colors'
import { spacer } from 'grape-theme/dist/sizes'
import { rgba } from 'css-functions'

export const containerStyle = {
  isolate: false,
  width: 530,
  padding: spacer.xxl,
  borderRadius: spacer.s,
  color: white,
  boxShadow: {
    x: 0,
    y: 3,
    blur: 8,
    color: rgba(0, 0, 0, 0.15),
  },
  background: ({ background = blue }) => background,
}
