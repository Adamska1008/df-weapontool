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
    <p>武器信息</p>
    <ul v-for="weapon in selectedWeapons" :key="weapon.id" :value="weapon.id">
      {{ weapon.name }}
    </ul>
  </div>
  <div>
    <p>ttk折线统计图</p>
  </div>

</template>


<script setup lang="ts">
import { ref } from 'vue';
import { defineWeaponStore } from './stores/weapon';
import { storeToRefs } from 'pinia';
import type { Weapon } from './stores/weapon';

const weaponStore = defineWeaponStore()
const { weaponList } = storeToRefs(weaponStore)

const selectedWeapon = ref("1")

const selectedWeapons = ref<Weapon[]>([])


const addWeapon = () => {
  console.log(selectedWeapon.value)
  const weapon = weaponStore.findWeaponById(selectedWeapon.value)
  if (weapon == undefined) {
    return // should not execute 
  }
  if (selectedWeapons.value.find((w) => w.id == weapon.id) != undefined) {
    return
  }
  selectedWeapons.value.push(weapon)
}

</script>
