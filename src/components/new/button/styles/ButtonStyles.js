import theme from '../../../../constants/theme'

export default {
  button: ({ styles, styleType }) => ({
    cursor: 'pointer',
    padding: '5px 16px',
    height: styleType === 'small' ? 24 : 32,
    borderRadius: styleType === 'small' ? 12 : 16,
    ...styles,
  }),
  basic: {
    color: theme.colorTextButtonStandardBasic,
    backgroundColor: theme.colorBackgroundNeutral,
    border: ({ styleType }) =>
      styleType === 'minimal' ? 'none' : `1px solid ${theme.colorBorderButton}`,
  },
  primary: {
    color: theme.colorTextButtonStandardPrimary,
    backgroundColor: theme.colorBackgroundButtonIntensePrimary,
  },
  danger: {
    color: theme.colorTextButtonStandardDanger,
    backgroundColor: theme.colorBackgroundNeutral,
    border: ({ styleType }) =>
      styleType === 'minimal' ? 'none' : `1px solid ${theme.colorBorderButton}`,
  },
  fatal: {
    color: theme.colorTextButtonStandardFatal,
    backgroundColor: theme.colorBackgroundButtonIntenseFatal,
  },
}
