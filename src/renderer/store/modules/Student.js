const state = {
  student: null,
  courses: null,
  recent: null,
  calendarData: null
}

const mutations = {
  setStudent (state, student) {
    state.student = student
  },

  setCourses (state, courses) {
    state.courses = courses
  },

  setRecentAssignments (state, assignments) {
    state.recent = assignments
  },

  setCalendarData (state, calendarData) {
    state.calendarData = calendarData
  }
}

export default {
  state,
  mutations
}
