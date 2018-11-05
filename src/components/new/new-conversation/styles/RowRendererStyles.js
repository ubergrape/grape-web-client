import theme from '../../../../constants/theme'

export default {
  button: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  avatar: {
    width: 32,
    minWidth: 32,
    height: 32,
    borderRadius: theme.borderRadiusButtonPillWeb,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
  },
  name: {
    fontSize: theme.fontSizeLabelWeb,
    color: theme.colorTextBase,
    lineHight: theme.lineHeightBase,
    fontWeight: theme.fontWeightEmphasis,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  description: {
    fontSize: theme.fontSizeLabelWeb,
    color: theme.colorTextHint,
    lineHight: theme.lineHeightBase,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
