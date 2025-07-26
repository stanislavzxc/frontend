<script>
export default {
  name: "Banner_1",
  components: {},
  data() {
    return {};
  },
};
</script>
<template>
  <div class="wrapper">
    <div class="banner">
      <div class="background"></div>
      <div class="title">
        <!-- <span class="red">{{ $t("purchaseEquipment") }}</span> -->
        <span class="red">{{ $t('banner2_title') }}</span>
        <!-- <span>{{ $t("weAreTouch") }}</span> -->
        <span>{{ $t('banner2_desc') }}</span>
      </div>
      <button @click="this.$emit('updateFormFeedback', true)" class="btn">
        {{ $t("feedback") }}
      </button>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background: transparent;
  transition: all 500ms ease;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../assets/banner1.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1;
  border-radius: 20px;
}

.title {
  color: #fff;
  font-weight: 600;
  font-size: 28px;
  line-height: 33.6px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.red {
  color: #cf0032;
}

.btn {
  padding: 17px 24px;
  border-radius: 10px;
  background-color: #cf0032;
  color: #fff;
  width: fit-content;
  transition: all 500ms ease;
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
</style>
