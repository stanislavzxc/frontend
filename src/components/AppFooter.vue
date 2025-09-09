<script>
import axios from "axios";
export default {
  name: "AppFooter",
  components: {},
  data() {
    return {
      lang: this.$i18n.locale,
      names: {
        marketplace: "Маркет",
        main: "Главная",
        dashboard: "Приборная панель",
        myminers: "Мои майнеры",
        mypayments: "Мои платежи",
        accruals: "Начисления и списания",
        cart: "Корзина",
        support: "Центр помощи",
        profile: "Профиль",
      },
      id: null,
      avatar: "",
      countries: ["RU", "EN", "HE"],
      active: false,
      links:{}
    };
  },
  props: {
    login: Boolean,
  },
  methods: {
    scrollToBottom(name) {
      const element = document.getElementById(name);
      if (element) {
        window.scrollTo({ top: element.offsetTop, behavior: "smooth" });
      } else {
        this.$router.push({ name: "main" });
      }
    },

    async verify_token() {
      try {
        let response = await axios.post(
          `/auth/validate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let message = response.data.message;
        console.log(response);
        if (message != "ok") {
          this.$router.push({ name: "home" });
        }
      } catch (err) {
        console.log(err);
        let token = this.$route.query.token;
        if (!token) {
          localStorage.clear();
          this.$router.push({ name: "home" });
        }
      }
    },

    async load_avatar() {
      try {
        let response = await axios.get(`/users/${localStorage.getItem("id")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("HEADER", response);
        this.lang = response.data.user.lang;
        this.$i18n.locale = this.lang;
        let app = document.querySelector(`.wrap`);
        if (this.lang == "HE") {
          app.style.direction = "rtl";
        } else {
          app.style.direction = "ltr";
        }
        this.active_billings = response.data.user.active_billings;
        this.avatar = response.data.user.image.url;
      } catch (err) {
        console.log(err);
      }
    },

    async changeLang(lang) {
      try {
        this.lang = lang;
        let response = await axios.post(
          `/users/update/lang`,
          {
            lang: lang,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);
        if (response.data.status == "ok") {
          this.$i18n.locale = lang;
          location.reload();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async load_info() {
      try {
        this.id = this.$route.query.id;
        let response = await axios.get(`/settings/info`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("zxc", response);
        this.links = response.data[0];
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.verify_token();
    this.id = localStorage.getItem("id") || null;

    window.addEventListener("storage", () => {
      this.id = localStorage.getItem("id") || null;
    });
    this.load_avatar();
    this.load_info();
  },
};
</script>
<template>
  <div class="wrapper">
    <img
      @click="this.$router.push({ name: 'main' })"
      class="logo"
      src="../assets/logo.png"
      alt=""
    />
    
    <div class="info">
      <span class="text">Totalminer 2024 All Rights Reserved</span>
      <div class="contacts">
        <img src="../assets/insta.png" alt="" />
        <span>
        <a :href="links.insta" target="_blank">Instagram</a></span>
        <img src="../assets/tiktok.png" alt="" />
        <span>
          <a :href="links.tiktok" target="_blank">TikTok</a>
        </span>
        <img src="../assets/WhatsApp.svg" alt="" />
        <span>
          <a :href="links.whatsapp" target="_blank">WhatsApp</a>
        </span>
        <img src="../assets/Telegram.svg" alt="" />
        <span>
          <a :href="links.telegram" target="_blank">Telegram</a>
        </span>
        <span class="number">{{links.number}}</span>
      </div>
      <div class="group-span">
        <span class="text">{{ $t("policy") }}</span>
        <span class="text">{{ $t("offer") }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  min-height: 80px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  justify-content: space-between;
  background-color: #202020;
  margin-bottom: 0px;
  transform: translateY(100%);
}

.text {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #fff;
  opacity: 50%;
}

.contacts {
  display: flex;
  align-items: center;
  gap: 15px;
}

.flag {
  height: 14px;
}

.arrow {
  height: 20px;
  width: 20px;
}

.item-group {
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
}

.contacts span {
  color: #fff;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
}

.item-group::after {
  margin-top: 2px;
  background-color: #cf0032; /* Цвет линии при наведении на нее курсора мыши */
  display: block;
  content: "";
  height: 2px; /* Высота линии */
  width: 0%;
  -webkit-transition: width 0.4s ease-in-out;
  -moz--transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}
.item-group:hover:after,
.item-group:focus:after {
  width: 100%;
}

.lan {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  cursor: pointer;
}

.all_flags {
  position: absolute;
  padding: 3px 7px;
  transform: translateY(-60px);
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px 0 #00000037;
  z-index: 3;
}

.group-country {
  display: flex;
  align-items: center;
  gap: 6px;
}

.name-country {
  font-size: 14px;
  color: #fff;
  line-height: 14px;
  font-weight: 500;
}

.contacts img {
  height: 15px;
  width: 15px;
  cursor: pointer;
  transition: all 500ms ease;
}

.logo {
  height: 60px;
  cursor: pointer;
  transition: all 500ms ease;
}

.logo:hover,
.contacts img:hover {
  transform: translateY(-3px);
}

.info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.group {
  display: flex;
  align-items: center;
  gap: 60px;
  list-style-type: none;
}

.group-span {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.number {
  direction: ltr !important;
}

@media (max-width: 850px) {
  .info {
    flex-direction: column;
  }
  .group-span {
    align-items: center;
  }
}

@media (max-width: 769px) {
  .wrapper {
    padding: 20px 40px 100px 40px;
  }
}

@media (max-width: 500px) {
  .contacts {
    gap: 6px;
  }

  .group {
    gap: 20px;
  }
}
</style>
