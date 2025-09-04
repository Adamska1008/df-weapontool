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
        <option v-for="level in [1, 2, 3, 4, 5]" :key="level" :value="level">
          子弹等级 {{ level }}
        </option>
      </select>
      <select v-model="setting.barrel">
        <option :value="null">无枪管</option>
        <option
          v-for="acc in setting.weapon.availableAccessories.filter(id => accessoryStore.findAccessoryById(id)?.type == 'barrel')"
          :key="acc" :value="acc">
          {{ accessoryStore.findAccessoryById(acc)?.name }}
        </option>
      </select>
      <select v-model="setting.gasComp">
        <option :value="null">无枪口</option>
        <option
          v-for="acc in setting.weapon.availableAccessories.filter(id => accessoryStore.findAccessoryById(id)?.type == 'muzzle')"
          :key="acc" :value="acc">
          {{ accessoryStore.findAccessoryById(acc)?.name }}
        </option>
      </select>
      <select v-model="setting.muzzle">
        <option :value="null">无导气</option>
        <option
          v-for="acc in setting.weapon.availableAccessories.filter(id => accessoryStore.findAccessoryById(id)?.type == 'gasComp')"
          :key="acc" :value="acc">
          {{ accessoryStore.findAccessoryById(acc)?.name }}
        </option>
      </select>
      <button @click="() => removeWeapon(setting.id)">删除</button>
    </div>
  </div>
  <div>
    <p>靶子配置</p>
    护甲等级
    <select v-model="targetArmor">
      <option v-for="value in [0, 1, 2, 3, 4, 5, 6]" :key="value" :value="value">{{ value }}</option>
    </select>
    <div v-if="targetArmor != 0">
      护甲Hp
      <input v-model="armorHp"></input>
    </div>
  </div>
  <div v-if="selectedWeapons.length > 0">
    <p>ttk折线统计图</p>
    <v-chart autoresize :option="option" style="height: 400px"> </v-chart>
  </div>

</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import { defineWeaponStore } from './stores/weapon';
import { storeToRefs } from 'pinia';
import type { WeaponSetting } from './stores/weapon';
import { defineAccessoryStore } from './stores/accessory';
import type { Accessory } from './stores/accessory';
import { v4 as uuidv4 } from 'uuid';
import { calcDmgReduction, calcBulletsToKills, armorRatio, distanceDecay } from './utils/ttk';

const weaponStore = defineWeaponStore()
const accessoryStore = defineAccessoryStore()
const { weaponList } = storeToRefs(weaponStore)

const selectedWeapon = ref("1")

const selectedWeapons = ref<WeaponSetting[]>([])

const targetArmor = ref(0)
const armorHp = ref(0)

const settingName = (w: WeaponSetting) => {
  return `${w.weapon.name} (Lv.${w.bulletLevel}) ${w.barrel != null ? accessoryStore.findAccessoryById(w.barrel)?.name : ''} ${w.gasComp != null ? accessoryStore.findAccessoryById(w.gasComp)?.name : ''} ${w.muzzle != null ? accessoryStore.findAccessoryById(w.muzzle)?.name : ''}`
}

const addWeapon = () => {
  console.log(selectedWeapon.value)
  const weapon = weaponStore.findWeaponById(selectedWeapon.value)
  if (weapon == undefined) {
    return // should not execute 
  }
  const setting: WeaponSetting = { id: uuidv4(), weapon: weapon, bulletLevel: 1, barrel: null, gasComp: null, muzzle: null }

  selectedWeapons.value.push(setting)
}

const removeWeapon = (id: string) => {
  selectedWeapons.value = selectedWeapons.value.filter((weapon) => weapon.id !== id)
}

const accessoryEffect = (setting: WeaponSetting) => {
  let finalDmg = setting.weapon.damage
  let finalArmorDmg = setting.weapon.armorDamage
  let finalRanges = [...setting.weapon.ranges]
  let finalFireSpeed = setting.weapon.fireSpeed
  const applyAccessory = (acc: Accessory | undefined) => {
    if (acc != undefined) {
      finalDmg += acc.damage
      finalArmorDmg += acc.armorDamage
      finalRanges = finalRanges.map((r) => r + (acc.distance))
      finalFireSpeed += acc.fireSpeed
    }
  }
  if (setting.barrel != null) {
    const acc = accessoryStore.findAccessoryById(setting.barrel)
    applyAccessory(acc)
  }
  if (setting.gasComp != null) {
    const acc = accessoryStore.findAccessoryById(setting.gasComp)
    applyAccessory(acc)
  }
  if (setting.muzzle != null) {
    const acc = accessoryStore.findAccessoryById(setting.muzzle)
    applyAccessory(acc)
  }
  return [finalDmg, finalArmorDmg, finalRanges, finalFireSpeed] as const
}

const ttkCalc = (s: WeaponSetting, dis: number) => {
  // ttk = (60 / RPM) * (ShotsToKill - 1) * 1000 ms
  const dmgReduction = calcDmgReduction(s.bulletLevel, targetArmor.value)
  if (targetArmor.value == 0) {
    armorHp.value = 0
  }
  const [dmg, armorDmg, ranges, fireSpeed] = accessoryEffect(s)
  const [decayedDmg, decayedArmorDmg] = distanceDecay(dmg, armorDmg, dis, s.weapon.decays, ranges)
  const shotsToKill = calcBulletsToKills(decayedDmg, decayedArmorDmg, armorHp.value, armorRatio[s.bulletLevel][targetArmor.value], dmgReduction, 100)
  return (60 / fireSpeed) * (shotsToKill - 1) * 1000
}

const option = computed(() => ({
  legend: {
    data: selectedWeapons.value.map((s) => settingName(s)),
    show: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      let result = params[0].name + 'm<br/>'
      params.forEach((param: any) => {
        result += `${param.marker} ${param.seriesName}: ${Math.round(param.value)}ms<br/>`
      })
      return result
    }
  },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 100 }, (_, i) => i.toString())
  },
  yAxis: {
    type: 'value'
  },
  series: selectedWeapons.value.map((s) => ({
    name: settingName(s),
    type: 'line',
    data: Array.from({ length: 100 }, (_, i) => ttkCalc(s, i)),
    emphasis: {
      focus: 'series'
    }
  })),
}))

</script>
