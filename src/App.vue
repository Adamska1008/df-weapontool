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
import { v4 as uuidv4 } from 'uuid';
import { calcDmgReduction, calcBulletsToKills, armorRatio, distanceDecay } from './utils/ttk';

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
  const setting: WeaponSetting = { id: uuidv4(), weapon: weapon, bulletLevel: 1 }

  if (selectedWeapons.value.find((w) => w.weapon.id == weapon.id) != undefined) {
    return
  }
  selectedWeapons.value.push(setting)
}

const ttkCalc = (s: WeaponSetting, dis: number) => {
  // ttk = (60 / RPM) * (ShotsToKill - 1) * 1000 ms
  const dmgReduction = calcDmgReduction(s.bulletLevel, targetArmor.value)
  if (targetArmor.value == 0) {
    armorHp.value = 0
  }
  const [dmg, armorDmg] = distanceDecay(s.weapon.damage, s.weapon.armorDamage, dis, s.weapon.decays, s.weapon.ranges)
  const shotsToKill = calcBulletsToKills(dmg, armorDmg, armorHp.value, armorRatio[s.bulletLevel][targetArmor.value], dmgReduction, 100)
  return (60 / s.weapon.fireSpeed) * (shotsToKill - 1) * 1000
}

const option = computed(() => ({
  legend: {
    data: selectedWeapons.value.map((s) => s.weapon.name),
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
    name: s.weapon.name,
    type: 'line',
    data: Array.from({ length: 100 }, (_, i) => ttkCalc(s, i)),
    emphasis: {
      focus: 'series'
    }
  })),
}))

</script>
