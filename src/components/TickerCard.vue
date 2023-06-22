<script>
import DeleteButton from "./DeleteButton.vue";

export default {
  emits: {
    delete: null,
  },
  components: {
    DeleteButton,
  },
  props: {
    ticker: Object,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  methods: {
    formatPrice(price) {
      if (!this.isPrice) return "-";
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
  },
  computed: {
    isPrice() {
      return this.ticker.price && this.ticker.price !== "-";
    },
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 10000);
  },
};
</script>
<template>
  <div
    class="bg-white overflow-hidden shadow rounded-lg outline-yellow-500 outline-offset-1 outline-4 cursor-pointer"
    :class="{
      'shadow-red-400': !isPrice && !isLoading,
    }"
  >
    <div class="px-4 py-5 sm:p-6 text-center">
      <dt class="text-sm font-medium text-gray-500 truncate">
        {{ ticker.name }} - USD
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {{ formatPrice(ticker.price) }}
      </dd>
    </div>
    <div class="w-full border-t border-gray-200"></div>
    <DeleteButton
      @click.stop="$emit('delete')"
      :class="{
        'bg-red-800': !isPrice && !isLoading,
        'bg-yellow-700': !isPrice && isLoading,
      }"
    />
  </div>
</template>
