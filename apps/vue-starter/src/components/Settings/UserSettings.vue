<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { themeSwitcher } from "@siemens/ix";
import { IxTypography } from "@siemens/ix-vue";
import { useShowDemoMessage } from "../../helpers/demoMessage";

import brand from "../../assets/images/brand.png";
import classic from "../../assets/images/classic.png";
import styles from "./styles.module.css";

const { t, locale } = useI18n();
const showDemoMessage = useShowDemoMessage();

// Set default theme based on environment
// Production: brand theme, Local: classic theme
const getDefaultTheme = () => {
  return import.meta.env.VITE_THEME ? "brand" : "classic";
};

const currentTheme = ref(getDefaultTheme());
const currentLanguage = ref("en");

// Initialize theme on component mount
onMounted(() => {
  const currentVariant = themeSwitcher.getCurrentTheme();
  const isDark = currentVariant.endsWith(themeSwitcher.suffixDark);
  themeSwitcher.setTheme(`theme-${currentTheme.value}-${isDark ? "dark" : "light"}`);
});

function changeTheme(theme: string) {
  // If trying to select brand theme in local environment, show demo message
  if (theme === "brand" && import.meta.env.VITE_THEME === undefined) {
    showDemoMessage();
    return;
  }

  currentTheme.value = theme;
  const currentVariant = themeSwitcher.getCurrentTheme();
  const isDark = currentVariant.endsWith(themeSwitcher.suffixDark);
  themeSwitcher.setTheme(`theme-${theme}-${isDark ? "dark" : "light"}`);
}

function handleClick(event: Event, theme: string) {
  event.preventDefault();
  event.stopPropagation();
  changeTheme(theme);
}

function changeLanguage(language: string) {
  currentLanguage.value = language;
  locale.value = language;
  localStorage.setItem("language", language);
}
</script>

<template>
  <div>
    <IxTypography format="h4" :class="styles.themeTitle">Theme</IxTypography>
    <section :class="styles.ThemeSelection">
      <!-- Brand Theme -->
      <div
        :class="styles.ThemeButton"
        @click="(event) => handleClick(event, 'brand')"
      >
        <div :class="[styles.ThemeImagePreview, currentTheme === 'brand' ? styles.Active : '']">
          <img :src="brand" alt="Siemens brand theme" draggable="false" />
        </div>
        <div>
          <input
            type="radio"
            :checked="currentTheme === 'brand'"
            id="SiemensBrand"
            @change="() => changeTheme('brand')"
            class="ix-form-control"
          />
          <label class="ix-form-label" for="SiemensBrand">Siemens Brand</label>
        </div>
      </div>

      <!-- Classic Theme -->
      <div
        :class="styles.ThemeButton"
        @click="(event) => handleClick(event, 'classic')"
      >
        <div :class="[styles.ThemeImagePreview, currentTheme === 'classic' ? styles.Active : '']">
          <img :src="classic" alt="Classic theme" draggable="false" />
        </div>
        <div>
          <input
            type="radio"
            :checked="currentTheme === 'classic'"
            id="Classic"
            @change="() => changeTheme('classic')"
            class="ix-form-control"
          />
          <label class="ix-form-label" for="Classic">Classic</label>
        </div>
      </div>
    </section>

    <IxTypography format="h4" :class="styles.languageTitle">Language</IxTypography>
    <section :class="styles.LanguageSelection">
      <div :class="styles.languageLabel">
        <input
          id="l_en"
          type="radio"
          :checked="currentLanguage === 'en'"
          @change="() => changeLanguage('en')"
          class="ix-form-control"
        />
        <label class="ix-form-label" for="l_en">English</label>
      </div>
      <div>
        <input
          id="l_de"
          type="radio"
          :checked="currentLanguage === 'de'"
          @change="() => changeLanguage('de')"
          class="ix-form-control"
        />
        <label class="ix-form-label" for="l_de">German</label>
      </div>
    </section>
  </div>
</template>