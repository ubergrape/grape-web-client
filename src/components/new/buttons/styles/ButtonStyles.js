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
      styleType === 'minimal'
        ? '1px solid transparent'
        : `1px solid ${theme.colorBorderButton}`,
    '&:hover': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundLight,
    },
    '&:active': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundButtonLightActive,
    },
  },
  primary: {
    color: theme.colorTextButtonStandardPrimary,
    backgroundColor: theme.colorBackgroundButtonIntensePrimary,
    border: '1px solid transparent',
    '&:hover': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundLight,
    },
    '&:active': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundButtonLightActive,
    },
  },
  danger: {
    color: theme.colorTextButtonStandardDanger,
    backgroundColor: theme.colorBackgroundNeutral,
    border: ({ styleType }) =>
      styleType === 'minimal'
        ? '1px solid transparent'
        : `1px solid ${theme.colorBorderButton}`,
    '&:hover': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundLight,
    },
    '&:active': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundButtonLightActive,
    },
  },
  fatal: {
    color: theme.colorTextButtonStandardFatal,
    border: '1px solid transparent',
    backgroundColor: theme.colorBackgroundButtonIntenseFatal,
    '&:hover': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundLight,
    },
    '&:active': {
      isolate: false,
      border: `1px solid ${theme.colorBorderButton}`,
      color: theme.colorTextButtonStandardBasic,
      background: theme.colorBackgroundButtonLightActive,
    },
  },
}
