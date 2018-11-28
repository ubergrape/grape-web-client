import theme from '../../../../constants/theme'

export default {
  input: ({ styles }) => ({
    width: '100%',
    height: 32,
    padding: '0px 16px 0px 16px',
    borderRadius: theme.borderRadiusButtonPillWeb,
    border: `1px solid ${theme.colorBorderButton}`,
    color: theme.colorTextButtonStandardBasic,
    fontSize: theme.fontSizeLabelWeb,
    ...styles,
  }),
  inputPS: {
    '&:focus': {
      isolate: false,
      borderColor: theme.colorIconActive,
    },
    '&:focus + div > div > svg path': {
      isolate: false,
      fill: theme.colorIconActive,
    },
    '&:focus + div:before': {
      isolate: false,
      display: 'block',
    },
  },
}
