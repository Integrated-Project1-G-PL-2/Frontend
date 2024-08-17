import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const userManager = defineStore('userManager', () => {
  const users = reactive([])

  const getUser = function () {
    return users
  }

  const compareUser = async function (inputUser) {
    try {
      if (users.length === 0) {
        await fetchUsers(import.meta.env.VITE_BASE_URL)
      }

      const foundUser = users.find(
        (user) =>
          user.username === inputUser.username &&
          user.password === inputUser.password
      )

      if (foundUser) {
        return foundUser
      } else {
        console.error('User not found or credentials do not match.')
        return null
      }
    } catch (error) {
      console.error('Error comparing user:', error)
      return null
    }
  }

  return {
    getUser,
    fetchUsers,
    compareUser
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userManager, import.meta.hot))
}
