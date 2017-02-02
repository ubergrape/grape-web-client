export const clearfix = {
  zoom: 1,
  '&:after, &:before': {
    content: '""',
    display: 'table'
  },
  '&:after': {
    clear: 'both'
  }
}

export const ellipsis = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'block'
}

export default {
  clearfix,
  ellipsis
}
