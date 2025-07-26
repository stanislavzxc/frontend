<script>
export default {
  name: "Banner_2",
  components: {},
  data() {
    return {
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    goLog() {
      if (this.token) {
        this.$router.push({ name: "profile" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
  },
};
</script>
<template>
  <div class="wrapper">
    <div class="banner">
      <button class="btn" @click="goLog">{{ $t('begin') }}</button>
      <span class="text">{{ $t("beginToday") }}</span>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  width: 100%;
  margin-top: 40px;
  padding: 0 40px;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.text {
  line-height: 120%;
  font-size: 28px;
  color: #272727;
  font-family: "Montserrat", sans-serif;
}

/* .banner {
  position: relative;
  padding: 60px 40px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  max-height: 280px;
  overflow: hidden;
  transition: all 500ms ease;
  cursor: pointer;
} */

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../assets/banner2.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
  border-radius: 20px;
}

.title {
  width: 60%;
  color: #fff;
  font-weight: 600;
  font-size: 28px;
  line-height: 33.6px;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  z-index: 3;
}

.btn {
  padding: 17px 64px;
  border-radius: 10px;
  background-color: #cf0032;
  color: #fff;
  width: fit-content;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
}

.asic {
  position: absolute;
  right: 1%;
  width: 300px;
  z-index: 2;
}

.ks5 {
  left: -2%;
  transform: scaleX(-1);
  width: 360px;
}

.asic {
  z-index: 2;
}

.title {
  z-index: 3;
}

@media (max-width: 1000px) {
  .asic {
    width: 200px;
  }

  .ks5 {
    width: 260px;
  }
}

@media (max-width: 850px) {
  .asic {
    width: 120px;
  }

  .ks5 {
    width: 160px;
  }
}
</style>
