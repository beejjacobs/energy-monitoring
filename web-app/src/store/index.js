import Vue from 'vue'
import Vuex from 'vuex'
import {computeMidPoint, computePower} from '@/store/util';

import day from './day';
import {graphite} from '@/api/graphite';

Vue.use(Vuex)

let intervalId;

export default new Vuex.Store({
  state: {
    data: [],
    today: []
  },
  getters: {
    accumulate(state) {
      let sum = 0;
      return state.data.map(p => sum += p.value);
    },
    dataPoints(state) {
      return state.data.filter(dp => dp.value !== null);
    },
    latestPoint(state, getters) {
      if (getters.dataPoints.length > 1) {
        return getters.dataPoints[0];
      }
      return null;
    },
    allPower(state, getters) {
      if (getters.dataPoints.length < 5) {
        return [];
      }
      const power = [];
      for (let i = 0; i < getters.dataPoints.length; i++) {
        if (i + 5 < getters.dataPoints.length) {
          const points = getters.dataPoints.slice(i, i + 5);

          power.push({
            time: computeMidPoint(points),
            value: computePower(points)
          });
        }
      }
      return power.reverse();
    },
    watts(state, getters) {
      if (getters.dataPoints.length < 5) {
        return 0;
      }
      const last5points = getters.dataPoints.slice(0, 5);
      return computePower(last5points).toFixed(0)
    },
    totalWh(state, getters) {
      return getters.dataPoints.reduce((total, point) => total + point.value, 0);
    },
    totalkWh(state, getters) {
      return getters.totalWh / 1000.0;
    },
    todayWh(state) {
      if (state.today.length === 0) {
        return 0;
      }
      return state.today[0].value;
    }
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setToday(state, today) {
      state.today = today;
    }
  },
  actions: {
    fetch({dispatch}) {
      let tick = 0;
      dispatch('getToday').catch(console.error);
      function run() {
        tick++;
        dispatch('fetchLast5Mins')
            .catch(console.error)
            .finally(() => {
              intervalId = setTimeout(run, 5 * 1000);
            });
        if (tick === 5) {
          dispatch('getToday').catch(console.error);
          tick = 0;
        }
      }
      run();
    },
    clearFetch() {
      clearTimeout(intervalId);
    },
    async fetchLast5Mins({commit}) {
      const points = await graphite.from('-5minutes');
      commit('setData', points);
    },

    async getToday({commit}) {
      const points = await graphite.summarize(new Date(), '1day');
      commit('setToday', points);
    }
  },
  modules: {
    day
  }
});
