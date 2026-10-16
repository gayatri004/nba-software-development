import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria7_2.css";

const LOCAL_STORAGE_KEY = "criteria_7_2_draft_data";

const Criteria7_2 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.2";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;

    const academicYear = "2024-25";
    const department = "Computer Engineering";
    const program = "B.E. Computer Engineering";

    /* =========================================================
       PERMANENT DOCUMENT NAME + DESCRIPTION
    ========================================================= */

    const getInitialTableData = () => [
        {
            id: 1,
            s_n: 1,
            point: "Additional Laboratory Facilities",
            description:
                "Details of additional facilities available in laboratories.",
            fileObject: null,
            fileName: null,
        },
        {
            id: 2,
            s_n: 2,
            point: "Laboratory Facility Utilization",
            description:
                "Details of utilization and effectiveness of laboratory facilities.",
            fileObject: null,
            fileName: null,
        },
        {
            id: 3,
            s_n: 3,
            point: "POs/PSOs Relevance",
            description:
                "Details showing relevance of facilities to POs and PSOs.",
            fileObject: null,
            fileName: null,
        },
    ];

    /* =========================================================
       TABLE DATA
    ========================================================= */

    const [tableData, setTableData] = useState(() => {
        const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (localDraft) {
            try {
                const parsed = JSON.parse(localDraft);

                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse local draft:", e);
            }
        }

        return getInitialTableData();
    });

    const [isSavedOrSubmitted, setIsSavedOrSubmitted] = useState(false);

    /* =========================================================
       FETCH SAVED DATA
    ========================================================= */

    useEffect(() => {
        const fetchSavedData = async () => {
            const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (localDraft) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/data`, {
                    params: {
                        academicYear,
                        department,
                        program,
                    },
                });

                if (res.data && res.data.length > 0) {
                    const initialData = getInitialTableData();

                    const loadedData = initialData.map((defaultRow, index) => {
                        const dbRow = res.data[index];

                        return {
                            ...defaultRow,
                            id: dbRow?.row_id || defaultRow.id,
                            s_n: defaultRow.s_n,
                            fileName: dbRow?.file_name || null,
                            fileObject: null,
                        };
                    });

                    setTableData(loadedData);

                    localStorage.setItem(
                        LOCAL_STORAGE_KEY,
                        JSON.stringify(loadedData)
                    );
                }
            } catch (err) {
                console.error("Error occurred while fetching data:", err);
            }
        };

        fetchSavedData();
    }, [API_BASE_URL]);

    /* =========================================================
       LOCAL STORAGE
    ========================================================= */

    useEffect(() => {
        const serializableData = tableData.map((row) => ({
            ...row,
            fileObject: null,
        }));

        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(serializableData)
        );
    }, [tableData]);

    /* =========================================================
       FILE CHANGE
    ========================================================= */

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];

        if (!file) return;

        setIsSavedOrSubmitted(false);

        setTableData((prev) =>
            prev.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          fileName: file.name,
                          fileObject: file,
                      }
                    : row
            )
        );
    };

    /* =========================================================
       VIEW FILE
    ========================================================= */

    const handleViewFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);

            window.open(fileURL, "_blank");

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 5000);
        } else if (row.fileName) {
            window.open(
                `http://localhost:5000/uploads/${row.fileName}`,
                "_blank"
            );
        } else {
            alert("No file uploaded for this document!");
        }
    };

    /* =========================================================
       DOWNLOAD FILE
    ========================================================= */

    const handleDownloadFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);

            const link = document.createElement("a");
            link.href = fileURL;
            link.download = row.fileName || "document";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 1000);
        } else if (row.fileName) {
            const link = document.createElement("a");

            link.href = `http://localhost:5000/uploads/${row.fileName}`;
            link.download = row.fileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No file available for download!");
        }
    };

    /* =========================================================
       VALIDATION
    ========================================================= */

    const validateFormData = () => {
        for (const row of tableData) {
            if (!row.description.trim()) {
                alert(
                    `Description is missing for Sr. No. ${row.s_n}.`
                );
                return false;
            }
        }

        return true;
    };

    /* =========================================================
       RESET TABLE
    ========================================================= */

    const resetTableForm = () => {
        const initial = getInitialTableData();

        setTableData(initial);

        localStorage.removeItem(LOCAL_STORAGE_KEY);

        setIsSavedOrSubmitted(false);
    };

    /* =========================================================
       NAVIGATION
    ========================================================= */

    const handlePrevious = () => {
        navigate("/criteria/7.1");
    };

    const handleNext = () => {
        navigate("/criteria/7.3");
    };

    /* =========================================================
       SAVE TO SERVER
    ========================================================= */

    const saveToServer = async (isFinalSubmit = false) => {
        if (isSavedOrSubmitted) {
            alert("Data is already saved!");
            return;
        }

        if (isFinalSubmit && !validateFormData()) {
            return;
        }

        try {
            for (const row of tableData) {
                const formData = new FormData();

                formData.append("rowId", row.id);
                formData.append("s_n", row.s_n);

                // Permanent Document Name
                formData.append("item", row.point);

                // Permanent Description
                formData.append("currentStatus", row.description);

                formData.append("academicYear", academicYear);
                formData.append("department", department);
                formData.append("program", program);

                if (row.fileObject) {
                    formData.append("file", row.fileObject);
                }

                await axios.post(
                    `${API_BASE_URL}/submit`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            setIsSavedOrSubmitted(true);

            alert("Saved successfully! 💾");
        } catch (err) {
            console.error("Save error:", err);

            alert("Process Failed. Please try again.");
        }
    };

    /* =========================================================
       DELETE / CLEAR
    ========================================================= */

    const handleDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to clear table data from screen? (Database record will not be deleted)"
            )
        ) {
            resetTableForm();

            alert("Frontend data cleared!");
        }
    };

    const handleClear = () => {
        resetTableForm();
    };

    /* =========================================================
       READ FILE CONTENT
    ========================================================= */

    const readFileContentHTML = async (row) => {
        let fileBlob = row.fileObject;

        if (!fileBlob && row.fileName) {
            try {
                const response = await fetch(
                    `http://localhost:5000/uploads/${row.fileName}`
                );

                fileBlob = await response.blob();
            } catch (e) {
                console.error("File fetch failed:", e);

                return `
                    <p style="color:red;">
                        Error loading file from server.
                    </p>
                `;
            }
        }

        if (!fileBlob) {
            return "<p>No file available.</p>";
        }

        const ext = row.fileName
            ? row.fileName.split(".").pop().toLowerCase()
            : "";

        /* DOCX */

        if (ext === "docx") {
            try {
                const arrayBuffer = await fileBlob.arrayBuffer();

                const result = await mammoth.convertToHtml({
                    arrayBuffer,
                });

                return `
                    <div class="word-parsed-content">
                        ${result.value}
                    </div>
                `;
            } catch (err) {
                return `
                    <p style="color:red;">
                        Failed to parse Word file: ${err.message}
                    </p>
                `;
            }
        }

        /* EXCEL */

        if (["xlsx", "xls", "csv"].includes(ext)) {
            try {
                const arrayBuffer = await fileBlob.arrayBuffer();

                const workbook = XLSX.read(arrayBuffer, {
                    type: "array",
                });

                const firstSheetName = workbook.SheetNames[0];

                const worksheet =
                    workbook.Sheets[firstSheetName];

                const htmlTable =
                    XLSX.utils.sheet_to_html(worksheet);

                return `
                    <div class="excel-parsed-content">
                        ${htmlTable}
                    </div>
                `;
            } catch (err) {
                return `
                    <p style="color:red;">
                        Failed to parse Excel file: ${err.message}
                    </p>
                `;
            }
        }

        return null;
    };

    /* =========================================================
       PRINT UPLOADED FILES
    ========================================================= */

    const handlePrintUploadedFile = async () => {
        const uploadedRows = tableData.filter(
            (row) => row.fileObject || row.fileName
        );

        if (uploadedRows.length === 0) {
            alert("No uploaded files found to print!");
            return;
        }

        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            alert(
                "Please disable your browser's Pop-up blocker!"
            );
            return;
        }

        printWindow.document.write(`
            <html>
                <body>
                    <h3 style="
                        font-family:sans-serif;
                        text-align:center;
                        margin-top:50px;
                    ">
                        Processing uploaded files for preview...
                        Please wait.
                    </h3>
                </body>
            </html>
        `);

        const filesHTMLArray = [];

        for (const row of uploadedRows) {
            const fileURL = row.fileObject
                ? URL.createObjectURL(row.fileObject)
                : `http://localhost:5000/uploads/${row.fileName}`;

            const fileName =
                row.fileName || "Uploaded File";

            const ext = fileName
                .split(".")
                .pop()
                .toLowerCase();

            let previewHTML = "";

            /* PDF */

            if (ext === "pdf") {
                previewHTML = `
                    <embed
                        src="${fileURL}"
                        type="application/pdf"
                        class="embed-view"
                    />
                `;
            }

            /* IMAGE */

            else if (
                [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                    "svg",
                ].includes(ext)
            ) {
                previewHTML = `
                    <img
                        src="${fileURL}"
                        class="img-view"
                        alt="Uploaded Document"
                    />
                `;
            }

            /* WORD / EXCEL */

            else if (
                ["docx", "xlsx", "xls", "csv"].includes(ext)
            ) {
                const parsedHTML =
                    await readFileContentHTML(row);

                previewHTML = parsedHTML;
            }

            /* OTHER */

            else {
                previewHTML = `
                    <div style="
                        padding:15px;
                        border:1px dashed #718096;
                        background:#edf2f7;
                        border-radius:6px;
                    ">
                        <p>
                            <strong>File Name:</strong>
                            ${fileName}
                        </p>

                        <p style="
                            color:#e53e3e;
                            font-size:13px;
                        ">
                            Note: Older .doc files cannot be
                            rendered directly in browser.
                        </p>
                    </div>
                `;
            }

            filesHTMLArray.push(`
                <div class="file-container">

                    <div class="file-header">

                        <h2>
                            Document ${row.s_n}: ${row.point}
                        </h2>

                        <p>
                            <strong>Description:</strong>
                            ${row.description || "N/A"}
                        </p>

                        <p>
                            <strong>Uploaded File:</strong>
                            ${fileName}
                        </p>

                    </div>

                    <div class="file-content">
                        ${previewHTML}
                    </div>

                </div>
            `);
        }

        const filesHTML =
            filesHTMLArray.join(
                '<div class="page-break"></div>'
            );

        printWindow.document.open();

        printWindow.document.write(`
            <html>

                <head>

                    <title>
                        Criteria 7.2 - Additional Facilities Documents
                    </title>

                    <style>

                        body {
                            font-family:
                                'Segoe UI',
                                Arial,
                                sans-serif;

                            padding:20px;

                            color:#333;

                            background:#fff;

                            margin:0;
                        }

                        .main-header {
                            text-align:center;

                            border-bottom:
                                2px solid #0a2540;

                            padding-bottom:10px;

                            margin-bottom:20px;

                            page-break-after:avoid;
                        }

                        .file-container {
                            margin-bottom:20px;
                        }

                        .file-header {
                            background-color:#f7fafc;

                            padding:12px 16px;

                            border-radius:6px;

                            margin-bottom:15px;

                            border:
                                1px solid #e2e8f0;

                            border-left:
                                5px solid #0a2540;

                            page-break-after:avoid;
                        }

                        .file-header h2 {
                            margin:
                                0 0 6px 0;

                            font-size:16px;

                            color:#0a2540;
                        }

                        .file-header p {
                            margin:3px 0;

                            font-size:13px;

                            color:#4a5568;
                        }

                        .embed-view {
                            width:100%;

                            height:75vh;

                            border:
                                1px solid #cbd5e0;

                            border-radius:4px;
                        }

                        .img-view {
                            max-width:100%;

                            max-height:80vh;

                            display:block;

                            margin:0 auto;

                            border:
                                1px solid #cbd5e0;

                            border-radius:4px;
                        }

                        .word-parsed-content {
                            padding:20px;

                            border:
                                1px solid #cbd5e0;

                            background:#ffffff;

                            border-radius:6px;

                            line-height:1.6;

                            font-size:14px;
                        }

                        .excel-parsed-content {
                            overflow-x:auto;
                        }

                        .excel-parsed-content table {
                            width:100%;

                            border-collapse:collapse;

                            margin-top:10px;

                            font-size:13px;
                        }

                        .excel-parsed-content th,
                        .excel-parsed-content td {
                            border:
                                1px solid #cbd5e0;

                            padding:8px 10px;

                            text-align:left;
                        }

                        .page-break {
                            page-break-after:always;

                            height:0;

                            display:block;

                            clear:both;
                        }

                        @media print {

                            body {
                                padding:0;
                            }

                            .embed-view {
                                height:88vh;
                            }

                            .page-break {
                                page-break-after:always;
                            }

                        }

                    </style>

                </head>

                <body>

                    <div class="main-header">

                        <h2>
                            CRITERION 7:
                            FACILITIES AND TECHNICAL SUPPORT
                        </h2>

                        <h3>
                            7.2:
                            Additional Facilities Created for
                            Improving the Quality of Learning
                            Experience in Laboratories
                        </h3>

                    </div>

                    ${filesHTML}

                </body>

            </html>
        `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 1200);
    };

    /* =========================================================
       BUTTON STYLES
    ========================================================= */

    const buttonStyle = {
        padding: "7px 14px",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "13px",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const actionButtonStyle = {
        padding: "3px 8px",
        border: "none",
        borderRadius: "3px",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "11px",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "55px",
    };

    /* =========================================================
       RETURN
    ========================================================= */

    return (
        <div
            className="main-container-72"
            style={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
            }}
        >

            {/* SIDEBAR */}

            <div style={{ flexShrink: 0 }}>
                <NBASidebar />
            </div>

            {/* MAIN CONTENT */}

            <div
                className="criteria-main-layout-72"
                style={{
                    padding: "20px",
                    flex: 1,
                    overflowX: "hidden",
                }}
            >

                <div
                    className="container-72"
                    style={{
                        maxWidth: "100%",
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            backgroundColor: "#0a2540",
                            color: "#fff",
                            padding: "12px 20px",
                            borderRadius:
                                "6px 6px 0 0",
                            fontWeight: "bold",
                            fontSize: "15px",
                        }}
                    >
                        7.2 Additional Facilities Created for
                        Improving the Quality of Learning
                        Experience in Laboratories
                    </div>

                    {/* TABLE */}

                    <div
                        style={{
                            backgroundColor: "#fff",
                            border:
                                "1px solid #e2e8f0",
                            borderTop: "none",
                            borderRadius:
                                "0 0 6px 6px",
                            overflow: "hidden",
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                                tableLayout:
                                    "fixed",
                            }}
                        >

                            {/* TABLE HEADER */}

                            <thead>

                                <tr
                                    style={{
                                        backgroundColor:
                                            "#f8fafc",
                                        borderBottom:
                                            "1px solid #e2e8f0",
                                    }}
                                >

                                    {/* 7% */}

                                    <th
                                        style={{
                                            width: "7%",
                                            textAlign:
                                                "center",
                                            padding:
                                                "10px 6px",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            color:
                                                "#4a5568",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Sr. No.
                                    </th>

                                    {/* 32% */}

                                    <th
                                        style={{
                                            width: "32%",
                                            textAlign:
                                                "center",
                                            padding:
                                                "10px 6px",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            color:
                                                "#4a5568",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Document Name
                                    </th>

                                    {/* 35% */}

                                    <th
                                        style={{
                                            width: "35%",
                                            textAlign:
                                                "center",
                                            padding:
                                                "10px 6px",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            color:
                                                "#4a5568",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Description
                                    </th>

                                    {/* 26% */}

                                    <th
                                        style={{
                                            width: "26%",
                                            textAlign:
                                                "center",
                                            padding:
                                                "10px 6px",
                                            color:
                                                "#4a5568",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            {/* TABLE BODY */}

                            <tbody>

                                {tableData.map(
                                    (row) => (
                                        <tr
                                            key={
                                                row.id
                                            }
                                            style={{
                                                borderBottom:
                                                    "1px solid #e2e8f0",
                                            }}
                                        >

                                            {/* SR NO */}

                                            <td
                                                style={{
                                                    fontWeight:
                                                        "bold",
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "8px 4px",
                                                    borderRight:
                                                        "1px solid #edf2f7",
                                                    verticalAlign:
                                                        "middle",
                                                    fontSize:
                                                        "13px",
                                                }}
                                            >
                                                {
                                                    row.s_n
                                                }
                                            </td>

                                            {/* DOCUMENT NAME */}

                                            <td
                                                style={{
                                                    padding:
                                                        "8px",
                                                    borderRight:
                                                        "1px solid #edf2f7",
                                                    verticalAlign:
                                                        "middle",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width:
                                                            "100%",
                                                        minHeight:
                                                            "70px",
                                                        padding:
                                                            "10px",
                                                        border:
                                                            "1px solid #e2e8f0",
                                                        borderRadius:
                                                            "5px",
                                                        boxSizing:
                                                            "border-box",
                                                        backgroundColor:
                                                            "#fff",
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            "600",
                                                        color:
                                                            "#17365d",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                    }}
                                                >
                                                    {
                                                        row.point
                                                    }
                                                </div>

                                            </td>

                                            {/* DESCRIPTION */}

                                            <td
                                                style={{
                                                    padding:
                                                        "8px",
                                                    borderRight:
                                                        "1px solid #edf2f7",
                                                    verticalAlign:
                                                        "middle",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width:
                                                            "100%",
                                                        minHeight:
                                                            "70px",
                                                        padding:
                                                            "10px",
                                                        border:
                                                            "1px solid #e2e8f0",
                                                        borderRadius:
                                                            "5px",
                                                        boxSizing:
                                                            "border-box",
                                                        backgroundColor:
                                                            "#fff",
                                                        fontSize:
                                                            "12px",
                                                        color:
                                                            "#718096",
                                                        lineHeight:
                                                            "1.5",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                    }}
                                                >
                                                    {
                                                        row.description
                                                    }
                                                </div>

                                            </td>

                                            {/* ACTION COLUMN */}

                                            <td
                                                style={{
                                                    width: "25%",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                    padding: "10px 8px",
                                                    borderLeft: "1px solid #edf2f7",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "7px",
                                                        width: "100%",
                                                    }}
                                                >

                                                    {/* HIDDEN FILE INPUT */}

                                                    <input
                                                        type="file"
                                                        id={`file-input-72-${row.id}`}
                                                        style={{
                                                            display: "none",
                                                        }}
                                                        onChange={(e) =>
                                                            handleFileChange(
                                                                row.id,
                                                                e
                                                            )
                                                        }
                                                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv"
                                                    />

                                                    {/* CHOOSE FILE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    `file-input-72-${row.id}`
                                                                )
                                                                .click()
                                                        }
                                                        style={{
                                                            width: "210px",
                                                            maxWidth: "100%",
                                                            height: "38px",
                                                            backgroundColor:
                                                                "#ffffff",
                                                            border:
                                                                "1px solid #b8c9dd",
                                                            borderRadius:
                                                                "7px",
                                                            cursor:
                                                                "pointer",
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#172b4d",
                                                            padding:
                                                                "0 7px",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "flex-start",
                                                            overflow:
                                                                "hidden",
                                                            boxSizing:
                                                                "border-box",
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                background:
                                                                    "#f5f7fa",
                                                                border:
                                                                    "1px solid #cbd5e0",
                                                                borderRadius:
                                                                    "5px",
                                                                padding:
                                                                    "5px 8px",
                                                                marginRight:
                                                                    "7px",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            Choose File
                                                        </span>

                                                        <span
                                                            style={{
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                fontSize:
                                                                    "11px",
                                                                color:
                                                                    "#253858",
                                                            }}
                                                            title={
                                                                row.fileName ||
                                                                "No file chosen"
                                                            }
                                                        >
                                                            {row.fileName ||
                                                                "No file chosen"}
                                                        </span>

                                                    </button>

                                                    {/* FILE NAME */}

                                                    {row.fileName && (
                                                        <div
                                                            style={{
                                                                width:
                                                                    "210px",
                                                                maxWidth:
                                                                    "100%",
                                                                fontSize:
                                                                    "10px",
                                                                color:
                                                                    "#4a5568",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                textAlign:
                                                                    "left",
                                                                paddingLeft:
                                                                    "4px",
                                                            }}
                                                            title={
                                                                row.fileName
                                                            }
                                                        >
                                                            📄{" "}
                                                            {
                                                                row.fileName
                                                            }
                                                        </div>
                                                    )}

                                                    {/* VIEW + DOWNLOAD */}

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap:
                                                                "8px",
                                                            width:
                                                                "100%",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewFile(
                                                                    row
                                                                )
                                                            }
                                                            style={{
                                                                width:
                                                                    "105px",
                                                                minWidth:
                                                                    "105px",
                                                                height:
                                                                    "36px",
                                                                backgroundColor:
                                                                    "#2864e6",
                                                                color:
                                                                    "#ffffff",
                                                                border:
                                                                    "none",
                                                                borderRadius:
                                                                    "7px",
                                                                cursor:
                                                                    "pointer",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "600",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                gap:
                                                                    "6px",
                                                                boxShadow:
                                                                    "0 1px 2px rgba(0,0,0,0.08)",
                                                                flexShrink:
                                                                    0,
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "15px",
                                                                    lineHeight:
                                                                        "1",
                                                                }}
                                                            >
                                                                👁
                                                            </span>

                                                            View

                                                        </button>

                                                        {/* DOWNLOAD */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDownloadFile(
                                                                    row
                                                                )
                                                            }
                                                            style={{
                                                                width:
                                                                    "105px",
                                                                minWidth:
                                                                    "105px",
                                                                height:
                                                                    "36px",
                                                                backgroundColor:
                                                                    "#16a34a",
                                                                color:
                                                                    "#ffffff",
                                                                border:
                                                                    "none",
                                                                borderRadius:
                                                                    "7px",
                                                                cursor:
                                                                    "pointer",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "600",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                gap:
                                                                    "6px",
                                                                boxShadow:
                                                                    "0 1px 2px rgba(0,0,0,0.08)",
                                                                flexShrink:
                                                                    0,
                                                            }}
                                                        >

                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "16px",
                                                                    lineHeight:
                                                                        "1",
                                                                }}
                                                            >
                                                                ⬇
                                                            </span>

                                                            Download

                                                        </button>

                                                    </div>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* NAVIGATION / CONTROL BUTTONS */}

                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            flexWrap: "wrap",
                        }}
                    >

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            onClick={handlePrevious}
                            style={{
                                ...buttonStyle,
                                backgroundColor:
                                    "#E65100",
                            }}
                        >
                            Previous
                        </button>

                        {/* SAVE */}

                        <button
                            type="button"
                            onClick={() =>
                                saveToServer(false)
                            }
                            style={{
                                ...buttonStyle,
                                backgroundColor:
                                    "#2E7D32",
                            }}
                        >
                            Save
                        </button>

                        {/* DELETE */}

                        <button
                            type="button"
                            onClick={handleDelete}
                            style={{
                                ...buttonStyle,
                                backgroundColor:
                                    "#e53e3e",
                            }}
                        >
                            Delete
                        </button>

                        {/* PRINT */}

                        <button
                            type="button"
                            onClick={
                                handlePrintUploadedFile
                            }
                            style={{
                                ...buttonStyle,
                                backgroundColor:
                                    "#805ad5",
                            }}
                        >
                            Print
                        </button>

                        {/* CLEAR */}

                        <button
                            type="button"
                            onClick={handleClear}
                            style={{
                                ...buttonStyle,
                                backgroundColor:
                                    "#dd6b20",
                            }}
                        >
                            Clear
                        </button>

                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={handleNext}
                            style={{
                                ...buttonStyle,
                                backgroundColor:
                                    "#00695c",
                            }}
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Criteria7_2;