import { defineStore } from "pinia";
import { ref } from "vue";

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
}


export const defineWeaponStore = defineStore("weapon", () => {
    const weaponList = ref<Weapon[]>([
        {
            id: "1", name: "腾龙突击步枪", type: "gunRifle",
            velocity: 575,
            fireSpeed: 706,
            damage: 35,
            armorDamage: 38,
            ranges: [35, 62],
            decays: [1, 0.9, 0.7]
        },
        {
            id: "2", name: "AKM突击步枪", type: "gunRifle",
            velocity: 525,
            fireSpeed: 600,
            damage: 40,
            armorDamage: 42,
            ranges: [40, 70],
            decays: [1, 0.85, 0.7]
        }
    ])

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