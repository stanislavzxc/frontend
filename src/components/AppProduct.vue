<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "AppProduct",
  components: { LoadingSpinner },
  data() {
    return {
      card: {},
      summary: 0,
      methodPay: "visa",
      isLoading: false,
    };
  },
  methods: {
    goTry() {
      this.$emit("updateGoTry", true);
    },

    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
        let response = await axios.get(`/miners/get?id=${this.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        this.card = response.data.miner_item;
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

    async addCart() {
      try {
        if (!localStorage.getItem("token")) {
          this.$emit("updateGoTry", true);
        } else {
          let response = await axios.get(
            `/market/cart/set?miner_item_id=${this.id}&count=1`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.status == "ok") {
            this.cart = true;
            setTimeout(() => {
              this.cart = false;
            }, 3000);
          }
        }
      } catch (err) {
        console.log(err);
        this.cart = "Ошибка";
      }
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_info();
    console.log(this.card)
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="wrap-title">
      <img
        @click="$router.go(-1)"
        class="back"
        src="../assets/back.png"
        alt=""
      />
    </div>
    <div class="wrap-cards">
    <div class="card one">
      <img class="asic" :src="card.image && card.image.url ? card.image.url : require('../assets/default.png')" alt="" />
      <div class="wrap-scale">
          <div
            class="scale"
            :style="'width: ' + (100 - card.payback_percent) + '%'"
          ></div>
        </div>
        <div class="time_profit">
          {{ $t("timeProfit") }}: {{ card.payback }} {{ $t("months") }}
        </div>
    </div>
    <div class="card two">
    <h1>{{ card.name }}</h1>
    <h5>{{ $t('finance') }}</h5>
    <div class="infos">
      <div class="info">
        <div class="group">
          <span class="group-name">{{ $t("dohod") }}:</span>
          <span class="group-value"
            >${{ card.income }} / {{ $t("dayOne") }}</span
          >
        </div>
        <div class="group">
          <span class="group-name">{{ $t("hosting") }}:</span>
          <span class="group-value"
            >${{ card.hosting }} / {{ $t("dayOne") }}</span
          >
        </div>
        
        
        <div class="group">
          <span class="group-name">{{ $t("income") }}:</span>
          <span class="group-value"
            >${{ card.profit }} / {{ $t("dayOne") }}</span
          >
        </div>

      </div>
      <div class="info second">
        <div class="group">
          <span class="group-name">{{ $t("dohod") }}:</span>
          <span class="group-value"
            >${{ card.income }} / {{ $t("monthOne") }}</span
          >
        </div>
        <div class="group">
          <span class="group-name">{{ $t("hosting") }}:</span>
          <span class="group-value"
            >${{ card.hosting }} / {{ $t("monthOne") }}</span
          >
        </div>
        
        
        <div class="group">
          <span class="group-name">{{ $t("income") }}:</span>
          <span class="group-value"
            >${{ card.profit }} / {{ $t("monthOne") }}</span
          >
        </div>

      </div>
    </div>
    <h5>{{ $t('spec') }}</h5>
    <div class="info">
      <div class="group">
          <span class="group-name">{{ $t("energy_consumption") }}:</span>
          <span class="group-value"
            >{{ card.energy_consumption }} {{ $t("wt") }}
          </span>
        </div>
      <div class="group">
          <span class="group-name">{{ $t("efficiency") }}:</span>
          <span class="group-value"
            >{{ (card.hash_rate / card.energy_consumption).toFixed(2) }} J/T</span
          >
        </div>
        <div class="group">
          <span class="group-name">{{ $t("hash") }}:</span>
          <span class="group-value"
            >{{ card.hash_rate }} TH</span
          >
        </div>
        
        
    </div>
    <div class="cost">
    <h3>${{card.price || 'undefined'}}</h3>
    <button @click="addCart()" class="buy">{{ $t("addCart") }}</button>
    </div>
    </div>
  </div>

    
  </div>
</template>

<style scoped>
.cost{
  display: flex;
  margin: 10px 0px 10px 0px;
  gap: 10px;
}
.second{
  margin-top: 10px;
}

.two{
  align-items: baseline !important;
  padding: 15px;
}
.infos{
  display: flex;
  gap:10px;
  align-items: stretch; 
}
@media (max-width: 900px) {
  .wrap-cards{
    display: block !important;
    margin:auto;
  }
  .wrap-cards .one {
    width: 100% !important;
    height: 100% !important;
  }
}
.one{
  width:33% !important;
  height:50vh !important;
  display: flex;
  flex-direction: column !important;
  justify-content: center;
}
/* .two{
  height:80vh !important;
} */
.wrap-cards{
  display: flex;
  gap:15px
}
.wrapper {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-bottom: 100px;
}
.cards {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 20px;
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
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: auto;
}

.asic {
  width: 250px;
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
  gap: 5px;
  white-space: nowrap;
}

.group-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #0f0f0f;
  opacity: 40%;
  white-space: nowrap;

}

.group-value {
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #272727;
  white-space: nowrap;

}

.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.wrap-scale {
  position: relative;
  width: 90%;
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

.minus,
.plus,
.count {
  width: 36px;
  height: 36px;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: #cf0101;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}

.minus,
.plus {
  cursor: pointer;
  -webkit-user-select: none; /* Для поддержки старых версий Safari */
  -moz-user-select: none; /* Для Firefox */
  -ms-user-select: none; /* Для Internet Explorer */
  user-select: none; /* Стандартное свойство */
}

.count {
  color: #0f0f0f;
}

.counter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.buy {
  width: fit-content;
  min-width: 200px;
  padding: 17px 24px;
  border-radius: 10px;
  background-color: #cf0101;
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  transition: all 500ms ease;
}

.payments {
  display: flex;
  gap: 10px;
  align-items: center;
}

.payment-card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.pay-name {
  color: #272727;
  opacity: 40%;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
}

.pay-img {
  border-radius: 15px;
  border: 1px solid #fff;
}

.active {
  border: 1px solid #cf0101;
}

.activeName {
  color: #cf0101;
  opacity: 100%;
}

.buy:hover {
  transform: translateY(-3px);
}

.wrap-title {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.back {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

@media (max-width: 765px) {
  .card {
    flex-direction: column;
  }
}

@media (max-width: 420px) {
  .wrapper {
    padding: 20px;
  }
}
</style>
