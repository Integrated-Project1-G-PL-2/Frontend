<script setup>
defineProps({ id: String })
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
  <!-- <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px]"
  > -->
  <!-- <div class="container mx-auto px-4 py-8 border- 4 bg-orange-50">
      <h1 class="text-2xl font-bold mb-6">Design Backend API for PBI 1,2</h1>
      <form class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label for="description" class="text-sm font-medium mb-2"
            >Description</label
          >
          <textarea
            id="description"
            rows="4"
            class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>
        <div class="flex flex-col">
          <label for="assignees" class="text-sm font-medium mb-2"
            >Assignees</label
          >
          <input
            type="text"
            id="assignees"
            class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div class="flex flex-col w-full">
          <label for="status" class="text-sm font-medium mb-2">Status</label>
          <select
            id="status"
            class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="flex flex-col w-full">
          <label for="timeZone" class="text-sm font-medium mb-2"
            >TimeZone</label
          >
          <input
            type="text"
            id="timeZone"
            value="Asia/Bangkok"
            class="shadow-sm rounded-md w-full block focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            readonly
          />
        </div>
        <div class="flex justify-end w-full">
          <button
            type="button"
            class="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div> -->

  <!-- kong -->
  <!-- <div
      class="container mx-auto px-4 py-8 border- 4 bg-white relative border divide-x flex"
    > -->
  <!-- Title Section -->
  <!-- <h1
        class="itbkk-title font-bold text-2xl text-justify bg-gray-50 h-[50px]"
      >
        Design Backend API for PBI 1,2
      </h1>
      <slot name="btn">
        <form method="dialog" class="flex justify-center">
          <ButtonSetting class="w-full" styleType="close" title="close" />
        </form>
      </slot>
    </div>
    <div class="bg-white text-sm flex"> -->
  <!-- Description Section -->
  <!-- <Field class="flex-grow mr-2">
        <div
          class="itbkk-status md:flex font-bold w-[60px] flex flex-col p-4 gap-2"
        >
          <Label>Description</Label>
          <p>
            <textarea
              class="justify-center h-[506px] w-[750px] border border-black"
            >
            Need to specify endpoints, request body, response body, status
          </textarea
            >
          </p>
        </div>
      </Field>
      <-- Assignees Section -->
  <!-- <div class="itbkk-assignees md:flex font-bold flex flex-col p-4 gap-2">
        <Label>Assignees</Label>
        <p>
          <textarea
            class="justify-center h-[220px] w-[420px] border border-black"
          >
Pang;Pong</textarea
          >
        </p> -->
  <!-- Status Section -->
  <!-- <Label>Status</Label>
        <select
          class="justify-center h-[40px] w-[400px] border border-black bg-white text-gray-300"
        >
          <option value="itbkk-status ">Status</option>
          <option value="itbkk-status">1</option>
          <option value="itbkk-status">2</option>
        </select>  -->
  <!-- Timezone Section -->
  <!-- TimeZone :<input class="w-[200px] border border-black bg-white" />
        <div class="itbkk-timezone bg-gray-100"></div>
        Created On :<input class="w-[200px] border border-black bg-white" />
        <div class="itbkk-created-on bg-gray-100"></div>
        Updated On :<input class="w-[200px] border border-black bg-white" />
        <div class="itbkk-updated-on bg-gray-100"></div>
      </div>
    </div> -->

  <!-- Button Section -->
  <!-- <div
      class="itbkk-button bg-gray-50 relative border h-[48px] flex justify-end gap-2"
    >
      <button
        class="itbkk-button bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[10px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200"
      >
        Ok
      </button>
      <button
        class="itbkk-button bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[10px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200"
      >
        Close
      </button>
    </div>
  </div> -->
  <div
    class="bg-grey-500 backdrop-blur-sm w-screen h-screen fixed top-0 left-0 pt-[100px]"
  >
    <div class="w-[90%] m-[auto]">
      <div class="flex flex-col justify-between bg-white p-4">
        <div class="w-full h-[10%] mt-2">
          <h1 class="itbkk-title text-xl font-bold text-justify">
            Design Backend API for PBI 1,2
          </h1>
        </div>
        <div class="border-b w-full mt-4"></div>
        <div class="flex flex-row">
          <div class="w-[70%] h-[50%]">
            <div class="pl-4 mt-4">Description</div>
            <div class="w-full h-[420px]">
              <textarea
                class="w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter your text here..."
              ></textarea>
            </div>
          </div>
          <div class="w-[30%] h-[50%] flex-col">
            <div class="h-[180px]">
              <div class="pl-4 mt-4">Assignees</div>
              <div class="h-[150px]">
                <textarea
                  class="w-[95%] h-[90%] px-4 py-2 mx-4 my-2 bbg-white text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter your text here..."
                ></textarea>
              </div>
            </div>
            <div class="w-full h-[100px]">
              <label class="form-control w-full pl-4">
                <div class="label">
                  <span class="label-text">Status</span>
                </div>
                <select
                  class="itbkk-status select select-bordered w-full bg-inherit border-gray-100 rounded-md text-gray-300"
                >
                  <option disabled selected>Status</option>
                  <option>To do</option>
                  <option>Doing</option>
                  <option>Done</option>
                </select>
              </label>
            </div>
            <div class="mt-10 ml-4">
              <div class="itbkk-timezone">
                <div>TimeZone :</div>
                <div></div>
              </div>
              <div class="itbkk-created-on">
                <div>Created On :</div>
                <div></div>
              </div>
              <div class="itbkk-updated-on">
                <div>Updated On :</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-row w-full justify-end itbkk-button bg-gray-50 relative border h-[48px] gap-2"
        >
          <div
            class="itbkk-button bg-green-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[10px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200"
          >
            <div @click="$emit('setDetail', false)" class="btn">Ok</div>
          </div>
          <div
            class="itbkk-button bg-gray-400 scr-m:btn-sm scr-l:btn-md scr-l:rounded-[10px] rounded-[10px] w-[50px] h-[25px] font-sans btn-xs scr-l:btn-m text-center flex flex-col gap-2 hover:text-gray-200"
          >
            <div @click="$emit('setDetail', false)" class="btn">close</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
