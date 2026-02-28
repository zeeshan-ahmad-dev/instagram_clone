<template>
  <PostModal
    :post="selectedPost"
    :visible="previewPost"
    :is-post-loading="isPostLoading"
    @close="resetCreatePost"
  />

  <main
    class="w-full h-screen px-0 overflow-y-auto md:px-6 lg:px-4 xl:px-24 scrollbar-hide"
  >
    <!-- Profile Section -->
    <section class="px-4 pb-12 border-b md:py-16 md:space-y-12">
      <div v-if="user" class="pt-10 md:px-6 md:py-0">
        <div
          class="flex items-center py-4 gap-7 md:flex-row lg:gap-10 xl:gap-24 xl:px-10 xl:pr-16 md:py-0"
        >
          <!-- Profile image -->
          <div>
            <img
              class="object-cover rounded-full size-20 md:w-[9.5rem] md:h-[9.5rem]"
              :src="getProfileImageUrl(user.profilePicture)"
              alt="Profile Picture"
            />
          </div>

          <!-- User Info -->
          <div class="space-y-3 md:space-y-5">
            <div
              class="flex flex-col gap-3 text-sm font-semibold md:flex-row md:items-center md:gap-2"
            >
              <div class="flex items-center">
                <span
                  class="mr-4 text-sm md:text-lg font-normal md:font-medium truncate max-w-[10rem] md:max-w-[12rem] overflow-hidden whitespace-nowrap"
                >
                  {{ user.username }}
                </span>
                <button class="md:hidden">
                  <img
                    class="w-6 rotate-90"
                    :src="three_dots_icon"
                    alt="Options"
                  />
                </button>
              </div>
              <!-- Buttons -->
              <div class="flex gap-2">
                <button
                  v-if="!isFollowing"
                  @click="followUser"
                  class="px-4 py-[0.3rem] transition-all duration-100 bg-blue-600 text-white rounded-md text-nowrap hover:bg-blue-700"
                >
                  Follow
                </button>
                <button
                  v-else
                  @click="unfollowUser"
                  class="px-4 py-[0.3rem] transition-all bg-gray-200 rounded-md text-nowrap hover:bg-gray-300"
                >
                  Following
                </button>
                <button
                  class="px-4 py-[0.3rem] transition-all bg-gray-200 rounded-md text-nowrap hover:bg-gray-300"
                >
                  Message
                </button>
                <button class="p-1 bg-gray-200 rounded-md">
                  <img
                    class="w-5"
                    :src="similar_person_icon"
                    alt="Similar Account"
                  />
                </button>
              </div>

              <button class="hidden p-1 rounded-md md:block">
                <img
                  class="w-6 rotate-90"
                  :src="three_dots_icon"
                  alt="Options"
                />
              </button>
            </div>

            <!-- Stats for md+ screens -->
            <div
              class="flex-wrap hidden gap-6 text-sm md:flex md:gap-10 md:text-base"
            >
              <div class="flex gap-1">
                <span class="font-semibold">{{ posts.length }}</span>
                <span class="text-[#737373]">post</span>
              </div>
              <div class="flex gap-1">
                <span class="font-semibold">{{ followers || 0 }}</span>
                <span class="text-[#737373]">followers</span>
              </div>
              <div class="flex gap-1">
                <span class="font-semibold">{{
                  user.following?.length || 0
                }}</span>
                <span class="text-[#737373]">following</span>
              </div>
            </div>

            <!-- Name and bio (md+) -->
            <div class="hidden md:block">
              <span class="text-sm font-semibold">{{ user.fullName }}</span>
              <p class="text-sm">{{ user.bio }}</p>
            </div>
          </div>
        </div>

        <!-- Name and bio (mobile) -->
        <div class="mt-4 md:hidden">
          <h3 class="text-sm font-semibold">{{ user.fullName }}</h3>
          <p class="text-sm">{{ user.bio }}</p>
        </div>
      </div>

      <!-- New Story Button -->
      <div class="justify-start hidden px-4 cursor-pointer md:flex md:px-8">
        <div class="flex flex-col items-center gap-3 w-30">
          <div class="w-[90px] h-[90px] p-1 border rounded-full relative">
            <div
              class="w-full h-full bg-[#F5F5F5] rounded-full before:content-[''] before:absolute before:h-[3px] before:rounded-2xl before:w-[35px] before:bg-[#C7C7C7] before:left-[27px] before:top-[42px] after:content-[''] after:absolute after:h-[3px] after:rounded-2xl after:w-[35px] after:bg-[#C7C7C7] after:left-[27px] after:rotate-90 after:top-[42px]"
            ></div>
          </div>
          <span class="text-[0.7rem] font-bold">New</span>
        </div>
      </div>
    </section>

    <!-- Stats (mobile only) -->
    <div class="flex flex-wrap justify-around gap-6 py-2 text-sm md:hidden">
      <div class="flex flex-col items-center">
        <span class="font-semibold">{{ posts.length }}</span>
        <span class="text-[#737373]">post</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-semibold">{{ followers || 0 }}</span>
        <span class="text-[#737373]">followers</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="font-semibold">{{ user.following?.length || 0 }}</span>
        <span class="text-[#737373]">following</span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="flex justify-center border-t md:border-none">
      <ul class="flex w-full gap-6 md:w-auto md:gap-16">
        <li class="flex-1">
          <button
            @click="activeTab = 'posts'"
            :class="[
              'flex justify-center gap-2 py-3 w-full md:w-auto text-xs',
              activeTab === 'posts'
                ? 'border-t border-black font-semibold'
                : '',
            ]"
          >
            <img class="w-5 md:w-[0.65rem]" :src="grid_icon" alt="" />
            <p class="hidden md:inline-block">POSTS</p>
          </button>
        </li>
        <li class="flex-1">
          <button
            @click="activeTab = 'saved'"
            :class="[
              'flex justify-center gap-2 py-3 w-full md:w-auto text-xs',
              activeTab === 'saved'
                ? 'border-t border-black font-semibold'
                : '',
            ]"
          >
            <img class="w-5 md:w-[0.65rem]" :src="saved_icon" alt="" />
            <p class="hidden md:inline-block">SAVED</p>
          </button>
        </li>
        <li class="flex-1">
          <button
            @click="activeTab = 'tagged'"
            :class="[
              'flex justify-center gap-2 py-3 w-full md:w-auto text-xs',
              activeTab === 'tagged'
                ? 'border-t border-black font-semibold'
                : '',
            ]"
          >
            <img class="w-5 md:w-[0.65rem]" :src="tag_icon" alt="" />
            <p class="hidden md:inline-block">TAGGED</p>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Posts Grid -->
    <section
      :class="['gap-1 py-4', posts.length > 0 ? 'grid grid-cols-3' : '']"
    >
      <div
        v-if="posts.length > 0"
        v-for="(post, index) in posts"
        :key="index"
        @click="handlePostClick(post)"
        class="aspect-[3/4] w-full cursor-pointer bg-cover group"
        :style="{ backgroundImage: `url(${post.image})` }"
      >
        <div
          class="h-full hidden group-hover:grid place-content-center w-full group-hover:bg-[#00000095]"
        >
          <div class="flex gap-1">
            <img class="w-5 h-5 bg-cover" :src="message_icon" />
            <span class="text-sm font-bold text-white">{{
              post.comments.length
            }}</span>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center gap-5 py-6 text-center">
        <div class="px-2 py-1 border border-black rounded-full">
          <img class="h-16 w-14" :src="camera_icon" alt="" />
        </div>
        <h2 class="text-4xl font-bold">No Posts Yet</h2>
      </div>
    </section>

    <!-- Edit Profile Modal -->
    <EditProfileModal
      v-if="showEditModal"
      :currentPfp="getProfileImageUrl(user.profilePicture)"
      :currentBio="user.bio"
      @close="showEditModal = false"
      @save="handleProfileSave"
    />
    <Footer class="hidden md:flex" />
  </main>
</template>

<script setup>
// Icons import
import grid_icon from "@/assets/icons/grid.svg";
import saved_icon from "@/assets/icons/saved.svg";
import tag_icon from "@/assets/icons/tag.svg";
import message_icon from "@/assets/icons/message.svg";
import camera_icon from "@/assets/icons/camera_icon.png";
import similar_person_icon from "@/assets/icons/addPerson.webp";
import three_dots_icon from "@/assets/icons/three_dots.png";
// Components import
import Footer from "@/components/Footer.vue";
import EditProfileModal from "@/components/EditProfile.vue";
import PostModal from "@/components/PostModal.vue";
// Vues components import
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
// Utility function imports
import { getProfileImageUrl } from "@/utils/imageHelpers";
import { useAuthStore } from "@/store/AuthStore";
import api from "@/api";

const route = useRoute();
const authStore = useAuthStore();

const activeTab = ref("posts");
const showEditModal = ref(false);
const user = ref([]);
const posts = ref([]);
const followers = ref(0);
const isFollowing = ref(false);
const isPostLoading = ref(false);

// Reactive's For PostModal
const previewPost = ref(false);
const selectedPost = ref(null);

const userId = route.params.userId;

onMounted(async () => {
  fetchUser(userId);
});

async function fetchUser(id) {
  try {
    const response = await api.get(
      `/api/user/profile/${id}`,
    );

    user.value = response.data.user;
    posts.value = response.data.posts;
    followers.value = response.data.user.followers.length;
    isFollowing.value = response.data.user.followers.includes(
      authStore.getUser.id,
    );
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

async function followUser() {
  const response = await api.post(
    `/api/user/follow/${user.value.id}`,
    null,
  );

  if (response.data.success) {
    isFollowing.value = !isFollowing.value;
    followers.value++;
  }
}

async function unfollowUser() {
  const response = await api.post(
    `/api/user/unfollow/${user.value.id}`,
    null,
  );

  if (response.data.success) {
    followers.value--;
    isFollowing.value = !isFollowing.value;
  }
}


async function handlePostClick(post) {
  isPostLoading.value = true;
  try {
    const res = await api.get(`/api/post/${post._id}`);
    selectedPost.value = res.data.post;
    previewPost.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    isPostLoading.value = false;
  }
}
function resetCreatePost() {
  previewPost.value = false;
  selectedPost.value = null;
}
</script>
