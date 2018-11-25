import theme from '../../../../constants/theme'

export default {
  icon: {
    width: 32,
    height: 32,
    backgroundColor: ({ color }) => color,
    borderRadius: theme.borderRadiusButtonPillWeb,
  },
}
