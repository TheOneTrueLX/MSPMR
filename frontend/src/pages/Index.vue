<template>
  <div class="video_contain">
    <video autoplay loop muted class="video">
      <source src="~@/assets/static_bg.mp4" />
    </video>
  </div>

  <header class="relative flex items-center justify-center h-screen mb-12">
    <div class="relative z-30 p-5">
      <div class="hero min-h-screen">
        <div class="hero-content flex-col lg:flex-row-reverse bg-base-300 rounded-2xl shadow-2xl">
          <div class="text-center lg:text-left">
            <h1 class="text-5xl font-bold">Low-Stress Media Sharing<br/>for Streamers</h1>
            <p class="py-2">Want to manage a media share stream without having to worry about DMCA strikes?  Scared of getting TOSed because of shady video submissions from randos?  Tired of having to sift through a Discord channel to pre-screen submissions?  Want an easy-to-use tool for both you and your mods to handle all these things and more?</p>
            <p class="py-2">If you answered yes to any of these questions, then <span class="font-bold">MSPMR</span> might be the tool for you!</p>
            <a class="underline" href="#">Click here to learn more...</a>
          </div>
          <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div class="card-body">
              <div>
                <p class="py-2">To begin using <span class="font-bold">MSPMR</span>, click the button below to log in with your <a class="underline" href="https://twitch.tv" target="_blank">Twitch.tv</a> account.</p>
                <p><a class="underline" href="#">Click here</a> to view our terms of use and privacy policy.</p>
              </div>
              <div class="form-control mt-6">
                <button class="btn btn-primary text-xl" v-on:click="onClickGetStarted"><font-awesome-icon :icon="['fab', 'twitch']" size="lg"></font-awesome-icon>&nbsp;Get Started!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="relative z-30 bg-base-300 py-12 mb-32">
    <div class="hero">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div>
          <h1 class="text-5xl font-bold text-center mb-6">How it Works</h1>
          <ul class="steps steps-vertical">
            <li class="step step-primary"><div class="text-left pl-6">Log into MSPMR.  If it's your first time, you'll be promted to do some initial setup like setting up the channel point redeem price, setting the maximum lenght of videos, etc.</div></li>
            <li class="step step-primary"><div class="text-left pl-6">Don't worry about creating the channel point reward... MSPMR will do that for you!</div></li>
            <li class="step step-primary"><div class="text-left pl-6">Next, you'll set up a browser source in your broadcasting software that points to the MSPMR video player overlay.</div></li>
            <li class="step step-primary"><div class="text-left pl-6">When you're ready to do a media share stream, connect to MSPMR and click the "Start Media Share" session button.  This will activate the channel point reward, and MSPMR will start watching for redeems.</div></li>
            <li class="step step-primary"><div class="text-left pl-6">Viewers redeem that channel point reward and provide the URL to a Youtube video.  Make sure any bots you have allow your viewers to post links to Youtube!</div></li>
            <li class="step step-primary"><div class="text-left pl-6">MSPMR will perform some preliminary checks on the video for things like copyright status, duration, duplicate submissions, etc. and will add the video to your queue.</div></li>
            <li class="step step-primary"><div class="text-left pl-6">Something went wrong?  Don't worry!  MSPMR will automatically refund a viewer's channel point redeem if it runs into any errors.</div></li>
            <li class="step step-primary"><div class="text-left pl-6">You and your mods will be able to view the list of videos in the queue and pre-screen them.</div></li>
            <li class="step step-primary"><div class="text-left pl-6">When you click the play button on a video in the queue, that video will start playing in the overlay. You'll be able to pause, resume, and skip forward/backwards using the video controls in the queue.</div></li>
          </ul>
        </div>
      </div>
    </div>
  </div>    
  <div class="relative z-30 bg-base-300 py-12 mb-32">
    <div class="hero min-w-5xl">
      <div class="hero-content flex-row-reverse">
        <img src="https://api.lorem.space/image/game?w=260&h=400" class="max-w-lg rounded-lg shadow-2xl" />
        <div>
          <h1 class="text-5xl font-bold">Features</h1>
          <ul class="list-disc list-inside py-6">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
            <li>Feature 4</li>
            <li>Feature 5</li>
            <li>Feature 6</li>
          </ul>
          <p class="pb-6">...and much more!</p>
          <button class="btn btn-primary text-xl" v-on:click="onClickGetStarted"><font-awesome-icon :icon="['fab', 'twitch']" size="lg"></font-awesome-icon>&nbsp;Get Started!</button>
        </div>
      </div>
    </div>
  </div>
  <div class="relative z-30 bg-base-300 py-12 mb-32">
    <div class="hero">
      <div class="hero-content flex-col">
        <h1 class="text-5xl font-bold pb-2">Who's using MSPMR?</h1>
        <div class="flex flex-row overflow-x-auto max-w-5xl">
          <div class="card card-side bg-base-100 shadow-xl min-w-max mx-2">
            <figure><img src="https://api.lorem.space/image/face?w=200&h=280" alt="Face"></figure>
            <div class="card-body">
              <h2 class="card-title">User Name</h2>
              <p>Some kind of quote or something like that.</p>
            </div>
          </div>
          <div class="card card-side bg-base-100 shadow-xl min-w-max mx-2">
            <figure><img src="https://api.lorem.space/image/face?w=200&h=280" alt="Face"></figure>
            <div class="card-body">
              <h2 class="card-title">User Name</h2>
              <p>Some kind of quote or something like that.</p>
            </div>
          </div>
          <div class="card card-side bg-base-100 shadow-xl min-w-max mx-2">
            <figure><img src="https://api.lorem.space/image/face?w=200&h=280" alt="Face"></figure>
            <div class="card-body">
              <h2 class="card-title">User Name</h2>
              <p>Some kind of quote or something like that.</p>
            </div>
          </div>
          <div class="card card-side bg-base-100 shadow-xl min-w-max mx-2">
            <figure><img src="https://api.lorem.space/image/face?w=200&h=280" alt="Face"></figure>
            <div class="card-body">
              <h2 class="card-title">User Name</h2>
              <p>Some kind of quote or something like that.</p>
            </div>
          </div>
          <div class="card card-side bg-base-100 shadow-xl min-w-max mx-2">
            <figure><img src="https://api.lorem.space/image/face?w=200&h=280" alt="Face"></figure>
            <div class="card-body">
              <h2 class="card-title">User Name</h2>
              <p>Some kind of quote or something like that.</p>
            </div>
          </div>
          <div class="card card-side bg-base-100 shadow-xl min-w-max mx-2">
            <figure><img src="https://api.lorem.space/image/face?w=200&h=280" alt="Face"></figure>
            <div class="card-body">
              <h2 class="card-title">User Name</h2>
              <p>Some kind of quote or something like that.</p>
            </div>
          </div>
        </div>
        <button class="btn btn-primary text-xl" v-on:click="onClickGetStarted"><font-awesome-icon :icon="['fab', 'twitch']" size="lg"></font-awesome-icon>&nbsp;Get Started!</button>
      </div>
    </div>
  </div>
  <footer class="flex relative z-30 bg-base-300 p-4">
    <p>
      &copy; 2022 TheOneTrueLX <a href="https://twitter.com/TheOneTrueLX"><font-awesome-icon :icon="['fab', 'twitter']"></font-awesome-icon></a> <a href="https://twitch.tv/TheOneTrueLX"><font-awesome-icon :icon="['fab', 'twitch']"></font-awesome-icon></a> <a href="https://github.com/TheOneTrueLX/MSPMR"><font-awesome-icon :icon="['fab', 'github']"></font-awesome-icon></a> - <a href="#" class="underline">Terms of Service / Privacy Policy</a>
    </p>
  </footer>
</template>

<script setup>
  import { onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';

  const router = useRouter();
  const store = useStore();

  const user = computed(() => store.state.user)

  function onClickGetStarted() {
    router.push('/auth')
  }

  onMounted(() => {
    if(user !== null) {
      router.push('/queue')
    }
  })

</script>

<style>
  .video_contain {
      position: fixed;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      z-index: 10;
  }

  video {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      min-height: 50%;
      min-width: 50%;
      filter: brightness(.35);
  }
</style>