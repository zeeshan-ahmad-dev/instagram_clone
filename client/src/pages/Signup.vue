<template>
  <div class="min-h-screen flex flex-col">
    <section
    class="flex flex-col items-center gap-3 py-3 flex-grow md:justify-center lg:py-6 text-center px-auto"
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
          href="http://localhost:8000/auth/facebook"
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
            <label
              class="relative h-[50px] md:h-[36px] flex group w-full bg-[#FAFAFA] rounded-sm border px-2 focus group focus-within:border-gray-400"
            >
              <span
                class="absolute left-2 md:h-[18px] top-3 md:top-2 text-[#737373] text-[16px] md:text-[12px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:scale-[0.9] md:group-has-[input:not(:placeholder-shown)]:scale-[0.83] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-2"
                >Email</span
              >
              <input
                class="w-full md:text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
                aria-required="true"
                aria-label="Mobile Number or Email"
                type="email"
                id="emailOrPhone"
                name="emailOrPhone"
                placeholder=" "
                v-model="email"
              />
            </label>
            <label
              class="relative h-[50px] md:h-[36px] flex group w-full bg-[#FAFAFA] rounded-sm border px-2 focus group focus-within:border-gray-400"
            >
              <span
                class="absolute left-2 md:h-[18px] top-3 md:top-2 text-[#737373] text-[16px] md:text-[12px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:scale-[0.9] md:group-has-[input:not(:placeholder-shown)]:scale-[0.83] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-1"
                >Password</span
              >
              <input
                class="w-full md:text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
                aria-required="true"
                aria-label="Password"
                type="text"
                id="password"
                name="password"
                placeholder=" "
                v-model="password"
              />
            </label>
            <label
              class="relative h-[50px] md:h-[36px] flex group w-full bg-[#FAFAFA] rounded-sm border px-2 focus group focus-within:border-gray-400"
            >
              <span
                class="absolute left-2 md:h-[18px] top-3 md:top-2 text-[#737373] text-[16px] md:text-[12px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:scale-[0.9] md:group-has-[input:not(:placeholder-shown)]:scale-[0.83] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-1"
                >Full Name</span
              >
              <input
                class="w-full md:text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
                aria-required="true"
                aria-label="Full Name"
                type="text"
                id="fullName"
                name="fullName"
                placeholder=" "
                v-model="fullName"
              />
            </label>
            <label
              class="relative h-[50px] md:h-[36px] flex group w-full bg-[#FAFAFA] rounded-sm border px-2 focus group focus-within:border-gray-400"
            >
              <span
                class="absolute left-2 md:h-[18px] top-3 md:top-2 text-[#737373] text-[16px] md:text-[12px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:scale-[0.9] md:group-has-[input:not(:placeholder-shown)]:scale-[0.83] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-1"
                >username</span
              >
              <input
                class="w-full md:text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
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
import axios from "axios";
import router from "@/router";
// Store import
import { useAuthStore } from "@/store/AuthStore";
// vue import
import { ref } from "vue";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const username = ref("");
const fullName = ref("");

async function signup() {
  const response = await axios.post(
    "http://localhost:8000/api/user/signup",
    {
      username: username.value,
      email: email.value,
      password: password.value,
      fullName: fullName.value,
    },
    {
      withCredentials: true,
    }
  );
  if (response.data.success) {
    // Stores data after login success from backend
    authStore.login(response.data.user);
    authStore.storePosts(response.data.posts);
    router.push(`/profile/${response.data.user.username}`);
  }
}
</script>
