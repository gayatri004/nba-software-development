const express = require("express");
const PDFDocument = require("pdfkit");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const imageToPDF = require("image-to-pdf");
const libre = require("libreoffice-convert");
const fsExtra = require("fs-extra");
const { default: PDFMerger } = require("pdf-merger-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Folder
const uploadFolder = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

app.use("/uploads", express.static(uploadFolder));

// Report Folder
const reportFolder = path.join(uploadFolder, "reports");

if (!fs.existsSync(reportFolder)) {
    fs.mkdirSync(reportFolder, { recursive: true });
}

// Converted PDF Folder
const pdfFolder = path.join(uploadFolder, "converted");

if (!fs.existsSync(pdfFolder)) {
    fs.mkdirSync(pdfFolder, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

const upload = multer({
    storage
});
// ======================================================
// ======================================================
// ================= CRITERIA 1 BACKEND START =============
// ======================================================
// ======================================================

const db = pool;


// ======================================================
// 1.1.1 + 1.1.3 + 1.1.4 + 1.1.5
// SAVE VISION / MISSION / PEO
// ======================================================

app.post(
  "/save-vision",

  upload.fields([

    // -------------------------
    // 1.1.1
    // -------------------------

    { name: "visionFile", maxCount: 1 },
    { name: "missionFile", maxCount: 1 },
    { name: "peoFile1", maxCount: 1 },
    { name: "peoFile2", maxCount: 1 },
    { name: "peoFile3", maxCount: 1 },

    // -------------------------
    // 1.1.3
    // -------------------------

    { name: "minutesFile", maxCount: 1 },
    { name: "bosFile", maxCount: 1 },
    { name: "iqacFile", maxCount: 1 },
    { name: "stakeholderFile", maxCount: 1 },
    { name: "stakeholderFeedbackFile", maxCount: 1 },
    { name: "industryConsultationFile", maxCount: 1 },
    { name: "bosApprovalFile", maxCount: 1 },

    // -------------------------
    // 1.1.4
    // -------------------------

    { name: "websiteFile", maxCount: 1 },
    { name: "noticeBoardFile", maxCount: 1 },
    { name: "studentHandbookFile", maxCount: 1 },
    { name: "prospectusFile", maxCount: 1 },
    { name: "orientationFile", maxCount: 1 },
    { name: "communicationPlanFile", maxCount: 1 },
    { name: "meetingRecordFile", maxCount: 1 },

    // -------------------------
    // 1.1.5
    // -------------------------

    { name: "justificationFile", maxCount: 1 }

  ]),

  async (req, res) => {

    console.log("CRITERIA 1 / SAVE VISION");
    console.log("BODY =", req.body);

    try {

      const {
        vision,
        mission,

        peo1,
        peo2,
        peo3,

        visionMissionProcess,
        peoProcess,

        publicationProcess,
        disseminationProcess,

        peo1_m1,
        peo1_m2,
        peo1_m3,
        peo1_m4,

        peo2_m1,
        peo2_m2,
        peo2_m3,
        peo2_m4,

        peo3_m1,
        peo3_m2,
        peo3_m3,
        peo3_m4,

        justification

      } = req.body;


      // ==================================================
      // FILES
      // ==================================================

      const visionFile =
        req.files["visionFile"]?.[0]?.filename || null;

      const missionFile =
        req.files["missionFile"]?.[0]?.filename || null;

      const peoFile1 =
        req.files["peoFile1"]?.[0]?.filename || null;

      const peoFile2 =
        req.files["peoFile2"]?.[0]?.filename || null;

      const peoFile3 =
        req.files["peoFile3"]?.[0]?.filename || null;


      // 1.1.3

      const minutesFile =
        req.files["minutesFile"]?.[0]?.filename || null;

      const bosFile =
        req.files["bosFile"]?.[0]?.filename || null;

      const iqacFile =
        req.files["iqacFile"]?.[0]?.filename || null;

      const stakeholderFile =
        req.files["stakeholderFile"]?.[0]?.filename || null;

      const stakeholderFeedbackFile =
        req.files["stakeholderFeedbackFile"]?.[0]?.filename || null;

      const industryConsultationFile =
        req.files["industryConsultationFile"]?.[0]?.filename || null;

      const bosApprovalFile =
        req.files["bosApprovalFile"]?.[0]?.filename || null;


      // 1.1.4

      const websiteFile =
        req.files["websiteFile"]?.[0]?.filename || null;

      const noticeBoardFile =
        req.files["noticeBoardFile"]?.[0]?.filename || null;

      const studentHandbookFile =
        req.files["studentHandbookFile"]?.[0]?.filename || null;

      const prospectusFile =
        req.files["prospectusFile"]?.[0]?.filename || null;

      const orientationFile =
        req.files["orientationFile"]?.[0]?.filename || null;

      const communicationPlanFile =
        req.files["communicationPlanFile"]?.[0]?.filename || null;

      const meetingRecordFile =
        req.files["meetingRecordFile"]?.[0]?.filename || null;


      // 1.1.5

      const justificationFile =
        req.files["justificationFile"]?.[0]?.filename || null;


      // ==================================================
      // DATABASE INSERT
      // ==================================================

      await db.query(

        `
        INSERT INTO vision_mission
        (
          vision,
          mission,
          peo1,
          peo2,
          peo3,

          vision_file,
          mission_file,
          peo_file1,
          peo_file2,
          peo_file3,

          vision_mission_process,
          peo_process,

          minutes_file,
          bos_file,
          iqac_file,
          stakeholder_file,
          stakeholder_feedback_file,
          industry_consultation_file,
          bos_approval_file,

          publication_process,
          dissemination_process,

          website_file,
          notice_board_file,
          student_handbook_file,
          prospectus_file,
          orientation_file,
          communication_plan_file,
          meeting_record_file,

          peo1_m1,
          peo1_m2,
          peo1_m3,
          peo1_m4,

          peo2_m1,
          peo2_m2,
          peo2_m3,
          peo2_m4,

          peo3_m1,
          peo3_m2,
          peo3_m3,
          peo3_m4,

          justification,
          justification_file
        )

        VALUES
        (
          $1,$2,$3,$4,$5,
          $6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,
          $20,$21,
          $22,$23,$24,$25,$26,$27,$28,
          $29,$30,$31,$32,
          $33,$34,$35,$36,
          $37,$38,$39,$40,
          $41,$42
        )
        `,

        [

          vision,
          mission,
          peo1,
          peo2,
          peo3,

          visionFile,
          missionFile,
          peoFile1,
          peoFile2,
          peoFile3,

          visionMissionProcess,
          peoProcess,

          minutesFile,
          bosFile,
          iqacFile,
          stakeholderFile,
          stakeholderFeedbackFile,
          industryConsultationFile,
          bosApprovalFile,

          publicationProcess,
          disseminationProcess,

          websiteFile,
          noticeBoardFile,
          studentHandbookFile,
          prospectusFile,
          orientationFile,
          communicationPlanFile,
          meetingRecordFile,

          peo1_m1,
          peo1_m2,
          peo1_m3,
          peo1_m4,

          peo2_m1,
          peo2_m2,
          peo2_m3,
          peo2_m4,

          peo3_m1,
          peo3_m2,
          peo3_m3,
          peo3_m4,

          justification,
          justificationFile

        ]

      );


      res.json({
        success: true,
        message: "Criteria 1 Vision/Mission Saved Successfully"
      });


    } catch (error) {

      console.log("CRITERIA 1 SAVE ERROR =", error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }

);


// ======================================================
// GET VISION / MISSION
// ======================================================

app.get(
  "/print-vision-files",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT *
          FROM vision_mission
          ORDER BY id DESC
          LIMIT 1
          `
        );

      if (
        result.rows.length === 0
      ) {

        return res.json({});

      }

      res.json(
        result.rows[0]
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Print Error"
      });

    }

  }
);


// ======================================================
// DOWNLOAD CRITERIA 1 FILE
// ======================================================

app.get(
  "/download/:fileName",

  (req, res) => {

    try {

      const filePath =
        path.join(
          __dirname,
          "uploads",
          req.params.fileName
        );

      if (
        !fs.existsSync(filePath)
      ) {

        return res.status(404).json({
          success: false,
          message: "File not found"
        });

      }

      res.download(filePath);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);


// ======================================================
// 1.1.2 / CURRICULUM
// ======================================================

app.post(
  "/save-curriculum",

  upload.fields([

    { name: "tlpAttachment", maxCount: 1 },
    { name: "syllabusFile", maxCount: 1 },
    { name: "departmentSubjectsFile", maxCount: 1 },
    { name: "generalScienceFile", maxCount: 1 },
    { name: "mdmElectiveFile", maxCount: 1 },
    { name: "methodFile", maxCount: 1 },
    { name: "creditFile", maxCount: 1 },
    { name: "curriculumGapFile", maxCount: 1 },
    { name: "activityFile", maxCount: 1 }

  ]),

  async (req, res) => {

    try {

      const {
        teachingLearningProcess,
        curriculumDevelopmentProcess,
        gapDescription,
        actionTaken,
        academicYear,
        semester,
        activityName,
        facultyName

      } = req.body;


      const tlpAttachment =
        req.files["tlpAttachment"]?.[0]?.filename || null;

      const syllabusFile =
        req.files["syllabusFile"]?.[0]?.filename || null;

      const departmentSubjectsFile =
        req.files["departmentSubjectsFile"]?.[0]?.filename || null;

      const generalScienceFile =
        req.files["generalScienceFile"]?.[0]?.filename || null;

      const mdmElectiveFile =
        req.files["mdmElectiveFile"]?.[0]?.filename || null;

      const methodFile =
        req.files["methodFile"]?.[0]?.filename || null;

      const creditFile =
        req.files["creditFile"]?.[0]?.filename || null;

      const curriculumGapFile =
        req.files["curriculumGapFile"]?.[0]?.filename || null;

      const activityFile =
        req.files["activityFile"]?.[0]?.filename || null;


      await db.query(

        `
        INSERT INTO curriculum
        (
          teaching_learning_process,
          curriculum_development_process,

          tlp_attachment,
          syllabus_file,

          department_subjects_file,
          general_science_file,
          mdm_elective_file,

          teaching_learning_methods_file,
          credit_structure_file,

          gap_description,
          action_taken,
          curriculum_gap_file,

          academic_year,
          semester,
          activity_name,
          faculty_name,
          activity_file
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,
          $10,$11,$12,$13,$14,$15,$16,$17
        )
        `,

        [
          teachingLearningProcess,
          curriculumDevelopmentProcess,

          tlpAttachment,
          syllabusFile,

          departmentSubjectsFile,
          generalScienceFile,
          mdmElectiveFile,

          methodFile,
          creditFile,

          gapDescription,
          actionTaken,
          curriculumGapFile,

          academicYear,
          semester,
          activityName,
          facultyName,
          activityFile
        ]

      );


      res.json({
        success: true,
        message: "Curriculum Saved Successfully"
      });


    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);


// ======================================================
// GET CURRICULUM
// ======================================================

app.get(
  "/get-curriculum",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT
            teaching_learning_process,
            curriculum_development_process,
            tlp_attachment,
            syllabus_file,
            department_subjects_file,
            general_science_file,
            mdm_elective_file,
            teaching_learning_methods_file,
            credit_structure_file,
            gap_description,
            action_taken,
            curriculum_gap_file,
            academic_year,
            semester,
            activity_name,
            faculty_name,
            activity_file
          FROM curriculum
          ORDER BY id DESC
          LIMIT 1
          `
        );

      res.json(
        result.rows[0] || {}
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// PRINT CURRICULUM FILES
// ======================================================

app.get(
  "/print-curriculum-files",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT
            tlp_attachment,
            syllabus_file,
            department_subjects_file,
            general_science_file,
            mdm_elective_file,
            teaching_learning_methods_file,
            credit_structure_file,
            curriculum_gap_file,
            activity_file
          FROM curriculum
          ORDER BY id DESC
          LIMIT 1
          `
        );

      res.json(
        result.rows[0] || {}
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// PO / PSO
// ======================================================

app.post(
  "/save-popso",

  upload.fields([

    { name: "poPsoFile", maxCount: 1 },
    { name: "mappingFile", maxCount: 1 },
    { name: "justificationFile", maxCount: 1 }

  ]),

  async (req, res) => {

    try {

      const poPsoFile =
        req.files["poPsoFile"]?.[0]?.filename || null;

      const mappingFile =
        req.files["mappingFile"]?.[0]?.filename || null;

      const justificationFile =
        req.files["justificationFile"]?.[0]?.filename || null;


      await db.query(

        `
        INSERT INTO po_pso
        (
          po_pso_file,
          mapping_file,
          justification_file
        )

        VALUES
        (
          $1,$2,$3
        )
        `,

        [
          poPsoFile,
          mappingFile,
          justificationFile
        ]

      );


      res.json({
        success: true,
        message: "PO & PSO Saved Successfully"
      });


    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);


// ======================================================
// GET PO / PSO
// ======================================================

app.get(
  "/get-popso",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT *
          FROM po_pso
          ORDER BY id DESC
          LIMIT 1
          `
        );

      res.json(
        result.rows[0] || {}
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// PRINT PO / PSO FILES
// ======================================================

app.get(
  "/print-popso-files",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT
            po_pso_file,
            mapping_file,
            justification_file
          FROM po_pso
          ORDER BY id DESC
          LIMIT 1
          `
        );

      res.json(
        result.rows[0] || {}
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// COURSE OUTCOME
// ======================================================

app.post(
  "/save-course-outcome",

  upload.single("outcomeFile"),

  async (req, res) => {

    try {

      const {
        academicYear,
        department,
        subjectCode,
        courseOutcome,
        mappedPO

      } = req.body;


      const fileName =
        req.file
          ? req.file.filename
          : null;


      await db.query(

        `
        INSERT INTO course_outcomes
        (
          academic_year,
          department,
          subject_code,
          course_outcome,
          mapped_po,
          outcome_file
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6
        )
        `,

        [
          academicYear,
          department,
          subjectCode,
          courseOutcome,
          mappedPO,
          fileName
        ]

      );


      res.json({

        success: true,

        message:
          "Course Outcome Saved Successfully",

        fileName

      });


    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  }
);


// ======================================================
// GET COURSE OUTCOMES
// ======================================================

app.get(
  "/get-course-outcomes",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT *
          FROM course_outcomes
          ORDER BY id DESC
          `
        );

      res.json(
        result.rows
      );


    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================================================
// GET SUBJECTS
// ======================================================

app.get(
  "/get-subjects/:department",

  async (req, res) => {

    try {

      const {
        department
      } = req.params;


      const result =
        await db.query(

          `
          SELECT
            course_code,
            course_name
          FROM course_master
          WHERE department = $1
          ORDER BY course_code
          `,

          [department]

        );


      res.json(
        result.rows
      );


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Error"
      });

    }

  }
);


// ======================================================
// GET POS
// ======================================================

app.get(
  "/get-pos",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT *
          FROM po_master
          ORDER BY id
          `
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================================================
// DELETE COURSE OUTCOME
// ======================================================

app.delete(
  "/delete-course-outcome/:id",

  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      await db.query(

        `
        DELETE FROM course_outcomes
        WHERE id=$1
        `,

        [id]

      );


      res.json({
        success: true,
        message: "Deleted Successfully"
      });


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================================================
// GET SUBJECT CO
// ======================================================

app.get(
  "/get-subject-co/:subjectCode",

  async (req, res) => {

    try {

      const {
        subjectCode
      } = req.params;


      const result =
        await db.query(

          `
          SELECT *
          FROM course_outcomes
          WHERE subject_code=$1
          ORDER BY id
          `,

          [subjectCode]

        );


      res.json(
        result.rows
      );


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================================================
// UPDATE COURSE OUTCOME
// ======================================================

app.put(
  "/update-course-outcome/:id",

  upload.single("outcomeFile"),

  async (req, res) => {

    try {

      const {
        id
      } = req.params;


      const fileName =
        req.file
          ? req.file.filename
          : null;


      const {
        academicYear,
        department,
        subjectCode,
        courseOutcome,
        mappedPO

      } = req.body;


      await db.query(

        `
        UPDATE course_outcomes

        SET
          academic_year=$1,
          department=$2,
          subject_code=$3,
          course_outcome=$4,
          mapped_po=$5,
          outcome_file=COALESCE($6,outcome_file)

        WHERE id=$7
        `,

        [
          academicYear,
          department,
          subjectCode,
          courseOutcome,
          mappedPO,
          fileName,
          id
        ]

      );


      res.json({

        success: true,

        message:
          "Updated Successfully",

        fileName

      });


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================================================
// GET COURSE OUTCOMES BY DEPARTMENT
// ======================================================

app.get(
  "/get-course-outcomes/:department",

  async (req, res) => {

    try {

      const {
        department
      } = req.params;


      const result =
        await db.query(

          `
          SELECT
            id,
            course_outcome,
            mapped_po
          FROM course_outcomes
          WHERE department = $1
          ORDER BY id
          `,

          [department]

        );


      res.json(
        result.rows
      );


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Error"
      });

    }

  }
);


// ======================================================
// COURSE MATRIX
// ======================================================

app.post(
  "/save-course-matrix",

  upload.single("matrixFile"),

  async (req, res) => {

    try {

      const {
        academicYear,
        department,
        subjectCode,
        coId,
        po1,
        po2,
        po3,
        po4,
        po5

      } = req.body;


      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please upload Matrix File."

        });

      }


      const fileName =
        req.file.filename;


      await db.query(

        `
        INSERT INTO course_matrix
        (
          academic_year,
          department,
          subject_code,
          co_id,
          po1,
          po2,
          po3,
          po4,
          po5,
          matrix_file
        )

        VALUES
        (
          $1,$2,$3,$4,
          $5,$6,$7,$8,$9,$10
        )
        `,

        [
          academicYear,
          department,
          subjectCode,
          coId,
          po1,
          po2,
          po3,
          po4,
          po5,
          fileName
        ]

      );


      res.json({

        success: true,

        message:
          "Course Matrix Saved Successfully",

        fileName

      });


    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  }
);


// ======================================================
// GET COURSE MATRIX
// ======================================================

app.get(
  "/get-course-matrix",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT *
          FROM course_matrix
          ORDER BY id DESC
          `
        );

      res.json(
        result.rows
      );


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Error"
      });

    }

  }
);


// ======================================================
// GET COURSE MATRIX FILE
// ======================================================

app.get(
  "/get-course-matrix-file",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT matrix_file
          FROM course_matrix
          ORDER BY id DESC
          LIMIT 1
          `
        );

      res.json(
        result.rows[0] || {}
      );


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Error"
      });

    }

  }
);


// ======================================================
// GET SUBJECT MATRIX
// ======================================================

app.get(
  "/get-subject-matrix/:subjectCode",

  async (req, res) => {

    try {

      const result =
        await db.query(

          `
          SELECT *
          FROM course_matrix
          WHERE subject_code = $1
          ORDER BY id ASC
          `,

          [
            req.params.subjectCode
          ]

        );


      res.json(
        result.rows
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// COURSE MASTER
// ======================================================

app.get(
  "/get-course-master/:department",

  async (req, res) => {

    try {

      const {
        department
      } = req.params;


      const result =
        await db.query(

          `
          SELECT
            course_code,
            course_name
          FROM course_master
          WHERE department = $1
          ORDER BY course_code
          `,

          [department]

        );


      res.json(
        result.rows
      );


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message
      });

    }

  }
);


// ======================================================
// 1.1 ALL VISION FILES PRINT
// ======================================================

app.get(
  "/print-all-pdfs",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT
            vision_file,
            mission_file,
            peo_file1,
            peo_file2,
            peo_file3
          FROM vision_mission
          ORDER BY id DESC
          LIMIT 1
          `
        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          message: "No Record Found"
        });

      }


      const row =
        result.rows[0];


      const pdfDoc =
        await PDFDocument.create();


      const files = [

        row.vision_file,
        row.mission_file,
        row.peo_file1,
        row.peo_file2,
        row.peo_file3

      ];


      for (
        const file of files
      ) {

        if (!file) continue;


        const filePath =
          path.join(
            __dirname,
            "uploads",
            file
          );


        if (
          !fs.existsSync(filePath)
        ) continue;


        const pdfBytes =
          fs.readFileSync(
            filePath
          );


        const donorPdf =
          await PDFDocument.load(
            pdfBytes
          );


        const pages =
          await pdfDoc.copyPages(
            donorPdf,
            donorPdf.getPageIndices()
          );


        pages.forEach(
          page =>
            pdfDoc.addPage(page)
        );

      }


      const mergedPdf =
        await pdfDoc.save();


      res.setHeader(
        "Content-Type",
        "application/pdf"
      );


      res.setHeader(
        "Content-Disposition",
        "inline; filename=AllDocuments.pdf"
      );


      res.send(
        Buffer.from(
          mergedPdf
        )
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Print Error"
      });

    }

  }
);


// ======================================================
// ALL CURRICULUM PDFS
// ======================================================

app.get(
  "/print-all-curriculum-pdfs",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT
            tlp_attachment,
            syllabus_file,
            department_subjects_file,
            general_science_file,
            mdm_elective_file,
            curriculum_gap_file,
            activity_file
          FROM vision_mission
          WHERE id = 1
          `
        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          message: "No Record Found"
        });

      }


      const row =
        result.rows[0];


      const pdfDoc =
        await PDFDocument.create();


      const files = [

        row.tlp_attachment,
        row.syllabus_file,
        row.department_subjects_file,
        row.general_science_file,
        row.mdm_elective_file,
        row.curriculum_gap_file,
        row.activity_file

      ];


      for (
        const file of files
      ) {

        if (!file) continue;


        if (
          !file.toLowerCase().endsWith(".pdf")
        ) continue;


        const filePath =
          path.join(
            __dirname,
            "uploads",
            file
          );


        if (
          !fs.existsSync(filePath)
        ) continue;


        const pdfBytes =
          fs.readFileSync(
            filePath
          );


        const donorPdf =
          await PDFDocument.load(
            pdfBytes
          );


        const pages =
          await pdfDoc.copyPages(
            donorPdf,
            donorPdf.getPageIndices()
          );


        pages.forEach(
          page =>
            pdfDoc.addPage(page)
        );

      }


      const mergedPdf =
        await pdfDoc.save();


      res.setHeader(
        "Content-Type",
        "application/pdf"
      );


      res.setHeader(
        "Content-Disposition",
        "inline; filename=Curriculum.pdf"
      );


      res.send(
        Buffer.from(
          mergedPdf
        )
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// COURSE DOCUMENTS
// ======================================================

app.get(
  "/print-course-documents",

  async (req, res) => {

    try {

      const outcome =
        await db.query(
          `
          SELECT outcome_file
          FROM course_outcomes
          WHERE outcome_file IS NOT NULL
          ORDER BY id DESC
          LIMIT 1
          `
        );


      const matrix =
        await db.query(
          `
          SELECT matrix_file
          FROM course_matrix
          WHERE matrix_file IS NOT NULL
          ORDER BY id DESC
          LIMIT 1
          `
        );


      res.json({

        outcome:
          outcome.rows[0]?.outcome_file || null,

        matrix:
          matrix.rows[0]?.matrix_file || null

      });


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// ALL PO / PSO PDFS
// ======================================================

app.get(
  "/print-all-po-pso-pdfs",

  async (req, res) => {

    try {

      const result =
        await db.query(
          `
          SELECT
            po_pso_file,
            mapping_file,
            justification_mapping_file
          FROM vision_mission
          WHERE id = 1
          `
        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          message: "No Record Found"
        });

      }


      const row =
        result.rows[0];


      const pdfDoc =
        await PDFDocument.create();


      const files = [

        row.po_pso_file,
        row.mapping_file,
        row.justification_mapping_file

      ];


      for (
        const file of files
      ) {

        if (!file) continue;


        if (
          !file.toLowerCase().endsWith(".pdf")
        ) continue;


        const filePath =
          path.join(
            __dirname,
            "uploads",
            file
          );


        if (
          !fs.existsSync(filePath)
        ) continue;


        const pdfBytes =
          fs.readFileSync(
            filePath
          );


        const donorPdf =
          await PDFDocument.load(
            pdfBytes
          );


        const pages =
          await pdfDoc.copyPages(
            donorPdf,
            donorPdf.getPageIndices()
          );


        pages.forEach(
          page =>
            pdfDoc.addPage(page)
        );

      }


      const mergedPdf =
        await pdfDoc.save();


      res.setHeader(
        "Content-Type",
        "application/pdf"
      );


      res.setHeader(
        "Content-Disposition",
        "inline; filename=PO-PSO.pdf"
      );


      res.send(
        Buffer.from(
          mergedPdf
        )
      );


    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message
      });

    }

  }
);


// ======================================================
// ======================================================
// ================= CRITERIA 1 BACKEND END ===============
// ======================================================
// ======================================================


// ======================================================
// ================= CRITERIA 2 START ====================
// ======================================================
// The following Criteria 2 code is inserted into server.js
// without changing the existing server code.
// ======================================================


//===================================
//Criteria 2 Start Code
//===================================


//=====================================
//Upload Code Criteria 2
//=====================================


// =====================================
// UPLOAD CODE - CRITERIA 2
// =====================================

app.post(
  "/criteria/upload",
  upload.single("file"),
  async (req, res) => {

    try {

      // ==========================================
      // FILE CHECK
      // ==========================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please Select File"
        });
      }

      // ==========================================
      // REQUEST DATA
      // ==========================================

      const {
        criteriaNo,
        documentName,
        description,
        session_id,
        academicYear,
        department,
        program
      } = req.body;

      // ==========================================
      // ACADEMIC INFORMATION
      // ONLY REQUIRED FOR CRITERIA 2.1
      // ==========================================

      if (
        criteriaNo === "2.1" &&
        (!academicYear || !department || !program)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Academic Year, Department and Program are required for Criteria 2.1.",
          received: {
            academicYear,
            department,
            program
          }
        });

      }

      // ==========================================
      // DEBUG LOG
      // ==========================================

      console.log("====================================");
      console.log("CRITERIA NO :", criteriaNo);
      console.log("DOCUMENT    :", documentName);
      console.log("SESSION ID  :", session_id);

      if (criteriaNo === "2.1") {

        console.log(
          "Academic Year :",
          academicYear
        );

        console.log(
          "Department :",
          department
        );

        console.log(
          "Program :",
          program
        );

      }

      console.log("====================================");

      // ==========================================
      // FILE INFORMATION
      // ==========================================

      const originalFileName =
        req.file.originalname;

      const storedFileName =
        req.file.filename;

      const filePath =
        req.file.path;

      // ==========================================
      // INSERT INTO DATABASE
      // ==========================================

      const result = await pool.query(
        `
        INSERT INTO criteria2_documents
        (
          criteria_no,
          document_name,
          description,
          original_file_name,
          file_name,
          file_path,
          session_id,
          academic_year,
          department,
          program,
          uploaded_at,
          status
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          NOW(),
          'Saved'
        )
        RETURNING *
        `,
        [
          criteriaNo,
          documentName,
          description,
          originalFileName,
          storedFileName,
          filePath,
          session_id,

          // Academic Information
          // 2.1 ला values
          // बाकी criteria ला NULL

          academicYear || null,
          department || null,
          program || null
        ]
      );

      // ==========================================
      // DATABASE SUCCESS LOG
      // ==========================================

      console.log(
        "DATABASE INSERTED SUCCESSFULLY:"
      );

      console.log(result.rows[0]);

      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(200).json({
        success: true,
        message: "Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (err) {

      console.error(
        "UPLOAD ERROR :",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);


//================================
// Load Files
//================================

app.get(
  "/criteria/files/:criteriaNo",
  async (req, res) => {

    try {

      const { criteriaNo } = req.params;
      const { session_id } = req.query;

      const result = await pool.query(
        `
        SELECT
          id,
          criteria_no,
          document_name,
          description,
          original_file_name,
          file_name,
          file_path,
          session_id,
          academic_year,
          department,
          program,
          uploaded_at,
          status
        FROM criteria2_documents
        WHERE criteria_no = $1
          AND session_id = $2
        ORDER BY uploaded_at ASC
        `,
        [
          criteriaNo,
          session_id
        ]
      );

      return res.status(200).json({
        success: true,
        files: result.rows
      });

    } catch (err) {

      console.error(
        "LOAD FILE ERROR :",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message
      });

    }

  }
);


// ======================================================
// SAVE DRAFT
// ======================================================

app.post(
  "/criteria/save-draft",
  async (req, res) => {

    try {

      const {
        criteriaNo,
        session_id
      } = req.body;

      if (!criteriaNo || !session_id) {

        return res.status(400).json({
          success: false,
          message:
            "Criteria No and Session ID are required."
        });

      }

      await pool.query(
        `
        UPDATE criteria2_documents
        SET
          status='Saved'
        WHERE
          criteria_no=$1
        AND
          session_id=$2
        `,
        [
          criteriaNo,
          session_id
        ]
      );

      res.json({

        success: true,

        message:
          "Draft Saved Successfully."

      });

    }

    catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        error: err.message

      });

    }

  }
);


// ======================================================
// DELETE ALL FILES OF ONE CRITERIA
// ======================================================

app.delete(
  "/criteria/deleteAll/:criteriaNo",
  async (req, res) => {

    try {

      const { criteriaNo } = req.params;
      const { session_id } = req.query;

      if (!session_id) {

        return res.status(400).json({
          success: false,
          message: "Session ID is required."
        });

      }

      // Get files before deleting
      // optional - for physical file deletion

      const files = await pool.query(
        `
        SELECT file_path
        FROM criteria2_documents
        WHERE criteria_no = $1
        AND session_id = $2
        `,
        [
          criteriaNo,
          session_id
        ]
      );

      // Delete physical files

      files.rows.forEach(file => {

        if (
          file.file_path &&
          fs.existsSync(file.file_path)
        ) {

          fs.unlinkSync(
            file.file_path
          );

        }

      });

      // Delete database records

      const result = await pool.query(
        `
        DELETE FROM criteria2_documents
        WHERE criteria_no = $1
        AND session_id = $2
        RETURNING *
        `,
        [
          criteriaNo,
          session_id
        ]
      );

      res.json({

        success: true,

        message:
          "Files Deleted Successfully.",

        deletedCount:
          result.rowCount

      });

    }

    catch (err) {

      console.log(
        "DELETE ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error: err.message

      });

    }

  }
);


// ======================================================
// DOWNLOAD FILE
// ======================================================

app.get(
  "/criteria/download/:fileName",
  async (req, res) => {

    try {

      const { fileName } = req.params;
      const { session_id } = req.query;

      if (!session_id) {

        return res.status(400).json({
          success: false,
          message:
            "Session ID is required."
        });

      }

      const result = await pool.query(
        `
        SELECT
          original_file_name,
          file_path
        FROM criteria2_documents
        WHERE
          file_name = $1
        AND
          session_id = $2
        LIMIT 1
        `,
        [
          fileName,
          session_id
        ]
      );

      if (result.rows.length === 0) {

        return res.status(404).json({
          success: false,
          message: "File not found."
        });

      }

      const file =
        result.rows[0];

      if (
        !fs.existsSync(
          file.file_path
        )
      ) {

        return res.status(404).json({
          success: false,
          message:
            "Physical file not found."
        });

      }

      res.download(
        file.file_path,
        file.original_file_name
      );

    }

    catch (err) {

      console.log(
        "DOWNLOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error: err.message

      });

    }

  }
);


// ==========================================
// Print Files (Criteria)
// ==========================================

app.get(
  "/criteria/print-files",
  async (req, res) => {

    try {

      const {
        criteriaNo,
        session_id
      } = req.query;

      if (
        !criteriaNo ||
        !session_id
      ) {

        return res.status(400).json({

          success:false,

          message:
            "Criteria number and session id required"

        });

      }

      const result = await pool.query(
        `
        SELECT
          id,
          document_name,
          file_name,
          file_path,
          uploaded_at
        FROM criteria2_documents
        WHERE criteria_no = $1
        AND session_id = $2
        ORDER BY uploaded_at ASC
        `,
        [
          criteriaNo,
          session_id
        ]
      );

      res.json({

        success:true,

        files:
          result.rows

      });

    }

    catch(error){

      console.error(
        "PRINT FILE ERROR:",
        error
      );

      res.status(500).json({

        success:false,

        message:
          "Print files fetch failed"

      });

    }

  }
);


// ======================================================
// VIEW FILE
// ======================================================

app.get(
  "/criteria/view/:fileName",
  async (req, res) => {

    try {

      const { fileName } = req.params;
      const { session_id } = req.query;

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required."

        });

      }

      const result =
        await pool.query(
          `
          SELECT
            original_file_name,
            file_path
          FROM criteria2_documents
          WHERE
            file_name = $1
          AND
            session_id = $2
          LIMIT 1
          `,
          [
            fileName,
            session_id
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found."

        });

      }

      const file =
        result.rows[0];

      if (
        !fs.existsSync(
          file.file_path
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Physical file not found."

        });

      }

      res.sendFile(
        path.resolve(
          file.file_path
        )
      );

    }

    catch (err) {

      console.log(
        "VIEW ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error: err.message

      });

    }

  }
);


// ======================================================
// GET ALL FILES - CRITERIA 2.1 TO 2.8
// ======================================================

app.get(
  "/criteria/files/all/2",
  async (req, res) => {

    try {

      const { session_id } =
        req.query;

      if (!session_id) {

        return res.status(400).json({

          success: false,

          message:
            "Session ID is required."

        });

      }

      const result =
        await pool.query(
          `
          SELECT
            id,
            criteria_no,
            document_name,
            description,
            original_file_name,
            file_name,
            file_path,
            session_id,
            academic_year,
            department,
            program,
            uploaded_at,
            status
          FROM criteria2_documents
          WHERE session_id = $1
            AND criteria_no IN (
              '2.1',
              '2.2',
              '2.3',
              '2.4',
              '2.5',
              '2.6',
              '2.7',
              '2.8'
            )
          ORDER BY
            criteria_no ASC,
            uploaded_at ASC
          `,
          [session_id]
        );

      return res.status(200).json({

        success: true,

        files:
          result.rows

      });

    }

    catch (error) {

      console.error(
        "GET ALL CRITERIA 2 FILES ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  }
);


// ======================================================
// ================== CRITERIA 2 END =====================
// ======================================================

/* ============================================================
   ===================== CRITERIA 5 START =====================
   ============================================================ */


/* ============================
   CRITERIA 5 - SFR
============================ */

// SAVE CRITERIA 5 SFR
app.post("/api/criteria5/sfr", async (req, res) => {

  try {

    const {
      academic_year,
      department,
      program,
      teachers,
      students,
      ratio
    } = req.body;

    const result = await pool.query(

      `INSERT INTO criteria5
      (
        academic_year,
        department,
        program,
        teachers,
        students,
        ratio
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,

      [
        academic_year,
        department,
        program,
        teachers,
        students,
        ratio
      ]

    );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err.message);

    res.status(500).json({
      error: err.message
    });

  }

});


// UPLOAD SFR DOCUMENT
app.post(
  "/api/criteria5/upload",
  upload.single("document"),
  async (req, res) => {

    try {

      const file = req.file.filename;
      const { id } = req.body;

      const result = await pool.query(
        `
        UPDATE criteria5
        SET document=$1
        WHERE id=$2
        RETURNING *
        `,
        [file, id]
      );

      res.json({
        message: "Document Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// UPDATE SFR
app.put(
  "/api/criteria5/sfr/:id",
  upload.single("document"),

  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        academic_year,
        department,
        program,
        teachers,
        students,
        ratio
      } = req.body;

      let document = null;

      if (req.file) {

        document = req.file.filename;

        await pool.query(

          `
          UPDATE criteria5
          SET
            academic_year=$1,
            department=$2,
            program=$3,
            teachers=$4,
            students=$5,
            ratio=$6,
            document=$7
          WHERE id=$8
          `,

          [
            academic_year,
            department,
            program,
            teachers,
            students,
            ratio,
            document,
            id
          ]

        );

      } else {

        await pool.query(

          `
          UPDATE criteria5
          SET
            academic_year=$1,
            department=$2,
            program=$3,
            teachers=$4,
            students=$5,
            ratio=$6
          WHERE id=$7
          `,

          [
            academic_year,
            department,
            program,
            teachers,
            students,
            ratio,
            id
          ]

        );

      }

      res.json({
        message: "Updated Successfully"
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// DELETE SFR
app.delete("/api/criteria5/sfr/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM criteria5 WHERE id=$1",
      [id]
    );

    res.json({
      message: "Deleted Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// GET SFR
app.get("/api/criteria5/sfr", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM criteria5 ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err.message);

    res.status(500).json({
      error: err.message
    });

  }

});


// GET LATEST SFR
app.get("/api/criteria5/sfr/latest", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT students
      FROM criteria5
      ORDER BY id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "No SFR data found"
      });

    }

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

});


/* ============================
   CRITERIA 5 - QUALIFICATION
============================ */

// SAVE QUALIFICATION
app.post("/api/criteria5/qualification", async (req, res) => {

  try {

    const { data } = req.body;

    let lastInserted = null;

    for (const item of data) {

      const result = await pool.query(

        `INSERT INTO criteria5_qualification
        (
          qualification,
          m1,
          m2,
          m3
        )
        VALUES($1,$2,$3,$4)
        RETURNING *`,

        [
          item.name,
          item.m1,
          item.m2,
          item.m3
        ]

      );

      lastInserted = result.rows[0];

    }

    res.json({
      message: "Saved Successfully",
      id: lastInserted.id
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// GET QUALIFICATION
app.get("/api/criteria5/qualification", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM criteria5_qualification ORDER BY id"
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// UPLOAD QUALIFICATION DOCUMENT
app.post(
  "/api/criteria5/qualification/upload",
  upload.single("document"),

  async (req, res) => {

    try {

      console.log("BODY :", req.body);
      console.log("FILE :", req.file);

      const file = req.file.filename;
      const { id } = req.body;

      const result = await pool.query(

        `
        UPDATE criteria5_qualification
        SET document=$1
        WHERE id=$2
        RETURNING *
        `,

        [file, id]

      );

      console.log("UPDATED :", result.rows);

      res.json({
        message: "Document Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// UPDATE QUALIFICATION
app.put("/api/criteria5/qualification", async (req, res) => {

  try {

    const { data } = req.body;

    for (const item of data) {

      await pool.query(

        `UPDATE criteria5_qualification
         SET
           m1=$1,
           m2=$2,
           m3=$3
         WHERE qualification=$4`,

        [
          item.m1,
          item.m2,
          item.m3,
          item.name
        ]

      );

    }

    res.json({
      message: "Updated Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


// DELETE QUALIFICATION
app.delete("/api/criteria5/qualification/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM criteria5_qualification
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      message: "Deleted Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});


/* ============================
   CRITERIA 5 - CADRE
============================ */

// SAVE CADRE
app.post("/api/criteria5/cadre", async (req, res) => {

  try {

    console.log("CADRE BODY:", req.body);
    console.log("RF VALUE:", req.body.rf);
console.log("RF NUMBER:", Number(req.body.rf));

    const result = await pool.query(

      `INSERT INTO criteria5_cadre
      (
        af1,
        af2,
        af3,
        students,
        rf,
        rf1,
        rf2,
        rf3,
        professor_ratio,
        associate_ratio,
        assistant_ratio,
        total_score,
        final_marks,
        remarks
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,

      [
        Number(req.body.af1) || 0,
        Number(req.body.af2) || 0,
        Number(req.body.af3) || 0,
        Number(req.body.students) || 0,
        Number(req.body.rf) || 0,
        Number(req.body.rf1) || 0,
        Number(req.body.rf2) || 0,
        Number(req.body.rf3) || 0,
        Number(req.body.professorRatio) || 0,
        Number(req.body.associateRatio) || 0,
        Number(req.body.assistantRatio) || 0,
        Number(req.body.totalScore) || 0,
        Number(req.body.finalMarks) || 0,
        req.body.remarks || ""
      ]

    );

    res.json(result.rows[0]);

  } catch (err) {

    console.log("CADRE SAVE ERROR:", err);

    res.status(500).json({
      error: err.message
    });

  }

});
// GET CADRE
app.get("/api/criteria5/cadre", async (req, res) => {

  const result = await pool.query(
    "SELECT * FROM criteria5_cadre ORDER BY id DESC"
  );

  res.json(result.rows);

});


// UPDATE CADRE
app.put("/api/criteria5/cadre/:id", async (req, res) => {

  await pool.query(

    `UPDATE criteria5_cadre
     SET
      af1=$1,
      af2=$2,
      af3=$3,
      students=$4,
      rf=$5,
      rf1=$6,
      rf2=$7,
      rf3=$8,
      professor_ratio=$9,
      associate_ratio=$10,
      assistant_ratio=$11,
      total_score=$12,
      final_marks=$13,
      remarks=$14
     WHERE id=$15`,

    [
      req.body.af1,
      req.body.af2,
      req.body.af3,
      req.body.students,
      req.body.rf,
      req.body.rf1,
      req.body.rf2,
      req.body.rf3,
      req.body.professorRatio,
      req.body.associateRatio,
      req.body.assistantRatio,
      req.body.totalScore,
      req.body.finalMarks,
      req.body.remarks,
      req.params.id
    ]

  );

  res.json({
    message: "Updated Successfully"
  });

});


// DELETE CADRE
app.delete("/api/criteria5/cadre/:id", async (req, res) => {

  await pool.query(
    "DELETE FROM criteria5_cadre WHERE id=$1",
    [req.params.id]
  );

  res.json({
    message: "Deleted Successfully"
  });

});


// UPLOAD CADRE DOCUMENT
app.post(
  "/api/criteria5/cadre/upload",
  upload.single("document"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No document selected"
        });

      }

      const file = req.file.filename;
      const { id } = req.body;

      const result = await pool.query(

        `
        UPDATE criteria5_cadre
        SET document=$1
        WHERE id=$2
        RETURNING *
        `,

        [
          file,
          id
        ]

      );

      res.json({
        message: "Document Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


/* ============================
   CRITERIA 5.4 - VISITING FACULTY
============================ */

app.post("/api/criteria54", async (req, res) => {

  try {

    const {
      rows,
      totalHours,
      totalMarks
    } = req.body;

    const result = await pool.query(

      `
      INSERT INTO criteria54_visiting_faculty
      (
        faculty_data,
        total_hours,
        total_marks
      )
      VALUES($1,$2,$3)
      RETURNING *
      `,

      [
        JSON.stringify(rows),
        totalHours,
        totalMarks
      ]

    );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});


app.put("/api/criteria54/:id", async (req, res) => {

  try {

    const id = req.params.id;

    const {
      rows,
      totalHours,
      totalMarks
    } = req.body;

    const result = await pool.query(

      `
      UPDATE criteria54_visiting_faculty
      SET
        faculty_data=$1,
        total_hours=$2,
        total_marks=$3
      WHERE id=$4
      RETURNING *
      `,

      [
        JSON.stringify(rows),
        totalHours,
        totalMarks,
        id
      ]

    );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});


app.delete("/api/criteria54/:id", async (req, res) => {

  try {

    await pool.query(
      `
      DELETE FROM criteria54_visiting_faculty
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      message: "Deleted Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});


app.get("/api/criteria54", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM criteria54_visiting_faculty
      ORDER BY id DESC
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err);

  }

});


app.post(
  "/api/criteria54/upload",
  upload.single("document"),

  async (req, res) => {

    try {

      console.log("BODY :", req.body);
      console.log("FILE :", req.file);

      if (!req.file) {

        return res.status(400).json({
          error: "No file uploaded"
        });

      }

      const file = req.file.filename;
      const { id } = req.body;

      console.log("ID :", id);
      console.log("FILE NAME :", file);

      const result = await pool.query(
        `
        UPDATE criteria54_visiting_faculty
        SET document=$1
        WHERE id=$2
        RETURNING *
        `,
        [file, id]
      );

      console.log("UPDATED :", result.rows);

      res.json(result.rows[0]);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


/* ============================
   CRITERIA 5.5 - FACULTY RETENTION
============================ */

app.post("/api/criteria55", async (req, res) => {

  try {

    const {
      A,
      B,
      C,
      D,
      E,
      students,
      af,
      rf,
      weighted_sum,
      fr_score,
      final_marks
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO criteria5_faculty_retention
      (
        a,
        b,
        c,
        d,
        e,
        students,
        af,
        rf,
        weighted_sum,
        fr_score,
        final_marks
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        Number(A) || 0,
        Number(B) || 0,
        Number(C) || 0,
        Number(D) || 0,
        Number(E) || 0,
        Number(students) || 0,
        Number(af) || 0,
        Number(rf) || 0,
        Number(weighted_sum) || 0,
        Number(fr_score) || 0,
        Number(final_marks) || 0
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error("Criteria55 Save Error:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


app.get("/api/criteria55", async (req, res) => {

  try {

    const result = await pool.query(
      `
      SELECT *
      FROM criteria5_faculty_retention
      ORDER BY id DESC
      `
    );

    res.json(result.rows);

  } catch (error) {

    console.error("Criteria55 View Error:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


app.put("/api/criteria55/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      A,
      B,
      C,
      D,
      E,
      students,
      af,
      rf,
      weighted_sum,
      fr_score,
      final_marks
    } = req.body;

    const result = await pool.query(
      `
      UPDATE criteria5_faculty_retention
      SET
        a = $1,
        b = $2,
        c = $3,
        d = $4,
        e = $5,
        students = $6,
        af = $7,
        rf = $8,
        weighted_sum = $9,
        fr_score = $10,
        final_marks = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
      `,
      [
        Number(A) || 0,
        Number(B) || 0,
        Number(C) || 0,
        Number(D) || 0,
        Number(E) || 0,
        Number(students) || 0,
        Number(af) || 0,
        Number(rf) || 0,
        Number(weighted_sum) || 0,
        Number(fr_score) || 0,
        Number(final_marks) || 0,
        id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: "Record not found"
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error("Criteria55 Update Error:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


app.delete("/api/criteria55/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM criteria5_faculty_retention
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: "Record not found"
      });

    }

    res.json({
      message: "Faculty Retention deleted successfully",
      data: result.rows[0]
    });

  } catch (error) {

    console.error("Criteria55 Delete Error:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


app.post(
  "/api/criteria55/upload",
  upload.single("document"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          error: "No document uploaded"
        });

      }

      const { id } = req.body;

      if (!id) {

        return res.status(400).json({
          error: "Record ID is required"
        });

      }

      const filename = req.file.filename;

      const result = await pool.query(
        `
        UPDATE criteria5_faculty_retention
        SET
          document = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [
          filename,
          Number(id)
        ]
      );

      if (result.rows.length === 0) {

        return res.status(404).json({
          error: "Faculty Retention record not found"
        });

      }

      res.json({
        message: "Document Uploaded Successfully",
        data: result.rows[0]
      });

    } catch (error) {

      console.error(
        "Criteria55 Upload Error:",
        error
      );

      res.status(500).json({
        error: error.message
      });

    }

  }
);


/* ============================================================
   ====================== CRITERIA 5 END ======================
   ============================================================ */


// Universal Table Resolver

function getTableName(criteriaNo) {

    const cNum =
      String(criteriaNo || "").trim();

    if (
      ["4", "7", "8"].includes(cNum)
    ) {

        return `public.naac_criteria_${cNum}`;

    }

    return `public.naac_criteria_master`;

}


// ======================================================
// UNIVERSAL SAVE / UPDATE ROUTE (PART 2A)
// Criteria 2 / 4 / 7 / 8
// ======================================================

app.post(
  "/api/criteria/:criteriaNo/:subSection/submit",
  upload.any(),
  async (req, res) => {

    try {

      const {
        criteriaNo,
        subSection
      } = req.params;

      const {
        rowId,
        s_n,
        item,
        details,
        currentStatus,
        actionsTaken,
        improvedStatus,
        outcome,
        academicYear,
        department
      } = req.body;

      const parsedRowId =
        parseInt(rowId, 10);

      if (
        isNaN(parsedRowId)
      ) {

        return res.status(400).json({

          success: false,

          error:
            "Valid rowId is required."

        });

      }

      const parsedSn =
        s_n
          ? parseInt(s_n, 10)
          : parsedRowId;

      const tableName =
        getTableName(
          criteriaNo
        );

      const finalDetails =
        details ||
        currentStatus ||
        "";


      // ===============================
      // Uploaded File
      // ===============================

      const fileObj =
        req.files &&
        req.files.length > 0
          ? req.files[0]
          : null;

      const fileName =
        fileObj
          ? fileObj.filename
          : null;

      const filePath =
        fileObj
          ? fileObj.path.replace(
              /\\/g,
              "/"
            )
          : null;

      const fileType =
        fileObj
          ? fileObj.mimetype
          : null;

      const fileSize =
        fileObj
          ? fileObj.size
          : null;


      // ===============================
      // Check Existing Record
      // ===============================

      const checkExistQuery = `

        SELECT id

        FROM ${tableName}

        WHERE
            sub_section = $1

        AND row_id = $2

        AND
        (
            is_deleted IS FALSE
            OR
            is_deleted IS NULL
        )

      `;

      const existRes =
        await pool.query(
          checkExistQuery,
          [
            subSection,
            parsedRowId
          ]
        );


      // ===============================
      // UPDATE
      // ===============================

      if (
        existRes.rows.length > 0
      ) {

        const updateQuery = `

          UPDATE ${tableName}

          SET

            s_n = $1,

            item = $2,

            details = $3,

            current_status = $4,

            actions_taken = $5,

            improved_status = $6,

            outcome = $7,

            file_name =
              COALESCE($8, file_name),

            file_path =
              COALESCE($9, file_path),

            file_type =
              COALESCE($10, file_type),

            file_size =
              COALESCE($11, file_size),

            academic_year = $12,

            department = $13,

            is_deleted = FALSE,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            sub_section = $14

          AND
            row_id = $15

        `;

        await pool.query(
          updateQuery,
          [

            parsedSn,

            item || null,

            finalDetails,

            currentStatus ||
              finalDetails,

            actionsTaken ||
              finalDetails,

            improvedStatus ||
              null,

            outcome ||
              null,

            fileName,

            filePath,

            fileType,

            fileSize,

            academicYear ||
              "2024-25",

            department ||
              "Computer Engineering",

            subSection,

            parsedRowId

          ]
        );

      }

      else {

        const insertQuery = `

          INSERT INTO ${tableName}
          (
            sub_section,
            row_id,
            s_n,
            item,
            details,
            current_status,
            actions_taken,
            improved_status,
            outcome,
            file_name,
            file_path,
            file_type,
            file_size,
            academic_year,
            department,
            is_deleted,
            updated_at
          )

          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            FALSE,
            CURRENT_TIMESTAMP
          )

        `;

        await pool.query(
          insertQuery,
          [

            subSection,

            parsedRowId,

            parsedSn,

            item || null,

            finalDetails,

            currentStatus ||
              finalDetails,

            actionsTaken ||
              finalDetails,

            improvedStatus ||
              null,

            outcome ||
              null,

            fileName,

            filePath,

            fileType,

            fileSize,

            academicYear ||
              "2024-25",

            department ||
              "Computer Engineering"

          ]
        );

      }


      console.log(
        `Saved Successfully : ${subSection} (${tableName})`
      );


      res.status(200).json({

        success: true,

        message:
          `Criteria ${subSection} saved successfully.`

      });

    }

    catch (err) {

      console.error(
        "Save Error :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// UNIVERSAL LOAD DATA
// ======================================================

app.get(
  "/api/criteria/:criteriaNo/:subSection/data",
  async (req, res) => {

    try {

      const {
        criteriaNo,
        subSection
      } = req.params;

      const tableName =
        getTableName(
          criteriaNo
        );

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE sub_section = $1
            AND (
              is_deleted IS FALSE
              OR is_deleted IS NULL
            )
          ORDER BY row_id ASC
          `,
          [
            subSection
          ]
        );

      res.json({

        success: true,

        data:
          result.rows

      });

    }

    catch (err) {

      console.error(
        "LOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// GET SINGLE ROW
// ======================================================

app.get(
  "/api/criteria/:criteriaNo/:subSection/:rowId",
  async (req, res) => {

    try {

      const {
        criteriaNo,
        subSection,
        rowId
      } = req.params;

      const tableName =
        getTableName(
          criteriaNo
        );

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE sub_section = $1
            AND row_id = $2
          LIMIT 1
          `,
          [
            subSection,
            rowId
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Record not found."

        });

      }

      res.json({

        success: true,

        data:
          result.rows[0]

      });

    }

    catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// UNIVERSAL REPORTS
// ======================================================

app.get(
  "/api/reports/:subSection",
  async (req, res) => {

    try {

      const {
        subSection
      } = req.params;

      const criteriaNo =
        subSection.split(".")[0];

      const tableName =
        getTableName(
          criteriaNo
        );

      const result =
        await pool.query(
          `
          SELECT
            id,
            '${criteriaNo}' AS "criteriaNo",
            sub_section AS "subSection",
            row_id AS "rowId",
            s_n,
            item,
            details,
            current_status AS "currentStatus",
            actions_taken AS "actionsTaken",
            improved_status AS "improvedStatus",
            outcome,
            file_name AS "fileName",
            file_path AS "filePath",
            file_type AS "fileType",
            file_size AS "fileSize",
            academic_year AS "academicYear",
            department,
            updated_at AS "submittedAt"
          FROM ${tableName}
          WHERE sub_section = $1
            AND (
              is_deleted IS FALSE
              OR is_deleted IS NULL
            )
          ORDER BY row_id ASC
          `,
          [
            subSection
          ]
        );

      res.json({

        success: true,

        total:
          result.rows.length,

        reports:
          result.rows

      });

    }

    catch (err) {

      console.error(
        "REPORT LOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// GET REPORT BY ID
// ======================================================

app.get(
  "/api/reports/:criteriaNo/:id",
  async (req, res) => {

    try {

      const {
        criteriaNo,
        id
      } = req.params;

      const tableName =
        getTableName(
          criteriaNo
        );

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE id = $1
          LIMIT 1
          `,
          [
            id
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Report not found."

        });

      }

      res.json({

        success: true,

        report:
          result.rows[0]

      });

    }

    catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// UNIVERSAL SOFT DELETE
// ======================================================

app.delete(
  "/api/reports/delete/:id",
  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      const {
        criteriaNo
      } = req.query;

      if (!criteriaNo) {

        return res.status(400).json({

          success: false,

          error:
            "criteriaNo is required."

        });

      }

      const tableName =
        getTableName(
          criteriaNo
        );

      await pool.query(
        `
        UPDATE ${tableName}

        SET
          is_deleted = TRUE,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
        `,
        [
          id
        ]
      );

      res.json({

        success: true,

        message:
          "Record deleted successfully."

      });

    }

    catch (err) {

      console.error(
        "DELETE ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// DOWNLOAD FILE
// ======================================================

app.get(
  "/api/download/:fileName",
  (req, res) => {

    const filePath =
      path.join(
        uploadFolder,
        req.params.fileName
      );

    if (
      !fs.existsSync(filePath)
    ) {

      return res.status(404).json({

        success: false,

        message:
          "File not found."

      });

    }

    res.download(filePath);

  }
);


// ======================================================
// VIEW FILE
// ======================================================

app.get(
  "/api/view/:fileName",
  (req, res) => {

    const filePath =
      path.join(
        uploadFolder,
        req.params.fileName
      );

    if (
      !fs.existsSync(filePath)
    ) {

      return res.status(404).json({

        success: false,

        message:
          "File not found."

      });

    }

    res.sendFile(filePath);

  }
);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get(
  "/api/status",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Universal Criteria Server Running",

      supportedCriteria: [
        "2",
        "4",
        "7",
        "8"
      ]

    });

  }
);


// ======================================================
// UNIVERSAL GENERATE REPORT
// ======================================================

app.get(
  "/api/reports/generate/:criteriaNo",
  async (req, res) => {

    try {

      const {
        criteriaNo
      } = req.params;

      const tableName =
        getTableName(
          criteriaNo
        );

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE (
            is_deleted IS FALSE
            OR is_deleted IS NULL
          )
          ORDER BY
            sub_section ASC,
            row_id ASC
          `
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "No records found."

        });

      }

      const report = [];

      result.rows.forEach(
        (row) => {

          report.push({

            criteriaNo,

            subSection:
              row.sub_section,

            rowId:
              row.row_id,

            s_n:
              row.s_n,

            item:
              row.item,

            details:
              row.details,

            currentStatus:
              row.current_status,

            actionsTaken:
              row.actions_taken,

            improvedStatus:
              row.improved_status,

            outcome:
              row.outcome,

            academicYear:
              row.academic_year,

            department:
              row.department,

            fileName:
              row.file_name,

            filePath:
              row.file_path,

            updatedAt:
              row.updated_at

          });

        }
      );

      res.json({

        success: true,

        total:
          report.length,

        data:
          report

      });

    }

    catch (err) {

      console.error(
        "REPORT GENERATE ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// ALL CRITERIA REPORTS
// ======================================================

app.get(
  "/api/reports",
  async (req, res) => {

    try {

      const criteriaList = [
        "2",
        "4",
        "7",
        "8"
      ];

      let finalData = [];

      for (
        const c of criteriaList
      ) {

        const tableName =
          getTableName(c);

        const result =
          await pool.query(
            `
            SELECT *
            FROM ${tableName}
            WHERE (
              is_deleted IS FALSE
              OR is_deleted IS NULL
            )
            `
          );

        result.rows.forEach(
          row => {

            finalData.push({

              criteriaNo: c,

              ...row

            });

          }
        );

      }

      res.json({

        success: true,

        total:
          finalData.length,

        reports:
          finalData

      });

    }

    catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// UNIVERSAL REPORT DOWNLOAD
// ======================================================

app.get(
  "/api/reports/download/:criteriaNo",
  async (req, res) => {

    try {

      const {
        criteriaNo
      } = req.params;

      const tableName =
        getTableName(
          criteriaNo
        );

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE (
            is_deleted IS FALSE
            OR is_deleted IS NULL
          )
          ORDER BY
            sub_section ASC,
            row_id ASC
          `
        );

      res.json({

        success: true,

        criteriaNo,

        total:
          result.rows.length,

        reports:
          result.rows

      });

    }

    catch (err) {

      console.error(
        "DOWNLOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);
// ======================================================
// PART 2 CONTINUE
// ======================================================


// ======================================================
// UNIVERSAL REPORTS - CONTINUE
// ======================================================


// ======================================================
// GET REPORT BY SUB SECTION
// ======================================================

app.get(
  "/api/reports/:subSection",
  async (req, res) => {

    try {

      const {
        subSection
      } = req.params;

      const criteriaNo =
        subSection.split(".")[0];

      const tableName =
        getTableName(criteriaNo);

      const result =
        await pool.query(
          `
          SELECT
            id,
            '${criteriaNo}' AS "criteriaNo",
            sub_section AS "subSection",
            row_id AS "rowId",
            s_n,
            item,
            details,
            current_status AS "currentStatus",
            actions_taken AS "actionsTaken",
            improved_status AS "improvedStatus",
            outcome,
            file_name AS "fileName",
            file_path AS "filePath",
            file_type AS "fileType",
            file_size AS "fileSize",
            academic_year AS "academicYear",
            department,
            updated_at AS "submittedAt"
          FROM ${tableName}
          WHERE sub_section = $1
            AND (
              is_deleted IS FALSE
              OR is_deleted IS NULL
            )
          ORDER BY row_id ASC
          `,
          [
            subSection
          ]
        );

      res.json({

        success: true,

        total:
          result.rows.length,

        reports:
          result.rows

      });

    }

    catch (err) {

      console.error(
        "REPORT LOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// GET REPORT BY ID
// ======================================================

app.get(
  "/api/reports/:criteriaNo/:id",
  async (req, res) => {

    try {

      const {
        criteriaNo,
        id
      } = req.params;

      const tableName =
        getTableName(criteriaNo);

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE id = $1
          LIMIT 1
          `,
          [
            id
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Report not found."

        });

      }

      res.json({

        success: true,

        report:
          result.rows[0]

      });

    }

    catch (err) {

      console.error(
        "GET REPORT ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// UNIVERSAL DELETE REPORT
// ======================================================

app.delete(
  "/api/reports/delete/:id",
  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      const {
        criteriaNo
      } = req.query;

      if (!criteriaNo) {

        return res.status(400).json({

          success: false,

          error:
            "criteriaNo is required."

        });

      }

      const tableName =
        getTableName(criteriaNo);

      await pool.query(
        `
        UPDATE ${tableName}

        SET
          is_deleted = TRUE,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
        `,
        [
          id
        ]
      );

      res.json({

        success: true,

        message:
          "Record deleted successfully."

      });

    }

    catch (err) {

      console.error(
        "DELETE ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// DOWNLOAD UPLOADED FILE
// ======================================================

app.get(
  "/api/download/:fileName",
  (req, res) => {

    try {

      const filePath =
        path.join(
          uploadFolder,
          req.params.fileName
        );

      if (
        !fs.existsSync(filePath)
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found."

        });

      }

      res.download(filePath);

    }

    catch (err) {

      console.error(
        "FILE DOWNLOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// VIEW UPLOADED FILE
// ======================================================

app.get(
  "/api/view/:fileName",
  (req, res) => {

    try {

      const filePath =
        path.join(
          uploadFolder,
          req.params.fileName
        );

      if (
        !fs.existsSync(filePath)
      ) {

        return res.status(404).json({

          success: false,

          message:
            "File not found."

        });

      }

      res.sendFile(filePath);

    }

    catch (err) {

      console.error(
        "FILE VIEW ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// SERVER STATUS
// ======================================================

app.get(
  "/api/status",
  (req, res) => {

    res.json({

      success: true,

      message:
        "Universal Criteria Server Running",

      supportedCriteria: [
        "2",
        "4",
        "7",
        "8"
      ]

    });

  }
);


// ======================================================
// GENERATE REPORT FOR CRITERIA
// ======================================================

app.get(
  "/api/reports/generate/:criteriaNo",
  async (req, res) => {

    try {

      const {
        criteriaNo
      } = req.params;

      const tableName =
        getTableName(criteriaNo);

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE (
            is_deleted IS FALSE
            OR is_deleted IS NULL
          )
          ORDER BY
            sub_section ASC,
            row_id ASC
          `
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "No records found."

        });

      }

      const report = [];

      result.rows.forEach(
        row => {

          report.push({

            criteriaNo,

            subSection:
              row.sub_section,

            rowId:
              row.row_id,

            s_n:
              row.s_n,

            item:
              row.item,

            details:
              row.details,

            currentStatus:
              row.current_status,

            actionsTaken:
              row.actions_taken,

            improvedStatus:
              row.improved_status,

            outcome:
              row.outcome,

            academicYear:
              row.academic_year,

            department:
              row.department,

            fileName:
              row.file_name,

            filePath:
              row.file_path,

            updatedAt:
              row.updated_at

          });

        }
      );

      res.json({

        success: true,

        total:
          report.length,

        data:
          report

      });

    }

    catch (err) {

      console.error(
        "REPORT GENERATE ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// ALL CRITERIA REPORTS
// ======================================================

app.get(
  "/api/reports",
  async (req, res) => {

    try {

      const criteriaList = [
        "2",
        "4",
        "7",
        "8"
      ];

      let finalData = [];

      for (
        const c of criteriaList
      ) {

        const tableName =
          getTableName(c);

        const result =
          await pool.query(
            `
            SELECT *
            FROM ${tableName}
            WHERE (
              is_deleted IS FALSE
              OR is_deleted IS NULL
            )
            `
          );

        result.rows.forEach(
          row => {

            finalData.push({

              criteriaNo: c,

              ...row

            });

          }
        );

      }

      res.json({

        success: true,

        total:
          finalData.length,

        reports:
          finalData

      });

    }

    catch (err) {

      console.error(
        "ALL REPORTS ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// DOWNLOAD CRITERIA REPORT
// ======================================================

app.get(
  "/api/reports/download/:criteriaNo",
  async (req, res) => {

    try {

      const {
        criteriaNo
      } = req.params;

      const tableName =
        getTableName(criteriaNo);

      const result =
        await pool.query(
          `
          SELECT *
          FROM ${tableName}
          WHERE (
            is_deleted IS FALSE
            OR is_deleted IS NULL
          )
          ORDER BY
            sub_section ASC,
            row_id ASC
          `
        );

      res.json({

        success: true,

        criteriaNo,

        total:
          result.rows.length,

        reports:
          result.rows

      });

    }

    catch (err) {

      console.error(
        "REPORT DOWNLOAD ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// DATABASE TEST
// ======================================================

app.get(
  "/api/test-db",
  async (req, res) => {

    try {

      const result =
        await pool.query(
          "SELECT NOW()"
        );

      res.json({

        success: true,

        databaseTime:
          result.rows[0]

      });

    }

    catch (err) {

      console.error(
        "DATABASE TEST ERROR :",
        err
      );

      res.status(500).json({

        success: false,

        error:
          err.message

      });

    }

  }
);


// ======================================================
// ROOT API
// ======================================================

app.get(
  "/api",
  (req, res) => {

    res.json({

      success: true,

      message:
        "NBA Universal Criteria API Running",

      supportedCriteria: [
        2,
        4,
        7,
        8
      ]

    });

  }
);


// ======================================================
// REGISTER API
// ======================================================

app.post(
  "/register",
  async (req, res) => {

    console.log(
      "REGISTER BODY:",
      req.body
    );

    try {

      const {
        full_name,
        email,
        password
      } = req.body;

      const existingUser =
        await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

      if (
        existingUser.rows.length > 0
      ) {

        return res.json({

          success: false,

          message:
            "Email already exists"

        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const result =
        await pool.query(
          `
          INSERT INTO users
          (
            full_name,
            email,
            password
          )
          VALUES
          (
            $1,
            $2,
            $3
          )
          RETURNING *
          `,
          [
            full_name,
            email,
            hashedPassword
          ]
        );

      res.json({

        success: true,

        message:
          "Registration Successful",

        user:
          result.rows[0]

      });

    }

    catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Registration failed"

      });

    }

  }
);


// ======================================================
// LOGIN API
// ======================================================

app.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      console.log(
        "Login Request:",
        email
      );

      const result =
        await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

      console.log(
        "User Found:",
        result.rows
      );

      if (
        result.rows.length === 0
      ) {

        return res.json({

          success: false,

          message:
            "Invalid Email"

        });

      }

      const user =
        result.rows[0];

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.json({

          success: false,

          message:
            "Invalid Password"

        });

      }

      res.json({

        success: true,

        message:
          "Login Successful",

        user: {

          id:
            user.id,

          full_name:
            user.full_name,

          email:
            user.email

        }

      });

    }

    catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  }
);


// ======================================================
// SERVER START
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Universal Server Running On Port ${PORT}`
    );

  }
);
