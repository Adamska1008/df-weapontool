import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.component('v-chart', ECharts)
app.mount('#app')
