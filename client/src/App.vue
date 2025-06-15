<template>
  <!-- Show Post Creator Overlay -->
  <PostCreator
    :show="uiStore.showCreateOverlay || false"
    :username="authStore.getUser?.username || null"
    :userImage="getProfileImageUrl(authStore.getUser?.profilePicture || null)"
    @close="uiStore.changeCreateOverlay"
  />
  <!-- App layout: show Sidebar if not on auth-related routes -->
  <div :class="['w-full', showSidebar ? 'flex h-screen' : '']">
    <Sidebar v-if="showSidebar" />
    <router-view class="flex-1 overflow-y-auto" />
    <MobileNavbar v-if="showSidebar" />
  </div>
</template>

<script setup>
// Components import
import Sidebar from "@/components/Sidebar.vue";
import MobileNavbar from "@/components/MobileNavbar.vue";
import PostCreator from "@/components/PostCreator.vue";
// Stores import
import { useUiStore } from "@/store/UiStore";
import { useAuthStore } from "@/store/AuthStore";
// Builtin functions import
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
// Utils import
import { getProfileImageUrl } from "@/utils/imageHelpers";

const route = useRoute();

const uiStore = useUiStore();
const authStore = useAuthStore();

const showSidebar = computed(() => {
  const hiddenRoutes = [
    "/login",
    "/signup",
    "/password/reset",
    "/facebook/callback",
  ];
  return !hiddenRoutes.includes(route.path);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
