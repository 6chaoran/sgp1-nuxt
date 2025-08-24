import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: () => ({
    selectedYear: { name: '2025' },
    showReviewModel: false,
    reviews: [],
    profile: {},
    ballot: {}
  }),
  actions: {
    updateSelectedYear(year) {
        this.selectedYear = { name: String(year) };
    },
    toggleReviewModal() {
      this.showReviewModel = !this.showReviewModel;
    }, 
  }
})
