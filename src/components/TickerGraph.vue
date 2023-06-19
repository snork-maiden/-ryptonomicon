<script>
export default {
  name: "TickerGraph",
  props: {
    selectedTicker: Object,
    graph: Array,
  },
  emits: {
    clearTicker: null,
  },
  data() {
    return {
      maxGraphElements: 1,
    };
  },
  mounted() {
    this.calculateMaxGraphElements();
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },
  computed: {},

  methods: {
    normalizeGraph(graph) {
      if (graph.length > this.maxGraphElements) {
        const extra = graph.length - this.maxGraphElements;
        graph = graph.slice(extra);
      }
      const maxValue = Math.max(...graph);
      const minValue = Math.min(...graph);

      if (maxValue === minValue) return graph.map(() => 50);

      return graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
    calculateMaxGraphElements() {
      if (!this.$refs.graph) {
        return;
      }

      const MinGraphElementWidth = 20;
      const graphWidth = this.$refs.graph.clientWidth;
      this.maxGraphElements = Math.floor(graphWidth / MinGraphElementWidth);
    },
  },
};
</script>
<template>
  <section>
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ selectedTicker.name }} - USD
    </h3>
    <div
      class="flex items-end border-gray-600 border-b border-l h-64"
      ref="graph"
    >
      <div
        v-for="(bar, idx) in normalizeGraph(graph)"
        :key="idx"
        :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-8"
      ></div>
    </div>
  </section>
</template>
