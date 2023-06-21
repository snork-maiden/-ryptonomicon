<script>
import AddTicker from "./components/AddTicker.vue";
import LoaderSpinner from "./components/LoaderSpinner.vue";
import TickerGraph from "./components/TickerGraph.vue";
import TickerCard from "./components/TickerCard.vue";
import FilterTickers from "./components/FilterTickers.vue";
import {
  subscribeToTickerUSD,
  subscribeToTickerBTC,
  unsubscribeFromTicker,
} from "./api.js";

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

  // [x] 5. Обработка ошибок API | Критичность: 5
  // [] 3. Количество запросов | Критичность: 4

  // [ ] 9. localStorage и анонимные вкладки | Критичность: 3
  // [x ] Валидация тикера|  Критичность: 3
  // [x] 7. График ужасно выглядит если будет много цен | Критичность: 2
  // [ ] 10. Магические строки и числа (URL, 5000 миллисекунд задержки, ключ локал стораджа, количество на странице) |  Критичность: 1
  // [ ] Сообщение "извините, ничего не найдено" при пустом фильтре|  Критичность: 1

  // [] *Сделать чтобы работало на несколльких вкладках сразу (SharedWorker)|  Критичность: 1

  created() {
    const tickersData = localStorage.getItem("cryptonomicon-list");
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTickerUSD(ticker.name, (newPrice) => {
          if (!newPrice) {
            subscribeToTickerBTC(ticker.name, (newPrice) =>
              this.updateTicker(ticker.name, newPrice)
            );
            return;
          }
          this.updateTicker(ticker.name, newPrice);
        });
      });
    }
    this.filteredTickers = this.tickers;
  },
  methods: {
    updateTicker(tickerName, price) {
      // console.log(tickerName, price);
      // if (!price) {
      //   subscribeToTickerBTC(tickerName, (newPrice) =>
      //     this.updateTicker(tickerName, newPrice)
      //   );
      // }
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graph.push(price);
            const maxGraphElements = 80;
            if (this.graph.length > maxGraphElements) {
              this.graph = this.graph.slice(maxGraphElements);
            }
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
        price: null,
      };
      this.tickers = [currentTicker, ...this.tickers];
      subscribeToTickerUSD(currentTicker.name, (newPrice) =>
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
      unsubscribeFromTicker(ticker.name);
    },

    filterTickers(tickers) {
      this.filteredTickers = tickers;
    },
  },
  watch: {
    selectedTicker() {
      this.graph = [];
      // this.$nextTick().then(this.calculateMaxGraphElements);
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
          <dl
            v-if="filteredTickers.length"
            class="my-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
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
          
          <hr class="w-full border-t border-gray-500 my-4" />
          <p v-if="!filteredTickers.length" class="text-lg text-center mt-2">No results</p>
      </template>

      <TickerGraph
        v-if="selectedTicker && selectedTicker.price"
        class="relative"
        :selected-ticker="selectedTicker"
        :graph="graph"
        @clearTicker="selectedTicker = null"
      />
    </div>
  </div>
</template>
