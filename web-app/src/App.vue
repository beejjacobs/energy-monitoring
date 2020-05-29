<template>
  <v-app>
    <v-content>
      <v-simple-table style="max-width: 250px;" dense class="ma-4">
        <tr>
          <td><span v-if="latestPoint">Last Pulse</span></td>
          <td class="text-right">
            <span v-if="latestPoint">{{ ((new Date().valueOf() / 1000) - latestPoint.time).toFixed(0) }}s ago</span>
          </td>
        </tr>
        <tr>
          <td>Current Power</td>
          <td class="text-right">{{ watts }} W</td>
        </tr>
        <tr>
          <td>Energy Usage Today</td>
          <td class="text-right">{{ todayWh }} Wh</td>
        </tr>
      </v-simple-table>
      <line-graph :chart-data="chartData" :options="chartOptions"/>
    </v-content>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex';
import LineGraph from './components/LineGraph';

export default {
  name: 'App',
  components: {LineGraph},
  computed: {
    ...mapGetters([
      'accumulate',
      'allPower',
      'latestPoint',
      'todayWh',
      'totalkWh',
      'watts'
    ]),
    chartData() {
      return {
        datasets: [
          {
            label: 'Data One',
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
  },
  beforeDestroy() {
    this.$store.dispatch('clearFetch').catch(console.error);
  }
};
</script>

<style>
  .v-data-table table {
    width: unset;
  }
</style>
