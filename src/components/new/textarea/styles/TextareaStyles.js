import theme from '../../../../constants/theme'

export default {
  textarea: ({ styles }) => ({
    width: '100%',
    height: 48,
    padding: '8px 16px 8px 16px',
    borderRadius: theme.borderRadiusButtonPillWeb,
    border: `1px solid ${theme.colorBorderButton}`,
    color: theme.colorTextButtonStandardBasic,
    fontSize: theme.fontSizeLabelWeb,
    ...styles,
  }),
  textareaPS: {
    '&:focus': {
      isolate: false,
      borderColor: theme.colorIconActive,
    },
  },
}
