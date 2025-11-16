import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {Web3, WebSocketProvider} from 'web3'
import { get } from 'lodash'

export const useEtherStore = defineStore('ether', () => {
  let web3 = <any>null
  let listenerWeb3 = <any>null

  const currentAccount = ref('')
  const isLogin = ref(false)

  async function checkLogin() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.getAccounts()
      if (accounts.length > 0) {
        currentAccount.value = accounts[0]
        isLogin.value = true
      } else {
        isLogin.value = false
      }
    } else {
      isLogin.value = false
    }
  }

  async function connect() {
    try {
      web3 = new Web3(window.ethereum)
      // ask user permission to access his accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // switch to polygon
      })

      const accounts = await web3.eth.getAccounts()
      currentAccount.value = accounts[0]
    } catch (error) {
      console.error('Failed Connect' + error)
    }
  }

  async function getContract(web3: any) {
    const env = (import.meta as any)?.env?.MODE ?? process.env.NODE_ENV
    const basePath = env === 'development' ? './public' : './'
    const data = await fetch(`${basePath}/contracts/Donasi.json`).then((res) => res.json()) // Ganti dengan compile json anda
    const contract = await new web3.eth.Contract(data.abi, '0x4fCC7CD9b4472Ca54F890bbF3b4Af2e0dBE718a7') // Ganti dengan alamat kontrak Anda
    return contract
  }

  async function getAccount(web3: any) {
    web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  }

  async function getWeb3(){
    return web3;
  }

  async function getWeb3Listener(){
    if(!listenerWeb3){
      listenerWeb3 = new Web3(new WebSocketProvider("wss://polygon-bor-rpc.publicnode.com"))
    }
    return listenerWeb3;
  }

  async function getContractListener(listenerWeb3: any) {
    const env = (import.meta as any)?.env?.MODE ?? process.env.NODE_ENV
    const basePath = env === 'development' ? './public' : './'
    const data = await fetch(`${basePath}/contracts/Donasi.json`).then((res) => res.json()) // Ganti dengan compile json anda
    const contract = await new listenerWeb3.eth.Contract(data.abi, '0x4fCC7CD9b4472Ca54F890bbF3b4Af2e0dBE718a7') // Ganti dengan alamat kontrak Anda
    return contract
  }

  return { 
    connect, 
    currentAccount, 
    checkLogin, 
    isLogin, 
    getContract, 
    getAccount, 
    getWeb3, 
    getWeb3Listener, 
    getContractListener,
  }
})
