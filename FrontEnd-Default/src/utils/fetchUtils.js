import {refreshToken} from '@/stores/UserManager'
export async function getItems(url, router) {
  try {
    const token = localStorage.getItem('jwt');
    const options = {
      method: 'GET',
      headers: {}
    };
    
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      if (res.status === 401) {
        console.log("Access token expired, attempting to refresh...");
        const newToken = await refreshToken(router);
        if (newToken) {
          // Retry the request with the new token

          options.headers.Authorization = `Bearer ${newToken}`;
          const retryRes = await fetch(url, options);
          
          if (retryRes.ok) {
            return await retryRes.json();
          } else {
            console.error(`Retry failed with status: ${retryRes.status}`);
            return retryRes.status;
          }
        } else {
          console.error("Token refresh failed, logging out.");
          logout();
          router.replace({ name: 'Login' });
        }
      } else {
        console.error(`Failed to fetch items: ${res.status}`);
        return res.status;
      }
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Network error: ${error}`);
    return null;
  }
}



async function getItemById(url, id) {
  try {
    const token = localStorage.getItem('jwt')
    const options = {}
    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await fetch(`${url}/${id}`, options)
    if (!res.ok) {
      console.error(`Failed to fetch item with ID ${id}: ${res.status}`)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function deleteItemById(url, id) {
  try {
    const token = localStorage.getItem('jwt')
    const options = {
      method: 'DELETE'
    }
    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await fetch(`${url}/${id}`, options)
    if (!res.ok) {
     
      console.error(`Failed to delete item with ID ${id}: ${res.status}`)
      return res.status
    }
    return res.status
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function deleteAndTransferItem(url, id, newId) {
  try {
    const token = localStorage.getItem('jwt')
    const options = {
      method: 'DELETE'
    }
    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await fetch(`${url}/${id}/${newId}`, options)
    if (!res.ok) {
      console.error(
        `Failed to delete and transfer item with ID ${id} to ${newId}: ${res.status}`
      )
      return res.status
    }
    return res.status
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function addItem(url, newItem) {
  try {
    const token = localStorage.getItem('jwt')
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    }

    if (token) {
      options.headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(url, options)
    if (!res.ok) {
      console.error(`Failed to add item: ${res.status}`)
      return res.status
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function editItem(url, id, editedItem) {
  try {
    const token = localStorage.getItem('jwt')
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedItem)
    }
    if (token) {
      options.headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(`${url}/${id}`, options)
    if (!res.ok) {
      console.error(`Failed to edit item with ID ${id}: ${res.status}`)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

export {
 
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  deleteAndTransferItem,

}
