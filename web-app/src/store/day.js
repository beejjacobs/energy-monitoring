import {computeMidPoint, computePower} from '@/store/util';
import {graphite} from '@/api/graphite';

export default {
  namespaced: true,
  state: {
    data: []
  },
  getters: {
    dataPoints(state) {
      return state.data.filter(dp => dp.value !== null);
    },
    allPower(state, getters) {
      if (getters.dataPoints.length < 5) {
        return [];
      }
      const power = [];
      for (let i = 0; i < getters.dataPoints.length; i++) {
        if (i + 2 < getters.dataPoints.length) {
          const points = getters.dataPoints.slice(i, i + 2);

          power.push({
            time: computeMidPoint(points),
            value: computePower(points)
          });
        }
      }
      return power.reverse();
    },
    totalWh(state, getters) {
      return getters.dataPoints.reduce((total, point) => total + point.value, 0);
    },
    totalkWh(state, getters) {
      return getters.totalWh / 1000.0;
    }
  },
  mutations: {
    setData(state, data) {
      state.data = data;
    }
  },
  actions: {
    async getForDate({commit}, date) {
      const points = await graphite.summarize(date, '1min');

      console.log('getForDate', points);

      commit('setData', points);
    }
  }
};
