<script setup lang="ts">
import Logo from '@/components/navbar-components/Logo.vue'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useRoute } from 'vue-router'
import { useEtherStore } from '@/stores/ether'
import { WindArrowDown } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [{ href: '/', label: 'Home', active: true }]

const ether = useEtherStore()

async function connectWallet() {
  await ether.connect()
  await router.go(0)
}

function init() {
  ether.checkLogin()
}

onMounted(() => {
  init()
})

const shortenAddress = (address: string) => {
  return address.slice(0, 6) + '...' + address.slice(-4)
}
</script>

<template>
  <header class="border-b px-4 md:px-6">
    <div class="flex h-16 items-center justify-between gap-4">
      <!-- Left side -->
      <div class="flex items-center gap-2">
        <!-- Mobile menu trigger -->
        <Popover>
          <PopoverTrigger as-child>
            <Button class="group size-8 md:hidden" variant="ghost" size="icon">
              <svg
                class="pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L20 12"
                  class="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                />
                <path
                  d="M4 12H20"
                  class="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  class="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" class="w-36 p-1 md:hidden">
            <NavigationMenu class="max-w-none *:w-full">
              <NavigationMenuList class="flex-col items-start gap-0 md:gap-2">
                <NavigationMenuItem
                  v-for="(link, index) in navigationLinks"
                  :key="index"
                  class="w-full"
                >
                  <NavigationMenuLink :href="link.href" class="py-1.5">
                    {{ link.label }}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
        <!-- Main nav -->
        <div class="flex items-center gap-6">
          <a href="/" class="text-primary hover:text-primary/90"> Donasikan Dapp </a>
          <!-- Navigation menu -->
          <NavigationMenu class="max-md:hidden">
            <NavigationMenuList class="gap-2">
              <NavigationMenuItem v-for="(link, index) in navigationLinks" :key="index">
                <NavigationMenuLink
                  :active="link.active"
                  :href="link.href"
                  class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                >
                  {{ link.label }}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <!-- Right side -->
      <div class="flex items-center gap-2">
        <Button variant="outline" v-if="ether.isLogin" as-child size="sm" class="text-sm">
          <div>{{ shortenAddress(ether.currentAccount) }}</div>
        </Button>
        <Button v-else as-child size="sm" class="text-sm" @click="connectWallet()">
          <div>Connect</div>
        </Button>
      </div>
    </div>
  </header>
</template>
