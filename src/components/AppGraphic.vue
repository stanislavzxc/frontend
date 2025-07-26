<template>
  <LoadingSpinner v-if="isLoading" />
  <div class="graph-cart" :class="{ nocanvas: isLoading }">
    <div class="head">
      <div class="left">
        <h3 class="title">{{ $t(title[select]) }}</h3>
        <h3 class="price" v-if="select == 0">{{ price }}$</h3>
      </div>
      <div class="right">
        <div class="wrapper-btns" v-if="select == 0" :class="{none: this.isLoading}">
          <div class="desktop-buttons">
            <button
              @click="settime('hour')"
              class="btnelse"
              :class="{ active: activeButton === 'hour' }"
            >
              {{ $t("hour") }}
            </button>
            <button
              @click="settime('daily')"
              class="btnelse"
              :class="{ active: activeButton === 'daily' }"
            >
              {{ $t("daily") }}
            </button>
            <button
              @click="settime('weekly')"
              class="btnelse"
              :class="{ active: activeButton === 'weekly' }"
            >
              {{ $t("weekly") }}
            </button>
            <button
              @click="settime('monthly')"
              class="btnelse"
              :class="{ active: activeButton === 'monthly' }"
            >
              {{ $t("monthly") }}
            </button>
            <button
              @click="settime('yearly')"
              class="btnelse"
              :class="{ active: activeButton === 'yearly' }"
            >
              {{ $t("yearly") }}
            </button>
            <button
              @click="settime('alltime')"
              class="btnelse"
              :class="{ active: activeButton === 'alltime' }"
            >
              {{ $t("all") }}
            </button>
          </div>
          <div class="mobile-dropdown" v-if="select == 0">
            <select @change="settime($event.target.value)" v-model="activeButton">
              <option value="hour">{{ $t("hour") }}</option>
              <option value="daily">{{ $t("day") }}</option>
              <option value="weekly">{{ $t("week") }}</option>
              <option value="monthly">{{ $t("month") }}</option>
              <option value="alltime">{{ $t("alltime") }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="graphic">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import LoadingSpinner from "./LoadingSpinner.vue";

Chart.register(...registerables);

export default {
  props: {
    select: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      title: ["btcg", "profit", "hash", "hosting_cost"],
      price: 99888,
      activeButton: "weekly",
      chart: null,
      chartData: [],
      isLoading: false,
    };
  },
  components: {
    LoadingSpinner,
  },
  methods: {
    settime(route){
      
      if (this.isLoading) return; // Защита от повторных вызовов
      this.isLoading = true;
        setTimeout(() => {
          this.fetchUsers(route);
        }, 500);
    },
    async fetchUsersDash() {

    const url = '/stats/dashboard' 

  

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

  try {
    const response = await axios.get(url, { headers });
    console.log(response.data);
    // Transform data
    this.chartData = this.transformData(response.data);
    this.price = this.chartData.length
      ? this.chartData[this.chartData.length - 1].close
      : this.price;
    this.renderChart();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
},
    async fetchUsers(route) {

    const Urlrouter = {
      hour: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60",
      daily: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24",
      weekly: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=168",
      monthly: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30",
      yearly: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=365",
      alltime: "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w",
    };

    this.activeButton = route;
  

  // const headers = {
  //   Authorization: `Bearer ${localStorage.getItem('token')}`,
  // };

  try {
    const response = await axios.get(Urlrouter[route]);
    console.log(response.data);
    // Transform data
    this.chartData = this.transformData(response.data);
    this.price = this.chartData.length
      ? this.chartData[this.chartData.length - 1].close
      : this.price;
    this.renderChart();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
},

    transformData(apiData) {
      // apiData — массив массивов, где item[0] = timestamp, item[4] = close price (строка)
      return apiData.map((item) => ({
        time: new Date(Number(item[0])),
        close: parseFloat(item[4]),
      }));
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }
      const canvas = this.$refs.chartCanvas;
      if (!canvas) return;
      const ctx = this.$refs.chartCanvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 1); // Fixed height for gradient

      let borderColor = ""; // Variable for line color

      if (this.select === 0) {
        gradient.addColorStop(0, "#0084CFBA"); // Top color
        gradient.addColorStop(1, "rgb(195, 219, 247)"); // Bottom color
        borderColor = "#0084CFBA"; // Line color
      } else if (this.select === 1) {
        gradient.addColorStop(0, "#00CF91BA"); // Top color
        gradient.addColorStop(1, "rgb(175, 243, 232)"); // Bottom color
        borderColor = "#00CF91BA"; // Line color
      } else if (this.select === 2) {
        gradient.addColorStop(0, "#CF0032BA"); // Top color
        gradient.addColorStop(1, "rgb(238, 186, 186)"); // Bottom color
        borderColor = "#CF0032BA"; // Line color
      } else if (this.select === 3) {
        gradient.addColorStop(0, "#0084CFBA"); // Top color
        gradient.addColorStop(1, "rgb(195, 219, 247)"); // Bottom color
        borderColor = "#0084CFBA"; // Line color
      }

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.chartData.map((d) => d.time),
          datasets: [
            {
              label: "Close Price",
              data: this.chartData.map((d) => d.close),
              borderColor: borderColor, // Line color based on select
              backgroundColor: gradient,
              fill: true,
              tension: 0.2,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "PP p",
              },
              title: {
                display: true,
                text: "Date",
              },
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              title: {
                display: true,
                text: "Price ($)",
              },
              beginAtZero: false,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (ctx) => `Close: $${ctx.parsed.y.toFixed(2)}`,
              },
            },
          },
          interaction: {
            mode: "nearest",
            intersect: false,
          },
        },
      });
      setTimeout(() => {
    this.isLoading = false;
      }, 500);
    },
  },
  mounted() {
    if(this.select == 0){
      this.fetchUsers(this.activeButton);
    }else{
      this.fetchUsersDash()
      
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
};
</script>

<style scoped>
.graph-cart {
  width: 100%;
  height: auto;
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #f0f0f5;
  display: flex;
  flex-direction: column;
}
.price {
  color: #cf0032;
}
.left {
  display: flex;
  gap: 10px;
}
.head {
  display: flex;
  justify-content: space-between;
}
.mobile-dropdown option {
  background-color: white;
  color: #272727;
}
.desktop-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.mobile-dropdown select {
  width: 100%;
  background-color: white;
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-size: 16px;
}
.mobile-dropdown {
  display: none;
  border: none;
  background-color: white;
}
@media (max-width: 810px) {
  .head {
    flex-direction: column;
  }
}
@media (max-width: 570px) {
  .desktop-buttons {
    display: none;
  }
  .mobile-dropdown {
    display: block;
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    font-size: 16px;
  }
}
.active {
  background-color: #cf00321a;
  color: red !important;
}
.btnelse {
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: #27272766;
}
.wrapper-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}
@media (max-width: 570px) {
  .wrapper-btns {
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: stretch;
  }
  .wrapper-btns button {
    flex: 25%;
  }
}
@media (max-width: 380px) {
  .wrapper-btns {
    flex-direction: column;
  }
}
.graphic {
  flex: 1;
  position: relative;
  margin-top: 10px;
}
.graphic canvas {
  width: 100% !important;
  height: 100% !important;
}
@media (max-width: 1500px) and (min-width: 900px) {
  .graphic canvas {
    width: 100% !important;
    height: 270px !important;
  }
}
@media (max-width: 500px) and (min-width: 300px) {
  .graphic canvas {
    width: 100% !important;
    height: 150px !important;
  }
}
.nocanvas {
  display: none;
}
</style>
