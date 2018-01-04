export class Class {
  constructor (name, teacher, sections) {
    this.name = name
    this.teacher = teacher
    this.sections = sections

    sections.forEach(section => {
      if (section.weight === null) {
        section.worth = section.ptsPossible / this.ptsPossible
      } else {
        section.worth = section.weight / this.sectionWeightSum
      }
      section.assignments.forEach(assignment => {
        assignment.parentSection = section
      })
    })
  }

  clone () {
    return new Class(this.name, this.teacher, this.sections.map(s => s.clone()))
  }

  get grade () {
    return this.sections.reduce(
      (total, section) => total + section.grade * section.weight,
      0
    ) / this.sectionWeightSum
  }

  get sectionWeightSum () {
    return this.sections.reduce(
      (total, section) => total + section.weight,
      0
    )
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
    this.worth = null
  }

  clone () {
    return new Section(this.name, this.weight, this.assignments.map(a => a.clone()))
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
    this.parentSection = null
  }

  clone () {
    return new Assignment(this.name, this.weight, this.ptsPossible, this.ptsReceived, this.dueDate, this.assignedDate)
  }

  get grade () {
    return this.ptsReceived / this.ptsPossible
  }

  get worth () {
    if (this.ptsPossible > 0) {
      return (this.weight * this.ptsPossible / this.parentSection.ptsPossible) * this.parentSection.worth
    } else {
      return NaN
    }
  }
}
