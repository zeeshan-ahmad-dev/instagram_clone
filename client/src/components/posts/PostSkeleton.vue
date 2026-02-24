<template>
  <article class="border-b border-[#dbdbdb] pb-2 md:pb-0 animate-pulse">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 md:px-0">
      <div class="flex gap-2">
        <!-- Profile Image -->
        <div class="rounded-full size-[42px] bg-gray-300"></div>

        <!-- Username + time -->
        <div class="space-y-1">
          <div class="w-24 h-3 bg-gray-300 rounded"></div>
          <div class="w-16 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Menu -->
      <div class="bg-gray-300 rounded size-4"></div>
    </div>

    <!-- Post Image -->
    <div
      class="h-[585px] bg-gray-300 rounded-md border border-gray-200 my-3"
    ></div>

    <!-- Actions -->
    <div class="px-4 space-y-2 md:px-0">
      <div class="flex justify-between">
        <div class="flex gap-3">
          <div class="bg-gray-300 rounded size-6"></div>
          <div class="bg-gray-300 rounded size-6"></div>
          <div class="bg-gray-300 rounded size-6"></div>
        </div>
        <div class="bg-gray-300 rounded size-5"></div>
      </div>

      <!-- Likes -->
      <div class="w-20 h-3 bg-gray-300 rounded"></div>

      <!-- Caption -->
      <div class="space-y-1">
        <div class="w-32 h-3 bg-gray-300 rounded"></div>
        <div class="w-48 h-3 bg-gray-200 rounded"></div>
      </div>

      <!-- Comments -->
      <div class="w-40 h-3 bg-gray-200 rounded"></div>
    </div>
  </article>
</template>
