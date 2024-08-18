// userManager.js

// ฟังก์ชันสำหรับ login
export async function login(userCredentials) {
  try {
    const response = await fetch('/api/auth/login', {
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
    return data // คืนค่าผลลัพธ์ที่ได้จากการ login
  } catch (error) {
    throw new Error(error.message)
  }
}

// ฟังก์ชันสำหรับตรวจสอบว่า JWT มีอยู่ใน localStorage หรือไม่
export function getToken() {
  return localStorage.getItem('jwt')
}

// ฟังก์ชันสำหรับ logout
export function logout() {
  localStorage.removeItem('jwt') // ลบ JWT ออกจาก localStorage
}
