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
    this.loginUrl = loginUrl

    // derive baseUrl, appName, and verifyUrl from loginUrl
    this.baseUrl = loginUrl.split('/')
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
      .then(this._extractUserData.bind(this))
      .then(this._loadSchedule.bind(this))
  }

  getRecentAssignments = () => {
    return fetch(this.gradesUrl, {
      credentials: 'include'
    })
      .then(response => response.text())
      .then(response => {
        const $ = cheerio.load(response)
        const recentAssignmentsTable = $('.portalTable').eq(1)
        console.log(recentAssignmentsTable)
      })
  }

  // returns promise of Class[]
  getClasses = () => {
    let classPromises = this.classRefs.map(classRef => this._fetchClass(classRef))

    return Promise.all(classPromises)
  }

  // returns promise of Class
  _fetchClass = (classRef) => {
    return fetch(this.baseUrl + classRef.url, {
      credentials: 'include'
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
    fetch(this.scheduleUrl, {
      credentials: 'include'
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
        credentials: 'include'
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
      })
  }
}
