<script>
export default {
  name: "AppPartners",
  components: {},
  data() {
    return {};
  },
};
</script>
<template>
  <div class="wrapper">
    <h2>{{ $t("partners_title") }}</h2>
    <div class="cards">
      <div class="card">
        <img src="../assets/canaan.svg" alt="" class="icon" />
        <div class="title">canaan</div>
      </div>
      <div class="card">
        <img src="../assets/bitmain.svg" alt="" class="icon" />
        <div class="title">bitmain</div>
      </div>
      <div class="card">
        <img src="../assets/headframe.svg" alt="" class="icon" />
        <div class="title">headframe</div>
      </div>
      <div class="card">
        <img src="../assets/whatsminer.svg" alt="" class="icon" />
        <div class="title">whatsminer</div>
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cards {
  width: 100%;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.card {
  width: 24%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: transparent;
  border: none;
}

.card:hover {
  border: none;
  box-shadow: none;
}

.title {
  opacity: 40%;
  color: #272727;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
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

.icon {
  height: 40px;
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
