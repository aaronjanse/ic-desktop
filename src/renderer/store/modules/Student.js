const state = {
  student: null,
  courses: null,
  recent: null
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
  }
}

export default {
  state,
  mutations
}
