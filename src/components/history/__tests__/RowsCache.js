import { equalPropsData } from '../RowsCache'

describe('equalPropsData', () => {
  it('should return true for two identical objects', () => {
    expect(equalPropsData({ a: 1 }, { a: 1 })).toBe(true)
  })

  it('should return false for two differents object', () => {
    expect(equalPropsData({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('should filter out functions return true for two objects with identical data', () => {
    expect(
      equalPropsData({ a: 1, b: () => null }, { a: 1, b: () => null }),
    ).toBe(true)
  })
})
