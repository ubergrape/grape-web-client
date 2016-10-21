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
  const sequence = createSequence(false, setting => setting.transport === transport)
  return sequence.map(setting => {
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

function createAllMessagesSeqence(transport, value) {
  return createSequence(value, setting => setting.transport === transport)
}

export function getSequence({transport, setting, value}) {
  if (transport === 'all' && setting === 'all') {
    return createSequence(value ? false : null)
  }

  switch (setting) {
    case 'inherit':
      return createResetSequence(transport)
    case 'all':
      return createAllMessagesSeqence(transport, true)
    case 'anyMention':
      return createAnyMentionSequence(transport)
    case 'directMention':
      return createDirectMentionSequence(transport)
    case 'off':
      return createAllMessagesSeqence(transport, false)
    default:
      return []
  }
}

export function getOptions(sequence) {
  // Returns true if all settings in the sequence are inactive.
  const isInactive = seq => every(seq, {active: false})

  // Returns true if all settings in the sequence are active.
  const isActive = seq => every(seq, {active: true})

  // Returns true if all settings in the sequence are inherited.
  const isInherit = seq => every(seq, {inherit: true})

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

  const getValue = (seq, transport) => {
    const transportSeq = filter(seq, {transport})

    if (isInherit(transportSeq)) return 'inherit'
    if (isActive(transportSeq)) return 'all'
    if (isInactive(transportSeq)) return 'off'
    if (isAnyMention(transportSeq)) return 'anyMention'
    if (isDirectMention(transportSeq)) return 'directMention'

    warning(false, 'Bad notification settings: \n\r %s', JSON.stringify(sequence, null, 2))

    return 'inherit'
  }

  const desktop = getValue(sequence, 'desktop')
  const push = getValue(sequence, 'push')

  return {desktop, push}
}
