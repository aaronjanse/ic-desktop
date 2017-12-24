export function formatAsPercentage (num, leftpad = 7) {
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

const courseNameWordPresets = {
  'ap': 'AP',
  'hon': 'Honors',
  'h': 'Honors'
}

export function formatCourseName (str) {
  return str.split(/\s(.+)/)[1].replace(/\w\S*/g, (txt) => {
    if (courseNameWordPresets.hasOwnProperty(txt.toLowerCase())) {
      return courseNameWordPresets[txt.toLowerCase()]
    } else {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }
  })
}
