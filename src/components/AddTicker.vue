<script>
import AddButton from "./AddButton.vue";

export default {
  // name: "AddButton",
  components: {
    AddButton,
  },
  emits: {
    add: String,
    downloaded: null
  },
  props: {
    isAdded: Boolean,
  },
  data() {
    return {
      ticker: "",
      clues: [],
      isEditing: false,
      coinsList: []
    };
  },
  methods: {
    addTicker() {
      this.$emit("add", this.ticker);
      this.ticker = "";
      this.isEditing = false;
    },

    changeText() {
      this.isEditing = true;
      this.clues = [];
      this.ticker = this.ticker.toUpperCase();
      if (this.ticker.length < 2) return;
      const ticker = this.ticker;
      this.coinsList.forEach((item) => {
        if (item?.symbol.startsWith(ticker)) {
          this.clues.push(item?.symbol);
          return;
        }
        if (item?.fullName.startsWith(ticker)) {
          this.clues.push(item?.symbol);
          return;
        }
      });
      this.clues.sort();
      if (this.clues.length > 4) {
        this.clues.length = 4;
      }
      return;
    },

    choseClue(ticker) {
      this.clues = [];
      this.ticker = ticker;
      this.addTicker();
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
      this.$emit('downloaded')
    },
  },
  mounted() {
    this.getCoinsList();
  },
};
</script>
<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-m font-medium text-gray-700 mb-3"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model.trim="ticker"
            @input="changeText"
            @keydown.enter="addTicker"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full p-2 pr-10 border-gray-300 text-gray-900 focus:outline-yellow-500 sm:text-sm rounded-md"
            placeholder="Например, DOGE"
            autocomplete="off"
          />
        </div>
        <template v-if="clues.length">
          <div class="flex bg-white shadow-md p-1 rounded-md flex-wrap">
            <span
              v-for="clue of clues"
              v-bind:key="clue"
              class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              @click="choseClue(clue)"
            >
              {{ clue }}
            </span>
          </div>
        </template>
        <div class="text-sm text-red-600" v-if="isAdded && !isEditing">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <AddButton @click="addTicker" class="my-4" />
  </section>
</template>
