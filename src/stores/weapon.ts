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
    const weaponList = ref<Weapon[]>([
        {
            id: "1", name: "腾龙突击步枪", type: "gunRifle",
            velocity: 575,
            fireSpeed: 706,
            damage: 35,
            armorDamage: 38,
            ranges: [35, 62, 0x7f7f7f7f],
            decays: [1, 0.9, 0.7],
            availableAccessories: [1, 2, 3, 4, 5, 6]
        },
        {
            id: "2", name: "AKM突击步枪", type: "gunRifle",
            velocity: 525,
            fireSpeed: 600,
            damage: 40,
            armorDamage: 42,
            ranges: [40, 70, 0x7f7f7f7f],
            decays: [1, 0.85, 0.7],
            availableAccessories: [4, 5, 6, 7, 8, 9, 10]
        },
        {
            id: "3", name: "PKM通用机枪", type: "machineGun",
            velocity: 630,
            fireSpeed: 669,
            damage: 45,
            armorDamage: 42,
            ranges: [40, 70, 0x7f7f7f7f],
            decays: [1, 0.85, 0.7],
            availableAccessories: [4, 5, 6, 7, 11]
        },
        {
            id: "4", name: "CAR-15突击步枪", type: "gunRifle",
            velocity: 575,
            fireSpeed: 632,
            damage: 27,
            armorDamage: 32,
            ranges: [40, 70, 0x7f7f7f7f],
            decays: [1, 0.85, 0.7],
            availableAccessories: [4, 5, 6, 12, 13, 14, 15]
        },
        {
            id: "5", name: "G3战斗步枪", type: "gunRifle",
            velocity: 630,
            fireSpeed: 533,
            damage: 39,
            armorDamage: 42,
            ranges: [55, 90, 0x7f7f7f7f],
            decays: [1, 0.9, 0.8],
            availableAccessories: [4, 5, 6, 16, 17, 18]
        },
        {
            id: "6", name: "勇士冲锋枪", type: "submachineGun",
            velocity: 500,
            fireSpeed: 700,
            damage: 36,
            armorDamage: 35,
            ranges: [20, 27, 40, 55, 0x7f7f7f7f],
            decays: [1, 0.75, 0.65, 0.55, 0.45],
            availableAccessories: [4, 5, 6, 19, 20]
        },
        {
            id: "7", name: "SMG-45冲锋枪", type: "submachineGun",
            velocity: 500,
            fireSpeed: 605,
            damage: 35,
            armorDamage: 40,
            ranges: [27, 54, 90],
            decays: [1, 0.75, 0.65, 0.55, 0x7f7f7f7f],
            availableAccessories: [4, 5, 6, 20, 21, 22, 23]
        },
        {
            id: "8", name: "UZI冲锋枪", type: "submachineGun",
            velocity: 450,
            fireSpeed: 780,
            damage: 28,
            armorDamage: 35,
            ranges: [20, 27, 40, 55, 0x7f7f7f7f],
            decays: [1, 0.75, 0.65, 0.55, 0.45],
            availableAccessories: [4, 5, 6, 20, 24, 25]
        },
        {
            id: "9", name: "QBZ95-1突击步枪", type: "gunRifle",
            velocity: 575,
            fireSpeed: 679,
            damage: 28,
            armorDamage: 42,
            ranges: [55, 90, 0x7f7f7f7f],
            decays: [1, 0.75, 0.65, 0.55, 0.45],
            availableAccessories: [4, 5, 6, 26, 27]
        },
        {
            id: "10", name: "AK-12突击步枪", type: "gunRifle",
            velocity: 575,
            fireSpeed: 735,
            damage: 29,
            armorDamage: 42,
            ranges: [40, 70, 0x7f7f7f7f],
            decays: [1, 0.9, 0.75],
            availableAccessories: [4, 5, 6, 7, 28]
        },
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