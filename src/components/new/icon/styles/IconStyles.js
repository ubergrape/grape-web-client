import theme from '../../../../constants/theme'

export default {
  icon: ({ styles }) => styles,
  iconHover: {
    '&:hover': {
      isolate: false,
      background: theme.colorBackgroundButtonIntensePrimary,
      color: theme.colorBackgroundButtonNeutral,
    },
  },
}
