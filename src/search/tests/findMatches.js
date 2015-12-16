import expect from 'expect.js'

import findMatches from '../findMatches'

describe('findMatches()', () => {
  it('should return single match', () => {
    const matches = findMatches('a', 'a')
    expect(matches.length).to.be(1)
    expect(matches[0].text).to.be('a')
    expect(matches[0].found).to.be.ok()
  })

  it('should return case insensitive match', () => {
    const matches = findMatches('a', 'A')
    expect(matches.length).to.be(1)
    expect(matches[0].text).to.be('a')
    expect(matches[0].found).to.be.ok()
  })

  it('should return word only match (0)', () => {
    const matches = findMatches('ab', 'a')
    expect(matches.length).to.be(1)
    expect(matches[0].text).to.be('ab')
    expect(matches[0].found).to.not.be.ok()
  })

  it('should return word only match (1)', () => {
    const matches = findMatches('ba', 'a')
    expect(matches.length).to.be(1)
    expect(matches[0].text).to.be('ba')
    expect(matches[0].found).to.not.be.ok()
  })

  it('should return word only match (2)', () => {
    const matches = findMatches('a,', 'a')
    expect(matches.length).to.be(2)
    expect(matches[0].text).to.be('a')
    expect(matches[0].found).to.be.ok()
    expect(matches[1].text).to.be(',')
    expect(matches[1].found).to.not.be.ok()
  })

  it('should return word only match (3)', () => {
    const matches = findMatches(',a', 'a')
    expect(matches.length).to.be(2)
    expect(matches[0].text).to.be(',')
    expect(matches[0].found).to.not.be.ok()
    expect(matches[1].text).to.be('a')
    expect(matches[1].found).to.be.ok()
  })

  it('should return multi match', () => {
    const matches = findMatches('a a', 'a')
    expect(matches.length).to.be(3)
    expect(matches[0].text).to.be('a')
    expect(matches[0].found).to.be.ok()
    expect(matches[1].text).to.be(' ')
    expect(matches[1].found).to.not.be.ok()
    expect(matches[2].text).to.be('a')
    expect(matches[2].found).to.be.ok()
  })

  it('should use multi search', () => {
    const matches = findMatches('a b', ['a', 'b'])
    expect(matches.length).to.be(3)
    expect(matches[0].text).to.be('a')
    expect(matches[0].found).to.be.ok()
    expect(matches[1].text).to.be(' ')
    expect(matches[1].found).to.not.be.ok()
    expect(matches[2].text).to.be('b')
    expect(matches[2].found).to.be.ok()
  })
})
