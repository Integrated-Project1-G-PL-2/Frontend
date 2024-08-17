import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import axios from 'axios'

export const userManager = defineStore('userManager', () => {
  const users = reactive([])

  const getUser = function () {
    return users
  }

  const fetchUsers = async function (baseUrl) {
    try {
      const response = await axios.get(`${baseUrl}/api/users`)
      const userData = response.data

      // Clear existing users before adding new data
      users.splice(0, users.length)

      userData.forEach((user) => {
        users.push({
          oid: user.oid,
          username: user.username,
          password: user.password,
          name: user.name,
          email: user.email,
          role: user.role
        })
      })
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const compareUser = async function (inputUser) {
    try {
      // Ensure users are fetched
      if (users.length === 0) {
        await fetchUsers(import.meta.env.VITE_BASE_URL)
      }

      // Compare input with fetched users
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

// For HMR support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userManager, import.meta.hot))
}
