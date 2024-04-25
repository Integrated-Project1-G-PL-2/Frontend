<script setup>

</script>
 
<template>
<!-- <div class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px]">
    <div class="bg-white h-[75%] w-[75%] m-[auto] border-4 flex flex-row basis-full" >
        <div class=" border-b-2">
            <p class="text-xl m-[1.5%]" >Design Backend API for PBI 1,2</p>
        </div>
        <div class="flex flex-row ">
            <div class="">
                <textarea>

                </textarea>
            </div>
            <div class=" flex flex-col">

            </div>
        </div>
        <div class=" border-t-2">
            <botton>sdads</botton>
        </div>
    </div>
</div> -->
<div class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px]">
    <div class="container mx-auto px-4 py-8 border- 4 bg-orange-50">
    <h1 class="text-2xl font-bold mb-6">Design Backend API for PBI 1,2</h1>
    <form class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label for="description" class="text-sm font-medium mb-2">Description</label>
        <textarea id="description" rows="4" class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
      </div>
      <div class="flex flex-col">
        <label for="assignees" class="text-sm font-medium mb-2">Assignees</label>
        <input type="text" id="assignees" class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500">
      </div>
      <div class="flex flex-col w-full">
        <label for="status" class="text-sm font-medium mb-2">Status</label>
        <select id="status" class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500">
          <option value="">Select Status</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div class="flex flex-col w-full">
        <label for="timeZone" class="text-sm font-medium mb-2">TimeZone</label>
        <input type="text" id="timeZone" value="Asia/Bangkok" class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500" readonly>
      </div>
      <div class="flex justify-end w-full">
        <button type="button" class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md">Submit</button>
      </div>
    </form>
  </div>
</div>
</template>
 
<style scoped>

</style>