import {
  toUrlString,
  xmlToJson,
  LoginException
} from './misc'

import {
  Class,
  Section,
  Assignment
} from './DataClasses'

var fetch = require('isomorphic-fetch')
var cheerio = require('cheerio-without-node-native')
var DOMParser = require('xmldom').DOMParser

// maintains state, low-level stuff, etc.
export default class Backend {
  constructor (username, password, loginUrl) {
    this.username = username
    this.password = password
    this.loginUrl = loginUrl.split('?')[0]

    if (this.loginUrl.indexOf('/campus/portal/') === -1) {
      this.loginUrl = this.loginUrl.replace('/campus/', '/campus/portal/')
    }

    // derive baseUrl, appName, and verifyUrl from loginUrl
    this.baseUrl = this.loginUrl.split('/')
    this.appName = this.baseUrl.pop().split('.')[0]
    this.baseUrl.pop()
    this.baseUrl = this.baseUrl.join('/') + '/'
    this.verifyUrl = this.baseUrl + 'verify.jsp'
  }

  login = () => {
    return fetch(
      this.verifyUrl + '?' +
        toUrlString({
          username: this.username,
          password: this.password,
          nonBrowser: true,
          appName: this.appName
        }), {
        method: 'GET',
        credentials: 'include'
      }
    )
      .then(response => {
        this.cookieString = response.headers._headers['set-cookie'].map(cookieStr => cookieStr.split(';')[0]).join('; ')
        return response
      })
      .then(response => response.text())
      .then(response => {
        if (response.indexOf('password-error') !== -1) {
          return Promise.reject(new LoginException('incorrect username')) // that's correct; ic throws a password-error for an incorrect username
        } else if (response.indexOf('ldap: Incorrect Username and/or Password') !== -1) {
          return Promise.reject(new LoginException('incorrect password'))
        } else if (response.indexOf('error') !== -1) {
          return Promise.reject(new LoginException('unknown'))
        }
      })
      .then(this._extractUserData)
      .then(this._loadSchedule)
  }

  getCalendar = () => {
    return fetch(this.attendanceUrl, {
      credentials: 'include',
      headers: {
        cookie: this.cookieString
      }
    })
      .then(response => response.text())
      .then(response => {
        const $ = cheerio.load(response)
        const code = $($('script').toArray()[18]).html()
        const [, firstMonth, firstDay, firstYear] = /var minDate = '(\d\d)\/(\d\d)\/(\d\d\d\d)';/g.exec(code)
        const [, lastMonth, lastDay, lastYear] = /var maxDate = '(\d\d)\/(\d\d)\/(\d\d\d\d)';/g.exec(code)

        const nonInstructionalDays = code.match(/nonInstructionalDays\[\d+\] = '.+?';/g).map(str => {
          const [, month, day, year] = /'(\d\d)\/(\d\d)\/(\d\d\d\d)'/g.exec(str)
          return {
            day: parseInt(day),
            month: parseInt(month) - 1,
            year: parseInt(year)
          }
        })
        const daysAbsent = code.match(/daysAbsent\[\d+\] = '.+?';/g).map(str => {
          const [, month, day, year, reason] = /'(\d\d)\/(\d\d)\/(\d\d\d\d)_(.)'/g.exec(str)
          return {
            day: parseInt(day),
            month: parseInt(month) - 1,
            year: parseInt(year),
            reason: reason
          }
        })

        return {
          firstDate: {
            day: parseInt(firstDay),
            month: parseInt(firstMonth) - 1,
            year: parseInt(firstYear)
          },
          lastDate: {
            day: parseInt(lastDay),
            month: parseInt(lastMonth) - 1,
            year: parseInt(lastYear)
          },
          nonInstructionalDays: nonInstructionalDays,
          daysAbsent: daysAbsent
        }
      })
  }

  getRecentAssignments = () => {
    return fetch(this.gradesUrl, {
      credentials: 'include',
      headers: {
        cookie: this.cookieString
      }
    })
      .then(response => response.text())
      .then(response => {
        const $ = cheerio.load(response)
        var recentAssignmentsTable = $('.portalTable').eq(1).children().children().toArray()

        return recentAssignmentsTable.map(rowObj => {
          const row = $(rowObj)
          const columns = row.children()

          // const howLongAgo = columns.eq(0).text() + columns.eq(1).text()
          const courseName = columns.eq(2).text()
          const assignmentName = columns.eq(3).children().eq(0).text()
          const ptsReceived = parseFloat(columns.eq(4).text())
          const ptsPossible = parseFloat(columns.eq(5).text())
          // const percent = parseFloat(columns.eq(5).text().slice(0, -1))

          // console.log(ptsReceived / ptsPossible, percent)

          const classRef = this.classRefs.filter(ref => ref.class_name.split('-')[0] === courseName.split(' ')[0])[0]
          const className = classRef.class_name

          const assignment = new Assignment(assignmentName, null, ptsPossible, ptsReceived, null, null)

          return {
            className: className,
            assignment: assignment
          }
        })
      })
  }

  // returns promise of Class[]
  getClasses = () => {
    let classPromises = this.classRefs.map(this._fetchClass)
    return Promise.all(classPromises).then(classes_ => classes_.filter(class_ => class_ !== undefined))
  }

  // returns promise of Class
  _fetchClass = (classRef) => {
    return fetch(this.baseUrl + classRef.url, {
      credentials: 'include',
      headers: {
        cookie: this.cookieString
      }
    })
      .then(response => response.text())
      .then(response => {
        const $ = cheerio.load(response)
        const gradingScale = {}
        $('a[name="curve"]').next().children().toArray().slice(3).forEach(row => {
          row = $(row)
          const letterGrade = row.children().eq(0).text()
          const minPercent = row.children().eq(1).text().slice(0, -1)
          if (letterGrade === '') {
            return
          }
          gradingScale[letterGrade] = parseFloat(minPercent) / 100
        })
        const gradeBox = $('td.gridInProgressGrade, td.gridFinalGrade').last()
        const gradeTotal = parseFloat(gradeBox
          .children()
          .last()
          .children()
          .last()
          .text()
          .slice(0, -1)
        )
        var assignmentRows = $('table')
          .first()
          .children()
          .last()
          .children()
          .first()
          .children()
          .eq(14)
          .children()
          .toArray()
        assignmentRows.shift()
        var sections = []
        var sectionName = null
        var sectionWeight = null
        var assignments = null
        assignmentRows.forEach(row => {
          if ('class' in row['attribs']) {
            if ('style' in row['attribs']) {
              // compile the section
              if (sectionName === null) {
                return
              }

              sections.push(
                new Section(sectionName, sectionWeight, assignments)
              )

              sectionName = null
              sectionWeight = null
              assignments = null
            } else if (row['attribs']['class'] === 'gridCellNormal') {
              // add assignment
              const columns = $(row).children()
              const ptsReceived = columns.eq(5).text()
              if (ptsReceived === '') {
                return
              }
              assignments.push(
                new Assignment(
                  columns
                    .eq(0)
                    .children()
                    .text(),
                  parseFloat(columns.eq(3).text()),
                  parseFloat(columns.eq(4).text()),
                  parseFloat(ptsReceived),
                  columns.eq(1).text(),
                  columns.eq(2).text()
                )
              )
            }
          } else {
            const sectionHeaderStr = row['children'][1]['children'][0].data
            if (sectionHeaderStr.includes('weight')) {
              const sectionHeaderPieces = sectionHeaderStr.match(
                /(.+)\(weight:\s(.+)\)/
              )

              sectionWeight = parseFloat(sectionHeaderPieces[2]) / 100
              sectionName = sectionHeaderPieces[1]
            } else {
              sectionWeight = null
              sectionName = sectionHeaderStr
            }
            assignments = []
          }
        })
        if (sections.length === 0) {
          return
        }

        const isFinalized = gradeBox.attr('class') === 'gridFinalGrade'

        const class_ = new Class(classRef.class_name, classRef.teacher_name, sections, gradingScale, isFinalized)

        const diffCalcActual = gradeTotal - Math.floor(class_.grade * 10000) / 100
        if (diffCalcActual !== 0) {
          console.error('Calculated grade does not match scraped grade.')
          console.log('calculated grade: ' + Math.floor(class_.grade * 10000) / 100)
          console.log('scraped grade: ' + gradeTotal)
        }

        return class_
      })
      .catch(err => console.error(err))
  }

  _loadSchedule = () => {
    return fetch(this.scheduleUrl, {
      credentials: 'include',
      headers: {
        cookie: this.cookieString
      }
    })
      .then(response => response.text())
      .then(response => {
        const $ = cheerio.load(response)
        var classLinksElements = $('td.scheduleBody>font>a:first-child')
        classLinksElements = Object.keys(classLinksElements).map(
          key => classLinksElements[key]
        )
        classLinksElements.pop()
        classLinksElements.pop()
        classLinksElements.pop()
        classLinksElements.pop()

        this.classRefs = classLinksElements.map(el => {
          const siblings = el.parent.children

          return {
            url: el['attribs']['href'],
            class_name: siblings[0].children[1].children[0].data,
            teacher_name: siblings[3].children[1].data.trim()
          }
        })
      })
  }

  _extractUserData = () => {
    return fetch(
      this.baseUrl +
        'portal/portalOutlineWrapper.xsl?x=portal.PortalOutline&contentType=text/xml&lang=en', {
        method: 'GET',
        credentials: 'include',
        headers: {
          cookie: this.cookieString
        }
      }
    )
      .then(response => response.text())
      .then(xmlResponse => {
        var xml = new DOMParser().parseFromString(xmlResponse, 'text/xml')
        const response = xmlToJson(xml)
        const responseUserData =
          response['campusRoot']['PortalOutline']['Family']['Student']
        const studentAttribs = responseUserData['@attributes']
        const calendarAttribs = responseUserData['Calendar']['ScheduleStructure']['@attributes']

        this.accountData = {
          personID: studentAttribs['personID'],
          studentFirstName: studentAttribs['firstName'],
          studentLastName: studentAttribs['lastName'],
          schoolID: calendarAttribs['schoolID'],
          calendarID: calendarAttribs['calendarID'],
          structureID: calendarAttribs['structureID'],
          structureName: calendarAttribs['structureName'],
          calendarName: calendarAttribs['calendarName']
        }

        const baseInfoUrl = this.baseUrl + 'portal/portal.xsl?x=portal.PortalOutline&lang=en&' + toUrlString(this.accountData)
        this.gradesUrl = baseInfoUrl + '&mode=grades&x=portal.PortalGrades'
        this.scheduleUrl = baseInfoUrl + '&mode=schedule&x=portal.PortalSchedule&x=resource.PortalOptions'
        this.attendanceUrl = baseInfoUrl + '&mode=attendance&x=portal.PortalAttendance'
      })
  }
}
