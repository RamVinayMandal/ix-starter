<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { themeSwitcher } from "@siemens/ix";
import { IxTypography, IxRadio, IxRadioGroup } from "@siemens/ix-vue";
import { useShowDemoMessage } from "../../helpers/demoMessage";

import brand from "../../assets/images/brand.png";
import classic from "../../assets/images/classic.png";
import styles from "./styles.module.css";

const { t, locale } = useI18n();
const showDemoMessage = useShowDemoMessage();

type Theme = "brand" | "classic";
type Language = "en" | "de";

const themes = [
  { name: "Siemens Brand", value: "brand" as Theme, image: brand },
  { name: "Classic", value: "classic" as Theme, image: classic },
] as const;

const getDefaultTheme = (): Theme => {
  return import.meta.env.VITE_THEME ? "brand" : "classic";
};

const currentTheme = ref<Theme>(getDefaultTheme());
const currentLanguage = ref<Language>((locale.value as Language) || "en");

const isDarkMode = computed(() => {
  const currentVariant = themeSwitcher.getCurrentTheme();
  return currentVariant.endsWith(themeSwitcher.suffixDark);
});

onMounted(() => {
  applyTheme(currentTheme.value);
});

watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
});

watch(currentLanguage, (newLanguage) => {
  locale.value = newLanguage;
  localStorage.setItem("language", newLanguage);
});

function applyTheme(theme: Theme) {
  const themeVariant = isDarkMode.value ? "dark" : "light";
  themeSwitcher.setTheme(`theme-${theme}-${themeVariant}`);
}

function changeTheme(theme: Theme) {
  if (theme === "brand" && import.meta.env.VITE_THEME === undefined) {
    showDemoMessage();
    return;
  }

  currentTheme.value = theme;
}

function handleThemeClick(event: Event, theme: Theme) {
  event.preventDefault();
  event.stopPropagation();
  changeTheme(theme);
}

function changeLanguage(language: Language) {
  currentLanguage.value = language;
}
</script>

<template>
  <div :class="styles.UserSettings">
    <IxTypography format="h4">{{ t("theme.title", "Theme") }}</IxTypography>
    <section :class="styles.ThemeSelection">
      <div
        v-for="theme in themes"
        :key="theme.value"
        :class="styles.ThemeButton"
        @click="(event) => handleThemeClick(event, theme.value)"
      >
        <div :class="[styles.ThemeImagePreview, { [styles.Active]: currentTheme === theme.value }]">
          <img :src="theme.image" :alt="`${theme.name} theme`" draggable="false" />
        </div>
        <div>
          <IxRadio
            :id="theme.value"
            :checked="currentTheme === theme.value"
            @checkedChange="() => changeTheme(theme.value)"
            :label="theme.name"
          />
        </div>
      </div>
    </section>
    
    <section>
      <IxTypography :class="styles.HeadlineLanguage" format="h4">
        {{ t("language.title") }}
      </IxTypography>
      <section :class="styles.LanguageSelection">
        <IxRadioGroup>
          <IxRadio
            id="l_en"
            :checked="currentLanguage === 'en'"
            @checkedChange="() => changeLanguage('en')"
            :label="t('language.en')"
          />
          <IxRadio
            id="l_de"
            :checked="currentLanguage === 'de'"
            @checkedChange="() => changeLanguage('de')"
            :label="t('language.de')"
          />
        </IxRadioGroup>
      </section>
    </section>
  </div>
</template>