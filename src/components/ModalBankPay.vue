<template>
 <LoadingSpinner v-if="isLoading" />
  <div id="modalwindow" v-if="isModalVisible && !isLoading" class="modal-overlay">
    <div class="modal-content" v-if="step == 1">
      <h4 class="textmain">{{ $t("card_pay") }}</h4>
      <div class="info">
        <div class="group">
            <input
              type="text"
              name="card_number"
              v-model="card_number"
              :placeholder="'0000 0000 0000 0000'"
            />
            <span class="group-value">{{ $t("card_number") }}</span>
          </div>
          <div class="cont">
            <div class="group">
            <input
              type="text"
              name="card_mounth"
              v-model="card_mounth"
              :placeholder="'12'"
            />
            <span class="group-value">{{ $t("monthOne") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="card_year"
              v-model="card_year"
              :placeholder="'2025'"
            />
            <span class="group-value">{{ $t("yearly") }}</span>
          </div>
          <div class="group">
            <input
              type="text"
              name="card_code"
              v-model="card_code"
              :placeholder="'000'"
            />
            <span class="group-value">Security Code</span>
          </div>
          </div>
        
        <div class="group">
            <input
              type="text"
              name="card_udo"
              v-model="card_udo"
              :placeholder="'0000 0000 0000 0000'"
            />
            <span class="group-value">{{ $t("udo") }}</span>
          </div>
      </div>
      <button>
        <span class="close" @click="closeModal()"
          ><img src="../assets/modaltestclose.png" alt=""
        /></span>
      </button>
      <div class="parent-pay">
        <h3>{{ $t('topay') }}: </h3>
        <h3>${{ price}}</h3>
      </div>
      <p> <span class="black">{{ $t('commision') }}:</span> {{ commision }}%</p>
      <p> <span class="black">{{ $t('gateaway') }}: </span> <span class="red"> {{ gateaway }}</span></p>
      <img src="../assets/icons_pay.png" alt="" class="icons">
      <p>{{ $t('nonstate') }}</p>
      <div class="btn-cont">
        <button class="two" @click="pay()">
          {{ $t("transfermake") }}
        </button>
      </div>
    </div>
    <div class="modal-content second" v-else>
    <div class="succes" v-if="pay_state">
      <button>
        <span class="close" @click="closeModal()"
          ><img src="../assets/modaltestclose.png" alt=""
        /></span>
      </button>
      <img src="../assets/succes.png" class="icon">
    <h3>{{$t('succes')}}</h3>
      <button class="two zxc" @click="make()">
          {{ $t('go') }} {{ $t("myPayments") }}
        </button>
    </div>
    <div class="succes" v-if="!pay_state">
      <button>
        <span class="close" @click="closeModal()"
          ><img src="../assets/modaltestclose.png" alt=""
        /></span>
      </button>
      <img src="../assets/fail.png" class="icon">
      <h3>{{$t('errorpay')}}</h3>
      <button class="two zxc" @click="closeModal()">{{ $t("remake") }}
        </button>
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";
export default {
  data() {
    return {
      lang: this.$i18n.locale,
      isLoading:false,
      pay_state:false,
      card_number:'',
      card_mounth:'',
      card_year:'',
      card_code:'',
      card_udo:'',
      gateaway:'Tranzilla',
      commision:15,
      value: null,
      cost: "15.8",
      summa_zakaza: "25.8",
      show: true,
      step: 1,
      activeImg: require("../assets/test.png"),
      nds:0,
      recepient:'zxc',
      address:'zxc',
      bank:'zxc',
      BIC:'zxc',
      IBAN:'zxc',
      number:'00000111',
      key:'',
    };
  },
  components:{ LoadingSpinner},
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
    async pay() {
      if (!this.card_number || !this.card_mounth || !this.card_year || !this.card_code || !this.card_udo) {
      let message;
      // Определяем сообщение в зависимости от текущего языка
      switch (this.lang) {
        case 'RU':
          message = "Заполните все данные!";
          break;
        case 'HE':
          message = "אנא מלא את כל הפרטים!";
          break;
        case 'EU':
          message = "Please fill in all the details!";
          break;
        default:
          message = "Please fill in all the details!"; // Сообщение по умолчанию
      }
      alert(message);
      return; // Прекращаем выполнение метода, если поля не заполнены
    }
    
      this.isLoading = true;
    // Пример данных для отправки
    const paymentData = {
      card_number: this.card_number,
      card_month: this.card_mounth,
      card_year: this.card_year,
      card_code: this.card_code,
      card_udo: this.card_udo,
      amount: this.price,
      currency: 'RUB', // или ваша валюта
      description: `Оплата заказа на сумму ${this.price}`,
      // добавьте другие необходимые параметры
    };

    try {
      // Отправляем данные на ваш сервер
      const response = await axios.post('/api/payment/create', paymentData, {
        headers: {
          Authorization: `Bearer ${this.key}`, // если нужен токен
          'Content-Type': 'application/json',
        },
      });
      this.step = 2;
      if (response.data.status === 'success') {
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.pay_state = false;
      }
    } catch (error) {
      console.error('Ошибка при оплате:', error);
      this.isLoading = false;
      this.pay_state = false;
      this.next();
    }
  },
    async getkey() {
    try {
      // Отправляем данные на ваш сервер
      const response = await axios.get('/api/settings/key', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // если нужен токен
        },
      });
      this.key = response.data.key;
    } catch (error) {
      console.error('Ошибка при оплате:', error);
    }
  },
    closeModal() {
      this.$emit('update:isModalVisible', false);
      this.step = 1;
    },
    next() {
      this.step++;
    },
    make() {
      this.$router.push({ name: "mypayments" });
    },
  },

  mounted() {
    // this.fetchValue();
  },
};
</script>

<style scoped>
.zxc{
  width:90% !important;
}
.black{
  color:black;
}
.red{
  color:#CF0032;

}
.parent-pay{
  display: flex;
  justify-content:space-between;
  margin:20px 0px 20px 0px
}
.icons{
  width: 200px;
  height: 40px;
  margin:10px 0px 10px 0px
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
.cont{
  display: flex;
  width: 100% !important;
  justify-content: space-between;
  gap: 15px;
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


.parts{
  margin:5px 0px 5px 0px;
}
.info{
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  width: 45%;
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
  }
  .btn-cont{
    flex-direction: column-reverse;
  }
}
@media (max-width: 810px) and (min-width: 501px) {
  .modal-content {
   width:60%;
   padding: 20px;
  }
 
}
</style>
