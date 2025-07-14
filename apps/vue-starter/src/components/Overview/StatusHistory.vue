<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onUnmounted } from "vue";
import { themeSwitcher } from "@siemens/ix";
import { IxCard, IxCardContent, IxTypography } from "@siemens/ix-vue";
import { registerTheme, getComputedCSSProperty } from "@siemens/ix-echarts";
import VueECharts from "vue-echarts";
import * as echarts from "echarts/core";
import * as charts from "echarts/charts";
import * as components from "echarts/components";
import * as renderer from "echarts/renderers";
import { type EChartsOption } from "echarts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const chartRef = ref();
const theme = ref(themeSwitcher.getCurrentTheme());

registerTheme(echarts);

echarts.use([
  components.TooltipComponent,
  components.LegendComponent,
  components.GridComponent,
  components.MarkLineComponent,
  charts.LineChart,
  charts.BarChart,
  renderer.CanvasRenderer,
]);

function getSeriesData() {
  return {
    seriesOnline: {
      name: "Online",
      color: [getComputedCSSProperty("color-success")],
      data: [
        { value: 60 },
        { value: 75 },
        { value: 100 },
        { value: 60 },
        { value: 75 },
        { value: 60 },
      ],
    },
    seriesOffline: {
      name: "Offline",
      color: [getComputedCSSProperty("color-neutral")],
      data: [
        { value: -30 },
        { value: -62 },
        { value: -25 },
        { value: -61 },
        { value: -99 },
        { value: -60 },
      ],
    },
    seriesErrors: {
      name: "Errors",
      color: getComputedCSSProperty("color-alarm"),
      data: [
        { value: 0 },
        { value: 17 },
        { value: -39 },
        { value: -60 },
        { value: -20 },
        { value: -2 },
      ],
    },
    seriesMaintenance: {
      name: "Maintenance",
      color: getComputedCSSProperty("color-warning"),
      data: [
        { value: 0 },
        { value: 2 },
        { value: -90 },
        { value: -85 },
        { value: -3 },
        { value: -1 },
      ],
    },
  };
}

function getOption(): EChartsOption {
  const { seriesOnline, seriesOffline, seriesErrors, seriesMaintenance } = getSeriesData();
  
  return {
    grid: {
      top: 10,
      bottom: 85,
      left: 40,
      right: 10,
    },
    legend: {
      orient: "horizontal",
      icon: "rect",
      left: "1",
      bottom: -0,
    },
    xAxis: {
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      boundaryGap: false,
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      splitLine: {
        show: true,
      },
    },
    series: [
      {
        type: "line",
        ...seriesOnline,
      },
      {
        type: "line",
        ...seriesMaintenance,
      },
      {
        type: "line",
        ...seriesErrors,
      },
      {
        type: "line",
        ...seriesOffline,
      },
    ],
  };
}

const lineChartOption = ref<EChartsOption>(getOption());

onMounted(async () => {
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 100));
  updateChartOptions();
  
  const handleResize = () => {
    if (chartRef.value) {
      chartRef.value.resize();
    }
  };
  
  window.addEventListener("resize", handleResize);
  
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});

function updateChartOptions() {
  lineChartOption.value = getOption();
  
  nextTick(() => {
    if (chartRef.value) {
      chartRef.value.resize();
    }
  });
}

watch(theme, () => {
  updateChartOptions();
});

themeSwitcher.themeChanged.on((newTheme: string) => {
  theme.value = newTheme;
});
</script>

<template>
  <IxCard class="status-history">
    <IxCardContent>
      <IxTypography format="label" bold>{{ t('status-history.title') }}</IxTypography>
      <VueECharts
        ref="chartRef"
        class="charts"
        :theme="theme"
        :option="lineChartOption"
        autoresize
        :init-options="{ renderer: 'canvas' }"
      />
    </IxCardContent>
  </IxCard>
</template>

<style scoped>
.status-history {
  height: 21rem;
  min-height: 21rem;
  max-height: 21rem;
}

.charts {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 1rem;
}
</style>
