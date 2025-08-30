
// damageReduction[i][j] means damage from level-i bullets to level-j armor
export const damageReduction: number[][] = [
    [],
    [0, 0.6, 0.6, 0.4, 0.3, 0.2, 0.2],
    [0, 0.7, 0.7, 0.7, 0.5, 0.4, 0.3],
    [0, 0.9, 0.9, 0.9, 0.9, 0.5, 0.4],
    [0, 1, 1, 1, 1, 1, 0.6],
    [0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1],
    [0, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
    [0, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1], // For AWM
]


/**
 * 
 * @param bullets bullets level
 * @param armor armor level
 */
export function calcArmorRatio(bullets: number, armor: number): number {
    if (bullets > armor + 1) {
        return 0
    } else if (bullets == armor + 1) {
        return 0.25
    } else if (bullets == armor) {
        return 0.5
    } else {
        return 1
    }
}

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
export function calcBulletsToKills(dmg: number, armorDmg: number, armorHp: number, armorRatio: number, dmgReduction: number, hp: number): number {
    if (hp <= 0) {
        return 0
    }
    if (armorHp == 0) { // rounding up
        return (hp + dmg - 1) / dmg
    }
    if (armorHp < armorDmg) { // kind of complex
        const bodyHpLoss = (armorHp / (armorDmg * armorRatio)) * (1 - dmgReduction) * dmg + (1 - armorHp / (armorDmg * armorRatio)) * dmg
        return calcBulletsToKills(dmg, armorDmg, 0, armorRatio, dmgReduction, hp - bodyHpLoss) + 1
    }
    // if (armorHp >= armorDmg) {
    const armorHpLossPer = armorDmg * armorRatio
    const hpLossPer = (1 - dmgReduction) * dmg
    const armorHits = armorHp / armorHpLossPer
    const bodyHits = hp / hpLossPer
    if (bodyHits <= armorHits) {
        return (hp + hpLossPer - 1) / hpLossPer
    }
    return calcBulletsToKills(dmg, armorDmg, armorHp - armorHits * armorHpLossPer, armorRatio, dmgReduction, hp - bodyHits * hpLossPer) + armorHits
    // }
}