<script>
import axios from "axios";
import AppTestMode from "./AppTestMode.vue";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  name: "BlockBusiness",
  components: {
    AppTestMode,
    LoadingSpinner
  },
  data() {
    return {
      isloading: false,
      id: null,
      phone: "",
      name: "",
      isModalVisible: false,
      nameOfBusiness: "",
      currentColor: null,
      cost: "",
      istestmode: null,
      token:'',
      content: {
        data: [], // бизнесы
        miners_items: [], // майнеры
      },
      cards: [], // карточки будут формироваться динамически
    };
  },
  methods: {
    async load_info() {
      try {
        let response = await axios.get(`/miners/get/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("BUSINESS", response);
        this.cards = response.data.miners_items.slice(0, 3);
        this.cards[0].color = "red";
        this.cards[1].color = "grey";
        this.cards[2].color = "orange";
      } catch (err) {
        console.log(err);
      }
    },
    goMarket() {
      let token = localStorage.getItem("token");
      if (token) {
        this.$router.push("marketplace");
      } else {
        this.$emit("updateLogin", true);
      }
    },
    businessRequest(color) {
      this.currentColor = color;
      this.setname();
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    setname() {
      if (this.currentColor == "red") {
        this.nameOfBusiness = "beginer";
        this.cost = this.cards[0]?.price || "";
      } else if (this.currentColor == "grey") {
        this.nameOfBusiness = "advanced";
        this.cost = this.cards[1]?.price || "";
      } else if (this.currentColor == "orange") {
        this.nameOfBusiness = "investor";
        this.cost = this.cards[2]?.price || "";
      } else {
        this.nameOfBusiness = "";
        this.cost = "";
      }
    },
    async SendbusinessRequest() {
      this.setname();
      const url = `feedbacks/create`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };
      const data = {
        name: this.name,
        phone: this.phone,
      };
      try {
        const response = await axios.post(url, data, { headers });
        console.log(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      this.closeModal();
    },
    async fetchUsers() {
      if (!this.id) return;
      const url = `users/${this.id}`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        this.phone = response.data.user.phone;
        this.name = response.data.user.firstname + " " + response.data.user.lastname;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async businessData() {
      this.isloading = true;
      const url = "/miners/business";
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };
      try {
        const response = await axios.get(url, { headers });
        console.log("Business data:", response);
        this.content.data = response.data[0] || [];
        this.generateCardsFromBusiness();
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    },
    async getIsTestmode() {
      this.isloading = true;
      const url = `/users/${this.id}`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      try {
        const response = await axios.get(url, { headers });
        this.istestmode = response.data.user.testmode;
        console.log(response.data, 'asdf');
        this.generateCardsFromBusiness();
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    },
    async minerData() {
      const url = "/miners/get/all";
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };
      try {
        const response = await axios.get(url, { headers });
        console.log("Miners data:", response);
        this.content.miners_items = response.data.miners_items || [];
        this.generateCardsFromBusiness();
      } catch (error) {
        console.error("Error fetching miners data:", error);
      }
    },
    generateCardsFromBusiness() {
      const business = this.content.data;
      const miners = this.content.miners_items;

      const cards = [];

      for (let i = 1; i <= 3; i++) {
        const minerName = business[`miner${i}`];
        if (!minerName) continue;

        // Найти майнера по имени
        const miner = miners.find((m) => m.name === minerName);
        if (!miner) continue;

        cards.push({
          type: this.$t(["beginer", "advanced", "investor"][i - 1]),
          price: business[`cost${i}`] || miner.price || "",
          name: miner.name,
          hash_rate: miner.hash_rate || (miner.hash_rate ? `${miner.hash_rate} TH/s` : "—"),
          profit: miner.profit || miner.income || 0,
          energy_consumption: miner.energy_consumption || 0,
          payback: miner.payback || "—",
          hosting: miner.hosting ? `$${miner.hosting}` : "—",
          img: "asic", // можно заменить на miner.image.path если нужно
          count: business[`count${i}`] || "0",
          color: ["red", "grey", "orange"][i - 1],
          discount_value: business[`hosting_discount${i}`] || 0,
          income: miner.income || 0,
          payback_percent: miner.payback_percent || 0,
        });
      }
      this.isloading = false;
      this.cards = cards;
    },
  },
  async mounted() {
    this.id = localStorage.getItem("id") || null;
    await this.getIsTestmode();
    await this.fetchUsers();
    await this.businessData();
    await this.minerData();
    this.token = localStorage.getItem('token')
  },
};
</script>

<template>
  <LoadingSpinner v-if="isLoading"/>
  <div id="modalwindow" v-if="isModalVisible && !isLoading && token"  class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="titletext">{{ $t("businessreg") }}</h1>
        <span class="close" @click="closeModal">&times;</span>
      </div>
      <h1 class="titletexttwo">{{ $t("plan") }} "{{ $t(nameOfBusiness) }}"</h1>
      <p class="cost">${{ cost }}</p>
      <div class="confirmPay-container">
        <input type="checkbox" id="confirmPayCheckbox" disabled checked />
        <label for="confirmPayCheckbox" class="confirmPay">{{ $t("confirmPay") }}</label>
      </div>
      <p class="lastsay">{{ $t("lastsay") }}</p>
      <button class="btn btnsend" @click="SendbusinessRequest($t('readyBusiness'))">
        {{ $t("sendbusiness") }}
      </button>
    </div>
  </div>
  <div class="wrapper">
    <AppTestMode v-if="this.$route.path === '/ReadyBusiness' && !istestmode"/>
    <h2>{{ $t("readyBusiness") }}</h2>
    <div class="cards">
      <div
        class="card"
        :class="{
          red: card.color == 'red',
          grey: card.color == 'grey',
          orange: card.color == 'orange',
        }"
        v-for="card in cards"
        :key="card"
        @click="this.$emit('updateFormFeedback', true)"
      >
        <div class="info">
          <div class="title">{{ card.type }}</div>
          <div class="main-info">
            <div class="group">
              <span class="group-name">{{ $t("hash") }}:</span>
              <span class="group-value">{{ card.hash_rate }} TH</span>
            </div>
            <div class="group">
              <span class="group-name">{{ $t("dohod") }}:</span>
              <span class="group-value">${{ card.income }}/{{ $t("dayOne") }}</span>
            </div>
            <div class="group">
              <span class="group-name">{{ $t("rashod") }}:</span>
              <span class="group-value"
                >{{ card.energy_consumption }} {{ $t("wt") }}</span
              >
            </div>
            <div class="group">
              <span class="group-name">{{ $t("hosting") }}:</span>
              <span class="group-value">{{ card.hosting }}</span>
              <span class="group-value discount">-{{ card.discount_value }}%</span>
            </div>

            <div class="group">
              <span class="group-name">{{ $t("model_name") }}:</span>
              <span class="group-value">{{ card.name }}</span>
            </div>
            <div class="group">
              <span class="group-name">{{ $t("count") }}:</span>
              <span class="group-value">{{ card.count }}</span>
            </div>
          </div>
        </div>
        <div class="parent">
          <div class="wrap-scale">
            <div
              class="scale"
              :style="'width: ' + (100 - card.payback_percent) + '%'"
            ></div>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("time_profit") }}:</span>
            <span class="group-value">{{ card.payback }} {{ $t('months') }}</span>
          </div>
        </div>
        <div class="order">
          <div class="price">${{ card.price }}</div>
          <button class="btn" @click="businessRequest(card.color)">
            {{ $t("order") }}
          </button>
        </div>
        <img class="asic" src="../assets/asic_business.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  position: relative;
  display: block;
}
.scale {
  position: absolute;
  right: 0;
  height: 6px;
  background-color: #a9a9a9;
}

.wrap-scale {
  position: relative;
  width: 20%;
  border-radius: 10px;
  height: 6px;
  background: linear-gradient(to right, #e11111 0%, #ecf02b 50%, #2ee111 100%);
  overflow: hidden;
  margin: 5px 0px;
}
.discount {
  padding: 4px 6px;
  border-radius: 5px;
  background-color: #25d366;
}
.btnsend {
  width: 90% !important;
  display: flex;
  justify-content: center;
}
.modal-content * {
  padding-top: 5px;
}
.lastsay {
  font-size: 14px;
  line-height: 140%;
  font-weight: 400;
  letter-spacing: 0%;
  color: #00000066;
}
.confirmPay-container {
  display: flex;
  align-items: center;
}

.confirmPay-container input[type="checkbox"] {
  display: none;
}

.confirmPay-container::before {
  content: "✔";
  width: 20px;
  height: 20px;
  border: 2px solid #cf0032;
  border-radius: 4px;
  margin-right: 8px;
  background-color: #cf0032;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: none;
}

.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 15px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}

.confirmPay-container {
  display: flex;
  align-items: center;
}

.confirmPay {
  margin-left: 8px;
}
.cost {
  font-size: 32px;
  line-height: 100%;
  font-weight: 700;
  letter-spacing: 0%;
  color: #272727;
}
.titletext {
  font-size: 24px;
  line-height: 120%;
  font-weight: 700;
  letter-spacing: 0%;
  color: #000000;
}
.titletexttwo {
  font-size: 20px;
  line-height: 120%;
  font-weight: 700;
  letter-spacing: 0%;
  color: #272727;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fefefe;
  border-radius: 20px;
  padding: 32px;
  position: relative;
  width: 33%;
  width: 33%;
}
@media screen and (min-width: 500px) and (max-width: 810px) {
  .modal-content{
    width:60% !important;
  } 
}

@media (max-width: 500px) {
  .modal-content{
    width:90% !important;
  } 
}

.wrapper {
  width: 100%;
  margin-top: 40px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cards {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  width: 100%;
  position: relative;
  padding: 40px;
  border-radius: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  max-height: auto;
}

.card:hover {
  transform: scale(1.02);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-info {
  width: 100%;
  max-width: 618px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.order {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 24px;
  line-height: 100%;
  font-weight: 800;
  text-transform: uppercase;
  color: #fff;
}

.main .title {
  color: #fff;
}

.red {
  background-image: url("../assets/red_bg.svg");
}

.grey {
  background-image: url("../assets/grey_bg.svg");
}

.orange {
  background-image: url("../assets/orange_bg.svg");
}

.main .group-value {
  color: #fff;
}

.group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.group-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
  opacity: 60%;
}

.main .group-name {
  color: #fff;
  opacity: 60%;
}

.group-value {
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
}

.btn {
  width: 240px;
  border-radius: 10px;
  padding: 12px 17px;
  color: #fff;
  background-color: #cf0032;
}

.price {
  font-weight: 700;
  font-size: 32px;
  line-height: 100%;
  color: #fff;
}

.main .price {
  color: #fff;
}
.asic {
  width: 70%;
  position: absolute;
  right: -20%;
  bottom: -80px;
}

@media screen and (min-width: 500px) and (max-width: 810px) {
  .card {
    padding: 20px;
  }
  .asic {
    width: 70%;
    position: absolute;
    right: -25%;
    bottom: -50px;
  }
  .main_info {
    gap: 10px;
  }

  .title {
    font-size: 28px;
    line-height: 28px;
  }

  .price {
    font-size: 26px;
    line-height: 26px;
  }
}

@media (max-width: 500px) {
  .card {
    padding: 20px;
    height: 500px;
    gap: 10px;
  }
  .asic {
    width: 150%;
    position: relative;
    right: 20%;
    bottom: 10px;
    margin-top: 0px;
    max-width: 200% !important;
  }
  .main_info {
    gap: 10px;
  }
}
.title {
  font-size: 28px;
  line-height: 28px;
}

.price {
  font-size: 26px;
  line-height: 26px;
}
</style>
