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
   TextWrappingType,
   LevelFormat,
   convertInchesToTwip
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
   numbering: {
      config: [{
         reference: "numbering",
         levels: [

            {
               level: 1,
               format: LevelFormat.DECIMAL,
               text: "%2.",
               alignment: AlignmentType.START,
               style: {
                  paragraph: {
                     indent: {
                        left: convertInchesToTwip(0.5),
                        hanging: convertInchesToTwip(0.2),
                     },
                  },
               },
            },
         ],
      }, ],
   },
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
                  bold: true,
                  size: 30,
                  allCaps: true,
                  underline: {
                     type: UnderlineType.SINGLE
                  }
               })
            ],
            alignment: AlignmentType.CENTER,
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
                  text: " No. 5235890508250",
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: " Tgl ",
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
                  size: 24,
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.SINGLE
                  }
               })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
               before: 400,
               after: 400
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Tiket Pesawat/ PLANE (PP)",
                  font: 'Calibri',
                  size: 22
               })
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "\tDari ................\tke ................\tRp ................",
                  font: 'Calibri',
                  size: 22
               })
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 740,
               },
               {
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Tiket Ferry/ Jet Foil (PP)",
                  font: 'Calibri',
                  size: 22
               })
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "\tDari ................\tke ................\tRp ................",
                  font: 'Calibri',
                  size: 22
               })
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 740,
               },
               {
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya (.............................................)",
                  font: 'Calibri',
                  size: 22
               })
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "\tDari ................\tke ................\tRp ................",
                  font: 'Calibri',
                  size: 22
               })
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 740,
               },
               {
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Taxi Dari Rumah ke Bandara ke Hotel(PP)\tRp ................",
                  font: 'Calibri',
                  size: 22
               })
            ],
            tabStops: [{
               type: TabStopType.LEFT,
               position: TabStopPosition.MAX
            }],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Transport Darat(PP)",
                  font: 'Calibri',
                  size: 22
               })
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "\tDari ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "Palembang",
                  size: 22,
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "\tke ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "Oki",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "\tRp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "410.000",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 740,
               },
               {
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ]
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Tol(PP)",
                  font: 'Calibri',
                  size: 22
               })
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "\tDari ................\tke ................\tRp ................",
                  font: 'Calibri',
                  size: 22
               })
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 740,
               },
               {
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Bahan Bakar Minyak (PP)",
                  font: 'Calibri',
                  size: 22
               })
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "\tDari ................\tke ................\tRp ................",
                  font: 'Calibri',
                  size: 22
               })
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 740,
               },
               {
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Representasi\t",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "3 (Hari) ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "x  Rp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "75.000 ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "\tRp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "225.000 ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Uang Harian Selama Dalam Provinsi\t",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "3 (Hari) ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "x  Rp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "75.000 ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "\tRp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "225.000 ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Uang Harian Selama Luar Provinsi\t",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "........ ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "x  Rp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "........ ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "\tRp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "................",
                  font: 'Calibri',
                  size: 22
               }),
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Uang Penginapan atau Hotel\t",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "3 (Hari) ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "x  Rp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "75.000 ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
               new TextRun({
                  text: "\tRp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "225.000 ",
                  font: 'Calibri',
                  size: 22,
                  underline: {
                     type: UnderlineType.DOTTED
                  }
               }),
            ],
            tabStops: [{
                  type: TabStopType.LEFT,
                  position: 5000
               },
               {
                  type: TabStopType.LEFT,
                  position: TabStopPosition.MAX
               }
            ],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Biaya Rapid Tes/ Antigen/ Genose\t",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "\tRp ",
                  font: 'Calibri',
                  size: 22
               }),
               new TextRun({
                  text: "................ ",
                  font: 'Calibri',
                  size: 22
               }),
            ],
            tabStops: [{
               type: TabStopType.LEFT,
               position: TabStopPosition.MAX
            }],
            numbering: {
               reference: "numbering",
               level: 1,
            },
            spacing: {
               before: 300
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "Jumlah  ",
                  size: 22,
                  font: 'Calibri',
               }),
               new TextRun({
                  text: "Rp 3.245.666",
                  size: 22,
                  font: 'Calibri',
                  underline: {
                     type: UnderlineType.SINGLE
                  }
               })
            ],
            alignment: AlignmentType.RIGHT,
            spacing: {
               before: 300
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
               before: 800
            }
         }),
         new Paragraph({
            children: [
               new TextRun({
                  text: "H. Toyeb Rakembang, S.Ag",
                  size: 24,
                  font: 'Calibri'
               })
            ], alignment : AlignmentType.RIGHT,
            spacing: {
               before: 1200
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