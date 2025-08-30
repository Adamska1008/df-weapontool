<template>
  <h1>ttk工具</h1>
  <div>
    <p>
      添加武器
    </p>
    <select v-model="selectedWeapon">
      <option v-for="weapon in weaponList" :key="weapon.id" :value="weapon.id">{{ weapon.name }}</option>
    </select>
    <button @click="addWeapon">添加</button>
  </div>
  <div>
    <p>武器信息与配置</p>
    <div v-for="setting in selectedWeapons" :key="setting.id">
      <p>{{ setting.weapon.name }}</p>
      <select v-model="setting.bulletLevel">
        <option v-for="level in [0, 1, 2, 3, 4, 5]" :key="level" :value="level">
          子弹等级 {{ level }}
        </option>
      </select>
    </div>
  </div>
  <div>
    <p>靶子配置</p>
    护甲等级
    <select v-model="targetArmor">
      <option v-for="value in [0, 1, 2, 3, 4, 5]" :key="value" :value="value">{{ value }}</option>
    </select>
    护甲Hp
    <input v-model="armorHp"></input>
  </div>
  <div>
    <p>ttk折线统计图</p>
  </div>

</template>


<script setup lang="ts">
import { ref } from 'vue';
import { defineWeaponStore } from './stores/weapon';
import { storeToRefs } from 'pinia';
import type { WeaponSetting } from './stores/weapon';
import { v4 as uuidv4 } from 'uuid';

const weaponStore = defineWeaponStore()
const { weaponList } = storeToRefs(weaponStore)

const selectedWeapon = ref("1")

const selectedWeapons = ref<WeaponSetting[]>([])

const targetArmor = ref(0)
const armorHp = ref(0)

const addWeapon = () => {
  console.log(selectedWeapon.value)
  const weapon = weaponStore.findWeaponById(selectedWeapon.value)
  if (weapon == undefined) {
    return // should not execute 
  }
  const setting: WeaponSetting = { id: uuidv4(), weapon: weapon, bulletLevel: 0 }

  if (selectedWeapons.value.find((w) => w.id == weapon.id) != undefined) {
    return
  }
  selectedWeapons.value.push(setting)
}

const ttkCalc = (s: WeaponSetting, dis: number) => {
  // ttk = (60 / RPM) * (ShotsToKill - 1) * 1000
  // ShotsToKill = TargetHp / (BaseDmg * HitboxRatio * RangeMultiplier * ArmorReduction)

}

</script>
