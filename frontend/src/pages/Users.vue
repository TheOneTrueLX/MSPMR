<template>
    <div class="flex gap-4 justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="flex-none items-stretch"><h1 class="text-7xl">MSPMR</h1></div>
        <div class="flex-auto items-stretch text-center self-center">
            <p class="text-2xl">Channel: {{ payload.meta.username }}</p>
        </div>
    </div>
    <div class="justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="container" v-if="payload.data.length > 0" v-for="video, index in payload.data" :href="video.video_url">
            <h2 class="text-5xl mb-4" v-if="index == 0">Now Playing:</h2>        
            <h2 class="text-5xl my-4" v-if="index == 1">Next In Queue:</h2>        
            <div class="grid grid-cols-12 bg-slate-800 mx-4 mb-4 p-4">
                <div class="col-span-3 row-span-4"><a :href="video.video_url" target="_blank"><img :src="getYoutubeThumbnail(video.video_url)" /></a></div>
                <div class="col-span-9"><a class="text-3xl font-bold" :href="video.video_url" target="_blank">{{ video.title }}</a></div>
                <div class="col-span-3"><span class="text-2xl font-bold" target="_blank">Duration: {{ convertSecondsToTime(video.duration) }}</span></div>
                <div class="col-span-3"><span class="text-2xl font-bold" target="_blank">Submitted by: {{ video.submitter }}</span></div>
                <div class="col-span-3">
                    <span v-if="video.copyright == 1" class="text-2xl font-bold text-red-600" target="_blank"><font-awesome-icon :icon="['fa', 'circle-exclamation']" size="lg"></font-awesome-icon>&nbsp;COPYRIGHT WARNING</span>
                </div>
            </div>
        </div>
        <p v-else>There are currently no videos in the queue.</p>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { apiGet } from '../util/fetch'
  import { getYoutubeThumbnail } from '../util/yt';
  
  const route = useRoute();

  const payload = ref(await apiGet(`/videos/${route.params.username}`));
  

  function convertSecondsToTime(val) {
      const dateObj = new Date(val * 1000);
      const hours = dateObj.getUTCHours();
      const minutes = dateObj.getUTCMinutes();
      const seconds = dateObj.getUTCSeconds();

      return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
  }
</script>

<style>
    h1, h2, h3 {
        font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }

</style>