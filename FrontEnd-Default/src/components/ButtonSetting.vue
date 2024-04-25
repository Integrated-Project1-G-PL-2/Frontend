<script setup>
const props = defineProps({
  title: String,
  action: { type: Function, default: () => {} },
  styleType: {
    type: String,
    varlidatior(value) {
      return ['save', 'close', 'quite'].includes(value)
    }
  }
})
</script>

<template>
  <button
    class="btn-save btn border-0 btn-close scr-l:w-[40%] scr-m:btn-sm scr-l:btn-md scr-l:rounded-[20px] rounded-[10px] w-[100px] h-[25px] font-sans btn-xs scr-l:btn-m"
    :class="
      styleType === 'save'
        ? 'hover:bg-[#96ff66]  bg-[#3e8a1b] text-White hover:text-Black'
        : styleType === 'close'
        ? 'bg-Main-pink-300  hover:bg-Main-pink-100 text-White hover:text-Black'
        : styleType === 'quite'
        ? ' bg-Black text-White hover:text-Black'
        : 'hover:bg-Main-blue-100  hover:bg-[#9b9efb]  text-White  bg-[#5d62f5] hover:text-Black '
    "
    id="saveButton"
    @click=";[action()]"
  >
    {{ title }}
  </button>
</template>

<style scoped></style>
../libs/SoundControl
