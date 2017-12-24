import Backend from './Backend'

// operates Backend
export default class Student {
  constructor (username, password, loginUrl) {
    this.backend = new Backend(username, password, loginUrl)
  }

  login = () => {
    return this.backend.login()
  }

  // returns promise of Class[]
  getClasses = () => {
    return this.backend.getClasses()
  }

  // returns promise of [{assignment: Assignment, className: string}]
  // className matches the naming of classes returned by getClasses
  getRecentAssignments = () => {
    return this.backend.getRecentAssignments()
  }

  /* returns
  {
    "firstDate": {
      "day": int,
      "month": int, // 0-indexed,
      "year": int
    },
    "lastDate": {
      "day": int,
      "month": int, // 0-indexed,
      "year": int
    },
    "nonInstructionalDays": [
      {
        "day": int,
        "month": int, // 0-indexed,
        "year": int
      }
    ],
    "daysAbsent": [
      {
        "day": int,
        "month": int, // 0-indexed,
        "year": int,
        "reason": str // 1 letter
      }
    ]
  }
  */
  getCalendar = () => {
    return this.backend.getCalendar()
  }
}
