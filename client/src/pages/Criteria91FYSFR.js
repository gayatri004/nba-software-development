import React, {
  useEffect,
  useRef,
  useState
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaClipboardList,
  FaCalculator,
  FaChartBar,
  FaFileAlt,
  FaCloudUploadAlt,
  FaEye,
  FaUndo,
  FaSave,
  FaTrash,
  FaPrint,
  FaArrowRight,
  FaArrowLeft,
  FaStar
} from "react-icons/fa";


import "./Criteria91FYSFR.css";


// ============================================================
// LOCAL STORAGE
// ============================================================

const STORAGE_KEY =
  "criteria91_fysfr_data";


// ============================================================
// INDEXED DB
// ============================================================

const DB_NAME =
  "NBA_Criteria91_DB";

const STORE_NAME =
  "criteria91_files";


// ============================================================
// OPEN INDEXED DB
// ============================================================

const openFileDB = () => {

  return new Promise((resolve, reject) => {

    if (!window.indexedDB) {

      reject(
        new Error(
          "IndexedDB is not supported in this browser."
        )
      );

      return;
    }


    const request =
      window.indexedDB.open(
        DB_NAME,
        1
      );


    request.onupgradeneeded = (event) => {

      const db =
        event.target.result;


      if (
        !db.objectStoreNames.contains(
          STORE_NAME
        )
      ) {

        db.createObjectStore(
          STORE_NAME
        );

      }

    };


    request.onsuccess = () => {

      resolve(
        request.result
      );

    };


    request.onerror = () => {

      reject(
        request.error
      );

    };

  });

};


// ============================================================
// SAVE FILE TO INDEXED DB
// ============================================================

const saveFileToDB = async (
  index,
  file
) => {

  const db =
    await openFileDB();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      const request =
        store.put(
          file,
          `criteria91_document_${index}`
        );


      request.onsuccess = () => {

        resolve();

      };


      request.onerror = () => {

        reject(
          request.error
        );

      };


      transaction.oncomplete = () => {

        db.close();

      };


      transaction.onerror = () => {

        db.close();

        reject(
          transaction.error
        );

      };

    }
  );

};


// ============================================================
// GET FILE FROM INDEXED DB
// ============================================================

const getFileFromDB = async (
  index
) => {

  const db =
    await openFileDB();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          "readonly"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      const request =
        store.get(
          `criteria91_document_${index}`
        );


      request.onsuccess = () => {

        resolve(
          request.result || null
        );

      };


      request.onerror = () => {

        reject(
          request.error
        );

      };


      transaction.oncomplete = () => {

        db.close();

      };

    }
  );

};


// ============================================================
// DELETE ONE FILE
// ============================================================

const deleteFileFromDB = async (
  index
) => {

  const db =
    await openFileDB();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      const request =
        store.delete(
          `criteria91_document_${index}`
        );


      request.onsuccess = () => {

        resolve();

      };


      request.onerror = () => {

        reject(
          request.error
        );

      };


      transaction.oncomplete = () => {

        db.close();

      };


      transaction.onerror = () => {

        db.close();

        reject(
          transaction.error
        );

      };

    }
  );

};


// ============================================================
// CLEAR ALL CURRENT CRITERIA 9.1 FILES
// ============================================================

const clearAllFilesFromDB = async () => {

  const db =
    await openFileDB();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      for (
        let i = 0;
        i < 4;
        i++
      ) {

        store.delete(
          `criteria91_document_${i}`
        );

      }


      transaction.oncomplete = () => {

        db.close();

        resolve();

      };


      transaction.onerror = () => {

        db.close();

        reject(
          transaction.error
        );

      };

    }
  );

};


// ============================================================
// COMPONENT
// ============================================================

function Criteria91FYSFR() {

  const navigate =
    useNavigate();


  const fileRefs =
    useRef([]);


  // ==========================================================
  // STATES
  // ==========================================================

  const [
    students,
    setStudents
  ] = useState("");


  const [
    faculty,
    setFaculty
  ] = useState("");


  const [
    fractionalFaculty,
    setFractionalFaculty
  ] = useState("");


  const [
    remarks,
    setRemarks
  ] = useState("");


  const [
    files,
    setFiles
  ] = useState([
    null,
    null,
    null,
    null
  ]);


  const [
    savedId,
    setSavedId
  ] = useState(null);


  const [
    loaded,
    setLoaded
  ] = useState(false);


  const [
    loading,
    setLoading
  ] = useState(false);


  // ==========================================================
  // DOCUMENT NAMES
  // ==========================================================

  const documentRows = [

    "Faculty Calculation Sheet",

    "Faculty Appointment Letters",

    "Student Calculation Sheet (As per SAR Table 9.1.1.)",

    "Any Other Supporting Document"

  ];


  // ==========================================================
  // CALCULATION
  // ==========================================================

  const studentValue =
    Number(students) || 0;


  const facultyValue =
    Number(faculty) || 0;


  const fractionalValue =
    Number(fractionalFaculty) || 0;


  const fysfr =
    studentValue > 0
      ? (
          (
            facultyValue +
            fractionalValue
          ) / studentValue
        ) * 100
      : 0;


  const fysfrDisplay =
    fysfr.toFixed(2);


  // ==========================================================
  // MARKS
  // ==========================================================

  const getMarks = (value) => {

    if (value >= 80) {
      return 5;
    }

    if (value >= 70) {
      return 4;
    }

    if (value >= 60) {
      return 3;
    }

    if (value >= 50) {
      return 2;
    }

    if (value >= 40) {
      return 1;
    }

    return 0;

  };


  const calculatedMarks =
    getMarks(fysfr);


  // ==========================================================
  // RANGE
  // ==========================================================

  const getRange = (value) => {

    if (value >= 80) {
      return "≥ 80%";
    }

    if (value >= 70) {
      return "≥ 70% to < 80%";
    }

    if (value >= 60) {
      return "≥ 60% to < 70%";
    }

    if (value >= 50) {
      return "≥ 50% to < 60%";
    }

    if (value >= 40) {
      return "≥ 40% to < 50%";
    }

    return "< 40%";

  };


  const calculatedRange =
    getRange(fysfr);


  // ==========================================================
  // AUTO SAVE FUNCTION
  // ==========================================================

  const autoSave = () => {

    if (!loaded) {
      return;
    }


    const localData = {

      students,

      faculty,

      fractionalFaculty,

      remarks,

      fysfr:
        Number(fysfrDisplay),

      marks:
        calculatedMarks,

      range:
        calculatedRange,

      savedId

    };


    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(localData)
      );


      console.log(
        "Criteria 9.1 AUTO SAVE SUCCESS"
      );

    } catch (error) {

      console.error(
        "Criteria 9.1 auto save error:",
        error
      );

    }

  };


  // ==========================================================
  // LOAD LOCAL DATA + FILES
  // ==========================================================

  useEffect(() => {

    let mounted = true;


    const loadData = async () => {

      try {

        // ----------------------------------------------------
        // LOCAL STORAGE
        // ----------------------------------------------------

        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );


        if (saved) {

          const data =
            JSON.parse(saved);


          if (!mounted) {
            return;
          }


          setStudents(
            data.students ?? ""
          );


          setFaculty(
            data.faculty ?? ""
          );


          setFractionalFaculty(
            data.fractionalFaculty ?? ""
          );


          setRemarks(
            data.remarks ?? ""
          );


          setSavedId(
            data.savedId ?? null
          );


          console.log(
            "Criteria 9.1 local data restored:",
            data
          );

        }


        // ----------------------------------------------------
        // INDEXED DB FILES
        // ----------------------------------------------------

        const restoredFiles = [];


        for (
          let i = 0;
          i < 4;
          i++
        ) {

          try {

            const file =
              await getFileFromDB(i);


            restoredFiles.push(
              file || null
            );

          } catch (fileError) {

            console.error(
              `Criteria 9.1 file ${i + 1} restore error:`,
              fileError
            );


            restoredFiles.push(
              null
            );

          }

        }


        if (mounted) {

          setFiles(
            restoredFiles
          );


          console.log(
            "Criteria 9.1 files restored:",
            restoredFiles
          );

        }

      } catch (error) {

        console.error(
          "Criteria 9.1 load error:",
          error
        );

      } finally {

        if (mounted) {

          setLoaded(true);

        }

      }

    };


    loadData();


    return () => {

      mounted = false;

    };

  }, []);


  // ==========================================================
  // TEXT AUTO SAVE
  // ==========================================================

  useEffect(() => {

    if (!loaded) {
      return;
    }


    const timer =
      setTimeout(() => {

        autoSave();

      }, 300);


    return () => {

      clearTimeout(timer);

    };

  }, [
    loaded,
    students,
    faculty,
    fractionalFaculty,
    remarks,
    fysfrDisplay,
    calculatedMarks,
    calculatedRange,
    savedId
  ]);


  // ==========================================================
  // FILE CHANGE
  // FILE AUTO SAVE -> INDEXED DB
  // ==========================================================

  const handleFileChange =
    async (
      index,
      e
    ) => {

      const file =
        e.target.files?.[0];


      if (!file) {
        return;
      }


      const allowedTypes = [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "image/jpeg",

        "image/png",

        "image/jpg",

        "image/webp"

      ];


      if (
        file.type &&
        !allowedTypes.includes(
          file.type
        )
      ) {

        alert(
          "Only PDF, DOC, DOCX and Image files are allowed."
        );


        e.target.value =
          "";


        return;

      }


      try {

        setLoading(true);


        // ----------------------------------------------------
        // FILE AUTO SAVE
        // ----------------------------------------------------

        await saveFileToDB(
          index,
          file
        );


        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        const updatedFiles =
          [...files];


        updatedFiles[index] =
          file;


        setFiles(
          updatedFiles
        );


        console.log(
          `Document ${index + 1} AUTO SAVED`
        );


      } catch (error) {

        console.error(
          "File auto save error:",
          error
        );


        alert(
          "File auto save failed."
        );


        e.target.value =
          "";

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // VIEW FILE
  // ==========================================================

  const handleViewFile =
    async (
      index
    ) => {

      try {

        const file =
          await getFileFromDB(
            index
          );


        if (!file) {

          alert(
            "Please upload a document first."
          );

          return;

        }


        const url =
          URL.createObjectURL(
            file
          );


        window.open(
          url,
          "_blank"
        );

      } catch (error) {

        console.error(
          "View file error:",
          error
        );


        alert(
          "Unable to open document."
        );

      }

    };


  // ==========================================================
  // REMOVE CURRENT FILE
  // ==========================================================

  const removeFile =
    async (
      index
    ) => {

      try {

        await deleteFileFromDB(
          index
        );


        const updatedFiles =
          [...files];


        updatedFiles[index] =
          null;


        setFiles(
          updatedFiles
        );


        if (
          fileRefs.current[index]
        ) {

          fileRefs.current[index].value =
            "";

        }

      } catch (error) {

        console.error(
          "Remove file error:",
          error
        );

      }

    };


  // ==========================================================
  // SAVE TO POSTGRESQL
  //
  // IMPORTANT:
  // Database save ONLY when Save button clicked.
  // ==========================================================

  const handleSave =
    async () => {

      try {

        setLoading(true);


        const formData =
          new FormData();


        formData.append(
          "students",
          students
        );


        formData.append(
          "faculty",
          faculty
        );


        formData.append(
          "fractional_faculty",
          fractionalFaculty
        );


        formData.append(
          "fysfr",
          Number(fysfrDisplay)
        );


        formData.append(
          "marks",
          calculatedMarks
        );


        formData.append(
          "range",
          calculatedRange
        );


        formData.append(
          "remarks",
          remarks
        );


        // ----------------------------------------------------
        // FILES FROM INDEXED DB
        // ----------------------------------------------------

        for (
          let i = 0;
          i < 4;
          i++
        ) {

          const file =
            await getFileFromDB(i);


          if (file) {

            formData.append(
              `document_${i}`,
              file
            );

          }

        }


        let response;


        // ----------------------------------------------------
        // UPDATE EXISTING RECORD
        // ----------------------------------------------------

        if (savedId) {

          response =
            await axios.put(

              `http://localhost:5000/api/criteria91/${savedId}`,

              formData,

              {
                headers: {
                  "Content-Type":
                    "multipart/form-data"
                }
              }

            );

        }

        // ----------------------------------------------------
        // INSERT NEW RECORD
        // ----------------------------------------------------

        else {

          response =
            await axios.post(

              "http://localhost:5000/api/criteria91",

              formData,

              {
                headers: {
                  "Content-Type":
                    "multipart/form-data"
                }
              }

            );

        }


        if (
          response.data.success
        ) {

          const record =
            response.data.data;


          const newId =
            record.id;


          setSavedId(
            newId
          );


          // --------------------------------------------------
          // Save local copy
          // --------------------------------------------------

          const localData = {

            students,

            faculty,

            fractionalFaculty,

            remarks,

            fysfr:
              Number(fysfrDisplay),

            marks:
              calculatedMarks,

            range:
              calculatedRange,

            savedId:
              newId

          };


          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              localData
            )
          );


          alert(
            savedId
              ? "Criteria 9.1 updated successfully."
              : "Criteria 9.1 saved successfully."
          );

        }

      } catch (error) {

        console.error(
          "Criteria 9.1 Save Error:",
          error
        );


        alert(
          error.response?.data?.error ||
          "Criteria 9.1 save failed."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // CLEAR
  //
  // IMPORTANT:
  // DATABASE RECORD WILL NOT BE DELETED.
  // ==========================================================

  const handleClear =
    async () => {

      const confirmClear =
        window.confirm(
          "Clear current form? Database record will NOT be deleted."
        );


      if (!confirmClear) {
        return;
      }


      try {

        setLoading(true);


        // ----------------------------------------------------
        // LOCAL STORAGE CLEAR
        // ----------------------------------------------------

        localStorage.removeItem(
          STORAGE_KEY
        );


        // ----------------------------------------------------
        // CURRENT FILES CLEAR
        // ----------------------------------------------------

        await clearAllFilesFromDB();


        // ----------------------------------------------------
        // FORM CLEAR
        // ----------------------------------------------------

        setStudents("");

        setFaculty("");

        setFractionalFaculty("");

        setRemarks("");


        setFiles([
          null,
          null,
          null,
          null
        ]);


        // ----------------------------------------------------
        // INPUT CLEAR
        // ----------------------------------------------------

        fileRefs.current.forEach(
          (ref) => {

            if (ref) {

              ref.value =
                "";

            }

          }
        );


        /*
          IMPORTANT:
          savedId intentionally remains unchanged.
          Database record is NOT deleted.
        */


        alert(
          "Current form cleared. Database record is still safe."
        );

      } catch (error) {

        console.error(
          "Criteria 9.1 Clear Error:",
          error
        );


        alert(
          "Clear failed."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // DELETE
  //
  // ONLY CURRENT DATABASE RECORD
  // ==========================================================

  const handleDelete =
    async () => {

      if (!savedId) {

        alert(
          "No saved Criteria 9.1 database record found."
        );

        return;

      }


      const confirmDelete =
        window.confirm(
          "Delete only the current Criteria 9.1 database record?"
        );


      if (!confirmDelete) {
        return;
      }


      try {

        setLoading(true);


        await axios.delete(
          `http://localhost:5000/api/criteria91/${savedId}`
        );


        // ----------------------------------------------------
        // Clear local current record
        // ----------------------------------------------------

        localStorage.removeItem(
          STORAGE_KEY
        );


        await clearAllFilesFromDB();


        setStudents("");

        setFaculty("");

        setFractionalFaculty("");

        setRemarks("");


        setFiles([
          null,
          null,
          null,
          null
        ]);


        setSavedId(
          null
        );


        fileRefs.current.forEach(
          (ref) => {

            if (ref) {

              ref.value =
                "";

            }

          }
        );


        alert(
          "Current Criteria 9.1 record deleted successfully."
        );

      } catch (error) {

        console.error(
          "Criteria 9.1 Delete Error:",
          error
        );


        alert(
          error.response?.data?.error ||
          "Delete failed."
        );

      } finally {

        setLoading(false);

      }

    };


  // ==========================================================
  // PRINT
  // ==========================================================

  const handlePrint =
    () => {

      window.print();

    };


  // ==========================================================
  // NEXT
  //
  // Local data remains.
  // Database remains.
  // IndexedDB files remain.
  // ==========================================================

  const handleNext =
    () => {

      autoSave();


      navigate(
        "/criteria9/2"
      );

    };


  // ==========================================================
  // PREVIOUS
  // ==========================================================

  const handlePrevious =
    () => {

      autoSave();


      navigate(
        "/criteria9"
      );

    };


  // ==========================================================
  // JSX
  // ==========================================================

  return (

    <div className="fysfr-container">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="fysfr-header">

        <div className="fysfr-header-left">

          <div className="fysfr-number">
            9.1
          </div>


          <div>

            <h1>
              First Year Student-Faculty Ratio (FYSFR)
            </h1>


            <p>
              Evaluate the percentage of faculty with respect
              to first year students.
            </p>

          </div>

        </div>

      </div>


      {/* ====================================================
          MAIN GRID
      ==================================================== */}

      <div className="fysfr-main-grid">


        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <div className="fysfr-left-column">


          {/* ================================================
              GUIDELINES
          ================================================= */}

          <div className="fysfr-card guidelines-card">

            <div className="card-title">

              <FaClipboardList />

              <h2>
                Evaluation Guidelines
              </h2>

            </div>


            <div className="guideline-list">


              <div className="guideline-row">

                <span>›</span>

                <span>
                  ≥ 80% of faculty members
                </span>

                <b>
                  - 05 marks
                </b>

              </div>


              <div className="guideline-row">

                <span>›</span>

                <span>
                  ≥ 70% to &lt; 80% of faculty members
                </span>

                <b>
                  - 04 marks
                </b>

              </div>


              <div className="guideline-row">

                <span>›</span>

                <span>
                  ≥ 60% to &lt; 70% of faculty members
                </span>

                <b>
                  - 03 marks
                </b>

              </div>


              <div className="guideline-row">

                <span>›</span>

                <span>
                  ≥ 50% to &lt; 60% of faculty members
                </span>

                <b>
                  - 02 marks
                </b>

              </div>


              <div className="guideline-row">

                <span>›</span>

                <span>
                  ≥ 40% to &lt; 50% of faculty members
                </span>

                <b>
                  - 01 mark
                </b>

              </div>


              <div className="guideline-row">

                <span>›</span>

                <span>
                  &lt; 40% of faculty members
                </span>

                <b>
                  - 00 mark
                </b>

              </div>


            </div>

          </div>


          {/* ================================================
              DATA ENTRY
          ================================================= */}

          <div className="fysfr-card">

            <div className="card-title">

              <FaChartBar />

              <h2>
                Data Entry &amp; Calculation
              </h2>

            </div>


            <div className="input-row">

              <label>
                Total Number of First Year Students
              </label>


              <input
                type="number"
                min="0"
                value={students}
                onChange={(e) =>
                  setStudents(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="input-row">

              <label>
                Total Number of Faculty Members
              </label>


              <input
                type="number"
                min="0"
                value={faculty}
                onChange={(e) =>
                  setFaculty(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="input-row">

              <label>
                Faculty with Fractional Load (If any)
              </label>


              <input
                type="number"
                min="0"
                step="0.01"
                value={fractionalFaculty}
                onChange={(e) =>
                  setFractionalFaculty(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="result-row">

              <label>
                First Year Student-Faculty Ratio (FYSFR) %
              </label>


              <div className="result-value">

                {fysfrDisplay} %

              </div>

            </div>

          </div>


          {/* ================================================
              EVALUATION
          ================================================= */}

          <div className="fysfr-card evaluation-card">

            <div className="card-title">

              <FaStar />

              <h2>
                Evaluation &amp; Marks
              </h2>

            </div>


            <div className="evaluation-row">

              <label>
                Applicable Range
              </label>


              <div className="marks-box">

                {calculatedRange}

              </div>

            </div>


            <div className="evaluation-row">

              <label>
                Marks Awarded
              </label>


              <div className="marks-box">

                {calculatedMarks} / 5

              </div>

            </div>


            <div className="remarks-box">

              <label>
                Remarks (Optional)
              </label>


              <textarea
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


        </div>


        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="fysfr-right-column">


          {/* ================================================
              FORMULA
          ================================================= */}

          <div className="fysfr-card formula-card">

            <div className="card-title">

              <FaCalculator />

              <h2>
                Formula
              </h2>

            </div>


            <div className="formula-box">

              FYSFR (%) =
              ( No. of Faculty / No. of First Year Students )
              × 100

            </div>


            <div className="where-section">

              <h3>
                Where,
              </h3>


              <ul>

                <li>
                  No. of Faculty = Total faculty members
                  considering faculty definition and
                  fractional load
                </li>


                <li>
                  No. of First Year Students = Total number
                  of students admitted in first year
                </li>

              </ul>

            </div>


            <div className="formula-icon">

              <FaCalculator />

              <FaFileAlt />

            </div>

          </div>


          {/* ================================================
              EXHIBITS
          ================================================= */}

          <div className="fysfr-card exhibits-card">

            <div className="card-title">

              <FaFileAlt />

              <h2>
                Exhibits / Context to be Observed / Assessed
              </h2>

            </div>


            <ul className="exhibits-list">

              <li>
                No. of faculty calculation considering
                faculty definition and fractional load
              </li>


              <li>
                Faculty appointment letters
              </li>


              <li>
                No. of student's calculation as mentioned
                in the SAR (Table 9.1.1.)
              </li>

            </ul>

          </div>


          {/* ================================================
              DOCUMENTS
          ================================================= */}

          <div className="fysfr-card documents-card">

            <div className="card-title">

              <FaCloudUploadAlt />

              <h2>
                Supporting Documents (Upload)
              </h2>

            </div>


            <div className="document-table">


              <div className="document-header">

                <div>
                  Sr. No.
                </div>

                <div>
                  Document Type
                </div>

                <div>
                  Upload File
                </div>

                <div>
                  View
                </div>

              </div>


              {documentRows.map(
                (
                  documentName,
                  index
                ) => (

                  <div
                    className="document-row"
                    key={index}
                  >

                    <div className="serial">

                      {index + 1}

                    </div>


                    <div className="document-name">

                      {documentName}

                    </div>


                    <div className="upload-area">

                      <input
                        type="file"

                        ref={(el) => {

                          fileRefs.current[index] =
                            el;

                        }}

                        onChange={(e) =>
                          handleFileChange(
                            index,
                            e
                          )
                        }

                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                      />

                    </div>


                    <div className="view-area">

                      <button
                        type="button"
                        onClick={() =>
                          handleViewFile(
                            index
                          )
                        }
                        title="View Document"
                      >

                        <FaEye />

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


        </div>

      </div>


      {/* ====================================================
          BUTTONS
      ==================================================== */}

      <div className="fysfr-buttons">


    


        {/* SAVE */}

        <button
          className="btn save-btn"
          onClick={handleSave}
          disabled={loading}
        >

          <FaSave />

          {loading
            ? "Saving..."
            : "Save"}

        </button>


        {/* CLEAR */}

        <button
          className="btn clear-btn"
          onClick={handleClear}
          disabled={loading}
        >

          <FaUndo />

          Clear

        </button>


        {/* DELETE */}

        <button
          className="btn delete-btn"
          onClick={handleDelete}
          disabled={loading}
        >

          <FaTrash />

          Delete

        </button>


        {/* PRINT */}

        <button
          className="btn print-btn"
          onClick={handlePrint}
          disabled={loading}
        >

          <FaPrint />

          Print

        </button>


        {/* NEXT */}

        <button
          className="btn next-btn"
          onClick={handleNext}
          disabled={loading}
        >

          Next

          <FaArrowRight />

        </button>


      </div>


    </div>

  );

}


export default Criteria91FYSFR;