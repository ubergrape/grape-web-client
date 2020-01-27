import { noop, find, filter, every } from 'lodash'
import warning from 'warning'

import { transports, dispatchers } from '../../constants/notification'

function createSequence(value, predicate = noop) {
  return transports.reduce((sequence, transport) => {
    dispatchers.all.forEach(dispatcher => {
      const setting = {
        transport,
        dispatcher,
        active: value,
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

// Create a sequence which enables all mentions.
function createAnyMentionSequence(transport) {
  const sequence = createSequence(
    false,
    setting => setting.transport === transport,
  )
  return sequence.map(setting => {
    if (dispatchers.mentions.includes(setting.dispatcher)) {
      return { ...setting, active: true }
    }

    return setting
  })
}

// Create a sequence which enables direct mentions only.
function createDirectMentionSequence(transport) {
  const sequence = createSequence(
    false,
    setting => setting.transport === transport,
  )
  return sequence.map(setting => {
    if (setting.dispatcher === 'mention') {
      return { ...setting, active: true }
    }

    return setting
  })
}

// Returns a sequence with settings for a given transport and
// applies default value.
function createAllMessagesSeqence(transport, value) {
  return createSequence(value, setting => setting.transport === transport)
}

// Returns a sequence for a given transport and setting.
export function settingsToSequence({ transport, setting, value }) {
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

// Converts a sequence to settings object.
export function sequenceToSettings(sequence) {
  // Returns true if all settings in the sequence are inactive.
  const isInactive = seq => every(seq, { active: false })

  // Returns true if all settings in the sequence are active.
  const isActive = seq => every(seq, { active: true })

  // Returns true if all settings in the sequence are inherited.
  const isInherit = seq => every(seq, { inherit: true })

  // Returns true if sequence has all kinds of mentions.
  const isAnyMention = seq =>
    Boolean(
      find(seq, { dispatcher: 'mention', active: true }) &&
        find(seq, { dispatcher: 'group_mention', active: true }),
    )

  // Returns true if sequence has only direct mention.
  const isDirectMention = seq =>
    Boolean(
      find(seq, { dispatcher: 'mention', active: true }) &&
        !find(seq, { dispatcher: 'group_mention', active: true }),
    )

  const getValue = (seq, transport) => {
    const transportSeq = filter(seq, { transport })

    if (isInherit(transportSeq)) return 'inherit'
    if (isActive(transportSeq)) return 'all'
    if (isInactive(transportSeq)) return 'off'
    if (isAnyMention(transportSeq)) return 'anyMention'
    if (isDirectMention(transportSeq)) return 'directMention'

    warning(
      false,
      'Bad notification settings: \n\r %s',
      JSON.stringify(sequence, null, 2),
    )

    return 'inherit'
  }

  const desktop = getValue(sequence, 'desktop')
  const push = getValue(sequence, 'push')

  return { desktop, push }
}
