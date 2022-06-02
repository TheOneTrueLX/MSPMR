<template>
    <YoutubeVue3 class="w-full h-screen"
        ref="youtube"
        :videoid="videoId"
        :autoplay="0"
    ></YoutubeVue3>
</template>

<script setup>
import { reactive, computed, onMounted, ref, defineExpose } from 'vue';
import { useRoute } from 'vue-router';
import { apiGet } from '../util/fetch';
import { useSocketIO } from '../util/socket'

const route = useRoute();
const { socket } = useSocketIO({ auth: { token: route.params.apikey }});

const video = reactive(await apiGet(`/videos/current/${route.params.apikey}`));
const videoId = computed(() => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = video.data.video_url.match(regExp);
    return (match && match[2].length == 11) ? match[2] : null;
})

const youtube = ref(null)

onMounted(() => {
  socket.onAny((event, ...args) => {
      console.log(`got socket.io event ${event}`)
  })

  socket.on('overlay:startover', () => {
    youtube.value.player.seekTo(0, true)
  })

  socket.on('overlay:play', () => {
    youtube.value.player.playVideo()
  })

  socket.on('overlay:pause', () => {
    youtube.value.player.pauseVideo()
  })

  socket.on('overlay:stop', () => {
    youtube.value.player.stopVideo()
  })

  socket.on('overlay:rewind', async () => {
    const timestamp = await youtube.value.player.getCurrentTime()
    youtube.value.player.seekTo(timestamp - 10, true)
  })

  socket.on('overlay:fastforward', async () => {
    const timestamp = await youtube.value.player.getCurrentTime()
    youtube.value.player.seekTo(timestamp + 10, true)
  })


})
</script>
