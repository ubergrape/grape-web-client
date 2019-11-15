const ongoing = 'callOngoing'
const ended = 'callEnded'
const missed = 'callMissed'

export default {
  calling: ongoing,
  missedCall: missed,
  hungUp: ended,
  finished: ended,
  inCall: ongoing,
  rejectedCall: missed,
}
