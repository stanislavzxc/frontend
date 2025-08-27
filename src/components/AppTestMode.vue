<template>
  <div id="modalwindow" v-if="isModalVisible && content.test === true" class="modal-overlay">
    <div class="modal-content">
      <h4 class="textmain">{{ $t("test") }}</h4>
      <h5 class="titletext" v-if="step == 1">{{ $t("testmodal1") }}</h5>
      <h5 class="titletext" v-if="step == 5">
        {{ $t("testmodal5") }}{{ summa_zakaza }}$
      </h5>
      <p class="text" v-if="step < 5">{{ $t("testmodal2") }}</p>
      <p class="textfooter" v-if="step == 1">
        <span class="step">{{ $t("testmodalstep") }} 1.</span> {{ $t("testmodalstep1") }}
      </p>
      <p class="textfooter" v-if="step == 2">
        <span class="step">{{ $t("testmodalstep") }} 2.</span> {{ $t("testmodalstep2") }}
      </p>
      <p class="textfooter" v-if="step == 3">
        <span class="step">{{ $t("testmodalstep") }} 3.</span> {{ $t("testmodalstep3") }}
      </p>
      <p class="textfooter" v-if="step == 4">
        <span class="step">{{ $t("testmodalstep") }} 4.</span> {{ $t("testmodalstep4") }} ${{ dohod }}
        {{ $t('testmodalstep41') }}
        ${{ hosting }}
        {{ $t('testmodalstep42') }}
        ${{ profit }}

      </p>
      <p class="textfooter" v-if="step == 5">{{ $t("testmodalstep5") }}</p>
      <button>
        <span class="close" @click="closeModal()"
          ><img src="../assets/modaltestclose.png" alt=""
        /></span>
      </button>
      <div class="parent">
        <img :src="stepImage" alt="" class="asicmodal" />
      </div>
      <p class="step" v-if="step == 4">{{ $t("testmodalsteptext4") }} ${{ cost}}</p>
      <div class="btn-cont" v-if="step < 5">
        <button class="one" @click="closeModal()">
          {{ $t("testmodalclose") }}
        </button>
        <button class="two" @click="next()" v-if="step < 4">
          {{ $t("testmodalnext") }}
        </button>
        <button class="two" @click="next()" v-else>
          {{ $t("testmodalnext2") }}
        </button>
      </div>
      <div class="btn-cont" v-else>
        <button class="two" @click="make()">
          {{ $t("Arrange") }}
        </button>
      </div>
    </div>
  </div>
  <div class="test" v-if="show">
    <div class="cont">
      <h2>{{ $t("testtitle") }} {{ value }}$</h2>
      <p>{{ $t("testtext1") }}</p>
      <p>{{ $t("testtext2") }}</p>
      <button @click="this.isModalVisible = true" class="btn">
        {{ $t("teststart") }}
      </button>
    </div>
    <img :src="activeImg" alt="" class="asic" />
    <button @click="this.show = false">
      <img src="../assets/test-close.png" class="close" />
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dohod:'1',
      hosting:'1',
      profit:'1',
      hashrate:'',
      value: null,
      cost: "",
      summa_zakaza: "25.8",
      show: true,
      isModalVisible: false,
      step: 1,
      activeImg: require("../assets/test.png"),
    };
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
      const url = `users/testmode`;
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" 
      };

      const data = {
        state: 'wait',
        testmodetype: 'testmode',
        cost: this.summa_zakaza || '0',
        hashrate: this.hashrate || '0',
        hosting: this.hosting || '0',
        profit: this.profit || '0',
        worker: 'Antminer T21',
        miner: 'Antminer T21',
      }
      localStorage.setItem('testmodedata', data);
      try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data);
         
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    closeModal() {
      this.isModalVisible = false;
      this.step = 1;
    },
    next() {
      this.step++;
    },
    make() {
      this.isModalVisible = false;
      this.fetchValue();
      // const data = {
      //   state: 'wait',
      //   testmodetype: 'testmode',
      //   cost: this.summa_zakaza || '0',
      //   hashrate: this.hashrate || '0',
      //   hosting: this.hosting || '0',
      //   profit: this.profit || '0',
      //   worker: 'Antminer T21',
      //   miner: 'Antminer T21',
      // }
      // localStorage.setItem('testmodedata', data);
      // this.$router.push({ name: "payment" });
    },
    

  },
  

  mounted() {
  const storedContent = JSON.parse(localStorage.getItem('content'));
    if (storedContent) {
      this.content = storedContent; // Vue 2 реактивно заменит объект
    }
    
  },
};
</script>

<style scoped>

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
  color: white;
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
  width: 40%;
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
</style>
