<template>
  <div class="min-h-screen flex flex-col">
    <section
      class="flex flex-col items-center gap-3 py-3 flex-grow md:justify-center lg:py-6 text-center px-auto"
    >
      <div class="w-full sm:w-[80vw] lg:w-[26vw] md:w-[45vw] flex flex-col items-center  px-11 sm:border py-6 md:py-10">
        <!-- Instagram Logo -->
        <div class="mb-10">
          <img :src="instaLogo" alt="" />
        </div>

        <!-- Email & Password Inputs -->
        <div class="w-full">
          <div class="space-y-[0.4rem]">
            <label
              class="relative h-[36px] flex group w-full bg-[#FAFAFA] rounded-sm border px-2 focus group focus-within:border-gray-400"
            >
              <span
                class="absolute left-2 h-[18px] top-2 text-[#737373] text-[12px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:scale-[0.83] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-1"
                >Email</span
              >
              <input
                class="w-full text-[0.8rem] sm:text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
                aria-required="true"
                aria-label="Email"
                type="email"
                id="emailOrPhone"
                name="emailOrPhone"
                placeholder=" "
                v-model="email"
              />
            </label>
            <label
              class="relative h-[36px] flex group w-full bg-[#FAFAFA] rounded-sm border px-2 focus group focus-within:border-gray-400"
            >
              <span
                class="absolute left-2 h-[18px] top-2 text-[#737373] text-[12px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:scale-[0.83] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-1"
                >Password</span
              >
              <input
                class="w-full text-[0.8rem] sm:text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
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
          <button
            @click="handleLogin"
            class="bg-[#0095f6] text-white w-full py-[0.4rem] mt-3 text-sm font-semibold rounded-md"
          >
            Sign in
          </button>
        </div>

        <!-- Divider -->
        <div class="flex items-center w-full gap-4 my-4">
          <div class="flex-1 h-px bg-[#dbdbdb]"></div>
          <p class="text-sm text-gray-500">OR</p>
          <div class="flex-1 h-px bg-[#dbdbdb]"></div>
        </div>

        <!-- Facebook Login -->
        <a
          href="http://localhost:8000/auth/facebook"
          class="flex justify-center items-center gap-2 text-sm font-semibold text-[#0095f6] w-full py-2 rounded-md"
        >
          <img class="w-6" :src="facebookBlueIcon" alt="" />
          Log in with Facebook
        </a>
        <!-- Forgot Password -->
        <router-link to="password/reset" class="w-full text-sm mt-2 text-[#00376b]">
          Forgot password?
        </router-link>
      </div>

      <!-- Signup Prompt -->
      <div class="sm:w-[80vw] lg:w-[26vw] md:w-[45vw] flex justify-center text-sm px-11 sm:border py-5">
        <p>Don't have an account?</p>
        <router-link class="font-bold text-[#0095f6]" to="/signup"
          >&nbsp;Sign up</router-link
        >
      </div>
      <div class="sm:w-[80vw] lg:w-[26vw] md:w-[45vw] flex flex-col gap-2 items-center text-sm px-11 py-3">
        <p class="mb-2">Get the app</p>
        <div class="grid grid-cols-2 gap-1 ml-3 h-[42px]">
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
import facebookBlueIcon from "@/assets/icons/facebook_blue_icon.svg";
// components import
import Footer from "@/components/Footer.vue";
// Libraries import
import axios from "axios";
import router from "@/router";
// Store import
import { useAuthStore } from "@/store/AuthStore";
// vue import
import { ref } from "vue";

const AuthStore = useAuthStore();

const email = ref("");
const password = ref("");

async function handleLogin() {
  const response = await axios.post(
    "http://localhost:8000/api/user/signin",
    {
      email: email.value,
      password: password.value,
    },
    { withCredentials: true }
  );
  const postsResponse = await axios.get(
    `http://localhost:8000/api/post/user/${response.data.user.id}`,
    { withCredentials: true }
  );

  if (response.data.success) {
    const { user } = response.data;
    AuthStore.login(user);
    AuthStore.storePosts(postsResponse.data.posts);
    router.push(`/profile/${user.id}`);
  }
}
</script>
