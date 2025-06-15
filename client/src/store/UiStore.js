import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
    state: () => ({
        showCreateOverlay: false,
        showMore: false,
    }),
    actions: {
        changeCreateOverlay() {
            this.showCreateOverlay = !this.showCreateOverlay;
        },
        changeMoreDisplay() {
            this.showMore = !this.showMore;
        },
    }
})