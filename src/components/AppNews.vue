<script>
import axios from "axios";
export default {
  data() {
    return {
      cards: [],
    };
  },
  methods: {
    async fetchUsers() {
      const url = `https://totalminers.io/admin-api/news`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        this.cards = response.data;
        for (let i = 0; i < this.cards.length; i++) {
          this.cards[i].created = this.cards[i].created.slice(0,10);           
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    goToUrl(url) {
    // Переход по URL
    window.location.href = url;
  },
  

  },
  mounted() {

     this.fetchUsers();
  },
};
</script>

<template>
  <div class="container">
    <h2>{{ $t("news") }}</h2>
  </div>
  <div class="cart" v-for="card in cards" :key="card.id" @click="goToUrl(card.url)">
    <img src="../assets/news.png" class="circle" v-if="card.image == 'void'"/>
    <img :src="card.image" class="circle" v-else/>
    <div class="content">
      <div class="top inner">
     
        <p class="name val">{{ card.title }}</p>
        <p class="name val created">{{ card.created }}</p>
    
      </div>
      <div class="bottom inner">
        <p class="val">{{ card.description }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped>

.created{
  color:gray !important;
}
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
  cursor: pointer;
}
.circle {
  min-width: 56px;
  width: 56px;
  height: 56px;
  border-radius: 10px; /* Круглая форма */
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
