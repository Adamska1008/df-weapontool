import { defineStore } from "pinia";
import { ref } from "vue";
import weaponsData from "../data/weapons.json";

export interface Weapon {
    id: string,
    name: string,
    type: string,
    velocity: number, // Muzzle velocity
    fireSpeed: number,
    damage: number,
    armorDamage: number,
    ranges: number[], // The actual damage under ranges[i] should be multiplied by decays[i]
    decays: number[], // Its length is always one larger than ranges
    availableAccessories: number[]
}

export interface WeaponSetting {
    id: string,
    weapon: Weapon,
    bulletLevel: number,
    barrel: number | null,
    gasComp: number | null,
    muzzle: number | null,
}

export const defineWeaponStore = defineStore("weapon", () => {
    const weaponList = ref<Weapon[]>(weaponsData as Weapon[])

    const weaponIdMap = new Map<string, number>()

    const findWeaponById = (id: string) => {
        const windex = weaponIdMap.get(id)
        if (windex != undefined) {
            return weaponList.value[windex]
        }
        for (const [index, weapon] of weaponList.value.entries()) {
            if (weapon.id == id) {
                weaponIdMap.set(id, index)
                return weapon
            }
        }
    }

    return { weaponList, findWeaponById }
})