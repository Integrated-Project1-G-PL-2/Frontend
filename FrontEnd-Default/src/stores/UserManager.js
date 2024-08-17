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
      const response = await axios.get('/api/users')
      const userData = response.data

      userData.forEach((user) => {
        users.push({
          username: user.username,
          password: user.password
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
