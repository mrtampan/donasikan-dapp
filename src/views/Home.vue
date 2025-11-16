<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { pickBy } from 'lodash'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useEtherStore } from '@/stores/ether'
import DonateButton from './Home/DonateButton.vue'
import { toast } from 'vue-sonner'

const router = useRouter()

const ether = useEtherStore()

const data = ref<any>(null)

async function fetchData() {
  let web3 = await ether.getWeb3Listener()
  let contract = await ether.getContractListener(web3)

  const subscription = contract.events.DonasiNote()

  subscription.on('data', async (event: any) => {
      toast('Terima kasih ' + `${event.returnValues.name} telah berdonasi ${web3.utils.fromWei(event.returnValues.amount, 'ether')} POL`, {
        description: `${event.returnValues.message}`,
        duration: 20000,
        position: 'top-center',
      }
      )
  })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-4">
    <div class="text-center">
      <DonateButton @reset="() => router.go(0)" />
    </div>
  </div>
</template>
