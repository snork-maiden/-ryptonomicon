<script>
import AddTicker from "./components/AddTicker.vue";
import LoaderSpinner from "./components/LoaderSpinner.vue";
import TickerGraph from "./components/TickerGraph.vue";
import TickerCard from "./components/TickerCard.vue";
import { subscribeToTicker } from "./api.js";

export default {
  name: "App",

  components: {
    AddTicker,
    LoaderSpinner,
    TickerGraph,
    TickerCard,
  },
  data() {
    return {
      tickers: [],
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
      this.tickers.push(currentTicker);

      subscribeToTicker(currentTicker.name, (newPrice) =>
        this.updateTicker(currentTicker.name, newPrice)
      );

      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));

      // setInterval(async () => {
      //   const f = await fetch(
      //     `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.name}&tsyms=USD&api_key=ce3fd966e7a1d10d65f907b20bf000552158fd3ed1bd614110baa0ac6cb57a7e`
      //   );
      //   const data = await f.json();
      //   // currentTicker.price =  data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);
      //   this.tickers.find((t) => t.name === currentTicker.name).price =
      //     data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);
      //   if (this.selectedTicker?.name === currentTicker.name) {
      //     this.graph.push(data.USD);
      //   }
      // }, 5000);
    },

    select(ticker) {
      this.selectedTicker = ticker;
      console.log(this.selectedTicker);
      this.graph = [];
    },
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
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
        :coins-list="coinsList"
        :is-added="isAlreadyAdd"
      />

      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <TickerCard
            v-for="t in tickers"
            :key="t.name"
            :ticker="t"
            @click="select(t)"
            @delete="handleDelete(t)"
            :class="{
              'border-4': selectedTicker === t,
            }"
          />
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <TickerGraph
        v-if="selectedTicker"
        class="relative"
        :selected-ticker="selectedTicker"
        @clearTicker="selectedTicker = null"
      />
    </div>
  </div>
</template>
