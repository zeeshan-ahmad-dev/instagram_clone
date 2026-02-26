<template>
  <!-- Post Preview Modal -->
  <PostModal
    :post="selectedPost"
    :visible="previewPost"
    :is-post-loading="isPostLoading"
    @close="resetCreatePost"
  />

  <!-- Main Layout: Feed + Sidebar -->
  <main class="flex flex-col w-full h-full overflow-y-scroll md:flex-row">
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
          class="relative flex items-center justify-start w-full gap-2 px-1 overflow-x-scroll md:gap-4 scroll-snap-x snap-mandatory scrollbar-hide"
        >
          <div
            ref="storyItem"
            v-for="(story, index) in stories"
            :key="index"
            class="flex flex-col items-center justify-center snap-start"
          >
            <div
              class="relative flex items-center justify-center text-white rounded-full insta-gradient size-20"
            >
              <div
                class="absolute z-0 rounded-full size-[4.5rem] bg-white"
              ></div>
              <div class="z-10">
                <img
                  class="relative rounded-full size-16"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvY6JTyXURaXSALU_6PoyG0fuZMvRaSlm6Kw&s"
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
      <section class="w-full py-6 md:px-16 lg:px-40 xl:px-16">
        <div v-if="isLoading">
          <PostSkeleton v-for="i in 3" :key="i" />
        </div>
        <div v-if="allPosts.length > 0" class="space-y-5">
          <Post
            v-for="(post, index) in allPosts"
            @preview-post="handlePostClick(post)"
            :key="post._id"
            :post="post"
          />
          <div ref="loadMoreTrigger" class="h-2"></div>
          <div v-if="isFetchingMore" class="flex justify-center py-4">
            <div class="w-6 h-6 border-4 border-gray-200 rounded-full loader border-t-gray-500 animate-spin"></div>
          </div>
          <CaughtUpMessage v-else />
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
          <SuggestionsItemSkeleton v-if="isLoading" v-for="i in 3" :key="i" />
          <suggestionItem
            v-else
            v-for="(user, index) in suggestedUsers"
            :key="user._id"
            :profileImage="getProfileImageUrl(user.profilePicture)"
            :user-id="user._id"
            :username="user.username"
            :fullName="user.fullName"
            :isFollowing="user.followers.includes(authStore.getUser.id)"
            :onButtonClick="
              () =>
                user.followers.includes(authStore.getUser.id)
                  ? unfollowUser(user)
                  : followUser(user)
            "
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
import PostSkeleton from "@/components/skeletons/PostSkeleton.vue";
import SuggestionsItemSkeleton from "@/components/skeletons/SuggestionsItemSkeleton.vue";

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
    story: 5,
  },
];

const authStore = useAuthStore();

// Reactive States
const storyContainer = ref(null);
const showNextBtn = ref(true);
const showPrevBtn = ref(false);
const scrollLeft = ref(0);
const suggestedUsers = ref([]);
const allPosts = ref([]);
const isLoading = ref(false);
const isPostLoading = ref(false);

// Reactive States for postModal
const previewPost = ref(false);
const selectedPost = ref(null);

// Loading triggering more posts on scroll
let page = 1;
const limit = 4;
const hasMore = ref(true);
const isFetchingMore = ref(false);
const loadMoreTrigger = ref(null);
let observer = null;

function handleKeyUp(e) {
  if (e.key === "Escape" && previewPost.value) {
    resetCreatePost();
  }
}

async function fetchPosts() {
  if (isFetchingMore.value || !hasMore.value) return;
  isFetchingMore.value = true;

  try {
    const postResponse = await axios.get(`http://localhost:8000/api/post?page=${page}&limit=${limit}`, { withCredentials: true, });

    allPosts.value.push(...postResponse.data.posts);
  } catch (error) {
    console.log(error);
  } finally {
    isFetchingMore.value = false;
  }
  console.log("end",page);
  page++;
}

onMounted(async () => {
  isLoading.value = true;
  window.addEventListener("keyup", handleKeyUp);
  await fetchPosts();
  isLoading.value = false;

  try {
    const res = await axios.get("http://localhost:8000/api/user", {
      withCredentials: true,
    });
    suggestedUsers.value = res.data.users;
    suggestedUsers.value = suggestedUsers.value.filter(
      (user) => user._id !== authStore.getUser.id,
    );
  } catch (error) {
    console.log(error)
  }
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        fetchPosts();
      }
    },
    { root: null, threshold: 0.5 },
  );

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value);
});

onMounted(() => {
  
});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeyUp);
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value);
  }
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
  isPostLoading.value = true;
  try {
    const res = await axios.get(`http://localhost:8000/api/post/${post._id}`, {
      withCredentials: true,
    });
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

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
