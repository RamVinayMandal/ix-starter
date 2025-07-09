<script setup lang="ts">
import { ref } from "vue";
import { themeSwitcher } from "@siemens/ix";
import { IxCard, IxCardContent, IxIcon, IxTypography } from "@siemens/ix-vue";
import { registerTheme, getComputedCSSProperty } from "@siemens/ix-echarts";
import VueECharts from "vue-echarts";
import * as echarts from "echarts/core";
import * as charts from "echarts/charts";
import * as components from "echarts/components";
import * as renderer from "echarts/renderers";
import { type EChartsOption } from "echarts";
import { useI18n } from "vue-i18n";

registerTheme(echarts);

const theme = ref(themeSwitcher.getCurrentTheme());

themeSwitcher.themeChanged.on((newTheme: string) => {
  theme.value = newTheme;
  prepareChartOptions();
});

echarts.use([
  components.TooltipComponent,
  components.LegendComponent,
  components.GridComponent,
  components.MarkLineComponent,
  charts.BarChart,
  renderer.CanvasRenderer,
]);

let barChartOption: EChartsOption;
prepareChartOptions();

function prepareChartOptions() {
  barChartOption = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      icon: "rect",
      bottom: "0",
      left: "0",
    },
    xAxis: {
      type: "value",
      name: "Devices",
      nameLocation: "middle",
      nameGap: 25,
    },
    yAxis: {
      type: "category",
      name: "IP Range",
      nameLocation: "end",
    },
    grid: {
      top: 45,
      bottom: 85,
    },
    series: [
      {
        name: "Online",
        data: [
          [16, "172.x"],
          [11, "192.x"],
          [3, "20.x"],
          [1, "10.x"],
        ],
        type: "bar",
        stack: "x",
        color: getComputedCSSProperty("color-success"),
      },
      {
        name: "Maintenance",
        data: [[2, "172.x"]],
        type: "bar",
        stack: "x",
        color: getComputedCSSProperty("color-warning"),
      },
      {
        name: "Error",
        data: [[1, "192.x"]],
        type: "bar",
        stack: "x",
        color: getComputedCSSProperty("color-alarm"),
      },
      {
        name: "Offline",
        data: [[1, "192.x"]],
        type: "bar",
        stack: "x",
        color: getComputedCSSProperty("color-neutral"),
      },
    ],
  };
}
</script>

<template>
  <IxCard class="device-range">
    <IxCardContent>
      <IxTypography format="label" bold>Device status</IxTypography>
      <VueECharts
        class="charts"
        :theme="theme"
        :option="barChartOption"
        autoresize
      />
    </IxCardContent>
  </IxCard>
</template>

<style scoped>
.device-range {
  height: 21rem;
  min-height: 21rem;
  max-height: 21rem;
}

charts {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
