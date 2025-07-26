<script>
import axios from "axios";

export default {
  name: "Block_1",
  components: {},
  data() {
    return {
      src: "",
      token: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.token = localStorage.getItem("token");
        let response = await axios.get(
          `/settings/get?key=home_page_youtube_link`
        );
        this.src = response.data.value;
      } catch (err) {
        console.log(err);
      }
    },

    openYoutube() {
      window.open(this.src, "_blank");
    },

    logIn() {
      if (this.token) {
        this.$router.push({ name: "profile" });
      } else {
        this.$emit("updateLogin", true);
      }
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>
<template>
  <div class="wrapper">
    <div class="background"></div>
    <div class="left">
      <h2>
        {{ $t("block1_1") }}
      </h2>
      <p>
        {{ $t("block1_2") }}
      </p>
      <div class="wrap-btns">
        <button
          @click="this.$emit('updateFormFeedback', true)"
          class="btn learn"
        >
          {{ $t("learn") }}
        </button>
        <button @click="logIn" class="btn logsys">
          {{ $t("log_system") }}
        </button>
        <button @click="openYoutube()" class="btn youtube">
          {{ $t("watch") }} Youtube
          <img src="../assets/youtube.png" alt="" />
        </button>
      </div>
    </div>
    <div class="right">
      <!-- <img class="asic asic1" src="../assets/asic.png" alt="" />
      <img class="asic asic2" src="../assets/asic.png" alt="" /> -->
      <img src="../assets/miner.png" alt="">
    </div>
  </div>
</template>
<style scoped>
.right img {
 
  width: auto; /* Автоматически подгоняйте ширину для сохранения пропорций */
}
.youtube img {
  height: 24px;
  width: 24px;
}
.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 20px;
  position: relative;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.1;
}

.left,
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  z-index: 2;
  height: auto
}

.left {
  flex-direction: column;
  align-items: start;
}

.asic {
  height: 378px;
}

.asic1 {
  transform: translateX(175px);
}

.asic2 {
  z-index: 3;
}

.wrap-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.learn {
  background-color: #cf0032;
}

.logsys {
  border: 1.5px solid #cf0032;
  color: #cf0032 !important;
}

.youtube {
  background-color: black;
  color: #fff;
}

.wrap-btns button {
  color: #fff;
  flex: 48%;
  padding: 17px 24px;
  border-radius: 10px;
}

video {
  width: 100%;
  border-radius: 15px;
  pointer-events: none;
}

.btn:hover {
  transform: scale(1.02);
}

@media (max-width: 780px) {
  .wrapper {
    flex-direction: column;
  }

  .left,
  .right {
    width: 100%;
  }

  .right {
    gap: 0;
  }

  .asic1 {
    transform: none;
  }

  .asic1 {
    transform: translateX(80px);
  }

  .asic2 {
    transform: translateX(-80px);
  }

  .asic {
    height: 240px;
  }
}
</style>
