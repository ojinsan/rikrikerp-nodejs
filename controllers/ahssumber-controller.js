const AHSSumberUtama = require("../models/DataSource/AHSSumberUtama");
const AHSSumberDetail = require("../models/DataSource/AHSSumberDetail");

exports.getAHSSumberSumberName = (req, res, next) => {
  // only retrieve AHS's sumber unique value
};

exports.getAHSSumberFullDataBySumber = (req, res, next) => {
  // retrieve all data filtered by one sumber
};

exports.getAHSSumberFullData = (req, res, next) => {
  // retrieve all data from one table
  console.log("get AHS Sumber FullData");
  AHSSumberUtama.findAll({
    include: [
      {
        model: AHSSumberDetail,
        required: false,
      },
    ],
    order: [["AHS_SUMBER_DETAILs", "KELOMPOK_URAIAN", "DESC"]],
  })
    .then((AHS) => {
      res.status(201).json({
        message: "Success Get AHS Sumber",
        AHS: AHS,
      });
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
};

exports.getAHSSumberFullLookup = (req, res, next) => {
  console.log("get AHS Sumber Lookup");
  const ID_AHS_SUMBER_UTAMA = req.query.ID_AHS_SUMBER_UTAMA;

  AHSSumberUtama.findOne({
    where: { ID_AHS_SUMBER_UTAMA: ID_AHS_SUMBER_UTAMA },
    include: [
      {
        model: AHSSumberDetail,
        required: false,
      },
    ],
    order: [["AHS_SUMBER_DETAILs", "KELOMPOK_URAIAN", "DESC"]],
  })
    .then((AHS) => {
      res.status(201).json({
        message: "Success Get AHS Sumber",
        AHS_SUMBER_UTAMA: AHS,
      });
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
};

exports.postNewAHSSumberUtama = (req, res, next) => {
  console.log("postNewAHSSumberUtama");

  const NAMA_AHS = req.body.NAMA_AHS;
  const NOMOR_AHS = req.body.NOMOR_AHS;
  const SUMBER_AHS = req.body.SUMBER_AHS;
  const SATUAN_AHS = req.body.SATUAN_AHS;
  const SCREENSHOT_AHS = req.body.SCREENSHOT_AHS;
  const KHUSUS = req.body.KHUSUS;

  AHSSumberUtama.create({
    //idBukuRef: 123,
    NAMA_AHS: NAMA_AHS,
    NOMOR_AHS: NOMOR_AHS,
    SUMBER_AHS: SUMBER_AHS,
    SATUAN_AHS: SATUAN_AHS,
    SCREENSHOT_AHS: SCREENSHOT_AHS,
    KHUSUS: KHUSUS,
  })
    .then((AHSSumberUtama) => {
      res.status(201).json({
        message: "Success Post New AHS Sumber Utama to Database",
        AHSSumberUtama: AHSSumberUtama,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.postNewAHSSumberDetail = (req, res, next) => {
  console.log("postNewAHSSumberDetail");

  const ID_AHS_SUMBER_UTAMA = req.body.ID_AHS_SUMBER_UTAMA;
  const URAIAN = req.body.URAIAN;
  const KODE_URAIAN = req.body.KODE_URAIAN;
  const KELOMPOK_URAIAN = req.body.KELOMPOK_URAIAN;
  const SATUAN_URAIAN = req.body.SATUAN_URAIAN;
  const KOEFISIEN_URAIAN = req.body.KOEFISIEN_URAIAN;
  const KETERANGAN_URAIAN = req.body.KETERANGAN_URAIAN;

  // AHSSumberDetail.create({
  //     ID_AHS_SUMBER_UTAMA: ID_AHS_SUMBER_UTAMA,
  //     URAIAN: URAIAN,
  //     KODE_URAIAN: KODE_URAIAN,
  //     KELOMPOK_URAIAN: KELOMPOK_URAIAN,
  //     SATUAN_URAIAN: SATUAN_URAIAN,
  //     KOEFISIEN_URAIAN: KOEFISIEN_URAIAN,
  //     KETERANGAN_URAIAN: KETERANGAN_URAIAN,
  // })
  //     .then((AHSSumberDetail) => {
  //         res.status(201).json({
  //             message: "Success Post New AHS Sumber Detail to Database",
  //             AHSSumberDetail: AHSSumberDetail,
  //         });
  //     })
  //     .catch((err) => {
  //         console.log(err);
  //     });

  console.log(req.body.AHS_SUMBER_DETAILs);
  const AHS_SUMBER_DETAILs = req.body.AHS_SUMBER_DETAILs.map(
    (AHS_SUMBER_DETAIL) => {
      return {
        ID_AHS_SUMBER_UTAMA: req.body.ID_AHS_SUMBER_UTAMA,
        URAIAN: AHS_SUMBER_DETAIL.URAIAN,
        KODE_URAIAN: AHS_SUMBER_DETAIL.KODE_URAIAN,
        KELOMPOK_URAIAN: AHS_SUMBER_DETAIL.KELOMPOK_URAIAN,
        SATUAN_URAIAN: AHS_SUMBER_DETAIL.SATUAN_URAIAN,
        KOEFISIEN_URAIAN: AHS_SUMBER_DETAIL.KOEFISIEN_URAIAN,
        KETERANGAN_URAIAN: AHS_SUMBER_DETAIL.KETERANGAN_URAIAN,
      };
    }
  );

  console.log(AHS_SUMBER_DETAILs);

  AHSSumberDetail.bulkCreate(AHS_SUMBER_DETAILs)
    .then((AHSSumberDetail) => {
      console.log("mantep");
      res.status(201).json({
        message: "Success Post New AHS Sumber Detail to Database",
        AHSSumberDetail: AHSSumberDetail,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewAHSSumberUtamaDetail = (req, res, next) => {
  const NAMA_AHS = req.body.NAMA_AHS;
  const NOMOR_AHS = req.body.NOMOR_AHS;
  const SUMBER_AHS = req.body.SUMBER_AHS;
  const SATUAN_AHS = req.body.SATUAN_AHS;
  const SCREENSHOT_AHS = req.body.SCREENSHOT_AHS;
  const KHUSUS = req.body.KHUSUS;
  const AHSDetails = req.body.AHSDetails;

  AHSSumberUtama.create({
    //idBukuRef: 123,
    NAMA_AHS: NAMA_AHS,
    NOMOR_AHS: NOMOR_AHS,
    SUMBER_AHS: SUMBER_AHS,
    SATUAN_AHS: SATUAN_AHS,
    SCREENSHOT_AHS: SCREENSHOT_AHS,
    KHUSUS: KHUSUS,
  })
    .then((AHSSumberUtama) => {
      if (AHSDetails == [] || AHSDetails == null || AHSDetails == undefined) {
        return;
      } else {
        const AHSDetailsTemp = AHSDetails.map((ahs) => {
          console.log({
            ...ahs,
            ID_AHS_SUMBER_UTAMA: AHSSumberUtama.ID_AHS_SUMBER_UTAMA,
          });
          return {
            ...ahs,
            ID_AHS_SUMBER_UTAMA: AHSSumberUtama.ID_AHS_SUMBER_UTAMA,
          };
        });

        return [AHSSumberUtama, AHSSumberDetail.bulkCreate(AHSDetailsTemp)];
      }
    })
    .then((AHSSumber) => {
      res.status(201).json({
        message: "Success Post New AHS Sumber and Detail Utama to Database",
        AHSSumberUtama: AHSSumber[0],
        AHSSumberDetail: AHSSumberDetail[1],
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.deleteAHSSumberUtama = (req, res, next) => {
  const ID_AHS_SUMBER_UTAMA = req.body.ID_AHS_SUMBER_UTAMA;
  AHSSumberUtama.destroy({
    where: {
      ID_AHS_SUMBER_UTAMA: ID_AHS_SUMBER_UTAMA,
    },
  })
    .then((AHSSumberUtama) => {
      console.log("mantap");
      res.status(201).json({
        message: "Success Delete New HS to Database",
        AHSSumberUtama: AHSSumberUtama,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.updateAHSSumberUtama = (req, res, next) => {
  const NAMA_AHS = req.body.NAMA_AHS;
  const NOMOR_AHS = req.body.NOMOR_AHS;
  const SUMBER_AHS = req.body.SUMBER_AHS;
  const SATUAN_AHS = req.body.SATUAN_AHS;
  const SCREENSHOT_AHS = req.body.SCREENSHOT_AHS;
  const KHUSUS = req.body.KHUSUS;
  const ID_AHS_SUMBER_UTAMA = req.body.ID_AHS_SUMBER_UTAMA;

  AHSSumberUtama.update(
    {
      NAMA_AHS: NAMA_AHS,
      NOMOR_AHS: NOMOR_AHS,
      SUMBER_AHS: SUMBER_AHS,
      SATUAN_AHS: SATUAN_AHS,
      SCREENSHOT_AHS: SCREENSHOT_AHS,
      KHUSUS: KHUSUS,
    },
    {
      where: {
        ID_AHS_SUMBER_UTAMA: ID_AHS_SUMBER_UTAMA,
      },
    }
  )
    .then((AHSSumberUtama) => {
      res.status(201).json({
        message: "Success Edit New HS to Database",
        AHSSumberUtama: AHSSumberUtama,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.deleteAHSSumberDetail = (req, res, next) => {
  const ID_AHS_SUMBER_DETAIL = req.body.ID_AHS_SUMBER_DETAIL;
  AHSSumberDetail.destroy({
    where: {
      ID_AHS_SUMBER_DETAIL: ID_AHS_SUMBER_DETAIL,
    },
  })
    .then((AHSSumberDetail) => {
      console.log("mantap");
      res.status(201).json({
        message: "Success Delete New HS to Database",
        AHSSumberDetail: AHSSumberDetail,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.updateAHSSumberDetail = (req, res, next) => {
  const ID_AHS_SUMBER_UTAMA = req.body.ID_AHS_SUMBER_UTAMA;
  const URAIAN = req.body.URAIAN;
  const KODE_URAIAN = req.body.KODE_URAIAN;
  const KELOMPOK_URAIAN = req.body.KELOMPOK_URAIAN;
  const SATUAN_URAIAN = req.body.SATUAN_URAIAN;
  const KOEFISIEN_URAIAN = req.body.KOEFISIEN_URAIAN;
  const KETERANGAN_URAIAN = req.body.KETERANGAN_URAIAN;
  const ID_AHS_SUMBER_DETAIL = req.body.ID_AHS_SUMBER_DETAIL;

  AHSSumberDetail.update(
    {
      //ID_AHS_SUMBER_UTAMA: ID_AHS_SUMBER_UTAMA,
      URAIAN: URAIAN,
      KODE_URAIAN: KODE_URAIAN,
      KELOMPOK_URAIAN: KELOMPOK_URAIAN,
      SATUAN_URAIAN: SATUAN_URAIAN,
      KOEFISIEN_URAIAN: KOEFISIEN_URAIAN,
      KETERANGAN_URAIAN: KETERANGAN_URAIAN,
    },
    {
      where: {
        ID_AHS_SUMBER_DETAIL: ID_AHS_SUMBER_DETAIL,
      },
    }
  )
    .then((AHSSumberDetail) => {
      res.status(201).json({
        message: "Success Edit New HS to Database",
        AHSSumberDetail: AHSSumberDetail,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};
