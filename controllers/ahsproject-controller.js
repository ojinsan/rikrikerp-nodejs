const AHSProjectUtama = require("../models/AHSProject/AHSProjectUtama");
const AHSProjectDetail = require("../models/AHSProject/AHSProjectDetail");
const AHSSumberUtama = require("../models/DataSource/AHSSumberUtama");
const HS = require("../models/DataSource/HS");
const Project = require("../models/Project/Project");
const AHSProjectRumus = require("../models/AHSProject/AHSProjectRumus");

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
  const ID_PROJECT = req.query.ID_PROJECT;
  console.log(TAHUN);
  AHSProjectUtama[TAHUN].findAll({
    where: {
      ID_PROJECT: ID_PROJECT,
    },
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
  var somethingwentwrong = false;
  var hskosong = [];
  var ahsgagalid = null;
  var existingAHSs = [];

  Project[TAHUN].findOne({
    where: {
      ID_PROJECT: idproject,
    },
  })
    .then((project) => {
      ID_WILAYAH = project.ID_WILAYAH;
      //console.log("id Project", idproject);
      //console.log("id WILAYAH", ID_WILAYAH);
      AHSProjects.forEach(async (AHSProject, z) => {
        var AHS_PROJECT_UTAMA = {
          NAMA_AHS_PROJECT: AHSProject.name != null ? AHSProject.name : "", // karena editable
          NO_URUT: parseInt(AHSProject.noAHS),
          KOEFISIEN_AHS: 1,
          // PENJELASAN_KOEFISIEN_AHS
          ID_PROJECT: idproject,
          ID_AHS_SUMBER_UTAMA: AHSProject.id,
        };

        // check if the ahs utama is exists
        alreadyExists = await AHSProjectUtama[TAHUN].findOne({
          where: {
            ID_AHS_SUMBER_UTAMA: AHS_PROJECT_UTAMA.ID_AHS_SUMBER_UTAMA,
            ID_PROJECT: idproject,
          },
        }).then((result) => {
          console.log("==========================================");
          console.log(result);
          if (result != null && result != undefined) {
            console.log("AHS Already exists");
            existingAHSs.push(result.NAMA_AHS_PROJECT);
            return true;
          } else {
            return false;
          }
        });

        if (!alreadyExists) {
          // masukin utama ke DB, kalo berhasil, masukin bulk
          AHSProjectUtama[TAHUN].create(AHS_PROJECT_UTAMA)
            .then(async (result) => {
              // try {

              var AHSProjectDetails = [];
              var AHS_PROJECT_DETAILs = AHSProject.childrens.map(
                async (AHSProjectDetail) => {
                  // search harga satuan
                  console.log("uraian", AHSProjectDetail.name);

                  result2 = await HS[TAHUN].findOne({
                    where: {
                      ID_WILAYAH: ID_WILAYAH,
                      URAIAN: AHSProjectDetail.name,
                      SATUAN: AHSProjectDetail.satuan,
                    },
                  });

                  if (result2 == null || result2 == undefined) {
                    hskosong.push(AHSProjectDetail.name);
                    ahsgagalid = result.ID_AHS_PROJECT_UTAMA;
                    somethingwentwrong = true;
                    return null;
                  }

                  if (!somethingwentwrong) {
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
                    return hasil;
                  } else {
                    return null;
                  }
                }
              );

              if (!somethingwentwrong) {
                //this is magic, idk why
                for await (const item of AHS_PROJECT_DETAILs) {
                  console.log(item);
                  AHSProjectDetails.push(item);
                }

                console.log("All done");
                console.log("map beres");
                console.log(AHSProjectDetails);
                return AHSProjectDetails;
              }

              return null;
            })
            .then((AHS_PROJECT_DETAILs) => {
              if (!somethingwentwrong) {
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
              } else {
                AHSProjectUtama[TAHUN].destroy({
                  where: {
                    ID_AHS_PROJECT_UTAMA: ahsgagalid,
                  },
                }).then(() => {
                  console.log("back");
                  res.status(400).json({
                    message: "HS Belum Lengkap",
                    HS: hskosong,
                  });
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (z == AHSProjects.length - 1) {
          console.log(existingAHSs);
          res.status(400).json({
            message: "Hanya memasukan AHS Unique",
            HS: ["", ""],
            AHS: existingAHSs,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewAHSProjectUtamaDetailKhusus = async (req, res, next) => {
  console.log("kasus khusus write");
  const AHSPs = req.body.AHSPs;
  const TAHUN = req.body.TAHUN;
  const idproject = req.body.ID_PROJECT;

  var ID_WILAYAH;
  var somethingwentwrong = false;
  var hskosong = [];

  Project[TAHUN].findOne({
    where: {
      ID_PROJECT: idproject,
    },
  }).then((project) => {
    ID_WILAYAH = project.ID_WILAYAH;
    if (AHSPs.length == 2) {
      AHSP = AHSPs[1];
    } else {
      AHSP = AHSPs[0];
    }

    // parse AHS utama pair
    var AHS_PROJECT_UTAMA = {
      NAMA_AHS_PROJECT: AHSP.name != null ? AHSP.name : "", // karena editable
      NO_URUT: parseInt(AHSP.noAHS),
      KOEFISIEN_AHS: 1,
      // PENJELASAN_KOEFISIEN_AHS
      ID_PROJECT: idproject,
      ID_AHS_SUMBER_UTAMA: AHSP.id,
      IS_PAIR: AHSPs.length == 2 ? 1 : null,
    };

    AHSProjectUtama[TAHUN].create(AHS_PROJECT_UTAMA)
      .then(async (result) => {
        var AHSProjectDetails = [];
        // get the details and related HS
        var AHS_PROJECT_DETAILs = AHSP.AHSDetails.map(
          async (AHSProjectDetail) => {
            console.log("uraian", AHSProjectDetail.name);
            // search related HS
            result2 = await HS[TAHUN].findOne({
              where: {
                ID_WILAYAH: ID_WILAYAH,
                URAIAN: AHSProjectDetail.name,
                SATUAN: AHSProjectDetail.satuan,
              },
            });

            if (result2 == null || result2 == undefined) {
              hskosong.push(AHSProjectDetail.name);
              ahsgagalid = result.ID_AHS_PROJECT_UTAMA;
              somethingwentwrong = true;
              return null;
            }

            // if the HS found!
            if (!somethingwentwrong) {
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
              return hasil;
            } else {
              return null;
            }
          }
        );
        if (!somethingwentwrong) {
          //this is magic, idk why
          for await (const item of AHS_PROJECT_DETAILs) {
            console.log(item);
            AHSProjectDetails.push(item);
          }

          console.log("All done");
          console.log("map beres");
          console.log(AHSProjectDetails);
          return AHSProjectDetails;
        }

        return null;
        // ========= END OF CREATE AHS PROJECT UTAMA SUB
      })
      .then((AHS_PROJECT_DETAILs) => {
        if (!somethingwentwrong) {
          console.log(AHS_PROJECT_DETAILs);
          console.log("here");
          AHSProjectDetail[TAHUN].bulkCreate(AHS_PROJECT_DETAILs)
            .then((result2) => {
              // jangan dulu respons
              // res.status(201).json({
              //   message: "Success Post New AHS Detail Detail to Database",
              //   AHSProjectDetail: result2,
              // });
              return AHS_PROJECT_DETAILs[0].ID_AHS_PROJECT_UTAMA;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          AHSProjectUtama[TAHUN].destroy({
            where: {
              ID_AHS_PROJECT_UTAMA: ahsgagalid,
            },
          }).then(() => {
            console.log("back");
            res.status(400).json({
              message: "HS Belum Lengkap",
              HS: hskosong,
            });
            return null;
          });
        }
        return AHS_PROJECT_DETAILs[0].ID_AHS_PROJECT_UTAMA;

        // =========== END OF CREATE AHS PROJECT DETAIL SUB
      })
      .then((ID_AHS_PROJECT_UTAMA) => {
        console.log("=========", ID_AHS_PROJECT_UTAMA);
        if (AHSP.AHSRumuss != null) {
          newRumuss = AHSP.AHSRumuss.map((AHSPKhusus) => {
            newAHSPKhusus = {
              ...AHSPKhusus,
              ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA,
            };
            return newAHSPKhusus;
          });
          AHSProjectRumus[TAHUN].bulkCreate(newRumuss);
        }
        return ID_AHS_PROJECT_UTAMA;
        // =========== END OF CREATE RUMUS SUB
        // =========== END OF SUB =====================
      })
      .then((ID_AHS_PROJECT_UTAMA) => {
        ID_WILAYAH = project.ID_WILAYAH;
        if (AHSPs.length < 2) {
          return;
        }
        AHSP = AHSPs[0];
        // parse AHS utama pair
        var AHS_PROJECT_UTAMA = {
          NAMA_AHS_PROJECT: AHSP.name != null ? AHSP.name : "", // karena editable
          NO_URUT: parseInt(AHSP.noAHS),
          KOEFISIEN_AHS: 1,
          // PENJELASAN_KOEFISIEN_AHS
          ID_PROJECT: idproject,
          ID_AHS_SUMBER_UTAMA: AHSP.id,
          PAIR: ID_AHS_PROJECT_UTAMA,
        };

        AHSProjectUtama[TAHUN].create(AHS_PROJECT_UTAMA)
          .then(async (result) => {
            var AHSProjectDetails = [];
            // get the details and related HS
            var AHS_PROJECT_DETAILs = AHSP.AHSDetails.map(
              async (AHSProjectDetail) => {
                console.log("uraian", AHSProjectDetail.name);
                // search related HS
                result2 = await HS[TAHUN].findOne({
                  where: {
                    ID_WILAYAH: ID_WILAYAH,
                    URAIAN: AHSProjectDetail.name,
                    SATUAN: AHSProjectDetail.satuan,
                  },
                });

                if (result2 == null || result2 == undefined) {
                  hskosong.push(AHSProjectDetail.name);
                  ahsgagalid = result.ID_AHS_PROJECT_UTAMA;
                  somethingwentwrong = true;
                  return null;
                }

                // if the HS found!
                if (!somethingwentwrong) {
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
                  return hasil;
                } else {
                  return null;
                }
              }
            );
            if (!somethingwentwrong) {
              //this is magic, idk why
              for await (const item of AHS_PROJECT_DETAILs) {
                console.log(item);
                AHSProjectDetails.push(item);
              }

              console.log("All done");
              console.log("map beres");
              console.log(AHSProjectDetails);
              return AHSProjectDetails;
            }

            return null;
            // ========= END OF CREATE AHS PROJECT UTAMA MAIN
          })
          .then((AHS_PROJECT_DETAILs) => {
            if (AHSPs.length < 2) {
              return;
            }
            if (!somethingwentwrong) {
              console.log(AHS_PROJECT_DETAILs);
              console.log("here");
              AHSProjectDetail[TAHUN].bulkCreate(AHS_PROJECT_DETAILs)
                .then((result2) => {
                  // jangan dulu respons
                  // res.status(201).json({
                  //   message: "Success Post New AHS Detail Detail to Database",
                  //   AHSProjectDetail: result2,
                  // });
                  return AHS_PROJECT_DETAILs[0].ID_AHS_PROJECT_UTAMA;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              AHSProjectUtama[TAHUN].destroy({
                where: {
                  ID_AHS_PROJECT_UTAMA: ahsgagalid,
                },
              }).then(() => {
                console.log("back");
                res.status(400).json({
                  message: "HS Belum Lengkap",
                  HS: hskosong,
                });
                return null;
              });
            }
            return AHS_PROJECT_DETAILs[0].ID_AHS_PROJECT_UTAMA;

            // =========== END OF CREATE AHS PROJECT DETAIL MAIN
          })
          .then((ID_AHS_PROJECT_UTAMA) => {
            if (AHSPs.length < 2) {
              res.status(201).json({
                message: "Success Post Khusus",
              });
              return;
            }
            if (AHSP.AHSRumuss != null && ID_AHS_PROJECT_UTAMA != null) {
              newRumuss = AHSP.AHSRumuss.map((AHSPKhusus) => {
                newAHSPKhusus = {
                  ...AHSPKhusus,
                  ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA,
                };
                return newAHSPKhusus;
              });
              AHSProjectRumus[TAHUN].bulkCreate(newRumuss);
            }

            res.status(201).json({
              message: "Success Post Khusus",
            });

            // =========== END OF CREATE RUMUS MAIN
            // =========== END OF MAIN
          });
      });
  });
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
exports.updateAHSProjectSpecific = (req, res, next) => {
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

exports.updateAHSProjectUtama = (req, res, next) => {
  console.log("update AHS Project");
  console.log(req.body);

  const TAHUN = req.query.TAHUN;
  const ID_AHS_PROJECT_UTAMA = req.body.ID_AHS_PROJECT_UTAMA;
  const NAMA_AHS_PROJECT = req.body.NAMA_AHS;

  AHSProjectUtama[TAHUN].update(
    {
      NAMA_AHS_PROJECT: NAMA_AHS_PROJECT,
    },
    {
      where: {
        ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA,
      },
    }
  );

  res.status(201).json({
    message: "Success Edit New RABPB to Database",
  });
};

exports.getAHSProjectFullLookup = (req, res, next) => {
  console.log("get AHS Project Lookup");
  const ID_AHS_PROJECT_UTAMA = req.query.ID_AHS_PROJECT_UTAMA;
  const TAHUN = req.query.TAHUN;

  AHSProjectUtama[TAHUN].findOne({
    where: { ID_AHS_PROJECT_UTAMA: ID_AHS_PROJECT_UTAMA },
    include: [
      {
        model: AHSProjectDetail[TAHUN],
        required: false,
      },
    ],
    //order: [["AHS_PROJECT_DETAILs", "KELOMPOK_URAIAN", "DESC"]],
  })
    .then((AHS) => {
      res.status(201).json({
        message: "Success Get AHS Project",
        AHS_PROJECT_UTAMA: AHS,
      });
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
};
