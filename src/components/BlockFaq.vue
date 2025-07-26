<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "BlockBusiness",
  components:{LoadingSpinner},
  data() {
    return {
      lang: "RU",
      cards_ru: [],
      cards_en: [],
      cards_he: [],
      data: [],
      cards: [],
      isloading:false,
    };
  },
  methods: {
    async fetchUsers() {
      this.isloading = true;
      const url = `/settings/faq`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        this.cards = response.data;
        const faqItems = response.data[0]; // Берем первый (и единственный) элемент массива
        this.cards_ru = [
          {
            qst: faqItems.vopros1,
            ans: faqItems.otvet1,
            open: false
          },
          {
            qst: faqItems.vopros2,
            ans: faqItems.otvet2,
            open: false
          },
          {
            qst: faqItems.vopros3,
            ans: faqItems.otvet3,
            open: false
          }
        ];
        
        this.cards = this.cards_ru;
        // Переводим данные

        // await this.translateData(this.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }finally{
        this.isloading = false;
      }
    },

    
  },
  async mounted() {
    await this.fetchUsers();
    // Логика для установки языка
    let id = localStorage.getItem("id");
    if (id) {
      let response = await axios.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.lang = response.data.user.lang;
    } else {
      this.lang = localStorage.getItem("lang") || "RU";
    }

    // Устанавливаем текущие карточки в зависимости от языка
    if (this.lang === "RU") {
      this.cards = this.cards_ru;
    } else if (this.lang === "EN") {
      this.cards = this.cards_en;
    } else if (this.lang === "HE") {
      this.cards = this.cards_he;
    } else {
      this.cards = this.cards_ru;
    }
  },
};
</script>

<template>
  <LoadingSpinner v-if="isloading"/>
  <div class="wrapper" v-else>
    <div class="wrap-title">
      <h2>FAQ</h2>
      <div class="wrap-btns" v-if="$route.name == 'support'">
        <button @click="goCreate" class="btn">{{ $t("createTicket") }}</button>
        <button @click="goTickets" class="btn myTickets">
          {{ $t("myTickets") }}
        </button>
      </div>
    </div>
    <div class="cards">
      <div
        class="card"
        v-for="card in cards"
        :key="card"
        @click="card.open = !card.open"
        :class="{ active: card.open }"
      >
        <div class="info">
          <span class="qst">{{ card.qst }}</span>
          <img v-if="!card.open" class="arr" src="../assets/arrow-down.png" alt="" />
          <img v-if="card.open" class="arr rot" src="../assets/arrow-down.png" alt="" />
        </div>
        <div v-if="card.open" class="ans" v-html="card.ans"></div>
      </div>
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

.wrap-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.btn {
  background-color: #cf0032;
  color: #fff;
  border: 1px solid #cf0032;
  border-radius: 10px;
  padding: 12px 17px;
  width: 224px;
  height: 50px;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  cursor: pointer;
  width: 100%;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card:hover {
  transform: scale(1.02);
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.arr {
  width: 24px;
  height: 24px;
}

.rot {
  transform: rotate(180deg);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.ans {
  animation-name: fade-in;
  animation-duration: 0.5s; /* Задержка анимации */
  animation-fill-mode: forwards; /* Элемент останется в состоянии после окончания анимации */
}

.qst {
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  color: #0f0f0f;
}

.active {
  transform: scale(1.02);

  transition: all 500ms ease;
}

.wrap-btns {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.myTickets {
  background-color: transparent;
  border: 1px solid #cf0032;
  color: #cf0032;
}
</style>
