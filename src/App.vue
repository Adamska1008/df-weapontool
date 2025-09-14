<template>
  <div class="app-container">
    <h1 class="title">TTK工具</h1>

    <div class="section">
      <div class="weapon-selection">
        <p>添加武器</p>
        <select v-model="selectedWeapon">
          <option v-for="weapon in weaponList" :key="weapon.id" :value="weapon.id">{{ weapon.name }}</option>
        </select>
        <button @click="addWeapon">添加</button>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">武器信息与配置</h2>
      <div class="weapon-configurations">
        <div v-for="setting in selectedWeapons" :key="setting.id" class="weapon-card">
          <div class="weapon-card-header">
            <h3 class="weapon-name">{{ setting.weapon.name }}</h3>
            <button @click="() => removeWeapon(setting.id)" class="remove-button">删除</button>
          </div>
          <div class="weapon-card-content">
            <div class="bullet-level-select">
              <label>子弹等级</label>
              <select v-model="setting.bulletLevel">
                <option v-for="level in setting.weapon.bulletLevels" :key="level" :value="level">
                  等级 {{ level }}
                </option>
                <option v-if="setting.weapon.meatAmmoAllowed" value="meat">
                  肉弹
                </option>
              </select>
            </div>

            <div class="accessory-select">
              <label>枪管</label>
              <select v-model="setting.barrel">
                <option :value="null">无枪管</option>
                <option
                  v-for="acc in setting.weapon.availableAccessories.filter(id => accessoryStore.findAccessoryById(id)?.type === 'barrel')"
                  :key="acc" :value="acc">
                  {{ accessoryStore.findAccessoryById(acc)?.name }}
                </option>
              </select>
            </div>

            <div class="accessory-select">
              <label>枪口</label>
              <select v-model="setting.gasComp">
                <option :value="null">无枪口</option>
                <option
                  v-for="acc in setting.weapon.availableAccessories.filter(id => accessoryStore.findAccessoryById(id)?.type === 'muzzle')"
                  :key="acc" :value="acc">
                  {{ accessoryStore.findAccessoryById(acc)?.name }}
                </option>
              </select>
            </div>

            <div class="accessory-select">
              <label>导气</label>
              <select v-model="setting.muzzle">
                <option :value="null">无导气</option>
                <option
                  v-for="acc in setting.weapon.availableAccessories.filter(id => accessoryStore.findAccessoryById(id)?.type === 'gasComp')"
                  :key="acc" :value="acc">
                  {{ accessoryStore.findAccessoryById(acc)?.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section target-config">
      <h2 class="section-title">靶子配置</h2>
      <div class="target-config-row">
        <label>护甲等级</label>
        <select v-model="targetArmor">
          <option v-for="value in [0, 1, 2, 3, 4, 5, 6]" :key="value" :value="value">{{ value }}</option>
        </select>
      </div>
      <div v-if="targetArmor !== 0" class="target-config-row">
        <label>护甲HP</label>
        <input v-model="armorHp" type="number" :min="0" />
      </div>
    </div>

    <div v-if="selectedWeapons.length > 0" class="section chart-container">
      <h2 class="chart-title">TTK折线统计图</h2>
      <v-chart autoresize :option="option" style="height: 400px"> </v-chart>
    </div>
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
import { calcDmgReduction, calcBulletsToKills, distanceDecay, createBulletInstance } from './utils/ttk';

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
  const setting: WeaponSetting = { id: uuidv4(), weapon: weapon, bulletLevel: weapon.bulletLevels[0], barrel: null, gasComp: null, muzzle: null }

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
      finalRanges = finalRanges.map((r) => Math.round(r * (1 + acc.distance))) // TODO: not sure if it's round or ceil or floor
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
  const bulletLevel = s.bulletLevel === "meat" ? 3 : s.bulletLevel
  const dmgReduction = calcDmgReduction(bulletLevel, targetArmor.value)
  if (targetArmor.value == 0) {
    armorHp.value = 0
  }
  const [dmg, armorDmg, ranges, fireSpeed] = accessoryEffect(s)
  const [decayedDmg, decayedArmorDmg] = distanceDecay(dmg, armorDmg, dis, s.weapon.decays, ranges)
  const bullet = createBulletInstance(s.bulletLevel === "meat" ? "MeatBullet" : "Normal", bulletLevel, s.weapon)
  const shotsToKill = calcBulletsToKills(decayedDmg * bullet.damageRatio, decayedArmorDmg, armorHp.value, bullet.armorDamageRatio[targetArmor.value], dmgReduction, 100)
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

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.weapon-selection {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.weapon-selection p {
  margin: 0;
  font-weight: bold;
  color: #2c3e50;
}

.weapon-selection select {
  padding: 8px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  min-width: 200px;
}

.weapon-selection button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.weapon-selection button:hover {
  background-color: #2980b9;
}

.weapon-configurations {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weapon-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  border-left: 4px solid #3498db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.weapon-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.weapon-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.weapon-card-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.accessory-select,
.bullet-level-select {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.accessory-select label,
.bullet-level-select label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.accessory-select select,
.bullet-level-select select {
  padding: 6px 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background-color: white;
  font-size: 0.95rem;
}

.remove-button {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  align-self: flex-end;
}

.remove-button:hover {
  background-color: #c0392b;
}

.target-config {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.target-config-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.target-config label {
  font-weight: bold;
  color: #2c3e50;
  min-width: 80px;
}

.target-config select,
.target-config input {
  padding: 8px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  min-width: 150px;
}

.chart-container {
  margin-top: 20px;
}

.chart-title {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 15px;
  text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .section {
    padding: 15px;
  }

  .weapon-card-content {
    grid-template-columns: 1fr;
  }

  .weapon-selection {
    flex-direction: column;
    align-items: flex-start;
  }

  .target-config-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
