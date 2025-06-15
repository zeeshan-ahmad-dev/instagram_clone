<template>
  <div>
    <!-- Post Preview Modal -->
    <PostModal
      :post="selectedPost"
      :visible="previewPost"
      @close="resetCreatePost"
      aria-modal="true"
      tabIndex="1"
    />

    <main
      class="px-0 w-full md:px-6 lg:px-4 xl:px-24 overflow-y-auto h-screen scrollbar-hide"
    >
      <!-- Profile Section -->
      <section class="px-4 md:py-16 pb-12 border-b md:space-y-12">
        <!-- Render if User is logded in -->
        <div v-if="authStore.getUser" class="md:px-6 pt-10 md:py-0">
          <div
            class="flex gap-7 items-center md:flex-row lg:gap-10 xl:gap-24 xl:px-10 xl:pr-16 py-4 md:py-0"
          >
            <!-- Profile image -->
            <div>
              <img
                class="bg-cover bg-center rounded-full size-20 md:w-[9.5rem] md:h-[9.5rem]"
                :src="getProfileImageUrl(authStore.getUser.profilePicture)"
                alt="Profile Picture"
              />
            </div>

            <!-- Profile info: username, buttons, stats, full name -->
            <div class="space-y-3 md:space-y-5">
              <div
                class="flex flex-col md:flex-row md:items-center gap-3 text-sm font-semibold md:gap-2"
              >
                <div class="flex items-center">
                  <span
                    class="mr-4 text-sm md:text-lg font-normal md:font-medium truncate max-w-[10rem] md:max-w-[12rem] overflow-hidden whitespace-nowrap"
                    >{{ authStore.getUser.username }}</span
                  >
                  <!-- Gear icon for profile settings -->
                  <div class="relative">
                    <!-- Dropdown menu -->
                    <div
                      v-if="isMoreActive"
                      class="absolute translate-y-10 -translate-x-12 w-40 md:flex md:flex-col md:text-left shadow-[0_0_16px_rgba(0,0,0,0.2)] md:justify-start md:text-sm overflow-visible bg-white rounded-xl p-2"
                    >
                      <button
                        class="text-left px-4 py-2 hover:bg-gray-100 trnasition-all rounded-xl"
                      >
                        Switch accounts
                      </button>
                      <div
                        class="h-0.5 bg-gray-100 overflow-hidden -mx-2 my-2"
                      ></div>
                      <button
                        @click="Logout"
                        class="text-left px-4 py-2 hover:bg-gray-100 trnasition-all rounded-xl"
                      >
                        Log out
                      </button>
                    </div>

                    <button @click="handleMoreBtnClick" class="md:hidden">
                      <img class="w-5" :src="gear_icon" alt="Settings" />
                    </button>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="showEditModal = true"
                    class="px-4 py-[0.3rem] transition-all bg-gray-200 rounded-md text-nowrap hover:bg-gray-300"
                  >
                    Edit profile
                  </button>
                  <button
                    class="px-4 py-[0.3rem] transition-all bg-gray-200 rounded-md text-nowrap hover:bg-gray-300"
                  >
                    View archive
                  </button>
                </div>
                <!-- Gear icon for profile settings -->
                <div class="hidden">
                  <img class="w-5" :src="gear_icon" alt="Settings" />
                </div>
              </div>

              <!-- Post, follower, following stats -->
              <div
                class="hidden md:flex flex-wrap gap-6 text-sm md:gap-10 md:text-base"
              >
                <div class="flex items-center gap-1">
                  <span class="font-semibold">{{
                    authStore.getPosts.length
                  }}</span>
                  <span class="text-[#737373]">post</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-semibold">{{
                    authStore.getUser.followers
                  }}</span>
                  <span class="text-[#737373]">followers</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="font-semibold">{{
                    authStore.getUser.following
                  }}</span>
                  <span class="text-[#737373]">following</span>
                </div>
              </div>
              <div class="hidden md:block">
                <span class="text-sm font-semibold">{{
                  authStore.getUser.fullName
                }}</span>
              </div>
            </div>
          </div>
          <!-- Info: only for small screens -->
          <div class="mt-4 md:hidden">
            <h3 class="text-sm font-semibold">
              {{ authStore.getUser.fullName }}
            </h3>
          </div>
        </div>

        <!-- New Story -->
        <div class="hidden md:flex justify-start px-4 cursor-pointer md:px-8">
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

      <!-- Post, Followers and Following Stats: only for small screens -->
      <div
        class="flex md:hidden py-2 md:py-0 flex-wrap justify-around md:justify-center gap-6 text-sm md:gap-10 md:text-base"
      >
        <div class="flex flex-col text-base md:text-base items-center md:gap-1">
          <span class="font-semibold">{{ authStore.getPosts.length }}</span>
          <span class="text-[#737373]">post</span>
        </div>
        <div class="flex flex-col text-base md:text-base items-center md:gap-1">
          <span class="font-semibold">{{ authStore.getUser.followers }}</span>
          <span class="text-[#737373]">followers</span>
        </div>
        <div class="flex flex-col text-base md:text-base items-center md:gap-1">
          <span class="font-semibold">{{ authStore.getUser.following }}</span>
          <span class="text-[#737373]">following</span>
        </div>
      </div>
      <!-- Navigation tabs: Posts / Saved / Tagged -->
      <nav class="flex border-t md:border-none justify-center">
        <ul class="flex w-full md:w-auto gap-6 md:gap-16">
          <li class="flex-1">
            <button
              @click="activeTab = 'posts'"
              :class="[
                'flex justify-center gap-2 py-3 w-full md:w-auto select-none cursor-pointer text-xs',
                activeTab === 'posts'
                  ? 'border-t border-black  font-semibold'
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
                'flex justify-center gap-2 py-3 w-full md:w-auto select-none cursor-pointer text-xs',
                activeTab === 'saved'
                  ? 'border-t border-black  font-semibold'
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
                'flex justify-center gap-2 py-3 w-full md:w-auto select-none cursor-pointer text-xs',
                activeTab === 'tagged'
                  ? 'border-t border-black  font-semibold'
                  : '',
              ]"
            >
              <img class="w-5 md:w-[0.65rem]" :src="tag_icon" alt="" />
              <p class="hidden md:inline-block">TAGGED</p>
            </button>
          </li>
        </ul>
      </nav>

      <!-- User posts grid or empty state -->
      <section
        :class="[
          'gap-1 py-4',
          authStore.getPosts.length > 0 ? 'grid grid-cols-3' : '',
        ]"
      >
        <div
          @click="handlePostClick(post)"
          v-if="authStore.getPosts.length > 0"
          v-for="(post, index) in authStore.getPosts"
          :key="index"
          class="aspect-[3/4] w-full cursor-pointer bg-cover group"
          :style="{
            backgroundImage: `url(http://localhost:8000${post.image})`,
          }"
          to="/"
        >
          <div
            class="h-full hidden group-hover:grid place-content-center w-full group-hover:bg-[#00000095]"
          >
            <div class="flex flex-col items-center gap-1">
              <img class="w-5 h-5 bg-cover" :src="comment_light" />
              <span class="text-sm font-bold text-white">{{
                post.comments.length
              }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6 flex flex-col items-center gap-5">
          <div class="py-1 px-2 border border-black rounded-full">
            <img class="w-14 h-16" :src="camera_icon" alt="" />
          </div>
          <h2 class="text-4xl font-bold">No Posts Yet</h2>
        </div>
      </section>
      <EditProfileModal
        v-if="showEditModal"
        :currentPfp="getProfileImageUrl(authStore.getUser.profilePicture)"
        :currentBio="authStore.getUser.bio"
        @close="showEditModal = false"
        @save="handleProfileSave"
      />
      <Footer class="hidden md:flex" />
    </main>
  </div>
</template>

<script setup>
// Icons import
import gear_icon from "@/assets/icons/gear.svg";
import grid_icon from "@/assets/icons/grid.svg";
import saved_icon from "@/assets/icons/saved.svg";
import tag_icon from "@/assets/icons/tag.svg";
import camera_icon from "@/assets/icons/camera_icon.png";
import comment_light from "@/assets/icons/comment_light.svg";
// Components import
import Footer from "@/components/Footer.vue";
import EditProfileModal from "@/components/EditProfile.vue";
import PostModal from "@/components/PostModal.vue";
// Vues components import
import { ref, onMounted, onBeforeUnmount } from "vue";
// Stores import
import { useAuthStore } from "@/store/AuthStore";
import { useUiStore } from "@/store/UiStore";
// third party imports
import axios from "axios";
// Utility function imports
import { getProfileImageUrl } from "@/utils/imageHelpers";

// Store Initialization
const uiStore = useUiStore();
const authStore = useAuthStore();

// UI State
const activeTab = ref("posts");
const showEditModal = ref(false);
const previewPost = ref(false);
const selectedPost = ref(null);
const isMoreActive = ref(false);

function handleMoreBtnClick() {
  isMoreActive.value = !isMoreActive.value;
}

function handleKeyUp(e) {
  if (e.key === "Escape" && previewPost.value) {
    resetCreatePost();
  }
}

async function Logout() {
  await axios.post("http://localhost:8000/api/user/signout", null, {
    withCredentials: true,
  });
  handleMoreBtnClick();
  authStore.logout();
  router.push("/login");
}

onMounted(async () => {
  window.addEventListener("keyup", handleKeyUp);
  if (window.location.href === "#_=_") {
    history.replaceState(null, "#_=_", window.location.pathname);
  }
  if (!authStore.isLoggedIn) {
    try {
      const response = await axios.get("http://localhost:8000/api/user/me", {
        withCredentials: true,
      });

      authStore.login(response.data.user); // store user data
      authStore.storePosts(response.data.posts); // store user's posts
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeyUp);
});

async function handleProfileSave({ bio, profilePicture }) {
  try {
    const formData = new FormData();
    formData.append("image", profilePicture);
    formData.append("bio", bio);

    await axios.post("http://localhost:8000/api/user/update/me", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log("error:", error);
  }
}

async function handlePostClick(post) {
  const res = await axios.get(`http://localhost:8000/api/post/${post._id}`, {
    withCredentials: true,
  });
  selectedPost.value = res.data.post;
  previewPost.value = true;
}

function resetCreatePost() {
  previewPost.value = false;
  selectedPost.value = null;
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
