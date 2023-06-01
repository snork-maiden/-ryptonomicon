<template>
  <button
    @click="$emit('click')"
    type="button"
    class="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
      class="-ml-0.5 mr-2 h-6 w-6"
      viewBox="0 0 24 24"
    >
      <path
        d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
      />
    </svg>
    Добавить
  </button>
</template>
