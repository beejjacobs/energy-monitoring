export function computePower(points) {
  const total = points.reduce((total, point) => total + point.value, 0);
  const timeSpanSeconds = points[0].time - points[points.length - 1].time;
  return total / (timeSpanSeconds / 3600);
}

export function computeMidPoint(points) {
  const timeSpanSeconds = points[0].time - points[points.length - 1].time;
  return points[0].time - (timeSpanSeconds / 2);
}
