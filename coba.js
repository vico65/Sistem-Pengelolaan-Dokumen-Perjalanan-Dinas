import * as fs from "fs";
import pkg from 'docx';
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
   WidthType
} = pkg;

// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section

const createTableCell = (strings, columnSpan = 1, rowSpan = 1) => {
   return new TableCell({
      margins: {
         right: 50,
         left: 50,
         top: 10, 
         bottom: 10
      },
      rowSpan,
      columnSpan
      ,children: createParagraphs(strings),
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

   if(typeof strings === 'object') 
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

const doc = new Document({
   sections: [{
      properties: {
         column: {
            space: 708,
            count: 2,
         },
         page: {
            size: {
               orientation: PageOrientation.LANDSCAPE
            },
            margin: {
               left: 500,
               right: 500
            }
         },
      },
      children: [
         new Table({
            rows: [
               createTableRow(
                  createTableCell('1'),
                  createTableCell('Pejabat berwenang yang memberi perintah'),
                  createTableCell('Sekretaris DPRD provinsi Sumatera Selatan')
               ),
               createTableRow(
                  createTableCell('2'),
                  createTableCell('Nama pegawai yang diperintahkan'),
                  createTableCell('User')
               ),
               createTableRow(
                  createTableCell('3'),
                  createTableCell([
                     'a. Pangkat / Golongan menurut PP No.6 Tahun 1997',
                     'b. Jabatan',
                     'c. Gaji Pokok',
                     'd. Tingkat menurut Peraturan Perjalanan Dinas'
                  ]),
                  createTableCell([
                     'a. -',
                     'b. Anggota komisi I DPRD Prov. Sumsel',
                     'c. -',
                     'd. B'
                  ])
               ),
               createTableRow(
                  createTableCell('4'),
                  createTableCell('Maksud Perjalanan Dinas'),
                  createTableCell('dinas kunjungan kerja komisi I DPRD Prov. Sumsel dalam rangka monitoring progres pemanfaatan sistem adminsitrasi kependudukan (SISMINDUK) dalam Kabupaten Ogan Komering Ilir ke Dinas Kependeudukan dan Pencatatan Sipil Kabupaten Ogan Komering Ilir di Kayuagung'),
               ),
               createTableRow(
                  createTableCell('5'),
                  createTableCell('Alat angkutan yang digunakan'),
                  createTableCell('Kendaraan Dinas / Umum '),
               ),
               createTableRow(
                  createTableCell('6'),
                  createTableCell([
                     'a. Tempat Berangkat ',
                     'b. Tempat Tujuan'
                  ]),
                  createTableCell([
                     'a. Palembang',
                     'b. Kayuagung, PP'
                  ]),
               ),
               createTableRow(
                  createTableCell(7),
                  createTableCell([
                     'a. Lamanya Perjalanan Dinas ',
                     'b. Tanggal berangkat ',
                     'c. Tanggal harus kembali'
                  ]),
                  createTableCell([
                     'a. 3(Tiga) hari ',
                     'b. 22 september 2022',
                     'c. 24 september 2022'
                  ]),
               ),
               createTableRow(
                  createTableCell('8'),
                  createTableCell([
                     'Pengikut',
                     '1. ',
                     '2. ',
                     '3. '
                  ]),
                  createTableCell([
                     'Umur / Hubungan Keluarga',
                     '',
                     '',
                     ''
                  ]),
               ),
               createTableRow(
                  createTableCell('9'),
                  createTableCell([
                     'Pembebanan Anggaran',
                     'a. Instansi',
                     'b. Nomor Rekening'
                  ]),
                  createTableCell([
                     '',
                     'a. Sekretariat DPRD Prov. Sumsel',
                     'b. 123456789'
                  ]),
               ),
               createTableRow(
                  createTableCell('10'),
                  createTableCell('Keterangan lain-lain ', 2),
               ),
               createTableRow(
                  createTableCell('I. ', 2),
                  createTableCell([
                     'Berangkat dari : Palembang DPRD Prov. Sumsel',
                     'Pada Tanggal   : September 2022',
                     'Ke             : Kayuagung'
                  ]),
               ),
               createTableRow(
                  createTableCell([
                     'Tiba di      : Kayuagung',
                     'Pada tanggal : September 2022'
                  ], 2),
                  createTableCell([
                     'Berangkat dari : Kayuagung',
                     'Pada Tanggal   : September 2022'
                  ]),
               ),
               createTableRow(
                  createTableCell([
                     'Tiba di      : Kayuagung',
                     'Pada tanggal : September 2022'
                  ], 2),
                  createTableCell('Telah diperiksa dengan keterangan bahwa perjalanan tersebut diatas benar dilakukan atas perintahnya dan semata-mata untuk kepetningan jabatan dalam waktu yang sesingkat-singkatnya. Pejabat yang memberi perintah')
               ),

            ]
         })
      ],
   }],
});

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
   fs.writeFileSync("coba.docx", buffer);
});

// Done! A file called 'My Document.docx' will be in your file system.