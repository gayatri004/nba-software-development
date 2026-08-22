import React, { useState, useEffect } from "react";
import "./Curriculum.css";
import NBASidebar from "../pages/NBASidebar";

import {
  FaBook,
  FaGraduationCap,
  FaFlask,
  FaEdit,
  FaTrash,
  FaDownload,
  FaPrint,
  FaEye
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

function Curriculum({ onNext, onPrevious }) {

  const navigate = useNavigate();

  /* =====================================================
     STATE
  ===================================================== */

  const [attachmentFile, setAttachmentFile] = useState(null);
  const [syllabusPdf, setSyllabusPdf] = useState(null);

  const [pdfName, setPdfName] = useState("");
  const [attachmentName, setAttachmentName] = useState(null);

  const [activityName, setActivityName] = useState("");
  const [facultyName, setFacultyName] = useState("");

  const STORAGE_KEY = "curriculum_1_2_data";

  const [savedFileNames, setSavedFileNames] = useState({});
  const [loaded, setLoaded] = useState(false);

  const [
    teachingLearningProcess,
    setTeachingLearningProcess
  ] = useState(
    "The department follows outcome-based teaching-learning methods to achieve POs and PSOs."
  );

  const [
    curriculumDevelopmentProcess,
    setCurriculumDevelopmentProcess
  ] = useState(
    "The curriculum is developed and revised through BoS with stakeholder feedback and industry requirements."
  );

  const [gapDescription, setGapDescription] = useState(
    "The department identifies curriculum gaps based on academic and industry requirements."
  );

  const [actionTaken, setActionTaken] = useState("");

  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [deptFile, setDeptFile] = useState(null);
  const [scienceFile, setScienceFile] = useState(null);
  const [mdmFile, setMdmFile] = useState(null);
  const [contentFile, setContentFile] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [methodFile, setMethodFile] = useState(null);
  const [creditFile, setCreditFile] = useState(null);


  /* =====================================================
     RESTORE LOCAL STORAGE
  ===================================================== */

  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      try {

        const data = JSON.parse(saved);

        setTeachingLearningProcess(
          data.teachingLearningProcess ?? ""
        );

        setCurriculumDevelopmentProcess(
          data.curriculumDevelopmentProcess ?? ""
        );

        setGapDescription(
          data.gapDescription ?? ""
        );

        setActionTaken(
          data.actionTaken ?? ""
        );

        setAcademicYear(
          data.academicYear ?? ""
        );

        setSemester(
          data.semester ?? ""
        );

        setActivityName(
          data.activityName ?? ""
        );

        setFacultyName(
          data.facultyName ?? ""
        );

        if (data.files) {
          setSavedFileNames(data.files);
        }

      } catch (error) {

        console.log(
          "Curriculum Restore Error:",
          error
        );

      }

    }

    setLoaded(true);

  }, []);


  /* =====================================================
     SAVE LOCAL STORAGE
  ===================================================== */

  useEffect(() => {

    if (!loaded) return;

    const data = {

      teachingLearningProcess,

      curriculumDevelopmentProcess,

      gapDescription,

      actionTaken,

      academicYear,

      semester,

      activityName,

      facultyName,

      files: savedFileNames

    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );

  }, [

    loaded,

    teachingLearningProcess,

    curriculumDevelopmentProcess,

    gapDescription,

    actionTaken,

    academicYear,

    semester,

    activityName,

    facultyName,

    savedFileNames

  ]);


  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = async () => {

    try {

      if (

        !teachingLearningProcess.trim() ||

        !curriculumDevelopmentProcess.trim() ||

        !gapDescription.trim() ||

        !actionTaken.trim() ||

        !academicYear.trim() ||

        !semester.trim() ||

        !activityName.trim() ||

        !facultyName.trim() ||

        (!attachmentFile &&
          !savedFileNames.attachmentFile) ||

        (!syllabusPdf &&
          !savedFileNames.syllabusPdf) ||

        (!deptFile &&
          !savedFileNames.deptFile) ||

        (!scienceFile &&
          !savedFileNames.scienceFile) ||

        (!mdmFile &&
          !savedFileNames.mdmFile) ||

        (!methodFile &&
          !savedFileNames.methodFile) ||

        (!creditFile &&
          !savedFileNames.creditFile) ||

        (!proofFile &&
          !savedFileNames.proofFile) ||

        (!contentFile &&
          !savedFileNames.contentFile)

      ) {

        alert("Please fill all required fields.");

        return;

      }


      const formData = new FormData();


      if (attachmentFile)
        formData.append(
          "tlpAttachment",
          attachmentFile
        );


      if (syllabusPdf)
        formData.append(
          "syllabusFile",
          syllabusPdf
        );


      if (deptFile)
        formData.append(
          "departmentSubjectsFile",
          deptFile
        );


      if (scienceFile)
        formData.append(
          "generalScienceFile",
          scienceFile
        );


      if (mdmFile)
        formData.append(
          "mdmElectiveFile",
          mdmFile
        );


      if (methodFile)
        formData.append(
          "methodFile",
          methodFile
        );


      if (creditFile)
        formData.append(
          "creditFile",
          creditFile
        );


      if (proofFile)
        formData.append(
          "curriculumGapFile",
          proofFile
        );


      if (contentFile)
        formData.append(
          "activityFile",
          contentFile
        );


      const response = await fetch(
        "http://localhost:5000/save-curriculum",
        {
          method: "POST",
          body: formData
        }
      );


      const data = await response.json();

      alert(data.message);

    } catch (error) {

      console.log(error);

      alert(error.message);

    }

  };


  /* =====================================================
     VIEW FILE
  ===================================================== */

  const handleView = (file) => {

    if (!file) {

      alert("Please upload file first.");

      return;

    }


    const extension =
      file.name
        .split(".")
        .pop()
        .toLowerCase();


    if (extension === "pdf") {

      window.open(
        `http://localhost:5000/uploads/${file.name}`,
        "_blank"
      );

    } else {

      window.open(
        `http://localhost:5000/download/${file.name}`,
        "_blank"
      );

    }

  };


  /* =====================================================
     DOWNLOAD
  ===================================================== */

  const handleFileDownload = (file) => {

    if (!file) {

      alert("Please upload file first.");

      return;

    }

    window.open(
      `http://localhost:5000/download/${file.name}`,
      "_blank"
    );

  };


  /* =====================================================
     READ FILE CONTENT
  ===================================================== */

  const readFileContentHTML = async (fileName) => {

    const ext =
      fileName
        .split(".")
        .pop()
        .toLowerCase();


    if (ext === "pdf") {

      return `
        <embed
          src="http://localhost:5000/uploads/${fileName}"
          type="application/pdf"
          style="width:100%;height:900px;"
        />
      `;

    }


    if (
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp"
      ].includes(ext)
    ) {

      return `
        <img
          src="http://localhost:5000/uploads/${fileName}"
          style="width:100%;"
        />
      `;

    }


    if (ext === "docx") {

      const response = await fetch(
        `http://localhost:5000/uploads/${fileName}`
      );

      const blob = await response.blob();

      const buffer =
        await blob.arrayBuffer();

      const result =
        await mammoth.convertToHtml({
          arrayBuffer: buffer
        });

      return result.value;

    }


    if (
      ["xlsx", "xls"].includes(ext)
    ) {

      const response = await fetch(
        `http://localhost:5000/uploads/${fileName}`
      );

      const blob = await response.blob();

      const buffer =
        await blob.arrayBuffer();

      const workbook =
        XLSX.read(
          buffer,
          {
            type: "array"
          }
        );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      return XLSX.utils.sheet_to_html(
        sheet
      );

    }

    return "";

  };


  /* =====================================================
     PRINT
  ===================================================== */

  const handlePrint = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/print-curriculum-files"
      );

      const data = await res.json();


      const documents = [

        {
          title:
            "Teaching Learning Process",
          file:
            data.tlp_attachment
        },

        {
          title:
            "Curriculum Development Process",
          file:
            data.syllabus_file
        },

        {
          title:
            "Department Subjects",
          file:
            data.department_subjects_file
        },

        {
          title:
            "General Science",
          file:
            data.general_science_file
        },

        {
          title:
            "MDM Elective",
          file:
            data.mdm_elective_file
        },

        {
          title:
            "Teaching Learning Methods",
          file:
            data.teaching_learning_methods_file
        },

        {
          title:
            "Credit Structure",
          file:
            data.credit_structure_file
        },

        {
          title:
            "Curriculum Gap Analysis",
          file:
            data.curriculum_gap_file
        },

        {
          title:
            "Content Beyond Syllabus",
          file:
            data.activity_file
        }

      ].filter(
        item => item.file
      );


      let html = "";


      for (
        const doc of documents
      ) {

        const preview =
          await readFileContentHTML(
            doc.file
          );


        html += `

          <div class="doc-section">

            <h2>
              ${doc.title}
            </h2>

            ${preview}

            <hr/>

          </div>

        `;

      }


      const printWindow =
        window.open(
          "",
          "_blank"
        );


      printWindow.document.write(`

        <html>

        <head>

        <title>
          Curriculum Documents
        </title>

        <style>

        body{
          font-family:Arial;
          margin:20px;
        }

        h1{
          text-align:center;
          color:#0b4ea2;
        }

        h2{
          margin-top:35px;
          color:#0b4ea2;
          border-bottom:1px solid #ddd;
          padding-bottom:8px;
        }

        embed{
          width:100%;
          height:900px;
        }

        img{
          width:100%;
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        td,th{
          border:1px solid #ddd;
          padding:8px;
        }

        </style>

        </head>

        <body>

        <h1>
          1.2 Curriculum Documents
        </h1>

        ${html}

        </body>

        </html>

      `);


      printWindow.document.close();


      setTimeout(() => {

        printWindow.focus();

        printWindow.print();

      }, 1000);


    } catch (err) {

      console.log(err);

      alert("Print Error");

    }

  };


  /* =====================================================
     SAVE FILE NAME
  ===================================================== */

  const saveFileName = (
    key,
    file
  ) => {

    if (!file) return;


    setSavedFileNames(
      prev => ({
        ...prev,
        [key]: file.name
      })
    );

  };


  /* =====================================================
     UPLOAD HANDLERS
  ===================================================== */

  const handlePdfUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setSyllabusPdf(file);

      setPdfName(file.name);

      saveFileName(
        "syllabusPdf",
        file
      );

    }

  };


  const handleAttachmentUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setAttachmentFile(file);

      setAttachmentName(
        file.name
      );

      saveFileName(
        "attachmentFile",
        file
      );

    }

  };


  const handleDeptUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setDeptFile(file);

      saveFileName(
        "deptFile",
        file
      );

    }

  };


  const handleScienceUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setScienceFile(file);

      saveFileName(
        "scienceFile",
        file
      );

    }

  };


  const handleMdmUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setMdmFile(file);

      saveFileName(
        "mdmFile",
        file
      );

    }

  };


  const handleProofUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setProofFile(file);

      saveFileName(
        "proofFile",
        file
      );

    }

  };


  const handleContentUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setContentFile(file);

      saveFileName(
        "contentFile",
        file
      );

    }

  };


  const handleMethodUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setMethodFile(file);

      saveFileName(
        "methodFile",
        file
      );

    }

  };


  const handleCreditUpload = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setCreditFile(file);

      saveFileName(
        "creditFile",
        file
      );

    }

  };


  /* =====================================================
     PDF VIEW
  ===================================================== */

  const handleViewPdf = () => {

    if (syllabusPdf) {

      window.open(
        URL.createObjectURL(
          syllabusPdf
        )
      );

    } else {

      alert(
        "Please upload PDF first"
      );

    }

  };


  /* =====================================================
     OTHER ACTIONS
  ===================================================== */

  const handleUpdate = () => {

    alert(
      "Data Updated Successfully"
    );

  };


  const handleDelete = () => {

    alert(
      "Data Deleted Successfully"
    );

  };


  const handleEdit = () => {

    alert(
      "Edit Clicked"
    );

  };


  const handleDeleteRow = () => {

    alert(
      "Delete Clicked"
    );

  };


  /* =====================================================
     GET CURRICULUM
  ===================================================== */

  useEffect(() => {

    fetch(
      "http://localhost:5000/get-curriculum"
    )

      .then(res => res.json())

      .then(data => {

        setAttachmentName(
          data.tlp_attachment || ""
        );

        setPdfName(
          data.syllabus_file || ""
        );

      })

      .catch(
        err =>
          console.log(err)
      );

  }, []);


  /* =====================================================
     CLEAR
  ===================================================== */

  const handleClear = () => {

    const confirmClear =
      window.confirm(
        "Are you sure you want to clear uploaded files?"
      );


    if (!confirmClear)
      return;


    setAttachmentFile(null);

    setSyllabusPdf(null);

    setDeptFile(null);

    setScienceFile(null);

    setMdmFile(null);

    setMethodFile(null);

    setCreditFile(null);

    setProofFile(null);

    setContentFile(null);

    setAcademicYear("");

    setSemester("");

    setActivityName("");

    setFacultyName("");

    setSavedFileNames({});


    document
      .querySelectorAll(
        'input[type="file"]'
      )
      .forEach(
        input =>
          input.value = ""
      );


    alert(
      "Uploaded files cleared successfully."
    );

  };


  /* =====================================================
     PREVIOUS
  ===================================================== */

  const handlePrevious = () => {

    if (onPrevious) {

      onPrevious();

    }

  };


  /* =====================================================
     JSX
  ===================================================== */

  return (

    <div className="curriculum-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <NBASidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="curriculum-main">

        <div className="curriculum-page">


          {/* =================================================
              1.2.1
          ================================================= */}

          <div className="section purple-section">

            <h2>
              1.2.1 State the Process for Developing / Revising the Program Curriculum
            </h2>


            <div className="grid-2">


              {/* Teaching Learning Process */}

              <div className="card">

                <h3>
                  <FaGraduationCap />
                  Teaching Learning Process
                </h3>


                <textarea
                  placeholder="Enter Teaching Learning Process..."
                  value={
                    teachingLearningProcess
                  }
                  onChange={
                    e =>
                      setTeachingLearningProcess(
                        e.target.value
                      )
                  }
                />


                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="tlpAttachment"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="tlpAttachment"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handleAttachmentUpload
                    }
                  />


                  {
                    (
                      attachmentFile ||
                      savedFileNames.attachmentFile
                    ) && (

                      <div className="pdf-name">

                        {
                          attachmentFile?.name ||
                          savedFileNames.attachmentFile
                        }

                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          attachmentFile
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          attachmentFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>


              {/* Curriculum Development */}

              <div className="card">

                <h3>
                  <FaBook />
                  Curriculum Development Process
                </h3>


                <textarea
                  placeholder="Enter Curriculum Development Process..."
                  value={
                    curriculumDevelopmentProcess
                  }
                  onChange={
                    e =>
                      setCurriculumDevelopmentProcess(
                        e.target.value
                      )
                  }
                />


                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="syllabusFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="syllabusFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handlePdfUpload
                    }
                  />


                  {
                    (
                      syllabusPdf ||
                      savedFileNames.syllabusPdf
                    ) && (

                      <div className="pdf-name">

                        {
                          syllabusPdf?.name ||
                          savedFileNames.syllabusPdf
                        }

                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          syllabusPdf
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          syllabusPdf
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              1.2.2
          ================================================= */}

          <div className="section blue-section">

            <h2>
              1.2.2 Components of Program Curriculum
            </h2>


            <div className="grid-5">


              {/* Department Subjects */}

              <div className="mini-card">

                <FaBook />

                <h4>
                  Department Subjects
                </h4>

                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="departmentSubjectsFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="departmentSubjectsFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handleDeptUpload
                    }
                  />


                  {
                    (
                      deptFile ||
                      savedFileNames.deptFile
                    ) && (

                      <div className="pdf-name">
                        {
                          deptFile?.name ||
                          savedFileNames.deptFile
                        }
                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          deptFile
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          deptFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>


              {/* General Science */}

              <div className="mini-card">

                <FaFlask />

                <h4>
                  General Science
                </h4>

                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="generalScienceFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="generalScienceFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handleScienceUpload
                    }
                  />


                  {
                    (
                      scienceFile ||
                      savedFileNames.scienceFile
                    ) && (

                      <div className="pdf-name">
                        {
                          scienceFile?.name ||
                          savedFileNames.scienceFile
                        }
                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          scienceFile
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          scienceFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>


              {/* MDM */}

              <div className="mini-card">

                <FaGraduationCap />

                <h4>
                  MDM Elective Subject
                </h4>

                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="mdmElectiveFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="mdmElectiveFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handleMdmUpload
                    }
                  />


                  {
                    (
                      mdmFile ||
                      savedFileNames.mdmFile
                    ) && (

                      <div className="pdf-name">
                        {
                          mdmFile?.name ||
                          savedFileNames.mdmFile
                        }
                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          mdmFile
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          mdmFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>


              {/* Teaching Learning Methods */}

              <div className="mini-card">

                <FaBook />

                <h4>
                  Teaching Learning Methods
                </h4>

                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="methodFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="methodFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handleMethodUpload
                    }
                  />


                  {
                    (
                      methodFile ||
                      savedFileNames.methodFile
                    ) && (

                      <div className="pdf-name">
                        {
                          methodFile?.name ||
                          savedFileNames.methodFile
                        }
                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          methodFile
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          methodFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>


              {/* Credit Structure */}

              <div className="mini-card">

                <FaGraduationCap />

                <h4>
                  Credit Structure
                </h4>

                <label>
                  Supporting Documents
                </label>


                <div className="file-upload-row">

                  <label
                    htmlFor="creditFile"
                    className="choose-file-btn"
                  >
                    Choose File
                  </label>


                  <input
                    id="creditFile"
                    type="file"
                    className="custom-file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                    onChange={
                      handleCreditUpload
                    }
                  />


                  {
                    (
                      creditFile ||
                      savedFileNames.creditFile
                    ) && (

                      <div className="pdf-name">
                        {
                          creditFile?.name ||
                          savedFileNames.creditFile
                        }
                      </div>

                    )
                  }


                  <div className="document-actions">

                    <button
                      className="view-btn"
                      onClick={() =>
                        handleView(
                          creditFile
                        )
                      }
                    >
                      <FaEye />
                    </button>


                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(
                          creditFile
                        )
                      }
                    >
                      <FaDownload />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              BOTTOM GRID
          ================================================= */}

          <div className="bottom-grid">


            {/* 1.2.3 */}

            <div className="section green-section">

              <h2>
                1.2.3 Curriculum Gap Analysis
              </h2>


              <label>
                Gap Description
              </label>


              <textarea
                placeholder="Enter Curriculum Gap Description..."
                value={gapDescription}
                onChange={
                  e =>
                    setGapDescription(
                      e.target.value
                    )
                }
              />


              <label>
                Action Taken
              </label>


              <textarea
                placeholder="Enter Action Taken..."
                value={actionTaken}
                onChange={
                  e =>
                    setActionTaken(
                      e.target.value
                    )
                }
              />


              <label>
                Supporting Documents
              </label>


              <div className="file-upload-row">

                <label
                  htmlFor="curriculumGapFile"
                  className="choose-file-btn"
                >
                  Choose File
                </label>


                <input
                  id="curriculumGapFile"
                  type="file"
                  className="custom-file-input"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={
                    handleProofUpload
                  }
                />


                {
                  (
                    proofFile ||
                    savedFileNames.proofFile
                  ) && (

                    <div className="pdf-name">
                      {
                        proofFile?.name ||
                        savedFileNames.proofFile
                      }
                    </div>

                  )
                }


                <div className="document-actions">

                  <button
                    className="view-btn"
                    onClick={() =>
                      handleView(
                        proofFile
                      )
                    }
                  >
                    <FaEye />
                  </button>


                  <button
                    className="download-btn"
                    onClick={() =>
                      handleFileDownload(
                        proofFile
                      )
                    }
                  >
                    <FaDownload />
                  </button>

                </div>

              </div>

            </div>


            {/* 1.2.4 */}

            <div className="section orange-section">

              <h2>
                1.2.4 Content Beyond Syllabus
              </h2>


              <div className="input-row">

                <input
                  type="text"
                  placeholder="Academic Year"
                  value={academicYear}
                  onChange={
                    e =>
                      setAcademicYear(
                        e.target.value
                      )
                  }
                />


                <input
                  type="text"
                  placeholder="Semester"
                  value={semester}
                  onChange={
                    e =>
                      setSemester(
                        e.target.value
                      )
                  }
                />

              </div>


              <div className="input-row">

                <input
                  type="text"
                  placeholder="Activity Name"
                  value={activityName}
                  onChange={
                    e =>
                      setActivityName(
                        e.target.value
                      )
                  }
                />


                <button
                  className="edit-btn"
                  onClick={handleEdit}
                >
                  <FaEdit />
                </button>


                <button
                  className="delete-btn"
                  onClick={
                    handleDeleteRow
                  }
                >
                  <FaTrash />
                </button>

              </div>


              <div className="input-row">

                <input
                  type="text"
                  placeholder="Faculty Name"
                  value={facultyName}
                  onChange={
                    e =>
                      setFacultyName(
                        e.target.value
                      )
                  }
                />


                <button
                  className="edit-btn"
                  onClick={handleEdit}
                >
                  <FaEdit />
                </button>


                <button
                  className="delete-btn"
                  onClick={
                    handleDeleteRow
                  }
                >
                  <FaTrash />
                </button>

              </div>


              <label>
                Supporting Documents
              </label>


              <div className="file-upload-row">

                <label
                  htmlFor="activityFile"
                  className="choose-file-btn"
                >
                  Choose File
                </label>


                <input
                  id="activityFile"
                  type="file"
                  className="custom-file-input"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                  onChange={
                    handleContentUpload
                  }
                />


                {
                  (
                    contentFile ||
                    savedFileNames.contentFile
                  ) && (

                    <div className="pdf-name">
                      {
                        contentFile?.name ||
                        savedFileNames.contentFile
                      }
                    </div>

                  )
                }


                <div className="document-actions">

                  <button
                    className="view-btn"
                    onClick={() =>
                      handleView(
                        contentFile
                      )
                    }
                  >
                    <FaEye />
                  </button>


                  <button
                    className="download-btn"
                    onClick={() =>
                      handleFileDownload(
                        contentFile
                      )
                    }
                  >
                    <FaDownload />
                  </button>

                </div>

              </div>


              {/* CONTENT TABLE */}

              <table className="content-table">

                <thead>

                  <tr>

                    <th>
                      Academic Year
                    </th>

                    <th>
                      Semester
                    </th>

                    <th>
                      Activity Name
                    </th>

                    <th>
                      Faculty
                    </th>

                    <th>
                      Document
                    </th>

                  </tr>

                </thead>


                <tbody>

                  <tr>

                    <td>
                      {academicYear}
                    </td>

                    <td>
                      {semester}
                    </td>

                    <td>
                      {activityName}
                    </td>

                    <td>
                      {facultyName}
                    </td>

                    <td>
                      {
                        contentFile?.name ||
                        savedFileNames.contentFile ||
                        "-"
                      }
                    </td>

                  </tr>

                </tbody>

              </table>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="btn-group">

                <button
                  type="button"
                  className="previous-btn"
                  onClick={() =>
                    navigate("/vision")
                  }
                >
                  ← Previous
                </button>


                <button
                  type="button"
                  className="back-btn"
                  onClick={() =>
                    navigate("/vision")
                  }
                >
                  ← Back
                </button>


                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSave}
                >
                  Save
                </button>


                <button
                  className="print-btn"
                  onClick={handlePrint}
                >
                  <FaPrint />
                  Print
                </button>


                <button
                  type="button"
                  className="clear-btn"
                  onClick={handleClear}
                >
                  Clear
                </button>


                <button
                  type="button"
                  className="next-page-btn"
                  onClick={() =>
                    navigate("/po-pso")
                  }
                >
                  Next →
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

export default Curriculum;