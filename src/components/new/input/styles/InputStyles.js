import theme from '../../../../constants/theme'

export default {
  input: ({ styles, error }) => ({
    width: '100%',
    height: 32,
    padding: error ? '0px 28px 0px 16px' : '0px 16px',
    borderRadius: theme.borderRadiusButtonPillWeb,
    border: `1px solid ${error ? '#B30F00' : theme.colorBorderButton}`,
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
  error: {
    display: 'block',
    marginTop: 4,
    fontSize: theme.fontSizeLabelWeb,
    color: '#B30F00',
  },
}
