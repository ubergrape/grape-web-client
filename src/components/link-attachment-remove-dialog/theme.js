import fonts from 'grape-theme/dist/fonts'
import { grayMercury, grayBlueLighter } from 'grape-theme/dist/base-colors'
import { spacer, borderRadius } from 'grape-theme/dist/sizes'

export const styles = {
  root: {
    extend: fonts.small,
    padding: [0, spacer.l, spacer.l],
    display: 'flex',
    flexDirection: 'column',
  },
  adminField: {
    border: 0,
    padding: 0,
    margin: 0,
    marginTop: spacer.s,
  },
  label: {
    extend: fonts.small,
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
    cursor: 'default',
  },
  checkbox: {
    appearance: 'checkbox',
    marginRight: spacer.xs,
  },
  select: {
    extend: fonts.small,
    display: 'block',
    width: '100%',
    marginTop: spacer.xs,
    backgroundColor: 'transparent',
    appearance: 'menulist',
    border: {
      width: 1,
      style: 'solid',
      color: grayBlueLighter,
      radius: borderRadius.big,
    },
    '&:disabled': {
      isolate: false,
      backgroundColor: grayMercury,
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: spacer.l,
  },
  submitButton: {
    marginLeft: spacer.xs,
  },
}
