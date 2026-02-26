<template>
  <!-- Post container -->
  <article class="border-b border-[#dbdbdb] pb-2 md:pb-0">
    <!-- Header: Profile Info and Menu -->
    <div class="flex items-center justify-between px-4 md:px-0">
      <div class="flex gap-2">
        <!-- Profile Image with Instagram Gradient -->
        <div
          class="insta-gradient text-white rounded-full size-[42px] flex items-center justify-center relative"
        >
          <div class="absolute z-0 bg-white rounded-full size-[38px]"></div>
          <div class="z-10">
            <img
              class="relative rounded-full cursor-pointer md:size-8"
              :src="getProfileImageUrl(post.user.profilePicture)"
              alt="Users profile Picture"
            />
          </div>
        </div>

        <!-- Username and Time -->
        <div class="justify-self-start">
          <div class="flex items-center gap-2">
            <router-link
              :to="`/user/${post.user._id}`"
              class="text-sm font-bold cursor-pointer"
            >
              {{ post.user.username }}
            </router-link>
            <div class="rounded-full bg-[#737373] size-1"></div>
            <span class="text-[#737373] text-sm font-medium">{{postCreatedAt}}</span>
          </div>
          <div class="text-xs">
            <span>Original audio</span>
          </div>
        </div>
      </div>

      <!-- Post Menu (e.g., options) -->
      <div>
        <button>
          <img class="size-4" :src="menu_icon" alt="" />
        </button>
      </div>
    </div>

    <!-- Post Image -->
    <div
      class="h-[585px] overflow-hidden bg-black rounded-md border border-gray-200 my-3"
    >
      <img
        :src="`http://localhost:8000${post.image}`"
        class="object-contain w-full h-full"
        alt="Post Image"
        loading="lazy"
      />
    </div>

    <!-- Post Actions and Details -->
    <div class="px-4 md:px-0">
      <!-- Like, Comment, Share, Bookmark Buttons -->
      <div class="flex justify-between">
        <div class="space-x-3">
          <button @click="likePost">
            <img
              class="size-7"
              :src="isLiked ? like_dark_icon : like_light_icon"
              alt="like"
            />
          </button>
          <button @click="previewPost">
            <img class="size-7" :src="comment_icon" alt="comments" />
          </button>
          <button>
            <img class="size-7" :src="send_light_icon" alt="share" />
          </button>
        </div>
        <div>
          <button @click="toggleSavedPost" class="mr-2">
            <img
              v-if="isSaved"
              class="size-5"
              :src="bookmark_light_icon"
              alt="save"
            />
            <img
              v-else
              class="w-8 size-5"
              :src="bookmark_dark_icon"
              alt="save"
            />
          </button>
        </div>
      </div>

      <!-- Likes and Caption -->
      <div class="space-y-1">
        <div class="space-x-1 text-sm font-semibold">
          <span>{{ likes }}</span>
          <span>likes</span>
        </div>

        <!-- Caption -->
        <div
          class="flex flex-wrap items-center space-x-1 overflow-hidden text-sm"
        >
          <span class="font-semibold">{{ post.user.username }}</span>
          <span
            :class="[
              showMore
                ? 'whitespace-normal'
                : 'truncate max-w-[4rem] md:max-w-[16rem] overflow-hidden whitespace-nowrap',
            ]"
          >
            {{ post.caption }}
          </span>
          <span
            v-if="post?.caption.length > 40 && !showMore"
            @click="showMore = true"
            class="text-[#737373] cursor-pointer"
            >more</span
          >
        </div>

        <!-- Comment preview trigger -->
        <div @click="previewPost" class="text-sm cursor-pointer text-[#737373]">
          View all <span>{{ post.comments.length }}</span> comments
        </div>

        <!-- Add Comment -->
        <div class="hidden lg:block">
          <div class="flex items-start justify-between w-full">
            <div class="w-full">
              <textarea
                class="w-full text-sm outline-none resize-none min-h-10"
                name="comment"
                id="comment"
                placeholder="Add a comment..."
                aria-label="Add a comment"
                v-model="commentText"
              ></textarea>
            </div>

            <!-- Post button appears when there is text -->
            <button
              v-if="commentText"
              type="button"
              class="py-1 hover:opacity-70 text-[#0095f6] hover:text-[#00376b] font-semibold"
            >
              Post
            </button>
            <button type="button" class="p-2 hover:opacity-70">
              <img class="size-5" :src="smile_face_icon" alt="emojis" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
// Imports
import like_light_icon from "@/assets/icons/like_light.png";
import like_dark_icon from "@/assets/icons/like_dark.png";
import send_light_icon from "@/assets/icons/send_light.png";
import bookmark_light_icon from "@/assets/icons/bookmark_light.svg";
import bookmark_dark_icon from "@/assets/icons/bookmark_dark.svg";
import smile_face_icon from "@/assets/icons/smile_face.png";
import menu_icon from "@/assets/icons/menu_icon.svg";
import comment_icon from "@/assets/icons/comment.svg";
import axios from "axios";
import { ref, defineProps, defineEmits, onMounted } from "vue";
import { useAuthStore } from "@/store/AuthStore";
import { getProfileImageUrl } from "@/utils/imageHelpers";
import { formatTimeAgo } from "@/utils/timeAgo";

const authStore = useAuthStore();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["preview-post"]);

const commentText = ref("");
const isLiked = ref(props.post?.likes?.includes(authStore.getUser.id));
const likes = ref(props.post.likes.length);
const isSaved = ref(!authStore.getUser.savedPosts?.includes(props.post._id));
const showMore = ref(false);
const postCreatedAt = ref("0s");

// Emit preview-post event to show full post view
function previewPost() {
  emit("preview-post", {
    post: props.post,
    likeStatus: isLiked.value,
    postLikes: likes.value,
  });
}

onMounted(() => {
  postCreatedAt.value = formatTimeAgo(props.post?.createdAt);
})

// Handles like/unlike logic and UI updates
async function likePost() {
  isLiked.value = !isLiked.value;
  likes.value = isLiked.value ? likes.value + 1 : likes.value - 1;
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/post/${isLiked.value ? "like" : "unlike"}/${props.post._id}`,
      null,
      {
        withCredentials: true,
      },
    );
  } catch (error) {
    isLiked.value = !isLiked.value;
    likes.value = isLiked.value ? likes.value + 1 : likes.value - 1;
  }
}

// Handles save/unsave logic and UI updates
async function toggleSavedPost() {
  const previousState = isSaved.value;
  isSaved.value = !isSaved.value;
  try {
    await axios.patch(
      `http://localhost:8000/api/post/${previousState ? "save" : "unsave"}/${props.post._id}`,
      null,
      {
        withCredentials: true,
      },
    );
  } catch (error) {
    isSaved.value = previousState;
    console.log(error);
  }
}
</script>
