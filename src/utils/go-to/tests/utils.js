/*
1) window.open - onExternal
2) location.href - onRedirect
3) openChannel - onSilentChange
4) router.push, router.replace - onUpdateRouter
*/

export const callbacks = () => {
  const called = {onExternal: 0, onRedirect: 0, onSilentChange: 0, onUpdateRouter: 0}
  const args = []
  const map = {
    onExternal: (...a) => {
      called.onExternal++
      // eslint-disable-next-line prefer-spread
      args.push.apply(args, a)
    },
    onRedirect: (...a) => {
      called.onRedirect++
      // eslint-disable-next-line prefer-spread
      args.push.apply(args, a)
    },
    onSilentChange: (...a) => {
      called.onSilentChange++
      // eslint-disable-next-line prefer-spread
      args.push.apply(args, a)
    },
    onUpdateRouter: (...a) => {
      called.onUpdateRouter++
      // eslint-disable-next-line prefer-spread
      args.push.apply(args, a)
    }
  }

  return {map, called, args}
}
