<template>
  <div class="flex flex-col min-h-screen">
    <section
      class="flex flex-col items-center flex-grow gap-3 py-3 text-center md:justify-center lg:py-6 px-auto"
    >
      <div
        class="sm:w-[80vw] lg:w-[26vw] md:w-[45vw] flex flex-col items-center px-11 sm:border py-6 md:py-10"
      >
        <div>
          <img :src="instaLogo" alt="" />
        </div>
        <h6 class="font-semibold text-[#737373] leading-5 my-2 mb-4">
          Sign up to see photos and videos from your friends
        </h6>
        <a
          href="/auth/facebook"
          class="bg-[#0095f6] flex gap-2 text-sm w-full py-2 rounded-md justify-center font-semibold text-white"
        >
          <img class="w-5" :src="facebookIcon" alt="" />
          Log in with Facebook
        </a>
        <div class="flex items-center w-full gap-4 my-4">
          <div class="flex-1 h-px bg-[#dbdbdb]"></div>
          <p class="text-sm text-gray-500">OR</p>
          <div class="flex-1 h-px bg-[#dbdbdb]"></div>
        </div>

        <!-- Inputs  -->
        <div>
          <div class="space-y-[0.4rem]">
            <div class="space-y-1">
              <div
                v-if="errors.email"
                class="text-[0.6rem] text-red-500 text-start"
              >
                *{{ errors.email }}
              </div>

              <label
                class="form-label group focus-within:border-gray-400 focus"
              >
                <span class="form-input-span"> Email </span>
                <input
                  class="form-input"
                  type="email"
                  placeholder=" "
                  v-model="email"
                />
              </label>
            </div>
            <div class="space-y-1">
              <div
                v-if="errors.password"
                class="text-[0.6rem] text-red-500 text-start"
              >
                *{{ errors.password }}
              </div>
              <label
                class="form-label group focus-within:border-gray-400 focus"
              >
                <span class="form-input-span">Password</span>
                <input
                  class="form-input"
                  aria-required="true"
                  aria-label="Password"
                  type="text"
                  id="password"
                  name="password"
                  placeholder=" "
                  v-model="password"
                />
              </label>
            </div>
            <div class="space-y-1">
              <div
                v-if="errors.fullName"
                class="text-[0.6rem] text-red-500 text-start"
              >
                *{{ errors.fullName }}
              </div>
              <label
                class="form-label group focus-within:border-gray-400 focus"
              >
                <span class="form-input-span">Full Name</span>
                <input
                  class="form-input"
                  aria-required="true"
                  aria-label="Full Name"
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder=" "
                  v-model="fullName"
                />
              </label>
            </div>
            <div class="space-y-1">
              <div
                v-if="errors.username"
                class="text-[0.6rem] text-red-500 text-start"
              >
                *{{ errors.username }}
              </div>
              <label
                class="form-label group focus-within:border-gray-400 focus"
              >
                <span class="form-input-span">username</span>
                <input
                  class="form-input"
                  aria-required="true"
                  aria-label="username"
                  type="text"
                  id="username"
                  name="username"
                  placeholder=" "
                  v-model="username"
                />
              </label>
            </div>
          </div>
          <div class="py-4">
            <p class="mt-4 text-[12px] leading-4">
              People who use our service may have uploaded your contact
              information to Instagram.
              <a
                class="text-[#00376B]"
                href="https://web.facebook.com/help/instagram/261704639352628?_rdc=1&_rdr#"
                >Learn More</a
              >
            </p>
          </div>
          <button
            @click="signup"
            class="bg-[#0095f6] text-white w-full py-[0.4rem] text-sm font-semibold rounded-md"
          >
            Sign up
          </button>
        </div>
      </div>

      <div
        class="md:w-[45vw] lg:w-[26vw] flex lg:flex-col gap-1 lg:gap-0 justify-center text-sm items-center px-11 sm:border md:border py-2 md:py-5"
      >
        <p>Have an account?</p>
        <router-link class="font-bold text-[#0095f6]" to="/login"
          >Log in</router-link
        >
      </div>
      <div
        class="hidden lg:w-[26vw] md:w-[45vw] lg:flex flex-col gap-2 items-center text-sm px-11 py-0 md:py-6"
      >
        <p>Get the app</p>
        <div class="grid grid-cols-2 gap-1 h-[42px]">
          <a
            href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D5229362B-5AF7-4561-BD4A-D5FACF2B9F2E%26utm_campaign%3DsignupPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge%26original_referrer%3Dhttps%253A%252F%252Fwww.instagram.com%252Fzeeshanahmad5445%252F"
          >
            <img
              class="h-[42px]"
              src="https://static.cdninstagram.com/rsrc.php/v4/yz/r/c5Rp7Ym-Klz.png"
              alt=""
            />
          </a>
          <a
            href="ms-windows-store://pdp/?productid=9nblggh5l9xt&referrer=appbadge&source=www.instagram.com&mode=mini&pos=0%2C0%2C0%2C0"
          >
            <img
              class="h-[42px]"
              src="https://static.cdninstagram.com/rsrc.php/v4/yu/r/EHY6QnZYdNX.png"
              alt=""
            />
          </a>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
// icons import
import instaLogo from "@/assets/icons/insta_logo.png";
import facebookIcon from "@/assets/icons/facebook_icon.svg";
// components import
import Footer from "@/components/Footer.vue";
// Libraries import
import router from "@/router";
// Store import
import { useAuthStore } from "@/store/AuthStore";
// vue import
import { reactive, ref } from "vue";
import api from "@/api";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const username = ref("");
const fullName = ref("");

const errors = reactive({
  email: "",
  password: "",
  fullName: "",
  username: "",
});

async function signup() {
  errors.email = "";
  errors.password = "";
  errors.username = "";
  errors.fullName = "";
  
  try {
    const response = await api.post(
      "/api/user/signup",
      {
        username: username.value,
        email: email.value,
        password: password.value,
        fullName: fullName.value,
      },
    );
    // Stores data after login success from backend
    authStore.login(response.data.user);
    authStore.storePosts(response.data.posts);
    router.push(`/profile/${response.data.user.username}`);
  } catch (error) {
    console.log(error.response)
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    }
  }
}
</script>
