export const arrowMargin = 15

export const bottomCenter = {
  left: '50%',
  transform: 'translateX(-50%)',
}

export const bottomRight = {
  right: 0,
}

export const topRight = {
  right: 0,
  bottom: '100%',
}

export const topCenter = {
  left: '50%',
  bottom: '100%',
  transform: 'translateX(-50%)',
}

export const leftCenter = {
  right: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
}

export const rightCenter = {
  left: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
}

const wrapper = {
  position: 'relative',
  '&:hover > div': {
    isolate: false,
    transition: 'opacity 0.5s step-end',
    opacity: 1,
  },
}

export const styles = {
  wrapper,
  tooltip: {
    display: 'block',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    opacity: 0,
  },
  childrenWrapper: {
    display: 'flex',
    verticalAlign: 'middle',
  },
}
