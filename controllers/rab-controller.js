const RABProjectBagian = require("../models/Project/RABProjectBagian");
const RABJudul = require("../models/Project/RABJudul");
const RABDetail = require("../models/Project/RABDetail");
const AHSProjectUtama = require("../models/AHSProject/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProject/AHSProjectDetail");

// ========================================= MARK: RAB Judul and Detail =========================================
exports.getRABJudulFullData = (req, res, next) => {
  const TAHUN = req.query.TAHUN;
  const ID_RAB_PROJECT_BAGIAN = req.query.ID_RAB_PROJECT_BAGIAN;
  RABJudul[TAHUN].findAll({
    where: {
      ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN,
    },
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
              },
            ],
          },
        ],
      },
    ],
  })
    .then((rab) => {
      console.log(rab);
      var newRab = [];
      rab.map((satuRab) => {
        const satuRabTemp = JSON.parse(JSON.stringify(satuRab));
        const satuRabDetail = satuRabTemp["T_RAB_DETAIL_" + TAHUN + "s"];
        delete satuRabTemp["T_RAB_DETAIL_" + TAHUN + "s"];
        satuRabTemp["RAB_DETAILS"] = satuRabDetail;
        newRab.push(satuRabTemp);
      });

      res.status(201).json({
        message: "Success pull data RAB ",
        rab: newRab,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.postNewRABJudul = (req, res, next) => {};

exports.postNewRABDetail = (req, res, next) => {};

exports.postNewRABJudulDetail = (req, res, next) => {
  console.log("new rab judul detail");
  const TAHUN = req.query.TAHUN;

  const ID_RAB_PROJECT_BAGIAN = req.body.ID_RAB_PROJECT_BAGIAN;
  const ITEM_PEKERJAAN = req.body.ITEM_PEKERJAAN;
  const NO_URUT_1 = req.body.NO_URUT_1;
  const NO_URUT_2 = req.body.NO_URUT_2;
  const NO_URUT_3 = req.body.NO_URUT_3;
  const NO_URUT_4 = req.body.NO_URUT_4;
  const NO_URUT_5 = req.body.NO_URUT_5;
  const DETAIL = req.body.DETAIL;

  //const ID_RAB_JUDUL = req.body.
  const ID_AHS_PROJECT_UTAMA = req.body.ID_AHS_PROJECT_UTAMA;
  const SATUAN = req.body.SATUAN;
  const VOLUME = req.body.VOLUME;
  const UPAH_NON_TDP = req.body.UPAH_NON_TDP;
  const BAHAN_NON_TDP = req.body.BAHAN_NON_TDP;
  const PM = req.body.PM;

  console.log(DETAIL);
  //console.log(ID_AHS_PROJECT_UTAMA);

  RABJudul[TAHUN].create({
    ID_RAB_PROJECT_BAGIAN: ID_RAB_PROJECT_BAGIAN,
    ITEM_PEKERJAAN: ITEM_PEKERJAAN,
    NO_URUT_1: NO_URUT_1,
    NO_URUT_2: NO_URUT_2,
    NO_URUT_3: NO_URUT_3,
    NO_URUT_4: NO_URUT_4,
    NO_URUT_5: NO_URUT_5,
    DETAIL: DETAIL,
  })
    .then((RABJudul) => {
      if (DETAIL) {
        console.log(RABJudul.ID_RAB_JUDUL);
        RABDetail[TAHUN].create({
          ID_RAB_JUDUL: RABJudul.ID_RAB_JUDUL,
          ID_AHS_PROJECT_UTAMA:
            ID_AHS_PROJECT_UTAMA == null ? null : ID_AHS_PROJECT_UTAMA,
          SATUAN: SATUAN,
          VOLUME: VOLUME,
          UPAH_NON_TDP: UPAH_NON_TDP,
          BAHAN_NON_TDP: BAHAN_NON_TDP,
          PM: PM,
        }).then((RABDetail) => {
          res.status(201).json({
            message: "Success pull data RAB Project Bagian",
            RABJudul: RABJudul,
            RABDetail: RABDetail,
          });
        });
      } else {
        res.status(201).json({
          message: "Success pull data RAB Project Bagian",
          RABJudul: RABJudul,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.deleteRABJudulDetail = (req, res, next) => {
  const TAHUN = req.body.TAHUN;
  const ID_RAB_JUDUL = req.body.ID_RAB_JUDUL;
  console.log(TAHUN);
  RABJudul[TAHUN].destroy({
    where: {
      ID_RAB_JUDUL: ID_RAB_JUDUL,
    },
    include: [
      {
        model: RABDetail[TAHUN],
        request: false,
      },
    ],
  })
    .then((RAB) => {
      console.log(RAB);
      console.log("mantap");
      res.status(201).json({
        message: "Success Delete RAB to Database",
        RAB: RAB,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.updateRABJudulDetail = (req, res, next) => {
  console.log("update rab");
  console.log(req.body);
  const ID_RAB_DETAIL = req.body.ID_RAB_DETAIL;
  const ID_RAB_JUDUL = req.body.ID_RAB_JUDUL;
  const ITEM_PEKERJAAN = req.body.ITEM_PEKERJAAN;
  const NO_URUT_1 = parseInt(req.body.NO_URUT_1);
  const NO_URUT_2 = parseInt(req.body.NO_URUT_2);
  const NO_URUT_3 = parseInt(req.body.NO_URUT_3);
  const NO_URUT_4 = parseInt(req.body.NO_URUT_4);
  const NO_URUT_5 = parseInt(req.body.NO_URUT_5);
  var DETAIL = req.body.DETAIL;
  if (DETAIL == "yes") {
    DETAIL = 1;
  } else if (DETAIL == "no") {
    DETAIL = 0;
  }

  //const ID_RAB_JUDUL = req.body.
  //const AHS_UTAMA_PROJECT_ID = req.body.AHS_UTAMA_PROJECT_ID;
  const SATUAN = req.body.SATUAN;
  const VOLUME = parseInt(req.body.VOLUME);
  var UPAH_NON_TDP = req.body.UPAH_NON_TDP;
  var BAHAN_NON_TDP = req.body.BAHAN_NON_TDP;
  var PM = req.body.PM;

  if (UPAH_NON_TDP == "yes") {
    UPAH_NON_TDP = 1;
  } else if (UPAH_NON_TDP == "no") {
    UPAH_NON_TDP = 0;
  }

  if (BAHAN_NON_TDP == "yes") {
    BAHAN_NON_TDP = 1;
  } else if (BAHAN_NON_TDP == "no") {
    BAHAN_NON_TDP = 0;
  }

  if (PM == "yes") {
    PM = 1;
  } else if (PM == "no") {
    PM = 0;
  }

  const TAHUN = req.body.TAHUN;

  console.log("update rab der");
  console.log(TAHUN);

  RABJudul[TAHUN].update(
    {
      ID_RAB_DETAIL: ID_RAB_DETAIL,
      ID_RAB_JUDUL: ID_RAB_JUDUL,
      ITEM_PEKERJAAN: ITEM_PEKERJAAN,
      NO_URUT_1: NO_URUT_1,
      NO_URUT_2: NO_URUT_2,
      NO_URUT_3: NO_URUT_3,
      NO_URUT_4: NO_URUT_4,
      NO_URUT_5: NO_URUT_5,
      DETAIL: DETAIL,
    },
    {
      where: {
        ID_RAB_JUDUL: ID_RAB_JUDUL,
      },
    }
  ).then((RABJudul) => {
    console.log("update judul skukses");
    RABDetail[TAHUN].update(
      {
        //AHS_UTAMA_PROJECT_ID: AHS_UTAMA_PROJECT_ID, //later
        SATUAN: SATUAN,
        VOLUME: VOLUME,
        UPAH_NON_TDP: UPAH_NON_TDP,
        BAHAN_NON_TDP: BAHAN_NON_TDP,
        PM: PM,
      },
      { where: { ID_RAB_DETAIL: ID_RAB_DETAIL } }
    )
      .then((RABDetail) => {
        res.status(201).json({
          message: "Success Edit RAB to Database",
          RABDetail: RABDetail,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
        console.log(err);
      });
  });
};

// ========================================= MARK: RAB Detail =========================================
