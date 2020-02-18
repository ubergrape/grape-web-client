import theme from '../../../../constants/theme'

export default {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    color: theme.colorTextBase,
    fontSize: theme.fontSizeHeadingStandardWeb,
    fontWeight: theme.fontWeightEmphasis,
  },
  button: {
    isolate: false,
    background: 'none',
    border: 0,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'space-between',
  },
  avatar: {
    position: 'relative',
    height: 32,
    flex: '0 0 32px',
    pointerEvents: 'none',
  },
  image: {
    width: 32,
    minWidth: 32,
    height: 32,
    borderRadius: theme.borderRadiusButtonPillWeb,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    marginLeft: 10,
    pointerEvents: 'none',
  },
  name: {
    fontSize: theme.fontSizeLabelWeb,
    color: theme.colorTextBase,
    lineHeight: theme.lineHeightBase,
    fontWeight: theme.fontWeightEmphasis,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  },
  guestLabel: {
    background: theme.colorBackgroundButtonLightActive,
    fontSize: theme.fontSizeLabelWeb,
    borderRadius: 8,
    padding: '2px 8px',
    marginLeft: 5,
  },
  description: {
    fontSize: theme.fontSizeLabelWeb,
    color: theme.colorTextHint,
    lineHeight: theme.lineHeightBase,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  },
  time: {
    color: theme.colorTextButtonStandardBasic,
    fontSize: theme.fontSizeLabelWeb,
    flex: '0 0 auto',
  },
}
