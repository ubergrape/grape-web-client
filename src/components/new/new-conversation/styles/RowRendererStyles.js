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
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  avatar: {
    position: 'relative',
    height: 32,
    flex: '0 0 32px',
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
    marginLeft: 10,
  },
  name: {
    fontSize: theme.fontSizeLabelWeb,
    color: theme.colorTextBase,
    lineHeight: theme.lineHeightBase,
    fontWeight: theme.fontWeightEmphasis,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  description: {
    fontSize: theme.fontSizeLabelWeb,
    color: theme.colorTextHint,
    lineHeight: theme.lineHeightBase,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
