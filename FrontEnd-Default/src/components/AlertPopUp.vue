<script setup>
const props = defineProps({
  titles: String,
  message: String,
  styleType: {
    type: String,
    validator(value) {
      return ['green', 'red', 'yellow'].includes(value)
    }
  },
  operate: String,
  link: {
    type: Object, // Expecting an object with `path` and optional `name` or `params`
    required: false
  }
})

const emit = defineEmits(['closePopUp'])
</script>
<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="itbkk-message px-6 py-4 rounded-lg relative shadow-lg"
      :class="
        styleType === 'green'
          ? 'bg-green-100 border border-green-400 text-green-700 '
          : styleType === 'red'
          ? 'bg-red-100 border border-red-400 text-red-700 '
          : styleType === 'yellow'
          ? 'bg-yellow-100 border border-yellow-400 text-yellow-700 '
          : 'bg-gray-100 border border-gray-400 text-gray-700'
      "
      role="alert"
    >
      <strong class="font-bold">{{ message }}</strong>
      <p>
        <span class="itbkk-message block sm:inline">{{ titles }}</span>
      </p>
      <!-- Conditionally render a link if the 'link' prop is provided -->
      <p v-if="link">
        <router-link :to="link" class="text-blue-600 underline">
          Click here to view invitation
        </router-link>
      </p>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6"
          :class="
            styleType === 'green'
              ? 'text-green-500 '
              : styleType === 'red'
              ? 'text-red-500 '
              : styleType === 'yellow'
              ? 'text-yellow-500 '
              : 'text-gray-500'
          "
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          @click="emit('closePopUp', operate)"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<!-- <script setup>
const props = defineProps({
  titles: String,
  message: String,
  styleType: {
    type: String,
    varlidatior(value) {
      return ['green', 'red'].includes(value)
    }
  },
  operate: String
})
defineEmits(['closePopUp'])
</script>
<template>
  <div
    class="itbkk-message px-4 py-3 rounded relative"
    :class="
      styleType === 'green'
        ? 'bg-green-100 border border-green-400 text-green-700 '
        : styleType === 'red'
        ? 'bg-red-100 border border-red-400 text-red-700 '
        : 'bg-gray-100 border border-gray-400 text-gray-700'
    "
    role="alert"
  >
    <strong class="font-bold">{{ message }}</strong>
    <p>
      <span class="itbkk-message block sm:inline"> {{ titles }}</span>
    </p>
    <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg
        class="fill-current h-6 w-6 text-green-500"
        :class="
          styleType === 'green'
            ? 'text-green-500 '
            : styleType === 'red'
            ? 'text-red-500 '
            : 'text-gray-500'
        "
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        @click="$emit('closePopUp', props.operate)"
      >
        <path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        />
      </svg>
    </span>
  </div>
</template>
<style scoped></style> -->
