import { createRouter, createWebHashHistory } from "vue-router";
import OverviewView from "../views/OverviewView.vue";
import DevicesView from "../views/DevicesView.vue";

const routes = [
  {
    path: "/",
    name: "Overview",
    component: OverviewView,
  },
  {
    path: "/devices",
    name: "DevicesGrid",
    component: DevicesView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
