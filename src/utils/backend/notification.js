import noop from 'lodash/utility/noop'
import find from 'lodash/collection/find'
import filter from 'lodash/collection/filter'
import every from 'lodash/collection/every'
import warning from 'warning'

// All available transports.
const transports = ['desktop', 'push', 'email']

// All available dispatchers.
const dispatchers = ['message', 'pm', 'mention', 'group_mention', 'room_invite', 'activity']

// All mention dispatchers.
const mentionDispatchers = ['mention', 'group_mention']

function createSequence(value, predicate = noop) {
  return transports.reduce((sequence, transport) => {
    dispatchers.forEach(dispatcher => {
      const setting = {
        transport,
        dispatcher,
        active: value
      }
      if (predicate(setting) !== false) sequence.push(setting)
    })
    return sequence
  }, [])
}

// Create a sequence which resets all values so they can inherit.
function createResetSequence(transport) {
  return createSequence(null, setting => setting.transport === transport)
}

function createAnyMentionSequence(transport) {
  return createResetSequence(transport).map(setting => {
    if (mentionDispatchers.indexOf(setting.dispatcher) !== -1) {
      return {...setting, active: true}
    }

    return setting
  })
}

function createDirectMentionSequence(transport) {
  const sequence = createSequence(false, setting => setting.transport === transport)
  return sequence.map(setting => {
    if (setting.dispatcher === 'mention') {
      return {...setting, active: true}
    }

    return setting
  })
}

export function getSequence({transport, setting, value: muteAll}) {
  if (transport === 'all' && setting === 'all') {
    return createSequence(muteAll ? false : null)
  }

  switch (setting) {
    case 'anyMention':
      return createAnyMentionSequence(transport)
    case 'directMention':
      return createDirectMentionSequence(transport)
    case 'inherit':
      return createResetSequence(transport)
    default:
      return []
  }
}

export function getOptions(sequence) {
  // Returns true if all settings in the sequence are active.
  const isInactive = seq => every(seq, {active: false})

  // Returns true if sequence has all kinds of mentions.
  const isAnyMention = seq => Boolean(
    find(seq, {dispatcher: 'mention', active: true}) &&
    find(seq, {dispatcher: 'group_mention', active: true})
  )

  // Returns true if sequence has only direct mention.
  const isDirectMention = seq => Boolean(
    find(seq, {dispatcher: 'mention', active: true}) &&
    !find(seq, {dispatcher: 'group_mention', active: true})
  )

  const getUiDispatcher = (seq, transport) => {
    const transportSequence = filter(seq, {transport})
    const isInherit = every(transportSequence, {inherit: true})

    if (isInherit || isInactive(transportSequence)) return 'inherit'
    if (isAnyMention(transportSequence)) return 'anyMention'
    if (isDirectMention(transportSequence)) return 'directMention'

    warning(false, 'Bad notification settings: \n\r %s', JSON.stringify(sequence, null, 2))

    return 'inherit'
  }

  const allMuted = isInactive(sequence)
  const desktop = getUiDispatcher(sequence, 'desktop')
  const push = getUiDispatcher(sequence, 'push')

  return {allMuted, desktop, push}
}
