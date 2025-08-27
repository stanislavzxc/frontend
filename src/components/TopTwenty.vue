<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import axios from "axios";
export default {
  data() {
    return {
      cards: [],
      isLoading: false,
    };
  },
  components: {
    LoadingSpinner,
  },
  methods: {
    async fetchUsers() {
      const url = `https://totalminers.io/admin-api/users/get/top20`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        this.isLoading = true;
        const response = await axios.get(url, { headers });
        console.log(response.data);
        this.cards = response.data;
        for (let i = 0; i < this.cards.length; i++) {
          try {
            this.cards[i].total_hashrate = this.cards[i].total_hashrate.slice(0, 3);
            this.cards[i].reward_btc = parseFloat(this.cards[i].reward_btc.toFixed(2));
            this.cards[i].reward_usd = parseFloat(this.cards[i].reward_usd.toFixed(2));
          } catch (e) {
            console.log(e);
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },
    market(){
        this.$router.push({ name: "marketplace" });
    }
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="container">
      <h2>{{ $t("top") }} 20</h2>
      <button class="btn" @click="market()">{{ $t("most_power") }}</button>
    </div>
    <div class="cart" v-for="(card, index) in cards" :key="card.id">
      <div class="circle">
        <p>{{ index + 1 }}</p>
      </div>
      <div class="content">
        <div class="top inner">
          <p class="name val">{{ card.firstname }}</p>
          <div class="hash-rate">
            <p class="text">{{ $t("hash") }}</p>
            <p class="val">{{ card.total_hashrate }} TH</p>
          </div>
          <div class="income">
            <p class="text">{{ $t("profit") }}:</p>
            <p class="val green">{{ card.reward_usd }}$</p>
            <p class="text">/</p>
            <p class="val green">{{ card.reward_btc }} BTC</p>
          </div>
        </div>
        <div class="bottom inner">
          <p class="text">{{ $t("devices") }}:</p>
          <p class="val">{{ card.device_count }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.green {
  color: #3ccc0a !important;
}
.text {
  color: #272727;
  opacity: 40%;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  margin-right: 6px;
  margin-left: 6px;
}
.val {
  color: #272727;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
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
.container {
  display: flex;
  justify-content: space-between;
}
.cart {
  width: 100%;
  padding: 25px 30px;
  display: flex;
  gap: 20px;
  border-radius: 20px;
  background-color: #fff;
  align-items: center; /* Выравнивание по центру по вертикали */
}
.circle {
  min-width: 32px;
  width: 32px;
  height: 32px;
  background-color: #cf0032;
  border: 1px solid #cf0032;
  border-radius: 50%; /* Круглая форма */
}
.circle p {
  margin-top: 6px;
  display: flex;
  justify-content: center;
  color: #ffffff;
  font-weight: 800;
  font-size: 16px;
  line-height: 100%;
}
.btn {
  background-color: #cf0032;
  border: none;
  border-radius: 10px;
  padding: 17px 32px;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
}
.inner {
  display: flex;
  align-items: center; /* Выравнивание по вертикали */
}
.top {
  display: flex;
  align-items: center; /* Выравнивание по вертикали */
}
.name {
  margin-left: 10px; /* Промежуток между кругом и именем */
}
.hash-rate,
.income {
  display: flex;
  align-items: center;
  margin-left: 20px; /* Отступ между элементами */
  flex-direction: row; /* Горизонтальное расположение */
}

@media (max-width: 1024px) {
  /* Для планшетов */
  .cart {
    flex-direction: row; /* Оставляем в строку */
    justify-content: start; /* Разделяем пространство между элементами */
    padding: 15px 20px;
  }

  .hash-rate,
  .income {
    flex: 1; /* Занимаем равное пространство */
    margin-left: 0; /* Убираем отступ слева для планшетов */
  }
}

@media (max-width: 768px) {
  /* Для мобильных устройств */

  .hash-rate,
  .income {
    justify-content: flex-start; /* Выравнивание по левому краю */
  }

  .inner {
    flex-direction: column; /* Элементы внутри .inner будут вертикально */
    align-items: flex-start; /* Выравнивание по левому краю */
  }
}
</style>
