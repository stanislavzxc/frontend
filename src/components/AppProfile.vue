<script>
import axios from "axios";
import Qrcode from "qrcode.vue";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  name: "AppProfile",
  components: { Qrcode, LoadingSpinner },
  data() {
    return {
      active: 2,
      profiletype: "",
      image: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      country: "",
      address: "",
      inn: "",
      telegram: "",
      old_password: "",
      new_password: "",
      new_password2: "",
      code_2fa: "",
      wallet: "",
      walletNew: "",
      otp: "",
      countries: [],
      status: "",
      message: "",
      message2: "",
      message3: "",
      message4: "",
      message5: "",
      messageWallet: "",
      mfa_url: "",
      confirm2fa: false,
      mfa: false,
      isLoading: false,
      otp2: "",
    };
  },
  computed: {
    formatPhoneNumber() {
      return this.phone ? this.phone.replace(/[^+\d]/g, "") : "";
    },
  },
  methods: {
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (input.length > 12) {
        input = input.slice(0, 12);
      }
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.phone = input;
      e.target.value = this.formatPhoneNumber;
    },

    async load_info() {
      try {
        this.isLoading = true;
        let res = await axios.get(`/users/countries`);
        this.countries = res.data;
        let response = await axios.get(`/users/${localStorage.getItem("id")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        this.email = response.data.user.email;
        this.phone = response.data.user.phone;
        this.firstname = response.data.user.firstname;
        this.lastname = response.data.user.lastname;
        this.country = response.data.user.country;
        this.profiletype = response.data.user.profileType;
        this.inn = response.data.user.inn;
        this.address = response.data.user.address;
        this.telegram = response.data.user.telegram;
        this.wallet = response.data.user.wallet;
        this.mfa = response.data.user.mfa_enabled;
        if (response.data.user.image) {
          this.image = response.data.user.image.url;
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile() {
      try {
        let response = await axios.post(
          "/users/updateProfile",
          {
            id: localStorage.getItem("id"),
            firstname: this.firstname,
            lastname: this.lastname,
            profiletype: this.profiletype,
            email: this.email,
            phone: this.phone,
            country: this.country,
            address: this.address,
            inn: this.inn,
            telegram: this.telegram,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.message = response.data.message;
        if (this.message == "ok") {
          this.message = this.$t("success");
        } else {
          this.message = "Ошибка";
        }
        setTimeout(() => {
          this.message = "";
          this.load_info();
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },

    async updatePassword() {
      try {
        if (this.new_password == this.new_password2) {
          let response = await axios.post(
            `/users/update/password`,
            {
              old_password: this.old_password,
              new_password: this.new_password,
              otp: this.otp,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          this.message2 = response.data.status;
          if (this.message2 == "ok") {
            this.message2 = this.$t("success");
          }
        } else {
          this.message2 = "Пароли не совпадают!";
        }
      } catch (err) {
        console.log(err);
        this.message2 = err.data.description;
      }
    },

    async getmfa() {
      try {
        if (this.password) {
          let response = await axios.get(
            `/auth/getmfa?password=${this.password}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          this.mfa_url = response.data.mfa_url;
        } else {
          this.message5 = "Введите пароль";
          setTimeout(() => {
            this.message5 = "";
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        this.message5 = "Пароль неверный";
        setTimeout(() => {
          this.message5 = "";
        }, 3000);
      }
    },

    async enablemfa() {
      try {
        if (this.code_2fa) {
          let response = await axios.post(
            `/auth/enablemfa?otp=${this.code_2fa}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          this.message3 = response.data.message;
          if (this.message3 == "ok") {
            this.message3 = this.$t("success");
            this.load_info();
          }
        }
      } catch (err) {
        console.log(err);
        this.message3 = "Неверный код";
        setTimeout(() => {
          this.message3 = "";
        }, 3000);
      }
    },

    authComfirm() {
      this.confirm2fa = true;
      this.mfa_url = "";
    },

    async setWallet() {
      try {
        let response = await axios.post(
          `/users/setWallet`,
          {
            wallet: this.walletNew,
            otp: this.otp,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.message4 = response.data.status;
        if (this.message4 == "ok") {
          this.message4 = this.$t("success");
          setTimeout(() => {
            this.message4 = "";
            this.otp = "";
            this.load_info();
          }, 3000);
        }
        setTimeout(() => {
          this.message4 = "";
          this.otp = "";
          this.walletNew = "";
        }, 3000);
      } catch (err) {
        console.log(err);
        this.message4 = this.$t("success");
        setTimeout(() => {
          this.message4 = "";
          this.otp = "";
        }, 3000);
      }
    },

    exit() {
      localStorage.clear();
      this.checkToken();
    },

    checkToken() {
      let token = localStorage.getItem("token");
      if (!token) {
        this.$router.push({ name: "home" });
      }
    },

    goChange(b) {
      this.$emit("updateAvatar", b);
    },

    async deleteWallet() {
      try {
        if (this.otp2) {
          let response = await axios.post(
            `/users/wallet/delete`,
            {
              otp: this.otp2,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response);
          if (response.status == "200") {
            this.messageWallet = this.$t("success");
            setTimeout(() => {
              this.messageWallet = "";
              this.load_info();
            }, 2500);
          }
        } else {
          this.messageWallet = this.$t("enterCode");
          setTimeout(() => {
            this.messageWallet = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
        this.messageWallet = err.data.description;
      }
    },
  },
  mounted() {
    document.body.style.overflow = "auto";
    this.load_info();
    this.checkToken();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <h2>{{ $t("profile") }}</h2>
    <div class="wrap_btns">
      <button
        @click="this.active = 1"
        class="btn"
        :class="{ active: this.active == 1 }"
      >
        {{ $t("personalInfo") }}
      </button>
      <button
        @click="this.active = 2"
        class="btn"
        :class="{ active: this.active == 2 }"
      >
        Google 2Fa
      </button>
      <button
        @click="this.active = 3"
        class="btn"
        :class="{ active: this.active == 3 }"
      >
        {{ $t("walletPayments") }}
      </button>
    </div>
    <div class="info" v-if="active == 1">
      <div class="personal">
        <h3>{{ $t("personalData") }}</h3>
        <div class="personal_info">
          <div class="group-avatar">
            <img class="avatar" v-if="image" :src="image" alt="" />
            <img class="avatar" v-else src="../assets/profile.png" alt="" />
            <span class="change_avatar" @click="goChange(true)">{{
              $t("changePhoto")
            }}</span>
          </div>
          <div class="group">
            <select v-model="profiletype" id="">
              <option value="id">{{ $t("individual") }}</option>
              <option value="business">{{ $t("bisnes") }}</option>
            </select>
            <span class="group-value">{{ $t("typeProfile") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="firstname"
              v-model="firstname"
              :placeholder="$t('enterName')"
            />
            <span class="group-value">{{ $t("name") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="lastname"
              v-model="lastname"
              :placeholder="$t('enterSurname')"
            />
            <span class="group-value">{{ $t("surname") }}</span>
          </div>
          <div class="group">
            <input
              type="email"
              name="email"
              v-model="email"
              :placeholder="$t('enterEmail')"
            />
            <span class="group-value">Email</span>
          </div>
          <div class="group">
            <input
              :value="formatPhoneNumber"
              @input="updateValue($event)"
              type="tel"
              size="20"
              maxlength="12"
              required
              name="number"
              placeholder="+7"
            />
            <span class="group-value">{{ $t("phone") }}</span>
          </div>
          <div class="group">
            <select v-model="country">
              <option
                v-for="item in countries"
                :value="item.short_code"
                :key="item.id"
              >
                {{ item.name }}
              </option>
            </select>
            <span class="group-value">{{ $t("country") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="address"
              v-model="address"
              :placeholder="$t('enterAddress')"
            />
            <span class="group-value">{{ $t("address") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="inn"
              v-model="inn"
              :placeholder="$t('enterInn')"
            />
            <span class="group-value">{{ $t("inn") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="telegram"
              v-model="telegram"
              :placeholder="$t('enterTelegram')"
            />
            <span class="group-value">Telegram</span>
          </div>
          <button v-if="!this.message" class="btn" @click="updateProfile">
            {{ $t("refreshInfo") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.message == 'Успешно',
              error: this.message == 'Ошибка',
            }"
            v-if="message"
          >
            {{ message }}
          </div>
        </div>
        <button @click="exit()" class="btn exit">{{ $t("exit") }}</button>
      </div>
      <div class="pass">
        <h3>{{ $t("changePass") }}</h3>
        <div class="pass_info">
          <div class="group">
            <input
              type="password"
              name="password"
              v-model="old_password"
              :placeholder="$t('enterPass')"
            />
            <span class="group-value">{{ $t("oldPass") }}</span>
          </div>
          <div class="group">
            <input
              type="password"
              name="password"
              v-model="new_password"
              :placeholder="$t('enterNewPassword')"
            />
            <span class="group-value">{{ $t("newPass") }}</span>
          </div>
          <div class="group">
            <input
              type="password"
              name="password2"
              v-model="new_password2"
              :placeholder="$t('enterNewPassAgain')"
            />
            <span class="group-value">{{ $t("passAgain") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="code"
              v-model="otp"
              :placeholder="$t('enterCode')"
            />
            <span class="group-value">{{ $t("code2fa") }}:</span>
          </div>
          <button class="btn" v-if="!message2" @click="updatePassword">
            {{ $t("changePass") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.message2 == 'Успешно',
              error: this.message2 == 'Пароли не совпадают!',
            }"
            v-if="message2"
          >
            {{ message2 }}
          </div>
        </div>
      </div>
    </div>
    <div class="fa2" v-if="active == 2 && !mfa_url && !mfa">
      <div class="open" v-if="!confirm2fa && !mfa">
        <h3>1. {{ $t("openGoogle") }}</h3>
        <div class="open_info">
          <p class="text">
            {{ $t("google2fa") }}
          </p>
          <div class="group">
            <input
              type="password"
              name="password"
              v-model="password"
              :placeholder="$t('enterCurrentPass')"
            />
            <span class="group-value">{{ $t("pass") }}</span>
          </div>
          <button @click="getmfa" type="button" class="btn" v-if="!message5">
            {{ $t("getQr") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.message5 == 'Успешно',
              error: this.message5 != 'Успешно',
            }"
            v-if="message5"
          >
            {{ message5 }}
          </div>
        </div>
      </div>
      <div class="confirmation" v-if="confirm2fa">
        <h3>2. {{ $t("confirCode2fa") }}</h3>
        <div class="confirmation_info">
          <p class="text">
            {{ $t("enterCode2fa") }}
          </p>
          <div class="group">
            <input
              type="text"
              name="code_2fa"
              v-model="code_2fa"
              :placeholder="$t('enterCode')"
            />
            <span class="group-value">{{ $t("code2fa") }}:</span>
          </div>
          <button v-if="!message3" type="button" class="btn" @click="enablemfa">
            {{ $t("enable2fa") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.message3 == 'Успешно',
              error: this.message3 == 'Неверный код',
            }"
            v-if="message3"
          >
            {{ message3 }}
          </div>
        </div>
      </div>
    </div>
    <div class="qr" v-if="mfa_url && !confirm2fa && !mfa">
      <span>{{ $t("scanQr") }}</span>
      <qrcode class="qrcode" :value="mfa_url"></qrcode>
      <a :href="mfa_url">{{ mfa_url }}</a>
      <button @click="authComfirm" type="button" class="btn">
        {{ $t("continue") }}
      </button>
    </div>
    <div class="enabled" v-if="mfa && active == 2">
      <img src="../assets/enabled.png" alt="" />
      <span>{{ $t("connected2fa") }}</span>
      <button
        v-if="mfa"
        class="btn exit"
        @click="this.$emit('updateDeleteAuth', true)"
      >
        {{ $t("disable2fa") }}
      </button>
    </div>
    <div class="wallet" v-if="active == 3">
      <div class="current_wallet" v-if="wallet">
        <h3>{{ $t("currentWallet") }}</h3>
        <div class="wallet_info">
          <div class="group">
            <input type="text" name="wallet" v-model="wallet" placeholder="" />
            <span class="group-value">{{ $t("wallet") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="code"
              v-model="otp2"
              :placeholder="$t('enterCode')"
            />
            <span class="group-value">{{ $t("code2fa") }}:</span>
          </div>
          <button v-if="!messageWallet" @click="deleteWallet" class="btn">
            {{ $t("delete") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.messageWallet == $t('success'),
              error: this.messageWallet != $t('success'),
            }"
            v-if="messageWallet"
          >
            {{ messageWallet }}
          </div>
        </div>
      </div>
      <div class="connect_wallet" v-if="!wallet">
        <h3>{{ $t("connectWallet") }}</h3>
        <div class="connect_info">
          <div class="group">
            <input
              type="text"
              name="walletNew"
              v-model="walletNew"
              :placeholder="$t('newWallet')"
            />
            <span class="group-value">{{ $t("addWallet") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="code"
              v-model="otp"
              :placeholder="$t('enterCode')"
            />
            <span class="group-value">{{ $t("code2fa") }}:</span>
          </div>
          <button v-if="!message4" @click="setWallet" class="btn">
            {{ $t("add") }}
          </button>
          <div
            class="msg"
            :class="{
              success: this.message4 == $t('success'),
              error: this.message4 != $t('success'),
            }"
            v-if="message4"
          >
            {{ message4 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
}

.wrap_btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info,
.fa2,
.wallet {
  display: flex;
  gap: 30px;
}

.personal,
.pass,
.connect_wallet,
.current_wallet,
.open,
.confirmation {
  flex: 50%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.personal_info,
.pass_info,
.wallet_info,
.connect_info,
.open_info,
.confirmation_info {
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #fff;
}

.personal_info button,
.pass_info button,
.wallet_info button,
.connect_info button,
.open_info button,
.confirmation_info button {
  background-color: #cf0032;
  color: #fff;
}

input,
select {
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
.btn {
  border-radius: 10px;
  background-color: #fff;
  padding: 14.5px 24px;
  box-shadow: none;
  font-size: 15px;
  line-height: 15px;
  font-weight: 600;
  transition: all 400ms ease;
}

.active {
  background-color: #cf0032;
  color: #fff;
}

.text {
  font-size: 16px;
  line-height: 25.6px;
  color: #000;
  font-weight: 500;
}

h3 {
  font-size: 20px;
  line-height: 20px;
  font-weight: 600;
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

.qr {
  width: 100%;
  background-color: #fff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
  gap: 20px;
}

.qr span {
  font-size: 20px;
  line-height: 20px;
  font-weight: 600;
}

.qr a {
  word-break: break-all;
}

.qr .btn {
  background-color: #cf0032;
  color: #fff;
}

.qrcode {
  width: 200px !important;
  height: 200px !important;
}

.exit {
  background-color: #cf0032;
  color: #fff;
}

.group-avatar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  object-fit: cover;
}

.change_avatar {
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: #cf0032;
  text-decoration: underline;
  cursor: pointer;
}

.enabled {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.enabled img {
  height: 100px;
}

.enabled {
  background-color: #fff;
  padding: 20px 10px;
  border-radius: 20px;
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}

.enabled button {
  margin-top: 20px;
}
@media (max-width: 980px) {
  .info,
  .wallet,
  .fa2 {
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .wrap_btns {
    flex-direction: column;
  }

  .wrap_btns button {
    width: 100%;
  }
}
</style>
