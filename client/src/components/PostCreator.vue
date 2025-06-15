<template>
  <!-- Main overlay for creating a post -->
  <section
    v-if="show"
    class="z-[1000] inset-0 fixed h-[100dvh] w-[100vw] center"
  >
    <!-- Background overlay behind the modal -->
    <div class="bg-black opacity-60 absolute h-[100dvh] w-[100vw]"></div>

    <!-- DialogueBox for post discarding permission -->
    <div
      v-if="isDiscardBoxOpen"
      class="z-30 inset-0 fixed h-[100dvh] w-[100vw] center"
    >
      <!-- Darker overlay for discard modal -->
      <div class="bg-black opacity-90 absolute h-[100dvh] w-[100vw]"></div>

      <!-- Discard Box -->
      <div
        class="w-[30%] h-[30%] text-center flex flex-col bg-white z-50 rounded-lg"
      >
        <div class="flex-grow-[0.6] gap-1 center flex-col border-b">
          <h2 class="text-xl font-medium">Discard post?</h2>
          <p class="text-sm text-gray-600">
            If you leave, your edits won't be saved.
          </p>
        </div>
        <button
          @click="removeImage"
          class="flex-grow-[0.2] text-sm font-bold text-[#ED515D] border-b"
        >
          Discard
        </button>
        <button @click="handleBackClick" class="flex-grow-[0.2] text-sm">
          Cancel
        </button>
      </div>
    </div>
    <!-- cross icon -->
    <div
      @click="resetCreatePost"
      class="absolute w-8 cursor-pointer top-4 right-4"
    >
      <img :src="closeIcon" alt="" />
    </div>
    <!-- Container -->
    <div
      class="relative overflow-hidden flex flex-col transition-all duration-500 bg-white h-[60%] xl:h-[73%] rounded-lg"
      :class="[isNextStep ? 'w-[90%] md:w-[90%] xl:w-[58%]' : 'w-[90%] md:w-[70%] xl:w-[35%]']"
    >
      <!-- head -->
      <div class="py-2 font-semibold text-center border-b">
        <div
          v-if="selectedImage"
          :class="[
            'flex px-5',
            isSharing || isPostCreated ? 'justify-center' : 'justify-between',
          ]"
        >
          <button v-if="showBackIcon" @click="handleBackClick">
            <img class="w-6" :src="leftArrowIcon" alt="Icon to go back" />
          </button>
          <h3 v-if="isNextStep && !isPostCreated">Create new post</h3>
          <h3 v-else-if="isPostCreated" class="text-center">Post Shared</h3>
          <h3 v-else>Crop</h3>
          <button
            v-if="!isNextStep && !isSharing && !isPostCreated"
            @click="isNextStep = true"
            class="text-[#3143e3] text-sm"
          >
            Next
          </button>
          <button
            v-else-if="isNextStep && !isSharing && !isPostCreated"
            @click="handleUploadPost"
            class="text-[#3143e3] text-sm"
          >
            Share
          </button>
        </div>
        <h3 v-else>Create new post</h3>
      </div>
      <!-- content -->
      <div v-if="!isSharing && !hasPostFailed && !isPostCreated" class="h-full">
        <div v-if="selectedImage" class="h-full flex">
          <!-- TODO: Add some image customization -->
          <div
            class="flex items-end justify-center h-full flex-1 text-center bg-cover overflow-hidden rounded-bl-md"
            :style="{ backgroundImage: `url(${selectedImage})` }"
          >
            <div v-if="!isNextStep" class="flex p-4 w-full justify-between">
              <div class="flex gap-2">
                <button class="center bg-[#484848] p-2 rounded-full">
                  <img class="w-5" :src="fullScreenIcon" alt="" />
                </button>
                <button class="center bg-[#484848] p-2 rounded-full">
                  <img class="w-5" :src="zoomIcon" alt="" />
                </button>
              </div>
              <button class="center bg-[#484848] p-2 rounded-full">
                <img class="w-5" :src="copyIcon" alt="" />
              </button>
            </div>
          </div>
          <!-- Caption & user details (right section in next step) -->
          <div v-if="isNextStep" class="flex-grow-[0.3] h-full">
            <div class="p-3 flex gap-2 items-center">
              <div>
                <img
                  class="object-cover rounded-full size-8 md:size-7"
                  :src="getProfileImageUrl(authStore.getUser.profilePicture)"
                  alt=""
                />
              </div>
              <span class="mr-4 text-sm font-medium">{{
                authStore.getUser.username
              }}</span>
            </div>
            <div
              class="flex items-end justify-between flex-col w-full p-3 border-b"
            >
              <div class="w-full">
                <textarea
                  class="w-full text-md outline-none resize-none min-h-48"
                  name="caption"
                  id="caption"
                  placeholder="Add a caption"
                  aria-label="Add a caption"
                  v-model="captionText"
                ></textarea>
              </div>
              <div
                class="flex justify-between items-center w-full pr-4 text-xs text-[#C7C7C7]"
              >
                <button type="button" class="p-1 opacity-60">
                  <img class="size-6" :src="smile_face_icon" alt="emojis" />
                </button>
                <div
                  @click="toggleInstructions"
                  class="select-none cursor-pointer"
                >
                  <span>{{ captionText.length }}</span
                  >/<span>2200</span>
                </div>
                <transition name="fade">
                  <div
                    v-if="showCaptionInstruction"
                    class="absolute z-[1000] bg-black px-6 py-2 right-4 translate-y-16 text-center text-[0.9rem] text-white rounded-lg shadow-md leading-5 before:content-[''] before:absolute before:size-5 before:bg-black before:right-3 before:-top-1 before:rotate-45 before:rounded-[0.25rem]"
                  >
                    <p>
                      Captions longer than 125 characters appear <br />
                      truncated in feed.
                    </p>
                  </div>
                </transition>
              </div>
            </div>
            <!-- Footer note -->
            <div class="text-xs text-center text-gray-400 italic px-3 pb-2">
              Collaboration, location & tag features coming soon...
            </div>
          </div>
        </div>
        <!-- No image selected yet -->
        <div
          v-else
          class="flex items-center justify-center flex-1 text-center h-full"
        >
          <div
          @dragover.prevent="onDragOver" 
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop" 
          class="flex flex-col items-center justify-center gap-4 size-full"
          :class="{ 'stroke-blue-500':   isDragging, 'stroke-gray-400': isDragging }">
            <svg width="88" height="116" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="black" stroke-width="1.2" :class="{ 'stroke-blue-500':   isDragging, 'stroke-gray-400': isDragging }">
            <!-- Background Image Icon -->
            <rect x="6" y="10" width="34" height="28" rx="4" ry="4" />
            <circle cx="14" cy="18" r="2.5" />
            <polyline points="6,36 14,26 22,34 40,20" fill="none" />
            
            <!-- Rotated Foreground Video Icon Group -->
            <g transform="rotate(10, 38, 37)">
              <!-- Rotated Video Container -->
              <rect x="25" y="22" width="30" height="30" rx="5" ry="5" fill="none" />
              
              <!-- Rotated and enlarged play button -->
              <path
                d="M35 28 Q35 27 37 27 L49 36 Q50 37 49 38 L37 47 Q35 47 35 46 Z"
                fill="none"
                stroke-width="1.5"
              />
            </g>
          </svg>  
            <h2 class="text-xl font-400">Drag photos and videos here</h2>
            <label
              class="bg-[#0095f6] text-sm text-white font-semibold cursor-pointer rounded-lg px-3 py-[0.4rem]"
            >
              <input
                @change="handleImageChange"
                type="file"
                accept="image/*"
                class="hidden"
              />Select from computer
            </label>
          </div>
        </div>
      </div>

      <!-- Upload in progress -->
      <div
        v-else-if="isSharing && !hasPostFailed && !isPostCreated"
        class="center h-full"
      >
        <div
          class="insta-gradient animate-spin text-white rounded-full size-24 flex items-center justify-center relative"
        >
          <div class="absolute z-0 rounded-full size-[5.4rem] bg-white"></div>
          <div class="z-10"></div>
        </div>
      </div>

      <!-- Upload Failed -->
      <div
        v-else-if="!isSharing && hasPostFailed && !isPostCreated"
        class="flex items-center justify-center flex-1 text-center h-full"
      >
        <div class="flex flex-col items-center gap-4">
          <img
            class="w-28"
            :src="exclamationIcon"
            alt="Icon to represent media such as image or video"
          />
          <h2 class="text-xl font-400 lg:w-[90%]">
            Your post could not be shared. Please try again.
          </h2>
          <button
            @click="handleUploadPost"
            class="bg-[#0095f6] text-sm text-white font-semibold cursor-pointer rounded-lg px-3 py-[0.4rem]"
          >
            Try again
          </button>
        </div>
      </div>

      <!-- Upload Successfull -->
      <div
        v-else-if="!isSharing && !hasPostFailed && isPostCreated"
        class="flex items-center justify-center flex-1 text-center h-full"
      >
        <div class="flex flex-col items-center gap-4">
          <img
            class="w-28"
            src="https://static.cdninstagram.com/rsrc.php/v4/yb/r/sHkePOqEDPz.gif"
            alt="Icon to represent media such as image or video"
          />
          <h2 class="text-xl font-400 lg:w-[90%]">
            Your post has been shared.
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Icons
import imgVideoIcon from "@/assets/icons/img_video_icon.svg";
import leftArrowIcon from "@/assets/icons/arrow-thin-left-icon.svg";
import copyIcon from "@/assets/icons/copy.png";
import zoomIcon from "@/assets/icons/zoom.svg";
import fullScreenIcon from "@/assets/icons/full-screen.png";
import smile_face_icon from "@/assets/icons/smile_face.png";
import exclamationIcon from "@/assets/icons/exclamation mark.png";
const closeIcon =
  "https://img.icons8.com/?size=100&id=95867&format=png&color=ffffff";
// Vue's components import
import { ref } from "vue";
import axios from "axios";
// Store import
import { useAuthStore } from "@/store/AuthStore";
// Utils
import { getProfileImageUrl } from "@/utils/imageHelpers";

const authStore = useAuthStore();

// Reactive State
let selectedImage = ref(null);
let isDragging = ref(false);
let selectedImageFile = ref(null);
let captionText = ref("");
let isDiscardBoxOpen = ref(false);
let isNextStep = ref(false);
let showCaptionInstruction = ref(false);
let showBackIcon = ref(true);
let isSharing = ref(false);
let hasPostFailed = ref(false);
let isPostCreated = ref(false);

defineProps({
  show: Boolean,
  username: String,
  userImage: String,
});
const emit = defineEmits(["close"]);

function handleImageChange(event) {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    selectedImageFile.value = file;
  }
}

function onDragOver(event) {
  event.preventDefault();
  isDragging.value = true;
  event.dataTransfer.dropEffect = "copy";
}

function onDragLeave(event) {
  event.preventDefault();
  isDragging.value = false;
}

function onDrop(event) {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    selectedImageFile.value = file;
  }
}

function removeImage() {
  selectedImage.value = null;
  selectedImageFile.value = null;
  isDiscardBoxOpen.value = false;
}

function handleBackClick() {
  if (!isNextStep.value) {
    isDiscardBoxOpen.value = true;
  } else {
    isNextStep.value = false;
  }
}

function toggleInstructions() {
  showCaptionInstruction.value = !showCaptionInstruction.value;
}

async function handleUploadPost() {
  isNextStep.value = false;
  isSharing.value = true;
  showBackIcon.value = false;

  try {
    const formData = new FormData();
    formData.append("image", selectedImageFile.value);
    formData.append("caption", captionText.value || "");

    const response = await axios.post(
      "http://localhost:8000/api/post/add",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.data.success) {
      isSharing.value = false;
      isPostCreated.value = true;
      emit("postCreated", response.data.post);
    } else {
      hasPostFailed.value = true;
    }
  } catch (error) {
    console.error("error creating post:", error);
    hasPostFailed.value = true;
  }
}

function resetCreatePost() {
  emit("close");
  selectedImage.value = null;
  captionText.value = "";
  isDiscardBoxOpen.value = false;
  isNextStep.value = false;
  showCaptionInstruction.value = false;
  showBackIcon.value = true;
  isSharing.value = false;
  hasPostFailed.value = false;
  isPostCreated.value = false;
}
</script>
