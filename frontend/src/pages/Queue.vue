<template>
    <div class="flex gap-4 justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="flex-none items-stretch"><h1 class="text-7xl">MSPMR</h1></div>
        <div v-if="channels.length > 1" class="flex-auto items-stretch text-center self-center">
            <label for="channel_select">Channel:&nbsp;</label>
            <select v-model="user.current_channel" @change="changeChannelDropdown" id="channel_select" class="select select-bordered w-full max-w-xs">
                <option v-for="(item, index) in channels" :value="item.channel_id" :key="index">{{ item.channel_name }} ({{ item.user_status }})</option>
            </select>
        </div>
        <div v-else class="flex-auto items-stretch text-center self-center">
            <p>Channel: {{ channels[0].channel_name }} ({{ channels[0].user_status }})</p>
        </div>
        <div class="flex-none items-stretch min-h-max">
            <div class="grid grid-cols-2 justify-end">
                <div class="avatar self-center">
                    <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img :src="user.profile_image" />
                    </div>
                </div>
                <div class="text-center self-center">
                    <p class="font-bold">{{ user.username }}</p>
                    <p><a class="underline" href="#" @click="logout">logout</a></p>
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="form-control w-full max-w-full">
            <label class="label">
                <span class="label-text">Submit Video</span>
                <span class="label-text-alt">Enter Youtube URL below</span>
            </label>
            <input type="text" placeholder="Type here" v-model="video_submission" class="input input-bordered w-full max-w-full">
            <label class="label">
                <span class="label-text-alt">Videos submitted here will show the channel owner as the submitter.</span>
            </label>
            <button @click="manualVideoAdd" class="btn mt-4 btn-primary max-w-xs self-end">Submit</button>
         </div>
    </div>
    <div class="flex justify-between container mx-auto my-8 p-4 bg-slate-900">
        <a v-if="videos.length > 0" v-for="video in videos" :href="video.video_url">Placeholder for {{ video.video_url }}</a>
        <p v-else>There are currently no videos in the queue.</p>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import {  apiGet, apiPost, apiDelete } from '../util/fetch'
  
  const router = useRouter();
  const toast = useToast();

  const user = ref(await apiGet('/users/current'));
  const channels = ref(await apiGet('/channels')); 
  const videos = ref(await apiGet('/videos'));

  const video_submission = ref(null);
  
  async function manualVideoAdd(evt) {
    const response = await apiPost('/videos', {
        //TODO: define what this post payload needs to look like
    })
  }

  async function logout(evt) {
    evt.preventDefault();
    await apiDelete('/auth/logout');
    router.push('/');
  }

  async function changeChannelDropdown(evt) {
    evt.preventDefault();
    const response = await apiGet(`/channels/${user.current_channel}`)
    if(response) {
        if(!user.value.current_channel == response.current_channel) {
            toast.error('MSPMR Error: User not authorized to change channel')
        }
        user.value.current_channel = response.current_channel
        videos.value = await apiGet('/videos');
    } else {
        toast.error('MSPMR Error: Unable to change channel')
    }
  }

</script>

<style>
    h1 {
        font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }
</style>