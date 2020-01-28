export default {
  base: {
    '&[aria-hidden=true]': {
      isolate: false,
      display: 'none',
    },
  },
  element: {
    '&:not([open])': {
      isolate: false,
      display: 'none',
    },
    '&[open]': {
      isolate: false,
      display: 'block',
    },
  },
}
