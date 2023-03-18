import * as fs from "fs";
import pkg from 'docx';
import moment from 'moment';

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
   UnderlineType
} = pkg;

const createTableCell = (strings, columnSpan = 1) => {
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

export const createSppd = (nomor_sppd, pegawai, data) => {

   return new Promise((resolve, reject) => {
      let tanggalBerangkat = moment(data.tanggal_berangkat)
      let tanggalKembali = moment(data.tanggal_kembali)
      let tanggalTiba = moment(data.tanggal_tiba).format("DD MMMM YYYY")
      let lamaPerjadin = tanggalKembali.diff(tanggalBerangkat, 'days')

      tanggalBerangkat = tanggalBerangkat.format("DD MMMM YYYY")
      tanggalKembali = tanggalKembali.format("DD MMMM YYYY")

      const doc = new Document({
         sections: [{
            headers: {
               default: new Header({
                  children: [new Paragraph({
                        children: [
                           new TextRun({
                              children: ['Surat perintah perjalanan dinas'],
                              allCaps: true,
                              size: 28,
                              bold: true,
                              underline: {
                                 type: UnderlineType.SINGLE
                              }
                           }),
                        ],
                        alignment: AlignmentType.CENTER
                     }),
                     new Paragraph({
                        children: [
                           new TextRun({
                              children: ['Nomor: 090/' + nomor_sppd + '/SPPD/Setwan/' + moment().format('YYYY')],
                              allCaps: true,
                              size: 20
                           }),
                        ],
                        alignment: AlignmentType.CENTER
                     })
                  ],
               }),
            },
            properties: {
               column: {
                  space: 200,
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
                        createTableCell(pegawai.nama)
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
                           'a. ' + pegawai.pangkat,
                           'b. Anggota komisi I DPRD Prov. Sumsel',
                           'c. -',
                           'd. B'
                        ])
                     ),
                     createTableRow(
                        createTableCell('4'),
                        createTableCell('Maksud Perjalanan Dinas'),
                        createTableCell(data.maksud_perjadin),
                     ),
                     createTableRow(
                        createTableCell('5'),
                        createTableCell('Alat angkutan yang digunakan'),
                        createTableCell(data.alat_angkut),
                     ),
                     createTableRow(
                        createTableCell('6'),
                        createTableCell([
                           'a. Tempat Berangkat ',
                           'b. Tempat Tujuan'
                        ]),
                        createTableCell([
                           'a. ' + data.tempat_berangkat,
                           'b. ' + data.tempat_tujuan
                        ]),
                     ),
                     createTableRow(
                        createTableCell('7'),
                        createTableCell([
                           'a. Lamanya Perjalanan Dinas ',
                           'b. Tanggal berangkat ',
                           'c. Tanggal harus kembali'
                        ]),
                        createTableCell([
                           'a. ' + lamaPerjadin,
                           'b. ' + tanggalBerangkat,
                           'c. ' + tanggalKembali
                        ]),
                     ),
                     createTableRow(
                        createTableCell('8'),
                        createTableCell([
                           'Pengikut',
                           '1. ' + data.nama_pengikut1,
                           '2. ' + data.nama_pengikut2,
                           '3. ' + data.nama_pengikut3
                        ]),
                        createTableCell([
                           'Umur / Hubungan Keluarga',
                           data.umur_pengikut1 + ' / ' + data.status_pengikut1,
                           data.umur_pengikut2 + ' / ' + data.status_pengikut2,
                           data.umur_pengikut3 + ' / ' + data.status_pengikut3,
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
                           'a. ' + data.instansi,
                           'b. ' + data.nomor_rekening
                        ]),
                     ),
                     createTableRow(
                        createTableCell('10'),
                        createTableCell('Keterangan lain-lain '),
                        createTableCell(data.keterangan_lain)
                     ),
                     createTableRow(
                        createTableCell('I. ', 2),
                        createTableCell([
                           'Berangkat dari : ' + data.tempat_berangkat,
                           'Pada Tanggal   : ' + tanggalBerangkat,
                           'Ke             : ' + data.tempat_tujuan
                        ]),
                     ),
                     createTableRow(
                        createTableCell([
                           'Tiba di      : ' + data.tempat_tujuan,
                           'Pada tanggal : ' + tanggalTiba
                        ], 2),
                        createTableCell([
                           'Berangkat dari : ' + data.tempat_berangkat,
                           'Pada Tanggal   : ' + tanggalBerangkat
                        ]),
                     ),
                     createTableRow(
                        createTableCell([
                           'Tiba di      : ' + data.tempat_tujuan,
                           'Pada tanggal : ' + tanggalTiba
                        ], 2),
                        createTableCell('Telah diperiksa dengan keterangan bahwa perjalanan tersebut diatas benar dilakukan atas perintahnya dan semata-mata untuk kepentingan jabatan dalam waktu yang sesingkat-singkatnya. Pejabat yang memberi perintah')
                     ),

                  ]
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        children: ["\tDikeluarkan di : Palembang"],
                        allCaps: true,
                        font: 'Calibri'
                     })
                  ],
                  tabStops: [{
                     type: TabStopType.LEFT,
                     position: 1000
                  }],
                  spacing: {
                     before: 200
                  }
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        children: ['\tPada tanggal   : ' + moment().format('DD MMMM YYYY')],
                        allCaps: true,
                        font: 'Calibri'
                     }),
                  ],
                  tabStops: [{
                     type: TabStopType.LEFT,
                     position: 1000
                  }],
                  alignment: AlignmentType.LEFT
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'Sekretaris DPRD Provinsi',
                        allCaps: true,
                        font: 'Calibri'
                     }),
                  ],
                  spacing: {
                     before: 100
                  },
                  alignment: AlignmentType.CENTER
               }),
               new Paragraph({
                  children: [
                     new TextRun({
                        text: 'Sumatera Selatan',
                        allCaps: true,
                        font: 'Calibri'
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
                        font: 'Calibri'
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
                        text: 'Pembina Utama Madya (NIP : 090419204109409)',
                        bold: true,
                        font: 'Calibri'
                     }),
                  ],
                  alignment: AlignmentType.CENTER
               })
            ]
         }],
      });

      Packer.toBuffer(doc).then((buffer) => {
         fs.writeFileSync("public/data/sppd/" + nomor_sppd + ".docx", buffer);
         resolve(true)
      });

   })
}