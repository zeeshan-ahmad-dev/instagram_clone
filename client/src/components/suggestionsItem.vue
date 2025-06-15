<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-12">
        <img class="rounded-full w-11 h-11" :src="profileImage" alt="" />
      </div>
      <div class="text-sm flex flex-col">
        <router-link :to="userId" class="font-semibold">{{ username }}</router-link>
        <span class="text-[#737373]">{{ fullName }}</span>
      </div>
    </div>
    <div>
      <button
        v-if="buttonText === 'Switch'"
        @click="onButtonClick"
        class="text-xs text-[#0095F6] font-semibold hover:text-[#00376b]"
      >
        Switch
      </button>
      <button
        v-else-if="!isFollowing"
        @click="followUser"
        class="text-xs text-[#0095F6] font-semibold hover:text-[#00376b]"
      >
        Follow
      </button>
      <button
        v-else
        @click="unfollowUser"
        class="text-xs text-black font-semibold hover:text-[#00376b]"
      >
        Following
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps({
  profileImage: {
    type: String,
    required: true,
  },
  userId: {
    type: String
  },
  username: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  isFollowing: {
    type: Boolean,
  },
  onButtonClick: {
    type: Function,
    default: () => {},
  },
  buttonText: {
    type: String
  }
});

const isFollowing = ref(props.isFollowing)

async function followUser() {
  const response = await axios.post(
    `http://localhost:8000/api/user/follow/${props.userId}`,
    null,
    { withCredentials: true }
  );

  if (response.data.success) {
    isFollowing.value = !isFollowing.value;
  }
}

async function unfollowUser() {
  const response = await axios.post(
    `http://localhost:8000/api/user/unfollow/${props.userId}`,
    null,
    { withCredentials: true }
  );

  if (response.data.success) {
    isFollowing.value = !isFollowing.value;
  }
}
</script>
