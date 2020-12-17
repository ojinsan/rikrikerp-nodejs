const AHSProjectUtama = require("../models/AHSProject/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProject/AHSProjectDetail");
const AHSSumberUtama = require("../models/DataSource/AHSSumberUtama");
const HS = require("../models/DataSource/HS");
const Wilayah = require("../models/Wilayah");
const Project = require("../models/Project/Project");
const RABProjectBagian = require("../models/Project/RABProjectBagian");
const RABJudul = require("../models/Project/RABJudul");
const RABDetail = require("../models/Project/RABDetail");

exports.generateExcel = async (req, res, next) => {
  var ID_RAB_PROJECT_BAGIAN = req.query.ID_RAB_PROJECT_BAGIAN;
  var TAHUN = req.query.TAHUN;

  console.log(TAHUN);
  console.log(ID_RAB_PROJECT_BAGIAN);

  // GET RABPB
  var RABPB = await RABProjectBagian[TAHUN].findOne({
    where: {
      ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN,
    },
    include: [
      {
        model: RABJudul[TAHUN],
        request: false,
        include: [
          {
            model: RABDetail[TAHUN],
            request: false,
          },
        ],
      },
    ],
  });

  // GET PROJECT ID, WILAYAH_PROJECT
  var ID_PROJECT = RABPB.ID_PROJECT;

  var ID_WILAYAH = await Project[TAHUN].findOne({
    where: {
      ID_PROJECT: ID_PROJECT,
    },
  }).then((project) => project.ID_WILAYAH);

  // INIT EXCEL ==============================================
  var Excel = require("exceljs");
  var workbook = new Excel.Workbook();
  workbook.creator = "Resa";
  workbook.lastModifiedBy = "Resa";
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);
  workbook.properties.date1904 = true;
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: "visible",
    },
  ];

  // INIT SHEET ==============================================
  var rabsheet = workbook.addWorksheet("RAB");
  var ahssheet = workbook.addWorksheet("AHS");
  var hssheet = workbook.addWorksheet("Acuan Harga Survey");
  //   var worksheet = workbook.getWorksheet("My Sheet");

  // Create Sheet ==============================================
  console.log(RABPB);
  rabsheet = await createRABSheet(rabsheet, res, TAHUN, RABPB);

  [hssheet, rows] = await createHSSheet(hssheet, res, TAHUN, ID_WILAYAH);
  console.log(rows);

  ahssheet = await createAHSPSheet(ahssheet, res, TAHUN, ID_PROJECT, rows);

  // Download the file ==============================================
  // res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "RAB" + TAHUN + ".xlsx"
  );

  console.log("sending back");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

// Create HS Sheet
async function createHSSheet(worksheet, res, TAHUN, ID_WILAYAH) {
  console.log("Create HS Sheet");

  var hs = await HS[TAHUN].findAll({ where: { ID_WILAYAH: ID_WILAYAH } });
  var wilayah = await Wilayah.findOne({ where: { ID_WILAYAH: ID_WILAYAH } });

  worksheet.columns = [
    { header: "No", key: "no", width: 8, outlineLevel: 1 },
    {
      header: "Nama Material",
      key: "namamaterial",
      width: 60,
      outlineLevel: 1,
    },
    { header: "Jenis", key: "type", width: 15, outlineLevel: 1 },
    { header: "Satuan", key: "satuan", width: 15, outlineLevel: 1 },
    { header: "Harga", key: "harga", width: 20, outlineLevel: 1 },
    { header: "Sumber", key: "sumber", width: 80, outlineLevel: 1 },
    { header: "Keterangan", key: "keterangan", width: 80, outlineLevel: 1 },
  ];

  worksheet.mergeCells("A1:G2");
  worksheet.getCell("A1").value = "DAFTAR HARGA BAHAN " + wilayah.WILAYAH;

  var no = worksheet.getColumn("no");
  var namamaterial = worksheet.getColumn("namamaterial");
  var type = worksheet.getColumn("type");
  var satuan = worksheet.getColumn("satuan");
  var harga = worksheet.getColumn("harga");
  var sumber = worksheet.getColumn("sumber");
  var keterangan = worksheet.getColumn("keterangan");

  worksheet.getCell("A4").value = "No";
  worksheet.getCell("B4").value = "Nama Material";
  worksheet.getCell("C4").value = "Jenis";
  worksheet.getCell("D4").value = "Satuan";
  worksheet.getCell("E4").value = "Harga";
  worksheet.getCell("F4").value = "Sumber";
  worksheet.getCell("G4").value = "Keterangan";

  var i = 0;
  var rows = hs.map((onehs) => {
    i = i + 1;
    return {
      rownum: i + 4,
      no: i,
      namamaterial: onehs.URAIAN,
      type: onehs.TYPE,
      satuan: onehs.SATUAN,
      harga: onehs.HARGA,
      sumber: onehs.SUMBER,
    };
  });

  worksheet.addRows(rows);

  return [worksheet, rows];
}

async function createAHSPSheet(worksheet, res, TAHUN, ID_PROJECT, rows) {
  console.log("Create AHSP Sheet");
  //console.log(ID_PROJECT);
  var AHSPs = await AHSProjectUtama[TAHUN].findAll({
    where: { ID_PROJECT: ID_PROJECT },
    include: [
      {
        model: AHSProjectDetail[TAHUN],
        required: false,
        include: [
          {
            model: HS[TAHUN],
            required: false,
          },
        ],
      },
      {
        model: AHSSumberUtama,
        required: false,
      },
    ],
  }).then((AHSUtama) => {
    var newAHSUtama = [];
    AHSUtama.map((satuAHSUtama) => {
      var satuAHSUtamaTemp = JSON.parse(JSON.stringify(satuAHSUtama));
      var satuAHSUtamaDetailTemp =
        satuAHSUtamaTemp["AHS_PROJECT_DETAIL_" + TAHUN + "s"];

      if (satuAHSUtamaDetailTemp.length > 0) {
        var satuAHSUtamaDetailTempTemp = [];
        satuAHSUtamaDetailTemp.map((satuAHSDetail) => {
          const satuAHSDetailTemp = JSON.parse(JSON.stringify(satuAHSDetail));
          const satuHSTemp = satuAHSDetailTemp["HS_" + TAHUN];
          delete satuAHSDetailTemp["HS_" + TAHUN];
          satuAHSDetailTemp["HS"] = satuHSTemp;

          satuAHSUtamaDetailTempTemp.push(satuAHSDetailTemp);
        });
        satuAHSUtamaDetailTemp = satuAHSUtamaDetailTempTemp;
      }

      delete satuAHSUtamaTemp["AHS_PROJECT_DETAIL_" + TAHUN + "s"];
      satuAHSUtamaTemp["AHS_PROJECT_DETAIL"] = satuAHSUtamaDetailTemp;
      newAHSUtama.push(satuAHSUtamaTemp);
    });

    return newAHSUtama;
  });

  //console.log(AHSPs);

  worksheet.columns = [
    { header: "No", key: "no", width: 5, outlineLevel: 1 },
    { header: "No", key: "no2", width: 5, outlineLevel: 1 },
    { header: "No", key: "no3", width: 5, outlineLevel: 1 },
    { header: "No", key: "no4", width: 5, outlineLevel: 1 },
    {
      header: "Uraian",
      key: "ahsputamajudul",
      width: 5,
      outlineLevel: 1,
    },
    { header: "Koef", key: "koefisien", width: 10, outlineLevel: 1 },
    { header: "Satuan", key: "satuan", width: 10, outlineLevel: 1 },
    { header: "Uraian", key: "ahspdetailjudul", width: 60, outlineLevel: 1 },
    { header: "At", key: "at", width: 8, outlineLevel: 1 },
    { header: "Harga Satuan", key: "harga", width: 25, outlineLevel: 1 },
    { header: "Equal", key: "equal", width: 8, outlineLevel: 1 },
    { header: "Total Upah", key: "totalupah", width: 15, outlineLevel: 1 },
    { header: "Total Bahan", key: "totalbahan", width: 15, outlineLevel: 1 },
  ];

  worksheet.mergeCells("A1:M2");
  worksheet.getCell("A1").value = "ANALISA HARGA SATUAN";

  worksheet.mergeCells("A3:E3");
  worksheet.getCell("A3").value = "No";
  worksheet.mergeCells("F3:H3");
  worksheet.getCell("F3").value = "Uraian";
  worksheet.mergeCells("I3:K3");
  worksheet.getCell("I3").value = "Harga Satuan";

  worksheet.getCell("L3").value = "Total Upah";
  worksheet.getCell("M3").value = "Total Bahan";

  // Fill data each AHS Utama
  var i = 3;
  var j = 0;
  AHSPs.forEach((AHSP) => {
    i++;
    j++;
    totalupahsum = 0;
    totalbahansum = 0;

    // Every AHS Utama
    worksheet.addRow({
      no: j,
      ahsputamajudul: AHSP.NAMA_AHS_PROJECT,
    });
    i++;
    worksheet.addRow({
      koefisien: "Satuan:",
      satuan: AHSP.AHS_SUMBER_UTAMA.SATUAN_AHS,
    });

    console.log("===========");
    iinit = i;
    // Now AHS Detail
    AHSP.AHS_PROJECT_DETAIL &&
      AHSP.AHS_PROJECT_DETAIL.forEach((AHSPD) => {
        //console.log(AHSPD);
        i++;

        var hargarownum = findFromHS(rows, "rownum", AHSPD.P_URAIAN);
        //console.log(hargarownum);

        // totalupahsum = totalupahsum + AHSPD.HS.HARGA;
        // totalbahansum =
        //   totalbahansum +

        worksheet.addRow({
          koefisien: AHSPD.P_KOEFISIEN_URAIAN,
          satuan: AHSPD.P_SATUAN_URAIAN,
          ahspdetailjudul: AHSPD.P_URAIAN,
          at: "@",
          harga:
            AHSPD.HS != null
              ? {
                  formula: "='Acuan Harga Survey'!E" + hargarownum,
                  //value: AHSPD.HS.HARGA,
                  value: "='Acuan Harga Survey'!E" + hargarownum,
                }
              : 0,
          equal: "=",
          totalupah:
            AHSPD.P_KELOMPOK_URAIAN == "Upah"
              ? {
                  formula: "=J" + i + "*F" + i,
                  result:
                    AHSPD.P_KOEFISIEN_URAIAN *
                    (AHSPD.HS != null ? AHSPD.HS.HARGA : 0),
                }
              : 0,
          totalbahan:
            AHSPD.P_KELOMPOK_URAIAN == "Bahan"
              ? {
                  formula: "=J" + i + "*F" + i,
                  result:
                    AHSPD.P_KOEFISIEN_URAIAN *
                    (AHSPD.HS != null ? AHSPD.HS.HARGA : 0),
                }
              : 0,
        });
      });
    i++;
    worksheet.addRow({
      harga: "Jumlah",
      totalupah: {
        formula: "=sum(L" + iinit + ":L" + (i - 1) + ")",
        value: "=sum(L" + iinit + ":L" + (i - 1) + ")",
      },
      totalbahan: {
        formula: "=sum(M" + iinit + ":M" + (i - 1) + ")",
        value: "=sum(L" + iinit + ":L" + (i - 1) + ")",
      },
    });

    i++;
    worksheet.addRow({
      ahsputamajudul: "Sumber: " + AHSP.AHS_SUMBER_UTAMA.SUMBER_AHS,
    });
    i++;
    worksheet.addRow({});
  });

  // var rows = hs.map((onehs) => {
  //   i = i + 1;
  //   return {
  //     rownum: i + 4,
  //     no: i,
  //     namamaterial: onehs.URAIAN,
  //     type: onehs.TYPE,
  //     satuan: onehs.SATUAN,
  //     harga: onehs.HARGA,
  //     sumber: onehs.SUMBER,
  //   };
  // });

  //worksheet.addRows(rows);

  return worksheet;
}

async function createRABSheet(rabsheet, res, TAHUN, RABPB) {
  console.log("Create RAB Sheet");

  // MARK: RAB SHEET =============================================================================================
  // Get RAB Project Bagian Information
  var rabpbInfo = RABPB;

  // Get RAB Judul
  var rabjudul = sortRAB(RABPB["T_RAB_JUDUL_" + TAHUN + "s"]);

  var newRab = [];
  rabjudul.forEach((satuRab) => {
    const satuRabTemp = JSON.parse(JSON.stringify(satuRab));
    const satuRabDetail = satuRabTemp["T_RAB_DETAIL_" + TAHUN + "s"];
    delete satuRabTemp["T_RAB_DETAIL_" + TAHUN + "s"];
    satuRabTemp["RAB_DETAILS"] = satuRabDetail;
    newRab.push(satuRabTemp);
  });
  rabjudul = newRab;

  console.log(rabjudul);

  if (rabjudul.length === 0) {
    res.status(500).json({ error: "empty database" });
    console.log("empty database");
    return;
  }

  // WRITE THE DOCUMENTS
  // WRITE nama berkas
  rabsheet.mergeCells("A1:K1");
  rabsheet.getCell("A2").value =
    rabpbInfo.JENIS == "BOQ"
      ? "Bill of Quantity"
      : rabpbInfo.JENIS == "RAB"
      ? "Rancangan Anggaran Biaya"
      : rabpbInfo.JENIS;

  // WRITE Sub Bagian
  rabsheet.mergeCells("A2:K2");
  rabsheet.getCell("A2").value = rabpbInfo.BAGIAN;

  // WRITE Sub Bagian
  rabsheet.mergeCells("A3:K3");
  rabsheet.getCell("A3").value = rabpbInfo.SUB_BAGIAN;

  // Column Init
  rabsheet.columns = [
    { header: "No", key: "no", width: 10 },
    { header: "Uraian", key: "name", width: 32 },
    { header: "Satuan", key: "satuan", width: 10, outlineLevel: 1 },
    { header: "Volume", key: "volume", width: 10, outlineLevel: 1 },
    { header: "CODE", key: "code", width: 10, outlineLevel: 1 },
    { header: "HargaJasa", key: "hargajasa", width: 10, outlineLevel: 1 },
    { header: "HargaBahan", key: "hargabahan", width: 10, outlineLevel: 1 },
    { header: "NilaiJasaTdp", key: "nilaijasatdp", width: 10, outlineLevel: 1 },
    {
      header: "NilaiJasaNonTdp",
      key: "nilaijasanontdp",
      width: 10,
      outlineLevel: 1,
    },
    {
      header: "NilaiBahanTdp",
      key: "nilaibahantdp",
      width: 10,
      outlineLevel: 1,
    },
    {
      header: "NilaiBahanNonTdp",
      key: "nilaibahannontdp",
      width: 10,
      outlineLevel: 1,
    },
  ];

  // Variable for Column
  var rab_rab_no = rabsheet.getColumn("no");
  var rab_name = rabsheet.getColumn("name");
  var rab_satuan = rabsheet.getColumn("satuan");
  var rab_volume = rabsheet.getColumn("volume");
  var rab_code = rabsheet.getColumn("code");
  var rab_hargajasa = rabsheet.getColumn("hargajasa");
  var rab_hargabahan = rabsheet.getColumn("hargabahan");
  var rab_nilaijasatdp = rabsheet.getColumn("nilaijasatdp");
  var rab_nilaijasanontdp = rabsheet.getColumn("nilaijasanontdp");
  var rab_nilaibahantdp = rabsheet.getColumn("nilaibahantdp");
  var rab_nilaibahannontdp = rabsheet.getColumn("nilaibahannontdp");

  // WRITE HEADER
  rabsheet.mergeCells("A5:A7");
  rabsheet.getCell("A5").value = "No";
  rabsheet.mergeCells("B5:B7");
  rabsheet.getCell("B5").value = "Uraian";
  rabsheet.mergeCells("C5:C7");
  rabsheet.getCell("C5").value = "Satuan";
  rabsheet.mergeCells("D5:D7");
  rabsheet.getCell("D5").value = "Volume";
  rabsheet.mergeCells("E5:E7");
  rabsheet.getCell("E5").value = "CODE";
  rabsheet.mergeCells("F5:G5");
  rabsheet.getCell("F5").value = "Harga Satuan (Rp)";
  rabsheet.mergeCells("F6:F7");
  rabsheet.getCell("F6").value = "Jasa / Upah";
  rabsheet.mergeCells("G6:G7");
  rabsheet.getCell("G6").value = "Bahan / Alat";
  rabsheet.mergeCells("H5:K5");
  rabsheet.getCell("H5").value = "Nilai Pekerjaan (Rp.)";
  rabsheet.mergeCells("H6:I6");
  rabsheet.getCell("H6").value = "Jasa / Upah";
  rabsheet.mergeCells("J6:K6");
  rabsheet.getCell("J6").value = "Bahan / Alat";
  rabsheet.getCell("H7").value = "PPN TDP";
  rabsheet.getCell("I7").value = "PPN Non TDP";
  rabsheet.getCell("J7").value = "PPN TDP";
  rabsheet.getCell("K7").value = "PPN Non TDP";

  //Masukan RAB disini
  i = 7;
  rabjudul.forEach((satuRab) => {
    // case new judul
    i++;
    console.log("satu rab");
    console.log(satuRab.RAB_DETAILS);
    rabsheet.addRow({
      no:
        satuRab.NO_URUT_4 > 0
          ? satuRab.NO_URUT_4
          : satuRab.NO_URUT_3 > 0
          ? satuRab.NO_URUT_3
          : satuRab.NO_URUT_2 > 0
          ? satuRab.NO_URUT_2
          : satuRab.NO_URUT_1,
      name: satuRab.ITEM_PEKERJAAN,
      satuan: satuRab.RAB_DETAILS != null ? satuRab.RAB_DETAILS[0].SATUAN : "",
      volume: satuRab.RAB_DETAILS != null ? satuRab.RAB_DETAILS[0].VOLUME : "",
      // code: ,
      //hargajasa: ,
      // hargabahan: ,
      // nilaijasatdp: ,
      // nilaibahannontdp: ,
      // nilaibahantdp: ,
      // nilaibahannontdp: ,
    });
  });

  return rabsheet;
}

/// UTIL
function findFromHS(hs, key, value) {
  var foundval;
  hs.forEach((eachhs) => {
    if (eachhs.namamaterial == value) {
      console.log("FOUND", eachhs[key]);
      foundval = eachhs[key];
      return eachhs[key];
    }
  });
  return foundval;
}

function sortRAB(rabjudul) {
  for (var i = 0; i < rabjudul.length; i++) {
    num1 =
      rabjudul[i].NO_URUT_1 * 1000 +
      rabjudul[i].NO_URUT_2 * 100 +
      rabjudul[i].NO_URUT_3 * 10 +
      rabjudul[i].NO_URUT_4;

    for (var j = i + 1; j < rabjudul.length; j++) {
      num2 =
        rabjudul[j].NO_URUT_1 * 1000 +
        rabjudul[j].NO_URUT_2 * 100 +
        rabjudul[j].NO_URUT_3 * 10 +
        rabjudul[j].NO_URUT_4;

      if (num2 < num1) {
        temp = rabjudul[i];
        rabjudul[i] = rabjudul[j];
        rabjudul[j] = temp;
      }
    }
  }
  return rabjudul;
}
