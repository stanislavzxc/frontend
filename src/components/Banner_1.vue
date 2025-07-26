<script>
export default {
  name: "Banner_1",
  components: {},
  data() {
    return {};
  },
  methods: {
    goLog() {
      if (this.token) {
        this.$router.push({ name: "profile" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
  }
};
</script>
<template>
  <div class="wrapper">
    <div class="banner">
      <div class="background"></div>
      <div class="info">
        <h3 class="title">{{ $t('banner1_title') }}</h3>
        <span class="desc">{{ $t('banner1_desc') }}</span>
        <button @click="goLog" class="btn">
          {{ $t("banner1_btn") }}
        </button>
      </div>
      <img class="asic" src="../assets/banner1_asic.svg" alt="">
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  margin-top: 40px;
  padding: 0 40px;
  width: 100%;
}

.banner {
  position: relative;
  padding: 60px 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 30px;
  background: transparent;
  transition: all 500ms ease;
  border: 1px solid #F0F0F5;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/banner1_bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
  border-radius: 20px;
}

.info {
    width: 100%;
    max-width: 580px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.title {
  color: #fff;
  font-weight: 800;
  font-size: 24px;
  line-height: 120%;
  text-transform: uppercase;
}

.desc {
    opacity: 90%;
    font-family: 500;
    font-size: 16px;
    line-height: 140%;
    color: #fff;
}

.btn {
    width: 100%;
  padding: 17px 24px;
  border-radius: 10px;
  background-color: #cf0032;
  color: #fff;
  transition: all 500ms ease;
  font-weight: 600;
  font-size: 17px;
  line-height: 100%;
}

.btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 10px 0 #00000037;
}

.banner:hover {
  transform: scale(1.005);
  box-shadow: 0 0 10px 0 #00000037;
}

.btn,
.title {
  z-index: 2;
}

.asic {
    z-index: 2;
    position: absolute;
    right: 3%;
    bottom: 0;
}

@media (max-width: 1000px) {
    .asic {
        display: none;
    }

    .info {
        max-width: none;
    }
}
</style>
