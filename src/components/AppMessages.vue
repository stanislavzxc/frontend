<script>
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: "AppTicket",
  data() {
    return {
      ticket_id: "Загрузка...",
      status: "Открыт",
      theme: "Загрузка...",
      client: "Загрузка...",
      client2: "",
      createdAt: "Загрузка...",
      messages: [],
      newMessage: "", // Новое текстовое сообщение
      name: this.$route.query.name,
      date: this.$route.query.date,
      id: this.$route.query.id,
      isloading:false,
    };
  },
  components:{
    LoadingSpinner
  },
  methods: {
    close() {
      this.$router.push({ name: "tech" });
    },
    update_data() {
      this.ticket_id = localStorage.getItem('ticket_id');
      this.status = localStorage.getItem('is_open');
      this.theme = localStorage.getItem('title');
      this.client = localStorage.getItem('firstname');
      this.client2 = localStorage.getItem('lastname');
      this.createdAt = localStorage.getItem('date');
    },
    readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const base64 = await this.readFileAsBase64(file);
        await this.sendBase64Message(base64, file.name);
        this.$refs.fileInput.value = '';
      } catch (error) {
        console.error('Ошибка при чтении файла:', error);
      }
    },
    async sendBase64Message(base64data, filename) {
      const url = '/tickets/messages/create';
      const headers = {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      };

      // Отправляем с префиксом для распознавания
      const data = {
        ticket_id: this.id,
        text: `[file:${filename}]${base64data}`
      };

      try {
        const response = await axios.post(url, data, { headers });
        console.log('Файл в base64 успешно отправлен:', response.data);

        // Добавляем в локальный массив сообщений
        this.messages.push({
          id: Date.now(),
          sender: 'user',
          text: '',
          type: 'file',
          name: filename,
          size: '',
          url: base64data,
        });
      } catch (error) {
        if (error.response) {
          console.error('Ошибка:', error.response.data.error);
        } else {
          console.error('Ошибка при отправке base64 сообщения:', error);
        }
      }
    },
    async sendMessage() {
      if (!this.newMessage) {
        alert("Введите сообщение!");
        return;
      }

      const url = '/tickets/messages/create';
      const headers = {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      };
      const data = {
        ticket_id: this.id,
        text: this.newMessage,
      };

      try {
        const response = await axios.post(url, data, { headers });
        console.log('Сообщение успешно отправлено:', response.data);

        this.messages.push({
          id: Date.now(),
          sender: 'user',
          text: this.newMessage,
          type: 'text',
          name: '',
          size: '',
        });

        this.newMessage = '';
      } catch (error) {
        if (error.response) {
          console.error('Ошибка:', error.response.data.error);
        } else {
          console.error('Ошибка при отправке сообщения:', error);
        }
      }
    },
    async getMessages() {
      this.isloading = true;
      const url = '/tickets/messages/get/all';
      const headers = {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      };
      const data = {
        ticket_id: this.id,
      };

      try {
        const response = await axios.post(url, data, { headers });
        this.messages = [];

        for (let i = response.data.messages.length - 1; i >= 0; i--) {
          const msg = response.data.messages[i].content;

          if (msg.startsWith('[file:')) {
            // Парсим имя файла и base64
            const match = msg.match(/^\[file:(.+?)\](.+)$/);
            if (match) {
              this.messages.push({
                id: Date.now() + i,
                sender: 'user',
                text: '',
                type: 'file',
                name: match[1],
                size: '',
                url: match[2],
              });
            } else {
              this.messages.push({
                id: Date.now() + i,
                sender: 'user',
                text: msg,
                type: 'text',
                name: '',
                size: '',
              });
            }
          } else {
            this.messages.push({
              id: Date.now() + i,
              sender: 'user',
              text: msg,
              type: 'text',
              name: '',
              size: '',
            });
          }
        }
      } catch (error) {
        if (error.response) {
          console.error('Ошибка:', error.response.data.error);
        } else {
          console.error('Ошибка при получении сообщений:', error);
        }
      }finally{
          this.isloading = false;
        }
    },
  },
  mounted() {
    this.getMessages();
    setTimeout(() => {
      this.update_data();
    }, 1000);
  },
};
</script>

<template>
  <LoadingSpinner v-if="isloading"/>
  <section class="wrapper" v-else>
    <div class="chat">
      <header>
        <button class="close" @click="close()">
          <img src="../assets/chat-close.png" alt="Закрыть" />
        </button>
        <h2>{{ name }}</h2>
        <p class="par">{{ date }}</p>
      </header>

      <div class="messages">
        <div
          class="wrap-message"
          v-for="message in messages"
          :key="message.id"
          :class="{ user: message.sender == 'user' }"
        >
          <div
            class="group-message"
            :class="{ userGroupMessage: message.sender == 'user' }"
          >
            <div
              class="message"
              v-if="message.type == 'text'"
              :class="{ userMessage: message.sender == 'user' }"
            >
              {{ message.text }}
            </div>

            <div
              class="message doc"
              v-if="message.type == 'file'"
              :key="message.id"
              :class="{ userMessage: message.sender == 'user' }"
            >
              <template v-if="message.url.startsWith('data:image/')">
                <img
                  :src="message.url"
                  alt="Uploaded Image"
                  style="max-width: 100%; height: auto;"
                />
              </template>
              <template v-else>
                <img src="../assets/message-file.svg" alt="File Icon" />
                <div class="info">
                  <span class="name">{{ message.name }}</span>
                  <span class="size">{{ message.size }} bytes</span>
                </div>
              </template>
            </div>

            <div class="avatar" v-if="message.sender == 'user'">
              <img src="../assets/image.png" alt="User avatar" />
            </div>
          </div>
        </div>
      </div>

      <div class="group-send">
        <div class="group-file">
          <input
            type="file"
            id="file"
            ref="fileInput"
            @change="handleFileChange"
          />
          <label class="select-img" for="file">
            <img class="photo" src="../assets/folder-add.svg" alt="Добавить файл" />
          </label>
        </div>
        <input
          type="text"
          class="group-item-chat"
          placeholder="начните писать"
          v-model="newMessage"
          @keyup.enter="sendMessage"
        />
        <img class="send" src="../assets/send.svg" alt="Отправить" @click="sendMessage" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.card {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #f0f0f5;
  transition: all 500ms ease;
  cursor: auto;
}

.card:hover,
.btn-action:hover,
.chat:hover {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.wrap-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h1 span {
  font-weight: 600;
  font-size: 24px;
  line-height: 32.78px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  line-height: 27.32px;
  color: #14171f;
}

.btn {
  padding: 14.5px 24px;
  border-radius: 8px;
  color: #5b6171;
  font-weight: 600;
  transition: all 500ms ease;
}
.edit {
  color: #195ee6;
}

.group {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.group-value {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #5b6171;
  cursor: pointer;
}

.group-item {
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #dfe3ec;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #5b6171;
}

.group-item::placeholder {
  color: #8c93a6;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}

.group-item-chat {
  width: 100%;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #5b6171;
}

.group-item-chat::placeholder {
  color: #8c93a6;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}

.fields {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.field-item {
  font-weight: 500;
  font-size: 14px;
  line-height: 19.12px;
  color: #5b6171;
}

.field-value {
  color: #262d40;
  font-size: 16px;
  line-height: 21.86px;
  letter-spacing: 0em;
}

/* chat */

.chat {
  width: 100%;
  background-color: #fff;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #f0f0f5;
  transition: all 500ms ease;
  cursor: auto;
}

input[type="file"] {
  border: none;
  display: none;
}

.group-file {
  display: flex;
  align-items: center;
  justify-content: center;
}

.messages {
  width: 100%;
  height: 80vh;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.messages::-webkit-scrollbar {
  width: 0;
}

.wrap-message {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.user {
  justify-content: flex-end;
}

.group-message {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 10px;
  flex-direction: row-reverse;
  padding-right: 38px;
  padding-left: 0;
}

.userGroupMessage {
  flex-direction: row;
  padding-left: 38px;
  padding-right: 0;
  justify-content: end;
}

.message {
  max-width: 600px;
  width: fit-content;
  background-color: #e6eefe;
  padding: 20px;
  border-radius: 4px 12px 12px 12px;
  border: 1px solid #f1f2f4;
}
.userMessage {
  background-color: #fff;
  border-radius: 12px 4px 12px 12px;
}

.group-item {
  line-height: 22px;
  font-size: 14px;
  width: 100%;
}

.group-send {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 13px 16px;
  border-radius: 8px;
  border: 1px solid #dfe3ec;
  background-color: #fff;
}

.send {
  cursor: pointer;
  transition: all 500ms ease;
  width: 30px;
  width: 30px;
}

.send:hover {
  transform: translateY(-3px);
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  overflow: hidden; /* Обрезает изображение, если оно выходит за пределы блока */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0; /* Фон на случай, если изображение не загрузится */
  box-sizing: border-box;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block; /* Убирает лишние пробелы */
  border: none; /* Убирает возможные границы */
  padding: 0; /* Убирает возможные отступы */
  margin: 0;
}

.doc {
  display: flex;
  gap: 10px;
  cursor: pointer;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 500;
  font-size: 12px;
  line-height: 16.8px;
}

.size {
  color: #a7adbe;
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
}
header{
  display:flex;
  gap:20px;
}
header img{
  width:20px;
  height:20px;
}
.par{
  color:#27272766;
}
</style>
