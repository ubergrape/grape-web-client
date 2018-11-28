import theme from '../../../../constants/theme'

export default {
  switch: {
    position: 'relative',
    height: 16,
    width: 28,
    '&:focus-within': {
      isolate: false,
      outlineColor: '#4D90FE',
      outlineOffset: -2,
      outlineStyle: 'auto',
      outlineWidth: 5,
    },
  },
  input: {
    '&:checked + span:before': {
      isolate: false,
      backgroundColor: theme.colorIconActive,
      transform: 'translateX(12px)',
    },
  },
  toggle: {
    position: 'absolute',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: theme.colorBackgroundButtonLightActive,
    transition: '.4s',
    '&:before': {
      content: '""',
      position: 'absolute',
      cursor: 'pointer',
      height: 12,
      width: 12,
      borderRadius: 6,
      left: 2,
      bottom: 2,
      backgroundColor: theme.colorIconBaseStandardWeb,
      transition: '.4s',
    },
  },
}
