<script>
import  getCoinsList from "../api/getCoinsList";
import AddButton from "./AddButton.vue";

export default {
  // name: "AddButton",
  components: {
    AddButton,
  },
  emits: {
    add: String,
    downloaded: null,
  },
  props: {
    isAdded: Boolean,
  },
  data() {
    return {
      ticker: "",

      // clues: [],
      coinsList: [],

      isEditing: false,
      isDisabled: true,
    };
  },
  computed: {
    clues() {
      let clues = [];

      if (!this.ticker) return [];

      this.coinsList.forEach((item) => {
        if (item?.symbol.startsWith(this.ticker)) {
          clues.push(item?.symbol);
          return;
        }
        if (item?.fullName.startsWith(this.ticker)) {
          clues.push(item?.symbol);
          return;
        }
      });

      clues.sort();
      if (clues.length > 4) {
        clues.length = 4;
      }
      return clues;
    },
  },
  methods: {
    addTicker() {
      this.$emit("add", this.ticker);
      if (!this.isAdded) {
        this.ticker = "";
      }
      this.isEditing = false;
      return;
    },

    choseClue(ticker) {
      this.ticker = ticker;
      this.addTicker();
    },
  },
  mounted() {
    getCoinsList().then((data) => {
      this.coinsList = data;
      this.$emit("downloaded");
    });
  },
  watch: {
    ticker() {
      if (!this.ticker) {
        this.isDisabled = true;
        return;
      }
      this.isDisabled = false;
      this.ticker = this.ticker.toUpperCase();
    },
  },
};
</script>
<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-m font-medium text-gray-700 mb-3"
          >Ticker</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model.trim="ticker"
            @keydown.enter="addTicker"
            @focusin="isEditing = true"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full p-2 pr-10 border-gray-300 text-gray-900 focus:outline-yellow-500 sm:text-sm rounded-md"
            placeholder="For example, DOGE"
            autocomplete="off"
          />
        </div>
        <template v-if="clues.length">
          <div class="flex bg-white shadow-md p-1 rounded-md flex-wrap">
            <span
              v-for="clue of clues"
              v-bind:key="clue"
              class="inline-flex items-center px-3 py-1 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              @click="choseClue(clue)"
            >
              {{ clue }}
            </span>
          </div>
        </template>
        <div class="text-sm text-red-600" v-if="isAdded && !isEditing">
          This ticker is already added
        </div>
      </div>
    </div>
    <AddButton @click="addTicker" :disabled="isDisabled" class="my-4" />
  </section>
</template>
