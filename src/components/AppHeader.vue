<script>
import axios from "axios";
export default {
  name: "AppHeader",
  components: {},
  data() {
    return {
      lang: "RU",
      names: {
        marketplace: this.$t("market"),
        business: this.$t("readyBusiness"),
        top20: this.$t("top") + " " + "20",
        stat: this.$t("stat"),
        info: this.$t("supportCenter"),
        tech: this.$t("support"),
        main: this.$t("main"),
        dashboard: this.$t("dash"),
        myminers: this.$t("myMiners"),
        mypayments: this.$t("myPayments"),
        accruals: this.$t("accruals"),
        cart: this.$t("cart"),
        profile: this.$t("profile"),
        payment: this.$t("payment"),
        tickets: this.$t("myTickets"),
        ticket: this.$t("ticket"),
      },
      id: null,
      avatar: "",
      countries: ["RU", "EN", "HE"],
      active: false,
      active_billings: false,
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
        this.avatar = response.data.user.image.url.replace("https://209.46.123.31:9000", "https://totalminers.io");

      } catch (err) {
        console.log(err);
      }
    },

    loadLang() {
      try {
        this.lang = localStorage.getItem("lang");
        console.log(localStorage.getItem("lang"));
        if (this.lang) {
          this.$i18n.locale = this.lang;
        } else {
          this.lang = "RU";
        }
        let app = document.querySelector(`.wrap`);
        if (this.lang == "HE") {
          app.style.direction = "rtl";
        } else {
          app.style.direction = "ltr";
        }
      } catch (err) {
        console.log(err);
      }
    },

    async changeLang(lang) {
      try {
        this.lang = lang;
        if (this.id != null) {
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
            localStorage.setItem("lang", this.lang);
            location.reload();
          }
        } else {
          localStorage.setItem("lang", this.lang);
          this.$i18n.locale = this.lang;
          let app = document.querySelector(`.wrap`);
          if (this.lang == "HE") {
            app.style.direction = "rtl";
          } else {
            app.style.direction = "ltr";
          }
        }
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
    if (this.id != null) {
      this.load_avatar();
    } else {
      this.loadLang();
    }
  },
};
</script>
<template>
  <div class="wrapper" v-if="$route.path == '/'">
    <img
      @click="this.$router.push({ name: 'main' })"
      class="logo"
      src="../assets/logo.png"
      alt=""
    />
    <nav class="group-nav">
      <li @click="scrollToBottom('services')" class="item-nav">
        {{ $t("services") }}
      </li>
      <li @click="scrollToBottom('equipment')" class="item-nav">
        {{ $t("equipment") }}
      </li>
      <!-- <li @click="scrollToBottom('advantages')" class="item-nav">
        {{ $t("advantages") }}
      </li> -->
      <li @click="scrollToBottom('business')" class="item-nav">
        {{ $t("business") }}
      </li>
      <!-- <li @click="scrollToBottom('faq')" class="item-nav">
        {{ $t("information") }}
      </li> -->
      <li @click="scrollToBottom('test')" class="item-nav">{{ $t("test") }}</li>
    </nav>
    <div class="contacts">
      <a class="number" href="tel: 972 50-8981614">+972 50-8981614</a>
    </div>
    <div class="info" v-if="!id">
      <div class="lan" @click="active = !active">
        <img class="flag" :src="'../assets/' + lang + '.png'" alt="" />
        <span>{{ lang }}</span>
        <img class="arrow" src="../assets/arrow-down.png" alt="" />
        <div class="all_flags" v-if="active">
          <div
            class="group-country"
            @click="changeLang(item)"
            v-for="item in countries"
            :key="item"
          >
            <img class="flag" :src="'../assets/' + item + '.png'" alt="" />
            <span class="group-value">{{ item }}</span>
          </div>
        </div>
      </div>
      <button @click="this.$emit('updateLogin', true)" class="btn login">
        {{ $t("login") }}
      </button>
    </div>
    <div class="info" v-else>
      <div class="lan" @click="active = !active">
        <img class="flag" :src="'../assets/' + lang + '.png'" alt="" />
        <span>{{ lang }}</span>
        <img class="arrow" src="../assets/arrow-down.png" alt="" />
        <div class="all_flags" v-if="active">
          <div
            class="group-country"
            @click="changeLang(item)"
            v-for="item in countries"
            :key="item"
          >
            <img class="flag" :src="'../assets/' + item + '.png'" alt="" />
            <span class="group-value">{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="avatar" @click="this.$router.push({ name: 'profile' })">
        <img v-if="avatar" :src="avatar" alt="" />
        <img v-else src="../assets/profile.png" alt="" />
      </div>
    </div>
  </div>
  <div class="wrapper" v-else>
    <img
      @click="this.$router.push({ name: 'main' })"
      class="logo logoAdap"
      src="../assets/logo.png"
      alt=""
    />
    <span class="main mainAdap"
      ><span>{{ $t("main") }}</span
      ><span>/</span> {{ this.names[this.$route.name] }}</span
    >
    <div class="info">
      <div class="lan" @click="active = !active">
        <img class="flag" :src="'../assets/' + lang + '.png'" alt="" />
        <span>{{ lang }}</span>
        <img class="arrow" src="../assets/arrow-down.png" alt="" />
        <div class="all_flags" v-if="active">
          <div
            class="group-country"
            @click="changeLang(item)"
            v-for="item in countries"
            :key="item"
          >
            <img class="flag" :src="'../assets/' + item + '.png'" alt="" />
            <span class="group-value">{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="avatar" @click="this.$router.push({ name: 'profile' })">
        <img v-if="avatar" :src="avatar" alt="" />
        <img v-else src="../assets/profile.png" alt="" />
      </div>
    </div>
  </div>
  <div class="active-billings" v-if="active_billings">
    <span>{{ $t("warning") }}</span>
    <button class="btn goPay" @click="this.$router.push({ name: 'mypayments' })">
      {{ $t("goPay") }}
    </button>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  min-height: 80px;
  display: flex;
  gap: 30px;
  align-items: center;
  padding: 0 40px;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 0px;
}

.active-billings {
  width: 100%;
  padding: 5px 10px;
  background-color: #cf0032;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active-billings span {
  color: #fff;
}

.logo {
  height: 60px;
  cursor: pointer;
}

.flag {
  height: 14px;
}

.contacts img {
  height: 28px;
  width: 28px;
  cursor: pointer;
}

.group-nav {
  display: flex;
  align-items: center;
  gap: 7px;
  list-style: none;
}

.item-nav {
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  padding-left: 16px;
  cursor: pointer;
}

.contacts {
  display: flex;
  align-items: center;
  gap: 15px;
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
  transform: translateY(70px);
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px 0 #00000037;
  z-index: 3;
  min-width: 57px;
}

.group-country {
  display: flex;
  align-items: center;
  gap: 6px;
}

.login {
  background-color: #cf0032;
  padding: 7px 20px;
  border-radius: 5px;
  color: #fff;
}

.arrow {
  height: 20px;
  width: 20px;
}

.item-nav::after {
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
.item-nav:hover:after,
.item-nav:focus:after {
  width: 100%;
}

.main {
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
  color: #0f0f0f;
  display: flex;
  align-items: center;
  gap: 10px;
}

.main span {
  opacity: 30%;
}

.avatar {
  border-radius: 45px;
  overflow: hidden;
  cursor: pointer;
}

.avatar img {
  height: 52px;
  width: 52px;
  object-fit: cover;
}

.info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logoAdap {
  display: none;
}

.goPay {
  color: #fff;
  border: 1px solid #fff;
}

.number {
  direction: ltr !important;
  color: #272727;
  margin-left: 30px;
}
@media (max-width: 1000px) {
}

@media (max-width: 1000px) {
  .group-nav {
    display: none;
  }
  .number {
    display: none;
  }
  .login {
    padding: 7px 12px;
  }
}

@media (max-width: 768px) {
  .logoAdap {
    display: block;
  }
  .mainAdap {
    display: none;
  }
  .number {
    display: none;
  }
}

@media (max-width: 650px) {
  .number {
    display: none;
  }

  .wrapper {
    gap: 10px;
    padding: 0 15px;
  }
}

@media (max-width: 576px) {
  .contacts {
    display: none;
  }
}

@media (max-width: 472px) {
  .contacts {
    width: fit-content;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .wrapper {
    padding: 0 7px !important;
  }

  .logo {
    height: 45px;
  }
}

@media (max-width: 420px) {
  .avatar img {
    height: 32px;
    width: 32px;
  }

  .contacts img {
    height: 18px;
    width: 18px;
  }

  .arrow {
    height: 12px;
    width: 12px;
  }

  .lan span {
    font-size: 14px;
  }
}
</style>
