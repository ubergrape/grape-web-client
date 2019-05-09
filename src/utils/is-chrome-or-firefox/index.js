const isChromeOrFirefox =
  (navigator.userAgent.includes('Firefox') ||
    navigator.userAgent.includes('Chrome')) &&
  !navigator.userAgent.includes('Edge')

export default isChromeOrFirefox
