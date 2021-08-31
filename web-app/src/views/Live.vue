<template>
  <v-container>
    <v-simple-table style="max-width: 275px;" dense class="ma-4">
      <tr>
        <td><span v-if="latestPoint">Last Pulse</span></td>
        <td class="text-right" colspan="2">
          <span v-if="latestPoint">{{ (nowSeconds - latestPoint.time).toFixed(0) }}s ago</span>
        </td>
      </tr>
      <tr>
        <td>Current Power</td>
        <td class="text-right">{{ watts }}</td>
        <td>W</td>
      </tr>
      <tr>
        <td>Energy Usage Today</td>
        <td class="text-right">{{ todayWh }}</td>
        <td>Wh</td>
      </tr>
    </v-simple-table>
    <line-graph :chart-data="chartData" :options="chartOptions"/>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';
import LineGraph from '@/components/LineGraph';

export default {
  name: 'Live',
  components: {LineGraph},
  data() {
    return {
      now: new Date(),
      nowIntervalId: null
    };
  },
  computed: {
    ...mapGetters([
      'accumulate',
      'allPower',
      'latestPoint',
      'todayWh',
      'totalkWh',
      'watts'
    ]),
    nowSeconds() {
      return this.now.getTime() / 1000;
    },
    chartData() {
      return {
        datasets: [
          {
            label: 'Power',
            data: this.allPower.map(v => {
              return {
                x: new Date(v.time * 1000),
                y: v.value
              }
            })
          }
        ]
      };
    },
    chartOptions() {
      return {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                second: 'HH:mm:ss'
              },
              unit: 'second'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('fetch').catch(console.error);
    this.nowIntervalId = setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.nowIntervalId);
    this.$store.dispatch('clearFetch').catch(console.error);
  }
};
</script>

<style>
  .v-data-table table{
    width: unset;
  }
</style>
