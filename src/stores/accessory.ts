import { defineStore } from "pinia"

export type AccessoryType = 'barrel' | 'muzzle' | 'gasComp'

export interface Accessory {
    id: number
    name: string
    type: AccessoryType
    distance: number
    damage: number
    armorDamage: number
    fireSpeed: number
}

export const defineAccessoryStore = defineStore("accessory", () => {

    const accessoryMap = new Map<number, Accessory>([
        [1, { id: 1, name: "新式蛟龙战术长枪管", type: "barrel", distance: 11, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [2, { id: 2, name: "新式腾龙稳固导气罐", type: "gasComp", distance: 0, damage: 0, armorDamage: 0, fireSpeed: -46 }],
        [3, { id: 3, name: "新式腾龙高速导气罐", type: "gasComp", distance: 0, damage: 0, armorDamage: 0, fireSpeed: 53 }],
        [4, { id: 4, name: "先进多口径消音器", type: "muzzle", distance: 6, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [5, { id: 5, name: "死寂消音器", type: "muzzle", distance: 8, damage: 0, armorDamage: 0, fireSpeed: -92 }],
        [6, { id: 6, name: "轻语战术消音器", type: "muzzle", distance: 6, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [7, { id: 7, name: "AK勇火消音器", type: "muzzle", distance: 7, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [8, { id: 8, name: "AKM实用长枪管组合", type: "barrel", distance: 12, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [9, { id: 9, name: "AKM超然长枪管组合", type: "barrel", distance: 7, damage: 0, armorDamage: 0, fireSpeed: 0 }],
        [10, { id: 10, name: "AKM海狸长枪管组合", type: "barrel", distance: 12, damage: 0, armorDamage: 0, fireSpeed: 0 }],
    ])


    const findAccessoryById = (id: number) => {
        return accessoryMap.get(id)
    }

    return { accessoryMap, findAccessoryById }
})