<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  name: "AppRegister",
  components: { LoadingSpinner },
  data() {
    return {
      name: "",
      nameFill: false,
      surname: "",
      surnameFill: false,
      password: "",
      passFill: false,
      password2: "",
      pass2Fill: false,
      number: "+972",
      numberFill: false,
      email: "",
      emailFill: "",
      message: "",
      isLoading: false,
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.number ? this.number.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    cancel() {
      document.body.style.overflow = "auto";
      this.$emit("updateRegister", false);
    },

    async login() {
      try {
        if (
          this.name &&
          this.surname &&
          this.password &&
          this.number.length > 11 &&
          this.email
        ) {
          (this.nameFill = false),
            (this.surnameFill = false),
            (this.passFill = false),
            (this.numberFill = false),
            (this.emailFill = false);
          this.isLoading = true;
          let response = await axios.post(`/auth/register`, {
            firstname: this.name,
            lastname: this.surname,
            email: this.email,
            password: this.password,
            phone: this.number,
          });
          let status = response.status;
          console.log(response);
          if (status == "200") {
            this.message = this.$t("success");
          }
          setTimeout(() => {
            this.message = "";
            this.$emit("updateRegister", false);
          }, 3000);
        } else {
          if (!this.name) {
            this.nameFill = true;
          }
          if (!this.surname) {
            this.surnameFill = true;
          }
          if (!this.password) {
            this.passFill = true;
          }
          if (this.number.length < 11) {
            this.numberFill = true;
          }
          if (!this.email) {
            this.emailFill = true;
          }
        }
      } catch (err) {
        console.log(err.response.data.detail);
        if (err.response.data.detail == "User already exists") {
          this.message = "Пользователь с такими данными уже существует";
          (this.nameFill = true),
            (this.surnameFill = true),
            (this.passFill = true),
            (this.pass2Fill = true),
            (this.numberFill = true),
            (this.emailFill = true);
          setTimeout(() => {
            this.message = "";
          }, 3000);
        }
      } finally {
        this.isLoading = false;
      }
    },
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.number = input;
      e.target.value = this.formatPhoneNumber;
    },
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
  },
};
</script>
<template>
  <div class="wrapper">
    <LoadingSpinner v-if="isLoading" />
    <div class="card">
      <div class="cancel">
        <span class="title">{{ $t("registration") }}</span>
        <img @click="cancel" src="../assets/close.png" alt="" />
      </div>
      <div class="group">
        <input
          type="text"
          name="name"
          v-model="name"
          :placeholder="$t('enterName')"
          :class="{ nofillBorder: nameFill }"
        />
        <span class="group-value" :class="{ nofillText: nameFill }">{{
          $t("name")
        }}</span>
      </div>
      <div class="group">
        <input
          type="text"
          name="surname"
          v-model="surname"
          :placeholder="$t('enterSurname')"
          :class="{ nofillBorder: surnameFill }"
        />
        <span class="group-value" :class="{ nofillText: surnameFill }">{{
          $t("surname")
        }}</span>
      </div>
      <div class="group">
        <input
          type="email"
          name="email"
          v-model="email"
          :placeholder="$t('enterEmail')"
          :class="{ nofillBorder: emailFill }"
        />
        <span class="group-value" :class="{ nofillText: emailFill }"
          >Email</span
        >
      </div>
      <div class="group">
        <input
          :value="formatPhoneNumber"
          @input="updateValue($event)"
          type="tel"
          size="20"
          required
          name="number"
          placeholder="+972"
          :class="{ nofillBorder: numberFill }"
        />
        <span class="group-value" :class="{ nofillText: numberFill }">{{
          $t("phone")
        }}</span>
      </div>
      <div class="group">
        <input
          type="password"
          name="password"
          v-model="password"
          :placeholder="$t('enterPass')"
          :class="{ nofillBorder: passFill }"
        />
        <span class="group-value" :class="{ nofillText: passFill }">{{
          $t("pass")
        }}</span>
      </div>
      <!-- <div class="group">
        <input
          type="password"
          name="password2"
          v-model="password2"
          placeholder="Повторите пароль"
        />
        <span class="group-value">Пароль</span>
      </div> -->
      <button @click="login" v-if="!message" class="btn">
        {{ $t("register") }}
      </button>
      <div
        class="msg"
        :class="{
          success: this.message == 'Успешно',
          error: this.message != 'Успешно',
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
  min-width: 450px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 32px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #fff;
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

.msg {
  padding: 10px 13px;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  border-radius: 15px;
  width: fit-content;
  margin: 0 auto;
}

.success {
  background-color: #45ed0b;
}

.error {
  background-color: #cf0032;
}

.nofillBorder {
  border: 1px solid #cf0032;
}

.nofillText {
  color: #cf0032;
}

@media (max-width: 680px) {
  .card {
    gap: 12px;
    min-width: 340px;
    padding: 20px;
  }
}
</style>
