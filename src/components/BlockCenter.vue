<template>
  <LoadingSpinner v-if="isLoading" />
  <div v-else>

    <!-- Карточки -->
    <div class="cards">
      <div
        class="card"
        v-for="card in paginatedCards"
        :key="card.id"
        @click="open(card.id)"
      >
      <img src="../assets/news.png" class="asic" v-if="card.image == 'void'"/>
    <img :src="card.image" class="asic" v-else/>
    <div class="info">
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
    </div>
        <!-- Добавьте остальное содержимое карточки здесь -->
      </div>
    </div>

    <!-- Сообщения корзины -->
    <div
      v-if="cart && cart !== 'Ошибка'"
      @click="$router.push({ name: 'infoblock' })"
      class="cart"
    >
      {{ $t("addedCart") }}
    </div>
    <div v-if="cart === 'Ошибка'" class="cart cart_error">
      {{ $t("error") }}
    </div>

    <!-- Пагинация -->
    <div class="pages">
      <button
        :disabled="currentPage === 1"
        @click="goPrev"
        class="page-nav"
      >
        &lt;
      </button>

      <button
        v-for="page in pagesToShow"
        :key="page + 'page'"
        :class="[
          page === currentPage ? 'page-selected' : '',
          page === '...' ? 'non-active' : '',
        ]"
        @click="goToPage(page)"
        :disabled="page === '...'"
      >
        {{ page }}
      </button>

      <button
        :disabled="currentPage === totalPages"
        @click="goNext"
        class="page-nav"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "AppMarket",
  components: { LoadingSpinner },
  data() {
    return {
      cards: [],
      cart: false,
      isLoading: false,
      categories: [],
      category_id: 1,
      maxsize: 4,  // карточек на страницу
      currentPage: 1, // текущая страница
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.cards.length / this.maxsize);
    },
    paginatedCards() {
      const start = (this.currentPage - 1) * this.maxsize;
      return this.cards.slice(start, start + this.maxsize);
    },
    pagesToShow() {
  const total = this.totalPages;
  const current = this.currentPage;
  const pages = [];

  if (total <= 5) {
    // Для небольшого количества страниц (<=5) показываем динамически с троеточиями

    if (total === 1) {
      pages.push(1);
    } else if (total === 2) {
      pages.push(1, 2);
    } else if (total === 3) {
      // Показываем все
      pages.push(1, 2, 3);
    } else if (total === 4) {
      if (current <= 2) {
        pages.push(1, 2, '...', 4);
      } else {
        pages.push(1, '...', 3, 4);
      }
    } else if (total === 5) {
      if (current <= 2) {
        pages.push(1, 2, '...', 5);
      } else if (current >= 4) {
        pages.push(1, '...', 4, 5);
      } else {
        pages.push(1, '...', 3, 4, 5);
      }
    }

  } else {
    // Для большого количества страниц (>5)

    if (current <= 2) {
      pages.push(1, 2, '...', total);
    } else if (current >= total - 1) {
      pages.push(1, '...', total - 1, total);
    } else {
      pages.push(1, '...', current, current + 1, '...', total);
    }
  }

  return pages;
}

  },
  methods: {
    async goTry(id) {
      try {
        if (!localStorage.getItem("token")) {
          this.$emit("updateGoTry", true);
        } else {
          let response = await axios.get(`/market/cart/set?miner_item_id=${id}&count=1`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.data.status === "ok") {
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
    async load_categories() {
      try {
        let resCategories = await axios.get(`/miners/categories/get/all`);
        this.categories = resCategories.data.miners_items_categories;
        this.category_id = this.categories[0].id;
      } catch (err) {
        console.log(err);
      }
    },
    
    async fetchUsers() {
      this.isLoading = true;

      const url = `http://209.46.123.31:5000/news`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        this.cards = response.data;
        for (let i = 0; i < this.cards.length; i++) {
          this.cards[i].created = this.cards[i].created.slice(0,10);           
        }
        this.currentPage = 1; // сброс пагинации при смене категории
      } catch (error) {
        console.error("Error fetching users:", error);
      }finally {
        this.isLoading = false;
      }
    },
    open(id) {
      this.$router.push({ name: "infoblock", query: { id: id } });
    },
    async categoryClick(id) {
      this.category_id = id;
      await this.load_info();
    },
    goToPage(page) {
      if (page === "...") return;
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    goNext() {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
      }
    },
    goPrev() {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1);
      }
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_categories();
    this.fetchUsers();
  },
};
</script>
<style scoped>
.info{
  width: 100%;
  display: flex;
  justify-content: flex-start !important;
  gap: 0 !important;
}
.wrapper {
  margin-top: 40px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.cards {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  /* min-height: 474px; */
  flex: 30%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: first baseline;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  max-width: 377px;
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

.time_profit {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #a9a9a9;
}
.title {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #fff;
}

.price {
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
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

.asic {
  width: 75%;
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

.cart {
  width: fit-content;
  position: fixed;
  bottom: 5%;
  left: 45%;
  background-color: #2ee111;
  color: #fff;
  font-size: 16px;
  padding: 17px 24px;
  border-radius: 10px;
  font-weight: 600;
  z-index: 5;
  cursor: pointer;
}

.cart_error {
  background-color: #cf0032;
}

.wrap-categories {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category {
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  background-color: #fff;
  color: #cf0032;
  text-align: center;
  padding: 12px 17px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 0 10px 0 #00000037;
  transition: all 500ms ease;
}

.category:hover {
  transform: translateY(-3px);
}

.category_active {
  background-color: #cf0032;
  color: #fff;
}

@media (max-width: 1060px) {
  .cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 812px) {
  .cards {
    justify-content: center;
  }

  .card {
    flex: 50%;
    width: auto;
    max-width: 45%;
  }
}

@media (max-width: 560px) {
  .card {
    flex: 100%;
    max-width: 80%;
  }
}

@media (max-width: 430px) {
  .card {
    max-width: 100%;
  }
}
.par {
  display: flex;
  justify-content: space-between; /* Распределяет пространство между элементами */
  align-items: center; /* Центрирует элементы по вертикали */
  width: 100%; /* Убедитесь, что контейнер занимает полную ширину карточки */
  margin:10px 0px;

}
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 0px;
}
.cards {
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap; /* Позволяет карточкам оборачиваться */
  gap: 20px;
}

.card {
  flex: 0 1 45%; /* Задает ширину карточки 45% и позволяет ей сжиматься */
  max-width: 45%; /* Ограничивает максимальную ширину карточки */
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

.time_profit {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #a9a9a9;
}
.title {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #fff;
}

.price {
  flex: 1;
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
}

.btn {
  width: 70%;
  border-radius: 10px;
  padding: 12px 17px;
  color: #fff;
  background-color: #cf0032;
}

.group {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-direction: column;

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

.asic {
  height: 100%;
  width: 100%;
}

.info {
  display: flex;
  justify-content: space-between; /* Распределяет элементы по всей ширине контейнера */
  width: 100%; /* Убедитесь, что контейнер занимает полную ширину */
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

.cart {
  width: fit-content;
  position: fixed;
  bottom: 5%;
  left: 45%;
  background-color: #2ee111;
  color: #fff;
  font-size: 16px;
  padding: 17px 24px;
  border-radius: 10px;
  font-weight: 600;
  z-index: 5;
  cursor: pointer;
}

.cart_error {
  background-color: #cf0032;
}

@media (max-width: 1060px) {
  .cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 812px) {
  .cards {
    justify-content: center;
  }

  .card {
    flex: 50%;
    width: auto;
    max-width: 45%;
  }
}

@media (max-width: 560px) {
  .card {
    flex: 100%;
    max-width: 80%;
  }
  .par{
    flex-direction: column;
  }
  .price{
    padding:10px, 0px;
  }
}

@media (max-width: 430px) {
  .card {
    max-width: 100%;
  }
  .par{
    flex-direction: column;
    
  }
  .price{
    margin-bottom: 10px;
  }
}
.pages{
    display: flex;
    gap:5px;
    justify-content:center;
}
.pages *{
    border-radius:15px;
    padding:16px 8px 16px 8px;
    width:48px;
    height:48px;
    border:1px solid #00000026;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px; 
}
.page-selected{
    color:white;
    background-color:#CF0032;
    border:1px solid #CF0032;
}
.non-active{
    color:grey;
}
</style>
