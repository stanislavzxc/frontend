<script>
import main_active from "../assets/main_active.svg";
import main from "../assets/main.svg";
import dashboard_active from "../assets/dashboard_active.svg";
import dashboard from "../assets/dashboard.svg";
import payments from "../assets/payments.svg";
import payments_active from "../assets/payments_active.svg";
import marketplace from "../assets/marketplace.svg";
import marketplace_active from "../assets/marketplace_active.svg";
import accruals from "../assets/accruals.svg";
import accruals_active from "../assets/accruals_active.svg";
import cart from "../assets/cart.svg";
import cart_active from "../assets/cart_active.svg";
// import support from "../assets/support.svg";
// import support_active from "../assets/support_active.svg";
import myminers from "../assets/myminers.svg";
import myminers_active from "../assets/myminers_active.svg";
import axios from "axios";

export default {
  name: "LeftPanel",
  data() {
    return {
      content: {},
      cards: [
        {
          img: main,
          img_active: main_active,
          name: "",
          active: false,
          route: "main",
        },
        {
          img: dashboard,
          img_active: dashboard_active,
          name: "",
          active: false,
          route: "dashboard",
        },
        {
          img: myminers,
          img_active: myminers_active,
          name: "",
          active: false,
          route: "myminers",
        },
        {
          img: payments,
          img_active: payments_active,
          name: "",
          active: false,
          route: "mypayments",
        },
        {
          img: marketplace,
          img_active: marketplace_active,
          name: "",
          active: false,
          route: "marketplace",
        },
        {
          img: require("../assets/business.png"),
          img_active: require("../assets/business-active.png"),
          name: "",
          active: false,
          route: "business",
        },
        {
          img: accruals,
          img_active: accruals_active,
          name: "",
          active: false,
          route: "accruals",
        },
        {
          img: require("../assets/ranking.png"),
          img_active: require("../assets/top20.png"),
          name: "",
          active: false,
          route: "top20",
        },
        {
          img: require("../assets/stat.png"),
          img_active: require("../assets/stat-active.png"),
          name: "",
          active: false,
          route: "stat",
        },
        {
          img: cart,
          img_active: cart_active,
          name: "",
          active: false,
          route: "cart",
        },
        {
          img: require("../assets/support.svg"),
          img_active: require("../assets/support_active.svg"),
          name: "info",
          active: false,
          route: "info",
        },
        {
          img: require("../assets/AppTech.svg"),
          img_active: require("../assets/AppTech-active.svg"),
          name: "tech",
          active: false,
          route: "tech",
        },
      ],
      name_ru: [
        "Главная",
        "Дашбоард",
        "Мои майнеры",
        "Мои платежи",
        "Маркетплейс",
        "Готовый бизнес",
        "Начисления и списания",
        "Топ 20",
        "Моя Статистика",
        "Корзина",
        "Центр информации",
        "Техническая поддержка",
      ],
      name_en: [
        "Main",
        "Dashboard",
        "My miners",
        "My payments",
        "Marketplace",
        "Ready business",
        "Accruals and write-offs",
        "Top 20",
        "My Statistics",
        "Cart",
        "The Information Center",
        "Technical support",
      ],
      name_he: [
        "ראשי",
        "דשבורד",
        "הכורים שלי",
        "התשלומים שלי",
        "שוק",
        "עסק מוכן",
        "צבירות ומחיקות",
        "טופ 20",
        "הסטטיסטיקה שלי",
        "עגלת קניות",
        "מרכז מידע",
        "תמיכה טכנית",
      ],
      countCart: 0,
      countBillings: 0,
      lang: "RU",
      isLoading: true,
    };
  },
  computed: {
    footerCards() {
      return this.cards.filter(
        (card) => card.route === "info" || card.route === "tech"
      );
    },
    mainCards() {
      return this.cards.filter(
        (card) => card.route !== "info" && card.route !== "tech"
      );
    },
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateGoTry", false);
    },

    navClick(name) {
      try {
        for (let i = 0; i < this.cards.length; i++) {
          let item = this.cards[i];
          item.active = item.name === name;
          this.cards[i] = item;
        }
        let activeCard = this.cards.find((c) => c.name === name);
        if (activeCard) {
          this.$router.push({ name: activeCard.route });
        }
      } catch (err) {
        this.$router.push({ name: "404" });
      }
    },

    checkRoute() {
      let name = this.$route.name;
      for (let i = 0; i < this.cards.length; i++) {
        let card = this.cards[i];
        card.active = card.route === name;
        this.cards[i] = card;
      }
    },

    async loadCart() {
      try {
        let token = localStorage.getItem("token");
        if (token) {
          let response = await axios.get(`/market/cart/get/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.countCart = response.data.count;
          this.countBillings = response.data.billing_count;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async loadLang() {
      try {
        this.isLoading = true;
        let response = await axios.get(`/users/${localStorage.getItem("id")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.lang = response.data.user.lang;
        let names = [];
        if (this.lang === "HE") {
          names = this.name_he;
        } else if (this.lang === "EN") {
          names = this.name_en;
        } else {
          names = this.name_ru;
        }

        const routeToName = {
          main: names[0],
          dashboard: names[1],
          myminers: names[2],
          mypayments: names[3],
          marketplace: names[4],
          business: names[5],
          accruals: names[6],
          top20: names[7],
          stat: names[8],
          cart: names[9],
          info: names[10],
          tech: names[11],
        };

        for (let i = 0; i < this.cards.length; i++) {
          let card = this.cards[i];
          card.name = routeToName[card.route] || "";
          this.cards[i] = card;
        }
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },

    fetchcontent() {
      if (!this.content) return;
      this.cards = this.cards.filter((card) => {
        if (!(card.route in this.content)) return true;
        return this.content[card.route] !== false;
      });
    },
  },
  async mounted() {
    try {
      this.content = JSON.parse(localStorage.getItem("content"));
    } catch {
      this.content = {};
    }
    this.fetchcontent();
    await this.loadLang();
    this.checkRoute();
    this.loadCart();
    setInterval(() => {
      this.loadCart();
    }, 2500);
  },
};
</script>

<template>
  <div class="panel" v-if="!isLoading">
    <nav class="group-nav">
      <li class="nav-item" @click="$router.push({ name: 'home' })">
        <img class="logo" src="../assets/logo.png" alt="" />
      </li>

      <li
        class="nav-item"
        v-for="item in mainCards"
        :key="item.route"
        @click="navClick(item.name)"
      >
        <img :src="item.active ? item.img_active : item.img" alt="" />
        <span :class="{ red: item.active }">{{ item.name }}</span>
        <span class="count" v-if="item.route === 'cart' && countCart > 0">{{ countCart }}</span>
        <span class="count" v-if="item.route === 'mypayments' && countBillings > 0">{{ countBillings }}</span>
      </li>

      <div class="footer">
        <div
          v-for="item in footerCards"
          :key="item.route"
          class="nav-item"
          @click="navClick(item.name)"
        >
          <img :src="item.active ? item.img_active : item.img" alt="" />
          <span :class="{ red: item.active }">{{ item.name }}</span>
        </div>
      </div>
    </nav>
  </div>
</template>


<style scoped>
.parent {
  position: absolute;
  bottom: 5px;
}
.panel {
  width: 25%;
  max-width: 310px;
  background-color: #fff;
  padding: 0 40px 40px 40px;
}

.logo {
  height: 60px;
  cursor: pointer;
}

.group-nav {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-item {
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
}

.nav-item span {
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  color: #0f0f0f;
}

.banner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 10px;
  padding: 15px 5px 5px 0;
  width: 220px;
  height: 220px;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/banner3.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
  border-radius: 20px;
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

.asic {
  height: 129px;
}

.red {
  color: #cf0032 !important;
}

.title,
.scale,
.asic {
  z-index: 2;
}

.title {
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  line-height: 18px;
  text-align: center;
}

.footer {
  display: flex;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  flex-direction: column; /* Убедитесь, что элементы располагаются в строку */
  gap: 15px;
  flex-wrap: wrap; /* Позволяет элементам переноситься на новую строку */
  width: 22%;
  background-color: #f0f0f5;
  margin: 0;
  padding: 20px;
  left: 0;
  align-content: center;
}

.nav-item {
  flex: 1; /* Позволяет элементам занимать равное пространство */
  min-width: 100px; /* Минимальная ширина для каждого элемента */
}
@media (max-width: 1160px) {
  .asic {
    height: 95px;
  }

  .banner {
    width: 170px;
    height: 170px;
  }
}

@media (max-width: 900px) {
  .panel {
    padding: 0 15px 200px 15px; /* Увеличьте нижний отступ для меньших экранов */
  }
}

@media (max-width: 800px) {
  .panel {
    padding: 0 15px 200px 15px; /* Увеличьте нижний отступ для меньших экранов */
  }
  .banner {
    display: none;
  }
}

@media (max-width: 644px) {
  .nav-item span {
    font-size: small;
  }
}

@media (max-width: 564px) {
  .nav-item span {
    display: none;
  }

  .nav-item {
    justify-content: center;
  }

  .group-nav {
    gap: 20px;
  }

  .panel {
    width: 7%;
  }

  img {
    height: 20px;
    width: 20px;
    max-width: none;
  }

  .logo {
    display: none;
  }
}

.count {
  background-color: #cf0032;
  color: #fff !important;
  border-radius: 5px;
  padding: 4px;
  font-weight: 600;
  font-size: 14px;
}
</style>
