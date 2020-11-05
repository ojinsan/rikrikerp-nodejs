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
  var rabsheet = workbook.addWorksheet("Bill of Quantity");
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

  rabsheet.mergeCells("A1:K1");
  rabsheet.getCell("A2").value =
    rabpbInfo.JENIS == "BOQ"
      ? "Bill of Quantity"
      : rabpbInfo.JENIS == "RAB"
      ? "Rancangan Anggaran Biaya"
      : rabpbInfo.JENIS;

  rabsheet.mergeCells("A2:K2");
  rabsheet.getCell("A2").value = rabpbInfo.BAGIAN;

  rabsheet.mergeCells("A3:K3");
  rabsheet.getCell("A3").value = rabpbInfo.SUB_BAGIAN;

  rabsheet.columns = [
    { header: "No", key: "no", width: 10 },
    { header: "Name", key: "name", width: 32 },
    { header: "D.O.B.", key: "DOB", width: 10, outlineLevel: 1 },
  ];

  var idCol = rabsheet.getColumn("id");
  var nameCol = rabsheet.getColumn("B");
  var dobCol = rabsheet.getColumn(3);

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
