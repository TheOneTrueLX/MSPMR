<template>
    <div class="form-control grid place-items-center h-screen">
        <div class="w-full max-w-xs">
            <label class="label">
                <span class="label-text">Enter your beta access key.</span>
            </label>
            <input v-model="betaKey" type="password" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs" />
            <label v-show="badKeyEntered" class="label">
                <span class="label-text text-red-500">INVALID BETA KEY ENTERED.</span>
            </label>
            <div class="mt-4"><button :disabled="(betaKey.length == 0)" @click="submitBetaKey" class="btn btn-primary">Submit</button></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiPatch, apiGet } from '../../util/fetch';

const betaKey = ref('')
const router = useRouter()
const badKeyEntered = ref(false)
// const user = ref(await apiGet('/users/current'))

async function submitBetaKey() {
    const res = await apiPatch('/users/beta', { key: betaKey.value })
    if(res.status === 200) {
        router.push('/queue')
    } else {
        badKeyEntered.value = true
    }
}

</script>