<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  data() {
    return {
      payback_percent: 0,
      day: "",
      hash: "",
      count_miners: "",
      money: "",
      profit: "",
      total_invested_usd: "",
      energy_consumption_kw: "",
      hosting_cost_usd: "",
      reward_btc: "",
      reward_usd: "",
      activeButton: "",
      isLoading: false,
    };
  },
  components: {
    LoadingSpinner,
  },
  methods: {
    async fetchUsers(route) {
      this.isLoading = true;
      this.activeButton = route;
      const url = `/stats/${route}`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        console.log(response);
        this.day = response.data.time_with_us;
        this.day = this.day.slice(0, 2);
        if (response.data.hash_rate) {
          this.hash =
            response.data.hash_rate === "None Hash/s" ? "0" : response.data.hash_rate;
        } else {
          this.hash = "0";
        }
        this.count_miners = response.data.num_workers;
        this.total_invested_usd = response.data.total_invested_usd;
        this.payback_percent = response.data.payback_percent;
        this.energy_consumption_kw = response.data.energy_consumption_kw;
        this.hosting_cost_usd = response.data.hosting_cost_usd;
        this.profit = response.data.net_profit_usd;
        this.reward_btc = response.data.reward_btc;
        this.reward_usd = response.data.reward_usd;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },
    gomarket() {
      this.$router.push({ name: "marketplace" });
    },
  },
  mounted() {
    this.fetchUsers("alltime");
  },
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h2>{{ $t("stat") }}</h2>
    <div class="wrap-cards">
      <div class="yr">
        <span class="title">{{ $t("with") }}</span>
        <span class="name">{{ day }} {{ $t("daywith") }}</span>
      </div>
      <div class="yr">
        <span class="title">{{ $t("th") }}</span>
        <span class="name">{{ hash }}</span>
      </div>
      <div class="yr">
        <span class="title">{{ $t("count_miners") }}</span>
        <span class="name">{{ count_miners }}</span>
      </div>
    </div>
    <div class="wrap-cards stat">
      <div class="yr small-card">
        <span class="title">{{ $t("sum") }}</span>
        <span class="name">{{ total_invested_usd }}</span>
      </div>
      <div class="yr large-card">
        <div class="payback-header">
          <span class="title">{{ $t("okup") }}</span>
          <span class="name">{{ payback_percent }}%</span>
        </div>
        <div class="wrap-scale">
          <div class="scale" :style="'width: ' + (100 - payback_percent) + '%'"></div>
        </div>
      </div>
    </div>
    <div class="parent">
      <h3>{{ $t("stat") }}</h3>
      <div class="wrapper-btns">
        <div class="desktop-buttons">
          <button
            @click="fetchUsers('daily')"
            class="btnelse"
            :class="{ active: this.activeButton == 'daily' }"
          >
            {{ $t("day") }}
          </button>
          <button
            @click="fetchUsers('weekly')"
            class="btnelse"
            :class="{ active: this.activeButton == 'weekly' }"
          >
            {{ $t("week") }}
          </button>
          <button
            @click="fetchUsers('monthly')"
            class="btnelse"
            :class="{ active: this.activeButton == 'monthly' }"
          >
            {{ $t("month") }}
          </button>
          <button
            @click="fetchUsers('alltime')"
            class="btnelse"
            :class="{ active: this.activeButton == 'alltime' }"
          >
            {{ $t("alltime") }}
          </button>
        </div>
        <div class="mobile-dropdown">
          <select @change="fetchUsers($event.target.value)" v-model="activeButton">
            <option value="daily">{{ $t("day") }}</option>
            <option value="weekly">{{ $t("week") }}</option>
            <option value="monthly">{{ $t("month") }}</option>
            <option value="alltime">{{ $t("alltime") }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="wrap-cards">
      <div class="yr">
        <span class="title">{{ $t("energy") }} KW </span>
        <span class="name">{{ energy_consumption_kw }}</span>
      </div>
      <div class="yr">
        <span class="title">{{ $t("hosting_cost") }}</span>
        <span class="name">{{ hosting_cost_usd }}</span>
      </div>
      <div class="yr">
        <span class="title">{{ $t("Mined") }}</span>
        <span class="name">{{ profit }}</span>
      </div>
    </div>
    <div class="yr big">
      <span class="title">{{ $t("profit") }}</span>
      <div class="inline">
        <span class="name green">{{ reward_btc }}</span>
        <span class="title">({{ reward_usd }}$)</span>
      </div>
    </div>
    <h2>{{ $t("rec") }}</h2>
    <div class="rec">
      <img src="../assets/rec.png" alt="" />
      <div class="content">
        <h5>{{ $t("comment") }}</h5>
        <p>{{ $t("commenttwo") }}</p>
        <div class="btn-container">
          <button class="btn" @click="gomarket()">{{ $t("most_power") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  justify-content: space-between;
}
@media (max-width: 1024px) {
  .parent {
    display: block;
  }
  .wrapper-btns {
    padding-top: 20px;
  }
}
.mobile-dropdown option {
  background-color: white; /* Устанавливаем белый фон для опций */
  color: #272727; /* Устанавливаем цвет текста */
}
.desktop-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.mobile-dropdown select {
  width: 100%; /* Устанавливаем ширину 100% для select */
  background-color: white; /* Устанавливаем белый фон для select */
  border: none; /* Убираем рамку для select */
  border-radius: 10px; /* Закругляем углы для select */
  padding: 10px; /* Добавляем отступы */
  font-size: 16px; /* Устанавливаем размер шрифта */
}
.mobile-dropdown {
  display: none;
  border: none;
  background-color: white;
}

@media (max-width: 570px) {
  .desktop-buttons {
    display: none; /* Скрываем кнопки на мобильных экранах */
  }

  .mobile-dropdown {
    display: block; /* Показываем выпадающее меню на мобильных экранах */
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
  }
  .yr {
    width: 100% !important; /* Устанавливаем ширину 100% */
    display: block; /* Устанавливаем блочное отображение */
    margin-bottom: 10px; /* Добавляем отступ между элементами */
    padding: 15px; /* Добавляем внутренние отступы */
    background-color: #f9f9f9; /* Устанавливаем фон для лучшего контраста */
    border: 1px solid #ddd; /* Добавляем границу */
    border-radius: 10px; /* Закругляем углы */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Добавляем тень для глубины */
  }

  .wrap-cards {
    flex-direction: column; /* Устанавливаем вертикальное направление для карточек */
    gap: 10px; /* Добавляем отступ между карточками */
  }
}

.active {
  background-color: #cf00321a;
  color: red !important;
}
.btnelse {
  /* background-color: #cf0032; */
  border: none;
  border-radius: 10px;
  padding: 17px 32px;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: #27272766;
}
.wrapper-btns {
  display: flex;
  align-items: center;
  gap: 10px;
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
@media (max-width: 380px) {
  .wrapper-btns {
    flex-direction: column;
  }
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

.rec {
  width: 100%;
  padding: 25px 30px;
  display: flex;
  gap: 20px;
  border-radius: 20px;
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
}
.title {
  color: black;
}
.inline {
  display: flex;
  gap: 10px;
}
.big {
  width: 99% !important;
}
.green {
  color: green !important;
}
.scale {
  position: absolute;
  right: 0;
  height: 6px;
  background-color: #a9a9a9;
}

.wrap-scale {
  position: relative;
  width: 100%;
  border-radius: 10px;
  height: 6px;
  background: linear-gradient(to right, #e11111 0%, #ecf02b 50%, #2ee111 100%);
  overflow: hidden;
}

.wrap-cards {
  display: flex;
  gap: 10px;
}

.name {
  font-weight: 600;
  color: #272727;
  font-size: 20px;
  line-height: 20px;
}

.yr {
  width: 33%;
  background-color: #fff;
  border-radius: 20px;
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title {
  opacity: 50%;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #272727;
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

/* Новые стили для карточек */
.small-card {
  width: 33%; /* Ширина 33% */
}

.large-card {
  width: 66%; /* Ширина 66% */
  display: flex;
  flex-direction: column; /* Вертикальное выравнивание */
  justify-content: space-between; /* Разделяет пространство между элементами */
}

.payback-header {
  display: flex; /* Используем flex для выравнивания в строку */
  justify-content: space-between; /* Разделяет пространство между элементами */
  align-items: center; /* Выравнивание по центру по вертикали */
}
.stat {
  display: flex;
  justify-content: space-between; /* Разделяет пространство между заголовком и кнопками */
  align-items: center; /* Выравнивание по центру по вертикали */
  margin-bottom: 20px; /* Отступ между заголовком и карточками */
}
</style>
