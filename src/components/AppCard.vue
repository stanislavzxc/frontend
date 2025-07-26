<script>
import axios from "axios";

export default {
  name: "AppCard",
  components: { },
  props: {
    id: String,
    image: String,
    name: String,
    price: String,
    hosting: String,
    income: String,
    energy_consumption: String,
    profit: String,
    payback_percent: Number,
    payback: String,
    count: Number,
    cart: Boolean
  },
  methods: {
    goTry() {
      this.$emit("updateGoTry", true);
    },

    async minus(id, count) {
      count -= 1;
      let response = await axios.get(
        `/market/cart/set?miner_item_id=${id}&count=${count}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      this.cards = response.data.data;
      this.summary = response.data.summary;
    },
    async plus(id, count) {
      count += 1;
      let response = await axios.get(
        `/market/cart/set?miner_item_id=${id}&count=${count}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      this.cards = response.data.data;
      this.summary = response.data.summary;
    },

    roundTwo(n) {
      if (n) {
        return Math.round(n * 100) / 100;
      }
    },
  },
};
</script>
<template>
      <div class="card bx">
        <img class="asic" v-if="image" :src="image"  alt="" />
        <div class="wrap-scale">
            <div
              class="scale"
              :style="'width: ' + (100 - payback_percent) + '%'"
            ></div>
          </div>
          <div class="time_profit">
            {{ $t("timeProfit") }}: {{ payback }} {{ $t("months") }}
          </div>
          <span class="name">{{ name }}</span>
          <div class="info">

              <div class="group">
                <span class="group-name">{{ $t("hosting") }}:</span>
                <span class="group-value"
                  >${{ hosting }} / {{ $t("dayOne") }}</span
                >
              </div>
              <div class="group">
                <span class="group-name">{{ $t("dohod") }}:</span>
                <span class="group-value"
                  >${{ income }} / {{ $t("dayOne") }}</span
                >
              </div>
              <div class="group">
                <span class="group-name">{{ $t("rashod") }}:</span>
                <span class="group-value"
                  >{{ energy_consumption }} {{ $t("wt") }} /
                  {{ $t("dayOne") }}</span
                >
              </div>
              <!-- <div class="group">
                <span class="group-name">{{ $t("income") }}:</span>
                <span class="group-value"
                  >${{ profit }} / {{ $t("dayOne") }}</span
                >
              </div> -->
          </div>
          <div class="actions">
            <span class="price">${{ price }}</span>
            <button class="btn">{{ $t('order') }}</button>
          </div>
          <div class="counter" v-if="cart">
            <div class="minus" @click="minus(id, count)">-</div>
            <div class="count">{{ count }}</div>
            <div class="plus" @click="plus(id, count)">+</div>
          </div>
      </div>
</template>
<style scoped>
.card {
  width: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: pointer;
  min-width: 320px;
  border: 1px solid #F0F0F5;
}

.asic {
  width: 250px;
}

.card:hover {
  transform: none;
}

.main-card {
  padding: 40px 20px 20px 20px;
  position: relative;
  background: transparent;
  z-index: 2;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("../assets/card.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
  border-radius: 20px;
}

.time_profit {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #a9a9a9;
}
.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #272727;
}

.price {
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  color: #0f0f0f;
}

.btn {
    min-width: 170px;
  border-radius: 10px;
  padding: 11px 24px;
  color: #fff;
  background-color: #cf0032;
  font-weight: 600;
  font-size: 15px;
  line-height: 100%;
}

.info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #0f0f0f;
  opacity: 40%;
}

.group-value {
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #272727;
}

.wrap-scale {
  position: relative;
  width: 70%;
  border-radius: 10px;
  height: 6px;
  background: linear-gradient(to right, #e11111 0%, #ecf02b 50%, #2ee111 100%);
  overflow: hidden;
}

.scale {
  position: absolute;
  right: 0;
  height: 6px;
  background-color: #a9a9a9;
}

.result {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
  color: #272727;
}

.name {
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #272727;
}

.actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
