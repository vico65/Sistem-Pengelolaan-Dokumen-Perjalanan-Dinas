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
   //          size: 1000,
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
         column: {
            space: 200,
            count: 2,
            separate: true,
            equalWidth: false,
            children: [new Column({
               width: 2880,
               space: 200
            }), new Column({
               width: 7060
            })],


         },
         page: {
            size: {
               orientation: PageOrientation.PORTRAIT,
               height: convertMillimetersToTwip(175),
               width: convertMillimetersToTwip(200),
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
                  children: ["Gu 16"],
                  allCaps: true,
                  font: 'Calibri',
                  bold: true
               }), new ImageRun({
                  data: fs.readFileSync("./public/img/logo.png").toString("base64"),
                  transformation: {
                     width: 100,
                     height: 100,
                  },
                  floating: {
                     horizontalPosition: {
                        offset: 800000,
                     },
                     verticalPosition: {
                        offset: 300000,
                     },
                     wrap: {
                        type: TextWrappingType.SQUARE,
                        side: TextWrappingSide.BOTH_SIDES,
                     },
                  },

               }),
            ],
            alignment: AlignmentType.CENTER

         }),
         new Paragraph({
            children: [
               new TextRun({
                  children: ["Sekretariat dprd provinsi sumatera selatan"],
                  allCaps: true,
                  font: 'Calibri',
                  bold: true
               })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
               before: 200
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  children: ['setuju dibayar'],
                  allCaps: true,
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
               before: 400
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'Sekretaris DPRD Provinsi ',
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'Sumatera Selatan',
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'Atasan Langsung',
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'Ramadhan M. User',
                  bold: true,
                  allCaps: true,
                  font: 'Calibri',
               }),
            ],
            spacing: {
               before: 1000
            },
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'NIP : 090419204109409',
                  bold: true,
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: '\"Lunas dibayar\"',
                  allCaps: true,
                  bold: true,
                  font: 'Calibri',
                  size: 28
               }),
            ],
            spacing: {
               before: 1000,
            },
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'Bendahara Pengeluaran',
                  bold: true,
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'Rosprida Waty Sipayung, SE ,M.Si',
                  bold: true,
                  allCaps: true,
                  font: 'Calibri',
               }),
            ],
            spacing: {
               before: 800
            },
            alignment: AlignmentType.CENTER
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: 'NIP : 090419204109409',
                  bold: true,
                  font: 'Calibri',
               }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
               after: 600
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Asli",
                  allCaps: true,
                  bold: true,
                  underline: {
                     type: UnderlineType.SINGLE
                  }
               })
            ],
            alignment: AlignmentType.RIGHT,

         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Kwitansi",
                  bold: true,
                  allCaps: true,
                  size: 30,
               })
            ],
            alignment: AlignmentType.CENTER,
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Bukti No. : ",
                  font: "Calibri"
               }),
               new TextRun({
                  text: "24665",
                  font: "Calibri",
                  underline: {
                     type: UnderlineType.DOTTEDHEAVY,
                  }
               })
            ],
            alignment: AlignmentType.RIGHT,
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Tahun Anggaran \t: 2022",
                  font: 'Calibri',
               })
            ],
            alignment: AlignmentType.LEFT,
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Kode Rekening\t: 4.5.5235525.55",
                  font: 'Calibri',
               })
            ],
            alignment: AlignmentType.LEFT,
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Dibukukan Tanggal\t: ",
                  font: 'Calibri',
               }),
               new TextRun({
                  text: "26 Sept. 2022",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTEDHEAVY
                  }
               })
            ],
            alignment: AlignmentType.LEFT,
            border: {
               bottom: {
                  color: "auto",
                  space: 1,
                  style: "single",
                  size: 6,
              },
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Sudah terima dari\t:",
                  allCaps: true, 
                  font: 'Calibri',
                  size: 24
               }),
               new TextRun({
                  text: "\tPengguna Anggaran",
                  font: 'Calibri',
                  size: 24
               })
            ], alignment : AlignmentType.LEFT,
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Uang banyaknya\t:",
                  allCaps: true, 
                  font: 'Calibri',
                  size: 24
               }),
               new TextRun({
                  text: "\tTiga juta enam ratus dua puluh empat ribu delapan ratus rupiah",
                  font: 'Calibri',
                  bold: true,
                  size: 24
               })
            ], alignment : AlignmentType.LEFT,
            spacing: {
               before: 200,
               line: 400
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "yaitu untuk pembayaran :\t",
                  allCaps: true,
                  font: 'Calibri',
                  size: 24
               }),
               new TextRun({
                  text: "Biaya perjalanan dinas berdasarkan surat tugas pimpinan DPRD Provinsi Sumsel Tanggal 14 September 2022, No. 090/424242424/DD/Setwan/2022 dan SPPD No.090/823405802805/528058250 ke Kab. OKI di Kayu Agung PP pada tanggal 22 s.d 24 September 2022",
                  font: 'Calibri',
                  size: 24,
                  underline: UnderlineType.DOTTEDHEAVY
               })
            ], alignment : AlignmentType.LEFT,
            spacing: {
               before: 300,
               line: 350
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Palembang, 16 September 2022",
                  size: 24,
                  font: 'Calibri'
               })
            ], alignment : AlignmentType.RIGHT,
            spacing: {
               before: 600
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Rp.\t\t3.642.700,-",
                  size: 24,
                  bold: true
               })
            ], alignment : AlignmentType.LEFT,
            spacing: {
               before: 800
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "H. Toyeb Rakembang, S.Ag",
                  size: 24,

               })
            ], alignment : AlignmentType.RIGHT,
         }),
      ]
   }],
});

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
   fs.writeFileSync("coba.docx", buffer);
});

// Done! A file called 'My Document.docx' will be in your file system.