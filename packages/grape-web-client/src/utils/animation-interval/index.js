export default (ms, signal, callback) => {
  const start = document.timeline
    ? document.timeline.currentTime
    : new Date().getTime() - performance.timing.connectStart

  const frame = time => {
    if (signal.aborted) return
    callback(time, start)
    // eslint-disable-next-line no-use-before-define
    scheduleFrame(time)
  }

  const scheduleFrame = time => {
    const elapsed = time - start
    const roundedElapsed = Math.round(elapsed / ms) * ms
    const targetNext = start + roundedElapsed + ms
    const delay = targetNext - performance.now()
    setTimeout(() => requestAnimationFrame(frame), delay)
  }

  scheduleFrame(start)
}
