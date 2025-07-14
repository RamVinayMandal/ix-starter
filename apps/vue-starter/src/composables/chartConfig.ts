/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getComputedCSSProperty } from "@siemens/ix-echarts";

export const CHART_CONSTANTS = {
  DIMENSIONS: {
    height: '21rem',
    minHeight: '21rem',
    maxHeight: '21rem',
  },
  GRID: {
    STATUS_HISTORY: {
      top: 10,
      bottom: 85,
      left: 40,
      right: 10,
    },
    DEVICE_RANGE: {
      top: 45,
      bottom: 85,
    },
  },
  RENDERER: 'canvas' as const,
} as const;

export const getStatusHistoryData = () => ({
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as string[],
  series: {
    online: { 
      name: "Online", 
      colorKey: "color-success" as const,
      data: [60, 75, 100, 60, 75, 60] as number[]
    },
    maintenance: { 
      name: "Maintenance", 
      colorKey: "color-warning" as const,
      data: [0, 2, -90, -85, -3, -1] as number[]
    },
    errors: { 
      name: "Errors", 
      colorKey: "color-alarm" as const,
      data: [0, 17, -39, -60, -20, -2] as number[]
    },
    offline: { 
      name: "Offline", 
      colorKey: "color-neutral" as const,
      data: [-30, -62, -25, -61, -99, -60] as number[]
    },
  }
});

export const createLineSeriesConfig = (seriesData: ReturnType<typeof getStatusHistoryData>['series'][keyof ReturnType<typeof getStatusHistoryData>['series']]) => ({
  type: "line" as const,
  name: seriesData.name,
  color: getComputedCSSProperty(seriesData.colorKey),
  data: seriesData.data,
});
