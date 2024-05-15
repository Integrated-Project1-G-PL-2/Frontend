function sortByTitle(tasks) {
  tasks.sort((a, b) =>
    a.title.localeCompare(b.title, 'th', { sensitivity: 'base' })
  )
}
function sortByTitleReverse(tasks) {
  tasks.sort((a, b) =>
    b.title.localeCompare(a.title, 'th', { sensitivity: 'base' })
  )
}

export { sortByTitle, sortByTitleReverse }
