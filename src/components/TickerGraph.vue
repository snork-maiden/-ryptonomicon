<script>
import ClearButton from "./ClearButton.vue";

export default {
  name: "TickerGraph",
  components: {
    ClearButton,
  },
  props: {
    selectedTicker: Object,
    graph: Array
  },
  emits: {
    clearTicker: null,
  },

  methods: {},
  computed: {
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) return this.graph.map(() => 50);

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
  },
};
</script>
<template>
  <section>
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ selectedTicker.name }} - USD
    </h3>
    <div class="flex items-end border-gray-600 border-b border-l h-64">
      <div
        v-for="(bar, idx) in normalizedGraph"
        :key="idx"
        :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-8"
      ></div>
    </div>
    <ClearButton @click="clearTicker" class="absolute"> </ClearButton>
  </section>
</template>
