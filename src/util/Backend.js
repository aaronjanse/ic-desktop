import {
  toUrlString,
  xmlToJson
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
          return `${year}-${month}-${day}`
        })
        var daysAbsent = {}
        code.match(/daysAbsent\[\d+\] = '.+?';/g).forEach(str => {
          const [, month, day, year, reason] = /'(\d\d)\/(\d\d)\/(\d\d\d\d)_(.)'/g.exec(str)
          daysAbsent[`${year}-${month}-${day}`] = reason
        })

        return {
          firstDate: `${firstYear}-${firstMonth}-${firstDay}`,
          lastDate: `${lastYear}-${lastMonth}-${lastDay}`,
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
        const gradeTotal = parseFloat(
          $('td.gridInProgressGrade')
            .last()
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
        if (sections[0].weight === null) {
          const sectionWeight = 1 / sections.length
          sections = sections.map(section => {
            section.weight = sectionWeight
            return section
          })
        }

        const class_ = new Class(classRef.class_name, classRef.teacher_name, sections)

        console.log(gradeTotal, class_.grade)

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
            teacher_name: siblings[3].children[1].data
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
