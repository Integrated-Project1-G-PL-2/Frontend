import { refreshToken } from '@/stores/UserManager'

async function fetchWithAuth(url, options, router) {
  const token = localStorage.getItem('jwt')
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  }

  const res = await fetch(url, options)

  if (!res.ok) {
    if (res.status === 401) {
      console.log('Access token expired, attempting to refresh...')
      const newToken = await refreshToken(router)
      if (newToken) {
        // Retry the request with the new token
        options.headers.Authorization = `Bearer ${newToken}`
        const retryRes = await fetch(url, options)
        if (retryRes.ok) {
          return retryRes
        } else {
          console.error(`Retry failed with status: ${retryRes.status}`)
          return retryRes
        }
      } else {
        console.error('Token refresh failed, logging out.')
        logout()
        router.replace({ name: 'Login' })
      }
    } else {
      console.error(`Failed to fetch: ${res.status}`)
    }
  }

  return res
}

export async function getItems(url, router) {
  try {
    const options = {
      method: 'GET',
      headers: {}
    }

    const res = await fetchWithAuth(url, options, router)
    if (res) {
      return await res.json()
    }
    return null
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function getItemById(url, id, router) {
  try {
    const options = {
      method: 'GET',
      headers: {}
    }

    const res = await fetchWithAuth(`${url}/${id}`, options, router)
    if (res) {
      return await res.json()
    }
    return null
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function deleteItemById(url, id, router) {
  try {
    const options = {
      method: 'DELETE',
      headers: {}
    }

    const res = await fetchWithAuth(`${url}/${id}`, options, router)
    if (res) {
      return res.status
    }
    return null
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function deleteAndTransferItem(url, id, newId, router) {
  try {
    const options = {
      method: 'DELETE',
      headers: {}
    }

    const res = await fetchWithAuth(`${url}/${id}/${newId}`, options, router)
    if (res) {
      return res.status
    }
    return null
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function addItem(url, newItem, router) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    }

    const res = await fetchWithAuth(url, options, router)
    if (res) {
      return await res.json()
    }
    return null
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function editItem(url, id, editedItem, router) {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedItem)
    }

    const res = await fetchWithAuth(`${url}/${id}`, options, router)
    if (res) {
      return await res.json()
    }
    return null
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function toggleVisibility(url,id, visibility) {
  try {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {visibility} )
    }
    const res = await fetchWithAuth(`${url}/${id}`, options);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error(`Network error: ${error}`);
    return null;
  }
};

export { getItemById, deleteItemById, addItem, editItem, deleteAndTransferItem,toggleVisibility }
