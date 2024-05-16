function sortByTitle(tasks) {
  tasks.sort((a, b) =>
    a.status.name.localeCompare(b.status.name, 'th', { sensitivity: 'base' })
  )
}
function sortByTitleReverse(tasks) {
  tasks.sort((a, b) =>
    b.status.name.localeCompare(a.status.name, 'th', { sensitivity: 'base' })
  )
}
function sortByTitleDate(tasks) {
  tasks.sort((a, b) => a.id - b.id)
}

function searchByStatus(items, keywords) {
  const lowerCaseKeywords = keywords.toLowerCase()
  items.filter((items) => items.status.name.includes(lowerCaseKeywords)) ||
    items.id.toString().includes(lowerCaseKeywords) ||
    items.title.includes(lowerCaseKeywords) ||
    items.assignees.includes(lowerCaseKeywords)
}
export { sortByTitle, sortByTitleReverse, sortByTitleDate, searchByStatus }
