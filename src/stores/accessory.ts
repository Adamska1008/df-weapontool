import { defineStore } from "pinia"

export type SuppressorRangeBoost = 0.18 | 0.24
export type BarrelRangeBoost = 0.08 | 0.18 | 0.3 | 0.36

export type AccessoryType = 'barrel' | 'muzzle' | 'gasComp'

export interface Accessory {
    id: number
    name: string
    type: AccessoryType
    distance: number // multiplier
    damage: number
    armorDamage: number
    fireSpeed: number
}

export const defineAccessoryStore = defineStore("accessory", () => {

    const accessoryMap = new Map<number, Accessory>([
        [1, { id: 1, name: "新式蛟龙战术长枪管", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [2, { id: 2, name: "新式腾龙稳固导气罐", type: "gasComp", distance: 0, damage: 0, armorDamage: 0, fireSpeed: -46 }],
        [3, { id: 3, name: "新式腾龙高速导气罐", type: "gasComp", distance: 0, damage: 0, armorDamage: 0, fireSpeed: 53 }],
        [4, { id: 4, name: "先进多口径消音器", type: "muzzle", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [5, { id: 5, name: "死寂消音器", type: "muzzle", distance: 0.24, damage: 0, armorDamage: 0, fireSpeed: -92 }],
        [6, { id: 6, name: "轻语战术消音器", type: "muzzle", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [7, { id: 7, name: "AK勇火消音器", type: "muzzle", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [8, { id: 8, name: "AKM实用长枪管组合", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [9, { id: 9, name: "AKM超然长枪管组合", type: "barrel", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [10, { id: 10, name: "AKM海狸长枪管组合", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [11, { id: 11, name: "PKM地平线重枪管", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [12, { id: 12, name: "AR特勤一体消音组合", type: "barrel", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [13, { id: 13, name: "AR战壕标准枪管组合", type: "barrel", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [14, { id: 14, name: "AR加百列长枪管组合", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [15, { id: 15, name: "AR碳纤维长枪管组合", type: "barrel", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [16, { id: 16, name: "G3平台神射枪管组合", type: "barrel", distance: 0.36, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [17, { id: 17, name: "G3加强长枪管组合", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [18, { id: 18, name: "G3守卫标准枪管组合", type: "barrel", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [19, { id: 19, name: "勇士海狸枪管", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [20, { id: 20, name: "冲锋枪回声消音器", type: "muzzle", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [21, { id: 21, name: "SMG45实用重枪管", type: "barrel", distance: 0.08, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [22, { id: 22, name: "SMG45裂变长枪管", type: "barrel", distance: 0.18, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [23, { id: 23, name: "SMG45长弩超长枪管", type: "barrel", distance: 0.3, damage: 0, armorDamage: 0, fireSpeed: 0 }],
    ])


    const findAccessoryById = (id: number) => {
        return accessoryMap.get(id)
    }

    return { accessoryMap, findAccessoryById }
})