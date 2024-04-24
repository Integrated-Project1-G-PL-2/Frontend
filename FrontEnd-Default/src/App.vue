<script setup>

  const tasks = [
    {
      id:'1',
      title:'This is task title',
      assignees:'This is assignees',
      status:'This is status'
    },
    {
      id:'2',
      title:'This is second task title',
      assignees:'This is second assignees',
      status:'This is second status'
    }
  ]
</script>

<template>
  <div class="bg-white relative border rounded-lg">
    <h1 class="font-bold text-center">IT-Bangmod Kradan Kanban</h1>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th class="px-4 py-3"></th>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Assignees</th>
          <th class="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id" class="itbkk-item border-b">
        <td class="px-4 py-3">{{ task.id }}</td>
        <td class="itbkk-title px-4 py-3">{{ task.title }}</td>
        <td class="itbkk-assignees px-4 py-3">{{ task.assignees }}</td>
        <td class="itbkk-status px-4 py-3">{{ task.status }}</td>
        </tr>
      </tbody>
    </table>
  
  </div>
</template>

<style scoped>

</style>
