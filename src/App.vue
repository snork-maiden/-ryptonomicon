<script>
import AddTicker from "./components/AddTicker.vue";
import LoaderSpinner from "./components/LoaderSpinner.vue";
import TickerGraph from "./components/TickerGraph.vue";
import TickerCard from "./components/TickerCard.vue";
import FilterTickers from "./components/FilterTickers.vue";
import {
  subscribeToTicker,
  unsubscribeFromTicker,
} from "./api/webSocketCryprtocompare";

export default {
  name: "App",

  components: {
    AddTicker,
    LoaderSpinner,
    TickerGraph,
    TickerCard,
    FilterTickers,
  },
  data() {
    return {
      tickers: [],
      filteredTickers: [],
      filter: "",
      selectedTicker: null,
      graph: [],
      isAlreadyAdd: false,
      showSpinner: true,
    };
  },

  created() {
    const tickersData = localStorage.getItem("cryptonomicon-list");
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }
    this.filteredTickers = this.tickers;
  },
  methods: {
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graph.push(price);
          }
          t.price = price;
        });
    },
    add(ticker) {
      if (this.tickers.find((item) => item.name === ticker)) {
        this.isAlreadyAdd = true;
        return;
      }
      this.isAlreadyAdd = false;

      const currentTicker = {
        name: ticker,
        price: "-",
      };
      this.tickers = [currentTicker, ...this.tickers];
      subscribeToTicker(currentTicker.name, (newPrice) =>
        this.updateTicker(currentTicker.name, newPrice)
      );
    },

    select(ticker) {
      this.selectedTicker = ticker;
      this.graph = [];
    },

    handleDelete(ticker) {
      this.tickers = this.tickers.filter((t) => t !== ticker);
      this.selectedTicker = null;
      unsubscribeFromTicker(ticker);
    },

    filterTickers(tickers) {
      this.filteredTickers = tickers;
    },
  },
  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },
  },
};
</script>

<template>
  <div class="container mx-auto flex flex-col items-center p-4">
    <LoaderSpinner v-if="showSpinner" />

    <div class="container">
      <AddTicker
        @add="add"
        @downloaded="showSpinner = false"
        :is-added="isAlreadyAdd"
      />

      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <FilterTickers :tickers="tickers" @filterTickers="filterTickers" />

        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-7xl">
          <TickerCard
            v-for="t in filteredTickers"
            :key="t.name"
            :ticker="t"
            @click="select(t)"
            @delete="handleDelete(t)"
            :class="{
              outline: selectedTicker === t,
            }"
          />
        </dl>

        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <TickerGraph
        v-if="selectedTicker"
        class="relative"
        :selected-ticker="selectedTicker"
        :graph="graph"
        @clearTicker="selectedTicker = null"
      />
    </div>
  </div>
</template>
