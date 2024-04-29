<script setup>
defineEmits(['yes', 'no'])
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px]"
  >
    <div
      class="rounded-[20px] scr-l:rounded-[40px] pb-2 pt-3 bg-Yellow-light text-Black gap-2 flex flex-col px-7 text-hss w-[600px] scr-m:w-[900px] scr-l:w-[1200px] scr-l:text-hs-des scr-l:gap-4 scr-l:py-5"
    >
      <h1 class="text-hm-des">Are you sure to remove this item?</h1>
      <div class="flex bg-White w-full scr-l:rounded-[20px] rounded-[10px]">
        <div class="flex gap-2">
          <form
            method="dialog"
            class="w-[49%] scr-l:w-[49%] flex justify-center"
          >
            <button
              class="btn-save btn border-0 btn-close scr-l:w-[40%] scr-m:btn-sm scr-l:btn-md scr-l:rounded-[20px] rounded-[10px] w-[100px] h-[25px] font-sans btn-xs scr-l:btn-m bg-Main-pink-300 hover:bg-Main-pink-100 text-White hover:text-Black w-full"
              id="saveButton"
            >
              Yes!
            </button>
          </form>
          <form
            method="dialog"
            class="w-[49%] scr-l:w-[49%] flex justify-center"
          >
            <button
              class="btn-save btn border-0 btn-close scr-l:w-[40%] scr-m:btn-sm scr-l:btn-md scr-l:rounded-[20px] rounded-[10px] w-[100px] h-[25px] font-sans btn-xs scr-l:btn-m hover:bg-[#96ff66] bg-[#3e8a1b] text-White hover:text-Black w-full"
              id="saveButton"
            >
              No
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
