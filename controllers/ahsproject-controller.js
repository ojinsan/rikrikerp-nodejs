const AHSProjectUtama = require("../models/AHSProject/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProject/AHSProjectDetail");
const AHSSumberUtama = require("../models/DataSource/AHSSumberUtama");
const HS = require("../models/DataSource/HS");
const Project = require("../models/Project/Project");

exports.getAHSProjectSumberName = (req, res, next) => {
  // only retrieve AHS's Project unique value
};

exports.getAHSProjectFullDataBySumber = (req, res, next) => {
  // retrieve all data filtered by one sumber
};

exports.getAHSProjectFullData = (req, res, next) => {
  // retrieve all data from one table
  console.log("get AHS Project FullData");
  const TAHUN = req.query.TAHUN;
  console.log(TAHUN);
  AHSProjectUtama[TAHUN].findAll({
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
  })
    .then((AHSUtama) => {
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
    })
    .then((newAHSUtama) => {
      console.log("Sending AHS Project FullData");
      res.status(201).json({
        message: "Success Get AHS Project",
        AHS_PROJECT_UTAMA: newAHSUtama,
      });
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
};

exports.postNewAHSProjectUtama = (req, res, next) => {
  console.log("postNewAHSProjectUtama");
  const TAHUN = req.query.TAHUN;
  const ID_PROJECT = req.body.ID_PROJECT;
  const AHS_UTAMA_ID = req.body.AHS_UTAMA_ID;
  const NAMA_AHS_PROJECT = req.body.NAMA_AHS_PROJECT;
  const NO_URUT = req.body.NO_URUT;
  const KOEFISIEN_AHS = req.body.KOEFISIEN_AHS;
  const PENJELASAN_KOEFISIEN_AHS = req.body.PENJELASAN_KOEFISIEN_AHS;

  AHSProjectUtama[TAHUN].create({
    ID_PROJECT: ID_PROJECT,
    AHS_UTAMA_ID: AHS_UTAMA_ID,
    NAMA_AHS_PROJECT: NAMA_AHS_PROJECT,
    NO_URUT: NO_URUT,
    KOEFISIEN_AHS: KOEFISIEN_AHS,
    PENJELASAN_KOEFISIEN_AHS: PENJELASAN_KOEFISIEN_AHS,
  })
    .then((AHSProjectUtama) => {
      res.status(201).json({
        message: "Success Post New AHS Project Utama to Database",
        AHSProjectUtama: AHSProjectUtama,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.postNewAHSProjectDetail = (req, res, next) => {
  console.log("postNewAHSProjectDetails");
  const TAHUN = req.query.TAHUN;
  const ID_AHS_PROJECT_UTAMA = req.body.ID_AHS_PROJECT_UTAMA;
  const P_URAIAN = req.body.P_URAIAN;
  const P_KELOMPOK_URAIAN = req.body.P_KELOMPOK_URAIAN;
  const P_SATUAN_URAIAN = req.body.P_SATUAN_URAIAN;
  const P_KOEFISIEN_URAIAN = req.body.P_KOEFISIEN_URAIAN;
  const P_KETERANGAN_URAIAN = req.body.P_KETERANGAN_URAIAN;
  const P_HS_ANAK_AHS = req.body.P_HS_ANAK_AHS;
  const P_HS_AHS_P = req.body.P_HS_AHS_P;
  const ID_HS = req.body.ID_HS;

  AHSProjectDetail[TAHUN].create({
    ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA,
    P_URAIAN: P_URAIAN,
    P_KELOMPOK_URAIAN: P_KELOMPOK_URAIAN,
    P_SATUAN_URAIAN: P_SATUAN_URAIAN,
    P_KOEFISIEN_URAIAN: P_KOEFISIEN_URAIAN,
    ID_HS: ID_HS,
    P_KETERANGAN_URAIAN: P_KETERANGAN_URAIAN,
    P_HS_ANAK_AHS: P_HS_ANAK_AHS,
    P_HS_AHS_P: P_HS_AHS_P,
  })
    .then((AHSProjectDetail) => {
      res.status(201).json({
        message: "Success Post New AHS Project Detail to Database",
        AHSProjectDetail: AHSProjectDetail,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewAHSProjectUtamaDetail = (req, res, next) => {
  console.log("post new ahs project utama detail");
  const AHSProjects = req.body.AHSProjects;
  const TAHUN = req.body.tahun;
  const idproject = req.body.idproject;
  var ID_WILAYAH;

  Project[TAHUN].findOne({
    where: {
      ID_PROJECT: idproject,
    },
  })
    .then((project) => {
      ID_WILAYAH = project.ID_WILAYAH;
      console.log("id Project", idproject);
      console.log("id WILAYAH", ID_WILAYAH);
      AHSProjects.forEach((AHSProject) => {
        var AHS_PROJECT_UTAMA = {
          NAMA_AHS_PROJECT: AHSProject.name != null ? AHSProject.name : " ", // karena editable
          NO_URUT: parseInt(AHSProject.noAHS),
          KOEFISIEN_AHS: 1,
          // PENJELASAN_KOEFISIEN_AHS
          ID_PROJECT: idproject,
          ID_AHS_SUMBER_UTAMA: AHSProject.id,
        };

        // masukin utama ke DB, kalo berhasil, masukin bulk
        AHSProjectUtama[TAHUN].create(AHS_PROJECT_UTAMA)
          .then(async (result) => {
            // try {

            var AHSProjectDetails = [];
            var AHS_PROJECT_DETAILs = AHSProject.children.map(
              async (AHSProjectDetail) => {
                // search harga satuan
                console.log("uraian", AHSProjectDetail.name);

                result2 = await HS[TAHUN].findOne({
                  where: {
                    ID_WILAYAH: ID_WILAYAH,
                    URAIAN: AHSProjectDetail.name,
                  },
                });

                hasil = {
                  ID_AHS_PROJECT_UTAMA: result.ID_AHS_PROJECT_UTAMA,
                  P_URAIAN: AHSProjectDetail.name,
                  ID_HS: result2.ID_HS,
                  ID_AHS_SUMBER_UTAMA: AHSProjectDetail.noAHS,
                  P_KELOMPOK_URAIAN: AHSProjectDetail.kelompok,
                  P_SATUAN_URAIAN: AHSProjectDetail.satuan,
                  P_KOEFISIEN_URAIAN: AHSProjectDetail.koefisien,
                  P_KETERANGAN_URAIAN: AHSProjectDetail.keterangan,
                };

                console.log(hasil);
                //return hasil;
                return hasil;
              }
            );

            for await (const item of AHS_PROJECT_DETAILs) {
              console.log(item);
              AHSProjectDetails.push(item);
            }

            console.log("All done");
            console.log("map beres");
            console.log(AHSProjectDetails);
            return AHSProjectDetails;

            // } catch (err) {
            //   res.status(201).json({
            //     message: "Success Without New AHS Detail Detail to Database",
            //     AHSProjectDetail: err,
            //   });
            // }
            //return Promises.all(AHS_PROJECT_DETAILs);
          })
          .then((AHS_PROJECT_DETAILs) => {
            console.log(AHS_PROJECT_DETAILs);
            console.log("here");
            AHSProjectDetail[TAHUN].bulkCreate(AHS_PROJECT_DETAILs)
              .then((result2) => {
                console.log("mantep");
                res.status(201).json({
                  message: "Success Post New AHS Detail Detail to Database",
                  AHSProjectDetail: result2,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // AHSSumberDetail.bulkCreate(AHS_SUMBER_DETAILs)
  // .then((AHSSumberDetail) => {
  //     console.log("mantep");
  //     res.status(201).json({
  //         message: "Success Post New AHS Sumber Detail to Database",
  //         AHSSumberDetail: AHSSumberDetail,
  //     });
  // })
  // .catch((err) => {
  //     console.log(err);
  // });
};

exports.deleteAHSProjectUtama = (req, res, next) => {
  const ID_AHS_PROJECT_UTAMA = req.body.ID_AHS_PROJECT_UTAMA;
  const TAHUN = req.body.TAHUN;

  AHSProjectUtama[TAHUN].destroy({
    where: {
      ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA,
    },
  })
    .then((AHSProjectUtama) => {
      console.log("mantap");
      res.status(201).json({
        message: "Success Delete AHSP to Database",
        AHSProjectUtama: AHSProjectUtama,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.deleteAHSProjectDetail = (req, res, next) => {
  const ID_AHS_PROJECT_DETAIL = req.body.ID_AHS_PROJECT_DETAIL;
  const TAHUN = req.body.TAHUN;

  AHSProjectDetail[TAHUN].destroy({
    where: {
      ID_AHS_PROJECT_DETAIL: ID_AHS_PROJECT_DETAIL,
    },
  })
    .then((AHSProjectDetail) => {
      console.log("mantap");
      res.status(201).json({
        message: "Success Delete AHSP to Database",
        AHSProjectDetail: AHSProjectDetail,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

// update untuk menambah HS saja ini mah
exports.updateAHSProject = (req, res, next) => {
  const TAHUN = req.body.TAHUN;
  const ID_AHS_PROJECT_DETAIL = req.body.ID_AHS_PROJECT_DETAIL;
  const ID_HS = req.body.ID_HS;

  console.log(
    "menambahkan hs",
    ID_HS,
    "ke ahsproject",
    ID_AHS_PROJECT_DETAIL,
    TAHUN
  );

  AHSProjectDetail[TAHUN].update(
    {
      ID_HS: ID_HS,
    },
    {
      where: {
        ID_AHS_PROJECT_DETAIL: ID_AHS_PROJECT_DETAIL,
      },
    }
  )
    .then((AHSProjectDetail) => {
      res.status(201).json({
        message: "Success Edit RAB to Database",
        AHSProjectDetail: AHSProjectDetail,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};
