import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mammoth from "mammoth";
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria7_3.css";

const LOCAL_STORAGE_KEY = "criteria_7_3_draft_data";

const Criteria7_3 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.3";

    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;

    /* =========================================================
       HEADER DATA
    ========================================================= */

    const [academicYear] = useState("2024-25");
    const [department] = useState("Computer Engineering");
    const [program] = useState("B.E. Computer Engineering");

    const [isSaved, setIsSaved] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    /* =========================================================
       PERMANENT DOCUMENT NAMES + DESCRIPTIONS
    ========================================================= */

    const getInitialTableData = () => [
        {
            id: 1,
            s_n: 1,
            point: "Maintenance policy",
            description:
                "Regular maintenance and upkeep of facilities.",
            fileObject: null,
            fileName: null,
        },
        {
            id: 2,
            s_n: 2,
            point: "Corrective & preventive maintenance",
            description:
                "Regular prevention and timely correction of maintenance issues.",
            fileObject: null,
            fileName: null,
        },
        {
            id: 3,
            s_n: 3,
            point: "Overall ambience",
            description:
                "Clean and pleasant environment across the campus.",
            fileObject: null,
            fileName: null,
        },
    ];

    /* =========================================================
       TABLE DATA
    ========================================================= */

    const [tableData, setTableData] = useState(() => {
        const localDraft =
            localStorage.getItem(LOCAL_STORAGE_KEY);

        if (localDraft) {
            try {
                const parsed = JSON.parse(localDraft);

                if (
                    Array.isArray(parsed) &&
                    parsed.length > 0
                ) {
                    const permanentData =
                        getInitialTableData();

                    return permanentData.map((item) => {
                        const savedRow =
                            parsed.find(
                                (row) =>
                                    row.id === item.id
                            );

                        return {
                            ...item,
                            fileName:
                                savedRow?.fileName ||
                                null,
                            fileObject: null,
                        };
                    });
                }
            } catch (e) {
                console.error(
                    "Local draft parsing failed",
                    e
                );
            }
        }

        return getInitialTableData();
    });

    /* =========================================================
       FETCH SAVED DATA
    ========================================================= */

    useEffect(() => {
        const fetchSavedData = async () => {
            const localDraft =
                localStorage.getItem(
                    LOCAL_STORAGE_KEY
                );

            if (localDraft) return;

            try {
                const res = await axios.get(
                    `${API_BASE_URL}/data`,
                    {
                        params: {
                            academicYear,
                            department,
                            program,
                        },
                    }
                );

                if (
                    res.data &&
                    res.data.length > 0
                ) {
                    const permanentData =
                        getInitialTableData();

                    const loadedData =
                        permanentData.map(
                            (item, index) => {
                                const dbRow =
                                    res.data[index];

                                return {
                                    ...item,
                                    id: item.id,
                                    s_n: item.s_n,
                                    point: item.point,
                                    description:
                                        item.description,
                                    fileName:
                                        dbRow?.file_name ||
                                        null,
                                    fileObject: null,
                                };
                            }
                        );

                    setTableData(loadedData);

                    localStorage.setItem(
                        LOCAL_STORAGE_KEY,
                        JSON.stringify(
                            loadedData
                        )
                    );

                    setIsSaved(true);
                } else {
                    setTableData(
                        getInitialTableData()
                    );

                    setIsSaved(false);
                    setIsSubmitted(false);
                }
            } catch (err) {
                console.error(
                    "Error loading data:",
                    err
                );
            }
        };

        fetchSavedData();
    }, [
        API_BASE_URL,
        academicYear,
        department,
        program,
    ]);

    /* =========================================================
       LOCAL STORAGE
    ========================================================= */

    useEffect(() => {
        const serializableData =
            tableData.map((row) => ({
                ...row,
                fileObject: null,
            }));

        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(
                serializableData
            )
        );
    }, [tableData]);

    /* =========================================================
       FILE CHANGE
    ========================================================= */

    const handleFileChange = (
        id,
        event
    ) => {
        const file =
            event.target.files[0];

        if (file) {
            setIsSaved(false);
            setIsSubmitted(false);

            setTableData((prev) =>
                prev.map((row) =>
                    row.id === id
                        ? {
                              ...row,
                              fileName:
                                  file.name,
                              fileObject:
                                  file,
                          }
                        : row
                )
            );
        }
    };

    /* =========================================================
       VIEW FILE
    ========================================================= */

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

            setTimeout(() => {
                URL.revokeObjectURL(
                    fileURL
                );
            }, 5000);
        } else if (row.fileName) {
            window.open(
                `http://localhost:5000/uploads/${row.fileName}`,
                "_blank"
            );
        } else {
            alert(
                "No file uploaded for this document!"
            );
        }
    };

    /* =========================================================
       DOWNLOAD FILE
    ========================================================= */

    const handleDownloadFile = (
        row
    ) => {
        if (row.fileObject) {
            const fileURL =
                URL.createObjectURL(
                    row.fileObject
                );

            const link =
                document.createElement(
                    "a"
                );

            link.href = fileURL;
            link.download =
                row.fileName ||
                "document";

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            setTimeout(() => {
                URL.revokeObjectURL(
                    fileURL
                );
            }, 1000);
        } else if (row.fileName) {
            const link =
                document.createElement(
                    "a"
                );

            link.href =
                `http://localhost:5000/uploads/${row.fileName}`;

            link.download =
                row.fileName;

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );
        } else {
            alert(
                "No file available for download!"
            );
        }
    };

    /* =========================================================
       VALIDATION
    ========================================================= */

    const validateFormData = () => {
        for (const row of tableData) {
            if (
                !row.description.trim()
            ) {
                alert(
                    `Description is missing for Sr. No. ${row.s_n}.`
                );

                return false;
            }
        }

        return true;
    };

    /* =========================================================
       RESET
    ========================================================= */

    const resetTableForm = () => {
        const initial =
            getInitialTableData();

        setTableData(initial);

        localStorage.removeItem(
            LOCAL_STORAGE_KEY
        );

        setIsSaved(false);
        setIsSubmitted(false);
    };

    /* =========================================================
       SAVE TO SERVER
    ========================================================= */

    const saveToServer = async (
        isFinalSubmit = false
    ) => {
        if (
            isFinalSubmit &&
            isSubmitted
        ) {
            alert(
                "Data is already submitted! 🚀"
            );

            return;
        }

        if (
            !isFinalSubmit &&
            isSaved
        ) {
            alert(
                "Data is already saved as draft! 💾"
            );

            return;
        }

        if (
            isFinalSubmit &&
            !validateFormData()
        ) {
            return;
        }

        try {
            for (
                const row of tableData
            ) {
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
                                "multipart/form-data",
                        },
                    }
                );
            }

            if (isFinalSubmit) {
                setIsSubmitted(true);
                setIsSaved(true);

                alert(
                    "Data submitted successfully! 🚀"
                );
            } else {
                setIsSaved(true);

                alert(
                    "Saved successfully! 💾"
                );
            }
        } catch (err) {
            console.error(err);

            alert(
                "Process Failed. Please try again."
            );
        }
    };

    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to clear the frontend data?"
            )
        ) {
            resetTableForm();

            alert(
                "Frontend data cleared successfully!"
            );
        }
    };

    /* =========================================================
       CLEAR
    ========================================================= */

    const handleClear = () => {
        if (
            window.confirm(
                "Are you sure you want to clear all fields in the table?"
            )
        ) {
            resetTableForm();
        }
    };

    /* =========================================================
       DOCX READER
    ========================================================= */

    const extractDocxHTML =
        async (row) => {
            try {
                if (
                    row.fileObject &&
                    row.fileName
                        ?.toLowerCase()
                        .endsWith(".docx")
                ) {
                    const arrayBuffer =
                        await row.fileObject.arrayBuffer();

                    const result =
                        await mammoth.convertToHtml(
                            {
                                arrayBuffer:
                                    arrayBuffer,
                            }
                        );

                    return result.value;
                } else if (
                    row.fileName &&
                    row.fileName
                        .toLowerCase()
                        .endsWith(".docx")
                ) {
                    const fileUrl =
                        `http://localhost:5000/uploads/${row.fileName}`;

                    const response =
                        await fetch(
                            fileUrl
                        );

                    const arrayBuffer =
                        await response.arrayBuffer();

                    const result =
                        await mammoth.convertToHtml(
                            {
                                arrayBuffer:
                                    arrayBuffer,
                            }
                        );

                    return result.value;
                }
            } catch (error) {
                console.error(
                    "Error reading docx file:",
                    error
                );

                return `
                    <p style="color:red;">
                        <em>
                            Error reading Word document content.
                        </em>
                    </p>
                `;
            }

            return null;
        };

    /* =========================================================
       PRINT
    ========================================================= */

    const handlePrintUploadedFile =
        async () => {
            let cardsHTMLArray = [];

            for (
                const row of tableData
            ) {
                const fileURL =
                    row.fileObject
                        ? URL.createObjectURL(
                              row.fileObject
                          )
                        : row.fileName
                        ? `http://localhost:5000/uploads/${row.fileName}`
                        : null;

                const fileNameLower =
                    row.fileName
                        ? row.fileName.toLowerCase()
                        : "";

                const isPdf =
                    fileNameLower.endsWith(
                        ".pdf"
                    );

                const isImage =
                    fileNameLower.endsWith(
                        ".png"
                    ) ||
                    fileNameLower.endsWith(
                        ".jpg"
                    ) ||
                    fileNameLower.endsWith(
                        ".jpeg"
                    ) ||
                    fileNameLower.endsWith(
                        ".gif"
                    );

                const isDoc =
                    fileNameLower.endsWith(
                        ".doc"
                    ) ||
                    fileNameLower.endsWith(
                        ".docx"
                    );

                let renderContent = "";

                if (isDoc) {
                    const docHTML =
                        await extractDocxHTML(
                            row
                        );

                    if (docHTML) {
                        renderContent = `
                            <div class="docx-rendered-content">
                                ${docHTML}
                            </div>
                        `;
                    } else {
                        renderContent = `
                            <div class="file-info-box">
                                📄
                                <strong>
                                    Word Document Attached:
                                </strong>
                                ${row.fileName}
                            </div>
                        `;
                    }
                } else if (isPdf) {
                    renderContent = `
                        <div class="pdf-wrapper">

                            <object
                                data="${fileURL}#toolbar=0&navpanes=0"
                                type="application/pdf"
                                class="pdf-object"
                            >
                                <embed
                                    src="${fileURL}"
                                    type="application/pdf"
                                />
                            </object>

                            <p class="pdf-note">
                                📄
                                <strong>
                                    Attached PDF:
                                </strong>
                                ${row.fileName}
                            </p>

                        </div>
                    `;
                } else if (isImage) {
                    renderContent = `
                        <img
                            src="${fileURL}"
                            class="img-view"
                            alt="Uploaded Document"
                        />
                    `;
                } else if (fileURL) {
                    renderContent = `
                        <div class="file-info-box">
                            📎
                            <strong>
                                Attachment:
                            </strong>
                            ${row.fileName}
                        </div>
                    `;
                } else {
                    renderContent = `
                        <p class="no-file-text">
                            <em>
                                No document attached
                                for this point.
                            </em>
                        </p>
                    `;
                }

                const cardHTML = `
                    <div class="print-card">

                        <div class="card-header">
                            ${row.s_n}.
                            ${row.point}
                        </div>

                        <div class="card-details">

                            <p>
                                <strong>
                                    Description:
                                </strong>

                                ${
                                    row.description.trim()
                                        ? row.description
                                        : "N/A"
                                }
                            </p>

                            <p>
                                <strong>
                                    Attachment Name:
                                </strong>

                                ${
                                    row.fileName
                                        ? row.fileName
                                        : "None"
                                }
                            </p>

                        </div>

                        <div class="card-media">
                            ${renderContent}
                        </div>

                    </div>
                `;

                cardsHTMLArray.push(
                    cardHTML
                );
            }

            const printWindow =
                window.open(
                    "",
                    "_blank"
                );

            if (!printWindow) {
                alert(
                    "Pop-up blocker active! Please allow pop-ups for this site."
                );

                return;
            }

            printWindow.document.write(`
                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        Criteria 7.3 Complete Report
                    </title>

                    <style>

                        @page {
                            size: A4;
                            margin: 15mm;
                        }

                        *,
                        *:before,
                        *:after {
                            box-sizing:
                                border-box !important;
                        }

                        html,
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            background:
                                #ffffff !important;
                            font-family:
                                Arial,
                                sans-serif;
                            color: #000;
                        }

                        .header-title {
                            text-align: center;
                            border-bottom:
                                2px solid #000;
                            padding-bottom:
                                8px;
                            margin-bottom:
                                20px;
                        }

                        .header-title h2 {
                            margin: 0;
                            font-size: 18px;
                            text-transform:
                                uppercase;
                        }

                        .header-title h4 {
                            margin:
                                5px 0 0 0;
                            font-size: 14px;
                            font-weight:
                                normal;
                        }

                        .print-card {
                            border:
                                1px solid #000;
                            margin-bottom:
                                20px;
                            background:
                                #fff;
                            page-break-inside:
                                auto;
                        }

                        .card-header {
                            background-color:
                                #f0f0f0;
                            padding:
                                8px 12px;
                            font-weight:
                                bold;
                            font-size: 14px;
                            border-bottom:
                                1px solid #000;
                            page-break-after:
                                avoid;
                        }

                        .card-details {
                            padding:
                                10px 12px;
                            font-size: 13px;
                        }

                        .card-details p {
                            margin:
                                4px 0;
                            line-height:
                                1.4;
                        }

                        .card-media {
                            padding: 10px;
                            border-top:
                                1px solid #ccc;
                        }

                        .pdf-wrapper {
                            width: 100%;
                        }

                        .pdf-object {
                            width: 100%;
                            height: 1000px;
                            border:
                                1px solid #ccc;
                        }

                        .pdf-note {
                            font-size: 11px;
                            color: #444;
                            margin-top: 4px;
                        }

                        .img-view {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 0 auto;
                        }

                        .docx-rendered-content {
                            font-size: 12px;
                            padding: 8px;
                            line-height: 1.5;
                        }

                        .docx-rendered-content table {
                            width: 100% !important;
                            border-collapse:
                                collapse !important;
                        }

                        .docx-rendered-content td,
                        .docx-rendered-content th {
                            border:
                                1px solid #000 !important;
                            padding: 4px !important;
                        }

                        .file-info-box {
                            font-size: 13px;
                            padding:
                                8px 12px;
                            background:
                                #f9f9f9;
                            border:
                                1px solid #ccc;
                        }

                        .no-file-text {
                            font-size: 12px;
                            color: #666;
                            margin: 0;
                        }

                    </style>

                </head>

                <body>

                    <div class="header-title">

                        <h2>
                            CRITERION 7:
                            FACILITIES AND
                            TECHNICAL SUPPORT
                        </h2>

                        <h4>
                            7.3 Maintenance of
                            Laboratories and
                            Overall Ambiance
                        </h4>

                    </div>

                    ${cardsHTMLArray.join("")}

                </body>

                </html>
            `);

            printWindow.document.close();

            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 800);
        };

    /* =========================================================
       MAIN RETURN
    ========================================================= */

    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                overflowX: "hidden",
            }}
        >

            {/* SIDEBAR */}

            <div
                style={{
                    width: "250px",
                    flexShrink: 0,
                }}
            >
                <NBASidebar />
            </div>

            {/* MAIN CONTENT */}

            <div
                style={{
                    flex: 1,
                    padding: "16px",
                    boxSizing: "border-box",
                    overflowX: "hidden",
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        backgroundColor:
                            "#0f2942",
                        color: "#fff",
                        padding:
                            "10px 16px",
                        borderRadius:
                            "6px 6px 0 0",
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}
                >
                    7.3 Maintenance of
                    Laboratories and
                    Overall Ambiance
                </div>

                {/* TABLE CONTAINER */}

                <div
                    style={{
                        backgroundColor:
                            "#fff",
                        border:
                            "1px solid #cbd5e0",
                        borderTop:
                            "none",
                        borderRadius:
                            "0 0 6px 6px",
                        padding: "12px",
                        boxSizing:
                            "border-box",
                    }}
                >

                    {/* TABLE */}

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                            border:
                                "1px solid #e2e8f0",
                            tableLayout:
                                "fixed",
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    backgroundColor:
                                        "#f7fafc",
                                }}
                            >

                                <th
                                    style={{
                                        width: "5%",
                                        padding:
                                            "8px 4px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#4a5568",
                                        fontWeight:
                                            "500",
                                    }}
                                >
                                    Sr. No.
                                </th>

                                <th
                                    style={{
                                        width: "25%",
                                        padding:
                                            "8px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#4a5568",
                                        fontWeight:
                                            "500",
                                    }}
                                >
                                    Document Name
                                </th>

                                <th
                                    style={{
                                        width: "50%",
                                        padding:
                                            "8px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#4a5568",
                                        fontWeight:
                                            "500",
                                    }}
                                >
                                    Description / Details
                                </th>

                                <th
                                    style={{
                                        width: "20%",
                                        padding:
                                            "8px",
                                        border:
                                            "1px solid #cbd5e0",
                                        fontSize:
                                            "12px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#4a5568",
                                        fontWeight:
                                            "500",
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
                                                fontSize:
                                                    "12px",
                                                borderRight:
                                                    "1px solid #e2e8f0",
                                                verticalAlign:
                                                    "middle",
                                            }}
                                        >
                                            {row.s_n}
                                        </td>

                                        {/* DOCUMENT NAME */}

                                        <td
                                            style={{
                                                padding:
                                                    "8px",
                                                borderRight:
                                                    "1px solid #e2e8f0",
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
                                                {row.point}
                                            </div>

                                        </td>

                                        {/* DESCRIPTION */}

                                        <td
                                            style={{
                                                padding:
                                                    "8px",
                                                borderRight:
                                                    "1px solid #e2e8f0",
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

                                        {/* =================================================
                                            ACTION COLUMN
                                            VIEW + DOWNLOAD SAME ROW
                                        ================================================= */}

                                        <td
                                            style={{
                                                width: "20%",
                                                textAlign:
                                                    "center",
                                                verticalAlign:
                                                    "middle",
                                                padding:
                                                    "10px 8px",
                                                borderLeft:
                                                    "1px solid #edf2f7",
                                                backgroundColor:
                                                    "#f0f7ff",
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
                                                        "8px",
                                                    width:
                                                        "100%",
                                                }}
                                            >

                                                {/* HIDDEN FILE INPUT */}

                                                <input
                                                    type="file"
                                                    id={`file-input-73-${row.id}`}
                                                    style={{
                                                        display:
                                                            "none",
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

                                                {/* CHOOSE FILE */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                `file-input-73-${row.id}`
                                                            )
                                                            .click()
                                                    }
                                                    style={{
                                                        width:
                                                            "150px",
                                                        height:
                                                            "36px",
                                                        backgroundColor:
                                                            "#ffffff",
                                                        border:
                                                            "1px solid #b8c9dd",
                                                        borderRadius:
                                                            "6px",
                                                        cursor:
                                                            "pointer",
                                                        fontSize:
                                                            "12px",
                                                        color:
                                                            "#172b4d",
                                                        padding:
                                                            "0 8px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        boxSizing:
                                                            "border-box",
                                                        fontWeight:
                                                            "500",
                                                    }}
                                                >
                                                    Choose File
                                                </button>

                                                {/* FILE NAME */}

                                                <div
                                                    style={{
                                                        width:
                                                            "150px",
                                                        fontSize:
                                                            "10px",
                                                        color:
                                                            "#718096",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                        textAlign:
                                                            "center",
                                                        minHeight:
                                                            "14px",
                                                    }}
                                                    title={
                                                        row.fileName ||
                                                        "No file chosen"
                                                    }
                                                >
                                                    {row.fileName ||
                                                        "No file chosen"}
                                                </div>

                                                {/* VIEW + DOWNLOAD SAME ROW */}

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
                                                            "100%",
                                                        flexWrap:
                                                            "nowrap",
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
                                                                "72px",
                                                            height:
                                                                "34px",
                                                            backgroundColor:
                                                                "#2864e6",
                                                            color:
                                                                "#ffffff",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "6px",
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
                                                                "4px",
                                                            flexShrink:
                                                                0,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "14px",
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
                                                                "90px",
                                                            height:
                                                                "34px",
                                                            backgroundColor:
                                                                "#16a34a",
                                                            color:
                                                                "#ffffff",
                                                            border:
                                                                "none",
                                                            borderRadius:
                                                                "6px",
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
                                                                "4px",
                                                            flexShrink:
                                                                0,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "14px",
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

                    {/* =================================================
                        BOTTOM BUTTONS
                    ================================================= */}

                    <div
                        style={{
                            display:
                                "flex",
                            flexDirection:
                                "row",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            gap: "8px",
                            width:
                                "100%",
                            marginTop:
                                "16px",
                        }}
                    >

                        {/* SAVE */}

                        <button
                            type="button"
                            onClick={() =>
                                saveToServer(
                                    false
                                )
                            }
                            style={{
                                padding:
                                    "5px 14px",
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
                                    "11px",
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
                                    "5px 14px",
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
                                    "11px",
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
                                    "5px 14px",
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
                                    "11px",
                            }}
                        >
                            Print
                        </button>

                        {/* CLEAR */}

                        <button
                            type="button"
                            onClick={
                                handleClear
                            }
                            style={{
                                padding:
                                    "5px 14px",
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
                                    "11px",
                            }}
                        >
                            Clear
                        </button>

                        {/* BACK */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/criteria/7.1"
                                )
                            }
                            style={{
                                padding:
                                    "5px 14px",
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
                                    "11px",
                            }}
                        >
                            Back
                        </button>

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/criteria/7.2"
                                )
                            }
                            style={{
                                padding:
                                    "5px 14px",
                                backgroundColor:
                                    "#e65100",
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
                                    "11px",
                            }}
                        >
                            Previous
                        </button>

                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/criteria/7.4"
                                )
                            }
                            style={{
                                padding:
                                    "5px 14px",
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
                                    "11px",
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

export default Criteria7_3;