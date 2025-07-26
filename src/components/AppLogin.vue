<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  name: "AppLogin",
  components: { LoadingSpinner },
  data() {
    return {
      email: "",
      emailFill: false,
      password: "",
      passFill: false,
      auth: false,
      code: "",
      codeFill: false,
      message: "",
      isLoading: false,
      reg: null,
    };
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateLogin", false);
    },

    async login() {
      try {
        if (this.email && this.password) {
          this.isLoading = true;
          this.emailFill = false;
          this.passFill = false;
          let response = await axios.post(`/auth/login`, {
            email: this.email,
            password: this.password,
          });
          let msg = response.data.status;
          if (msg == "ok") {
            this.auth = true;
          } else {
            this.message = this.$t(`${response.data.description}`);
          }
          setTimeout(() => {
            this.message = "";
          }, 2500);
        } else {
          if (!this.email) {
            this.emailFill = true;
          }
          if (!this.password) {
            this.passFill = true;
          }
        }
      } catch (res) {
        console.log(res);
        this.message = "Error";
        this.emailFill = true;
        this.passFill = true;
        setTimeout(() => {
          this.message = "";
        }, 2500);
      } finally {
        this.isLoading = false;
      }
    },

    async verify() {
      try {
        if (this.code) {
          this.isLoading = true;
          this.codeFill = false;
          let response = await axios.post(`/auth/verify_totp`, {
            email: this.email,
            otp: this.code,
          });
          let status = response.status;

          if (status == 200) {
            let id = response.data.id;
            let token = response.data.token;
            localStorage.setItem("id", id);
            localStorage.setItem("token", token);
            this.message = this.$t("success");
            setTimeout(() => {
              this.message = "";
              this.$emit("sliderVerify", false);
            }, 3000);
          } else {
            console.log(response);
          }
        } else {
          this.codeFill = true;
        }
      } catch (res) {
        let response = res.response.data.detail;
        console.log(response);
        this.message = "Неверный код";
        this.codeFill = true;
        setTimeout(() => {
          this.message = "";
        }, 2500);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.reg = JSON.parse(localStorage.getItem('content')).reg;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
};
</script>
<template>
  <div class="wrapper">
    <LoadingSpinner v-if="isLoading" />
    <div class="card" v-if="!auth">
      <div class="cancel">
        <span class="title">{{ $t("login") }}</span>
        <img @click="cancel" src="../assets/close.png" alt="" />
      </div>
      <div class="group">
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          :placeholder="$t('enterEmail')"
          :class="{
            nofillBorder: emailFill,
          }"
        />
        <span
          class="group-value"
          :class="{
            nofillText: emailFill,
          }"
          >Email</span
        >
      </div>
      <div class="group">
        <input
          type="password"
          name="pass"
          v-model="password"
          :placeholder="$t('enterPass')"
          :class="{
            nofillBorder: passFill,
          }"
        />
        <span
          class="group-value"
          :class="{
            nofillText: passFill,
          }"
          >{{ $t("pass") }}</span
        >
      </div>
      <div class="forget_pass">
        <a @click="this.$emit('updateReset', true)" href="#">{{ $t("forgotPass") }}</a>
      </div>
      <button v-if="!message" @click="login" class="btn">
        {{ $t("login") }}
      </button>
      <div
        class="msg"
        :class="{
          success:
            this.message == 'Успешно' ||
            this.message == 'Success' ||
            this.message == 'בהצלחה',
          error:
            this.message != 'Успешно' &&
            this.message != 'Success' &&
            this.message != 'בהצלחה',
        }"
        v-if="message"
      >
        {{ message }}
      </div>
      <div class="log" v-if="this.reg === true">
        <span>{{ $t("notRegister") }}</span>
        <a @click="this.$emit('updateRegister', true)" href="#">{{ $t("register") }}</a>
      </div>
    </div>
    <div class="card" v-else>
      <div class="cancel">
        <span class="title">{{ $t("confirmation") }}</span>
        <img @click="cancel" src="../assets/close.png" alt="" />
      </div>
      <div class="group">
        <input
          type="text"
          name="code"
          v-model="code"
          :placeholder="$t('enterCode')"
          :class="{
            nofillBorder: codeFill,
          }"
        />
        <span
          class="group-value"
          :class="{
            nofillText: codeFill,
          }"
          >{{ $t("emailCode") }} email</span
        >
      </div>
      <button @click="verify" v-if="!message" class="btn">
        {{ $t("login") }}
      </button>
      <div
        class="msg"
        :class="{
          success:
            this.message == 'Успешно' ||
            this.message == 'Success' ||
            this.message == 'בהצלחה',
          error:
            this.message != 'Успешно' &&
            this.message != 'Success' &&
            this.message != 'בהצלחה',
        }"
        v-if="message"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  position: absolute;
  height: 100vh;
  width: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 32px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #fff;
  min-width: 350px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  line-height: 28.8px;
  color: #000;
}

.desc {
  opacity: 80%;
  font-weight: 500;
  font-size: 16px;
  line-height: 22.4px;
}

.btn {
  width: 100%;
  background-color: #cf0032;
  border-radius: 10px;
  padding: 17px 24px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  outline: none;
}

.log {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.log span,
a {
  font-weight: 500;
  font-size: 14px;
  line-height: 19.6px;
}

a {
  color: #cf0032;
}

.cancel {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel img {
  cursor: pointer;
  height: 24px;
  width: 24px;
}

input {
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;
}

input::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}

.forget_pass {
  text-align: end;
}

.group {
  position: relative;
}

.group-value {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  left: 12px;
  background-color: #fff;
  padding: 0 4px;
  color: #a5a5a5;
  font-weight: 500;
  font-size: 10px;
  line-height: 13.66px;
}

.card:hover {
  cursor: auto;
  transform: none;
}

.nofillBorder {
  border: 1px solid #cf0032;
}

.nofillText {
  color: #cf0032;
}
</style>
