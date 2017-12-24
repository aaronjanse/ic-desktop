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
  'h': 'Honors',
  'pe': 'PE',
  'course': ''
}

export function formatCourseName (str) {
  str = str.toLowerCase()
  str = str.replace(/(\d+)$/, '')
  str = str.replace('span lang', 'spanish language')
  str = str.replace('world his', 'world history')
  str = str.replace('pre calc', 'pre calculus')
  str = str.split(/\s(.+)/)[1].replace(/\w\S*/g, (txt) => {
    if (courseNameWordPresets.hasOwnProperty(txt.toLowerCase())) {
      return courseNameWordPresets[txt.toLowerCase()]
    } else {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }
  })

  if (str.indexOf('Honors') !== -1) {
    str = 'Honors ' + str.replace('Honors', '')
  }

  str = str.trim()

  return str.replace(/(\d+)$/, '')
}
