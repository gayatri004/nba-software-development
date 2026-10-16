import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria8_1.css";

const Criteria8_1 = () => {
    const navigate = useNavigate();

    const criteriaNo = "8";
    const subSection = "8.1";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;

    // Header States
    const [academicYear, setAcademicYear] = useState('2024-25');
    const [department, setDepartment] = useState('Computer Engineering');
    const [program, setProgram] = useState('B.E. Computer Engineering');

    // Active Table Step
    // 1 = 8.1.1
    // 2 = 8.1.2
    const [activeSection, setActiveSection] = useState(1);

    // Save Status Tracking States
    const [isSavedSection1, setIsSavedSection1] = useState(false);
    const [isSavedSection2, setIsSavedSection2] = useState(false);

    // =========================================================
    // 8.1.1 - FIXED DOCUMENT NAMES + FIXED DESCRIPTIONS
    // =========================================================

    const fixedTableData1 = [
        {
            id: 1,
            s_n: 1,
            documentName: 'CO Gap Identification Evidence',
            description: 'Core course files scrutinized to identify gaps and shortfalls.',
            details: 'Core course files scrutinized to identify gaps and shortfalls.',
            fileObject: null,
            fileName: null
        },
        {
            id: 2,
            s_n: 2,
            documentName: 'Plan of action to bridge the gaps / improvement',
            description: 'Course Outcome (CO) wise gaps and shortfalls identified.',
            details: 'Course Outcome (CO) wise gaps and shortfalls identified.',
            fileObject: null,
            fileName: null
        },
        {
            id: 3,
            s_n: 3,
            documentName: 'Implementation',
            description: 'Documentary evidence verified for each Course Outcome (CO).',
            details: 'Documentary evidence verified for each Course Outcome (CO).',
            fileObject: null,
            fileName: null
        }
    ];

    // =========================================================
    // 8.1.1 INITIAL DATA
    // =========================================================

    const getInitialTableData1 = () => {

        const localData =
            localStorage.getItem('criteria_8_1_1_table_data') ||
            localStorage.getItem('criteria8_1_table1');

        if (localData) {

            try {

                const savedData = JSON.parse(localData);

                return fixedTableData1.map((fixedRow) => {

                    const savedRow = savedData.find(
                        row => Number(row.id) === fixedRow.id
                    );

                    return {
                        ...fixedRow,

                        // Document name ALWAYS remains fixed
                        documentName: fixedRow.documentName,

                        // Description ALWAYS remains fixed
                        description: fixedRow.description,

                        details: fixedRow.details,

                        // Only file information is restored
                        fileName: savedRow?.fileName || null,
                        fileObject: null
                    };
                });

            } catch (e) {

                console.error(
                    "8.1.1 localStorage parse error:",
                    e
                );
            }
        }

        return fixedTableData1;
    };

    // =========================================================
    // 8.1.2 INITIAL DATA
    // IMPORTANT - UNCHANGED
    // =========================================================

    const getInitialTableData2 = () => {

        const localData =
            localStorage.getItem('criteria_8_1_2_table_data') ||
            localStorage.getItem('criteria8_1_table2');

        if (localData) {

            try {

                return JSON.parse(localData);

            } catch (e) {

                console.error(e);

            }
        }

        return [
            {
                id: 101,
                s_n: 1,
                point: 'Documentary evidences of identification of gaps in POs/PSOs attainment',
                description: '',
                details: '',
                fileObject: null,
                fileName: null
            },
            {
                id: 102,
                s_n: 2,
                point: 'Plan of action to bridge the gaps / improvement',
                description: '',
                details: '',
                fileObject: null,
                fileName: null
            },
            {
                id: 103,
                s_n: 3,
                point: 'Implementation',
                description: '',
                details: '',
                fileObject: null,
                fileName: null
            }
        ];
    };

    const [tableData1, setTableData1] =
        useState(getInitialTableData1());

    const [tableData2, setTableData2] =
        useState(getInitialTableData2());

    // =========================================================
    // SYNC 8.1.1 TO LOCAL STORAGE
    // =========================================================

    useEffect(() => {

        const cleanData = tableData1.map((row, index) => {

            const fixedRow = fixedTableData1[index];

            return {
                ...row,

                documentName:
                    fixedRow?.documentName ||
                    row.documentName,

                description:
                    fixedRow?.description ||
                    row.description,

                details:
                    fixedRow?.details ||
                    row.details,

                fileObject: null
            };
        });

        localStorage.setItem(
            'criteria8_1_table1',
            JSON.stringify(cleanData)
        );

        localStorage.setItem(
            'criteria_8_1_1_table_data',
            JSON.stringify(cleanData)
        );

    }, [tableData1]);

    // =========================================================
    // SYNC 8.1.2 TO LOCAL STORAGE
    // IMPORTANT - UNCHANGED
    // =========================================================

    useEffect(() => {

        const cleanData = tableData2.map(row => ({
            ...row,
            details:
                row.description ||
                row.details ||
                '',
            fileObject: null
        }));

        localStorage.setItem(
            'criteria8_1_table2',
            JSON.stringify(cleanData)
        );

        localStorage.setItem(
            'criteria_8_1_2_table_data',
            JSON.stringify(cleanData)
        );

    }, [tableData2]);

    // =========================================================
    // LOAD SAVED DATA
    // =========================================================

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

                    // =================================================
                    // 8.1.1
                    // Document Name + Description remain fixed
                    // =================================================

                    setTableData1(prev =>
                        prev.map(row => {

                            const dbRow =
                                res.data.find(
                                    d =>
                                        Number(d.row_id) ===
                                        row.id
                                );

                            const fixedRow =
                                fixedTableData1.find(
                                    item =>
                                        item.id === row.id
                                );

                            return dbRow
                                ? {
                                    ...row,

                                    documentName:
                                        fixedRow?.documentName ||
                                        row.documentName,

                                    description:
                                        fixedRow?.description ||
                                        row.description,

                                    details:
                                        fixedRow?.details ||
                                        row.details,

                                    fileName:
                                        dbRow.file_name ||
                                        null,

                                    fileObject: null
                                }
                                : row;
                        })
                    );

                    // =================================================
                    // 8.1.2
                    // ORIGINAL BEHAVIOUR
                    // =================================================

                    setTableData2(prev =>
                        prev.map(row => {

                            const dbRow =
                                res.data.find(
                                    d =>
                                        Number(d.row_id) ===
                                        row.id
                                );

                            return dbRow
                                ? {
                                    ...row,
                                    description:
                                        dbRow.details || '',
                                    fileName:
                                        dbRow.file_name ||
                                        null,
                                    fileObject: null
                                }
                                : row;
                        })
                    );
                }

            } catch (err) {

                console.error(
                    "डेटा लोड करताना एरर आली:",
                    err
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

    // =========================================================
    // DESCRIPTION CHANGE
    // 8.1.1 = FIXED
    // 8.1.2 = EDITABLE
    // =========================================================

    const handleInputChange = (
        id,
        value,
        tableNum
    ) => {

        if (tableNum === 1) {

            // 8.1.1 description is permanent
            return;

        } else {

            // 8.1.2 remains editable
            setTableData2(prev =>
                prev.map(row =>
                    row.id === id
                        ? {
                            ...row,
                            description: value,
                            details: value
                        }
                        : row
                )
            );

            setIsSavedSection2(false);
        }
    };

    // =========================================================
    // DOCUMENT NAME / POINT CHANGE
    // 8.1.1 = FIXED
    // 8.1.2 = EDITABLE
    // =========================================================

    const handlePointChange = (
        id,
        value,
        tableNum
    ) => {

        if (tableNum === 1) {

            // 8.1.1 document name is permanent
            return;

        } else {

            // 8.1.2 point remains editable
            setTableData2(prev =>
                prev.map(row =>
                    row.id === id
                        ? {
                            ...row,
                            point: value
                        }
                        : row
                )
            );

            setIsSavedSection2(false);
        }
    };

    // =========================================================
    // FILE CHANGE
    // =========================================================

    const handleFileChange = (
        id,
        event,
        tableNum
    ) => {

        const file =
            event.target.files[0];

        if (!file) return;

        if (tableNum === 1) {

            setTableData1(prev =>
                prev.map(row =>
                    row.id === id
                        ? {
                            ...row,
                            fileName: file.name,
                            fileObject: file
                        }
                        : row
                )
            );

            setIsSavedSection1(false);

        } else {

            setTableData2(prev =>
                prev.map(row =>
                    row.id === id
                        ? {
                            ...row,
                            fileName: file.name,
                            fileObject: file
                        }
                        : row
                )
            );

            setIsSavedSection2(false);
        }
    };

    // =========================================================
    // ADD ROW
    //
    // 8.1.1 -> NO ADD ROW
    // 8.1.2 -> ORIGINAL ADD ROW
    // =========================================================

    const handleAddRow = (tableNum) => {

        // 8.1.1 does NOT allow new rows
        if (tableNum === 1) {
            return;
        }

        // 8.1.2 original dynamic row logic
        const nextSn =
            tableData2.length + 1;

        const newRow = {
            id: Date.now() + 100,
            s_n: nextSn,
            point: `New Point ${nextSn}`,
            description: '',
            details: '',
            fileObject: null,
            fileName: null
        };

        setTableData2([
            ...tableData2,
            newRow
        ]);

        setIsSavedSection2(false);
    };

    // =========================================================
    // VIEW FILE
    // =========================================================

    const handleViewFile = (row) => {

        if (row.fileObject) {

            const fileURL =
                URL.createObjectURL(
                    row.fileObject
                );

            window.open(
                fileURL,
                '_blank'
            );

        } else if (row.fileName) {

            window.open(
                `http://localhost:5000/uploads/${row.fileName}`,
                '_blank'
            );

        } else {

            alert(
                "No file uploaded for this point!"
            );
        }
    };

    // =========================================================
    // DOWNLOAD FILE
    // =========================================================

    const handleDownloadFile = (row) => {

        if (row.fileObject) {

            const fileURL =
                URL.createObjectURL(
                    row.fileObject
                );

            const link =
                document.createElement('a');

            link.href =
                fileURL;

            link.download =
                row.fileName ||
                row.fileObject.name;

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

        } else if (row.fileName) {

            window.open(
                `http://localhost:5000/uploads/${row.fileName}`,
                '_blank'
            );

        } else {

            alert(
                "No file available for download!"
            );
        }
    };

    // =========================================================
    // CLEAR FORM
    // =========================================================

    const handleClear = () => {

        if (
            !window.confirm(
                "Are you sure you want to clear the form?"
            )
        ) {
            return;
        }

        if (activeSection === 1) {

            localStorage.removeItem(
                'criteria8_1_table1'
            );

            localStorage.removeItem(
                'criteria_8_1_1_table_data'
            );

            setTableData1(
                fixedTableData1.map(row => ({
                    ...row,
                    fileObject: null,
                    fileName: null
                }))
            );

            setIsSavedSection1(false);

        } else {

            localStorage.removeItem(
                'criteria8_1_table2'
            );

            localStorage.removeItem(
                'criteria_8_1_2_table_data'
            );

            setTableData2([
                {
                    id: 101,
                    s_n: 1,
                    point:
                        'Documentary evidences of identification of gaps in POs/PSOs attainment',
                    description: '',
                    details: '',
                    fileObject: null,
                    fileName: null
                },
                {
                    id: 102,
                    s_n: 2,
                    point:
                        'Plan of action to bridge the gaps / improvement',
                    description: '',
                    details: '',
                    fileObject: null,
                    fileName: null
                },
                {
                    id: 103,
                    s_n: 3,
                    point:
                        'Implementation',
                    description: '',
                    details: '',
                    fileObject: null,
                    fileName: null
                }
            ]);

            setIsSavedSection2(false);
        }
    };

    // =========================================================
    // SAVE TO SERVER
    // =========================================================

    const saveToServer = async () => {

        const isCurrentSec1 =
            activeSection === 1;

        const isAlreadySaved =
            isCurrentSec1
                ? isSavedSection1
                : isSavedSection2;

        if (isAlreadySaved) {

            alert(
                "The data for this section is already saved as a draft!"
            );

            return;
        }

        const currentData =
            isCurrentSec1
                ? tableData1
                : tableData2;

        try {

            for (
                const row
                of currentData
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

                // 8.1.1 -> Document Name
                // 8.1.2 -> Point

                if (isCurrentSec1) {

                    formData.append(
                        "item",
                        row.documentName
                    );

                } else {

                    formData.append(
                        "item",
                        row.point
                    );
                }

                formData.append(
                    "details",
                    row.description ||
                    row.details ||
                    ''
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

                formData.append(
                    "section",
                    activeSection
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

            if (isCurrentSec1) {

                setIsSavedSection1(true);

            } else {

                setIsSavedSection2(true);
            }

            alert(
                "Saved successfully! 💾"
            );

        } catch (err) {

            console.error(err);

            alert(
                "Process Failed. Please try again."
            );
        }
    };

    // =========================================================
    // DELETE DATA
    // =========================================================

    const handleDelete = () => {

        if (
            !window.confirm(
                "Are you sure you want to clear the screen data and local cache?"
            )
        ) {
            return;
        }

        if (activeSection === 1) {

            localStorage.removeItem(
                'criteria8_1_table1'
            );

            localStorage.removeItem(
                'criteria_8_1_1_table_data'
            );

            setTableData1(
                fixedTableData1.map(row => ({
                    ...row,
                    fileObject: null,
                    fileName: null
                }))
            );

            setIsSavedSection1(false);

        } else {

            localStorage.removeItem(
                'criteria8_1_table2'
            );

            localStorage.removeItem(
                'criteria_8_1_2_table_data'
            );

            setTableData2([
                {
                    id: 101,
                    s_n: 1,
                    point:
                        'Documentary evidences of identification of gaps in POs/PSOs attainment',
                    description: '',
                    details: '',
                    fileObject: null,
                    fileName: null
                },
                {
                    id: 102,
                    s_n: 2,
                    point:
                        'Plan of action to bridge the gaps / improvement',
                    description: '',
                    details: '',
                    fileObject: null,
                    fileName: null
                },
                {
                    id: 103,
                    s_n: 3,
                    point:
                        'Implementation',
                    description: '',
                    details: '',
                    fileObject: null,
                    fileName: null
                }
            ]);

            setIsSavedSection2(false);
        }

        alert(
            "Data cleared from screen and local cache!"
        );
    };

    // =========================================================
    // READ FILE CONTENT
    // =========================================================

    const readFileContentHTML = async (row) => {

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

                if (!response.ok) {

                    return `
                        <p style="color:red;">
                            File missing on server:
                            ${row.fileName}
                        </p>
                    `;
                }

                fileBlob =
                    await response.blob();

            } catch (e) {

                console.error(
                    "File fetch failed",
                    e
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
                <p>No file available.</p>
            `;
        }

        const ext =
            row.fileName
                ? row.fileName
                    .split('.')
                    .pop()
                    .toLowerCase()
                : '';

        // DOCX
        if (ext === 'docx') {

            try {

                const arrayBuffer =
                    await fileBlob.arrayBuffer();

                const result =
                    await mammoth.convertToHtml({
                        arrayBuffer:
                            arrayBuffer
                    });

                return `
                    <div class="word-parsed-content">
                        ${result.value}
                    </div>
                `;

            } catch (err) {

                return `
                    <p style="color:red;">
                        Failed to parse Word file:
                        ${err.message}
                    </p>
                `;
            }
        }

        // EXCEL / CSV
        if (
            [
                'xlsx',
                'xls',
                'csv'
            ].includes(ext)
        ) {

            try {

                const arrayBuffer =
                    await fileBlob.arrayBuffer();

                const workbook =
                    XLSX.read(
                        arrayBuffer,
                        {
                            type: 'array'
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

            } catch (err) {

                return `
                    <p style="color:red;">
                        Failed to parse Excel file:
                        ${err.message}
                    </p>
                `;
            }
        }

        return null;
    };

    // =========================================================
    // PRINT UPLOADED FILES
    // =========================================================

    const handlePrintUploadedFile = async () => {

        const currentRows =
            activeSection === 1
                ? tableData1
                : tableData2;

        const uploadedRows =
            currentRows.filter(
                row =>
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
                '',
                '_blank'
            );

        if (!printWindow) {

            alert(
                "Please disable your browser's Pop-up blocker!"
            );

            return;
        }

        printWindow.document.write(`
            <html>
                <body
                    style="
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin-top: 50px;
                    "
                >
                    <h3>
                        Processing uploaded files
                        for preview... Please wait.
                    </h3>
                </body>
            </html>
        `);

        const filesHTMLArray = [];

        for (
            const row
            of uploadedRows
        ) {

            const fileURL =
                row.fileObject
                    ? URL.createObjectURL(
                        row.fileObject
                    )
                    : `http://localhost:5000/uploads/${row.fileName}`;

            const fileName =
                row.fileName ||
                "Uploaded File";

            const ext =
                fileName
                    .split('.')
                    .pop()
                    .toLowerCase();

            let previewHTML = '';

            if (ext === 'pdf') {

                previewHTML = `
                    <embed
                        src="${fileURL}"
                        type="application/pdf"
                        class="embed-view"
                    />
                `;

            } else if (
                [
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                    'webp',
                    'svg'
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
                    'docx',
                    'xlsx',
                    'xls',
                    'csv'
                ].includes(ext)
            ) {

                const parsedHTML =
                    await readFileContentHTML(
                        row
                    );

                previewHTML =
                    parsedHTML;

            } else {

                previewHTML = `
                    <div
                        style="
                            padding:15px;
                            border:1px dashed #718096;
                            background:#edf2f7;
                            border-radius:6px;
                        "
                    >
                        <p>
                            <strong>
                                File Name:
                            </strong>
                            ${fileName}
                        </p>
                    </div>
                `;
            }

            const displayName =
                activeSection === 1
                    ? row.documentName
                    : row.point;

            filesHTMLArray.push(`
                <div class="file-container">

                    <div class="file-header">

                        <h2>
                            ${
                                activeSection === 1
                                    ? 'Document'
                                    : 'Point'
                            }
                            ${row.s_n}:
                            ${displayName}
                        </h2>

                        <p>
                            <strong>
                                Description:
                            </strong>
                            ${
                                row.description ||
                                row.details ||
                                'N/A'
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
            filesHTMLArray.join(
                '<div class="page-break"></div>'
            );

        printWindow.document.open();

        printWindow.document.write(`
            <html>

            <head>

                <title>
                    Criteria 8.1 -
                    Continuous Improvement Documents
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

                    .main-header h2 {
                        margin:0;
                        color:#0a2540;
                        font-size:18px;
                    }

                    .main-header h3 {
                        margin:5px 0 0 0;
                        color:#4a5568;
                        font-size:14px;
                        font-weight:500;
                    }

                    .file-container {
                        margin-bottom:20px;
                    }

                    .file-header {
                        background-color:#f7fafc;
                        padding:12px 16px;
                        border-radius:6px;
                        margin-bottom:15px;
                        border:1px solid #e2e8f0;
                        border-left:
                            5px solid #0a2540;
                        page-break-after:avoid;
                    }

                    .file-header h2 {
                        margin:0 0 6px 0;
                        font-size:15px;
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

                </style>

            </head>

            <body>

                <div class="main-header">

                    <h2>
                        CRITERION 8:
                        CONTINUOUS IMPROVEMENT
                    </h2>

                    <h3>
                        8.1: Actions Taken Based
                        on the Results of Evaluation
                        of the COs, POs and PSOs
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

    // =========================================================
    // TABLE RENDER FUNCTION
    // =========================================================

    const renderTable = (
        tableData,
        tableNum
    ) => (

        <div>

            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #cbd5e0',
                    fontSize: '12px'
                }}
            >

                <thead>

                    <tr
                        style={{
                            backgroundColor: '#f1f5f9',
                            color: '#1e293b',
                            borderBottom:
                                '2px solid #cbd5e0'
                        }}
                    >

                        <th
                            style={{
                                width: '6%',
                                padding: '6px 4px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#0a2540'
                            }}
                        >
                            Sr. No.
                        </th>

                        {/* =============================================
                            8.1.1 -> Document Name
                            8.1.2 -> Point
                        ============================================= */}

                        <th
                            style={{
                                width: '30%',
                                padding: '6px 8px',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                color: '#0a2540'
                            }}
                        >
                            {tableNum === 1
                                ? 'Document Name'
                                : 'Point'
                            }
                        </th>

                        <th
                            style={{
                                width: '36%',
                                padding: '6px 8px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#0a2540'
                            }}
                        >
                            Description / Details
                        </th>

                        <th
                            style={{
                                width: '28%',
                                padding: '6px 6px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#0a2540'
                            }}
                        >
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {tableData.map(row => (

                        <tr
                            key={row.id}
                            style={{
                                borderBottom:
                                    '1px solid #e2e8f0'
                            }}
                        >

                            {/* SR NO */}

                            <td
                                style={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    padding: '6px 4px',
                                    color: '#2d3748',
                                    verticalAlign: 'middle'
                                }}
                            >
                                {row.s_n}
                            </td>

                            {/* =========================================
                                DOCUMENT NAME / POINT
                            ========================================= */}

                            <td
                                style={{
                                    padding: '6px 8px',
                                    color: '#2d3748',
                                    verticalAlign: 'middle'
                                }}
                            >

                                {tableNum === 1 ? (

                                    /* 8.1.1 - FIXED DOCUMENT NAME */

                                    <input
                                        type="text"
                                        value={
                                            row.documentName
                                        }
                                        readOnly
                                        style={{
                                            width: '100%',
                                            padding: '4px 6px',
                                            border:
                                                '1px solid #cbd5e0',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#fff',
                                            color: '#2d3748',
                                            cursor: 'default',
                                            boxSizing: 'border-box'
                                        }}
                                    />

                                ) : (

                                    /* 8.1.2 - ORIGINAL EDITABLE POINT */

                                    <input
                                        type="text"
                                        value={
                                            row.point
                                        }
                                        onChange={e =>
                                            handlePointChange(
                                                row.id,
                                                e.target.value,
                                                tableNum
                                            )
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '4px 6px',
                                            border:
                                                '1px solid #cbd5e0',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}
                                    />

                                )}

                            </td>

                            {/* =========================================
                                DESCRIPTION
                            ========================================= */}

                            <td
                                style={{
                                    padding: '6px 8px',
                                    verticalAlign: 'middle'
                                }}
                            >

                                {tableNum === 1 ? (

                                    /* 8.1.1 - FIXED DESCRIPTION */

                                    <textarea
                                        rows="2"
                                        value={
                                            row.description
                                        }
                                        readOnly
                                        style={{
                                            width: '100%',
                                            height: '68px',
                                            padding: '8px 10px',
                                            border:
                                                '1px solid #cbd5e0',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            fontSize: '12px',
                                            boxSizing: 'border-box',
                                            outline: 'none',
                                            backgroundColor: '#fff',
                                            color: '#2d3748',
                                            cursor: 'default'
                                        }}
                                    />

                                ) : (

                                    /* 8.1.2 - ORIGINAL EDITABLE DESCRIPTION */

                                    <textarea
                                        rows="2"
                                        value={
                                            row.description
                                        }
                                        onChange={e =>
                                            handleInputChange(
                                                row.id,
                                                e.target.value,
                                                tableNum
                                            )
                                        }
                                        placeholder="Enter description here..."
                                        style={{
                                            width: '100%',
                                            height: '34px',
                                            padding: '4px 6px',
                                            border:
                                                '1px solid #cbd5e0',
                                            borderRadius: '4px',
                                            resize: 'vertical',
                                            fontSize: '12px',
                                            boxSizing: 'border-box',
                                            outline: 'none'
                                        }}
                                    />

                                )}

                            </td>

                            {/* =========================================
                                ACTION
                            ========================================= */}

                            <td
                                style={{
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    padding: '6px 6px'
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >

                                    <input
                                        type="file"
                                        id={`file-input-${tableNum}-${row.id}`}
                                        style={{
                                            display: 'none'
                                        }}
                                        onChange={e =>
                                            handleFileChange(
                                                row.id,
                                                e,
                                                tableNum
                                            )
                                        }
                                        accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.xls,.csv"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    `file-input-${tableNum}-${row.id}`
                                                )
                                                .click()
                                        }
                                        style={{
                                            padding: '3px 10px',
                                            backgroundColor:
                                                '#f8fafc',
                                            border:
                                                '1px solid #cbd5e0',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            color: '#2d3748'
                                        }}
                                    >
                                        Choose File
                                    </button>

                                    <div
                                        style={{
                                            width: '100%',
                                            textAlign: 'center'
                                        }}
                                    >

                                        {row.fileName ? (

                                            <span
                                                style={{
                                                    fontSize: '10.5px',
                                                    color: '#2b6cb0',
                                                    display: 'block',
                                                    maxWidth: '160px',
                                                    margin: '0 auto',
                                                    overflow: 'hidden',
                                                    textOverflow:
                                                        'ellipsis',
                                                    whiteSpace:
                                                        'nowrap'
                                                }}
                                                title={
                                                    row.fileName
                                                }
                                            >
                                                📄 {row.fileName}
                                            </span>

                                        ) : (

                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    color: '#a0aec0',
                                                    fontStyle:
                                                        'italic',
                                                    display: 'block'
                                                }}
                                            >
                                                No file chosen
                                            </span>

                                        )}

                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '4px',
                                            justifyContent:
                                                'center',
                                            marginTop: '2px'
                                        }}
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewFile(
                                                    row
                                                )
                                            }
                                            style={{
                                                padding:
                                                    '2px 10px',
                                                backgroundColor:
                                                    '#3182ce',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            View
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDownloadFile(
                                                    row
                                                )
                                            }
                                            style={{
                                                padding:
                                                    '2px 10px',
                                                backgroundColor:
                                                    '#38a169',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Download
                                        </button>

                                    </div>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {/* =====================================================
                ADD ROW
                ONLY FOR 8.1.2
            ===================================================== */}

            {tableNum === 2 && (

                <div
                    style={{
                        marginTop: '8px',
                        marginBottom: '8px'
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            handleAddRow(
                                tableNum
                            )
                        }
                        style={{
                            padding: '4px 10px',
                            backgroundColor: '#4a5568',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11.5px',
                            fontWeight: 'bold'
                        }}
                    >
                        ➕ Add Row
                    </button>

                </div>

            )}

        </div>
    );

    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div
            style={{
                display: 'flex',
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: '#f8fafc'
            }}
        >

            {/* SIDEBAR */}

            <div
                style={{
                    width: '250px',
                    flexShrink: 0
                }}
            >
                <NBASidebar />
            </div>

            {/* MAIN CONTENT */}

            <div
                style={{
                    flex: 1,
                    padding: '15px',
                    boxSizing: 'border-box'
                }}
            >

                {/* TOP HEADER */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems:
                            'flex-start',
                        marginBottom: '10px'
                    }}
                >

                    <div>

                        <h1
                            style={{
                                margin:
                                    '0 0 2px 0',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#0a2540'
                            }}
                        >
                            CRITERION 8
                        </h1>

                        <h2
                            style={{
                                margin:
                                    '0 0 6px 0',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1a365d'
                            }}
                        >
                            CONTINUOUS IMPROVEMENT
                        </h2>

                        <div
                            style={{
                                fontSize: '12px',
                                color: '#4a5568'
                            }}
                        >

                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: '#3182ce'
                                }}
                                onClick={() =>
                                    navigate(
                                        '/dashboard'
                                    )
                                }
                            >
                                Dashboard
                            </span>

                            {' > '}

                            <span
                                style={{
                                    cursor: 'pointer',
                                    color: '#3182ce'
                                }}
                                onClick={() =>
                                    navigate(
                                        '/criteria-management'
                                    )
                                }
                            >
                                Criteria Management
                            </span>

                            {' > '}

                            <span
                                style={{
                                    fontWeight: '500',
                                    color: '#2d3748'
                                }}
                            >
                                Criterion 8
                            </span>

                        </div>

                    </div>

                </div>

                {/* FILTERS */}

                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '12px',
                        background: '#fff',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border:
                            '1px solid #e2e8f0'
                    }}
                >

                    {/* Academic Year */}

                    <div
                        style={{
                            flex: 1
                        }}
                    >

                        <label
                            style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#4a5568',
                                marginBottom: '3px'
                            }}
                        >
                            Academic Year
                        </label>

                        <select
                            value={
                                academicYear
                            }
                            onChange={e =>
                                setAcademicYear(
                                    e.target.value
                                )
                            }
                            style={{
                                width: '100%',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                border:
                                    '1px solid #cbd5e0',
                                backgroundColor:
                                    '#fff',
                                fontSize: '12px',
                                color: '#2d3748',
                                outline: 'none'
                            }}
                        >

                            <option value="2024-25">
                                📅 2024-25
                            </option>

                            <option value="2023-24">
                                📅 2023-24
                            </option>

                            <option value="2022-23">
                                📅 2022-23
                            </option>

                            <option value="2021-22">
                                📅 2021-22
                            </option>

                        </select>

                    </div>

                    {/* Department */}

                    <div
                        style={{
                            flex: 1
                        }}
                    >

                        <label
                            style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#4a5568',
                                marginBottom: '3px'
                            }}
                        >
                            Department
                        </label>

                        <select
                            value={
                                department
                            }
                            onChange={e =>
                                setDepartment(
                                    e.target.value
                                )
                            }
                            style={{
                                width: '100%',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                border:
                                    '1px solid #cbd5e0',
                                backgroundColor:
                                    '#fff',
                                fontSize: '12px',
                                color: '#2d3748',
                                outline: 'none'
                            }}
                        >

                            <option value="Computer Engineering">
                                🏛️ Computer Engineering
                            </option>

                            <option value="Information Technology">
                                🏛️ Information Technology
                            </option>

                            <option value="Electronics & Telecommunication">
                                🏛️ Electronics & Telecommunication
                            </option>

                            <option value="Mechanical Engineering">
                                🏛️ Mechanical Engineering
                            </option>

                            <option value="Civil Engineering">
                                🏛️ Civil Engineering
                            </option>

                            <option value="Electrical Engineering">
                                🏛️ Electrical Engineering
                            </option>

                            <option value="Artificial Intelligence & Data Science">
                                🏛️ AI & Data Science
                            </option>

                        </select>

                    </div>

                    {/* Program */}

                    <div
                        style={{
                            flex: 1
                        }}
                    >

                        <label
                            style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#4a5568',
                                marginBottom: '3px'
                            }}
                        >
                            Program
                        </label>

                        <select
                            value={
                                program
                            }
                            onChange={e =>
                                setProgram(
                                    e.target.value
                                )
                            }
                            style={{
                                width: '100%',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                border:
                                    '1px solid #cbd5e0',
                                backgroundColor:
                                    '#fff',
                                fontSize: '12px',
                                color: '#2d3748',
                                outline: 'none'
                            }}
                        >

                            <option value="B.E. Computer Engineering">
                                📖 B.E. Computer Engineering
                            </option>

                            <option value="B.Tech Computer Engineering">
                                📖 B.Tech Computer Engineering
                            </option>

                            <option value="B.E. Information Technology">
                                📖 B.E. Information Technology
                            </option>

                            <option value="B.E. Electronics & Telecommunication">
                                📖 B.E. E&TC Engineering
                            </option>

                            <option value="B.E. Mechanical Engineering">
                                📖 B.E. Mechanical Engineering
                            </option>

                            <option value="B.E. Civil Engineering">
                                📖 B.E. Civil Engineering
                            </option>

                            <option value="B.E. Electrical Engineering">
                                📖 B.E. Electrical Engineering
                            </option>

                            <option value="B.Tech AI & Data Science">
                                📖 B.Tech AI & Data Science
                            </option>

                        </select>

                    </div>

                </div>

                {/* SECTION HEADER */}

                <div
                    style={{
                        backgroundColor:
                            '#0a2540',
                        color: '#fff',
                        padding: '8px 12px',
                        borderRadius:
                            '6px 6px 0 0',
                        fontWeight: 'bold',
                        fontSize: '13px'
                    }}
                >
                    8.1 Actions Taken Based on the Results of Evaluation of the COs, POs and PSOs
                </div>

                {/* DATA CONTAINER */}

                <div
                    style={{
                        backgroundColor: '#fff',
                        border:
                            '1px solid #cbd5e0',
                        borderTop: 'none',
                        borderRadius:
                            '0 0 6px 6px',
                        padding: '12px'
                    }}
                >

                    {/* =================================================
                        8.1.1
                    ================================================= */}

                    {activeSection === 1 && (

                        <div>

                            <div
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '13px',
                                    color: '#1a202c',
                                    marginBottom: '8px'
                                }}
                            >
                                8.1.1 Actions Taken Based on the Results of Evaluation of the COs Attainment
                            </div>

                            {renderTable(
                                tableData1,
                                1
                            )}

                            {/* ACTION BUTTONS */}

                            <div
                                style={{
                                    marginTop: '15px',
                                    display: 'flex',
                                    justifyContent:
                                        'center',
                                    gap: '10px',
                                    alignItems:
                                        'center'
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={
                                        saveToServer
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#2E7D32',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#e53e3e',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Delete
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handlePrintUploadedFile
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#805ad5',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Print
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleClear
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#dd6b20',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveSection(
                                            2
                                        )
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#00695c',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Next ➡️
                                </button>

                            </div>

                        </div>

                    )}

                    {/* =================================================
                        8.1.2
                        NO CHANGE
                    ================================================= */}

                    {activeSection === 2 && (

                        <div>

                            <div
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '13px',
                                    color: '#1a202c',
                                    marginBottom: '8px'
                                }}
                            >
                                8.1.2 Actions Taken Based on the Results of Evaluation of the POs/PSOs Attainment
                            </div>

                            {renderTable(
                                tableData2,
                                2
                            )}

                            {/* ACTION BUTTONS */}

                            <div
                                style={{
                                    marginTop: '15px',
                                    display: 'flex',
                                    justifyContent:
                                        'center',
                                    gap: '10px',
                                    alignItems:
                                        'center'
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveSection(
                                            1
                                        )
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#37474F',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    ⬅️ Back
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        saveToServer
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#2E7D32',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#e53e3e',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Delete
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handlePrintUploadedFile
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#805ad5',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Print
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleClear
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#dd6b20',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/criteria/8.2'
                                        )
                                    }
                                    style={{
                                        padding:
                                            '5px 15px',
                                        backgroundColor:
                                            '#00695c',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius:
                                            '4px',
                                        cursor:
                                            'pointer',
                                        fontWeight:
                                            'bold',
                                        fontSize:
                                            '12px'
                                    }}
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Criteria8_1;