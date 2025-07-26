<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import axios from "axios";

export default {
  name: "AppPayment",
  components: { LoadingSpinner },
  data() {
    return {
      card: {},
      payment_data: "",
      isLoading: false,
      message: "",
    };
  },
  methods: {
    async cancelPayment() {
      try {
        let response = await axios.get(
          `/billings/update/cancel?id=${this.card.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        let status = response.status;
        if (status == 200) {
          this.message = this.$t("success");
          setTimeout(() => {
            this.message = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async saveData() {
      try {
        let response = await axios.get(
          `/billings/update/complete?id=${this.card.id}&data=${this.payment_data}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        let status = response.status;
        if (status == 200) {
          this.message = this.$t("success");
          setTimeout(() => {
            this.message = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.get(
          `/billings/get?id=${this.$route.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        this.card = response.data.data;
        this.payment_data = this.card.payment_data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    printType(type) {
      let lang = localStorage.getItem("lang");
      if (lang == "EN") {
        if (type == "hosting") {
          return "Hosting fees";
        } else if (type == "buy_request") {
          return "Purchase";
        }
        return "";
      } else if (lang == "HE") {
        if (type == "hosting") {
          return "דמי אירוח";
        } else if (type == "buy_request") {
          return "רכישה";
        }
        return "";
      } else {
        if (type == "hosting") {
          return "Плата за хостинг";
        } else if (type == "buy_request") {
          return "Покупка";
        }
        return "";
      }
    },

    printStatus(state) {
      if (this.$i18n.locale == "RU") {
        if (state == "waiting") {
          return "В ожидании";
        } else if (state == "invoiced") {
          return "Запрос";
        } else if (state == "confirmation") {
          return "На подтверждении";
        } else if (state == "completed") {
          return "Оплачен";
        } else if (state == "canceled") {
          return "Отменен";
        }
      } else if (this.$i18n.locale == "EN") {
        if (state == "waiting") {
          return "Waiting";
        } else if (state == "invoiced") {
          return "Invoiced";
        } else if (state == "confirmation") {
          return "Confirmation";
        } else if (state == "completed") {
          return "Completed";
        } else if (state == "canceled") {
          return "Canceled";
        }
      } else if (this.$i18n.locale == "HE") {
        if (state == "waiting") {
          return "מחכה";
        } else if (state == "invoiced") {
          return "בקשה";
        } else if (state == "confirmation") {
          return "על אישור";
        } else if (state == "completed") {
          return "שולם";
        } else if (state == "canceled") {
          return "בוטל";
        }
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
    <h2>{{ printType(type) }}</h2>
    <div class="group-payment">
      <span class="date">{{ $t("date") }}:</span>
      <span class="date">{{ card.date }}</span>
      <span class="time">{{ card.time }}</span>
    </div>
    <div class="group-payment">
      <span class="type">{{ $t("type") }}:</span>
      <span class="type">{{ printType(card.type) }}</span>
    </div>
    <div class="group-payment">
      <span class="sum_payment">{{ $t("amountPayment") }}:</span>
      <div class="payment-btc">{{ card.value }} {{ card.currency }}</div>
      <div class="payment-hashrate">{{ card.hash_rate }}</div>
    </div>
    <div class="group-payment">
      <span class="sum_payment">{{ $t("adressPayment") }}:</span>
      <div class="adress-value">{{ card.payment_detail }}</div>
    </div>
    <div class="group-payment">
      <span class="sum_payment">{{ $t("numberPayment") }}:</span>
      <input
        type="text"
        v-model="payment_data"
        :placeholder="$t('enterNumberPayment')"
        :disabled="card.state == 'completed' || card.state == 'canceled'"
      />
    </div>
    <div class="group-payment">
      <span class="status">{{ $t("status") }}:</span>
      <div class="group-status">
        <div
          class="wait"
          :class="{
            online: card.state == 'completed',
            offline: card.state == 'canceled',
          }"
        ></div>
        <span class="status">{{ printStatus(card.state) }}</span>
      </div>
    </div>
    <div class="wrap-img" v-if="card.image">
      <a :href="card.image.url" target="_blank"
        ><img
          class="billing-img"
          :src="card.image.url"
          :alt="card.image.filename"
      /></a>
    </div>
    <div class="wrap-btns">
      <button class="btn bx" @click="this.$router.go(-1)">
        {{ $t("back") }}
      </button>
      <button
        class="btn cancel bx"
        v-if="
          card.type != 'hosting' &&
          card.state != 'completed' &&
          card.state != 'canceled'
        "
        @click="cancelPayment"
      >
        {{ $t("cancel") }}
      </button>
      <button
        class="btn save bx"
        @click="saveData"
        v-if="card.state != 'completed' && card.state != 'canceled'"
      >
        {{ $t("save") }}
      </button>
    </div>
    <div
      class="msg"
      :class="{
        success: this.message == 'Успешно',
        error: this.message == 'Неверный код',
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
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  width: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 30px;
  cursor: auto;
}

.card:hover {
  transform: none;
  box-shadow: none;
}
.wrap-btns {
  display: flex;
  align-items: center;
  gap: 30px;
}
.btn {
  border-radius: 10px;
  padding: 12px 17px;
  font-weight: 500;
  font-size: 16px;
  color: #272727;
  background-color: #fff;
}

.save {
  background-color: #45ed0b;
  color: #fff;
}

.cancel {
  background-color: #cf0032;
  color: #fff;
}

.not_found {
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 40%;
}

.not_found span {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #272727;
}

.mypayments {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mypayment-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
}

.payment {
  background-color: #fff;
  border-radius: 20px;
  padding: 24px 30px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-payment {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.adress-value {
  word-wrap: break-word;
}

.time,
.payment-hashrate {
  opacity: 40%;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #272727;
}

.group-status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.wait {
  width: 8px;
  height: 8px;
  border-radius: 13px;
  background-color: yellow;
}

.online {
  background-color: #45ed0b;
}

.offline {
  background-color: #cf0032;
}

.goBack {
  margin-top: 30px;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
}

.group-payment input {
  border: 1px solid #272727;
  padding: 5px 10px;
  border-radius: 10px;
}

input::placeholder {
  font-size: 14px;
}

.wrap-img {
  max-width: 300px;
  max-height: 200px;
  margin-bottom: 20px;
}

.billing-img {
  border-radius: 15px;
}

@media (max-width: 910px) {
  .profit {
    flex-direction: column;
  }

  .day,
  .month,
  .year {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .payment,
  .mypayment-header {
    padding: 10px;
    border-radius: 10px;
  }

  .wrap-btns {
    gap: 20px;
    flex-direction: column;
  }

  .btn,
  input {
    width: 100%;
  }

  .adress-value {
    font-size: 12px;
  }
}

@media (max-width: 400px) {
  .card {
    padding: 15px;
  }
}
</style>
