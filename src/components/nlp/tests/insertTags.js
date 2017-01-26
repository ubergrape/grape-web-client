import expect from 'expect.js'
import insertTags from '../insertTags'
import tags from '../tags'

const text = 'can you please call me today under 0664 1234567'
const data = [
/*
  {
    textEnd: 47,
    type: 'lang',
    name: 'en',
    textStart: 0
  },
  {
    textEnd: 47,
    type: 'speechact',
    name: "todo",
    textStart: 0
  },
  {
    textEnd: 47,
    type: 'speechact',
    name: "question (yn)",
    textStart: 0
  },
*/
  {
    textEnd: 47,
    type: 'simple',
    name: 'phone number',
    textStart: 35
  },
  {
    textEnd: 28,
    textStart: 23,
    type: 'timeframe',
    name: 'todo',
    timeframeStart: '2016-01-20T00:00:00',
    timeframeEnd: '2016-01-21T00:00:00'
  }
]

describe('nlp: insertTags', () => {
  it('should detect local links to chat', () => {
    const withTags = insertTags(text, data)
    expect(withTags).to.be(
      `can you please call me ${tags[0]}today${tags[0]} under ${tags[1]}0664 1234567${tags[1]}`
    )
  })
})
