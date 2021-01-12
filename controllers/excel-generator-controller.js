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
            include: [
              {
                model: AHSProjectUtama[TAHUN],
                request: false,
                include: [
                  {
                    model: AHSProjectDetail[TAHUN],
                    request: false,
                    include: [
                      {
                        model: HS[TAHUN],
                        request: false,
                      },
                    ],
                  },
                  {
                    model: AHSSumberUtama,
                    request: false,
                  },
                ],
              },
            ],
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
  var boqsheet = workbook.addWorksheet("BOQ");
  var ahssheet = workbook.addWorksheet("AHS");
  var hssheet = workbook.addWorksheet("Acuan Harga Survey");
  //   var worksheet = workbook.getWorksheet("My Sheet");

  // Create Sheet ==============================================
  console.log(RABPB);

  [hssheet, rows] = await createHSSheet(hssheet, res, TAHUN, ID_WILAYAH, RABPB);
  //console.log(rows);

  [ahssheet, AHSPs] = await createAHSPSheet(
    ahssheet,
    res,
    TAHUN,
    ID_PROJECT,
    rows,
    RABPB
  );

  boqsheet = await createBOQSheet(boqsheet, res, TAHUN, RABPB, AHSPs);

  rabsheet = await createRABSheet(rabsheet, res, TAHUN, RABPB, AHSPs);

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
async function createHSSheet(worksheet, res, TAHUN, ID_WILAYAH, RABPB) {
  console.log("Create HS Sheet");

  var wilayah = await Wilayah.findOne({ where: { ID_WILAYAH: ID_WILAYAH } });

  // get all hs
  //var hs = await HS[TAHUN].findAll({ where: { ID_WILAYAH: ID_WILAYAH } });
  var hs = [];

  // Input data to HS, and remove duplicate
  RABPB["T_RAB_JUDUL_" + TAHUN + "s"].forEach((rabjudul) => {
    console.log("====");
    //console.log(rabjudul);

    if (
      rabjudul["T_RAB_DETAIL_" + TAHUN + "s"].length > 0 &&
      rabjudul["T_RAB_DETAIL_" + TAHUN + "s"][0][
        "AHS_PROJECT_UTAMA_" + TAHUN
      ] != null
    ) {
      rabjudul["T_RAB_DETAIL_" + TAHUN + "s"][0]["AHS_PROJECT_UTAMA_" + TAHUN][
        "AHS_PROJECT_DETAIL_" + TAHUN + "s"
      ].forEach((ahsd) => {
        //console.log("hs");
        //console.log(ahsd["HS_" + TAHUN]);

        if (ahsd["HS_" + TAHUN] != null) {
          var found = false;
          for (var k = 0; k < hs.length; k++) {
            if (hs[k].ID_HS == ahsd["HS_" + TAHUN].ID_HS) {
              found = true;
              break;
            }
          }
          if (!found) {
            hs.push(ahsd["HS_" + TAHUN]);
          }
        }
      });
    }
  });

  // HS Sort
  hs.sort(function (a, b) {
    if (a.URAIAN > b.URAIAN) {
      return 1;
    } else if (a.URAIAN < b.URAIAN) {
      return -1;
    }
    return 0;
  });

  hsupah = [];
  hsbahan = [];

  for (var i = 0; i < hs.length; i++) {
    if (hs[i].TYPE == "Upah") {
      hsupah.push(hs[i]);
    } else if (hs[i].TYPE == "Bahan") {
      hsbahan.push(hs[i]);
    }
  }
  hs = hsupah.concat(hsbahan);
  //console.log(hs);

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
      id: onehs.ID_HS,
      rownum: i + 4,
      no: i,
      namamaterial: onehs.URAIAN,
      type: onehs.TYPE,
      satuan: onehs.SATUAN,
      harga: onehs.HARGA,
      sumber: onehs.SUMBER_HARGA,
      keterangan: onehs.KETERANGAN,
    };
  });

  worksheet.addRows(rows);

  return [worksheet, rows];
}

async function createAHSPSheet(worksheet, res, TAHUN, ID_PROJECT, rows, RABPB) {
  console.log("Create AHSP Sheet");
  //console.log(ID_PROJECT);

  AHSPs = [];
  tempAHSDiForAHSK4 = [];
  RABPB["T_RAB_JUDUL_" + TAHUN + "s"].forEach((rabjudul) => {
    if (rabjudul["T_RAB_DETAIL_" + TAHUN + "s"].length > 0) {
      if (
        rabjudul["T_RAB_DETAIL_" + TAHUN + "s"][0][
          "AHS_PROJECT_UTAMA_" + TAHUN
        ] != null
      ) {
        AHSPs.push(
          rabjudul["T_RAB_DETAIL_" + TAHUN + "s"][0][
            "AHS_PROJECT_UTAMA_" + TAHUN
          ]
        );
      }
    }
  });

  // filter AHSPS

  var newAHSUtama = [];

  // get AHSPs
  AHSPs.forEach((satuAHSUtama) => {
    var satuAHSUtamaTemp = JSON.parse(JSON.stringify(satuAHSUtama));
    var satuAHSUtamaDetailTemp =
      satuAHSUtamaTemp["AHS_PROJECT_DETAIL_" + TAHUN + "s"];

    // Ubah format doang
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
  AHSPs = newAHSUtama;

  worksheet.columns = [
    { header: "No", key: "no", width: 5, outlineLevel: 1 },
    { header: "No", key: "no2", width: 2, outlineLevel: 1 },
    { header: "No", key: "no3", width: 2, outlineLevel: 1 },
    { header: "No", key: "no4", width: 2, outlineLevel: 1 },
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
    {
      header: "Harga Satuan",
      key: "harga",
      width: 10,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    { header: "Equal", key: "equal", width: 8, outlineLevel: 1 },
    {
      header: "Total Upah",
      key: "totalupah",
      width: 15,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "Total Bahan",
      key: "totalbahan",
      width: 15,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
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
  writtenAHSPs = [];
  AHSPs.forEach((AHSP, index) => {
    // console.log("===========");
    // console.log(AHSP);

    // check duplicate

    relatedahsp = findFromAHSP(
      writtenAHSPs,
      "ID_AHS_PROJECT_UTAMA",
      AHSP.ID_AHS_PROJECT_UTAMA
    );

    if (relatedahsp == null) {
      tempAHSDiForAHSK2 = [];
      totalupahsum = 0;
      totalbahansum = 0;
      i++;
      j++;

      AHSPs[index].objnum = j;
      AHSPs[index].rownum = i;
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

      iinit = i;
      // Now AHS Detail
      AHSP.AHS_PROJECT_DETAIL &&
        AHSP.AHS_PROJECT_DETAIL.forEach((AHSPD) => {
          //console.log(AHSPD);
          i++;
          tempAHSDiForAHSK4.push({
            id: AHSPD.ID_AHS_PROJECT_DETAIL,
            i: i,
          });

          if (AHSPD.P_HS_AHS_P != null || AHSPD.P_HS_AHS_P != undefined) {
            // kasus khusus 4
            var hargarownum = findHSFromAHSPD(
              tempAHSDiForAHSK4,
              AHSPD.P_HS_AHS_P
            );
            worksheet.addRow({
              koefisien: AHSPD.P_KOEFISIEN_URAIAN,
              satuan: AHSPD.P_SATUAN_URAIAN,
              ahspdetailjudul: AHSPD.P_URAIAN,
              at: "@",
              harga:
                hargarownum != null
                  ? {
                      formula: "=L" + hargarownum + " + M" + hargarownum,
                    }
                  : "-1",
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
          } else if (
            AHSPD.P_HS_ANAK_AHS != null ||
            AHSPD.P_HS_ANAK_AHS != undefined
          ) {
            // kasus khusus 2
            // save to array temp of ahp yang ingin di-include
            relatedahsp = findFromAHSP(
              AHSPs,
              "ID_AHS_PROJECT_UTAMA",
              satuRab.RAB_DETAILS[0].ID_AHS_PROJECT_UTAMA
            );
          } else {
            // kasus biasa
            var hargarownum = findFromHS(rows, "rownum", AHSPD.P_URAIAN);
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
          }
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

      AHSPs[index].totalnum = i;

      i++;
      worksheet.addRow({
        ahsputamajudul: "Sumber: " + AHSP.AHS_SUMBER_UTAMA.SUMBER_AHS,
      });
      i++;
      worksheet.addRow({});
      writtenAHSPs.push(AHSPs[index]);
    }
  });

  return [worksheet, writtenAHSPs];
}

async function createRABSheet(rabsheet, res, TAHUN, RABPB, AHSPs) {
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

  console.log("rabjudul");
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
    {
      header: "No",
      key: "no",
      width: 10,
      style: { alignment: { horizontal: "right" } },
    },
    { header: "Uraian", key: "name", width: 32 },
    { header: "Satuan", key: "satuan", width: 10, outlineLevel: 1 },
    { header: "Volume", key: "volume", width: 8, outlineLevel: 1 },
    { header: "CODE", key: "code", width: 8, outlineLevel: 1 },
    {
      header: "HargaJasa",
      key: "hargajasa",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "HargaBahan",
      key: "hargabahan",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiJasaTdp",
      key: "nilaijasatdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiJasaNonTdp",
      key: "nilaijasanontdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiBahanTdp",
      key: "nilaibahantdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiBahanNonTdp",
      key: "nilaibahannontdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* #,##0_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
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
  rabsheet.getCell("A5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("A5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("A5").value = "No";
  rabsheet.mergeCells("B5:B7");
  rabsheet.getCell("B5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("B5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("B5").value = "Uraian";
  rabsheet.mergeCells("C5:C7");
  rabsheet.getCell("C5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("C5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("C5").value = "Satuan";
  rabsheet.mergeCells("D5:D7");
  rabsheet.getCell("D5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("D5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("D5").value = "Volume";
  rabsheet.mergeCells("E5:E7");
  rabsheet.getCell("E5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("E5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("E5").value = "CODE";
  rabsheet.mergeCells("F5:G5");
  rabsheet.getCell("F5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("F5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("F5").value = "Harga Satuan (Rp)";
  rabsheet.mergeCells("F6:F7");
  rabsheet.getCell("F6").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("F6").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("F6").value = "Jasa / Upah";
  rabsheet.mergeCells("G6:G7");
  rabsheet.getCell("G6").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("G6").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("G6").value = "Bahan / Alat";
  rabsheet.mergeCells("H5:K5");
  rabsheet.getCell("H5").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("H5").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("H5").value = "Nilai Pekerjaan (Rp.)";
  rabsheet.mergeCells("H6:I6");
  rabsheet.getCell("H6").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("H6").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("H6").value = "Jasa / Upah";
  rabsheet.mergeCells("J6:K6");
  rabsheet.getCell("J6").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("J6").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("J6").value = "Bahan / Alat";
  rabsheet.getCell("H7").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("H7").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("H7").value = "PPN TDP";
  rabsheet.getCell("I7").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("I7").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("I7").value = "PPN Non TDP";
  rabsheet.getCell("J7").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("J7").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("J7").value = "PPN TDP";
  rabsheet.getCell("K7").border = {
    top: { style: "medium" },
    left: { style: "medium" },
    bottom: { style: "medium" },
    right: { style: "medium" },
  };
  rabsheet.getCell("K7").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "F4B084",
    },
    bgColor: {
      argb: "F4B084",
    },
  };
  rabsheet.getCell("K7").value = "PPN Non TDP";

  //Masukan RAB disini
  i = 7;
  rabjudul.push({
    ID_RAB_JUDUL: -1,
    NO_URUT_1: 0,
    NO_URUT_2: 0,
    NO_URUT_3: 0,
    NO_URUT_4: 0,
    RAB_DETAILS: [],
  });

  newsec = true;
  newsecnum = 1;
  secstart = 0;

  titiksum = [[], [], [], [], []];
  judulandnum = [];

  rabjudul.slice(0, rabjudul.length - 1).forEach((satuRab, k) => {
    sectionlevel = sectionLevel(satuRab);
    if (sectionlevel < sectionLevel(rabjudul[k + 1])) {
      judulandnum.push({
        judul: satuRab.ITEM_PEKERJAAN,
        num:
          satuRab.NO_URUT_4 > 0
            ? satuRab.NO_URUT_1 +
              "." +
              satuRab.NO_URUT_2 +
              "." +
              satuRab.NO_URUT_3 +
              "." +
              satuRab.NO_URUT_4
            : satuRab.NO_URUT_3 > 0
            ? satuRab.NO_URUT_1 +
              "." +
              satuRab.NO_URUT_2 +
              "." +
              satuRab.NO_URUT_3
            : satuRab.NO_URUT_2 > 0
            ? satuRab.NO_URUT_1 + "." + satuRab.NO_URUT_2
            : satuRab.NO_URUT_1,
      });
    }

    relatedahsp = {};
    if (satuRab.RAB_DETAILS.length > 0) {
      relatedahsp = findFromAHSP(
        AHSPs,
        "ID_AHS_PROJECT_UTAMA",
        satuRab.RAB_DETAILS[0].ID_AHS_PROJECT_UTAMA
      );
    }

    if (newsec) {
      secstart = i + 1;
      newsec = false;
    }

    i++;
    rabsheet.addRow({
      no:
        satuRab.NO_URUT_4 > 0
          ? satuRab.NO_URUT_1 +
            "." +
            satuRab.NO_URUT_2 +
            "." +
            satuRab.NO_URUT_3 +
            "." +
            satuRab.NO_URUT_4
          : satuRab.NO_URUT_3 > 0
          ? satuRab.NO_URUT_1 +
            "." +
            satuRab.NO_URUT_2 +
            "." +
            satuRab.NO_URUT_3
          : satuRab.NO_URUT_2 > 0
          ? satuRab.NO_URUT_1 + "." + satuRab.NO_URUT_2
          : satuRab.NO_URUT_1,
      name: satuRab.ITEM_PEKERJAAN,
      satuan:
        satuRab.RAB_DETAILS[0] != null ? satuRab.RAB_DETAILS[0].SATUAN : "",
      volume:
        satuRab.RAB_DETAILS[0] != null ? satuRab.RAB_DETAILS[0].VOLUME : "",
      code:
        satuRab.RAB_DETAILS.length > 0
          ? satuRab.RAB_DETAILS[0].PM
            ? "PM"
            : relatedahsp == null || relatedahsp == undefined
            ? "AHSP Not Found"
            : {
                formula: "AHS!$A$" + relatedahsp.rownum,
                result: relatedahsp.objnum,
              }
          : null,
      hargajasa:
        satuRab.RAB_DETAILS.length > 0 &&
        relatedahsp != null &&
        relatedahsp != undefined
          ? satuRab.RAB_DETAILS[0].PM
            ? 0
            : {
                formula: "AHS!$L$" + relatedahsp.totalnum,
              }
          : null, //better add result
      hargabahan:
        satuRab.RAB_DETAILS.length > 0 &&
        relatedahsp != null &&
        relatedahsp != undefined
          ? satuRab.RAB_DETAILS[0].PM
            ? 0
            : {
                formula: "AHS!$M$" + relatedahsp.totalnum,
              }
          : null, //better add result
      nilaijasatdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].UPAH_NON_TDP == 1 //TDP
            ? null
            : {
                formula: "F" + i + "*D" + i,
              }
          : null, //better add result
      nilaijasanontdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].UPAH_NON_TDP == 1
            ? {
                formula: "F" + i + "*D" + i,
              }
            : null
          : null, //better add result
      nilaibahantdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].BAHAN_NON_TDP == 1 //TDP
            ? null
            : {
                formula: "G" + i + "*D" + i,
              }
          : null, //better add result
      nilaibahannontdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].BAHAN_NON_TDP == 1
            ? {
                formula: "G" + i + "*D" + i,
              }
            : null
          : null, //better add result
    });

    // PENJUMLAHAN
    sectionlevel2 = sectionlevel;
    console.log(sectionlevel);
    for (m = sectionlevel; m > 0; m--) {
      if (satuRab["NO_URUT_" + m] != rabjudul[k + 1]["NO_URUT_" + m]) {
        console.log("ABIS INI NEW SEC " + m);
        newsec = true;
        sectionlevel2 = m;
      }
    }

    if (newsec) {
      secend = i;
      isalreadysum = false;
      for (m = sectionlevel; m >= sectionlevel2; m--) {
        if (!isalreadysum) {
          i++;
          rabsheet.mergeCells("B" + i + ":G" + i);
          satujudulandnum = judulandnum.pop();
          //satujudulandnum = "TOTAL";

          console.log(satujudulandnum);
          console.log(judulandnum);
          rabsheet.getCell("B" + i).value =
            "Jumlah " + satujudulandnum.num + ". " + satujudulandnum.judul;
          rabsheet.getCell("H" + i).value = {
            formula: "=SUM(H" + secstart + ":H" + secend + ")",
          }; //better add result
          rabsheet.getCell("I" + i).value = {
            formula: "=SUM(I" + secstart + ":I" + secend + ")",
          }; //better add result
          rabsheet.getCell("J" + i).value = {
            formula: "=SUM(J" + secstart + ":J" + secend + ")",
          }; //better add result
          rabsheet.getCell("K" + i).value = {
            formula: "=SUM(K" + secstart + ":K" + secend + ")",
          }; //better add result

          isalreadysum = true;
          titiksum[m].push(i);
          //newsecnum = 3;
        } else {
          i++;
          titiksum[m].push(i);
          satujudulandnum = judulandnum.pop();
          //satujudulandnum = "TOTAL";
          console.log(satujudulandnum);
          console.log(judulandnum);
          rabsheet.mergeCells("B" + i + ":G" + i);
          rabsheet.getCell("B" + i).value =
            "Jumlah " + satujudulandnum.num + ". " + satujudulandnum.judul;

          // cari titik-titik sum selanjutnya
          rabsheet.getCell("H" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "H" + titik + " +").join(" ") +
              "0",
          }; //better add result
          rabsheet.getCell("I" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "I" + titik + " +").join(" ") +
              "0",
          }; //better add result
          rabsheet.getCell("J" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "J" + titik + " +").join(" ") +
              "0",
          }; //better add result
          rabsheet.getCell("K" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "K" + titik + " +").join(" ") +
              "0",
          }; //better add result

          titiksum[m + 1] = [];
          console.log(titiksum);
        }
      }
      i++;
      rabsheet.addRow({});
    }
    console.log("===========");
  });
  console.log("RABBBBBBBBBBBBBBB DONE");
  console.log(titiksum);

  //TOTAL ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "JUMLAH";

  // cari titik-titik sum selanjutnya
  rabsheet.getCell("H" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "H" + titik + " +").join(" ") + "0",
  }; //better add result
  rabsheet.getCell("I" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "I" + titik + " +").join(" ") + "0",
  }; //better add result
  rabsheet.getCell("J" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "J" + titik + " +").join(" ") + "0",
  }; //better add result
  rabsheet.getCell("K" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "K" + titik + " +").join(" ") + "0",
  }; //better add result

  //TOTAL ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "PPN 10%";

  // cari titik-titik sum selanjutnya
  rabsheet.getCell("H" + i).value = {
    formula: "",
  }; //better add result
  rabsheet.getCell("I" + i).value = {
    formula: "=10% * I" + (i - 1),
  }; //better add result
  rabsheet.getCell("J" + i).value = {
    formula: "",
  }; //better add result
  rabsheet.getCell("K" + i).value = {
    formula: "=10% * K" + (i - 1),
  }; //better add result

  //TOTAL + PPN ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "JUMLAH + PPN 10%";

  // cari titik-titik sum selanjutnya
  rabsheet.getCell("H" + i).value = {
    formula: "=H" + (i - 1) + " + H" + (i - 2),
  }; //better add result
  rabsheet.getCell("I" + i).value = {
    formula: "=I" + (i - 1) + " + I" + (i - 2),
  }; //better add result
  rabsheet.getCell("J" + i).value = {
    formula: "=J" + (i - 1) + " + J" + (i - 2),
  }; //better add result
  rabsheet.getCell("K" + i).value = {
    formula: "=K" + (i - 1) + " + K" + (i - 2),
  }; //better add result

  //TOTAL + PPN ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "TOTAL";

  rabsheet.getCell("K" + i).value = {
    formula: "=SUM(H" + (i - 1) + ":K" + (i - 1) + ")",
  }; //better add result

  //TOTAL DIBULATKAN
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "TOTAL DIBULATKAN";

  rabsheet.getCell("K" + i).value = {
    formula: "=ROUNDUP(K" + (i - 1) + "/1000,0)*1000",
  }; //better add result

  //TERBILANG
  i++;
  rabsheet.getCell("B" + i).value = "TERBILANG";
  rabsheet.mergeCells("C" + i + ":K" + i);

  rabsheet.getCell("C" + i).value = {
    formula:
      `=PROPER(IF(A1=0,"nol",IF(A1<0,"minus ","")&
    SUBSTITUTE(TRIM(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(
    IF(--MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),1,3)=0,"",MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),1,1)&" ratus "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),2,1)&" puluh "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),3,1)&" trilyun ")&
    IF(--MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),4,3)=0,"",MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),4,1)&" ratus "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),5,1)&" puluh "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),6,1)&" milyar ")&
    IF(--MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),7,3)=0,"",MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),7,1)&" ratus "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),8,1)&" puluh "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),9,1)&" juta ")&
    IF(--MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),10,3)=0,"",IF(--MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),10,3)=1,"*",MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),10,1)&" ratus "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),11,1)&" puluh ")&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),12,1)&" ribu ")&
    IF(--MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),13,3)=0,"",MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),13,1)&" ratus "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),14,1)&" puluh "&MID(TEXT(ABS(K` +
      (i - 1) +
      `),"000000000000000"),15,1)),1,"satu"),2,"dua"),3,"tiga"),4,"empat"),5,"lima"),6,"enam"),7,"tujuh"),8,"delapan"),9,"sembilan"),"0 ratus",""),"0 puluh",""),"satu puluh 0","sepuluh"),"satu puluh satu","sebelas"),"satu puluh dua","dua belas"),"satu puluh tiga","tiga belas"),"satu puluh empat","empat belas"),"satu puluh lima","lima belas"),"satu puluh enam","enam belas"),"satu puluh tujuh","tujuh belas"),"satu puluh delapan","delapan belas"),"satu puluh sembilan","sembilan belas"),"satu ratus","seratus"),"*satu ribu","seribu"),0,"")),"  "," "))&" Rupiah")`,
  }; //better add result

  return rabsheet;
}

async function createBOQSheet(rabsheet, res, TAHUN, RABPB, AHSPs) {
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

  console.log("rabjudul");
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
    {
      header: "No",
      key: "no",
      width: 10,
      style: { alignment: { horizontal: "right" } },
    },
    { header: "Uraian", key: "name", width: 32 },
    { header: "Satuan", key: "satuan", width: 10, outlineLevel: 1 },
    { header: "Volume", key: "volume", width: 8, outlineLevel: 1 },
    { header: "CODE", key: "code", width: 8, outlineLevel: 1 },
    {
      header: "HargaJasa",
      key: "hargajasa",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* "-"_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "HargaBahan",
      key: "hargabahan",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* "-"_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiJasaTdp",
      key: "nilaijasatdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* "-"_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiJasaNonTdp",
      key: "nilaijasanontdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* "-"_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiBahanTdp",
      key: "nilaibahantdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* "-"_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
    },
    {
      header: "NilaiBahanNonTdp",
      key: "nilaibahannontdp",
      width: 16,
      outlineLevel: 1,
      style: {
        numFmt: '_("Rp. "* "-"_);_("Rp. "* (#,##0);_(""* ""_);_(@_)',
      },
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
  rabjudul.push({
    ID_RAB_JUDUL: -1,
    NO_URUT_1: 0,
    NO_URUT_2: 0,
    NO_URUT_3: 0,
    NO_URUT_4: 0,
    RAB_DETAILS: [],
  });

  newsec = true;
  newsecnum = 1;
  secstart = 0;

  titiksum = [[], [], [], [], []];
  judulandnum = [];

  rabjudul.slice(0, rabjudul.length - 1).forEach((satuRab, k) => {
    sectionlevel = sectionLevel(satuRab);
    if (sectionlevel < sectionLevel(rabjudul[k + 1])) {
      judulandnum.push({
        judul: satuRab.ITEM_PEKERJAAN,
        num:
          satuRab.NO_URUT_4 > 0
            ? satuRab.NO_URUT_1 +
              "." +
              satuRab.NO_URUT_2 +
              "." +
              satuRab.NO_URUT_3 +
              "." +
              satuRab.NO_URUT_4
            : satuRab.NO_URUT_3 > 0
            ? satuRab.NO_URUT_1 +
              "." +
              satuRab.NO_URUT_2 +
              "." +
              satuRab.NO_URUT_3
            : satuRab.NO_URUT_2 > 0
            ? satuRab.NO_URUT_1 + "." + satuRab.NO_URUT_2
            : satuRab.NO_URUT_1,
      });
    }

    relatedahsp = {};
    if (satuRab.RAB_DETAILS.length > 0) {
      relatedahsp = findFromAHSP(
        AHSPs,
        "ID_AHS_PROJECT_UTAMA",
        satuRab.RAB_DETAILS[0].ID_AHS_PROJECT_UTAMA
      );
    }

    if (newsec) {
      secstart = i + 1;
      newsec = false;
    }

    i++;
    console.log(satuRab);
    rabsheet.addRow({
      no:
        satuRab.NO_URUT_4 > 0
          ? satuRab.NO_URUT_1 +
            "." +
            satuRab.NO_URUT_2 +
            "." +
            satuRab.NO_URUT_3 +
            "." +
            satuRab.NO_URUT_4
          : satuRab.NO_URUT_3 > 0
          ? satuRab.NO_URUT_1 +
            "." +
            satuRab.NO_URUT_2 +
            "." +
            satuRab.NO_URUT_3
          : satuRab.NO_URUT_2 > 0
          ? satuRab.NO_URUT_1 + "." + satuRab.NO_URUT_2
          : satuRab.NO_URUT_1,
      name: satuRab.ITEM_PEKERJAAN,
      satuan:
        satuRab.RAB_DETAILS[0] != null ? satuRab.RAB_DETAILS[0].SATUAN : "",
      volume:
        satuRab.RAB_DETAILS[0] != null ? satuRab.RAB_DETAILS[0].VOLUME : "",
      code:
        satuRab.RAB_DETAILS.length > 0
          ? satuRab.RAB_DETAILS[0].PM
            ? "PM"
            : relatedahsp == null || relatedahsp == undefined
            ? "AHSP Not Found"
            : {
                formula: "AHS!$A$" + relatedahsp.rownum,
                result: relatedahsp.objnum,
              }
          : null,
      hargajasa:
        satuRab.RAB_DETAILS.length > 0 &&
        relatedahsp != null &&
        relatedahsp != undefined
          ? satuRab.RAB_DETAILS[0].PM
            ? 0
            : {
                formula: "AHS!$L$" + relatedahsp.totalnum,
              }
          : null, //better add result
      hargabahan:
        satuRab.RAB_DETAILS.length > 0 &&
        relatedahsp != null &&
        relatedahsp != undefined
          ? satuRab.RAB_DETAILS[0].PM
            ? 0
            : {
                formula: "AHS!$M$" + relatedahsp.totalnum,
              }
          : null, //better add result
      nilaijasatdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].UPAH_NON_TDP == 1 //TDP
            ? null
            : {
                formula: "F" + i + "*D" + i,
              }
          : null, //better add result
      nilaijasanontdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].UPAH_NON_TDP == 1
            ? {
                formula: "F" + i + "*D" + i,
              }
            : null
          : null, //better add result
      nilaibahantdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].BAHAN_NON_TDP == 1
            ? null
            : {
                formula: "G" + i + "*D" + i,
              }
          : null, //better add result
      nilaibahannontdp:
        satuRab.RAB_DETAILS[0] != null
          ? satuRab.RAB_DETAILS[0].BAHAN_NON_TDP == 1
            ? {
                formula: "G" + i + "*D" + i,
              }
            : null
          : null, //better add result
    });

    sectionlevel2 = sectionlevel;
    console.log(sectionlevel);
    for (m = sectionlevel; m > 0; m--) {
      if (satuRab["NO_URUT_" + m] != rabjudul[k + 1]["NO_URUT_" + m]) {
        console.log("ABIS INI NEW SEC " + m);
        newsec = true;
        sectionlevel2 = m;
      }
    }

    if (newsec) {
      secend = i;
      isalreadysum = false;
      for (m = sectionlevel; m >= sectionlevel2; m--) {
        if (!isalreadysum) {
          i++;
          rabsheet.mergeCells("B" + i + ":G" + i);
          satujudulandnum = judulandnum.pop();
          //satujudulandnum = "TOTAL";

          console.log(satujudulandnum);
          console.log(judulandnum);
          rabsheet.getCell("B" + i).value =
            "Jumlah " + satujudulandnum.num + ". " + satujudulandnum.judul;
          rabsheet.getCell("H" + i).value = {
            formula: "=SUM(H" + secstart + ":H" + secend + ")",
          }; //better add result
          rabsheet.getCell("I" + i).value = {
            formula: "=SUM(I" + secstart + ":I" + secend + ")",
          }; //better add result
          rabsheet.getCell("J" + i).value = {
            formula: "=SUM(J" + secstart + ":J" + secend + ")",
          }; //better add result
          rabsheet.getCell("K" + i).value = {
            formula: "=SUM(K" + secstart + ":K" + secend + ")",
          }; //better add result

          isalreadysum = true;
          titiksum[m].push(i);
          //newsecnum = 3;
        } else {
          i++;
          titiksum[m].push(i);
          rabsheet.mergeCells("B" + i + ":G" + i);
          satujudulandnum = judulandnum.pop();
          //satujudulandnum = "TOTAL";
          console.log(satujudulandnum);
          console.log(judulandnum);
          rabsheet.getCell("B" + i).value =
            "Jumlah " + satujudulandnum.num + ". " + satujudulandnum.judul;

          // cari titik-titik sum selanjutnya
          rabsheet.getCell("H" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "H" + titik + " +").join(" ") +
              "0",
          }; //better add result
          rabsheet.getCell("I" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "I" + titik + " +").join(" ") +
              "0",
          }; //better add result
          rabsheet.getCell("J" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "J" + titik + " +").join(" ") +
              "0",
          }; //better add result
          rabsheet.getCell("K" + i).value = {
            formula:
              "=" +
              titiksum[m + 1].map((titik) => "K" + titik + " +").join(" ") +
              "0",
          }; //better add result

          titiksum[m + 1] = [];
          console.log(titiksum);
        }
      }
      i++;
      rabsheet.addRow({});
    }

    // // kondisi abis ini new section
    // if (
    //   satuRab.NO_URUT_1 != rabjudul[k + 1].NO_URUT_1 ||
    //   satuRab.NO_URUT_2 != rabjudul[k + 1].NO_URUT_2 ||
    //   satuRab.NO_URUT_3 != rabjudul[k + 1].NO_URUT_3
    // ) {
    //   i++;
    //   rabsheet.addRow({});
    //   secend = i;

    //   isalreadysum = false;

    //   if (satuRab.NO_URUT_3 != rabjudul[k + 1].NO_URUT_3) {
    //     i++;
    //     rabsheet.mergeCells("B" + i + ":G" + i);
    //     rabsheet.getCell("B" + i).value = "sum untuk judul 3";
    //     rabsheet.getCell("H" + i).value = {
    //       formula: "=SUM(H" + secstart + ":H" + secend + ")",
    //     }; //better add result
    //     rabsheet.getCell("I" + i).value = {
    //       formula: "=SUM(I" + secstart + ":I" + secend + ")",
    //     }; //better add result
    //     rabsheet.getCell("J" + i).value = {
    //       formula: "=SUM(J" + secstart + ":J" + secend + ")",
    //     }; //better add result
    //     rabsheet.getCell("K" + i).value = {
    //       formula: "=SUM(K" + secstart + ":K" + secend + ")",
    //     }; //better add result

    //     isalreadysum = true;
    //     newsecnum = 3;
    //   }
    //   if (satuRab.NO_URUT_2 != rabjudul[k + 1].NO_URUT_2) {
    //     i++;
    //     rabsheet.mergeCells("B" + i + ":G" + i);
    //     rabsheet.getCell("B" + i).value = "sum untuk judul 2";
    //     if (!isalreadysum) {
    //       rabsheet.getCell("B" + i).value = "sum untuk judul 3";
    //       rabsheet.getCell("H" + i).value = {
    //         formula: "=SUM(H" + secstart + ":H" + secend + ")",
    //       }; //better add result
    //       rabsheet.getCell("I" + i).value = {
    //         formula: "=SUM(I" + secstart + ":I" + secend + ")",
    //       }; //better add result
    //       rabsheet.getCell("J" + i).value = {
    //         formula: "=SUM(J" + secstart + ":J" + secend + ")",
    //       }; //better add result
    //       rabsheet.getCell("K" + i).value = {
    //         formula: "=SUM(K" + secstart + ":K" + secend + ")",
    //       }; //better add result
    //     }

    //     isalreadysum = true;
    //     newsecnum = 2;
    //   }
    //   if (satuRab.NO_URUT_1 != rabjudul[k + 1].NO_URUT_1) {
    //     i++;
    //     rabsheet.mergeCells("B" + i + ":G" + i);
    //     rabsheet.getCell("B" + i).value = "sum untuk judul 1";

    //     if (!isalreadysum) {
    //       rabsheet.getCell("B" + i).value = "sum untuk judul 3";
    //       rabsheet.getCell("H" + i).value = {
    //         formula: "=SUM(H" + secstart + ":H" + secend + ")",
    //       }; //better add result
    //       rabsheet.getCell("I" + i).value = {
    //         formula: "=SUM(I" + secstart + ":I" + secend + ")",
    //       }; //better add result
    //       rabsheet.getCell("J" + i).value = {
    //         formula: "=SUM(J" + secstart + ":J" + secend + ")",
    //       }; //better add result
    //       rabsheet.getCell("K" + i).value = {
    //         formula: "=SUM(K" + secstart + ":K" + secend + ")",
    //       }; //better add result
    //     }

    //     newsecnum = 1;
    //   }

    //   // next is new section
    //   newsec = true;
    // }
  });

  // TOTAL ALL
  console.log("BOQ DONE");
  console.log(titiksum);

  //TOTAL ALL
  //TOTAL ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "JUMLAH";

  // cari titik-titik sum selanjutnya
  rabsheet.getCell("H" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "H" + titik + " +").join(" ") + "0",
  }; //better add result
  rabsheet.getCell("I" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "I" + titik + " +").join(" ") + "0",
  }; //better add result
  rabsheet.getCell("J" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "J" + titik + " +").join(" ") + "0",
  }; //better add result
  rabsheet.getCell("K" + i).value = {
    formula:
      "=" + titiksum[1].map((titik) => "K" + titik + " +").join(" ") + "0",
  }; //better add result

  //TOTAL ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "PPN 10%";

  // cari titik-titik sum selanjutnya
  rabsheet.getCell("H" + i).value = {
    formula: "",
  }; //better add result
  rabsheet.getCell("I" + i).value = {
    formula: "=10% * I" + (i - 1),
  }; //better add result
  rabsheet.getCell("J" + i).value = {
    formula: "",
  }; //better add result
  rabsheet.getCell("K" + i).value = {
    formula: "=10% * K" + (i - 1),
  }; //better add result

  //TOTAL + PPN ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "JUMLAH + PPN 10%";

  // cari titik-titik sum selanjutnya
  rabsheet.getCell("H" + i).value = {
    formula: "=H" + (i - 1) + " + H" + (i - 2),
  }; //better add result
  rabsheet.getCell("I" + i).value = {
    formula: "=I" + (i - 1) + " + I" + (i - 2),
  }; //better add result
  rabsheet.getCell("J" + i).value = {
    formula: "=J" + (i - 1) + " + J" + (i - 2),
  }; //better add result
  rabsheet.getCell("K" + i).value = {
    formula: "=K" + (i - 1) + " + K" + (i - 2),
  }; //better add result

  //TOTAL + PPN ALL
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "TOTAL";

  rabsheet.getCell("K" + i).value = {
    formula: "=SUM(H" + (i - 1) + ":K" + (i - 1) + ")",
  }; //better add result

  //TOTAL DIBULATKAN
  i++;
  rabsheet.mergeCells("B" + i + ":G" + i);
  rabsheet.getCell("B" + i).value = "TOTAL DIBULATKAN";

  rabsheet.getCell("K" + i).value = {
    formula: "=ROUNDUP(K" + (i - 1) + "/1000,0)*1000",
  }; //better add result

  //TERBILANG
  i++;
  rabsheet.getCell("B" + i).value = "TERBILANG";
  rabsheet.mergeCells("C" + i + ":K" + i);

  rabsheet.getCell("C" + i).value = {
    formula: `=0`,
  }; //better add result

  return rabsheet;
}

/// UTIL
// hs = array of hs
// key = what we need
// value = the name of material
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
  rabjudul.sort(function (a, b) {
    if (a.NO_URUT_4 > b.NO_URUT_4) {
      return 1;
    } else if (a.NO_URUT_4 < b.NO_URUT_4) {
      return -1;
    }
    return 0;
  });

  rabjudul.sort(function (a, b) {
    if (a.NO_URUT_3 > b.NO_URUT_3) {
      return 1;
    } else if (a.NO_URUT_3 < b.NO_URUT_3) {
      return -1;
    }
    return 0;
  });

  rabjudul.sort(function (a, b) {
    if (a.NO_URUT_2 > b.NO_URUT_2) {
      return 1;
    } else if (a.NO_URUT_2 < b.NO_URUT_2) {
      return -1;
    }
    return 0;
  });

  rabjudul.sort(function (a, b) {
    if (a.NO_URUT_1 > b.NO_URUT_1) {
      return 1;
    } else if (a.NO_URUT_1 < b.NO_URUT_1) {
      return -1;
    }
    return 0;
  });

  return rabjudul;
}

// thequery = parameter to search
function findFromAHSP(ahsp, thequery, value) {
  var foundval = null;
  //console.log("fungsi", value);

  //console.log(ahsp);
  ahsp.forEach((eachahsp) => {
    if (eachahsp[thequery] == value) {
      //console.log("FOUND COMPLETE OBJ", eachahsp[thequery]);
      foundval = eachahsp;
      return eachahsp;
    }
  });
  return foundval;
}

function findHSFromAHSPD(ahspds, reqAhspId) {
  var foundval = null;
  ahspds.forEach((ahspd) => {
    if (ahspd.id == reqAhspId) {
      foundval = ahspd.i;
      return ahspd.i;
    }
  });
  return foundval;
}

function sectionLevel(satuRab) {
  if (satuRab.NO_URUT_2 == 0) {
    return 0;
  } else if (satuRab.NO_URUT_3 == 0) {
    return 1;
  } else if (satuRab.NO_URUT_4 == 0) {
    return 2;
  } else {
    return 3;
  }
}
