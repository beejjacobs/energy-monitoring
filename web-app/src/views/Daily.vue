<template>
  <v-container>
    <v-simple-table style="max-width: 275px;" dense class="ma-4">
      <tr>
        <td>Energy Usage Today</td>
        <td class="text-right">{{ totalkWh }}</td>
        <td>kWh</td>
      </tr>
    </v-simple-table>
    <line-graph :chart-data="chartData" :options="chartOptions"/>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';
import moment from 'moment';
import LineGraph from '@/components/LineGraph';

export default {
  name: 'Daily',
  components: {LineGraph},
  computed: {
    ...mapGetters('day', [
      'allPower',
      'totalkWh'
    ]),
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
    const now = moment();
    this.$store.dispatch('day/getForDate', now.format('YYYYMMDD'))
      .catch(console.error);
  }
};
</script>
