export const PI = Math.PI

export const getDistance = (pointA: Point, pointB: Point) => {
  'worklet'
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2),
  )
}

export const point2angle = (
  circleCenter: Point,
  radius: number,
  point: Point,
) => {
  'worklet'
  const startPoint = {
    x: circleCenter.x + radius,
    y: circleCenter.y,
  }

  const a = getDistance(circleCenter, startPoint)
  const b = getDistance(circleCenter, point)
  const c = getDistance(point, startPoint)

  const cosOfAngle =
    (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b)

  if (point.y <= circleCenter.y) {
    return Math.acos(cosOfAngle)
  } else {
    return 2 * PI - Math.acos(cosOfAngle)
  }
}

export const polar2point = (
  circleCenter: Point,
  radius: number,
  alpha: number,
) => {
  'worklet'
  return {
    x: circleCenter.x + radius * Math.cos(alpha),
    y: circleCenter.y - radius * Math.sin(alpha),
  }
}
