<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "MyMiners",
  components: { LoadingSpinner },
  data() {
    return {
      cards: [],
      isLoading: false,
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.get(`/miners/workers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        this.cards = response.data.workers;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    roundTwo(n) {
      if (n) {
        return Math.round(n * 100) / 100;
      }
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h2>{{ $t("myMiners") }}</h2>
    <div class="cards" v-if="this.cards.length > 0">
      <div class="card" v-for="card in cards" :key="card.miner_item.id">
        <img
          class="asic"
          v-if="card.miner_item.image"
          :src="card.miner_item.image.url"
          :alt="card.miner_item.image.filename"
        />
        <div class="info">
          <div class="title">
            <div class="group-title">
              <span class="name">{{ card.name }}</span>
              <span class="miner-item">{{ card.miner_item.name }}</span>
              <div class="wrap-scale">
                <div
                  class="scale"
                  :style="
                    'width: ' + (100 - card.miner_item.payback_percent) + '%'
                  "
                ></div>
              </div>
            </div>
            <div class="status" v-if="card.status == 'stable'">
              <div class="online"></div>
              Online
            </div>
            <div class="status" v-if="card.status != 'stable'">
              <div class="offline"></div>
              Offline
            </div>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("hosting") }}:</span>
            <span class="group-value"
              >${{ roundTwo(card.miner_item.hosting * 31) }} /
              {{ $t("monthOne") }}</span
            >
            <span class="group-name">{{ $t("dohod") }}:</span>
            <span class="group-value"
              >${{ roundTwo(card.miner_item.income * 31) }} /
              {{ $t("monthOne") }}</span
            >
            <span class="group-name">{{ $t("rashod") }}:</span>
            <span class="group-value"
              >{{ roundTwo(card.miner_item.energy_consumption) }}
              {{ $t("wt") }} / {{ $t("hour") }}</span
            >
            <span class="group-name">{{ $t("income") }}:</span>
            <span class="group-value"
              >${{ roundTwo(card.miner_item.profit * 31) }} /
              {{ $t("monthOne") }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="not_found" v-else>
      <img src="../assets/myminers.svg" alt="" />
      <span>{{ $t("not_foundMiners") }}</span>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.itog {
  padding: 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background-color: #fff;
}

.card {
  width: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: auto;
}

.asic {
  width: 90px;
}

.card:hover {
  transform: none;
  box-shadow: none;
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
  width: 100%;
  border-radius: 10px;
  padding: 12px 17px;
  color: #fff;
  background-color: #cf0032;
}

.group {
  display: flex;
  align-items: center;
  gap: 10px;
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

.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  color: black;
}

.group-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.miner-item {
  color: rgb(166, 166, 166);
  font-size: 13px;
  font-weight: 600;
  line-height: 15px;
  letter-spacing: 0.02px;
}

.not_found {
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 40%;
}

.not_found img {
  height: 42px;
  width: 42px;
}

.not_found span {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #272727;
}

.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 14px;
  font-weight: 600;
  color: #272727;
}

.online,
.offline {
  width: 8px;
  height: 8px;
  border-radius: 13px;
}

.online {
  background-color: #45ed0b;
}

.offline {
  background-color: #ff104a;
}

@media (max-width: 1100px) {
  .group {
    flex-wrap: wrap;
  }
}

@media (max-width: 800px) {
  .group {
    flex-direction: column;
    align-items: start;
  }
}

@media (max-width: 520px) {
  .name {
    font-size: 18px;
  }

  .info {
    gap: 10px;
  }

  .card {
    padding: 10px;
    gap: 10px;
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .wrapper {
    padding: 20px;
  }
}
</style>
