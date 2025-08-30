
const damageReduction: number[][] = [[]]


/**
 * 
 * @param dmg 
 * @param armorDmg 
 * @param armorHp 
 * @param armorRatio actualArmorDmg = armorDmg * armorRatio. For example, 5 -> 6 is 110% 
 * @param dmgReduction the damage reduction from the armor on the body. For example, 4 -> 4 is 50% (same level bullets and armor)
 * @param hp 
 * @returns 
 */
export function BulletsToKills(dmg: number, armorDmg: number, armorHp: number, armorRatio: number, dmgReduction: number, hp: number): number {
    if (hp <= 0) {
        return 0
    }
    if (armorHp == 0) { // rounding up
        return (hp + dmg - 1) / dmg
    }
    if (armorHp < armorDmg) { // kind of complex
        const bodyHpLoss = (armorHp / (armorDmg * armorRatio)) * (1 - dmgReduction) * dmg + (1 - armorHp / (armorDmg * armorRatio)) * dmg
        return BulletsToKills(dmg, armorDmg, 0, armorRatio, dmgReduction, hp - bodyHpLoss) + 1
    }
    // if (armorHp >= armorDmg) {
    const armorHpLossPer = armorDmg * armorRatio
    const hpLossPer = (1 - dmgReduction) * dmg
    const armorHits = armorHp / armorHpLossPer
    const bodyHits = hp / hpLossPer
    if (bodyHits <= armorHits) {
        return (hp + hpLossPer - 1) / hpLossPer
    }
    return BulletsToKills(dmg, armorDmg, armorHp - armorHits * armorHpLossPer, armorRatio, dmgReduction, hp - bodyHits * hpLossPer) + armorHits
    // }
}