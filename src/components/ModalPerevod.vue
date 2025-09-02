<template>
  <div id="modalwindow" v-if="isModalVisible" class="modal-overlay">
    <div class="modal-content" v-if="step == 1">
      <h4 class="textmain">{{ $t("rekviziti") }}</h4>
      <div class="info">
        <div class="string">
          <p class="title">{{ $t("rekviziti") }}</p>
          <p class="txt"> {{ price }}$ {{ $t("nds") }} {{ nds }}% {{ $t("enabled") }}</p>
        </div>
        <div class="string">
          <p class="title">{{ $t("recepient") }}</p>
          <p class="txt"> {{ recepient }}</p>
          
        </div>
        <div class="string">
          <p class="title">{{ $t("address") }}</p>
          <p class="txt"> {{ address }}</p>
        </div>
        <div class="string">
          <p class="title">{{ $t("bank") }}</p>
          <p class="txt"> {{ bank }}</p>
        </div>
        <div class="string">
          <p class="title">{{ $t("nds") }}</p>
          <p class="txt"> {{ nds }}</p>
        </div>
        <div class="string">
          <p class="title">IBAN</p>
          <p class="txt"> {{ IBAN }}</p>
        </div>
        <div class="string">
          <p class="title">BIC</p>
          <p class="txt"> {{ BIC }}</p>
        </div>
        <div class="parts">
          <p class="txt">{{ $t('part1') }} <span class="red">{{ number }}</span> {{ $t('part2') }}</p>
        </div>
        <div class="parts">
          <p class="txt">{{ $t('part3') }}</p>
        </div>
      </div>
      <button>
        <span class="close" @click="closeModal()"
          ><img src="../assets/modaltestclose.png" alt=""
        /></span>
      </button>

      <div class="btn-cont">
        <button class="one" @click="closeModal()">
          {{ $t("testmodalclose") }}
        </button>
        <button class="two" @click="next()">
          {{ $t("Confirm_transfer") }}
        </button>
      </div>
    </div>
    <div class="modal-content second" v-else>
    
      <button>
        <span class="close" @click="closeModal()"
          ><img src="../assets/modaltestclose.png" alt=""
        /></span>
      </button>
      <img src="../assets/process.png" class="icon">
    <h3>{{$t('process')}}</h3>
    <p>{{ $t('process1') }}</p>
      <button class="two" @click="make()">
          {{ $t('go') }} {{ $t("myPayments") }}
        </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
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
      const url = `https://totalminers.io/admin-api/perevod`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(url, { headers });
        const data = response.data.discounts[0];
        this.BIC = data.bic;
        this.nds = data.nds;
        this.recepient = data.recepient;
        this.addres = data.adress;
        this.IBAN = data.iban;
        this.bank = data.bank;
        this.number = data.code;
        console.log(response,'asdfgjkl');
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async updateValue() {
  const url = `https://totalminers.io/admin-api/perevod/update`;
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json', // Указываем тип контента для JSON
  };

  // Собираем данные из свойств компонента (предполагая, что они уже установлены)
  const data = {
    bic: 'this.bic',
    nds: 'this.nds',
    recepient: 'this.recepient',
    adress: 'this.addres', // Обратите внимание: в оригинале 'addres' (опечатка?), но в Python коде 'adress'
    iban: 'this.iban',
    bank: 'this.bank',
    code: 'this.number',
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Update successful:', response.data);
    // Здесь можно добавить логику после успешного обновления, например, показать уведомление
  } catch (error) {
    console.error("Error updating data:", error);
    // Здесь можно добавить обработку ошибок, например, показать сообщение пользователю
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
    this.fetchValue();
    
  },
};
</script>

<style scoped>

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
