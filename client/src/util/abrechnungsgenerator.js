import { jsPDF } from "jspdf";

let pagenumber = 1
let pagecount

let posNextLine
let laufnummer = 0

let _startdate
let _enddate

const tableTopMargin = 10

async function createListe(group, attendanceList, filename, startdate, enddate) {
  let doc = new jsPDF({ unit: 'pt', orientation: "landscape", autoFirstPage: false });

  _startdate = startdate
  _enddate = enddate

  let splicedArray = {}

  if (attendanceList.dates.length != 0){
    const pagesForDates = Math.ceil(attendanceList.dates.length / 26)
    const pagesForParticipants = Math.ceil(attendanceList.participants.length / 31)

    
    pagecount = pagesForDates * pagesForParticipants

    for (let i = 0; i < pagesForParticipants; i++) {
      splicedArray.participants = attendanceList.participants.splice(0, 31)
      for (let j = 0; j < pagesForDates; j++) {
        laufnummer = i * 31
        splicedArray.dates = attendanceList.dates.slice(j * 26, (j + 1) * 26)
        generatePage(doc, group, splicedArray)
        if ((j + 1) < pagesForDates) doc.addPage({ orientation: "landscape", autoFirstPage: false })
      }
      if ((i + 1) < pagesForParticipants) doc.addPage({ orientation: "landscape", autoFirstPage: false })
    }
  } else {
    pagecount = 1
    generateHeader(doc);
    generateGroupInfo(doc, group);

    doc
      .setFontSize(12)
      .setFont('helvetica', "bold")
      .text("Es wurden keine Teilnehmerlisten in der gewählten Zeitspanne gefunden!", 20, posNextLine + 40)
    
    generateFooter(doc)
  }

  doc.save(filename)
}

//INFO Aufteilung Koordinaten erst Horizontale Verschiebung (x) dann Vertikale (y)
//INFO Es wird von linker oberer Ecke gemessen

function generatePage(doc, group, attendanceList) {
  generateHeader(doc);
  generateGroupInfo(doc, group);
  generateTable(doc, attendanceList)
  generateFooter(doc)
}

function generateHeader(doc) {
  _startdate = new Date(_startdate).toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
  _enddate = new Date(_enddate).toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })

  posNextLine = 30

  doc.setFontSize(20)
    .setFont('helvetica', "bold")
    .text("Teilnehmerliste", 20, posNextLine)
    .setFontSize(12)
    .text(`Vom ${_startdate} bis ${_enddate}`, 180, posNextLine)
    .addImage("./img/logo.png", "PNG", doc.internal.pageSize.getWidth() - 105, 10, 75, 56);
}

function generateGroupInfo(doc, group) {
  posNextLine += 45
  let trainingszeiten = ""
  for (const obj of group.times) {
    trainingszeiten = trainingszeiten + obj.day.charAt(0) + obj.day.charAt(1) + '. ' + obj.starttime + " - " + obj.endtime + " Uhr  "
  }

  let trainer = ""
  for (const obj of group.trainers) {
    trainer = trainer + obj.name + " "
  }

  let assistent = ""
  for (const obj of group.assistent) {
    assistent = assistent + obj.name + " "
  }

  doc
    .setFontSize(10)
    .setFont('helvetica', "bold")
    .text(`Gruppe: ${group.name}`, 20, posNextLine, { maxWidth: 150 })
    .text(`Trainingszeiten: ${trainingszeiten}`, 170, posNextLine, { maxWidth: 461.89 })
    .text(`Ort: ${group.venue}`, 631.89, posNextLine, { maxWidth: 150 })

  posNextLine += 20

  doc
    .text(`Abteilung: ${group.department.name}`, 20, posNextLine, { maxWidth: 150 })
    .text(`Verantw. ÜL.: ${trainer}`, 170, posNextLine, { maxWidth: 326 })
  if (assistent.length !== 0){
    doc.text(`Assistent: ${assistent}`, 496, posNextLine, { maxWidth: 326 })
  }
}

function generateTable(doc, attendanceList) {
  generateTableHeader(doc)
  generateDateRow(doc, attendanceList.dates)
  generateParticipantRows(doc, attendanceList.dates, attendanceList.participants)
}


function generateTableHeader(doc) {
  posNextLine += 30

  //Height: 7.3
  doc
    .setFont('helvetica', "bold")
    .text("Nr", 20, posNextLine, { maxWidth: 21 })
    .text("Name, Vorname", 45, posNextLine, { maxWidth: 200.89 })
    .text("Datum", 249.89, posNextLine, { maxWidth: 568 })

  drawBox(doc, 18, posNextLine - tableTopMargin, 25, 13.3)
  drawBox(doc, 43, posNextLine - tableTopMargin, 204.89, 13.3)
  drawBox(doc, 247.89, posNextLine - tableTopMargin, 572, 13.3)
}

function generateDateRow(doc, dates) {
  posNextLine += 13.3
  doc
    .text("", 20, posNextLine, { maxWidth: 25 })
    .text("", 45, posNextLine, { maxWidth: 204.89 })

  let xPos = 249.89
  for (let i = 0; i < 26; i++) {
    if (i < dates.length) {
      dates[i] = new Date(dates[i])
      //Height: 20.6
      doc
        .setFont('helvetica', "normal")
        .text(`${dates[i].getDate()}.`, xPos + 9, posNextLine, { maxWidth: 18, align: 'center' })
        .text(`${dates[i].getMonth() + 1}.`, xPos + 9, posNextLine + 11.3, { maxWidth: 18, align: 'center' })
        .setDrawColor("#000000")
        .line(xPos + 2, posNextLine + 2, xPos + 16, posNextLine + 2)
    }
    drawBox(doc, xPos - 2, posNextLine - tableTopMargin, 22, 25.6)
    xPos += 22
  }
}

function generateParticipantRows(doc, dates, participants) {
  posNextLine += 25.6

  for (let i = 0; i < participants.length; i++) {
    doc
      .setFont('helvetica', "normal")
      .text(`${laufnummer += 1}.`, 20, posNextLine, { width: 21, height: 7.3 })
      .text(`${participants[i].lastname}, ${participants[i].firstname}`, 45, posNextLine, { width: 200.89, height: 7.3 })
    drawBox(doc, 18, posNextLine - tableTopMargin, 25, 13.3)
    drawBox(doc, 43, posNextLine - tableTopMargin, 204.89, 13.3)

    generateAttendanceBox(doc, dates, participants[i])

    posNextLine += 13.3
  }
}

function generateAttendanceBox(doc, dates, participant) {
  //TODO Bug hier?
  let xPos = 249.89
  for (let i = 0; i < dates.length; i++) {
    dates[i] = new Date(dates[i])
    const temp = participant.attendance.find(foo => {
      foo.date = new Date(foo.date)
      if (foo.date.toJSON() === dates[i].toJSON()) {
        return foo
      }

    })

    if (typeof temp === 'undefined') {
      doc
        .text("", xPos, posNextLine, { width: 18, height: 7.3 })
    } else {
      doc
        .setFont('helvetica', "bold")
        .text(`${temp.attended === true ? 'x' : '-'}`, xPos + 9, posNextLine, { width: 18, height: 7.3, align: 'center' })
        .setFont('helvetica', "normal")
    }
    drawBox(doc, xPos - 2, posNextLine - tableTopMargin, 22, 13.3)
    xPos += 22
  }
}

function generateFooter(doc) {
  const today = new Date(Date.now()).toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })

  doc
    .setFontSize(10)
    .text(
      `Liste am ${today} erstellt.`,
      20,
      doc.internal.pageSize.getHeight() - 15
    )
    .text(
      `Seite ${pagenumber} von ${pagecount}`,
      doc.internal.pageSize.getWidth() - 90,
      doc.internal.pageSize.getHeight() - 15,
      { align: 'left' }
    )
}

function drawBox(doc, x, y, width, height) {
  doc
    .setDrawColor("#000000")
    .rect(x, y, width, height)
}

export {
  createListe
};