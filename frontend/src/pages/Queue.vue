<template>
    <div class="flex gap-4 justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="flex-none items-stretch"><h1 class="text-7xl">MSPMR</h1></div>
        <div v-if="channels.length > 1" class="flex-auto items-stretch text-center self-center">
            <label class="text-2xl" for="channel_select">Channel:&nbsp;</label>
            <select v-model="user.current_channel" @change="changeChannelDropdown" id="channel_select" class="select select-bordered w-full max-w-xs">
                <option v-for="(item, index) in channels" :value="item.channel_id" :key="index">{{ item.channel_name }} ({{ item.user_status }})</option>
            </select>
        </div>
        <div v-else class="flex-auto items-stretch text-center self-center">
            <p class="text-2xl">Channel: {{ channels[0].channel_name }} ({{ channels[0].user_status }})</p>
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
                    <p><a class="underline" :href="`/overlay/${user.overlay_api_key}`">Overlay <font-awesome-icon :icon="['fa', 'link']" size="lg"></font-awesome-icon></a></p>
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="form-control w-full max-w-full">
            <label class="label">
                <h3 class="text-3xl">Submit Video</h3>
                <span class="label-text-alt">Enter Youtube URL below</span>
            </label>
            <input type="text" placeholder="Type here" v-model="video_submission" class="input input-bordered w-full max-w-full">
            <label class="label">
                <span class="label-text-alt">Videos submitted here will show the channel owner as the submitter.</span>
            </label>
            <button :disabled="!video_submission_valid"  @click="manualVideoAdd" class="btn mt-4 btn-primary max-w-xs self-end">Submit</button>
         </div>
    </div>
    <div class="justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="container" v-if="videos.length > 0" v-for="video, index in videos" :href="video.video_url">
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
                <div v-if="index == 0" class="col-span-9 text-center mt-8 space-x-4">
                    <button @click="mediaButtonClick('video:startover')" class="btn bg-sky-900"><font-awesome-icon :icon="['fa', 'backward-fast']" size="lg"></font-awesome-icon></button>
                    <button @click="mediaButtonClick('video:rewind')" class="btn bg-sky-700"><font-awesome-icon :icon="['fa', 'backward']" size="lg"></font-awesome-icon></button>
                    <button @click="mediaButtonClick('video:playpause')" class="btn bg-green-700"><font-awesome-icon :icon="['fa', 'play']" size="lg"></font-awesome-icon>/<font-awesome-icon :icon="['fa', 'pause']" size="lg"></font-awesome-icon></button>
                    <button @click="mediaButtonClick('video:fastforward')" class="btn bg-sky-700"><font-awesome-icon :icon="['fa', 'forward']" size="lg"></font-awesome-icon></button>
                    <button @click="mediaButtonClick('video:remove')" class="btn bg-red-800"><font-awesome-icon :icon="['fa', 'trash']" size="lg"></font-awesome-icon></button>
                </div>
            </div>
        </div>
        <p v-else>There are currently no videos in the queue.</p>
    </div>
</template>

<script setup>
  import { watch, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import { apiGet, apiPost, apiDelete } from '../util/fetch'
  import { getYoutubeThumbnail } from '../util/yt';
  import { useSocketIO } from '../util/socket'
  
  const router = useRouter();
  const toast = useToast();
  const { socket } = useSocketIO();

  const user = ref(await apiGet('/users/current'));
  
  const channels = ref(await apiGet('/channels')); 
  var videos = ref(await apiGet('/videos'));

  const video_submission = ref('');
  const video_submission_valid = ref(false);
  
  // Validate the URL in the submission field.  It needs to be a valid Youtube video URL
  // in order for the submit button to enable itself.
  watch(video_submission, (currentValue, oldValue) => {
      video_submission_valid.value = currentValue.match(/^https?:\/\/(?:www\.)?youtu(?:\.be\/.{11}|be\.com\/watch\?v=.{11})$/) ? true : false
  })

  function convertSecondsToTime(val) {
      const dateObj = new Date(val * 1000);
      const hours = dateObj.getUTCHours();
      const minutes = dateObj.getUTCMinutes();
      const seconds = dateObj.getUTCSeconds();

      return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
  }

  async function manualVideoAdd() {
    const response = await apiPost('/videos', { url: video_submission.value })
    if('status' in response) {
      toast.error(`MSPMR Error [Queue.vue:72]: ${response.message}`)
    } else {
      toast.success('Video submitted for processing, and will be added to the queue shortly.')
      video_submission.value = '';
    }
  }

  async function logout(evt) {
    evt.preventDefault();
    await apiDelete('/auth/logout');
    router.push('/');
  }

  async function mediaButtonClick(mode) {
      console.log(`sending signal '${mode}' to API`)
      socket.emit(mode)
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

  onMounted(() => {
    socket.on('reload-queue', async (data) => {
        videos = await apiGet('/videos')
    })
  })

</script>

<style>
    h1, h2, h3 {
        font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }

</style>