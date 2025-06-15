import { useAuthStore } from "@/store/AuthStore";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/signup",
    name: "Signup",
    component: () => import("@/pages/Signup.vue"),
    meta: { layout: 'auth' }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
    meta: { layout: 'auth' }
  },
  {
    path: "/password/reset",
    name: "ResetPassword",
    component: () => import("@/pages/ResetPassword.vue"),
    meta: { layout: 'auth' }
  },
  {
    path: "/profile/:userId",
    name: "Profile",
    component: () => import("@/pages/Profile.vue"),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: "/:userId",
    name: "User Profile",
    component: () => import("@/pages/UserProfile.vue"),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
    meta: { layout: 'main', requiresAuth: true }
  },
];

const router =  createRouter({
  history: createWebHistory(),
  routes,
});



router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.getUser) {
    await authStore.loadFromStorage();
  }
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
})

export default router;