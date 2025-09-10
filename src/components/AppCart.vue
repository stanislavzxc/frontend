<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
import ModalBankPay from "./ModalBankPay.vue";
import ModalPerevod from "./ModalPerevod.vue";
import ModalOx from "./ModalOx.vue";
export default {
  name: "AppCart",
  components: { LoadingSpinner, ModalBankPay, ModalPerevod, ModalOx },
  data() {
    return {
      cards: [],
      summary: parseFloat(this.$route.query.cost) || 0,
      showModalBankPay: false,
      showModalPerevod: false,
      showModalOx: false,
      payments: [
        {
          id: 1,
          name: "MasterCard/Visa",
          img: "visa.svg",
          value: "visa",
          profit: "1.50",
        },
        {
          id: 2,
          name: this.$t("bank_transfer"),
          img: "bank.svg",
          value: "rus_card",
        },
        {
          id: 3,
          name: "0xprocessing",
          img: "ox.svg",
          value: "0xprocessing",
          profit: "1.00",
        },
        {
          id: 4,
          name: "BTC Pay",
          img: "btc_pay.svg",
          value: "btc_pay",
          profit: "1.00",
        },
      ],
      methodPay: "btc_pay",
      isLoading: false,
      status: "",
      message: "",
      profit: "1.00",
      testmode: '0',
      hashrate: '0',
      hosting: '0',
      profitestmode: '0',
       
    };
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

    async load_info() {
      try {
        this.isLoading = true;
        let token = localStorage.getItem("token");
        if (token) {
          let response = await axios.get(`/market/cart/get/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.cards = response.data.data;
          for (let i = 0; i < this.cards.length; i++) {
        // Исправление здесь
        if (this.cards[i].image && this.cards[i].image.url) {
          this.cards[i].image.url = this.cards[i].image.url.replace("https://209.46.123.31:9000", "https://totalminers.io");
        }
      }
          this.summary = response.data.summary;
          localStorage.setItem('total', this.summary);
          console.log(response.data);
          console.log(this.cards);
        }
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

    async goBuy() {
      try {
        let response = await axios.get(
          `/market/cart/buy?payment_type=${this.methodPay}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.status = response.status;
        console.log(response);
        if (this.status == 200) {
          this.message = this.$t("success");
          let id = response.data.billing_id;
          setTimeout(() => {
            this.message = "";
            this.cards = [];
            this.summary = 0;
            if (id) {
              this.$router.push({ name: "payment", query: { id: id } });
            }
          }, 2000);
        } else {
          this.message = "Ошибка";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async goBuyTestMode() {
      console.log('make!!!')
      try {
        let response = await axios.post(
          `/market/cart/buy`,
          {
            payment_type: this.methodPay
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.status = response.status;
        console.log(response);
        if (this.status == 200) {
          await this.fetchminer();
          await this.fetchValue();
          this.message = this.$t("success");
          let id = response.data.billing_id;
          setTimeout(() => {
            this.message = "";
            this.cards = [];
            this.summary = 0;
            if (id) {
              this.$router.push({ name: "payment", query: { id: id } });
            }
          }, 2000);
        } else {
          this.message = "Ошибка";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async fetchValue() {
      
      const url = `users/testmode`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" 
      };

      const data = {
        state: 'wait',
        testmodetype: 'testmode',
        cost: this.summary.toString() || '25.8',
        hashrate: this.hashrate.toString() || '0',
        hosting: this.hosting.toString() || '0',
        profit: this.profitestmode.toString() || '0',
        worker: 'Antminer T21',
        miner: 'Antminer T21',
      }
      localStorage.setItem('testmodedata', data);
      try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data, '3124567890-87654321456789p');
         
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async getbankdata() {
      
      const url = `users/testmode`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" 
      };
      try {
        const response = await axios.get(url, { headers });
        console.log(response.data, 'dattaaaaaaaaaaaaaaaaaaaaa');
        localStorage.setItem('merchant', response.data.merchant);
         
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchminer() {
  const url = `/miners/get/all`;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  try {
    const response = await axios.get(url, { headers });
    console.log(response.data, '213456789');
    
    // Поиск майнера с именем "Antminer T21"
    const miner = response.data.miners_items.find((m) => m.name === "Antminer T21");

    if (miner) {
      this.profitestmode = miner.profit;
      this.dohod = miner.income;
      this.hosting = miner.hosting;
      this.cost = Math.round((parseFloat(this.profit) * 3) * 1000) / 1000;

    } else {
      console.log('Майнер с именем "Antminer T21" не найден');
    }
  } catch (error) {
    console.error("Error fetching miners:", error);
  }
},
    router(){
      console.log('make!')
        if(this.testmode === true){
          this.goBuyTestMode(); 
        } else{
          this.goBuy();
        }
      },
    modal() {
      if(this.summary == 25.8){
        this.testmode = true;
      }
      if(this.summary == 0){
        alert("корзина пуста!")
        return
      }
  if (this.methodPay === 'visa') {
    this.showModalBankPay = true;
  } else if (this.methodPay === 'rus_card') {
    this.showModalPerevod = true;
  }else if (this.methodPay === '0xprocessing'){
    this.showModalOx = true;
  }else if(this.methodPay === 'btc_pay'){
    this.createInvoice();
  }
},
    zxc(val){
      this.methodPay = val;
      
    },
    async createInvoice() {
  const url = 'billings/create-btcpay-invoice';
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  };

  // Формируем тело запроса с суммой платежа
  const data = {
    amount: this.summary || 1,  // замените this.summary на нужное значение
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Invoice created:', response.data);

    // Можно сохранить данные инвойса в localStorage, если нужно
    localStorage.setItem('invoiceData', JSON.stringify(response.data));

    // Наприм     ер, открыть ссылку на оплату
    this.router();
    window.open(response.data.invoiceUrl, '_blank');
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
},

  },
  mounted() {
    document.body.style.overflow = "auto";
    if(this.summary != 0) return
    this.getbankdata();
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  
  <div class="wrapper" v-else>
    <ModalBankPay v-model:isModalVisible="showModalBankPay" :price="summary" :istestmode="testmode" @buy="router()"/>
    <ModalPerevod v-model:isModalVisible="showModalPerevod" :price="summary" :istestmode="testmode" @buy="router()"/>
    <ModalOx v-model:isModalVisible="showModalOx" :price="summary" :istestmode="testmode" @buy="router()"/>
    <h2>{{ $t("cart") }}</h2>
    <div class="cards">
      <div class="card bx" v-for="card in cards" :key="card.id">
        <img
          class="asic"
          :src="
            card.image && card.image.url
              ? card.image.url
              : require('../assets/default.png')
          "
          alt=""
        />
        <div class="info">
          <span class="name">{{ card.name }}</span>
          <div class="group">
            <span class="group-name">{{ $t("hosting") }}:</span>
            <span class="group-value">${{ card.hosting }} / {{ $t("dayOne") }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("dohod") }}:</span>
            <span class="group-value">${{ card.income }} / {{ $t("dayOne") }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("rashod") }}:</span>
            <span class="group-value"
              >{{ card.energy_consumption }} {{ $t("wt") }} / {{ $t("dayOne") }}</span
            >
          </div>
          <div class="group">
            <span class="group-name">{{ $t("income") }}:</span>
            <span class="group-value">${{ card.profit }} / {{ $t("dayOne") }}</span>
          </div>
          <div class="wrap-scale">
            <div
              class="scale"
              :style="'width: ' + (100 - card.payback_percent) + '%'"
            ></div>
          </div>
          <div class="time_profit">
            {{ $t("timeProfit") }}: {{ card.payback }} {{ $t("months") }}
          </div>
          <div class="counter">
            <div class="minus" @click="minus(card.id, card.count)">-</div>
            <div class="count">{{ card.count }}</div>
            <div class="plus" @click="plus(card.id, card.count)">+</div>
          </div>
        </div>
      </div>
    </div>
    <div class="itog bx">
      <span class="result">{{ $t("total") }}:</span>
      <span class="price">$ {{ summary }}</span>
    </div>
    <h2>{{ $t("choosePayment") }}</h2>
    <div class="payments">
      <div
        class="payment-card"
        v-for="pay in payments"
        :key="pay.id"
        @click="zxc(pay.value)"
        :class="{
          active: methodPay == pay.value,
          'padding-30':
            pay.img === 'bank.svg' || pay.img === 'ox.svg' || pay.img === 'btc_pay.svg',
        }"
      >
        <div class="pay-img">
          <img :src="require(`../assets/${pay.img}`)" alt="" />
        </div>
        <span class="pay-name" :class="{ activeName: methodPay == pay.value }">{{
          pay.name
        }}</span>
        <span class="pay-name" v-if="pay.profit">(+{{ pay.profit }}%)</span>
      </div>
    </div>
    <button v-if="!message" @click="modal()" class="buy bx">
      {{ $t("placeOrder") }}
    </button>
    <div
      class="msg"
      :class="{
        success: this.message == 'Успешно',
        error: this.message != 'Успешно',
      }"
      v-if="message"
    >
      {{ message }}
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
  flex-direction: row;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
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
.padding-30 {
  padding: 25px; /* Установите необходимый отступ */
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
  min-width: 250px;
  padding: 17px 24px;
  border-radius: 10px;
  background-color: #cf0032;
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
}

.payments {
  display: flex;
  flex-direction: column; /* Устанавливаем направление flex на колонку */
  gap: 10px;
  align-items: stretch; /* Устанавливаем растяжение карточек на всю ширину */
}

.payment-card {
  display: flex;
  align-items: center;
  justify-content: stretch;
  flex-direction: initial;
  gap: 8px;
  cursor: pointer;
  width: 100%; /* Устанавливаем ширину карточки на 100% */
  border: 1px solid #e0e0e0; /* Добавляем границу для визуального отделения */
  border-radius: 10px; /* Скругляем углы карточек */
  background-color: #fff; /* Устанавливаем фон для карточек */
}

.payment-card:hover {
  border-color: #cf0101; /* Изменяем цвет границы при наведении */
}

.pay-name {
  color: black;
  opacity: 40%;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
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
