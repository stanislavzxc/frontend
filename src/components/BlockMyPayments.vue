<script>
import LoadingSpinner from './LoadingSpinner.vue';
import axios from 'axios';
export default {
  data() {
    return {
      isLoading: false,
      cards: [
        {
          date: "10.11.2022",
          time: "12:00",
          type: "Reward",
          amountPayment: "+0.2334",
          hashrate: "754.04",
          status: "Completed",
        },
        {
          date: "10.11.2022",
          time: "12:00",
          type: "Payment",
          amountPayment: "+0.2334",
          hashrate: "754.04",
          status: "Completed",
        },
      ],
    };
  },
  components:{
    LoadingSpinner
  },
  methods:{
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.get(`/billings/get/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.cards = response.data.data;
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted(){
    this.load_info()
  }

};
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="parent" v-else>
    <h2>{{ $t("myPayments") }}</h2>
  <div class="payments" v-if="cards.length > 0">
    <div class="names">
      <p>{{ $t("date") }}</p>
      <p>{{ $t("type") }}</p>
      <p>{{ $t("amountPayment") }}</p>
      <p>{{ $t("status") }}</p>
    </div>
    <div class="card" v-for="card in cards" :key="card">
      <div class="inner">
        <p class="top">{{ card.date }}</p>
        <p class="bottom">{{ card.time }}</p>
      </div>
      <p
        :class="{
          green: card.type === 'Reward',
          blue: card.type === 'Payment',
        }"
      >
        {{ card.type }}
      </p>
      <div class="inner">
        <p class="top">{{ card.amountPayment }} BTC</p>
        <p class="bottom">{{ card.hashrate }} TH/s</p>
      </div>
      <div class="status">
        <div
          :class="{
            greendot: card.status === 'Completed',
            red: card.status === 'Incompleted',
          }"
        ></div>
        <p class="top">{{ card.status }}</p>
      </div>
    </div>
  </div>
  <div class="payments" v-else>
    <div class="card bx">
      <h3>{{ $t('nopay') }}</h3>
  </div>
  </div>
</div>
</template>

<style scoped>
.parent{
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.payments{
  width:90%;
}
.bx{
  flex-direction: column !important;
}
.names {
  display: flex;
  justify-content: space-between;
  padding: 10px 30px 0px 30px;
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
  transition: all 500ms ease;
  height: 120px;
  margin-top: 10px;
}
.inner {
  display: flex;
  flex-direction: column;
}
.status {
  display: flex;
}
.greendot {
  width: 10px;
  height: 10px;
  background-color: rgb(91, 236, 91);
  border-radius: 50%;
  margin-top: 6px;
}
.green {
  color: rgb(91, 236, 91);
}
.blue {
  color: #195ee6;
}
.red {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  margin-top: 6px;
}
.top {
  font-weight: 600;
  color: black;
}
.bottom {
  color: grey;
}
.status {
  display: flex;
  justify-content: center;
  gap: 5px;
}
.names p {
  font-weight: 600;
}
</style>
