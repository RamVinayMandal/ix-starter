/*
 * SPDX-FileCopyrightText: 2025 Siemens AG
 * SPDX-License-Identifier: MIT
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */
import { test, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import IncidentHistory from "@/components/Overview/IncidentHistory.vue";
import '@testing-library/jest-dom'; // Import jest-dom matchers

test("add filter input", async () => {
  const { getByLabelText, getByTestId } = render(IncidentHistory);
  const filter = getByLabelText("Filter devices");
  expect(filter).toBeInTheDocument();
  expect(filter.className).toMatch(/hydrated/);

  await fireEvent.update(filter, "robo1-net-sw17");

  const items = getByTestId("incident-item");
  const itemsArr = Array.isArray(items) ? items : [items];
  expect(itemsArr).toHaveLength(1);
});
