<script setup>
import { ref, reactive } from "vue";
import { deleteItemById } from "./utils/fetchUtils";
import taskManager from "./utils/TaskManager";
import { useRoute, useRouter } from "vue-router";
const emits1 = defineEmits([
  "showDeleteTaskDetail",
  "showRedPopupDel",
  "showGreenPopupDel",
]);
const props = defineProps(["taskId", "operate"]);
const router = useRouter();
const deleteTask = async (deleteId) => {
  emits1("showDeleteTaskDetail", false);
  router.replace({ name: "Task" });
  const deletedTask = await deleteItemById(
    import.meta.env.VITE_BASE_URL,
    deleteId
  );
  router.replace({ name: "Task" });
  if (deletedTask.status == "404") {
    emits1("showRedPopupDel", {
      operate: props.operate,
      taskTitle: props.taskId.value.taskTitle,
    });

    return;
  }
  taskManager.deleteTask(deleteId);
  emits1("showGreenPopupDel", {
    operate: props.operate,
    taskTitle: props.taskId.value.taskTitle,
  });
};
</script>

<template>
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[10px]"
  >
    <div class="w-[30%] m-[auto] border border-green-700 mt-[20%]">
      <div class="flex flex-col justify-between bg-white p-4 h-[100px]">
        <div class="itbkk-title w-full h-[70px] mt-1 border-b">
          <h1 class="text-xl font-bold text-justify">Delete a Task</h1>
        </div>

        <div class="w-[70%] h-[100%]">
          <div class="pl-4 mt-4">
            Do you want to delete the task "{{ props.taskId.value.index }}.
            {{ props.taskId.value.taskTitle }}" ?
          </div>
        </div>
      </div>
      <div class="flex flex-row w-full justify-end border-t h-[60%]">
        <button
          class="itbkk-button-confirm bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[60px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-2"
          @click="deleteTask(props.taskId.value.id)"
        >
          <div class="btn text-center">Confirm</div>
        </button>
        <button
          class="itbkk-button-cancel bg-red-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[2px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200 mr-3 mt-2"
          @click="
            [
              $emit('showDeleteTaskDetail', false),
              $router.replace({ name: 'Task' }),
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
