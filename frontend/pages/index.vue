<template>
  <Tutorial />
</template>

<script lang="ts">
import Vue from 'vue';
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from '@socket.io/component-emitter'

export default Vue.extend({
  name: 'IndexPage',
  data() {
    return {
      socket: null as Socket<DefaultEventsMap, DefaultEventsMap> | null
    }
  },
  mounted(): void {
    this.socket = this.$nuxtSocket({ channel: '/' })
  }
})
</script>
