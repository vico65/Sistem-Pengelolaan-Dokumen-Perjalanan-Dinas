import * as fs from "fs";
import pkg from 'docx';
import {
   text
} from "express";
const {
   Document,
   Packer,
   Paragraph,
   TextRun,
   HeadingLevel,
   PageOrientation,
   Table,
   TableRow,
   TableCell,
   BorderStyle,
   VerticalAlign,
   WidthType,
   Alignment,
   AlignmentType,
   Tab,
   TabStopPosition,
   TabStopType,
   Header,
   Underline,
   UnderlineType,
   Column,
   ImageRun,
   convertMillimetersToTwip,
   TextWrappingSide,
   TextWrappingType
} = pkg;

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section

const createTableCell = (strings, columnSpan = 1) => {
   // if (width === true)
   //    return new TableCell({
   //       margins: {
   //          right: 50,
   //          left: 50,
   //          top: 10, 
   //          bottom: 10
   //       },
   //       width: {
   //          size: 2500,
   //          type: WidthType.DXA,
   //       },
   //       columnSpan,
   //       children: createParagraphs(strings),
   //       verticalAlign: VerticalAlign.CENTER
   //    })
   // else 
   return new TableCell({
      margins: {
         right: 50,
         left: 50,
         top: 10,
         bottom: 10
      },
      columnSpan,
      children: createParagraphs(strings),
      verticalAlign: VerticalAlign.CENTER
   })
}

const createParagraph = (string) => {
   return new Paragraph({
      children: [
         new TextRun({
            text: string,
            font: "Calibri",
         })
      ]
   })
}

const createParagraphs = (strings) => {
   let paragraphs = []

   if (typeof strings === 'object')
      strings.forEach(string => {
         paragraphs.push(
            createParagraph(string)
         )
      });
   else
      paragraphs.push(
         createParagraph(strings)
      )

   return paragraphs
}

const createTableRow = (cell1, cell2, cell3) => {
   return new TableRow({
      children: [
         cell1, cell2, cell3
      ]
   })
}

const bla = true
const doc = new Document({
   sections: [{
      properties: {
         page: {
            size: {
               orientation: PageOrientation.PORTRAIT
            },
            margin: {
               left: 500,
               right: 500,
               top: 500,
               bottom: 500
            }
         },
      },
      children: [
         new Paragraph({
            children: [
               new TextRun({
                  text: "Rincian biaya perjalanan dinas",
                  font: 'Calibri',
                  bold : true,
                  size: 30, 
                  allCaps: true,
                  underline: {
                     type: UnderlineType.SINGLE
                  }
               })
            ], alignment : AlignmentType.CENTER,
            spacing: {
               after: 400
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Dasar\t:\tSPPD  Tgl 14 September 2022",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "No. 5235890508250",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "Tgl",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "14 September 2022",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Nama\t:\t",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "H. Toyeb Rakembang, S.Ag.",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Pangkat/Golongan\t:\t",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "loremloremlorem",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Jabatan\t:\t",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "loremloremlorem",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Status Perjalanan\t:\t",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "loremloremlorem",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Tahun Anggaran\t:\t",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "loremloremlorem",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Perjalanan /Hari\t:\t",
                  font: 'Calibri'
               }),
               new TextRun({
                  text: "loremloremlorem",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               })
            ], 
            tabStops: [{
               type: TabStopType.LEFT,
               position: 2500
            }],
            alignment: AlignmentType.LEFT
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Ongkos-ongkos yang dimintakan",
                  allCaps: true, 
                  size: 20,
                  underline: {
                     type: UnderlineType.SINGLE
                  }
               })
            ], alignment : AlignmentType.CENTER,
            spacing: {
               before: 400,
               after: 400
            }
         }),
      ]
   }],
});

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
   fs.writeFileSync("coba.docx", buffer);
});

// Done! A file called 'My Document.docx' will be in your file system.