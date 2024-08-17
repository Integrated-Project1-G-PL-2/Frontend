import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios' // You can use axios or fetch for the HTTP request

export const userManager = defineStore('userManager', () => {
  const users = reactive([])

  const getUser = function () {
    return users
  }

  const fetchUsers = async function () {
    try {
      const response = await axios.get('/api/users') // Replace with your backend endpoint
      const userData = response.data

      // Assuming userData is an array of objects, each representing a user
      userData.forEach((user) => {
        users.push({
          oid: user.oid,
          username: user.username,
          password: user.password, // Note: Store passwords securely
          name: user.name,
          email: user.email,
          role: user.role
        })
      })
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  return {
    getUser,
    fetchUsers
  }
})

// For HMR support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userManager, import.meta.hot))
}
