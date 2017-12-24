export class Class {
  constructor (name, teacher, sections) {
    this.name = name
    this.teacher = teacher
    this.sections = sections
  }

  get grade () {
    const weightSum = this.sections.reduce(
      (total, section) => total + section.weight,
      0
    )
    return this.sections.reduce(
      (total, section) => total + section.grade * section.weight,
      0
    ) / weightSum
  }

  get ptsPossible () {
    return this.sections.reduce(
      (total, section) => total + section.ptsPossible * section.weight,
      0
    )
  }

  get ptsReceived () {
    return this.sections.reduce(
      (total, section) => total + section.ptsReceived * section.weight,
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
