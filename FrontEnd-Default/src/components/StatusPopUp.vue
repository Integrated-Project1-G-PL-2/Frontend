<script setup>
import { reactive, ref } from "vue";
import { useTaskManager } from "@/stores/TaskManager";
import { useStatusManager } from "@/stores/StatusManager";
import { useRouter } from "vue-router";
import {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  editItem,
} from "../utils/fetchUtils.js";
const router = useRouter();
const statusManager = useStatusManager();
const emits = defineEmits([
  "closeStatusPopUP",
  "openEditDetail",
  "showStatusDetailModal",
  "showStatusRedPopup",
  "showStatusGreenPopup",
]);
const prop = defineProps({
  operate: String,
  statusDetail: Object,
});
const title = ref(prop.operate);
let status 
if(!prop.statusDetail.value){
  status = reactive({ name: "", description: null })
}else{
  status = reactive(prop.statusDetail.value)
}
const saveClick = async () => {
  if (prop.operate === "add") {
    const addedStatus = await addItem(import.meta.env.VITE_BASE_URL_V2, status);
    if (addedStatus.status != "400" && addedStatus.status != "500") {
      statusManager.addStatuses(addedStatus);
      emits("showStatusGreenPopup", {
        taskStatus: addedStatus.name,
        operate: prop.operate,
      });
    } else {
      emits("showStatusRedPopup", {
        taskStatus: status.name,
        operate: prop.operate,
      });
    }
  } else if (prop.operate === "edit") {
    status.description = status.description.trim()
    const editedStatus = await editItem(
      import.meta.env.VITE_BASE_URL_V2, prop.statusDetail.value.id , 
      status
    );
    if (editedStatus.status != "400" && editedStatus.status != "500") {
      statusManager.editStatues(editedStatus.id, editedStatus);
      emits("showStatusGreenPopup", {
        taskStatus: editedStatus.name,
        operate: prop.operate,
      });
    } else {
      emits("showStatusRedPopup", {
        taskStatus: editedStatus.name,
        operate: prop.operate,
      });
    }
  }
  router.replace({ name: "StatusList" });
  emits("showStatusDetailModal", false);
};
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px] overflow-auto"
  >
    <div class="w-[90%] m-[auto] border border-gray-500">
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
          >
          </textarea>
        </div>

        <div class="w-[full] h-[50%]">
          <div class="pl-4 mt-4">Description</div>
          <div class="w-full h-[320px]">
            <textarea
              v-model="status.description"
              class="itbkk-status-description w-[90%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
              placeholder="No Description Provided"
            ></textarea>
          </div>
        </div>

        <div class="flex flex-row w-full justify-end border-t">
          <button
            class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            :class="{ disabled: !status.name }"
            @click="saveClick"
            :disabled="status.name === ''"
          >
            save
          </button>
          <button
            class="itbkk-button-cancel bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center gap-2 hover:text-gray-200 mr-3 mt-2"
            @click="
              [
                emits('closeStatusPopUP'),
                $router.replace({ name: 'StatusList' }),
              ];
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
