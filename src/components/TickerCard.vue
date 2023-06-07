<script>
export default {
  // name: "AddButton",
  emits: {
    delete: null,
  },
  props: {
    ticker: Object,
  },
  //   data() {
  //     return {
  //       ticker: "",
  //       clues: [],
  //       isEditing: false,
  //     };
  //   },
};
</script>
<template>
  <div
    class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
  >
    <div class="px-4 py-5 sm:p-6 text-center">
      <dt class="text-sm font-medium text-gray-500 truncate">
        {{ ticker.name }} - USD
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {{ ticker.price }}
      </dd>
    </div>
    <div class="w-full border-t border-gray-200"></div>
    <button
      @click.stop="$emit('delete')"
      class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#718096"
        aria-hidden="true"
        class="h-5 w-5"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M9 2a1 1 0 0 0-1 1L7 4H4a1 1 0 0 0 0 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a1 1 0 1 0 0-2h-3l-1-1a1 1 0 0 0-1-1H9zM7 8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0V8zm5-1a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      Удалить
    </button>
  </div>
</template>
