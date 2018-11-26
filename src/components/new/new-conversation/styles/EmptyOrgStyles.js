import theme from '../../../../constants/theme'

export default {
  title: {
    fontSize: theme.fontSizeHeadingStandardWeb,
    fontWeight: theme.fontWeightEmphasis,
    lineHeight: '21px',
  },
  text: {
    marginTop: 10,
    lineHeight: '23px',
  },
  button: {
    height: 32,
    padding: [0, 16, 0, 16],
    marginTop: 20,
    fontWeight: theme.fontWeightEmphasis,
    borderRadius: theme.borderRadiusButtonPillWeb,
    backgroundColor: theme.colorTextButtonMinimalPrimary,
    color: theme.colorTextButtonStandardPrimary,
    cursor: 'pointer',
  },
}
