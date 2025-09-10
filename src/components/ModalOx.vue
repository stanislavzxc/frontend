<template>
  <!-- Ваш шаблон без изменений -->
  <div id="modalwindow" v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content">
      <button @click="closeModal()" class="modalclose"><span><span>&lt;</span> {{ $t('back') }}</span></button>

      <h4 class="textmain">{{ $t("oxtitle") }}</h4>
      <p>{{ $t('oxtitle1') }}</p>
      <div class="info">
        <p class="txt">1. {{ $t('oxtitle2') }}</p>
        <p class="txt">2. {{ $t('oxtitle3') }}</p>
        <p class="txt">3. {{ $t('oxtitle4') }}</p>
        <div class="clock">
          <img src="../assets/time.png" alt="">
          00:{{ time }}
        </div>
      </div>
      
      <button class="two" @click="fetchValue()">
        {{ $t("gonow") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from 'qs';

export default {
  data() {
    return {
      show: true,
      time: 30,
      email: "",
      FirstName: "",  // Изменено с name
      LastName: "",   // Изменено с lastname
      currency: "BTC", // Добавлено (захардкодено; замените если нужно динамическое)
      id: 1,
      merchant: '',
    };
  },
  props: {
    isModalVisible: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // Ваш computed без изменений
    stepImage() {
      try {
        if (this.step !== 1) {
          return require(`../assets/test${this.step}.png`);
        } else {
          return require(`../assets/test.png`);
        }
      } catch (e) {
        return require("../assets/test.png");
      }
    },
  },
  methods: {
    async fetchValue() {
  try {
    await this.load_info();

    console.log('Инициируем платёж...');
    
    if (!this.email || !this.FirstName || !this.LastName || !this.id) {
      await this.load_info();
    }
    
    if (!this.email || !this.FirstName || !this.LastName || !this.id || !this.currency) {
      throw new Error('Отсутствуют обязательные поля');
    }
    
    const amount = this.price > 0 ? this.price : parseFloat(localStorage.getItem('total') || '0');
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Неверная сумма');
    }
    
    const requestData = {
      Test: false,
      Email: this.email,
      FirstName: this.FirstName,
      LastName: this.LastName,
      Amount: amount,
      Currency: this.currency,
      MerchantId: this.merchant || '1',
      ClientId: String(this.id),
      BillingID: '1',
      ReturnUrl: true,
    };
    
    console.log('Данные запроса:', requestData);
    
    const response = await axios.post('https://app.0xprocessing.com/Payment', qs.stringify(requestData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    
    console.log('Ответ:', response);
    
    if (response.data && response.data.redirectUrl) {
      this.ticking();
      window.location.href = response.data.redirectUrl;
    } else {
      throw new Error('Нет redirectUrl в ответе');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    if (error.response) {
      console.error('Статус:', error.response.status);
      console.error('Данные:', error.response.data);
    }
    alert(`Ошибка платежа: ${error.message}`);
  }
},


    async load_info() {
      try {
        let response = await axios.get(`/users/${localStorage.getItem("id")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response);
        this.email = response.data.user.email;
        this.FirstName = response.data.user.firstname;  // Изменено
        this.LastName = response.data.user.lastname;    // Изменено
        this.id = response.data.user.id;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    
    closeModal() {
      this.$emit('update:isModalVisible', false);
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.time = 30;  // Сброс таймера
    },
    next() {
      this.step++;
    },
    ticking() {
      this.intervalId = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          clearInterval(this.intervalId);
        }
      }, 1000);
    }
  },
   mounted() {
    this.merchant = localStorage.getItem('merchant') || '1';
   },
};
</script>
  
  <style scoped>
  .clock{
    background-color: #CF0032;
    color:white;
    display: flex;
    gap:5px;
    padding: 10px;
    border-radius: 10px;
    width: 100px;
  margin: 10px 0px 10px 0px;
  }
  .modalclose{
    display: flex;
    justify-content: first baseline;
    margin:10px 0px 10px 0px;
  }
  p{
    color:black !important;
  }
  
  .second{
    display: flex;
    text-align: center;
  }
  .icon{
    margin: auto;
    width:64px;
    height:64px;
  }
  
  .red{
    color:#CF0032;
  }
  .parts{
    margin:5px 0px 5px 0px;
  }
  .info{
    display: flex;
    flex-direction: column;
  }
  
  .title{
    color:grey;
  }
  .txt{
    color:black;
    margin-left:5px;
  }
  .string{
    display: flex;
  }
  /* ваш CSS без изменений */
  .test {
    width: 100%;
    position: relative;
    padding: 40px;
    border-radius: 20px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
    max-height: auto;
    background-color: #272727;
    display: flex;
  }
  
  .card:hover {
    transform: scale(1.02);
  }
  h2,
  p {
    color: grey;
  }
  .btn {
    border-radius: 10px;
    padding: 12px 59px;
    display: flex;
    gap: 10px;
    background-color: #cf0032;
    color: white;
  }
  .cont {
    width: 60%;
  }
  .asic {
    width: 46%;
    position: absolute;
    right: 0%;
    bottom: -20px;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  @media screen and (min-width: 500px) and (max-width: 810px) {
    .cont {
      width: 90%;
    }
  }
  
  @media (max-width: 500px) {
    .cont {
      width: 95%;
      position: relative;
      top: 10px;
    }
    .asic {
      width: 80%;
      position: relative;
      bottom: -40px;
      right: -5%;
    }
    .test {
      display: block;
    }
    .btn {
      width: 110%;
      display: flex;
      justify-content: center;
    }
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
    width: 46%;
  }
  
  .titletext {
    color: black !important;
  }
  .textmain {
    padding-bottom: 15px;
  }
  button {
    cursor: pointer;
  }
  .text {
    font-size: 14px;
    color: black;
  }
  .textfooter {
    padding-bottom: 10px;
    color: black;
  }
  .step {
    color: #cf0032;
  }
  .parent {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .asicmodal {
    width: 40%;
    padding-bottom: 40px;
  }
  .btn-cont {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  .two {
    color: #fff;
    flex: 48%;
    padding: 17px 24px;
    border-radius: 10px;
    background-color: #cf0032;
  }
  .one {
    color: #cf0032;
    border: 1px solid #cf0032;
    flex: 48%;
    padding: 17px 24px;
    border-radius: 10px;
  }
  @media (max-width: 500px) {
    .modal-content {
     width:90%;
     padding: 35px;
    }
    .btn-cont{
      flex-direction: column-reverse;
    }
  }
  </style>
  