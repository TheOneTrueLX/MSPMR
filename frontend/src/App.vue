<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>
        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </template>
  </router-view>
</template>

<script setup>
import { onErrorCaptured } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

onErrorCaptured((e) => {
  toast.error(`MSPMR Error: ${e.message}`);
  return true;
})

</script>