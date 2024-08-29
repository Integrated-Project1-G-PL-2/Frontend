const token = localStorage.getItem('jwt')

async function getItems(url) {
  try {
    const options = {}
    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await fetch(url, options)
    if (!res.ok) {
      console.error(`Failed to fetch items: ${res.status}`)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function getItemById(url, id) {
  try {
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
      return null
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null
  }
}

async function editItem(url, id, editedItem) {
  try {
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
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
  deleteAndTransferItem
}
