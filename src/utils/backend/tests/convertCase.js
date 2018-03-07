import expect from 'expect.js'
import {toCamel, toSnake} from '../convertCase'

describe('convertCase', () => {
  describe('toSnake', () => {
    it('should convert flat object', () => {
      expect(toSnake({aA: 1})).to.eql({a_a: 1})
    })

    it('should convert nested object', () => {
      expect(toSnake({aA: {aB: 2}})).to.eql({a_a: {a_b: 2}})
    })

    it('should convert array with nested object', () => {
      expect(toSnake([{aA: {aB: 2}}])).to.eql([{a_a: {a_b: 2}}])
    })

    it('should convert object with array with nested object', () => {
      expect(toSnake({aA: [{aA: 1}]})).to.eql({a_a: [{a_a: 1}]})
    })
  })

  describe('toCamel', () => {
    it('should convert flat object', () => {
      expect(toCamel({a_a: 1})).to.eql({aA: 1})
    })

    it('should convert nested object', () => {
      expect(toCamel({a_a: {a_b: 2}})).to.eql({aA: {aB: 2}})
    })

    it('should convert array with nested object', () => {
      expect(toCamel([{a_a: {a_b: 2}}])).to.eql([{aA: {aB: 2}}])
    })

    it('should convert object with array with nested object', () => {
      expect(toCamel({a_a: [{a_a: 1}]})).to.eql({aA: [{aA: 1}]})
    })
  })
})
