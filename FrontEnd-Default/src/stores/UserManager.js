import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// เก็บค่า userName ใน ref
export const userName = ref('')
const route = useRoute()
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
  localStorage.setItem('jwt', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token) // Save refresh token
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

// ฟังก์ชัน refreshToken
export async function refreshToken(router) {
  const refresh_token = localStorage.getItem('refresh_token')

  // If no refresh token exists, logout and redirect to login
  if (!refresh_token) {
    logout()
    router.replace({ name: 'Login' })
    return null // Return null if refresh token is missing
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refresh_token}` // Use refresh token
      },
      credentials: 'include'
    })

    // If refresh token request is successful
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('jwt', data.access_token) // Store new access token
      console.log('New access token set:', data.access_token) // Log the new token
      return data.access_token // Return the new access token
    }
    // If refresh token is invalid (401 Unauthorized)
    else if (response.status === 401) {
      logout()
      router.replace({ name: 'Login' })
      return null // Return null to indicate failure
    } else {
      alert('There was a problem refreshing the token. Please try again later.')
      return null
    }
  } catch (error) {
    alert('Error occurred while refreshing token.')
    return null
  }
}

// Navigation Guard สำหรับตรวจสอบการยืนยันตัวตน
export function useAuthGuard(router) {
  router.beforeEach(async (to, from, next) => {
    console.log('Auth Guard Triggered')

    const token = localStorage.getItem('jwt')

    if (!token) {
      console.log('No token found, redirecting to login.')
      return next()
    }

    console.log('Token found, checking validity...')
    try {
      const decodedToken = decodeJWT(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decodedToken.payload.exp < currentTime) {
        console.log('Token expired, attempting to refresh...')
        const newToken = await refreshToken(router)

        if (newToken) {
          console.log('New token obtained:', newToken)
          localStorage.setItem('jwt', newToken) // Ensure the new token is stored
          return next() // Allow navigation
        } else {
          console.log('Failed to refresh token, redirecting to login.')
          logout() // Ensure logout is called if refresh fails
          return next({ name: 'Login' })
        }
      } else {
        console.log('Token is valid, allowing navigation.')
        // Proceed to check for board visibility and ownership here
        // return checkBoardPermissions(to, next)
        return next() // Proceed as normal
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      logout()
      return next({ name: 'Login' })
    }
  })
}

async function checkBoardPermissions(to, next) {
  const boardId = to.params.id
  const taskId = to.params['task-id'] || null

  try {
    // Fetch board details
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch board details.')
      return next({
        name: 'Task',
        query: { message: 'Board not found or access denied.' }
      })
    }

    const board = await response.json()
    const { isOwner, visibility } = board

    // สร้าง URL เส้นทางสำหรับตรวจสอบ
    const addTaskRoute = `${
      import.meta.env.VITE_BASE_URL
    }/v3/boards/${boardId}/tasks/add`
    const editTaskRoute = `${
      import.meta.env.VITE_BASE_URL
    }/v3/boards/${boardId}/tasks/${taskId}/edit`
    const boardRoute = `${import.meta.env.VITE_BASE_URL}/v3/boards/${boardId}`
    const statusRoute = `${
      import.meta.env.VITE_BASE_URL
    }/v3/boards/${boardId}/status`
    const taskRoute = `${
      import.meta.env.VITE_BASE_URL
    }/v3/boards/${boardId}/tasks/${taskId}`

    const isTaskAddEditRoute =
      to.path === addTaskRoute || to.path === editTaskRoute
    const isGeneralBoardRoute =
      to.path === boardRoute || to.path === statusRoute || to.path === taskRoute

    // Case 1: Non-owner trying to access a private board
    if (!isOwner && visibility === 'PRIVATE' && isGeneralBoardRoute) {
      return next({
        name: 'StatusList',
        query: { message: 'Access denied, this board is private.' }
      })
    }

    // Case 2: Non-owner attempting to modify tasks on a public board
    if (!isOwner && visibility === 'PUBLIC' && isTaskAddEditRoute) {
      return next({
        name: 'Task',
        query: {
          message: 'Access denied, you do not have permission to modify tasks.'
        }
      })
    }

    // Case 3: Owner has full access
    if (isOwner) {
      return next()
    }

    // Case 4: Non-owner can view public board content
    if (!isOwner && visibility === 'PUBLIC') {
      return next()
    }

    console.error('Unexpected state in permission check.')
    return next({ name: 'Task' })
  } catch (error) {
    console.error('Error fetching board details:', error)
    return next({
      name: 'StatusList',
      query: { message: 'Error fetching board details.' }
    })
  }
}

// ฟังก์ชันสำหรับทำ API request พร้อมแนบ token
export async function apiRequest(url, options = {}, router) {
  let token = localStorage.getItem('jwt') // Get access token from localStorage

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}` // Attach access token to the request
    }
  }

  const response = await fetch(url, options)

  // If access token expired (status 401), attempt to refresh the token
  if (response.status === 401) {
    const newToken = await refreshToken(router) // Try to refresh token

    if (newToken) {
      // Replace the old token with the new one
      token = newToken
      options.headers.Authorization = `Bearer ${newToken}` // Update the request with the new token
      return await fetch(url, options) // Retry request with new token
    } else {
      logout()
      router.replace({ name: 'Login' })
    }
  }

  return response
}
