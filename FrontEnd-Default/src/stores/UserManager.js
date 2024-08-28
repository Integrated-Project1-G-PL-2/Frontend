import { ref } from 'vue'
import { useRouter } from 'vue-router'

// เก็บค่า userName ใน ref
export const userName = ref('')

// ฟังก์ชันถอดรหัส JWT
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
      'exp',
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
export async function login(userCredentials) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...userCredentials })
    })

    if (!response.ok) {
      return response.status
    }

    const data = await response.json()
    const decodedToken = decodeJWT(data.access_token)
    console.log('Decoded JWT:', decodedToken)
    localStorage.setItem('jwt', data.access_token)
    return data
  } catch (error) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับออกจากระบบ (logout)
export function logout() {
  localStorage.removeItem('jwt')
  localStorage.removeItem('userName')
  userName.value = ''
}

// Navigation Guard สำหรับตรวจสอบการยืนยันตัวตน
export function useAuthGuard() {
  const router = useRouter()

  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwt')
    console.log('Navigating from:', from.name, 'to:', to.name)

    if (token) {
      try {
        const decodedToken = decodeJWT(token)
        const currentTime = Math.floor(Date.now() / 1000)

        // ตรวจสอบว่า token หมดอายุหรือยัง
        if (decodedToken.payload.exp < currentTime) {
          logout()
          return next({ name: 'Login' })
        }

        next() // token ถูกต้องและยังไม่หมดอายุ ให้ดำเนินการต่อ
      } catch (error) {
        logout() // ถอดรหัส token ไม่สำเร็จ, ให้ logout และเปลี่ยนเส้นทางไปยังหน้า login
        next({ name: 'Login' })
      }
    } else {
      if (to.name !== 'Login') {
        next({ name: 'Login' }) // ไม่มี token และพยายามเข้าหน้าอื่น ให้เปลี่ยนเส้นทางไป login
      } else {
        next() // ถ้าไปหน้า login ให้ดำเนินการต่อ
      }
    }
  })
}

// ฟังก์ชันสำหรับทำ API request พร้อมแนบ token
export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('jwt')

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  }

  const response = await fetch(url, options)

  if (response.status === 401) {
    logout() // ถ้า response เป็น 401, ให้ logout และเปลี่ยนเส้นทางไป login
    const router = useRouter()
    router.replace({ name: 'Login' })
  }

  return response
}

// // ฟังก์ชันสำหรับ refreshToken (รีเฟรชโทเค็น)
// export async function refreshToken(token) {
//   try {
//     const response = await fetch('/auth/refresh', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}` // ส่ง JWT เพื่อรีเฟรช
//       },
//       body: JSON.stringify({ token })
//     })

//     if (!response.ok) {
//       throw new Error('Token refresh failed')
//     }

//     const data = await response.json()
//     const decodedToken = decodeJWT(data.token) // ถอดรหัส JWT
//     console.log('Decoded JWT:', decodedToken) // แสดงผล JWT ที่ถูกถอดรหัสใน console
//     localStorage.setItem('jwt', data.token) // อัปเดต JWT ใน localStorage
//     return data // คืนค่าผลลัพธ์ที่ได้จากการรีเฟรชโทเค็น
//   } catch (error) {
//     throw new Error(error.message)
//   }
// }

// // ฟังก์ชันสำหรับตรวจสอบว่า JWT มีอยู่ใน localStorage หรือไม่
// export function getToken() {
//   return localStorage.getItem('jwt')
// }
