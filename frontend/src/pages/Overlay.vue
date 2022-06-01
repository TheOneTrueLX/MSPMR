<template>
    <LiteYouTubeEmbed
        :id="videoId"
        title="MSPMR Video Player"
        poster="hqdefault"
    ></LiteYouTubeEmbed>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiGet } from '../util/fetch';
import { useSocketIO } from '../util/socket'

import LiteYouTubeEmbed from 'vue-lite-youtube-embed';
import 'vue-lite-youtube-embed/dist/style.css';

const route = useRoute();
const { socket } = useSocketIO({ auth: { token: route.params.apikey }});

const video = reactive(await apiGet(`/videos/current/${route.params.apikey}`));
const videoId = computed(() => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = video.data.video_url.match(regExp);
    return (match && match[2].length == 11) ? match[2] : null;
})

onMounted(() => {
  socket.on('video:playpause', () => {
      // play video
  })
})

</script>