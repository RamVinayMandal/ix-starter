<script setup lang="ts">
import { IxTypography, IxToggle, IxUpload } from "@siemens/ix-vue";
</script>

<template>
  <section class="ApplicationSettings">
  <section>
      <IxTypography format="h4" class="HeadlineSettings">Notifications</IxTypography>
      <IxToggle text-off="Off" text-on="On"></IxToggle>
  </section>
  <section>
    
      <IxTypography format="h4" class="HeadlineSettings">Import device data</IxTypography>
      <div class="file-upload-area">
      <IxUpload select-file-text="Drag files here or..."/>
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
.HeadlineSettings{
  margin-bottom: 0.75rem;
}
</style>
