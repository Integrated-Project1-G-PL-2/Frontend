<script setup>
import { ref, reactive } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { toggleVisibility } from '@/utils/fetchUtils'
const visibility = reactive({})
const props = defineProps({
  message: String,
  operate: String
})
const route = useRoute()
const router = useRouter()
const deClareemit = defineEmits([
  'confirmVisibilityPopUp',
  'closeVisibilityPopUp',
  'visibilityError',
  'visibilityPermission'
])

const changeVisibility = async (PublicOrPrivate) => {
  visibility.value = await toggleVisibility(
    `${import.meta.env.VITE_BASE_URL}/v3/boards`,
    `${route.params.id}`,
    PublicOrPrivate.toUpperCase()
  )
  if (visibility.value == 401) {
    deClareemit('confirmVisibilityPopUp', props.operate)
    router.push({ name: 'Login' })
    return
  } else if (visibility.value == 403) {
    deClareemit('visibilityPermission', true)
    deClareemit('confirmVisibilityPopUp', props.operate)
    return
  } else if (
    visibility.value.visibility == 'PRIVATE' ||
    visibility.value.visibility == 'PUBLIC'
  ) {
    deClareemit('confirmVisibilityPopUp', props.operate)
    return
  } else {
    deClareemit('visibilityError', true)
    deClareemit('confirmVisibilityPopUp', props.operate)
    return
  }
}
</script>

<template>
  <div
    class="itbkk-modal-alert bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
  >
    <div class="w-[59%] m-[auto] border border-green-700 mt-[20%]">
      <div class="flex flex-col justify-between bg-white p-4 h-[10%]">
        <div class="w-full h-[40px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">
            Board visibility changed!
          </h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="itbkk-message flex pl-4 mt-5">
            {{ message }}
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $router.replace({ name: 'Task' }),
              changeVisibility(props.operate)
            ]
          "
        >
          <div class="btn text-center"> {{props.operate}}</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-4 mb-2"
          @click="
            ;[
              $emit('closeVisibilityPopUp', true),
              $router.replace({ name: 'Task' })
            ]
          "
        >
          <div class="btn text-center">Cancel</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
