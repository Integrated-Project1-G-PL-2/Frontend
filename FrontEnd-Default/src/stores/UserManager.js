// userManager.js

// ฟังก์ชันสำหรับ signUp (ลงทะเบียน)
export async function signUp(userCredentials) {
  try {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCredentials)
    })

    if (!response.ok) {
      throw new Error('Sign Up failed')
    }

    const data = await response.json()
    return data // คืนค่าผลลัพธ์ที่ได้จากการลงทะเบียน
  } catch (error) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับ signIn (เข้าสู่ระบบ)
export async function login(userCredentials) {
  try {
    const response = await fetch('/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userCredentials)
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    localStorage.setItem('jwt', data.token) // เก็บ JWT ไว้ใน localStorage
    return data // คืนค่าผลลัพธ์ที่ได้จากการเข้าสู่ระบบ
  } catch (error) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับ refreshToken (รีเฟรชโทเค็น)
export async function refreshToken(token) {
  try {
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // ส่ง JWT เพื่อรีเฟรช
      },
      body: JSON.stringify({ token })
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
    localStorage.setItem('jwt', data.token) // อัปเดต JWT ใน localStorage
    return data // คืนค่าผลลัพธ์ที่ได้จากการรีเฟรชโทเค็น
  } catch (error) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับตรวจสอบว่า JWT มีอยู่ใน localStorage หรือไม่
export function getToken() {
  return localStorage.getItem('jwt')
}

// ฟังก์ชันสำหรับ logout (ออกจากระบบ)
export function logout() {
  localStorage.removeItem('jwt') // ลบ JWT ออกจาก localStorage
}
