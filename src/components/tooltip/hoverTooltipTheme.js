export const arrowMargin = 15

export const bottomCenter = {
  left: '50%',
  transform: 'translateX(-50%)'
}

export const bottomRight = {
  right: 0
}

export const topRight = {
  right: 0,
  bottom: '100%'
}

export const topCenter = {
  left: '50%',
  bottom: '100%',
  transform: 'translateX(-50%)'
}

export const leftCenter = {
  right: '100%',
  top: '50%',
  transform: 'translateY(-50%)'
}

export const rightCenter = {
  left: '100%',
  top: '50%',
  transform: 'translateY(-50%)'
}

const wrapper = {
  position: 'relative'
}

export const styles = {
  wrapper,
  wrapperInline: {
    ...wrapper,
    display: 'inline-block'
  },
  tooltip: {
    lineHeight: 1,
    whiteSpace: 'nowrap'
  }
}
