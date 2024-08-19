import { ref } from 'vue'

// สร้าง ref เพื่อเก็บชื่อผู้ใช้
export const userName = ref('')

// ฟังก์ชันถอดรหัส JWT
export function decodeJWT(token) {
  try {
    // แบ่ง JWT ออกเป็นสามส่วน: HEADER, PAYLOAD, SIGNATURE
    const [header, payload, signature] = token.split('.')

    // แปลงจาก Base64 URL Safe เป็น JSON object
    const decodedHeader = JSON.parse(atob(header))
    const decodedPayload = JSON.parse(atob(payload))

    // ตรวจสอบค่าจาก header
    if (decodedHeader.typ !== 'JWT' || decodedHeader.alg !== 'HS256') {
      throw new Error('Invalid JWT header')
    }

    // ตรวจสอบค่าจาก payload
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

    // เก็บค่า name จาก payload ลงใน ref userName และ localStorage
    userName.value = decodedPayload.name
    localStorage.setItem('userName', decodedPayload.name)
    // คืนค่าที่ถูกถอดรหัส
    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature: signature
    }
  } catch (error) {
    throw new Error('Invalid JWT Token: ' + error.message)
  }
}

// ฟังก์ชันสำหรับ signIn (เข้าสู่ระบบ)
export async function login(userCredentials) {
  console.log(userCredentials)
  try {
    const response = await fetch(
      'http://localhost:8080/authentications/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...userCredentials })
      }
    )

    if (!response.ok) {
      return response.status
    }

    const data = await response.json()
    const decodedToken = decodeJWT(data.token) // ถอดรหัส JWT
    console.log('Decoded JWT:', decodedToken) // แสดงผล JWT ที่ถูกถอดรหัสใน console
    localStorage.setItem('jwt', data.token) // เก็บ JWT ไว้ใน localStorage
    return data // คืนค่าผลลัพธ์ที่ได้จากการเข้าสู่ระบบ
  } catch (error) {
    throw new Error(error.message)
  }
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

// // ฟังก์ชันสำหรับ logout (ออกจากระบบ)
// export function logout() {
//   localStorage.removeItem('jwt') // ลบ JWT ออกจาก localStorage
// }
