<script>
export default {
  name: "AppManual",
  components: {},
  data() {
    return {};
  },
  mounted() {
  },
};
</script>
<template>
  <div class="wrapper">
    <h2>{{ $t("manual_title1") }} <span class="red">{{ $t('manual_title2') }}</span></h2>
    <div class="cards">
      <div class="card">
        <img src="../assets/step_1.svg" alt="" class="icon" />
        <div class="title"><span class="red">01</span>{{ $t("manual_step1") }}</div>
      </div>
      <div class="card">
        <img src="../assets/step_2.svg" alt="" class="icon" />
        <div class="title"><span class="red">02</span>{{ $t("manual_step2") }}</div>
      </div>
      <div class="card">
        <img src="../assets/step_3.svg" alt="" class="icon" />
        <div class="title"><span class="red">03</span>{{ $t("manual_step3") }}</div>
      </div>
      <div class="card">
        <img src="../assets/step_4.svg" alt="" class="icon" />
        <div class="title"><span class="red">04</span>{{ $t("manual_step4") }}</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h2 {
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  color: #272727;
}

.red {
  color: #CF0032;
}
.wrapper {
  margin-top: 40px;
  padding: 0 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cards {
  width: 100%;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 10px;
}

.card {
  width: 49%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  border: none;
}

.card:hover {
  border: none;
  box-shadow: none;
  transform: scale(1.015);
}

.title {
  display: flex;
  gap: 10px;
  color: #272727;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
}

.title span {
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
}

.desc {
  color: #0f0f0f;
  opacity: 70%;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.8px;
  text-align: center;
}

@media (max-width: 768px) {

  .cards {
    flex-direction: column;
  }
  .card {
    width: 100%;
  }
}
</style>
