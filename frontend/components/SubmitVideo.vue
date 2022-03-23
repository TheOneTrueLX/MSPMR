<template>
    <div class="bg-gray-600 mb-4 p-4">
        <h2>Manual Video Submission</h2>
        <label for="video_url">Enter URL for video:</label>
        <input id="video_url" class="form-input mx-2 px-4 rounded-md shadow-sm shadow-black" type="text" />
        <input type="submit" @click="submitVideo" class="form-submit mx-2 bg-purple-600 rounded-lg px-6 shadow-sm shadow-black" value="Submit" />
        <p>Enabled platforms: <font-awesome-icon icon="fa-brands fa-youtube" />&nbsp;-&nbsp;Disabled Platforms:&nbsp;<font-awesome-icon icon="fa-brands fa-twitch" />&nbsp;<font-awesome-icon icon="fa-brands fa-discord" /></p>
    </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    methods: {
        submitVideo: function (evt) {
            evt.preventDefault();
            console.log('button clicked');
        }
    }
})
</script>

<style>
  h2 {
    font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 20pt;
  }
</style>