<script>
import axios from "axios";
export default {
  name: "BlockAdvantages",
  components: {},
  data() {
    return {};
  },
  async mounted() {
    try {
      let response = await axios.get(`/users/${localStorage.getItem("id")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      this.$i18n.locale = response.data.user.lang;
    } catch (err) {
      console.log(err);
    }
  },
};
</script>
<template>
  <div class="wrapper">
    <h2>{{ $t("usAdvantages") }}</h2>
    <div class="cards">
      <div class="card">
        <img src="../assets/clock.svg" alt="" class="icon" />
        <div class="title">{{ $t("uptime") }}</div>
        <div class="desc">{{ $t("stableConnect") }}</div>
      </div>
      <div class="card">
        <img src="../assets/24-support.svg" alt="" class="icon" />
        <div class="title">{{ $t("support") }}</div>
        <div class="desc">{{ $t("supportText") }}</div>
      </div>
      <div class="card">
        <img src="../assets/verify.svg" alt="" class="icon" />
        <div class="title">{{ $t("garant") }}</div>
        <div class="desc">{{ $t("garantText") }}</div>
      </div>
      <div class="card">
        <img src="../assets/driver-refresh.svg" alt="" class="icon" />
        <div class="title">{{ $t("fastConnect") }}</div>
        <div class="desc">{{ $t("fastConnectText") }}</div>
      </div>
      <div class="card">
        <img src="../assets/pcPhone.svg" alt="" class="icon" />
        <div class="title">{{ $t("control") }}</div>
        <div class="desc">{{ $t("controlText") }}</div>
      </div>
      <div class="card">
        <img src="../assets/video.svg" alt="" class="icon">
        <div class="title">{{ $t("videoEdu") }}</div>
        <div class="desc">{{ $t("videoEduDesc") }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h2 {
  text-align: center;
}
.wrapper {
  margin-top: 40px;
  padding: 0 40px;
  width: 100%;
}

.cards {
  width: 100%;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 10px;
}

.card {
  width: 32%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
}

.title {
  color: #cf0032;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
}

.desc {
  color: #0f0f0f;
  opacity: 70%;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.8px;
  text-align: center;
}

.icon {
  height: 40px;
  width: 40px;
}

@media (max-width: 880px) {
  .card {
    width: 49%;
  }
}

@media (max-width: 580px) {

  .cards {
    flex-direction: column;
  }
  .card {
    width: 100%;
  }
}
</style>
