import { describe, expect, it } from 'vitest'
import { calcBulletsToKills } from '../src/utils/ttk.js'

describe('ttk', () => {
  it('should handle the case when there is no armor', () => {
    expect(calcBulletsToKills(40, 42, 0, 1.10, 0.5, 100)).toEqual(3)
    expect(calcBulletsToKills(29, 42, 0, 1.10, 0.5, 100)).toEqual(4)
    expect(calcBulletsToKills(24, 42, 0, 1.10, 0.5, 100)).toEqual(5)
  })

  it('should handle same level armor and bullets', () => {
    expect(calcBulletsToKills(40, 42, 110, 1, 0.5, 100)).toEqual(4)
    expect(calcBulletsToKills(36, 35, 110, 1, 0.5, 100)).toEqual(5)

  })

  it('should handle higher level armor than bullets', () => {
    expect(calcBulletsToKills(36, 35, 110, 0.9, 1, 100)).toEqual(7)
    expect(calcBulletsToKills(36, 48, 110, 0.9, 1, 100)).toEqual(6)
  })

  it('should handle lower level armor than bullets', () => {
    expect(calcBulletsToKills(35, 40, 85, 1, 0.25, 100)).toEqual(4)
    expect(calcBulletsToKills(36, 48, 85, 1, 0.25, 100)).toEqual(4)
  })
})

