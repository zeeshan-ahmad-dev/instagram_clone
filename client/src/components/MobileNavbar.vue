<template>
    <aside class="md:hidden fixed z-[10000] bottom-0 border-t bg-white w-full border-r px-4 py-2 overflow-auto">
      <nav class="center">
        <ul class="center gap-6">
          <li v-for="(link, index) in MobileNavLinks" :key="index" class="center">
            
            <router-link v-if="link.isLink" :class="['sidebar-link', isActive(link) ? 'font-bold' : '']" :to="link.href">
              <div>
                <img class="size-7" :src="getIcon(link)" :alt="link.name" />
              </div>
            </router-link>
            
            <div v-else @click="handleActions[link.name.toLocaleLowerCase()]?.()" class="sidebar-link">
              <div>
                <img class="size-7" :src="getIcon(link)" :alt="link.name" />
              </div>
            </div>
          </li>
          <li>
            <router-link v-if="authStore.getUser" :class="['sidebar-link', /^\/profile\/[^/]+$/.test(route.path) ? 'font-bold' : '']" :to="`/profile/${authStore.getUser.id}`">
              <div :class="['rounded-full', /\/profile\/[^/]+$/.test(route.path) ? 'border-2 border-black' : '']">
                <img class="rounded-full size-7" :src="getProfileImageUrl(authStore.getUser.profilePicture)" />
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script setup>
  import MobileNavLinks from "@/constants/MobileNavbarLinks.js";
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
  