<template>
  <div class="fixed inset-0 px-6 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
      <!-- Header -->
      <h3 class="text-center font-medium text-lg mb-6">Edit Profile</h3>

      <!-- Profile Image -->
      <div class="flex flex-col items-center space-y-2 mb-5">
        <img
          :src="previewImage || getProfileImageUrl(currentPfp)"
          class="w-20 h-20 rounded-full object-cover border"
          alt="Profile Picture"
        />
        <label
          for="file-upload"
          class="text-sm text-[#0095F6] font-medium cursor-pointer hover:underline"
        >
          Change profile photo
        </label>
        <input
          id="file-upload"
          type="file"
          class="hidden"
          @change="onFileChange"
          accept="image/*"
        />
      </div>

      <!-- Bio Input -->
      <div class="mb-6">
        <label for="bio" class="block text-xs font-medium text-gray-500 mb-1"
          >Bio</label
        >
        <textarea
          id="bio"
          v-model="newBio"
          rows="3"
          class="w-full text-sm border border-gray-300 rounded resize-none px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0095F6]"
          placeholder="Write something about yourself"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 text-sm">
        <button @click="close" class="text-gray-600 hover:underline">
          Cancel
        </button>
        <button
          @click="save"
          class="text-[#0095F6] font-semibold hover:text-[#00376b]"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getProfileImageUrl } from "@/utils/imageHelpers";

const props = defineProps({
  currentPfp: String,
  currentBio: String,
});

const emit = defineEmits(["close", "save"]);

const newBio = ref(props.currentBio || "");
const selectedFile = ref(null);
const previewImage = ref("");

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function close() {
  emit("close");
  resetForm();
}

function resetForm() {
  selectedFile.value = null;
  previewImage.value = "";
}

function save() {
  emit("save", {
    bio: newBio.value,
    profilePicture: selectedFile.value || null,
  });
  close();
  resetForm();
}
</script>
