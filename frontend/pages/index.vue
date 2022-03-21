<template>
  <div class="m-6 p-4 bg-gray-800"> 
    <div class="grid grid-cols-2">
      <div class="justify-self-start">
        <h1>MSPMR</h1>
      </div>
      <div class="justify-self-end items-center" v-if="user">
        <div class="grid grid-cols-2 p-0 place-items-center">
          <div><img class="rounded-full border-2" width="64" height="64" :src="user.profile_image_url" /></div>
          <div>
            <p class="font-bold">{{ user.display_name }}</p>
            <p class="text-center">Logout</p>
          </div>
        </div>
      </div>
      <div class="justify-self-end items-center" v-else>
        <NuxtLink to="/auth">Login</NuxtLink>
      </div>
    </div>
    <div>
      <VideoList></VideoList>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'IndexPage',
  data() {
    return {
      user: null,
      socket: null
    }
  },
  mounted() {
    this.socket = this.$nuxtSocket({ channel: '/' })
  },
  async asyncData({ $axios }) {
    let { data } = await $axios.get('/auth/user');
    return { user: data.data[0] }
  }
})
</script>

<style>
  body {
    background-color: #000000;
    color: #ffffff;
  }

  h1 {
    font-family: 'Russo One', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 40pt;
  }
</style>