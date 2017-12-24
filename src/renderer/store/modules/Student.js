const state = {
  student: null,
  courses: null
}

const mutations = {
  setStudent (state, student) {
    state.student = student
  },

  setCourses (state, courses) {
    state.courses = courses
  }
}

export default {
  state,
  mutations
}
