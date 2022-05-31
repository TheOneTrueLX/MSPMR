<template>
    <LiteYouTubeEmbed
        :id="videoId"
        title="MSPMR Video Player"
        poster="hqdefault"
    ></LiteYouTubeEmbed>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiGet } from '../util/fetch';

import LiteYouTubeEmbed from 'vue-lite-youtube-embed';
import 'vue-lite-youtube-embed/dist/style.css';

const route = useRoute();

const video = reactive(await apiGet(`/videos/current/${route.params.apikey}`));
const videoId = computed(() => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = video.data.video_url.match(regExp);
    return (match && match[2].length == 11) ? match[2] : null;
})

</script>