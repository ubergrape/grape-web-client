import theme from '../../../../constants/theme'

export default {
  searchInput: {
    position: 'relative',
    width: '100%',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: theme.borderRadiusButtonPillWeb,
    border: `1px solid ${theme.colorBorderButton}`,
    position: 'absolute',
    top: 0,
    left: 0,
    '&:before': {
      content: '""',
      display: 'none',
      position: 'absolute',
      top: -1,
      left: -1,
      width: 32,
      height: 32,
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      border: `1px solid ${theme.colorIconActive}`,
      borderRight: 0,
    },
  },
}
