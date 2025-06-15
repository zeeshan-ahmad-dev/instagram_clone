import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('user', {
    state: () => ({
        user: null,
        userPosts: [],
    }),
    actions: {
        login(userData) {
            this.user = userData;
            localStorage.setItem('user', JSON.stringify(this.user));          
        },
        storePosts(posts) {
            this.userPosts = posts;
            localStorage.setItem('posts', JSON.stringify(this.userPosts));
        },
        logout() {
            this.user = null;
            this.userPosts = [];
            localStorage.clear('user');
            localStorage.clear('posts');
        },
        async loadFromStorage() {
            const cachedUser = localStorage.getItem('user');
            const cachedPosts = localStorage.getItem('posts');
            if (cachedUser && cachedPosts) {
                this.user = JSON.parse(cachedUser);
                this.userPosts = JSON.parse(cachedPosts);
            }
            
            try {
                const response = await axios.get('http://localhost:8000/api/user/me', {
                    withCredentials: true
                });

                if (response.status === 200) {
                    this.user = response.data.user;
                    this.userPosts = response.data.posts;

                    localStorage.setItem('user', JSON.stringify(this.user));
                    localStorage.setItem('posts', JSON.stringify(this.userPosts));
                }
            } catch (error) {
                console.log('Token invalid or expired, logging out');

                this.user = null;
                this.userPosts = [];
                localStorage.clear('user');
                localStorage.clear('posts');
            }
          }
    },
    getters: {
        isLoggedIn: (state) => !!state.user,
        getUser: (state) => state.user,
        getPosts: (state) => state.userPosts
    }
})