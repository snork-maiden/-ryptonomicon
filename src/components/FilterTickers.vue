<script>
export default {
  emits: {
    filterTickers: Array | null,
  },
  props: {
    tickers: Array,
  },
  data() {
    return {
      filter: "",
      page: 1,
    };
  },
  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },
  },
  methods: {
    getFilteredList() {
      this.filter = this.filter.toUpperCase();

      const filteredTickers = this.tickers.filter((ticker) =>
        ticker.name.includes(this.filter)
      );
      this.$emit("filterTickers", filteredTickers);
    },
  },
  watch: {
    tickers() {
      this.getFilteredList();
    },
  },
};
</script>
<template>
  <div>
    <!-- <button
      class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      v-if="page > 1"
      @click="page -= 1"
    >
      Назад
    </button>
    <button
      class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      @click="page += 1"
      v-if="hasNextPage"
    >
      Вперед
    </button> -->
    <div>
      Фильтр:
      <input
        v-model="filter"
        @input="getFilteredList"
        class="p-1 ml-2 focus:outline-yellow-500"
      />
    </div>
  </div>
</template>
