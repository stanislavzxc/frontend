<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  data() {
    return {
      cards: [],
      isShow: false,
      firstInput: "",
      secondInput: "",
      selectedFile: null,
      pc: null,
      user: null,
      isLoading: false,
    };
  },
  components: {
    LoadingSpinner,
  },
  methods: {
    async fetchTickets() {
      this.isLoading = true;
      const url = "/tickets/get/all";
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        this.cards = response.data.tickets;
        this.user = response.data.user;
        console.log(response);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async createTickets() {
      this.isLoading = true;
      const url = "/tickets/create";
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };
      const data = {
        title: this.firstInput,
        text: this.secondInput,
      };
      try {
        this.isLoading = true;
        const response = await axios.post(url, data, { headers }); // Use POST for creating tickets
        this.cards = response.data;
        this.fetchTickets();
        this.close();
      } catch (error) {
        console.error("Error creating ticket:", error);
      } finally {
        this.isLoading = false;
      }
    },
    open() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
    },
    triggerFileSelect() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const files = event.target.files || event.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
        console.log("Selected file:", this.selectedFile);
      }
    },
    handleFileDrop(event) {
      this.handleFileSelect(event);
    },
    isDesktop() {
      this.pc = !/Mobi|Android/i.test(navigator.userAgent);
    },
    Dialog(ticket) {
      console.log(ticket.title);

      this.$router.push({
        name: "ticket",
        query: {
          name: ticket.title,
          date: ticket.date,
          id: ticket.id,
          user: "user",
        },
      });
    },
  },
  mounted() {
    this.fetchTickets();
    this.isDesktop();
  },
};
</script>

<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="modal-overlay" v-if="isShow"></div>
    <div class="modal" v-if="isShow">
      <div class="modal-header">
        <h2>{{ $t("ticketNew") }}</h2>
        <button class="close" @click="close()">
          <img src="../assets/close.png" class="imgclose" />
        </button>
      </div>
      <div class="input-container">
        <label for="ticketInput" class="input-label">{{ $t("inputLabel") }}</label>
        <input
          type="text"
          id="ticketInput"
          class="input-field"
          :placeholder="$t('inputPlaceholder')"
          v-model="firstInput"
        />
      </div>
      <div class="input-container">
        <label for="ticketInput" class="input-label">{{ $t("inputLabel2") }}</label>
        <input
          type="text"
          id="ticketInput"
          class="input-field second"
          :placeholder="$t('inputPlaceholder2')"
          v-model="secondInput"
        />
      </div>
      <div
        class="file-drop-area"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleFileDrop"
        @click="triggerFileSelect"
      >
        <input
          type="file"
          ref="fileInput"
          class="file-input"
          @change="handleFileSelect"
        />
        <img src="../assets/File.png" alt="Select file" class="file-icon" />
        <div v-if="!selectedFile">
          <p v-if="pc">{{ $t("dragDropOrClick") }}</p>
          <p class="red">{{ $t("choosefile") }}</p>
        </div>
      </div>
      <button class="btn" @click="createTickets()">{{ $t("ticketCreate") }}</button>
    </div>
    <h2>{{ $t("support") }}</h2>
    <div class="card">
      <p class="card-head">{{ $t("supportNeed") }}?</p>
      <p class="card-body">{{ $t("supportTextCard") }}</p>
      <button class="btn" @click="open()">{{ $t("ticketCreate") }}</button>
    </div>
    <h2>{{ $t("ticketsNow") }}</h2>

    <div v-if="cards.length > 0">
      <div class="card" v-for="card in cards" :key="card.id" @click="Dialog(card)">
        <div class="card-top">
          <p class="card-head">{{ card.title }}</p>
          <p class="card-body">{{ card.date }}</p>
          <p class="isopen" v-if="card.is_open">{{ $t("open") }}</p>
          <p class="closed" v-else>{{ $t("close") }}</p>
        </div>
        <p class="card-body text">{{ card.text }}</p>
        <img src="../assets/ticket_arrow.png" alt="" class="card-arrow" />
      </div>
    </div>
    <div class="card" v-else>
      <p class="card-head">{{ $t("ticketsNo") }}</p>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card {
  width: 100%;
  padding: 25px 30px;
  display: flex;
  align-items: flex-start;
  gap: 0px;
  border-radius: 20px;
  background-color: #fff;
  margin-bottom: 7px;
}
.card:hover {
  transform: scale(1.01);
}
.card-head {
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
}
.card-body {
  padding: 0px;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  width: 70%;
  color: #27272766;
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
.modal {
  width: 400px;
  height: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column; /* Чтобы контент шёл вертикально */
  padding: 20px;
}

.modal-overlay {
  position: fixed; /* Cover the entire viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 999; /* Below the modal */
  display: flex; /* Center the modal */
  justify-content: center;
  align-items: center;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Чтобы кнопка и заголовок были сверху */
  margin-bottom: 20px; /* Отступ снизу */
}

.modal-header h2 {
  margin: 0;
  font-weight: 600;
  font-size: 24px;
  color: #333;
}

.close {
  background: transparent;
  border: none;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  color: #333;
  line-height: 1;
  padding: 0;
  user-select: none;
}

.close:hover {
  color: #cf0032;
}
.imgclose {
  width: 32px;
  height: 32px;
}
.input-container {
  position: relative; /* Позволяет позиционировать метку относительно контейнера */
  margin-bottom: 30px; /* Отступ снизу для разделения с остальным контентом */
}

.input-label {
  position: absolute; /* Позволяет метке располагаться внутри поля ввода */
  top: -10px; /* Сдвигаем метку вверх */
  left: 10px; /* Сдвигаем метку влево */
  background-color: #fff; /* Чтобы метка не накладывалась на рамку */
  padding: 0 5px; /* Добавляем немного отступа вокруг текста */
  font-size: 14px; /* Размер шрифта для метки */
  color: grey; /* Цвет текста метки */
}

.input-field {
  width: 100%; /* Поле ввода занимает всю ширину контейнера */
  padding: 10px; /* Отступ внутри поля ввода */
  border: 1px solid #ccc; /* Рамка вокруг поля ввода */
  border-radius: 5px; /* Скругление углов */
  font-size: 16px; /* Размер шрифта для текста в поле ввода */
  padding: 15px;
}

.input-field:focus {
  border-color: #cf0032; /* Цвет рамки при фокусе */
  outline: none; /* Убираем стандартный контур при фокусе */
}
.second {
  padding: 50px;
}
.file-drop-area {
  width: 100%; /* по ширине как input */
  height: 120px; /* примерно высота двух input */
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 20px;
}
.red {
  color: #cf0032;
}
.file-input {
  display: none; /* или position: absolute; width: 0; height: 0; opacity: 0; */
}
.card-top {
  display: flex;
  gap: 20px;
  width: 95%;
}
.isopen {
  width: auto;
  height: auto;
  border-radius: 38px;
  padding: 6px 14px;
  background-color: #cf00321a;
  color: #cf0032;
  justify-content: flex-end;
}
.closed {
  width: auto;
  height: auto;
  border-radius: 38px;
  padding: 6px 14px;
  background-color: #2727271a;
  color: #272727b2;
}
.card-arrow {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
@media (max-width: 420px) {
  .modal {
    width: 90%;
  }
  .card-top {
    gap: 15px;
  }
  .card-arrow {
    right: 5px;
  }
}
.card-body,
.text {
  white-space: nowrap; /* Запретить перенос строк */
  overflow: hidden; /* Скрыть переполнение */
  text-overflow: ellipsis; /* Добавить многоточие в конце длинного текста */
}
.text {
  color: #272727e5;
  width: 90%;
}
</style>
