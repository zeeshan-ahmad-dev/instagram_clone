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
            <span
              @click="RouteToProfile"
              class="text-sm font-bold cursor-pointer"
              >{{ post.user.username }}</span
            >
            <div class="rounded-full bg-[#737373] size-1"></div>
            <span class="text-[#737373]">8h</span>
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
      class="my-2 overflow-hidden bg-cover w-full h-[585px] border border-gray-300 rounded-sm"
      :style="{ backgroundImage: `url(http://localhost:8000${post.image})` }"
    ></div>

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
          <button>
            <img class="size-5" :src="bookmark_light_icon" alt="save" />
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
        <div class="space-x-1 text-sm overflow-hidden flex items-center flex-wrap">
          <span class="font-semibold">{{ post.user.username }}</span>
          <span
            :class="[showMore ? 'whitespace-normal' : 'truncate max-w-[4rem] md:max-w-[16rem] overflow-hidden whitespace-nowrap']"
          >
            {{ post.caption }}
          </span>
          <span v-if="post?.caption.length > 40 && !showMore" @click="showMore = true" class="text-[#737373] cursor-pointer">more</span>
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
import smile_face_icon from "@/assets/icons/smile_face.png";
import menu_icon from "@/assets/icons/menu_icon.svg";
import comment_icon from "@/assets/icons/comment.svg";
import axios from "axios";
import { ref, defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/AuthStore";
import { getProfileImageUrl } from "@/utils/imageHelpers";

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["preview-post"]);

const commentText = ref("");
const isLiked = ref(props.post.likes.includes(authStore.getUser.id));
const likes = ref(props.post.likes.length);
const showMore = ref(false)

// Emit preview-post event to show full post view
function previewPost() {
  emit("preview-post", {
    post: props.post,
    likeStatus: isLiked.value,
    postLikes: likes.value,
  });
}

// Handles like/unlike logic and UI updates
async function likePost() {
  if (
    props.post.likes.includes(authStore.getUser.id) ||
    isLiked.value === true
  ) {
    const response = await axios.patch(
      `http://localhost:8000/api/post/unlike/${props.post._id}`,
      null,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      isLiked.value = false;
      likes.value = likes.value - 1;
    }
  } else {
    const response = await axios.patch(
      `http://localhost:8000/api/post/like/${props.post._id}`,
      null,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      isLiked.value = true;
      likes.value = likes.value + 1;
    }
  }
}

// Navigate to the user's profile page
function RouteToProfile() {
  router.push(`/${props.post.user._id}`);
}
</script>
