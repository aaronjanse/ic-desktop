export class Class {
  constructor (name, teacher, sections, gradingScale, isFinalized) {
    this.name = name
    this.teacher = teacher
    this.sections = sections
    this.gradingScale = gradingScale
    this.isFinalized = isFinalized
  }

  get grade () {
    const weightSum = this.sections.reduce(
      (total, section) => total + section.weight,
      0
    )
    if (weightSum === 0) {
      return this.ptsReceived / this.ptsPossible
    } else {
      return this.sections.reduce((total, section) => total + section.grade * section.weight, 0) / weightSum
    }
  }

  get letterGrade () {
    const grade = this.grade
    var currentLetterGrade = null
    for (var letterGrade in this.gradingScale) {
      if (this.gradingScale.hasOwnProperty(letterGrade)) {
        const percent = this.gradingScale[letterGrade]
        if (grade >= percent) {
          if (currentLetterGrade === null || this.gradingScale[currentLetterGrade] < percent) {
            currentLetterGrade = letterGrade
          }
        }
      }
    }
    return currentLetterGrade
  }

  get ptsPossible () {
    return this.sections.reduce(
      (total, section) => total + section.ptsPossible,
      0
    )
  }

  get ptsReceived () {
    return this.sections.reduce(
      (total, section) => total + section.ptsReceived,
      0
    )
  }
}

export class Section {
  constructor (name, weight, assignments) {
    this.name = name
    this.weight = weight
    this.assignments = assignments
  }

  get grade () {
    return this.ptsReceived / this.ptsPossible
  }

  get ptsPossible () {
    return this.assignments.reduce(
      (total, assignment) => total + assignment.ptsPossible * assignment.weight,
      0
    )
  }

  get ptsReceived () {
    return this.assignments.reduce(
      (total, assignment) => total + assignment.ptsReceived * assignment.weight,
      0
    )
  }
}

export class Assignment {
  constructor (name, weight, ptsPossible, ptsReceived, dueDate, assignedDate) {
    this.name = name
    this.weight = weight
    this.ptsPossible = ptsPossible
    this.ptsReceived = ptsReceived
  }

  get grade () {
    return this.ptsReceived / this.ptsPossible
  }
}
