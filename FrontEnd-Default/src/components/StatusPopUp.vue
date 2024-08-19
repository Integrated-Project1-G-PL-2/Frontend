<script setup>
import { reactive, ref } from 'vue'
import { useTaskManager } from '@/stores/TaskManager'
import { useStatusManager } from '@/stores/StatusManager'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem
} from '../utils/fetchUtils.js'
const router = useRouter()
const statusManager = useStatusManager()
const emits = defineEmits([
  'openEditDetail',
  'showStatusDetailModal',
  'showStatusRedPopup',
  'showStatusGreenPopup'
])
const prop = defineProps({
  operate: String,
  statusDetail: Object
})
const title = ref(prop.operate)

onMounted(async () => {
  statusManager.setStatuses(await getItems(import.meta.env.VITE_BASE_URL_V2))
})

let status

const init = () => {
  if (!prop.statusDetail.value) {
    status = reactive({ name: '', description: null })
  } else {
    status = reactive({ ...prop.statusDetail.value })
  }
}

const validation = function () {
  return (
    status.name === '' ||
    (status.name === prop.statusDetail.value?.name &&
      status.description === prop.statusDetail.value?.description)
  )
}
const isNameOverLimit = ref(false)
const isDescriptionOverLimit = ref(false)

const checkNameLength = () => {
  isNameOverLimit.value = status.name.length > 50
}
const checkDescriptionLength = () => {
  isDescriptionOverLimit.value = status.description.length > 200
}

const saveClick = async () => {
  if (isNameOverLimit.value || isDescriptionOverLimit.value) {
    return
  }
  if (prop.operate === 'add') {
    const addedStatus = await addItem(import.meta.env.VITE_BASE_URL_V2, status)
    if (addedStatus != null) {
      statusManager.addStatuses(addedStatus)
      emits('showStatusGreenPopup', {
        taskStatus: addedStatus.name,
        operate: prop.operate
      })
    } else {
      emits('showStatusRedPopup', {
        taskStatus: status.name,
        operate: prop.operate
      })
    }
  } else if (prop.operate === 'edit') {
    status.description =
      status.description == null
        ? status.description
        : status.description.trim()
    const editedStatus = await editItem(
      import.meta.env.VITE_BASE_URL_V2,
      prop.statusDetail.value.id,
      status
    )
    if (editedStatus != null) {
      statusManager.editStatues(editedStatus.id, editedStatus)
      emits('showStatusGreenPopup', {
        taskStatus: editedStatus.name,
        operate: prop.operate
      })
    } else {
      emits('showStatusRedPopup', {
        taskStatus: '',
        operate: prop.operate
      })
    }
  }
  router.replace({ name: 'StatusList' })
  emits('showStatusDetailModal')
}

init()
const allStatus = statusManager.getStatuses()

const checkUnique = function (Name) {
  for (const eachStatus of allStatus) {
    if (prop.operate === 'add') {
      const eachStatusName = eachStatus.name
      if (eachStatusName.toUpperCase() == Name.toUpperCase()) {
        return true
      }
    }
  }
}
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px] overflow-auto"
  >
    <div class="itbkk-modal-status w-[90%] m-[auto] border border-gray-500">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">
            {{ title.charAt(0).toUpperCase() + title.slice(1) }} Status
          </div>
        </div>
        <div class="border-b w-full mt-4"></div>
        <div class="itbkk-modal-status w-full h-[10%] mt-2">
          <div class="pl-4 mt-4">Name</div>
          <textarea
            v-model="status.name"
            class="itbkk-status-name w-[90%] h-[40%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
            @input="checkNameLength"
            :class="{ 'border-red-600 text-red-600': isNameOverLimit }"
          >
          </textarea>
          <div
            style="display: flex; align-items: center"
            v-if="isNameOverLimit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-px h-4 w-[20rem]"
              class="w-[15px] text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <div class="text-sm text-red-600">
              Limit text to 50 characters or less.
            </div>
          </div>
        </div>

        <div class="w-[full] h-[50%]">
          <div class="pl-4 mt-4">Description</div>
          <div class="w-full h-[320px]">
            <textarea
              v-model="status.description"
              class="itbkk-status-description w-[90%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              placeholder="No Description Provided"
              @input="checkDescriptionLength"
              :class="{ 'border-red-600 text-red-600': isDescriptionOverLimit }"
            ></textarea>
            <div
              style="display: flex; align-items: center"
              v-if="isDescriptionOverLimit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-[20rem]"
                class="w-[15px] text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <div class="text-sm text-red-600">
                Limit text to 200 characters or less.
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="saveClick"
            :disabled="validation() || checkUnique(status.name)"
          >
            save
          </button>
          <button
            class="itbkk-button-cancel bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="
              ;[
                emits('showStatusDetailModal'),
                $router.replace({ name: 'StatusList' })
              ]
            "
          >
            <div class="btn">cancel</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
