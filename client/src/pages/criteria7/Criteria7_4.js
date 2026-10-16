import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria7_4.css";

const Criteria7_4 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.4";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;
    const LOCAL_STORAGE_KEY = "criteria_7_4_draft_data";

    const [academicYear] = useState("2024-25");
    const [department] = useState("Computer Engineering");
    const [program] = useState("B.E. Computer Engineering");

    const [isSaved, setIsSaved] = useState(false);

    /* =========================
       PERMANENT DOCUMENT DATA
    ========================= */

    const getInitialTableData = () => [
        {
            id: 1,
            s_n: 1,
            point: "Basic safety measures",
            description:
                "Dos and don’ts, follow the dress code, maintain hygiene, learn emergency protocols, wear appropriate shoes, etc.",
            fileObject: null,
            fileName: null
        },
        {
            id: 2,
            s_n: 2,
            point: "Lab specific safety measure",
            description:
                "Lab-specific safety measures: gloves, safety mats, Miniature Circuit Breaker (MCB), etc.",
            fileObject: null,
            fileName: null
        }
    ];

    /* =========================
       INITIAL STATE
    ========================= */

    const [tableData, setTableData] = useState(() => {
        const savedLocal = localStorage.getItem(
            LOCAL_STORAGE_KEY
        );

        if (savedLocal) {
            try {
                const parsedData = JSON.parse(savedLocal);

                return getInitialTableData().map((defaultRow) => {
                    const savedRow = parsedData.find(
                        (row) =>
                            Number(row.id) ===
                            Number(defaultRow.id)
                    );

                    return {
                        ...defaultRow,
                        fileName:
                            savedRow?.fileName || null,
                        fileObject: null
                    };
                });
            } catch (error) {
                console.error(
                    "Error parsing local data:",
                    error
                );
            }
        }

        return getInitialTableData();
    });

    /* =========================
       LOCAL STORAGE
    ========================= */

    useEffect(() => {
        const cacheData = tableData.map((row) => ({
            id: row.id,
            s_n: row.s_n,
            point: row.point,
            description: row.description,
            fileName: row.fileName
        }));

        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(cacheData)
        );
    }, [tableData]);

    /* =========================
       FETCH SAVED DATA
    ========================= */

    useEffect(() => {
        const fetchSavedData = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/data`,
                    {
                        params: {
                            academicYear,
                            department,
                            program
                        }
                    }
                );

                if (
                    res.data &&
                    res.data.length > 0
                ) {
                    const defaultRows =
                        getInitialTableData();

                    const loadedData =
                        defaultRows.map(
                            (defaultRow) => {
                                const dbRow =
                                    res.data.find(
                                        (item) =>
                                            Number(
                                                item.row_id
                                            ) ===
                                                Number(
                                                    defaultRow.id
                                                ) ||
                                            Number(
                                                item.s_n
                                            ) ===
                                                Number(
                                                    defaultRow.s_n
                                                )
                                    );

                                return {
                                    ...defaultRow,
                                    fileName:
                                        dbRow?.file_name ||
                                        null,
                                    fileObject: null
                                };
                            }
                        );

                    setTableData(loadedData);
                    setIsSaved(true);
                }
            } catch (error) {
                console.error(
                    "Error fetching data from server:",
                    error
                );
            }
        };

        fetchSavedData();
    }, [
        API_BASE_URL,
        academicYear,
        department,
        program
    ]);

    /* =========================
       FILE CHANGE
    ========================= */

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];

        if (!file) return;

        setIsSaved(false);

        setTableData((prev) =>
            prev.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          fileName: file.name,
                          fileObject: file
                      }
                    : row
            )
        );
    };

    /* =========================
       VIEW FILE
    ========================= */

    const handleViewFile = (row) => {
        if (row.fileObject) {
            const fileURL =
                URL.createObjectURL(
                    row.fileObject
                );

            window.open(
                fileURL,
                "_blank"
            );

            return;
        }

        if (row.fileName) {
            window.open(
                `http://localhost:5000/uploads/${row.fileName}`,
                "_blank"
            );

            return;
        }

        alert(
            "No file uploaded for this document!"
        );
    };

    /* =========================
       DOWNLOAD FILE
    ========================= */

    const handleDownloadFile = (row) => {
        if (row.fileObject) {
            const fileURL =
                URL.createObjectURL(
                    row.fileObject
                );

            const link =
                document.createElement("a");

            link.href = fileURL;
            link.download =
                row.fileName ||
                "document";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(fileURL);

            return;
        }

        if (row.fileName) {
            const link =
                document.createElement("a");

            link.href =
                `http://localhost:5000/uploads/${row.fileName}`;

            link.download = row.fileName;
            link.target = "_blank";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return;
        }

        alert(
            "No file available for download!"
        );
    };

    /* =========================
       RESET / CLEAR
    ========================= */

    const resetTableForm = () => {
        setTableData(
            getInitialTableData()
        );

        localStorage.removeItem(
            LOCAL_STORAGE_KEY
        );

        setIsSaved(false);
    };

    /* =========================
       SAVE TO SERVER
    ========================= */

    const saveToServer = async () => {
        try {
            for (const row of tableData) {
                const formData =
                    new FormData();

                formData.append(
                    "rowId",
                    row.id
                );

                formData.append(
                    "s_n",
                    row.s_n
                );

                formData.append(
                    "item",
                    row.point
                );

                formData.append(
                    "currentStatus",
                    row.description
                );

                formData.append(
                    "academicYear",
                    academicYear
                );

                formData.append(
                    "department",
                    department
                );

                formData.append(
                    "program",
                    program
                );

                if (row.fileObject) {
                    formData.append(
                        "file",
                        row.fileObject
                    );
                }

                await axios.post(
                    `${API_BASE_URL}/submit`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );
            }

            setIsSaved(true);

            alert(
                "Saved successfully! 💾"
            );

            return true;
        } catch (error) {
            console.error(error);

            alert(
                "Process Failed. Please try again."
            );

            return false;
        }
    };

    /* =========================
       DELETE
    ========================= */

    const handleDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to clear data from frontend view?"
            )
        ) {
            resetTableForm();

            alert(
                "Data cleared successfully!"
            );
        }
    };

    /* =========================
       NAVIGATION
    ========================= */

    const handleNavigation = (
        targetPath
    ) => {
        navigate(targetPath);
    };

    /* =========================
       READ FILE CONTENT
    ========================= */

    const readFileContentHTML = async (
        row
    ) => {
        let fileBlob =
            row.fileObject;

        if (
            !fileBlob &&
            row.fileName
        ) {
            try {
                const response =
                    await fetch(
                        `http://localhost:5000/uploads/${row.fileName}`
                    );

                fileBlob =
                    await response.blob();
            } catch (error) {
                console.error(
                    "File fetch failed",
                    error
                );

                return `
                    <p style="color:red;">
                        Error loading file from server.
                    </p>
                `;
            }
        }

        if (!fileBlob) {
            return `
                <p>
                    No file available.
                </p>
            `;
        }

        const fileName =
            row.fileName ||
            (
                row.fileObject
                    ? row.fileObject.name
                    : ""
            );

        const ext =
            fileName
                .split(".")
                .pop()
                .toLowerCase();

        /* DOCX */

        if (ext === "docx") {
            try {
                const arrayBuffer =
                    await fileBlob.arrayBuffer();

                const result =
                    await mammoth.convertToHtml(
                        {
                            arrayBuffer
                        }
                    );

                return `
                    <div class="word-parsed-content">
                        ${result.value}
                    </div>
                `;
            } catch (error) {
                return `
                    <p style="color:red;">
                        Failed to parse Word file:
                        ${error.message}
                    </p>
                `;
            }
        }

        /* EXCEL */

        if (
            [
                "xlsx",
                "xls",
                "csv"
            ].includes(ext)
        ) {
            try {
                const arrayBuffer =
                    await fileBlob.arrayBuffer();

                const workbook =
                    XLSX.read(
                        arrayBuffer,
                        {
                            type: "array"
                        }
                    );

                const firstSheetName =
                    workbook.SheetNames[0];

                const worksheet =
                    workbook.Sheets[
                        firstSheetName
                    ];

                const htmlTable =
                    XLSX.utils.sheet_to_html(
                        worksheet
                    );

                return `
                    <div class="excel-parsed-content">
                        ${htmlTable}
                    </div>
                `;
            } catch (error) {
                return `
                    <p style="color:red;">
                        Failed to parse Excel file:
                        ${error.message}
                    </p>
                `;
            }
        }

        return null;
    };

    /* =========================
       PRINT
    ========================= */

    const handlePrintUploadedFile =
        async () => {
            const uploadedRows =
                tableData.filter(
                    (row) =>
                        row.fileObject ||
                        row.fileName
                );

            if (
                uploadedRows.length === 0
            ) {
                alert(
                    "No uploaded files found to print!"
                );

                return;
            }

            const printWindow =
                window.open(
                    "",
                    "_blank"
                );

            if (!printWindow) {
                alert(
                    "Please disable your browser's Pop-up blocker!"
                );

                return;
            }

            printWindow.document.write(`
                <html>
                    <body style="
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin-top: 50px;
                    ">
                        <h3>
                            Processing uploaded files for preview...
                            Please wait.
                        </h3>
                    </body>
                </html>
            `);

            const filesHTMLArray =
                [];

            for (
                let i = 0;
                i <
                uploadedRows.length;
                i++
            ) {
                const row =
                    uploadedRows[i];

                const fileURL =
                    row.fileObject
                        ? URL.createObjectURL(
                              row.fileObject
                          )
                        : `http://localhost:5000/uploads/${row.fileName}`;

                const fileName =
                    row.fileName ||
                    (
                        row.fileObject
                            ? row.fileObject.name
                            : "Uploaded File"
                    );

                const ext =
                    fileName
                        .split(".")
                        .pop()
                        .toLowerCase();

                let previewHTML =
                    "";

                if (
                    ext === "pdf"
                ) {
                    previewHTML = `
                        <embed
                            src="${fileURL}"
                            type="application/pdf"
                            class="embed-view"
                        />
                    `;
                } else if (
                    [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "webp",
                        "svg"
                    ].includes(ext)
                ) {
                    previewHTML = `
                        <img
                            src="${fileURL}"
                            class="img-view"
                            alt="Uploaded Document"
                        />
                    `;
                } else if (
                    [
                        "docx",
                        "xlsx",
                        "xls",
                        "csv"
                    ].includes(ext)
                ) {
                    const parsedHTML =
                        await readFileContentHTML(
                            row
                        );

                    previewHTML =
                        parsedHTML ||
                        "<p>Unable to render content.</p>";
                } else {
                    previewHTML = `
                        <div style="
                            padding:10px;
                            border:1px dashed #718096;
                            background:#edf2f7;
                            border-radius:4px;
                        ">
                            <p>
                                <strong>
                                    File Name:
                                </strong>
                                ${fileName}
                            </p>
                        </div>
                    `;
                }

                const isFirstItem =
                    i === 0;

                filesHTMLArray.push(`
                    <div class="file-container ${
                        !isFirstItem
                            ? "page-break-before"
                            : ""
                    }">

                        <div class="file-header">

                            <h2>
                                Document
                                ${row.s_n}:
                                ${row.point}
                            </h2>

                            <p>
                                <strong>
                                    Description:
                                </strong>
                                ${
                                    row.description ||
                                    "N/A"
                                }
                            </p>

                            <p>
                                <strong>
                                    Uploaded File:
                                </strong>
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
                filesHTMLArray.join("");

            printWindow.document.open();

            printWindow.document.write(`
                <html>

                <head>

                    <title>
                        Criteria 7.4 -
                        Project Laboratory and Safety Measures
                    </title>

                    <style>

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            font-family:
                                'Segoe UI',
                                Arial,
                                sans-serif;
                            padding: 12px;
                            color: #333;
                            background: #fff;
                            margin: 0;
                        }

                        .main-header {
                            text-align: center;
                            border-bottom:
                                2px solid #0a2540;
                            padding-bottom: 6px;
                            margin-bottom: 12px;
                        }

                        .main-header h2 {
                            margin: 0;
                            color: #0a2540;
                            font-size: 16px;
                        }

                        .file-container {
                            margin-bottom: 12px;
                        }

                        .page-break-before {
                            page-break-before: always;
                            break-before: page;
                        }

                        .file-header {
                            background-color:
                                #f7fafc;
                            padding: 8px 12px;
                            border-radius: 4px;
                            margin-bottom: 8px;
                            border:
                                1px solid #e2e8f0;
                            border-left:
                                4px solid #0a2540;
                        }

                        .embed-view {
                            width: 100%;
                            height: 70vh;
                            border:
                                1px solid #cbd5e0;
                        }

                        .img-view {
                            max-width: 100%;
                            max-height: 75vh;
                            display: block;
                            margin: 0 auto;
                        }

                        @media print {
                            body {
                                padding: 0;
                            }

                            .embed-view {
                                height: 82vh;
                            }

                            .page-break-before {
                                page-break-before: always;
                                break-before: page;
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
                            7.4:
                            Project Laboratory and Safety Measures
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

    return (
        <div
            style={{
                display: "flex",
                width: "100vw",
                minHeight: "100vh",
                backgroundColor: "#eef2f6"
            }}
        >

            {/* =========================
                SIDEBAR
            ========================= */}

            <div
                style={{
                    width: "250px",
                    flexShrink: 0
                }}
            >
                <NBASidebar />
            </div>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div
                style={{
                    flex: 1,
                    padding: "16px",
                    boxSizing: "border-box"
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        backgroundColor: "#0c1b40",
                        color: "#fff",
                        padding:
                            "10px 16px",
                        borderRadius:
                            "6px 6px 0 0",
                        fontWeight: "600",
                        fontSize: "14px"
                    }}
                >
                    7.4 Project Laboratory and Safety Measures
                </div>

                {/* CONTENT */}

                <div
                    style={{
                        backgroundColor:
                            "#fff",
                        border:
                            "1px solid #e2e8f0",
                        borderRadius:
                            "0 0 6px 6px",
                        padding: "12px",
                        boxShadow:
                            "0 1px 3px rgba(0,0,0,0.02)"
                    }}
                >

                    {/* =========================
                        TABLE
                    ========================= */}

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                            border:
                                "1px solid #cbd5e0"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    backgroundColor:
                                        "#dce8f5"
                                }}
                            >

                                <th
                                    style={{
                                        width: "6%",
                                        padding:
                                            "6px 4px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#0c1b40",
                                        fontWeight:
                                            "bold"
                                    }}
                                >
                                    Sr. No.
                                </th>

                                <th
                                    style={{
                                        width: "32%",
                                        padding:
                                            "6px 8px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#0c1b40",
                                        fontWeight:
                                            "bold"
                                    }}
                                >
                                    Document Name
                                </th>

                                <th
                                    style={{
                                        width: "42%",
                                        padding:
                                            "6px 8px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#0c1b40",
                                        fontWeight:
                                            "bold"
                                    }}
                                >
                                    Description / Details
                                </th>

                                <th
                                    style={{
                                        width: "20%",
                                        padding:
                                            "6px 8px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#0c1b40",
                                        fontWeight:
                                            "bold"
                                    }}
                                >
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {tableData.map(
                                (row) => (

                                    <tr
                                        key={row.id}
                                        style={{
                                            borderBottom:
                                                "1px solid #e2e8f0"
                                        }}
                                    >

                                        {/* SR NO */}

                                        <td
                                            style={{
                                                fontWeight:
                                                    "600",
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "4px",
                                                fontSize:
                                                    "12px",
                                                borderRight:
                                                    "1px solid #e2e8f0"
                                            }}
                                        >
                                            {row.s_n}
                                        </td>

                                        {/* DOCUMENT NAME */}

                                        <td
                                            style={{
                                                padding:
                                                    "6px",
                                                borderRight:
                                                    "1px solid #e2e8f0"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        "100%",
                                                    minHeight:
                                                        "38px",
                                                    padding:
                                                        "8px 10px",
                                                    border:
                                                        "1px solid #cbd5e0",
                                                    borderRadius:
                                                        "4px",
                                                    boxSizing:
                                                        "border-box",
                                                    fontSize:
                                                        "12px",
                                                    color:
                                                        "#1a202c",
                                                    fontWeight:
                                                        "600",
                                                    backgroundColor:
                                                        "#fff"
                                                }}
                                            >
                                                {row.point}
                                            </div>

                                        </td>

                                        {/* DESCRIPTION */}

                                        <td
                                            style={{
                                                padding:
                                                    "6px",
                                                borderRight:
                                                    "1px solid #e2e8f0"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        "100%",
                                                    minHeight:
                                                        "38px",
                                                    padding:
                                                        "8px 10px",
                                                    border:
                                                        "1px solid #cbd5e0",
                                                    borderRadius:
                                                        "4px",
                                                    boxSizing:
                                                        "border-box",
                                                    fontSize:
                                                        "12px",
                                                    color:
                                                        "#1a202c",
                                                    backgroundColor:
                                                        "#fff",
                                                    lineHeight:
                                                        "1.5"
                                                }}
                                            >
                                                {
                                                    row.description
                                                }
                                            </div>

                                        </td>

                                        {/* =========================
                                            ACTION - SAME AS 7.3
                                        ========================= */}

                                        <td
                                            style={{
                                                padding:
                                                    "8px",
                                                textAlign:
                                                    "center",
                                                verticalAlign:
                                                    "middle",
                                                backgroundColor:
                                                    "#f1f7fc"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    gap:
                                                        "8px"
                                                }}
                                            >

                                                {/* HIDDEN INPUT */}

                                                <input
                                                    type="file"
                                                    id={`file-input-74-${row.id}`}
                                                    style={{
                                                        display:
                                                            "none"
                                                    }}
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleFileChange(
                                                            row.id,
                                                            e
                                                        )
                                                    }
                                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv"
                                                />

                                                {/* CHOOSE FILE - 7.3 STYLE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                `file-input-74-${row.id}`
                                                            )
                                                            .click()
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 16px",
                                                        backgroundColor:
                                                            "#f4f7fa",
                                                        color:
                                                            "#1e293b",
                                                        border:
                                                            "1px solid #cbd5e0",
                                                        borderRadius:
                                                            "6px",
                                                        cursor:
                                                            "pointer",
                                                        fontWeight:
                                                            "500",
                                                        fontSize:
                                                            "14px",
                                                        minWidth:
                                                            "126px",
                                                        height:
                                                            "40px",
                                                        boxShadow:
                                                            "0 1px 2px rgba(0,0,0,0.05)"
                                                    }}
                                                >
                                                    Choose File
                                                </button>

                                                {/* FILE NAME - 7.3 STYLE */}

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "13px",
                                                        color:
                                                            "#94a3b8",
                                                        maxWidth:
                                                            "150px",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                        fontStyle:
                                                            "normal",
                                                        minHeight:
                                                            "16px"
                                                    }}
                                                >
                                                    {row.fileName
                                                        ? row.fileName
                                                        : "No file chosen"}
                                                </div>

                                                {/* VIEW + DOWNLOAD SAME LINE */}

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            "row",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        gap:
                                                            "8px",
                                                        width:
                                                            "100%"
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
                                                            padding:
                                                                "7px 13px",
                                                            backgroundColor:
                                                                "#3182ce",
                                                            color:
                                                                "#fff",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "4px",
                                                            cursor:
                                                                "pointer",
                                                            fontWeight:
                                                                "bold",
                                                            fontSize:
                                                                "14px",
                                                            minWidth:
                                                                "62px",
                                                            height:
                                                                "34px"
                                                        }}
                                                    >
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
                                                            padding:
                                                                "7px 12px",
                                                            backgroundColor:
                                                                "#38a169",
                                                            color:
                                                                "#fff",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "4px",
                                                            cursor:
                                                                "pointer",
                                                            fontWeight:
                                                                "bold",
                                                            fontSize:
                                                                "14px",
                                                            minWidth:
                                                                "103px",
                                                            height:
                                                                "34px"
                                                        }}
                                                    >
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

                    {/* =========================
                        BOTTOM BUTTONS
                    ========================= */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            flexWrap:
                                "wrap",
                            gap: "8px",
                            borderTop:
                                "1px solid #edf2f7",
                            paddingTop:
                                "10px",
                            marginTop:
                                "10px"
                        }}
                    >

                        {/* SAVE */}

                        <button
                            type="button"
                            onClick={
                                saveToServer
                            }
                            style={{
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#2E7D32",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
                            }}
                        >
                            Save
                        </button>

                        {/* DELETE */}

                        <button
                            type="button"
                            onClick={
                                handleDelete
                            }
                            style={{
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#e53e3e",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
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
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#805ad5",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
                            }}
                        >
                            Print
                        </button>

                        {/* CLEAR */}

                        <button
                            type="button"
                            onClick={
                                resetTableForm
                            }
                            style={{
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#dd6b20",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
                            }}
                        >
                            Clear
                        </button>

                        {/* BACK */}

                        <button
                            type="button"
                            onClick={() =>
                                handleNavigation(
                                    "/criteria/7.1"
                                )
                            }
                            style={{
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#2d3748",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
                            }}
                        >
                            Back
                        </button>

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            onClick={() =>
                                handleNavigation(
                                    "/criteria/7.3"
                                )
                            }
                            style={{
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#E65100",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
                            }}
                        >
                            Previous
                        </button>

                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={() =>
                                handleNavigation(
                                    "/criteria/7.5"
                                )
                            }
                            style={{
                                padding:
                                    "6px 14px",
                                backgroundColor:
                                    "#00695c",
                                color:
                                    "#fff",
                                border:
                                    "none",
                                borderRadius:
                                    "4px",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "bold",
                                fontSize:
                                    "12px"
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

export default Criteria7_4;