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

export { sortByTitle, sortByTitleReverse, sortByTitleDate }
