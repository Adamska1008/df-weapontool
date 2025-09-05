import { defineStore } from "pinia"
import accessoriesData from "../data/accessories.json"

export type SuppressorRangeBoost = 0.18 | 0.24
export type BarrelRangeBoost = 0.06 | 0.08 | 0.18 | 0.3 | 0.36

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

    const accessoryMap = new Map<number, Accessory>(
        (accessoriesData as Accessory[]).map(acc => [acc.id, acc])
    )


    const findAccessoryById = (id: number) => {
        return accessoryMap.get(id)
    }

    return { accessoryMap, findAccessoryById }
})