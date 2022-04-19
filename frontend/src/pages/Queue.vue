<template>
    <div class="flex gap-4 justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="flex-none items-stretch"><h1 class="text-7xl">MSPMR</h1></div>
        <div class="flex-auto items-stretch text-center self-center">
            <label for="channel_select">Channel:&nbsp;</label>
            <select v-model="current_channel" id="channel_select" class="select select-bordered w-full max-w-xs">
                <option v-for="(item, index) in channels" :value="item.channel_id" :key="index">{{ item.channel_name }} ({{ item.user_status }})</option>
            </select>
        </div>
        <div class="flex-none items-stretch min-h-max">
            <div class="grid grid-cols-2 justify-end">
                <div class="avatar self-center">
                    <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img :src="profile_image" />
                    </div>
                </div>
                <div class="text-center self-center">
                    <p class="font-bold">{{ username }}</p>
                    <p><a class="underline" href="#" @click="logout">logout</a></p>
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-between container mx-auto my-8 p-4 bg-slate-900">
        <p>Video list goes here.</p>
    </div>
</template>

<script setup>
  import { ref, inject, onMounted, reactive} from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';

  const router = useRouter();
  const toast = useToast();
  const axios = inject('axios');

  const username = ref(null);
  const profile_image = ref(null);

  const channels = ref(null);

  axios.get('/channels').then((res) => {
    channels.value = res.data;
    if(!localStorage.getItem('current_channel')) {
      localStorage.setItem('current_channel', String(channels.value[0].channel_id))        
    }
  });

  const current_channel = ref(localStorage.getItem('current_channel'));

  function logout(evt) {
    evt.preventDefault();
    axios.delete('/auth/logout').then(() => {
        router.push('/')
    })
  }

  onMounted(() => {
      axios.get('/users/current').then((res) => {
        username.value = res.data.username;
        profile_image.value = res.data.profile_image;
      }).catch((err) => {
          toast.error(`MSPMR Error: ${err}`)
          router.push('/')
      })
  })

</script>

<style>
    h1 {
        font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }
</style>