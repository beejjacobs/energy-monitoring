import {computeMidPoint, computePower} from '@/store/util';

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
      const url = `http://192.168.0.2:9000/render?from=${date}&target=summarize(energy.wh.count,"1min")&format=json`;
      const res = await fetch(encodeURI(url));
      const targets = await res.json();
      const target = targets.find(t => t.tags.name === 'energy.wh.count');
      if (!target) {
        throw new Error(`energy.wh.count not returned got ${targets}`);
      }
      const points = target.datapoints.map(dp => {
        return {
          time: dp[1],
          value: dp[0]
        };
      }).reverse();

      console.log('getForDate', points);

      commit('setData', points);
    }
  }
};
