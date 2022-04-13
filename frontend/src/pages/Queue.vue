<template>
    <p>This is where the video list would live.</p>
</template>

<script setup>
  import { onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  const router = useRouter();
  const store = useStore();

  const user = computed(() => store.state.user)

  onMounted(() => {
      if(user === null) {
          router.push('/')
      }
  })
</script>