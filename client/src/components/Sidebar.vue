<template>
  <aside class="hidden md:block w-auto xl:w-[18vw] h-full border-r px-4 py-6 overflow-auto">
    <!-- Insta Logo for large screens -->
    <div class="hidden xl:inline-block py-4 mb-6 w-28">
      <img :src="insta_logo" alt="" />
    </div>
    <!-- Insta Icon for small screens -->
    <div class="xl:hidden flex justify-center py-4 mb-6">
      <img class="size-7" :src="insta_icon" alt="" />
    </div>
    <nav class="flex flex-col justify-between h-[84%]">
      <ul class="space-y-3">
        <li v-for="(link, index) in SidebarLinks" :key="index">
          
          <router-link v-if="link.isLink" :class="['sidebar-link', isActive(link) ? 'font-bold' : '']" :to="link.href">
            <div>
              <img class="size-7" :src="getIcon(link)" :alt="link.name" />
            </div>
            <div class="hidden xl:inline-block">{{ link.name }}</div>
          </router-link>
          
          <div v-else @click="handleActions[link.name.toLocaleLowerCase()]?.()" class="sidebar-link">
            <div>
              <img class="size-7" :src="getIcon(link)" :alt="link.name" />
            </div>
            <div class="hidden xl:inline-block">{{ link.name }}</div>
          </div>
        </li>
        <li>
          <router-link v-if="authStore.getUser" :class="['sidebar-link', /^\/profile\/[^/]+$/.test(route.path) ? 'font-bold' : '']" :to="`/profile/${authStore.getUser.id}`">
            <div :class="['rounded-full', /\/profile\/[^/]+$/.test(route.path) ? 'border-2 border-black' : '']">
              <img class="rounded-full w-7 h-6 xl:size-7" :src="getProfileImageUrl(authStore.getUser.profilePicture)" />
            </div>
            <div class="hidden xl:inline-block">Proifle</div>
          </router-link>
        </li>
      </ul>
      <div class="justify-self-end">
        <!-- Dropdown menu -->
        <div v-if="uiStore.showMore" class="absolute -translate-y-20 bottom-4 w-56 md:flex md:flex-col md:text-left shadow-[0_0_16px_rgba(0,0,0,0.2)] md:justify-start md:text-sm overflow-visible bg-white rounded-xl p-2">
          <button class="text-left px-4 py-4 hover:bg-gray-100 trnasition-all rounded-xl">
            Switch accounts
          </button>
          <div class="h-0.5 bg-gray-100 overflow-hidden -mx-2 my-2"></div>
          <button @click="Logout" class="text-left px-4 py-4 hover:bg-gray-100 trnasition-all rounded-xl">
            Log out
          </button>
        </div>

        <!-- "More" button -->
        <div @click="handleMoreBtnClick" :class="['sidebar-link relative rounded-xl hover:bg-gray-200 transition-all duration-200', isMoreActive ? 'font-bold' : '']">
            <div class="w-[1.22rem] h-4 flex flex-col justify-between">
              <div :class="['bg-black rounded-full', isMoreActive ? 'h-[0.20rem]' : 'h-[2px]' ]"></div>
              <div :class="['bg-black rounded-full', isMoreActive ? 'h-[0.20rem]' : 'h-[2px]' ]"></div>
              <div :class="['bg-black rounded-full', isMoreActive ? 'h-[0.20rem]' : 'h-[2px]' ]"></div>
            </div>
            <div class="unselectable hidden xl:inline-block">More</div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import insta_logo from "@/assets/icons/insta_logo.png";
import insta_icon from "@/assets/icons/insta_icon.svg";
import SidebarLinks from "@/constants/SidebarLinks.js";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
// stores
import { useUiStore } from "@/store/UiStore";
import { useAuthStore } from "@/store/AuthStore";
import axios from "axios";
import router from "@/router";
import { getProfileImageUrl } from '@/utils/imageHelpers'

const route = useRoute();
const uiStore = useUiStore();
const authStore = useAuthStore();

const isMoreActive = ref(false);

const handleActions = {
  create: () => uiStore.changeCreateOverlay()
}

function handleMoreBtnClick() {
  isMoreActive.value = !isMoreActive.value;
  uiStore.changeMoreDisplay();
}

async function Logout() {
  await axios.post('http://localhost:8000/api/user/signout', null, {
    withCredentials: true
  });
  authStore.logout();
  uiStore.changeMoreDisplay();
  router.push('/login')
}

const activePath = computed(() => route.path);
const isActive = (link) => activePath.value === link.href; 

const getIcon = (link) => {
  return isActive(link) ? (link.iconDark || link.iconLight) : link.iconLight;
}
</script>
