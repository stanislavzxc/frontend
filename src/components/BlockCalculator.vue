<script>
import axios from "axios";

export default {
  name: "BlockCalculator",
  components: {},
  data() {
    return {
      active: 1,
      invest: 5500,
      dohod: 0,
      rashod: 0.06 * 24 * 3.6,
      electricity: 0,
      hashrate: 234 * 10 ** 12,
      reward: 3.17,
      dif: 90666502495565,
      btc_price: 65000,
      hashrate_cost: 19,
      btc: 0,
      procent: 0,
      dayCalc: "1",
    };
  },
  props: {
    white: Boolean,
  },
  methods: {
    calc() {
      let days = 1;
      if (this.active == 1) {
        days = 1;
      }
      if (this.active == 2) {
        days = 30;
      }
      if (this.active == 3) {
        days = 365;
      }
      let hashrate = this.invest / this.hashrate_cost;
      this.dohod =
        Math.round(
          ((hashrate * 10 ** 12 * this.reward * this.btc_price * 86400 * days) /
            (this.dif * 2 ** 32)) *
            100
        ) / 100;
      this.electricity =
        Math.round(
          ((hashrate * this.hash_rate_electricity_consumption * 24) / 1000) *
            days *
            100
        ) / 100;
      console.log(hashrate);
      this.rashod =
        Math.round(this.electricity_cost * this.electricity * 100) / 100;
      this.profit = Math.round((this.dohod - this.rashod) * 100) / 100;
      this.procent = (this.profit / this.invest) * 100;
      this.btc = this.profit / this.btc_price;
      if (this.btc) {
        this.btc = String(this.btc).slice(0, 8);
      }
      if (this.procent) {
        this.procent = String(this.procent).slice(0, 5);
      }
    },

    twoCalc() {
      let days = 1;
      if (this.dayCalc == "1") {
        days = 1;
      }
      if (this.dayCalc == "31") {
        days = 31;
      }
      if (this.dayCalc == "365") {
        days = 365;
      }

      let hashrate =
        Math.round(
          ((this.dohod * this.dif * 2 ** 32) /
            (10 ** 12 * this.reward * this.btc_price * 86400 * days)) *
            100
        ) / 100;
      this.invest = Math.round(this.hashrate_cost * hashrate * 100) / 100;
      this.electricity =
        Math.round(
          ((hashrate * this.hash_rate_electricity_consumption * 24) / 1000) *
            days *
            100
        ) / 100;
      this.rashod =
        Math.round(this.electricity_cost * this.electricity * 100) / 100;
      this.profit = Math.round((this.dohod - this.rashod) * 100) / 100;
      this.procent = (this.profit / this.invest) * 100 || 0;
      this.btc = this.profit / this.btc_price;
      if (this.btc) {
        this.btc = String(this.btc).slice(0, 8);
      }
      if (this.procent) {
        this.procent = String(this.procent).slice(0, 5);
      }
    },

    async load_info() {
      try {
        let response = await axios.get(`/market/calculator`);
        this.invest_min = response.data.invest_min;
        this.invest_max = response.data.invest_max;
        this.dif = response.data.difficulty;
        this.reward = response.data.reward;
        this.btc_price = response.data.btc_price;
        this.hashrate_cost = response.data.hash_rate_cost;
        this.electricity_cost = response.data.electricity_cost;
        this.hash_rate_electricity_consumption =
          response.data.hash_rate_electricity_consumption;
      } catch (err) {
        console.log(err);
      }
    },

    updateActive(num) {
      this.active = num;
      this.calc();
    },

    goOrder() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$router.push({ name: "marketplace" });
      } else {
        this.$emit("updateGoTry", true);
      }
    },
  },
  async mounted() {
    await this.load_info();
    this.calc();
    for (let e of document.querySelectorAll(".slider-progress")) {
      e.style.setProperty("--value", e.value);
      e.style.setProperty("--min", e.min == "" ? "0" : e.min);
      e.style.setProperty("--max", e.max == "" ? "100" : e.max);
      e.addEventListener("input", () =>
        e.style.setProperty("--value", e.value)
      );
    }
  },
};
</script>
<template>
  <div class="wrapper" :class="{ insert: this.white }">
    <h2>{{ $t("profitCalc") }}</h2>
    <div class="wrapper-btns">
      <button
        @click="updateActive(1)"
        class="btn"
        :class="{ active: this.active == 1 }"
      >
        {{ $t("day") }}
      </button>
      <button
        @click="updateActive(2)"
        class="btn"
        :class="{ active: this.active == 2 }"
      >
        {{ $t("month") }}
      </button>
      <button
        @click="updateActive(3)"
        class="btn"
        :class="{ active: this.active == 3 }"
      >
        {{ $t("year") }}
      </button>
      <button
        @click="updateActive(4)"
        class="btn"
        :class="{ active: this.active == 4 }"
      >
        {{ $t("desired_income") }}
      </button>
    </div>
    <div class="main">
      <div class="left">
        <div class="inputs_range" v-if="active != 4">
          <div class="group-range">
            <label class="group-label" for="range"
              ><span class="invest">{{ $t("investment") }}</span>
              <span class="rangeUsd">{{ invest }} USD / 300000 USD</span></label
            >
            <input
              v-model="invest"
              @input="calc"
              :min="invest_min"
              :max="invest_max"
              type="range"
              class="range slider-progress"
              id="range"
              dir="ltr"
            />
          </div>
          <div class="group-range">
            <label class="group-label" for="range2"
              ><span class="invest">Bitcoin</span>
              <span class="rangeUsd">1 BTC = {{ btc_price }} USD</span></label
            >
            <input
              v-model="btc_price"
              @input="calc"
              min="30000"
              max="130000"
              type="range"
              class="range slider-progress"
              id="range2"
              dir="ltr"
            />
          </div>
        </div>
        <div class="inputs" v-if="active == 4">
          <input
            @input="twoCalc()"
            class="profit"
            v-model="dohod"
            :placeholder="$t('enterDesireIncome')"
          />
          <select
            v-model="dayCalc"
            @change="twoCalc"
            class="time"
            name=""
            id=""
          >
            <option value="1">{{ $t("day") }}</option>
            <option value="31">{{ $t("month") }}</option>
            <option value="365">{{ $t("year") }}</option>
          </select>
        </div>
        <div class="info">
          <div class="group" v-if="active == 4">
            <span class="group-name">{{ $t("investment") }}:</span>
            <span class="group-value">${{ invest }}</span>
          </div>
          <div class="group" v-if="active != 4">
            <span class="group-name">{{ $t("dohod") }}:</span>
            <span class="group-value">${{ dohod }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("hostingCost") }}:</span>
            <span class="group-value">${{ rashod }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("electricity") }}</span>
            <span class="group-value">{{ electricity }}/kW</span>
          </div>
          <div class="group" v-if="active == 4">
            <span class="group-name">Bitcoin:</span>
            <span class="group-value">{{ btc_price }} USD</span>
          </div>

          <p class="detailInfo">
            {{ $t("detailInfo1") }}
            <a
              href="https://whattomine.com/coins/193-bch-sha-256"
              target="_blank"
              >whattomine.com</a
            >
            {{ $t("detailInfo2") }}
          </p>
        </div>
      </div>
      <div class="right" :class="{ white: this.white }">
        <div class="title">{{ $t("expectedProfit") }}</div>
        <div class="earn">
          <span class="title-earn">{{ this.profit }} USD</span>
          <span class="btc">{{ btc }} BTC</span>
          <span class="procent">({{ procent }}%)</span>
          <span class="procent">{{ $t("returnInvest") }}</span>
        </div>
        <button class="btn order" @click="goOrder">{{ $t("order") }}</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  margin-top: 40px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.insert {
  padding: 0 !important;
  margin: 0 !important;
}

.wrapper-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  border-radius: 10px;
  background-color: #fff;
  padding: 17px 32px;
  box-shadow: none;
  transition: all 400ms ease;
}

.active {
  background-color: #cf0032;
  color: #fff;
}

.main {
  display: flex;
  gap: 20px;
}

.left {
  width: 57%;
  border-radius: 20px;
  padding: 40px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.right {
  background-color: #ecedf2;
  width: 43%;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  border-radius: 20px;
}

.white {
  background-color: #fff;
}

.inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profit {
  width: 70%;
  border: 1px solid #f0f0f5;
  border-radius: 10px;
  padding: 17.5px 17px;
}

.profit::placeholder {
  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  color: #9298b4;
}

.time {
  width: 30%;
  padding: 17px;
  border: 1px solid #f0f0f5;
  border-radius: 10px;
}

.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-value {
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  color: #cf0032;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  color: #0f0f0f;
}

.earn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.earn-time {
  width: fit-content;
  border-radius: 20px;
  font-weight: 600;
  border: 1.5px solid #cf0032;
  color: #cf0032;
  padding: 12px 24px;
}

.title-earn {
  color: #cf0032;
  font-weight: 800;
  font-size: 32px;
  line-height: 44.8px;
}

.btc {
  color: #141414;
  font-size: 18px;
  line-height: 25.2px;
  font-weight: 600;
}

.procent {
  color: #9298b4;
  font-weight: 500;
  font-size: 14px;
  line-height: 19.6px;
}

.title {
  font-weight: 600;
  font-size: 17px;
  line-height: 17px;
  color: #141414;
}

/*generated with Input range slider CSS style generator (version 20211225)
https://toughengineer.github.io/demo/slider-styler*/
input[type="range"].range {
  height: 2.2em;
  -webkit-appearance: none;
}

/*progress support*/
input[type="range"].range.slider-progress {
  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--value) - var(--min)) / var(--range));
  --sx: calc(0.5 * 16px + var(--ratio) * (100% - 16px));
}

input[type="range"].range:focus {
  outline: none;
}

/*webkit*/
input[type="range"].range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 1em;
  background: #cf0132;
  border: none;
  box-shadow: 0 0 2px black;
  margin-top: calc(max((7px - 1px - 1px) * 0.5, 0px) - 16px * 0.5);
}

input[type="range"].range::-webkit-slider-runnable-track {
  height: 7px;
  border: 1px solid #b2b2b2;
  border-radius: 0.5em;
  background: #efefef;
  box-shadow: none;
}

input[type="range"].range::-webkit-slider-thumb:hover {
  background: #cf0132;
}

input[type="range"].range:hover::-webkit-slider-runnable-track {
  background: #e5e5e5;
  border-color: #9a9a9a;
}

input[type="range"].range::-webkit-slider-thumb:active {
  background: #cf0032;
}

input[type="range"].range:active::-webkit-slider-runnable-track {
  background: #f5f5f5;
  border-color: #c1c1c1;
}

input[type="range"].range.slider-progress::-webkit-slider-runnable-track {
  background: linear-gradient(#cf0132, #cf0132) 0 / var(--sx) 100% no-repeat,
    #efefef;
}

input[type="range"].range.slider-progress:hover::-webkit-slider-runnable-track {
  background: linear-gradient(#cf0132, #cf0132) 0 / var(--sx) 100% no-repeat,
    #e5e5e5;
}

input[type="range"].range.slider-progress:active::-webkit-slider-runnable-track {
  background: linear-gradient(#cf0132, #cf0132) 0 / var(--sx) 100% no-repeat,
    #f5f5f5;
}

/*mozilla*/
input[type="range"].range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 1em;
  background: #cf0132;
  border: none;
  box-shadow: 0 0 2px black;
}

input[type="range"].range::-moz-range-track {
  height: max(calc(7px - 1px - 1px), 0px);
  border: 1px solid #b2b2b2;
  border-radius: 0.5em;
  background: #efefef;
  box-shadow: none;
}

input[type="range"].range::-moz-range-thumb:hover {
  background: #cf0132;
}

input[type="range"].range:hover::-moz-range-track {
  background: #e5e5e5;
  border-color: #9a9a9a;
}

input[type="range"].range::-moz-range-thumb:active {
  background: #cf0032;
}

input[type="range"].range:active::-moz-range-track {
  background: #f5f5f5;
  border-color: #c1c1c1;
}

input[type="range"].range.slider-progress::-moz-range-track {
  background: linear-gradient(#cf0132, #cf0132) 0 / var(--sx) 100% no-repeat,
    #efefef;
}

input[type="range"].range.slider-progress:hover::-moz-range-track {
  background: linear-gradient(#cf0132, #cf0132) 0 / var(--sx) 100% no-repeat,
    #e5e5e5;
}

input[type="range"].range.slider-progress:active::-moz-range-track {
  background: linear-gradient(#cf0132, #cf0132) 0 / var(--sx) 100% no-repeat,
    #f5f5f5;
}

/*ms*/
input[type="range"].range::-ms-fill-upper {
  background: transparent;
  border-color: transparent;
}

input[type="range"].range::-ms-fill-lower {
  background: transparent;
  border-color: transparent;
}

input[type="range"].range::-ms-thumb {
  width: 16px;
  height: 16px;
  border-radius: 1em;
  background: #cf0132;
  border: none;
  box-shadow: 0 0 2px black;
  margin-top: 0;
  box-sizing: border-box;
}

input[type="range"].range::-ms-track {
  height: 7px;
  border-radius: 0.5em;
  background: #efefef;
  border: 1px solid #b2b2b2;
  box-shadow: none;
  box-sizing: border-box;
}

input[type="range"].range::-ms-thumb:hover {
  background: #cf0132;
}

input[type="range"].range:hover::-ms-track {
  background: #e5e5e5;
  border-color: #9a9a9a;
}

input[type="range"].range::-ms-thumb:active {
  background: #cf0032;
}

input[type="range"].range:active::-ms-track {
  background: #f5f5f5;
  border-color: #c1c1c1;
}

input[type="range"].range.slider-progress::-ms-fill-lower {
  height: max(calc(7px - 1px - 1px), 0px);
  border-radius: 0.5em 0 0 0.5em;
  margin: -1px 0 -1px -1px;
  background: #cf0132;
  border: 1px solid #b2b2b2;
  border-right-width: 0;
}

input[type="range"].range.slider-progress:hover::-ms-fill-lower {
  background: #cf0132;
  border-color: #9a9a9a;
}

input[type="range"].range.slider-progress:active::-ms-fill-lower {
  background: #cf0132;
  border-color: #c1c1c1;
}

.inputs_range {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group-range {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.group-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invest {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
  color: #0f0f0f;
}

.rangeUsd {
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #0f0f0f;
  opacity: 40%;
}

span {
  word-break: break-all;
}

.detailInfo {
  font-size: 10px;
  line-height: 10px;
  color: #242628;
  opacity: 50%;
}

.left,
.right {
  transition: all 500ms ease;
}

.left:hover,
.right:hover {
  box-shadow: 0 0 10px 0 #00000037;
}

.order {
  background-color: transparent;
  color: #cf0032;
  border: 2px solid #cf0032;
  font-weight: 500;
  padding: 12px 17px;
}

.order:hover {
  transform: translateY(-3px);
}

@media (max-width: 880px) {
  .left,
  .right {
    width: 100%;
  }

  .main {
    flex-direction: column;
  }
}

@media (max-width: 570px) {
  .wrapper-btns {
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: stretch;
  }

  .wrapper-btns button {
    flex: 25%;
  }
}

@media (max-width: 520px) {
  .left {
    padding: 20px;
  }
}

@media (max-width: 460px) {
  .invest {
    font-size: 16px;
    line-height: 16px;
  }

  .rangeUsd {
    font-size: 14px;
    line-height: 14px;
  }
}

@media (max-width: 380px) {
  .wrapper-btns {
    flex-direction: column;
  }

  .rangeUsd {
    font-size: 12px;
    line-height: 12px;
  }
}

@media (direction: rtl) {
  .group-range {
    flex-direction: row-reverse;
  }

  .group-label {
    justify-content: space-between;
  }

  .rangeUsd {
    order: 1;
  }

  .invest {
    order: 2;
  }
}
</style>
