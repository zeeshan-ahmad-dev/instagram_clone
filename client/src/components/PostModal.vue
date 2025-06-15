<template>
  <section
    v-if="visible"
    class="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-4"
  >
    <!-- Close Icon -->
    <div
      @click="resetCreatePost"
      class="absolute top-4 right-4 z-10 w-8 cursor-pointer"
    >
      <img
        src="https://img.icons8.com/?size=100&id=95867&format=png&color=ffffff"
        alt="Close"
      />
    </div>

    <!-- Container -->
    <div
      class="relative flex flex-col md:flex-row w-full max-w-5xl md:max-w-3xl xl:max-w-5xl h-[90vh] md:h-[55vh] xl:h-[90vh] bg-white rounded-[4px] overflow-hidden"
    >
      <!-- Left Image -->
      <div
        class="lg:w-1/2 min-h-[40vh] lg:h-auto flex-1 bg-cover bg-center"
        :style="{ backgroundImage: `url(${getProfileImageUrl(post.image)})` }"
      ></div>

      <!-- Right Content -->
      <div class="flex flex-[0.8] flex-col w-full lg:w-[58%]">
        <!-- Header -->
        <header class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center">
            <router-link :to="`${post._id}`" class="mr-3">
              <img
                :src="getProfileImageUrl(post.user.profilePicture)"
                alt="Pfp"
                class="w-10 h-10 rounded-full object-cover"
              />
            </router-link>
            <router-link
              :to="`${post._id}`"
              class="text-sm font-semibold hover:text-gray-500"
            >
              {{ post.user.username }}
            </router-link>
          </div>
          <button>
            <img class="rotate-90 w-5 h-5" :src="three_dots_icon" />
          </button>
        </header>

        <!-- Comments -->
        <div
          class="flex-1 overflow-y-scroll max-h-[25%] md:max-h-[90%] lg:max-h-none p-3 space-y-3 scrollbar-hide"
        >
          <div
            v-for="(comment, index) in postComments"
            :key="comment._id"
            class="flex items-start gap-3"
          >
            <router-link :to="comment.user" class="shrink-0">
              <img
                class="w-8 h-8 rounded-full object-cover"
                :src="getProfileImageUrl(comment.profilePicture)"
              />
            </router-link>
            <div class="flex-1">
              <div class="flex gap-1 flex-wrap text-sm">
                <router-link
                  :to="`/${comment.user}`"
                  class="font-semibold hover:underline"
                >
                  {{ comment.username }}
                </router-link>
                <p>{{ comment.text }}</p>
              </div>
              <div class="flex items-center text-xs text-gray-500 gap-4 mt-1">
                <span>3w</span>
                <button class="hover:underline">56 likes</button>
                <button class="hover:underline">Reply</button>
              </div>
            </div>
            <button class="mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-gray-600 hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <footer class="border-t relative items-self-end p-3 space-y-2">
          <div class="flex justify-between">
            <div class="flex space-x-2">
              <button @click="toggleLike">
                <img
                  class="w-6"
                  :src="isLiked ? like_icon_dark : like_icon_light"
                  alt="like"
                />
              </button>
              <button>
                <img class="w-6" :src="message_icon" alt="comment" />
              </button>
              <button>
                <img class="w-6" :src="send_icon_light" alt="share" />
              </button>
            </div>
            <button>
              <img class="w-5" :src="save_icon" alt="save" />
            </button>
          </div>

          <div class="text-sm">
            <p class="font-semibold">{{ likes }} likes</p>
            <p class="text-xs text-gray-500">47 minutes ago</p>
          </div>

          <div class="flex items-center border-t pt-2 space-x-2">
            <button @click="toggleEmojiPicker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Emoji</title>
                <path
                  d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"
                />
              </svg>
            </button>
            <input
              v-model="comment"
              @keydown.enter.prevent="postComment"
              class="flex-1 text-sm focus:outline-none"
              placeholder="Add a comment…"
            />
            <button
              class="text-blue-500 font-semibold text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': !comment.trim() }"
              :disabled="!comment.trim()"
              @click="postComment"
            >
              Post
            </button>
          </div>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/AuthStore";
import { getProfileImageUrl } from "@/utils/imageHelpers";
import message_icon from "@/assets/icons/message.svg";
import three_dots_icon from "@/assets/icons/three_dots.png";
import like_icon_light from "@/assets/icons/like_light.png";
import like_icon_dark from "@/assets/icons/like_dark.png";
import send_icon_light from "@/assets/icons/send_light.png";
import save_icon from "@/assets/icons/saved.svg";

// Props
const props = defineProps({
  post: Object,
  visible: Boolean,
});

// Emits
const emit = defineEmits(["close"]);

// Stores
const authStore = useAuthStore();

// Local state
const isLiked = ref(false);
const likes = ref(0);
const postComments = ref([]);
const comment = ref("");

// Fetch post comments and set data
watch(
  () => props.post,
  async (newPost) => {
    if (newPost) {
      const response = await axios.get(
        `http://localhost:8000/api/comments/${newPost._id}`,
        { withCredentials: true }
      );
      postComments.value = response.data.comments;
      isLiked.value = newPost.likes.includes(authStore.getUser.id);
      likes.value = newPost.likes.length;
    }
  },
  { immediate: true }
);

// Like/Unlike logic
async function toggleLike() {
  const url = isLiked.value
    ? `http://localhost:8000/api/post/unlike/${props.post._id}`
    : `http://localhost:8000/api/post/like/${props.post._id}`;

  const response = await axios.patch(url, null, { withCredentials: true });

  if (response.data.success) {
    isLiked.value = !isLiked.value;
    likes.value += isLiked.value ? 1 : -1;
  }
}

async function postComment() {
  const response = await axios.post(
    `http://localhost:8000/api/comments/add/${props.post._id}`,
    {
      message: comment.value,
      postId: props.post._id,
      userId: authStore.getUser.id,
      username: authStore.getUser.username,
      pfp: authStore.getUser.profilePicture,
    },
    { withCredentials: true }
  );

  if (response.data.success) {
    comment.value = "";
    postComments.value.push(response.data.comment);
  }
}

function resetCreatePost() {
  emit("close");
  isLiked.value = false;
  likes.value = 0;
  postComments.value = [];
  comment.value = "";
}
</script>
<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>