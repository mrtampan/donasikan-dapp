<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { ref, reactive } from 'vue'
import { useEtherStore } from '@/stores/ether'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import {toast } from 'vue-sonner'


const emit = defineEmits<{
  (e: 'reset'): void
}>()

const ether = useEtherStore()

const open = ref(false)

const account = ref<any>(null)
const contract = ref<any>(null)

const loading = ref(false)

const form = reactive({
  name: '',
  message: '',
  address: '',
  amount: '',
})

async function onSubmit() {
  loading.value = true
  const web3 = await ether.getWeb3()
  account.value = await ether.getAccount(web3)
  contract.value = await ether.getContract(web3)

  const gasPrice = await web3.eth.getGasPrice()

  const estimatedGas = await contract.value.methods
    .donasi(form.name, form.message, form.address)
    .estimateGas({ from: account.value, value: web3.utils.toWei(form.amount, 'ether') })

  await contract.value.methods
    .donasi(form.name, form.message, form.address)
    .send({
      from: account.value,
      gas: estimatedGas,
      gasPrice: gasPrice,
      value: web3.utils.toWei(form.amount, 'ether'),
    })

  emit('reset')
    toast.success('Donasi berhasil!')
  loading.value = false
  open.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="open = $event">
    <DialogTrigger as-child>
      <Button> Donate </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Donate</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" v-model="form.name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="desc" class="text-right"> Message </Label>
          <Textarea id="desc" v-model="form.message" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="address" class="text-right"> Address </Label>
          <Input id="address" v-model="form.address" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="amount" class="text-right"> Amount </Label>
          <InputGroup class="col-span-3">
            <InputGroupInput id="amount" type="number" v-model="form.amount" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>POL</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <DialogFooter>
        <Button @click="onSubmit()">
          <template v-if="loading"><Spinner/></template>
          <template v-else>Send</template>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
