import { reactive } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export const userManager = defineStore('userManager', () => {
  const users = reactive([])
  const jwtToken = response.token
  localStorage.setItem('jwtToken', jwtToken)
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
    compareUser
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userManager, import.meta.hot))
}
async function getToken(username, password) {
  try {
    const response = await fetch('https://your-backend-url.com/api/token', {
      method: 'POST', // กำหนด method เป็น POST หรือ method ที่ backend รองรับ
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() // แปลง response body เป็น JSON
    return data.token // สมมติว่าตัว response มี field ชื่อ 'token'
  } catch (error) {
    console.error('Error fetching token:', error)
    return null
  }
}

// การเรียกใช้งาน
getToken('your-username', 'your-password').then((token) => {
  if (token) {
    console.log('Received token:', token)
    // ทำอะไรกับ token ต่อ เช่น เก็บใน localStorage หรือใช้ใน request ต่อไป
  } else {
    console.log('Failed to receive token')
  }
})
