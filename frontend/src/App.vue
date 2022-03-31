<script setup>
</script>

<template>
  <div>
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
              <h1 class="text-5xl font-bold">Low-Stress Media Sharing<br/>for Livetreamers</h1>
              <p class="py-2">Want to manage a media share stream without having to worry about DMCA strikes?  Scared of getting TOSed because of shady video submissions from randos?  Tired of having to sift through a Discord channel to pre-screen submissions?  Want an easy-to-use tool for both you and your mods to handle all these things and more?</p>
              <p class="py-2">Then <span class="font-bold">MSPMR</span> might be the tool for you!</p>
              <a class="underline" href="#">Click here to learn more...</a>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div class="card-body">
                <div>
                  <p class="py-2">To begin using <span class="font-bold">MSPMR</span>, click the button below to log in with your <a class="underline" href="https://twitch.tv" target="_blank">Twitch.tv</a> account.</p>
                  <p><a class="underline" href="#">Click here</a> to view our terms of use and privacy policy.</p>
                </div>
                <div class="form-control mt-6">
                  <button class="btn btn-primary text-xl"><font-awesome-icon :icon="['fab', 'twitch']" size="lg"></font-awesome-icon>&nbsp;Get Started!</button>
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
          <img src="https://api.lorem.space/image/movie?w=260&h=400" class="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">Box Office News!</h1>
            <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
    <div class="relative z-30 bg-base-300 py-12 mb-32">
      <div class="hero">
        <div class="hero-content flex-col lg:flex-row">
          <img src="https://api.lorem.space/image/movie?w=260&h=400" class="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">Box Office News!</h1>
            <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
    <footer class="flex relative z-30 bg-base-300 p-4">
      <p>
        &copy; 2022 TheOneTrueLX <a href="https://twitter.com/TheOneTrueLX"><font-awesome-icon :icon="['fab', 'twitter']"></font-awesome-icon></a> <a href="https://twitch.tv/TheOneTrueLX"><font-awesome-icon :icon="['fab', 'twitch']"></font-awesome-icon></a> <a href="https://github.com/TheOneTrueLX/MSPMR"><font-awesome-icon :icon="['fab', 'github']"></font-awesome-icon></a>
      </p>
    </footer>
  </div>
</template>

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
