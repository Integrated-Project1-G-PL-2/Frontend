// userManager.js
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'your_secret_key' // คีย์ที่ใช้สำหรับการเข้ารหัสและถอดรหัส JWT

// ฟังก์ชันสำหรับตรวจสอบ JWT
export function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    return decoded // ถ้าตรวจสอบสำเร็จจะคืนค่าข้อมูลที่ถอดรหัสแล้ว
  } catch (error) {
    return null // คืนค่า null ถ้า JWT ไม่ถูกต้อง
  }
}

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
    return data // คืนค่าผลลัพธ์ที่ได้จากการ login
  } catch (error) {
    throw new Error(error.message)
  }
}
