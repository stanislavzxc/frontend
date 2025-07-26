<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export default {
  name: "AppDashboard",
  components: { Line },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  props: {
    chartData: Object,
    name: String,
  },
  mounted() {
    console.log(this.chartData);
  },
};
</script>
<template>
  <div class="wrap-chart">
    <h2>{{ name }}</h2>
    <Line class="line" :data="chartData" :options="options" ref="chart" />
  </div>
</template>
<style scoped>
.line {
  max-height: 400px;
}

.wrap-chart {
  background-color: #fff;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: fit-content;
}

@media (max-width: 520px) {
  .wrap-chart {
    padding: 10px;
  }
}
</style>
