import { toCamel, toSnake } from '../../convert-case'

describe('convert-case', () => {
  describe('toSnake', () => {
    it('should convert flat object', () => {
      expect(toSnake({ aA: 1 })).toEqual({ a_a: 1 })
    })

    it('should convert nested object', () => {
      expect(toSnake({ aA: { aB: 2 } })).toEqual({ a_a: { a_b: 2 } })
    })

    it('should convert array with nested object', () => {
      expect(toSnake([{ aA: { aB: 2 } }])).toEqual([{ a_a: { a_b: 2 } }])
    })

    it('should convert object with array with nested object', () => {
      expect(toSnake({ aA: [{ aA: 1 }] })).toEqual({ a_a: [{ a_a: 1 }] })
    })
  })

  describe('toCamel', () => {
    it('should convert flat object', () => {
      expect(toCamel({ a_a: 1 })).toEqual({ aA: 1 })
    })

    it('should convert nested object', () => {
      expect(toCamel({ a_a: { a_b: 2 } })).toEqual({ aA: { aB: 2 } })
    })

    it('should convert array with nested object', () => {
      expect(toCamel([{ a_a: { a_b: 2 } }])).toEqual([{ aA: { aB: 2 } }])
    })

    it('should convert object with array with nested object', () => {
      expect(toCamel({ a_a: [{ a_a: 1 }] })).toEqual({ aA: [{ aA: 1 }] })
    })
  })
})
