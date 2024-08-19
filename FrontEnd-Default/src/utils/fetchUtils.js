async function getItems(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`Failed to fetch items: ${res.status}`)
      return null // Return null or an appropriate error value
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null // Return null or an appropriate error value
  }
}

async function getItemById(url, id) {
  try {
    const res = await fetch(`${url}/${id}`)
    if (!res.ok) {
      console.error(`Failed to fetch item with ID ${id}: ${res.status}`)
      return null // Return null or an appropriate error value
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null // Return null or an appropriate error value
  }
}

async function deleteItemById(url, id) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      console.error(`Failed to delete item with ID ${id}: ${res.status}`)
      return res.status
    }
    return res.status
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null // Return null or an appropriate error value
  }
}

async function deleteAndTransferItem(url, id, newId) {
  try {
    const res = await fetch(`${url}/${id}/${newId}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      console.error(
        `Failed to delete and transfer item with ID ${id} to ${newId}: ${res.status}`
      )
      return res.status
    }
    return res.status
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null // Return null or an appropriate error value
  }
}

async function addItem(url, newItem) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
    if (!res.ok) {
      console.error(`Failed to add item: ${res.status}`)
      return null // Return null or an appropriate error value
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null // Return null or an appropriate error value
  }
}

async function editItem(url, id, editedItem) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedItem)
    })
    if (!res.ok) {
      console.error(`Failed to edit item with ID ${id}: ${res.status}`)
      return null // Return null or an appropriate error value
    }
    return await res.json()
  } catch (error) {
    console.error(`Network error: ${error}`)
    return null // Return null or an appropriate error value
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
