import theme from '../../../../constants/theme'

export default {
  wrapper: {
    position: 'relative',
    marginTop: 4,
  },
  circle: {
    isolate: false,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ({ color }) => color,
    margin: [0, 4, 0, 4],
    cursor: 'pointer',
    '&:checked': {
      isolate: false,
      width: 24,
      height: 24,
      borderRadius: 12,
      '& + div': {
        isolate: false,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
  checked: {
    display: 'none',
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    top: -3,
    right: 1,
    border: `2px solid ${theme.colorBorderButton}`,
  },
}
