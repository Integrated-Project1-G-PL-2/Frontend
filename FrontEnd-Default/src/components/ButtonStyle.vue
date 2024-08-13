<script setup>
const props = defineProps({
  bgColor: String
})

const edit = props.bgColor
const bgColor2 = 'editColor'
</script>
<template>
  <button
    class="font-sans text-center gap-5 text-gray-100 hover:text-gray-200 mr-5 w-14 rounded-[8px]"
    :class="bgColor2 == edit ? 'bg-green-400' : 'bg-red-400'"
  >
    <slot> </slot>
  </button>
</template>
<style scoped></style>
