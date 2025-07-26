<script>
import axios from "axios";
import AppCard from "./AppCard.vue";
export default {
  name: "BlockEquipment",
  components: {AppCard},
  data() {
    return {
      cards: [],
      token: "",
    };
  },
  methods: {
    goTry(id) {
      if (this.token) {
        this.$router.push({ name: "product", query: { id: id } });
      } else {
        this.$emit("updateGoTry", true);
      }
    },

    goMarket() {
      if (this.token) {
        this.$router.push({ name: "marketplace" });
      } else {
        this.$emit("updateGoTry", true);
      }
    },

    async load_info() {
      try {
        let response = await axios.get(`/miners/get/all`);
        this.cards = response.data.miners_items;
        if (this.cards.length > 0) {
          this.cards = this.cards.slice(0, 3)
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.load_info();
    this.token = localStorage.getItem("token");
  },
};
</script>
<template>
  <div class="wrapper">
    <h2>{{ $t("equipment") }}</h2>
    <div class="cards">
      <!-- <div class="main-card card">
        <div class="background"></div>
        <div class="title">{{ $t("testPeriod") }}</div>
        <img class="asic" src="../assets/asic.png" alt="" />
        <button @click="this.$emit('updateFormFeedback', true)" class="btn">
          {{ $t("try") }}
        </button>
      </div> -->
      <AppCard class="card" v-for="card in cards" :name="card.name" :image="card.image && card.image.url ? card.image.url : require('../assets/default.png')" :price="card.price" :hosting="card.hosting" :income="card.income" :energy_consumption="card.energy_consumption" :profit="card.profit" :payback_percent="card.payback_percent" :payback="card.payback"
      :key="card.id"
      @click="goTry(card.id)" />
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
.cards {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 20px;
  overflow-y: hidden;
  overflow-x: scroll;
  padding: 20px 15px;
  scrollbar-width: none; /* Убирает полосу прокрутки */
  -ms-overflow-style: none; /* Для Internet Explorer */
}

.card {
  max-height: 500px;
  width: 32%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
}

.card:hover {
  transform: scale(1.03);
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

@media (max-width: 812px) {
  .cards {
    justify-content: center;
  }
  
  .card {
    width: 100%;
  }
}

</style>
