import {yearMonthDay} from '@/api/dates';

export class GraphiteClient {
  constructor(url, target = 'energy.wh.count') {
    this.url = url;
    this.target = target;
  }

  summarize(from, interval) {
    if (from instanceof Date) {
      from = yearMonthDay(from);
    }
    return this.request(`${this.render}?from=${from}&target=summarize(${this.target},"${interval}")&format=json`);
  }

  from(from) {
    if (from instanceof Date) {
      from = yearMonthDay(from);
    }
    return this.request(`${this.render}?from=${from}&target=${this.target}&format=json`);
  }

  async request(url) {
    const res = await fetch(encodeURI(url));
    const targets = await res.json();
    const target = targets.find(t => t.target === this.target || t.tags.name === this.target);
    if (!target) {
      throw new Error(`${this.target} not returned got ${targets}`);
    }
    return target.datapoints.map(dp => {
      return {
        time: dp[1],
        value: dp[0]
      };
    }).reverse();
  }

  get render() {
    return `${this.url}/render`;
  }
}

export const graphite = new GraphiteClient('http://192.168.0.8:9000');
