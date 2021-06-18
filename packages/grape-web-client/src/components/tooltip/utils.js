export function getPlacementStyles(arrowSize, borderSize) {
  const halfSize = arrowSize / 2

  const horizontalSizes = {
    width: arrowSize,
    height: halfSize,
  }
  const verticalSizes = {
    width: halfSize,
    height: arrowSize,
  }

  return {
    left: {
      ...verticalSizes,
      right: borderSize,
      marginTop: -halfSize,
    },
    right: {
      ...verticalSizes,
      left: borderSize,
      marginTop: -halfSize,
    },
    top: {
      ...horizontalSizes,
      bottom: borderSize,
      marginLeft: -halfSize,
    },
    bottom: {
      ...horizontalSizes,
      top: borderSize,
      marginLeft: -halfSize,
    },
  }
}

export function getPointerPlacement(placement) {
  switch (placement) {
    case 'left':
      return { right: '40%' }
    case 'right':
      return { left: '40%' }
    case 'top':
      return { bottom: '40%' }
    case 'bottom':
      return { top: '40%' }
    default:
  }
}

export function getBodyMargin(arrowSize, placement) {
  const margin = arrowSize / 2
  switch (placement) {
    case 'top':
    case 'bottom':
      return {
        margin: `${margin}px -${margin}px`,
      }
    case 'left':
    case 'right':
      return {
        margin: `-${margin}px ${margin}px`,
      }
    default:
  }
}

export function getArrowOffset(placement, align, arrowMargin) {
  if (placement === 'top' || placement === 'bottom') {
    switch (align) {
      case 'center':
        return {
          arrowOffsetLeft: '50%',
        }
      case 'left':
        return {
          arrowOffsetLeft: arrowMargin,
        }
      case 'right':
        return {
          arrowOffsetLeft: `calc(100% - ${arrowMargin}px)`,
        }
      default:
    }
  }

  if (placement === 'left' || placement === 'right') {
    return { arrowOffsetTop: '50%' }
  }
}
