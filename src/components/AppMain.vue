<script>
import axios from "axios";
import BlockCalculator from "./BlockCalculator.vue";
import BannerMain from "./BannerMain.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
import BlockMiniMarket from "./BlockMiniMarket.vue";
import AppGraphic from "./AppGraphic.vue";
import AppNews from "./AppNews.vue";
export default {
  name: "AppMain",
  components: {
    BlockCalculator,
    BannerMain,
    LoadingSpinner,
    BlockMiniMarket,
    AppGraphic,
    AppNews,
  },
  data() {
    return {
      total_earn_value: 0,
      total_earn_value_usd: 0,
      expected_income: 0,
      expected_income_btc: 0,
      payments: [],
      paymentsSorted: [],
      isLoading: false,
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.get(`/miners/information`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        this.total_earn_value = response.data.total_earn_value;
        this.total_earn_value_usd = response.data.total_earn_value_usd;
        this.expected_income = response.data.expected_income;
        this.expected_income_btc = response.data.expected_income_btc;

        let resPayments = await axios.get(`/miners/payments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.payments = resPayments.data.data;
        if (this.payments) {
          this.paymentsSorted = this.payments.filter(
            (item) => item.type == "reward" || item.type == "payout"
          );
        }
        // reward и payout
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

    roundSix(s) {
      s = String(s);
      if (s) {
        return s.slice(0, 8);
      }
    },

    roundFour(s) {
      s = String(s);
      if (s) {
        return s.slice(0, 6);
      }
    },

    printType(type) {
      let lang = localStorage.getItem("lang");
      if (lang == "RU") {
        if (type == "hosting") {
          return "Плата за хостинг";
        } else if (type == "reward") {
          return "Награда за майнинг";
        } else if (type == "payout") {
          return "Вывод средств";
        }
        return "";
      } else if (lang == "EN") {
        if (type == "hosting") {
          return "Hosting fees";
        } else if (type == "reward") {
          return "Mining Reward";
        } else if (type == "payout") {
          return "Withdrawal of funds";
        }
        return "";
      } else if (lang == "HE") {
        if (type == "hosting") {
          return "דמי אירוח";
        } else if (type == "reward") {
          return "פרס כרייה";
        } else if (type == "payout") {
          return "משיכת כספים";
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
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="1 != 1" />
  <div class="wrapper" v-else>
    <BannerMain />
    <h2>{{ $t("totalEarned") }}</h2>
    <div class="total bx">
      <img src="../assets/btc.svg" alt="" />
      <span class="usd">{{ total_earn_value_usd }} $</span>
      <span class="btc">(~{{ roundFour(total_earn_value) }} BTC)</span>
    </div>
    <div class="profit">
      <div class="day bx">
        <span class="title">{{ $t("dailyIncome") }}:</span>
        <div class="group">
          <span class="usd">{{ expected_income }} $</span>
          <div class="btc">(~{{ roundSix(expected_income_btc) }} BTC)</div>
        </div>
      </div>
      <div class="month bx">
        <div class="title">{{ $t("monthlyIncome") }}:</div>
        <div class="group">
          <span class="usd">{{ roundTwo(expected_income * 31) }} $</span>
          <span class="btc">(~{{ roundFour(expected_income_btc * 31) }} BTC)</span>
        </div>
      </div>
      <div class="year bx">
        <div class="title">{{ $t("annualIncome") }}:</div>
        <div class="group">
          <span class="usd">{{ roundTwo(expected_income * 365) }} $</span>
          <span class="btc">(~{{ roundFour(expected_income_btc * 365) }} BTC)</span>
        </div>
      </div>
    </div>
    <BlockCalculator :white="true" />
    <BlockMiniMarket />
    <AppGraphic :select="0" />
    <AppNews />
    <h2 v-if="false">{{ $t("myPayments") }}</h2>
    <div class="mypayments" v-if="payments.length > 0 && false">
      <div class="mypayment-header">
        <span class="date">{{ $t("date") }}</span>
        <span class="type">{{ $t("type") }}</span>
        <span class="sum_payment">{{ $t("amountPayment") }}</span>
      </div>
      <div class="payment bx" v-for="card in paymentsSorted" :key="card.id">
        <div class="group-payment">
          <span class="date">{{ card.date }}</span>
          <span class="time">{{ card.time }}</span>
        </div>
        <span class="type">{{ printType(card.type) }}</span>
        <div class="group-payment">
          <div class="payment-btc">{{ card.value }} {{ card.currency }}</div>
          <div class="payment-hashrate">{{ card.hash_rate }}</div>
        </div>
      </div>
    </div>
    <div class="not_found" v-if="false">
      <span>{{ $t("not_found") }}</span>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.total {
  width: 100%;
  padding: 25px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background-color: #fff;
}

.usd {
  font-weight: 600;
  color: #272727;
  font-size: 20px;
  line-height: 20px;
}

.btc {
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  opacity: 50%;
  color: #272727;
}

.title {
  opacity: 50%;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #272727;
}

.profit {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.day,
.month,
.year {
  width: 33%;
  background-color: #fff;
  border-radius: 20px;
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group {
  display: flex;
  align-items: center;
  gap: 10px;
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

.mypayment-header span,
.date,
.payment-btc,
.status {
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: #272727;
}

.payment {
  background-color: #fff;
  border-radius: 20px;
  padding: 24px 30px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: all 500ms ease;
}

.payment:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 10px 0 #00000037;
}

.group-payment {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.group-payment,
.type,
.group-status,
.date,
.status,
.sum_payment {
  flex: 22%;
}

.not_found {
  height: 30vh;
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
@media (max-width: 1200px) {
  .usd,
  .btc {
    font-size: 16px;
  }
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
  .time,
  .payment-hashrate,
  .payment-btc,
  .date,
  .mypayment-header span,
  .status,
  .type {
    font-size: 10px;
    line-height: 10px;
  }

  .payment,
  .mypayment-header {
    padding: 10px;
    border-radius: 10px;
  }
}

@media (max-width: 420px) {
  .total {
    padding: 20px;
    gap: 7px;
  }
}
</style>
