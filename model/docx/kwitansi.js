import * as fs from "fs";
import pkg from 'docx';
import moment from 'moment';

const {
   Document,
   Packer,
   Paragraph,
   TextRun,
   PageOrientation,
   AlignmentType,
   TabStopPosition,
   TabStopType,
   UnderlineType,
   Column,
   ImageRun,
   convertMillimetersToTwip,
   TextWrappingSide,
   TextWrappingType,
   LevelFormat,
   convertInchesToTwip
} = pkg;

const uangTerbilang = (nilai) => {
   nilai = Math.abs(nilai);
   var simpanNilaiBagi = 0;
   var huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
   var temp = "";

   if (nilai < 12) {
      temp = " " + huruf[nilai];
   } else if (nilai < 20) {
      temp = uangTerbilang(nilai - 10) + " Belas";
   } else if (nilai < 100) {
      simpanNilaiBagi = Math.floor(nilai / 10);
      temp = uangTerbilang(simpanNilaiBagi) + " Puluh" + uangTerbilang(nilai % 10);
   } else if (nilai < 200) {
      temp = " Seratus" + uangTerbilang(nilai - 100);
   } else if (nilai < 1000) {
      simpanNilaiBagi = Math.floor(nilai / 100);
      temp = uangTerbilang(simpanNilaiBagi) + " Ratus" + uangTerbilang(nilai % 100);
   } else if (nilai < 2000) {
      temp = " Seribu" + uangTerbilang(nilai - 1000);
   } else if (nilai < 1000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000);
      temp = uangTerbilang(simpanNilaiBagi) + " Ribu" + uangTerbilang(nilai % 1000);
   } else if (nilai < 1000000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000000);
      temp = uangTerbilang(simpanNilaiBagi) + " Juta" + uangTerbilang(nilai % 1000000);
   } else if (nilai < 1000000000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000000000);
      temp = uangTerbilang(simpanNilaiBagi) + " Miliar" + uangTerbilang(nilai % 1000000000);
   } else if (nilai < 1000000000000000) {
      simpanNilaiBagi = Math.floor(nilai / 1000000000000);
      temp = uangTerbilang(nilai / 1000000000000) + " Triliun" + uangTerbilang(nilai % 1000000000000);
   }

   return temp;
}

const cekStringKosongTidak = (tempat_berangkat, tempat_tujuan, string) => {
   if (string == "")
       return "\tDari ................\tke ................\tRp ................"
   else 
      return "\tDari " + tempat_berangkat + "\tke " + tempat_tujuan + "\tRp " + string
}

export const createKwitansi = (nomor_kwitansi, pegawai, sppd, data) => {
   return new Promise((resolve, reject) => {

      let tanggalBerangkat = moment(sppd.tanggal_berangkat)
      let tanggalKembali = moment(sppd.tanggal_kembali)
      let lamaPerjadin = tanggalKembali.diff(tanggalBerangkat, 'days')

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
                           text: "Bukti No. : " + nomor_kwitansi,
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
                           text: "Tahun Anggaran \t: " + moment().format('YYYY'),
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
                           text: "Dibukukan Tanggal\t: " ,
                           font: 'Calibri',
                        }),
                        new TextRun({
                           text: moment().format('DD MMMM YYYY'),
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
                     ],
                     alignment: AlignmentType.LEFT,
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
                           text: "\t" + uangTerbilang(data.besar_uang),
                           font: 'Calibri',
                           bold: true,
                           size: 24
                        })
                     ],
                     alignment: AlignmentType.LEFT,
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
                           text: "Biaya perjalanan dinas berdasarkan  SPPD No.090/"+ data.nomor_sppd +"/SPPD/SETWAN/2023 ke "+ sppd.tempat_tujuan +" pada tanggal "+sppd.tanggal_berangkat+" s.d " + sppd.tanggal_kembali,
                           font: 'Calibri',
                           size: 24,
                           underline: UnderlineType.DOTTEDHEAVY
                        })
                     ],
                     alignment: AlignmentType.LEFT,
                     spacing: {
                        before: 300,
                        line: 350
                     }
                  }),
                  new Paragraph({
                     children: [
                        new TextRun({
                           text: "Palembang, " + moment().format('DD MMMM YYYY'),
                           size: 24,
                           font: 'Calibri'
                        })
                     ],
                     alignment: AlignmentType.RIGHT,
                     spacing: {
                        before: 600
                     }
                  }),
                  new Paragraph({
                     children: [
                        new TextRun({
                           text: "Rp.\t\t" + data.besar_uang,
                           size: 24,
                           bold: true
                        })
                     ],
                     alignment: AlignmentType.LEFT,
                     spacing: {
                        before: 800
                     }
                  }),
                  new Paragraph({
                     children: [
                        new TextRun({
                           text: pegawai.nama,
                           size: 24,

                        })
                     ],
                     alignment: AlignmentType.RIGHT,
                  }),
               ]
            },
            {
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
                           text: "Dasar\t:\tSPPD  Tgl " + moment().format(sppd.tanggal_dikeluarkan),
                           font: 'Calibri'
                        }),
                        new TextRun({
                           text: " No. " + data.nomor_sppd,
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
                           text: "" + pegawai.nama,
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
                           text: pegawai.pangkat,
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
                           text: "",
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
                           text: data.status_perjalanan,
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
                           text: moment().format('YYYY'),
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
                           text: lamaPerjadin,
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
                           text: cekStringKosongTidak(sppd.tempat_berangkat, sppd.tempat_tujuan, data.biaya_tiket_pesawat),
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
                           text: cekStringKosongTidak(sppd.tempat_berangkat, sppd.tempat_tujuan,data.biaya_tiket_ferry),
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
                           text: cekStringKosongTidak(sppd.tempat_berangkat, sppd.tempat_tujuan,data.biaya_tiket_khusus),
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
                           text: "Biaya Taxi Dari Rumah ke Bandara ke Hotel(PP)\tRp " + (data.biaya_taxi.length == 0 ? '................' : data.biaya_taxi),
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
                           text: cekStringKosongTidak(sppd.tempat_berangkat, sppd.tempat_tujuan,data.biaya_transport_darat),
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
                           text: cekStringKosongTidak(sppd.tempat_berangkat, sppd.tempat_tujuan, data.biaya_tol),
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
                           text: cekStringKosongTidak(sppd.tempat_berangkat, sppd.tempat_tujuan,data.biaya_bbm),
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
                           text: lamaPerjadin,
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
                           text: data.biaya_representasi_per_hari,
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
                           text: (data.biaya_representasi_per_hari * lamaPerjadin),
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
                           text: lamaPerjadin,
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
                           text: data.uang_harian_dalam_provinsi,
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
                           text: (data.uang_harian_dalam_provinsi * lamaPerjadin),
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
                     ],
                     alignment: AlignmentType.RIGHT,
                     spacing: {
                        before: 800
                     }
                  }),
                  new Paragraph({
                     children: [
                        new TextRun({
                           text: pegawai.nama,
                           size: 24,
                           font: 'Calibri'
                        })
                     ],
                     alignment: AlignmentType.RIGHT,
                     spacing: {
                        before: 1200
                     }
                  }),

               ]
            }
         ]
      });

      Packer.toBuffer(doc).then((buffer) => {
         fs.writeFileSync("public/data/kwitansi/" + nomor_kwitansi + ".docx", buffer);
         resolve(true)
      });
   })
}