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

  // INIT EXCEL
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

  // INIT SHEET
  var rabsheet = workbook.addWorksheet("RAB");
  var ahssheet = workbook.addWorksheet("AHS");
  var hssheet = workbook.addWorksheet("Acuan Harga Survey");
  //   var worksheet = workbook.getWorksheet("My Sheet");

  // MARK: RAB SHEET =============================================================================================
  // Get RAB Project Bagian Information
  var rabpbInfo = null;
  try {
    rabpbInfo = await RABProjectBagian[TAHUN].findOne({
      where: { ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(rabpbInfo);

  // Get RAB Judul
  var rabjudul = [];
  try {
    var rab = await RABJudul[TAHUN].findAll({
      where: {
        ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN,
      },
      include: [
        {
          model: RABDetail[TAHUN],
          request: false,
        },
      ],
    });
    var newRab = [];
    rab.map((satuRab) => {
      const satuRabTemp = JSON.parse(JSON.stringify(satuRab));
      const satuRabDetail = satuRabTemp["T_RAB_DETAIL_" + TAHUN + "s"];
      delete satuRabTemp["T_RAB_DETAIL_" + TAHUN + "s"];
      satuRabTemp["RAB_DETAILS"] = satuRabDetail;
      newRab.push(satuRabTemp);
    });
    rabjudul = newRab;
  } catch (err) {
    console.log(err);
  }
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
  var rab_nilaibahantdp = rabsheet.getColumn("name");
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

  // Download the file
  // res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "RAB" + TAHUN + ".xlsx"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};
