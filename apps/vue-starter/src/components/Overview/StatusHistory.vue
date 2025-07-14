<script setup lang="ts">
import { ref, computed } from "vue";
import { themeSwitcher } from "@siemens/ix";
import { IxCard, IxCardContent, IxTypography } from "@siemens/ix-vue";
import { registerTheme } from "@siemens/ix-echarts";
import VueECharts from "vue-echarts";
import * as echarts from "echarts/core";
import * as charts from "echarts/charts";
import * as components from "echarts/components";
import * as renderer from "echarts/renderers";
import { type EChartsOption } from "echarts";
import { useI18n } from "vue-i18n";
import { useChart } from "../../composables/useChart";
import { CHART_CONSTANTS, getStatusHistoryData, createLineSeriesConfig } from "../../composables/chartConfig";

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

const { t } = useI18n();
const chartRef = ref();
const theme = ref(themeSwitcher.getCurrentTheme());

const chartData = getStatusHistoryData();

const chartOption = computed((): EChartsOption => ({
  grid: CHART_CONSTANTS.GRID.STATUS_HISTORY,
  legend: {
    orient: "horizontal" as const,
    icon: "rect" as const,
    left: "1",
    bottom: 0,
  },
  xAxis: {
    data: chartData.months,
    boundaryGap: false,
    splitLine: { show: true },
  },
  yAxis: {
    splitLine: { show: true },
  },
  series: Object.values(chartData.series).map(createLineSeriesConfig),
}));

const initializeChart = async () => {};

useChart({
  chartRef,
  initializeChart,
  optionRef: chartOption
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
        :option="chartOption"
        autoresize
        :init-options="{ renderer: CHART_CONSTANTS.RENDERER }"
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
