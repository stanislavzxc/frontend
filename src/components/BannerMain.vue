<script>
import LoadingSpinner from "./LoadingSpinner.vue";
import axios from "axios";
export default {
  name: "BannerMain",
  components: {LoadingSpinner},
  data() {
    return {
      card: {},
      id: "",
      isloading:false,
    };
  },
  methods: {
    async load_info() {
      this.isloading = true;
      try {
        let settings = await axios.get(`/settings/get?key=miner_banner`);
        this.id = settings.data.value;
        let response = await axios.get(`/miners/get?id=${this.id}`);
        console.log(response.data, "asdfasdfasdfasd");
        this.card = response.data.miner_item;
      } catch (err) {
        console.log(err);
      }finally{
        this.isloading = false;
      }
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>
<template>
  <LoadingSpinner v-if="isLoading"/>
  <div
    class="card main"
    @click="this.$router.push({ name: 'product', query: { id: this.id } })"
    v-else
  >
    <div class="info">
      <div class="main_info">
        <div class="par headmain">
          <div class="title">{{ card.name }}</div>
          <div class="trends">{{ $t("trend") }}</div>
        </div>
        <div class="cont">
          <div class="group first-child">
            <span class="group-name">{{ $t("hash") }}:</span>
            <span class="group-value">{{ card.hash_rate }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("dohod") }}:</span>
            <span class="group-value">${{ card.profit }}/{{ $t("dayOne") }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("rashod") }}:</span>
            <span class="group-value">{{ card.energy_consumption }} {{ $t("wt") }}</span>
          </div>
          <div class="group">
            <span class="group-name">{{ $t("discount") }}:</span>
            <span class="group-value discount">{{ card.discount_value }} %</span>
          </div>
        </div>
        <div class="wrap-scale">
          <div
            class="scale"
            :style="'width: ' + (100 - card.payback_percent) + '%'"
          ></div>
        </div>
        <span class="group-name last"
          >{{ $t("time_profit") }} : {{ card.payback }} {{ $t("countmonth") }}</span
        >
      </div>
    </div>
    <img class="asic" src="../assets/asic.png" alt="" />
  </div>
</template>
<style scoped>
.discount {
  padding: 4px 6px;
  border-radius: 5px;
  background-color: #25d366;
}
.par {
  display: flex;
  align-items: center;
  gap: 10px;
}
.trends {
  padding: 6px;
  border-radius: 8px;
  background-color: #cf0032;
  font-weight: 800;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: white;
  white-space: nowrap;
}
.last {
  margin-top: 10px;
}
.scale {
  position: absolute;
  right: 0;
  height: 6px;
  background-color: #a9a9a9;
}

.wrap-scale {
  position: relative;
  width: 40%;
  border-radius: 10px;
  height: 6px;
  background: linear-gradient(to right, #e11111 0%, #ecf02b 50%, #2ee111 100%);
  overflow: hidden;
}
.cont {
  display: flex;
  padding: 10px 0px 10px 0px;
}
.card {
  padding: 10px 20px;
  border-radius: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  overflow: hidden;
  height: auto;
  border: none;
}

.card:hover {
  transform: scale(1.01);
  box-shadow: 0 0 10px 0 #00000037;
}

.info {
  width: 57%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
}

.main_info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 30px;
  line-height: 30px;
  font-weight: 800;
  color: #0d0d0d;
}

.main .title {
  color: #fff;
}

.main {
  background-image: url("../assets/red_bg.svg");
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
  line-height: 14px;
}

.main .group-name {
  color: #fff;
  opacity: 60%;
}

.group-value {
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #272727;
  white-space: nowrap;
}
.asic {
  width: 100%;
  transform: translateY(10px);
}

@media (max-width: 810px) {
  .group {
    margin-top: 5px;
  }
  .group-name {
    padding-right: 10px;
  }
  .last {
    margin-top: 0px;
  }
  .card {
    padding: 10px;
  }
  .title {
    font-size: 26px;
    line-height: 26px;
  }

  .headmain {
    flex-direction: column-reverse;
    gap: 0px;
    align-content: center;
    align-items: first baseline;
  }
  .main_info {
    gap: 5px;
  }

  .cont {
    flex-direction: column;
    align-items: baseline;
  }
  .asic {
    width: auto;
    position: absolute;
    right: -150px;
  }
  .wrap-scale {
    width: 70%;
  }
}

@media (max-width: 480px) {
  .headmain {
    flex-direction: column-reverse;
    gap: 0px;
    align-content: center;
    align-items: first baseline;
  }
  .main_info {
    gap: 5px;
  }

  .cont {
    flex-direction: column;
    align-items: baseline;
    padding: 0px;
  }
  .asic {
    width: auto;
    position: absolute;
    right: -100px;
  }
  .wrap-scale {
    width: 70%;
  }
}

@media (max-width: 440px) {
  .wrap-scale {
    width: 70%;
  }
  .headmain {
    flex-direction: column-reverse;
    gap: 0px;
    align-content: center;
    align-items: first baseline;
  }
  .group-name,
  .group-value {
    font-size: 10px;
  }

  .title {
    font-size: 16px;
  }
  .cont {
    flex-direction: column;
    align-items: baseline;
    padding: 0px;
  }
  .asic {
    width: auto;
    position: absolute;
    right: -270px;
    max-width: 170% !important;
  }
  .main_info {
    width: 150%;
  }
}
@media (max-width: 340px) {
  .asic {
    width: auto;
    position: absolute;
    right: -230px;
    max-width: 170% !important;
  }
}
</style>
