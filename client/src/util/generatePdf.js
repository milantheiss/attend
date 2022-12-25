import { jsPDF } from "jspdf";
import { fetchAttendanceByDateRange } from '@/util/fetchOperations'

//INFO Buchstaben in Helvetica & Font Size 10 haben ca. eine Zeichenhöhe 7.3 pt

let pagenumber = 1;
let pagecount;

let posNextLine;
let laufnummer = 0;

let _startdate;
let _enddate;

let _userInfo;
let _department;

const tableTopMargin = 10;

class AttendanceListPdf {
  static generatePage(doc, group, attendenceList) {
    this.generateHeader(doc);
    this.generateGroupInfo(doc, group);
    this.generateTable(doc, attendenceList);
    this.generateFooter(doc);
  }

  static generateHeader(doc) {
    _startdate = new Date(_startdate).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" });
    _enddate = new Date(_enddate).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" });

    posNextLine = 30;

    doc
      .setFontSize(20)
      .setFont("helvetica", "bold")
      .text("Teilnehmerliste", 20, posNextLine)
      .setFontSize(12)
      .text(`Vom ${_startdate} bis ${_enddate}`, 180, posNextLine)
      .addImage("./img/logo.png", "PNG", doc.internal.pageSize.getWidth() - 105, 10, 75, 56);
  }

  static generateGroupInfo(doc, group) {
    posNextLine += 45;
    let trainingszeiten = "";
    for (const obj of group.times) {
      trainingszeiten =
        trainingszeiten + obj.day.charAt(0) + obj.day.charAt(1) + ". " + obj.starttime + " - " + obj.endtime + " Uhr  ";
    }

    let trainer = "";
    for (const obj of group.trainer.filter((val) => val.position === "trainer")) {
      trainer = trainer + obj.firstname + " " + obj.lastname + " ";
    }

    let assistant = "";
    for (const obj of group.trainer.filter((val) => val.position === "assistant")) {
      assistant = assistant + obj.firstname + " " + obj.lastname + " ";
    }

    doc
      .setFontSize(10)
      .setFont("helvetica", "bold")
      .text(`Gruppe: ${group.name}`, 20, posNextLine, { maxWidth: 150 })
      .text(`Trainingszeiten: ${trainingszeiten}`, 170, posNextLine, { maxWidth: 461.89 })
      .text(`Ort: ${group.venue}`, 631.89, posNextLine, { maxWidth: 150 });

    posNextLine += 20;

    doc
      .text(`Abteilung: ${group.department.name}`, 20, posNextLine, { maxWidth: 150 })
      .text(`Verantw. ÜL.: ${trainer}`, 170, posNextLine, { maxWidth: 326 });
    if (assistant.length !== 0) {
      doc.text(`Assistent: ${assistant}`, 496, posNextLine, { maxWidth: 326 });
    }
  }

  static generateTable(doc, attendenceList) {
    this.generateTableHeader(doc);
    this.generateDateRow(doc, attendenceList.dates);
    this.generateParticipantRows(doc, attendenceList.dates, attendenceList.participants);
  }

  static generateTableHeader(doc) {
    posNextLine += 30;

    //Height: 7.3
    doc
      .setFont("helvetica", "bold")
      .text("Nr", 20, posNextLine, { maxWidth: 21 })
      .text("Name, Vorname", 45, posNextLine, { maxWidth: 200.89 })
      .text("Datum", 249.89, posNextLine, { maxWidth: 568 });

    drawBox(doc, 18, posNextLine - tableTopMargin, 25, 13.3);
    drawBox(doc, 43, posNextLine - tableTopMargin, 204.89, 13.3);
    drawBox(doc, 247.89, posNextLine - tableTopMargin, 572, 13.3);
  }

  static generateDateRow(doc, dates) {
    posNextLine += 13.3;
    doc.text("", 20, posNextLine, { maxWidth: 25 }).text("", 45, posNextLine, { maxWidth: 204.89 });

    let xPos = 249.89;
    for (let i = 0; i < 26; i++) {
      if (i < dates.length) {
        dates[i] = new Date(dates[i]);
        //Height: 20.6
        doc
          .setFont("helvetica", "normal")
          .text(`${dates[i].getDate()}.`, xPos + 9, posNextLine, { maxWidth: 18, align: "center" })
          .text(`${dates[i].getMonth() + 1}.`, xPos + 9, posNextLine + 11.3, { maxWidth: 18, align: "center" })
          .setDrawColor("#000000")
          .line(xPos + 2, posNextLine + 2, xPos + 16, posNextLine + 2);
      }
      drawBox(doc, xPos - 2, posNextLine - tableTopMargin, 22, 25.6);
      xPos += 22;
    }
  }

  static generateParticipantRows(doc, dates, participants) {
    posNextLine += 25.6;

    for (let i = 0; i < participants.length; i++) {
      doc
        .setFont("helvetica", "normal")
        .text(`${(laufnummer += 1)}.`, 20, posNextLine, { width: 21, height: 7.3 })
        .text(`${participants[i].lastname}, ${participants[i].firstname}`, 45, posNextLine, {
          width: 200.89,
          height: 7.3,
        });
      drawBox(doc, 18, posNextLine - tableTopMargin, 25, 13.3);
      drawBox(doc, 43, posNextLine - tableTopMargin, 204.89, 13.3);

      this.generateAttendanceBox(doc, dates, participants[i]);

      posNextLine += 13.3;
    }
  }

  static generateAttendanceBox(doc, dates, participant) {
    //TODO Bug hier?
    let xPos = 249.89;
    for (let i = 0; i < dates.length; i++) {
      dates[i] = new Date(dates[i]);
      const temp = participant.attendence.find((foo) => {
        foo.date = new Date(foo.date);
        if (foo.date.toJSON() === dates[i].toJSON()) {
          return foo;
        }
      });

      if (typeof temp === "undefined") {
        doc.text("", xPos, posNextLine, { width: 18, height: 7.3 });
      } else {
        doc
          .setFont("helvetica", "bold")
          .text(`${temp.attended === true ? "x" : "-"}`, xPos + 9, posNextLine, {
            width: 18,
            height: 7.3,
            align: "center",
          })
          .setFont("helvetica", "normal");
      }
      drawBox(doc, xPos - 2, posNextLine - tableTopMargin, 22, 13.3);
      xPos += 22;
    }
  }

  static generateFooter(doc) {
    const today = new Date(Date.now()).toLocaleDateString("de-DE", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc
      .setFontSize(10)
      .text(`Liste am ${today} erstellt.`, 20, doc.internal.pageSize.getHeight() - 15)
      .text(
        `Seite ${pagenumber} von ${pagecount}`,
        doc.internal.pageSize.getWidth() - 90,
        doc.internal.pageSize.getHeight() - 15,
        { align: "left" }
      );
  }
}

class InvoicePdf {
  static generatePage(doc, trainingssessions) {
    this.generateHeader(doc);
    this.generateInvoiceTable(doc, trainingssessions);
    this.generateFooter(doc);
  }

  static generateHeader(doc) {
    _startdate = new Date(_startdate).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" });
    _enddate = new Date(_enddate).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" });

    posNextLine = 40;

    //Erste Zeile
    doc
      .setFontSize(20)
      .setFont("helvetica", "bold")
      .text(`Abrechnung`, 40, posNextLine)
      .addImage("./img/logo.png", "PNG", doc.internal.pageSize.getWidth() - 109, 10, 75, 75);

    posNextLine += 25;

    doc.setFontSize(15).setFont("helvetica", "bold").text(`vom ${_startdate} bis ${_enddate}`, 40, posNextLine);

    //Übungsleiter Info Tabelle
    posNextLine += 40;

    doc
      .setFont("helvetica", "bold")
      .setFontSize(10)
      .text(`Name: ${_userInfo.firstname} ${_userInfo.lastname}`, 40, posNextLine, { maxWidth: 350 })
      .text(`ÜL-Nr: TODO`, 394, posNextLine, { maxWidth: 165.28 });

    drawBox(doc, 38, posNextLine - tableTopMargin, 354, 13.3);
    drawBox(doc, 392, posNextLine - tableTopMargin, 169.28, 13.3);

    posNextLine += 13.3;

    doc
      .setFont("helvetica", "bold")
      .setFontSize(10)
      .text(`Abteilung: ${_department.name}`, 40, posNextLine, { maxWidth: 350 });

    drawBox(doc, 38, posNextLine - tableTopMargin, 354, 13.3);
  }

  static generateInvoiceTable(doc, trainingssessions) {
    //Übungsleiter Info Tabelle
    posNextLine += 40;

    //Tabellenkopf
    doc
      .setFont("helvetica", "bold")
      .setFontSize(10)
      .text(`Wochentag`, 40, posNextLine, { maxWidth: 66.8 })
      .text(`Datum`, 110.8, posNextLine, { maxWidth: 66.8 })
      .text(`Uhrzeit`, 181.6, posNextLine, { maxWidth: 66.8 })
      .text(`Stundenzahl`, 252.4, posNextLine, { maxWidth: 66.8 })
      .text(`Anzahl der Teiln.`, 323.2, posNextLine, { maxWidth: 66.8 })
      .text(`Bezeichnung der Gruppe`, 394, posNextLine, { maxWidth: 165.28 });

    //Zeichnet Tabellen Boxen um Text
    for (let i = 38; i < 322; i += 70.8) {
      drawBox(doc, i, posNextLine - tableTopMargin, 70.8, 24.6);
    }
    drawBox(doc, 392, posNextLine - tableTopMargin, 169.28, 24.6);

    posNextLine += 24.6;

    for (const trainingssession of trainingssessions) {
      doc
        .setFont("helvetica", "normal")
        .setFontSize(10)
        .text(`${trainingssession.info.weekday}`, 40, posNextLine, { maxWidth: 66 })
        .text(
          `${new Date(trainingssession.date).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}`,
          110.8,
          posNextLine,
          { maxWidth: 66 }
        )
        .text(`${trainingssession.info.starttime} - ${trainingssession.info.endtime}`, 181.6, posNextLine, {
          maxWidth: 66,
        })
        .text(`${trainingssession.info.length}`, 252.4, posNextLine, { maxWidth: 66.8 })
        .text(`${trainingssession.participantCount}`, 323.2, posNextLine, { maxWidth: 66.8 });

      const groupName =
        trainingssession.info.groupName.length < 28
          ? trainingssession.info.groupName
          : trainingssession.info.groupName.slice(0, 28) + "...";
      doc.text(`${groupName}`, 394, posNextLine, { maxWidth: 165.28 });

      //Zeichnet Tabellen Boxen um Text
      for (let i = 38; i < 322; i += 70.8) {
        drawBox(doc, i, posNextLine - tableTopMargin, 70.8, 13.3);
      }
      drawBox(doc, 392, posNextLine - tableTopMargin, 169.28, 13.3);

      posNextLine += 13.3;
    }
  }

  static generateFooter(doc) {
    const today = new Date(Date.now()).toLocaleDateString("de-DE", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc
      .setFontSize(10)
      .text(`Abrechnung am ${today} erstellt.`, 40, doc.internal.pageSize.getHeight() - 20)
      .text(
        `Seite ${pagenumber} von ${pagecount}`,
        doc.internal.pageSize.getWidth() - 91,
        doc.internal.pageSize.getHeight() - 20,
        { align: "left" }
      );
  }
}

async function createList(group, attendenceList, startdate, enddate, options) {
  if(typeof options.doc === "undefined"){
    options.doc = new jsPDF({ unit: "pt", orientation: "landscape", autoFirstPage: false, compress: true });
  }

  _startdate = startdate;
  _enddate = enddate;

  let splicedArray = [];

  if (attendenceList.dates.length != 0) {
    const pagesForDates = Math.ceil(attendenceList.dates.length / 26);
    const pagesForParticipants = Math.ceil(attendenceList.participants.length / 31);

    pagecount = pagesForDates * pagesForParticipants;

    for (let i = 0; i < pagesForParticipants; i++) {
      splicedArray.participants = attendenceList.participants.splice(0, 31);
      for (let j = 0; j < pagesForDates; j++) {
        laufnummer = i * 31;
        splicedArray.dates = attendenceList.dates.slice(j * 26, (j + 1) * 26);
        AttendanceListPdf.generatePage(options.doc, group, splicedArray);
        if (j + 1 < pagesForDates) options.doc.addPage({ orientation: "landscape", autoFirstPage: false });
      }
      if (i + 1 < pagesForParticipants) options.doc.addPage({ orientation: "landscape", autoFirstPage: false });
    }
  } else {
    pagecount = 1;
    AttendanceListPdf.generateHeader(options.doc);
    AttendanceListPdf.generateGroupInfo(options.doc, group);

    options.doc
      .setFontSize(12)
      .setFont("helvetica", "bold")
      .text("Es wurden keine Teilnehmerlisten in der gewählten Zeitspanne gefunden!", 20, posNextLine + 40);

    AttendanceListPdf.generateFooter(options.doc);
  }

  if(typeof options.filename !== "undefined"){
    options.doc.save(options.filename);
  }
}

/**
 *
 * @param {Object} dataset Dataset, dass vom Backend generiert wird
 */
async function createInvoice(filename, dataset) {
  let doc = new jsPDF({ unit: "pt", orientation: "portrait", autoFirstPage: false, compress: true });

  _startdate = dataset.startdate;
  _enddate = dataset.startdate;
  _userInfo = dataset.userInfo;
  _department = dataset.department;

  if (dataset.trainingssessions.length !== 0) {
    const pages = Math.ceil(dataset.trainingssessions.length / 42);

    for (let i = 0; i < pages; i++) {
      pagecount = i + 1;

      const splicedArray = dataset.trainingssessions.splice(0, 42);
      console.log(splicedArray);

      InvoicePdf.generatePage(doc, splicedArray);

      //Wenn eine weitere Steite benötigt wird
      if (i + 1 < pages) {
        //Muss in if Statement stehen, da sonst das PDF eine leere Seite hat.
        doc.addPage({ orientation: "portrait", autoFirstPage: false });
      } else {
        doc
          .setFont("helvetica", "bold")
          .setFontSize(10)
          .text(`Stundenanzahl gesamt`, 40, posNextLine, { maxWidth: 210.4 })
          .text(`${dataset.totalHours}`, 252.4, posNextLine, { maxWidth: 66.8 });

        drawBox(doc, 38, posNextLine - tableTopMargin, 212.4, 13.3);
        drawBox(doc, 250.4, posNextLine - tableTopMargin, 70.8, 13.3);

        posNextLine += 13.3;

        drawBox(doc, 38, posNextLine - tableTopMargin, 261.64, 39.9);
        drawBox(doc, 299.64, posNextLine - tableTopMargin, 261.64, 39.9);

        posNextLine += 39.9;

        doc
          .setFont("helvetica", "bold")
          .setFontSize(10)
          .text(`Datum/Unterschrift Übungsleiter`, 40, posNextLine, { maxWidth: 261.64 })
          .text(`Datum/Unterschrift Abteilungsleiter`, 301.64, posNextLine, { maxWidth: 261.64 });

        drawBox(doc, 38, posNextLine - tableTopMargin, 261.64, 13.3);
        drawBox(doc, 299.64, posNextLine - tableTopMargin, 261.64, 13.3);
      }
    }

    for(const group of dataset.groups){
      console.log(_startdate);
      console.log(_enddate);
      doc.addPage({ orientation: "l"}); 
      createList(group, await fetchAttendanceByDateRange(group._id, new Date(dataset.startdate), new Date(dataset.enddate)), dataset.startdate, dataset.enddate, {doc: doc})
    }

  } else {
    pagecount = 1;
    InvoicePdf.generateHeader(doc);

    doc
      .setFontSize(12)
      .setFont("helvetica", "bold")
      .text("Es wurden keine Teilnehmerlisten in der gewählten Zeitspanne gefunden!", 20, posNextLine + 40);

    InvoicePdf.generateFooter(doc);
  }

  doc.save(filename);
}

//INFO Aufteilung Koordinaten erst Horizontale Verschiebung (x) dann Vertikale (y)
//INFO Es wird von linker oberer Ecke gemessen

function drawBox(doc, x, y, width, height) {
  doc.setDrawColor("#000000").rect(x, y, width, height);
}

export { createList, createInvoice };
