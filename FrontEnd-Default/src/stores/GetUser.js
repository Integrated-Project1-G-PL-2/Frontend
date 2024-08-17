import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
export const userManager = defineStore('userManager', () => {
  const users = reactive([])
  const getUser = function () {
    return users
  }
})
