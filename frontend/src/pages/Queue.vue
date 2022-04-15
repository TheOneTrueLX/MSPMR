<template>
    <div class="flex gap-4 justify-between container mx-auto my-8 p-4 bg-slate-900">
        <div class="flex-none items-stretch"><h1 class="text-7xl">MSPMR</h1></div>
        <div class="flex-auto items-stretch text-center self-center">
            <label for="channel_select">Channel:&nbsp;</label>
            <select id="channel_select" class="select select-bordered w-full max-w-xs">
                <option selected>TheOneTrueLX (owner)</option>
                <option>DerWerkzeug (mod)</option>
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
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();

  const axios = inject('axios');

  const username = ref(localStorage.getItem('username'));
  const profile_image = ref(localStorage.getItem('profile_image'));
  
  function logout(evt) {
      evt.preventDefault();
      console.log('click!')
      axios.delete('/auth/logout').then(() => {
          localStorage.setItem('isAuthenticated', '0')
          localStorage.removeItem('id')
          localStorage.removeItem('username')
          localStorage.removeItem('profile_image')
          router.push('/')
      })
  }

</script>

<style>
    h1 {
        font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    }
</style>