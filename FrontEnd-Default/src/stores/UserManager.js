import { ref } from 'vue'

// เก็บค่า userName ใน ref
export const userName = ref('')

// ฟังก์ชันถอดรหัส JWT
// ฟังก์ชัน decodeJWT ปรับให้รองรับการตรวจสอบเวลา expiration ของ refresh token
export function decodeJWT(token) {
  try {
    const [header, payload, signature] = token.split('.')
    const decodedHeader = JSON.parse(atob(header))
    const decodedPayload = JSON.parse(atob(payload))

    if (decodedHeader.typ !== 'JWT' || decodedHeader.alg !== 'HS256') {
      throw new Error('Invalid JWT header')
    }

    const requiredFields = [
      'role',
      'name',
      'oid',
      'email',
      'sub',
      'iat',
      'exp', // ตรวจสอบเวลาหมดอายุ (expiration time)
      'iss'
    ]
    for (const field of requiredFields) {
      if (!decodedPayload.hasOwnProperty(field)) {
        throw new Error(`Missing required field in JWT payload: ${field}`)
      }
    }

    userName.value = decodedPayload.name
    localStorage.setItem('userName', decodedPayload.name)
    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature: signature
    }
  } catch (error) {
    throw new Error('Invalid JWT Token: ' + error.message)
  }
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ (login)
export async function login(userCredentials, router) {
  const response = await apiRequest(
    `${import.meta.env.VITE_BASE_URL}/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...userCredentials }),
      credentials: 'include'
    },
    router
  )

  if (!response.ok) {
    return response.status
  }

  const data = await response.json()
  const decodedToken = decodeJWT(data.access_token)

  // เก็บ Access Token
  localStorage.setItem('jwt', data.access_token)

  // เก็บ Refresh Token และเวลาหมดอายุ
  localStorage.setItem('refresh_token', data.refresh_token)
  const refreshDecoded = decodeJWT(data.refresh_token)
  localStorage.setItem('refresh_token_exp', refreshDecoded.payload.exp) // เก็บเวลา expired

  return data
}

// ฟังก์ชันสำหรับออกจากระบบ (logout)
export function logout() {
  localStorage.removeItem('jwt')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('userName')

  // ลบข้อมูลที่เกี่ยวข้องจาก sessionStorage (ถ้ามี)
  sessionStorage.removeItem('jwt')
  sessionStorage.removeItem('userName')

  userName.value = ''
}

// ฟังก์ชัน refreshToken ปรับให้ตรวจสอบการหมดอายุของ refresh token
export async function refreshToken(router) {
  const refresh_token = localStorage.getItem('refresh_token')
  const refresh_token_exp = localStorage.getItem('refresh_token_exp')

  if (!refresh_token || !refresh_token_exp) {
    logout()
    router.replace({ name: 'Login' })
    return
  }

  const currentTime = Math.floor(Date.now() / 1000)
  if (currentTime > refresh_token_exp) {
    // Refresh token หมดอายุ
    logout()
    router.replace({ name: 'Login' })
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refresh_token}` // ใช้ refresh token
      },
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('jwt', data.access_token) // เก็บ access token ใหม่
      return data.access_token
    } else if (response.status === 401) {
      logout()
      router.replace({ name: 'Login' })
    } else {
      alert('There is a problem. Please try again later.')
    }
  } catch (error) {
    alert('There is a problem. Please try again later.')
  }
}

// Navigation Guard สำหรับตรวจสอบการยืนยันตัวตน
export function useAuthGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('jwt')

    if (token) {
      try {
        const decodedToken = decodeJWT(token)
        const currentTime = Math.floor(Date.now() / 1000)

        if (decodedToken.payload.exp < currentTime) {
          // Access token หมดอายุ ลองรีเฟรชโทเค็น
          const newToken = await refreshToken(router)
          if (!newToken) return // หากไม่ได้รับโทเค็นใหม่ ให้ไปหน้า Login
        }

        next() // Token ถูกต้องและยังไม่หมดอายุ ให้ดำเนินการต่อ
      } catch (error) {
        logout()
        return next({ name: 'Login' })
      }
    } else {
      if (to.name !== 'Login') {
        return next({ name: 'Login' })
      } else {
        return next()
      }
    }
  })
}

// ฟังก์ชันสำหรับทำ API request พร้อมแนบ token
export async function apiRequest(url, options = {}, router) {
  const token = localStorage.getItem('jwt')

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  }

  const response = await fetch(url, options)

  if (response.status === 401) {
    const newToken = await refreshToken(router) // Try to refresh token

    if (newToken) {
      options.headers.Authorization = `Bearer ${newToken}`
      return await fetch(url, options) // Retry request with new token
    } else {
      logout()
      router.replace({ name: 'Login' })
    }
  }

  return response
}
