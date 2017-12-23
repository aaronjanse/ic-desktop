const formatAsPercentage = (num, leftpad = 7) => {
  num = Math.round(num * 10000) / 100 + ''
  var value = Number(num)
  var res = num.split('.')
  if (num.indexOf('.') === -1) {
    value = value.toFixed(2)
    num = value.toString()
  } else if (res[1].length < 3) {
    value = value.toFixed(2)
    num = value.toString()
  }
  return (num + '%').padStart(leftpad)
}

export default { formatAsPercentage }
