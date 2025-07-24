<script setup lang="ts">
import { IxTypography, IxToggle, IxUpload } from "@siemens/ix-vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section class="ApplicationSettings">
    <section>
      <IxTypography format="h4" class="HeadlineSettings">{{ t("settings.notification") }}</IxTypography>
      <IxToggle :text-off="t('settings.toggle-off')" :text-on="t('settings.toggle-on')"></IxToggle>
    </section>
    <section>

      <IxTypography format="h4" class="HeadlineSettings">{{ t("settings.import-device") }}</IxTypography>
      <div class="file-upload-area">
        <IxUpload :select-file-text="t('settings.upload-text')" :i18n-upload-file="t('settings.upload-button')" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.notification-settings {
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.file-upload-area {
  width: 400px;
  height: 64px;
  padding-left: 0;
}

.ApplicationSettings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.HeadlineSettings {
  margin-bottom: 0.75rem;
}
</style>
