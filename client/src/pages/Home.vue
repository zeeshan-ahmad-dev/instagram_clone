<template>
  <!-- Post Preview Modal -->
  <PostModal
    :post="selectedPost"
    :visible="previewPost"
    @close="resetCreatePost"
  />

  <!-- Main Layout: Feed + Sidebar -->
  <main class="flex flex-col md:flex-row w-full overflow-y-scroll h-full">
    <!-- Feed Section -->
    <div
      class="relative w-full xl:w-[53vw] md:px-12 py-6 flex flex-col items-center"
    >
      <!-- Story Carousel -->
      <div class="relative w-full md:max-w-[96%] lg:max-w-[70%] xl:max-w-[96%]">
        <!-- Prev Button -->
        <button
          v-if="showPrevBtn"
          @click="prevStories"
          class="absolute z-50 p-2 bg-white rounded-full top-5 md:left-4"
        >
          <img
            class="w-[10px] h-[10px] rotate-180"
            :src="to_right_svg"
            alt="Prev"
          />
        </button>

        <!-- Story Scroll Container -->
        <div
          ref="storyContainer"
          @scroll="handleScroll"
          class="relative flex items-center justify-start w-full gap-2 md:gap-4 overflow-x-scroll scroll-snap-x snap-mandatory px-1 scrollbar-hide"
        >
          <div
            ref="storyItem"
            v-for="(story, index) in stories"
            :key="index"
            class="snap-start flex flex-col items-center justify-center"
          >
            <div
              class="insta-gradient text-white rounded-full size-20 flex items-center justify-center relative"
            >
              <div class="absolute z-0 rounded-full size-[4.5rem] bg-white"></div>
              <div class="z-10">
                <img
                  class="relative rounded-full size-16"
                  src="https://i.pinimg.com/236x/68/31/12/68311248ba2f6e0ba94ff6da62eac9f6.jpg"
                  alt="Story"
                />
              </div>
            </div>
            <div class="w-16 text-xs font-semibold text-center truncate">
              {{ story.story }}
            </div>
          </div>
        </div>

        <!-- Next Button -->
        <button
          v-if="showNextBtn"
          @click="nextStories"
          class="absolute z-50 p-2 bg-white rounded-full right-2 top-5 md:right-4"
        >
          <img class="w-[10px] h-[10px]" :src="to_right_svg" alt="Next" />
        </button>
      </div>

      <!-- Posts Section -->
      <section class="w-full px- md:px-16 lg:px-40 xl:px-16 py-6">
        <div v-if="allPosts.length > 0" class="space-y-5">
          <Post
            v-for="(post, index) in allPosts"
            @preview-post="handlePostClick(post)"
            :key="post._id"
            :post="post"
          />
          <CaughtUpMessage />
        </div>
        <NoPosts v-else />
      </section>
    </div>

    <!-- Suggestions Sidebar -->
    <aside class="hidden xl:block xl:w-[30vw] py-8 px-6">
      <div>
        <suggestionItem
          :profileImage="getProfileImageUrl(authStore.getUser.profilePicture)"
          :username="authStore.getUser.username"
          :fullName="authStore.getUser.fullName"
          :onButtonClick="() => {}"
          buttonText="Switch"
        />

        <div class="flex justify-between pt-6 pb-4 text-sm">
          <span class="text-[#737373] font-semibold">Suggested for you</span>
          <span class="text-xs font-bold cursor-pointer hover:text-gray-500"
            >See All</span
          >
        </div>

        <!-- Suggested Users List -->
        <div class="space-y-3">
          <suggestionItem
            v-for="(user, index) in suggestedUsers"
            :key="user._id"
            :profileImage="getProfileImageUrl(user.profilePicture)"
            :user-id="user._id"
            :username="user.username"
            :fullName="user.fullName"
            :isFollowing="user.followers.includes(authStore.getUser.id)"
            :onButtonClick="() => user.followers.includes(authStore.getUser.id) ? unfollowUser(user) : followUser(user)"
          />
        </div>

        <!-- Footer -->
        <HomeSidebarFooter />
      </div>
    </aside>
  </main>
</template>


<script setup>
// Icons import
import to_right_svg from "@/assets/icons/to_right.svg";
// components import
import suggestionItem from "@/components/suggestionsItem.vue";
import NoPosts from "@/components/NoPosts.vue";
import Post from "@/components/Post.vue";
import CaughtUpMessage from "@/components/CaughtUpMessage.vue";
import HomeSidebarFooter from "@/components/HomeSidebarFooter.vue";
import PostModal from "@/components/PostModal.vue";
// Stores import
import { useAuthStore } from "@/store/AuthStore";
// Vues components
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
// Utils Import
import { getProfileImageUrl } from "@/utils/imageHelpers";

const stories = [
  {
    story: 1,
  },
  {
    story: 2,
  },
  {
    story: 3,
  },
  {
    story: 4,
  },
  {
    story: 3,
  },
  {
    story: 4,
  },
  {
    story: 4,
  }
];

const authStore = useAuthStore();

// Reactive States
const storyContainer = ref(null);
const storyItem = ref(null);
const showNextBtn = ref(true);
const showPrevBtn = ref(false);
const scrollLeft = ref(0);
const suggestedUsers = ref([]);
const allPosts = ref([]);

// Reactive States for postModal
const previewPost = ref(false);
const selectedPost = ref(null);

function handleKeyUp(e) {
  if (e.key === "Escape" && previewPost.value) {
    resetCreatePost();
  }
}

onMounted(async () => {
  window.addEventListener("keyup", handleKeyUp);

  const [postResponse, userResponse] = await Promise.all([
    axios.get("http://localhost:8000/api/post/", { withCredentials: true }),
    axios.get("http://localhost:8000/api/user", { withCredentials: true }),
  ]);

  allPosts.value = postResponse.data.posts;
  suggestedUsers.value = userResponse.data.users;
  suggestedUsers.value = suggestedUsers.value.filter((user) => user._id !== authStore.getUser.id)

});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeyUp);
});

const isAtStart = () => {
  return storyContainer.value?.scrollLeft === 0;
};
const isAtEnd = () => {
  const el = storyContainer.value;
  return el.scrollLeft + el.clientWidth >= el.scrollWidth;
};

const handleScroll = () => {
  scrollLeft.value = storyContainer.value.scrollLeft;

  showPrevBtn.value = !isAtStart();
  showNextBtn.value = !isAtEnd();
};

const nextStories = () => {
  storyContainer.value?.scrollBy({
    left: storyContainer.value.clientWidth,
    behavior: "smooth",
  });

  showPrevBtn.value = true;

  if (isAtEnd()) {
    showNextBtn.value = false;
  }
};

const prevStories = () => {
  storyContainer.value?.scrollBy({
    left: -storyContainer.value.clientWidth,
    behavior: "smooth",
  });

  showNextBtn.value = true;

  if (isAtStart()) {
    showPrevBtn.value = false;
  }
};

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
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
