<template>
  <nav class="flex justify-around py-3 border-b">
    <a href="/login">
      <img class="w-24" :src="instaLogo" alt="Instagram" />
    </a>
    <div class="">
      <router-link
        class="bg-[#0095f6] rounded-md text-sm text-white font-semibold px-4 py-[0.4rem]"
        to="/login"
        >Log In</router-link
      >
      <router-link
        class="px-4 text-sm font-semibold rounded-md text-[#0095f6]"
        to="/signup"
        >Sign Up</router-link
      >
    </div>
  </nav>
  <section class="flex flex-col items-center gap-3 py-3 text-center px-auto">
    <div class="w-[29vw] flex flex-col items-center border mt-10">
      <div class="flex flex-col items-center w-full px-12 pt-10 pb-6">
        <div class="p-3 mb-4 border-2 border-black rounded-full">
          <img class="w-16" :src="lock" alt="" />
        </div>
        <div>
          <h6 class="mb-1 font-semibold text-md">Trouble logging in?</h6>
          <p class="text-sm font-extrathin text-[#737373] mb-2">
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </p>
        </div>
        <!-- Inputs  -->
        <div class="w-full">
          <label
            class="relative h-[36px] flex w-full bg-[#FAFAFA] rounded-md border border-[#dbdbdb] px-2 focus group focus-within:border-gray-400"
          >
            <span
              class="absolute left-2 h-[20px] top-[0.3rem] text-[#c7c7ca] text-[14px] text-ellipsis transition-all duration-200 transform group-has-[input:not(:placeholder-shown)]:text-[10px] group-has-[input:not(:placeholder-shown)]:top-[1px] group-has-[input:not(:placeholder-shown)]:left-2"
              >Email or Username</span
            >
            <input
              class="w-full text-[.7rem] h-full bg-transparent outline-none self-center group-has-[input:not(:placeholder-shown)]:self-end group-has-[input:not(:placeholder-shown)]:top-1 relative"
              aria-required="true"
              aria-label="Password"
              type="text"
              id="password"
              name="password"
              placeholder=" "
            />
          </label>
          <button
            @click="showAlert"
            class="bg-[#0095f6] text-white w-full py-[0.4rem] mt-3 text-sm font-semibold rounded-md"
          >
            Send Login Link
          </button>
          <a class="text-[12px] mt-1" href="#"> Can't reset your password? </a>
        </div>

        <div class="flex items-center w-full gap-4 my-4 mb-3">
          <div class="flex-1 h-px bg-[#dbdbdb]"></div>
          <p class="text-sm text-gray-500">OR</p>
          <div class="flex-1 h-px bg-[#dbdbdb]"></div>
        </div>

        <router-link
          to="/signup"
          class="flex justify-center items-center gap-2 text-sm font-semibold text-[#262626] hover:opacity-60 w-full py-2 rounded-md"
        >
          Create new account
        </router-link>
      </div>
      <div
        class="w-full border border-gray-300 bg-[#fafafa] py-2 text-sm font-semibold"
      >
        <router-link to="/login"> Back to login </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import instaLogo from "@/assets/icons/insta_logo.png";
import lock from "@/assets/icons/lock.svg";

function showAlert() {
    alert('Link sent to email');
}
</script>
