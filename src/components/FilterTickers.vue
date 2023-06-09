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
      filteredTickers: this.tickers,
    };
  },
  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
    getFilteredList() {
      this.filter = this.filter.toUpperCase();

      this.filteredTickers = this.tickers.filter((ticker) =>
        ticker.name.includes(this.filter)
      );
      this.$emit("filterTickers", this.paginatedTickers);
    },
  },
  watch: {
    tickers() {
      this.getFilteredList();
    },
    filter() {
      this.page = 1;
      this.getFilteredList();
    },
    page() {
      this.$emit("filterTickers", this.paginatedTickers);
    },
  },
  created() {
    this.$emit("filterTickers", this.paginatedTickers);
  },
};
</script>
<template>
  <div>
    <template v-if="hasNextPage || page > 1">
      <button
        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        :disabled="page === 1"
        @click="page -= 1"
      >
        Назад
      </button>
      <button
        class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        @click="page += 1"
        :disabled="!hasNextPage"
      >
        Вперед
      </button>
    </template>
    <div>
      Фильтр:
      <input v-model="filter" class="p-1 ml-2 focus:outline-yellow-500" />
    </div>
  </div>
</template>
