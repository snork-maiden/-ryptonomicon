<script>
import AddTicker from "./components/AddTicker.vue";
import LoaderSpinner from "./components/LoaderSpinner.vue";
import TickerGraph from "./components/TickerGraph.vue";

export default {
  name: "App",

  components: {
    AddTicker,
    LoaderSpinner,
    TickerGraph,
  },
  data() {
    return {
      tickers: [],
      selectedTicker: null,
      graph: [],
      isAlreadyAdd: false,
      coinsList: [],
    };
  },
  methods: {
    addTicker(ticker) {
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

      setInterval(async () => {
        const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${currentTicker.name}&tsyms=USD&api_key=ce3fd966e7a1d10d65f907b20bf000552158fd3ed1bd614110baa0ac6cb57a7e`
        );
        const data = await f.json();
        // currentTicker.price =  data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);
        this.tickers.find((t) => t.name === currentTicker.name).price =
          data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);
        if (this.selectedTicker?.name === currentTicker.name) {
          this.graph.push(data.USD);
        }
      }, 5000);
    },

    select(ticker) {
      this.selectedTicker = ticker;
      console.log(this.selectedTicker);
      this.graph = [];
    },
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
    },
    async getCoinsList() {
      let response = await fetch(
        "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
      );

      if (response.ok) {
        const responseJSON = await response.json();
        const data = await responseJSON.Data;
        for (const key in data) {
          const coin = {
            symbol: data[key]?.Symbol,
            fullName: data[key]?.FullName,
          };
          this.coinsList.push(coin);
        }
      } else {
        console.error("HTTP error: " + response.status);
      }
    },
  },
  mounted() {
    this.getCoinsList();
  },
};
</script>

<template>
  <div class="container mx-auto flex flex-col items-center p-4">
    <LoaderSpinner v-if="!coinsList.length" />
    <div class="container">
      <AddTicker
        @add="addTicker"
        :coins-list="coinsList"
        :is-added="isAlreadyAdd"
      />
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in tickers"
            :key="t.name"
            @click="select(t)"
            :class="{
              'border-4': selectedTicker === t,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ t.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handleDelete(t)"
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
              > Удалить
            </button>
          </div>
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
