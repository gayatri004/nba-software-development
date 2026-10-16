import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import "../../styles/Criteria7_5.css";
import NBASidebar from "../NBASidebar";

const Criteria7_5 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.5";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;
    const LOCAL_STORAGE_KEY = "criteria_7_5_table_data";

    const [academicYear] = useState("2024-25");
    const [department] = useState("Computer Engineering");
    const [program] = useState("B.E. Computer Engineering");

    const fileInputRefs = useRef({});

    // =========================================================
    // PERMANENT DOCUMENT NAMES + PERMANENT DESCRIPTIONS
    // =========================================================
    const getInitialTableData = () => [
        {
            id: 1,
            s_n: 1,
            point: 'Availability of project laboratories/ research laboratories',
            description:
                'Details of project laboratories and research laboratories available in the department, including their facilities, infrastructure and resources.',
            fileObject: null,
            fileName: null
        },
        {
            id: 2,
            s_n: 2,
            point: 'Availability of centre of excellence',
            description:
                'Details of Centre of Excellence available in the department, including its facilities, resources and academic/research activities.',
            fileObject: null,
            fileName: null
        },
        {
            id: 3,
            s_n: 3,
            point: 'Utilization of project laboratories/ research laboratory /Centre of excellence',
            description:
                'Details of utilization of project laboratories, research laboratories and Centre of Excellence for academic, project, research and other relevant activities.',
            fileObject: null,
            fileName: null
        }
    ];

    // =========================================================
    // TABLE DATA
    // =========================================================
    const [tableData, setTableData] = useState(() => {
        const savedLocalData = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (savedLocalData) {
            try {
                const parsedData = JSON.parse(savedLocalData);
                const initialData = getInitialTableData();

                return initialData.map((defaultRow) => {
                    const savedRow = parsedData.find(
                        row => Number(row.id) === Number(defaultRow.id)
                    );

                    if (savedRow) {
                        return {
                            ...defaultRow,
                            fileName: savedRow.fileName || null,
                            fileObject: null
                        };
                    }

                    return defaultRow;
                });

            } catch (e) {
                console.error("Local storage parse error:", e);
            }
        }

        return getInitialTableData();
    });

    // =========================================================
    // SAVE LOCAL STORAGE
    // =========================================================
    useEffect(() => {
        const dataToSave = tableData.map(row => ({
            id: row.id,
            s_n: row.s_n,
            point: row.point,
            description: row.description,
            fileName: row.fileName,
            fileObject: null
        }));

        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(dataToSave)
        );
    }, [tableData]);

    // =========================================================
    // FETCH SAVED DATA
    // =========================================================
    const fetchSavedData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/data`, {
                params: {
                    academicYear,
                    department,
                    program
                }
            });

            if (res.data && res.data.length > 0) {
                setTableData(prevData => {

                    const permanentRows = getInitialTableData();

                    return permanentRows.map(defaultRow => {

                        const dbRow = res.data.find(
                            d =>
                                Number(d.row_id || d.s_n) ===
                                Number(defaultRow.id)
                        );

                        if (dbRow) {
                            return {
                                ...defaultRow,

                                // Description remains permanent
                                description: defaultRow.description,

                                fileName:
                                    dbRow.file_name ||
                                    dbRow.fileName ||
                                    null,

                                fileObject: null
                            };
                        }

                        const existingRow = prevData.find(
                            row =>
                                Number(row.id) ===
                                Number(defaultRow.id)
                        );

                        return {
                            ...defaultRow,
                            description: defaultRow.description,
                            fileName:
                                existingRow?.fileName || null,
                            fileObject:
                                existingRow?.fileObject || null
                        };
                    });
                });
            }

        } catch (err) {
            console.error(
                "Error fetching data from server:",
                err
            );
        }
    }, [
        API_BASE_URL,
        academicYear,
        department,
        program
    ]);

    useEffect(() => {
        fetchSavedData();
    }, [fetchSavedData]);

    // =========================================================
    // FILE CHANGE
    // =========================================================
    const handleFileChange = (id, event) => {
        const file = event.target.files[0];

        if (file) {
            setTableData(prev =>
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
        }
    };

    // =========================================================
    // VIEW FILE
    // =========================================================
    const handleViewFile = (row) => {

        if (row.fileObject) {

            const fileURL =
                URL.createObjectURL(row.fileObject);

            window.open(fileURL, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);

        } else if (row.fileName) {

            window.open(
                `http://localhost:5000/uploads/${row.fileName}`,
                '_blank'
            );

        } else {

            alert("No file uploaded for this document!");

        }
    };

    // =========================================================
    // DOWNLOAD FILE
    // =========================================================
    const handleDownloadFile = (row) => {

        if (row.fileObject) {

            const fileURL =
                URL.createObjectURL(row.fileObject);

            const link =
                document.createElement('a');

            link.href = fileURL;
            link.download = row.fileName;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);

        } else if (row.fileName) {

            const link =
                document.createElement('a');

            link.href =
                `http://localhost:5000/uploads/${row.fileName}`;

            link.download = row.fileName;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        } else {

            alert("No file available for download!");

        }
    };

    // =========================================================
    // SAVE TO SERVER
    // =========================================================
    const saveToServer = async () => {

        try {

            const uploadPromises = tableData.map(row => {

                const formData = new FormData();

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

                // Permanent description
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

                } else if (row.fileName) {

                    formData.append(
                        "existingFileName",
                        row.fileName
                    );

                }

                return axios.post(
                    `${API_BASE_URL}/submit`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );
            });

            await Promise.all(uploadPromises);

            alert("Data saved successfully! 💾");

            await fetchSavedData();

        } catch (err) {

            console.error(err);

            alert(
                "Process Failed. Please try again."
            );
        }
    };

    // =========================================================
    // CLEAR
    // =========================================================
    const handleClear = () => {

        if (
            window.confirm(
                "तुम्हाला टेबलमधील सर्व भरलेला डेटा Clear/Refresh करायचा आहे का?"
            )
        ) {

            localStorage.removeItem(
                LOCAL_STORAGE_KEY
            );

            setTableData(
                getInitialTableData()
            );

            Object.keys(
                fileInputRefs.current
            ).forEach(key => {

                if (
                    fileInputRefs.current[key]
                ) {
                    fileInputRefs.current[key].value = "";
                }

            });

            alert(
                "टेबल यशस्वीरीत्या Clear / Refresh झाला आहे!"
            );
        }
    };

    // =========================================================
    // DELETE
    // =========================================================
    const handleDelete = async () => {

        if (
            window.confirm(
                "Are you sure you want to delete all entered data from Server and Local Storage?"
            )
        ) {

            try {

                await axios.delete(
                    `${API_BASE_URL}/delete`,
                    {
                        data: {
                            academicYear,
                            department,
                            program
                        }
                    }
                );

                localStorage.removeItem(
                    LOCAL_STORAGE_KEY
                );

                setTableData(
                    getInitialTableData()
                );

                Object.keys(
                    fileInputRefs.current
                ).forEach(key => {

                    if (
                        fileInputRefs.current[key]
                    ) {
                        fileInputRefs.current[key].value = "";
                    }

                });

                alert(
                    "Data cleared successfully from server!"
                );

            } catch (err) {

                console.error(err);

                localStorage.removeItem(
                    LOCAL_STORAGE_KEY
                );

                setTableData(
                    getInitialTableData()
                );

                alert(
                    "Local data cleared successfully."
                );
            }
        }
    };

    // =========================================================
    // READ FILE CONTENT
    // =========================================================
    const readFileContentHTML = async (item) => {

        let fileBlob = item.fileObject;

        const fileName =
            item.file_name ||
            item.fileName ||
            (
                item.fileObject
                    ? item.fileObject.name
                    : null
            );

        if (!fileBlob && fileName) {

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/uploads/${fileName}`
                    );

                fileBlob =
                    await response.blob();

            } catch (e) {

                console.error(
                    "File fetch failed",
                    e
                );

                return `
                    <p style="
                        color:red;
                        font-size:14px;
                    ">
                        Error loading file from server.
                    </p>
                `;
            }
        }

        if (!fileBlob) {

            return `
                <p style="font-size:14px;">
                    No file available.
                </p>
            `;
        }

        const ext =
            fileName
                ? fileName
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
                        arrayBuffer
                    });

                return `
                    <div class="word-parsed-content">
                        ${result.value}
                    </div>
                `;

            } catch (err) {

                return `
                    <p style="
                        color:red;
                        font-size:14px;
                    ">
                        Failed to parse Word file:
                        ${err.message}
                    </p>
                `;
            }
        }

        // EXCEL
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
                    <p style="
                        color:red;
                        font-size:14px;
                    ">
                        Failed to parse Excel file:
                        ${err.message}
                    </p>
                `;
            }
        }

        return '';
    };

    // =========================================================
    // PRINT FULL REPORT
    // =========================================================
    const handlePrintUploadedFile = async () => {

        try {

            const params = {
                academicYear,
                department,
                program
            };

            const [
                res71,
                res72,
                res73,
                res74
            ] = await Promise.all([

                axios.get(
                    `http://localhost:5000/api/criteria/7/7.1/data`,
                    { params }
                ).catch(() => ({
                    data: []
                })),

                axios.get(
                    `http://localhost:5000/api/criteria/7/7.2/data`,
                    { params }
                ).catch(() => ({
                    data: []
                })),

                axios.get(
                    `http://localhost:5000/api/criteria/7/7.3/data`,
                    { params }
                ).catch(() => ({
                    data: []
                })),

                axios.get(
                    `http://localhost:5000/api/criteria/7/7.4/data`,
                    { params }
                ).catch(() => ({
                    data: []
                }))
            ]);

            const allCriteriaList = [

                {
                    title:
                        "7.1 Actions taken based on the reviews of higher level advisory body",
                    data:
                        res71.data || []
                },

                {
                    title:
                        "7.2 Mentoring system to help at individual level",
                    data:
                        res72.data || []
                },

                {
                    title:
                        "7.3 Feedback analysis and reward / corrective measures",
                    data:
                        res73.data || []
                },

                {
                    title:
                        "7.4 Scope for self-learning",
                    data:
                        res74.data || []
                },

                {
                    title:
                        "7.5 Project Laboratory / Research Laboratory / Centre of Excellence",

                    data:
                        tableData.map(r => ({
                            row_id: r.s_n,
                            s_n: r.s_n,
                            item: r.point,
                            current_status:
                                r.description,
                            file_name:
                                r.fileName,
                            fileObject:
                                r.fileObject
                        }))
                }
            ];

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
                    <body style="
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin-top: 50px;
                    ">
                        <h2 style="font-size:20px;">
                            Generating Full Report for Criteria 7...
                            Please wait.
                        </h2>
                    </body>
                </html>
            `);

            let fullContentHTML = '';

            for (
                let cIdx = 0;
                cIdx < allCriteriaList.length;
                cIdx++
            ) {

                const crit =
                    allCriteriaList[cIdx];

                fullContentHTML += `
                    <div class="crit-section">
                `;

                fullContentHTML += `
                    <h2 class="section-title">
                        ${crit.title}
                    </h2>
                `;

                if (
                    !crit.data ||
                    crit.data.length === 0
                ) {

                    fullContentHTML += `
                        <p style="
                            padding:6px;
                            color:#718096;
                            font-style:italic;
                            font-size:13px;
                        ">
                            No records submitted for this sub-section.
                        </p>
                    `;

                } else {

                    for (
                        let idx = 0;
                        idx < crit.data.length;
                        idx++
                    ) {

                        const item =
                            crit.data[idx];

                        const fileName =
                            item.file_name ||
                            item.fileName ||
                            (
                                item.fileObject
                                    ? item.fileObject.name
                                    : null
                            );

                        let fileURL = null;

                        if (item.fileObject) {

                            fileURL =
                                URL.createObjectURL(
                                    item.fileObject
                                );

                        } else if (fileName) {

                            fileURL =
                                `http://localhost:5000/uploads/${fileName}`;
                        }

                        const ext =
                            fileName
                                ? fileName
                                    .split('.')
                                    .pop()
                                    .toLowerCase()
                                : '';

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
                                    alt="Document"
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

                            previewHTML =
                                await readFileContentHTML(
                                    item
                                );

                        } else if (fileName) {

                            previewHTML = `
                                <div style="
                                    padding:6px;
                                    background:#edf2f7;
                                    border:1px dashed #cbd5e0;
                                    border-radius:4px;
                                ">
                                    <p style="
                                        margin:0;
                                        font-size:13px;
                                        color:#4a5568;
                                    ">
                                        Attachment:
                                        <strong>
                                            ${fileName}
                                        </strong>
                                    </p>
                                </div>
                            `;
                        }

                        fullContentHTML += `
                            <div class="file-card">

                                <div class="card-title">
                                    Document ${item.s_n || item.row_id || idx + 1}:
                                    ${item.item || item.point || ''}
                                </div>

                                <div class="card-body">

                                    <p style="
                                        font-size:13px;
                                        margin-bottom:4px;
                                    ">
                                        <strong>
                                            Description:
                                        </strong>

                                        ${
                                            item.current_status ||
                                            item.description ||
                                            '<em>No description provided</em>'
                                        }
                                    </p>

                                    <p style="
                                        font-size:13px;
                                        margin-bottom:6px;
                                    ">
                                        <strong>
                                            Uploaded Document:
                                        </strong>

                                        ${
                                            fileName
                                                ? fileName
                                                : '<em>No file attached</em>'
                                        }
                                    </p>

                                    ${
                                        previewHTML
                                            ? `
                                                <div class="content-preview">

                                                    <strong style="
                                                        font-size:13px;
                                                    ">
                                                        Document Preview:
                                                    </strong>

                                                    <div style="
                                                        margin-top:4px;
                                                    ">
                                                        ${previewHTML}
                                                    </div>

                                                </div>
                                            `
                                            : ''
                                    }

                                </div>

                            </div>
                        `;
                    }
                }

                fullContentHTML += `
                    </div>
                `;
            }

            printWindow.document.open();

            printWindow.document.write(`
                <html>

                <head>

                    <title>
                        Criteria 7 Full Report
                    </title>

                    <style>

                        @page {
                            size:A4 portrait;
                            margin:8mm 10mm;
                        }

                        * {
                            box-sizing:border-box;
                        }

                        html,
                        body {
                            font-family:
                                'Segoe UI',
                                Arial,
                                sans-serif;

                            color:#2d3748;
                            background:#fff;
                            margin:0;
                            padding:0;
                            font-size:13px;
                            line-height:1.4;
                        }

                        .main-header {
                            text-align:center;
                            border-bottom:
                                2px solid #00133e;

                            padding-bottom:4px;
                            margin-bottom:8px;
                        }

                        .main-header h1 {
                            margin:0;
                            color:#00133e;
                            font-size:16px;
                            font-weight:700;
                        }

                        .crit-section {
                            margin-top:8px;
                        }

                        .section-title {
                            background:#00133e;
                            color:#fff;
                            padding:6px 10px;
                            margin-top:10px;
                            margin-bottom:6px;
                            border-radius:4px;
                            font-size:14px;
                            font-weight:600;
                        }

                        .file-card {
                            border:
                                1px solid #cbd5e0;

                            border-radius:4px;
                            margin-bottom:8px;
                            overflow:hidden;
                            background:#fff;
                        }

                        .card-title {
                            background-color:#edf2f7;
                            color:#00133e;
                            padding:6px 10px;
                            font-weight:bold;
                            font-size:13px;
                            border-bottom:
                                1px solid #cbd5e0;
                        }

                        .card-body {
                            padding:8px;
                            background-color:#fff;
                        }

                        .embed-view {
                            width:100%;
                            height:350px;
                            border:
                                1px solid #cbd5e0;
                            border-radius:4px;
                        }

                        .img-view {
                            max-width:100%;
                            max-height:320px;
                            display:block;
                            margin:4px auto;
                            border:
                                1px solid #cbd5e0;
                            border-radius:4px;
                        }

                        .word-parsed-content p,
                        .excel-parsed-content p {
                            margin:
                                0 0 6px 0;
                            font-size:12px;
                        }

                        .excel-parsed-content table {
                            width:100%;
                            border-collapse:collapse;
                            font-size:11px;
                        }

                        .excel-parsed-content th,
                        .excel-parsed-content td {
                            border:
                                1px solid #cbd5e0;
                            padding:4px 6px;
                            text-align:left;
                        }

                    </style>

                </head>

                <body>

                    <div class="main-header">

                        <h1>
                            Criteria 7 - Institutional Values and Best Practices (7.1 to 7.5)
                        </h1>

                    </div>

                    ${fullContentHTML}

                </body>

                </html>
            `);

            printWindow.document.close();

            printWindow.focus();

            setTimeout(() => {
                printWindow.print();
            }, 1200);

        } catch (err) {

            console.error(
                "Error generating print report:",
                err
            );

            alert(
                "Failed to load full report for printing."
            );
        }
    };

    // =========================================================
    // RETURN UI
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
                    padding: '16px',
                    boxSizing: 'border-box'
                }}
            >

                {/* HEADER */}
                <div
                    style={{
                        backgroundColor: '#00133e',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '6px 6px 0 0',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}
                >
                    7.5 Project Laboratory / Research Laboratory / Centre of Excellence
                </div>

                {/* CONTENT BOX */}
                <div
                    style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e0',
                        borderTop: 'none',
                        borderRadius: '0 0 6px 6px',
                        padding: '12px'
                    }}
                >

                    {/* TABLE */}
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: '1px solid #cbd5e0'
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    backgroundColor: '#e2e8f0'
                                }}
                            >

                                <th
                                    style={{
                                        width: '6%',
                                        padding: '6px 4px',
                                        border: '1px solid #cbd5e0',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#00133e'
                                    }}
                                >
                                    Sr. No.
                                </th>

                                <th
                                    style={{
                                        width: '34%',
                                        padding: '6px 8px',
                                        border: '1px solid #cbd5e0',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#00133e'
                                    }}
                                >
                                    Document Name
                                </th>

                                <th
                                    style={{
                                        width: '40%',
                                        padding: '6px 8px',
                                        border: '1px solid #cbd5e0',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#00133e'
                                    }}
                                >
                                    Description / Details
                                </th>

                                <th
                                    style={{
                                        width: '20%',
                                        padding: '6px 8px',
                                        border: '1px solid #cbd5e0',
                                        fontSize: '12px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#00133e'
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
                                            fontWeight: '600',
                                            textAlign: 'center',
                                            padding: '4px',
                                            fontSize: '12px',
                                            borderRight:
                                                '1px solid #e2e8f0',
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        {row.s_n}
                                    </td>

                                    {/* DOCUMENT NAME */}
                                    <td
                                        style={{
                                            padding: '6px 8px',
                                            fontSize: '12px',
                                            color: '#000080',
                                            fontWeight: 'bold',
                                            borderRight:
                                                '1px solid #e2e8f0',
                                            lineHeight: '1.6',
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        {row.point}
                                    </td>

                                    {/* PERMANENT DESCRIPTION */}
                                    <td
                                        style={{
                                            padding: '8px',
                                            borderRight:
                                                '1px solid #e2e8f0',
                                            fontSize: '12px',
                                            color: '#334155',
                                            lineHeight: '1.6',
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        {row.description}
                                    </td>

                                    {/* ACTION */}
                                    <td
                                        style={{
                                            padding: '10px 8px',
                                            textAlign: 'center',
                                            verticalAlign:
                                                'middle'
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection:
                                                    'column',
                                                alignItems:
                                                    'center',
                                                gap: '8px',
                                                width: '100%'
                                            }}
                                        >

                                            {/* HIDDEN FILE INPUT */}
                                            <input
                                                type="file"
                                                ref={el =>
                                                    (
                                                        fileInputRefs.current[
                                                            row.id
                                                        ] = el
                                                    )
                                                }
                                                style={{
                                                    display:
                                                        'none'
                                                }}
                                                onChange={
                                                    e =>
                                                        handleFileChange(
                                                            row.id,
                                                            e
                                                        )
                                                }
                                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv"
                                            />

                                            {/* FILE BOX */}
                                            <div
                                                style={{
                                                    width: '100%',
                                                    maxWidth:
                                                        '250px',
                                                    minHeight:
                                                        '42px',
                                                    border:
                                                        '1px solid #b8cbe3',
                                                    borderRadius:
                                                        '7px',
                                                    display:
                                                        'flex',
                                                    alignItems:
                                                        'center',
                                                    padding:
                                                        '5px 9px',
                                                    boxSizing:
                                                        'border-box',
                                                    gap: '9px',
                                                    backgroundColor:
                                                        '#fff'
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fileInputRefs
                                                            .current[
                                                            row.id
                                                        ]?.click()
                                                    }
                                                    style={{
                                                        padding:
                                                            '6px 10px',
                                                        backgroundColor:
                                                            '#f1f5f9',
                                                        color:
                                                            '#0f2747',
                                                        border:
                                                            '1px solid #cbd5e0',
                                                        borderRadius:
                                                            '6px',
                                                        cursor:
                                                            'pointer',
                                                        fontSize:
                                                            '11px',
                                                        fontWeight:
                                                            '500',
                                                        whiteSpace:
                                                            'nowrap'
                                                    }}
                                                >
                                                    Choose File
                                                </button>

                                                <span
                                                    style={{
                                                        fontSize:
                                                            '11px',
                                                        color:
                                                            '#334155',
                                                        overflow:
                                                            'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        whiteSpace:
                                                            'nowrap',
                                                        flex: 1,
                                                        textAlign:
                                                            'left'
                                                    }}
                                                >
                                                    {row.fileName
                                                        ? row.fileName
                                                        : 'No file chosen'}
                                                </span>

                                            </div>

                                            {/* VIEW + DOWNLOAD */}
                                            <div
                                                style={{
                                                    display:
                                                        'flex',
                                                    justifyContent:
                                                        'center',
                                                    alignItems:
                                                        'center',
                                                    gap: '7px',
                                                    width: '100%'
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
                                                            '78px',
                                                        height:
                                                            '34px',
                                                        padding:
                                                            '5px 8px',
                                                        backgroundColor:
                                                            '#2867d9',
                                                        color:
                                                            '#ffffff',
                                                        border:
                                                            'none',
                                                        borderRadius:
                                                            '6px',
                                                        cursor:
                                                            'pointer',
                                                        fontWeight:
                                                            '600',
                                                        fontSize:
                                                            '11px',
                                                        boxShadow:
                                                            '0 2px 4px rgba(0,0,0,0.12)',
                                                        display:
                                                            'flex',
                                                        alignItems:
                                                            'center',
                                                        justifyContent:
                                                            'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                '12px'
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
                                                            '88px',
                                                        height:
                                                            '34px',
                                                        padding:
                                                            '5px 8px',
                                                        backgroundColor:
                                                            '#16a34a',
                                                        color:
                                                            '#ffffff',
                                                        border:
                                                            'none',
                                                        borderRadius:
                                                            '6px',
                                                        cursor:
                                                            'pointer',
                                                        fontWeight:
                                                            '600',
                                                        fontSize:
                                                            '11px',
                                                        boxShadow:
                                                            '0 2px 4px rgba(0,0,0,0.12)',
                                                        display:
                                                            'flex',
                                                        alignItems:
                                                            'center',
                                                        justifyContent:
                                                            'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize:
                                                                '15px'
                                                        }}
                                                    >
                                                        ↓
                                                    </span>
                                                    Download
                                                </button>

                                            </div>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {/* BOTTOM BUTTONS */}
                    <div
                        style={{
                            marginTop: '16px',
                            display: 'flex',
                            justifyContent:
                                'center',
                            alignItems: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                            borderTop:
                                '1px solid #edf2f7',
                            paddingTop: '12px'
                        }}
                    >

                        {/* BACK */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/criteria/7.1'
                                )
                            }
                            style={{
                                padding:
                                    '6px 14px',
                                backgroundColor:
                                    '#37474F',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor:
                                    'pointer',
                                fontWeight:
                                    'bold',
                                fontSize:
                                    '12px'
                            }}
                        >
                            Back
                        </button>

                        {/* PREVIOUS */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/criteria/7.4'
                                )
                            }
                            style={{
                                padding:
                                    '6px 14px',
                                backgroundColor:
                                    '#E65100',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor:
                                    'pointer',
                                fontWeight:
                                    'bold',
                                fontSize:
                                    '12px'
                            }}
                        >
                            Previous
                        </button>

                        {/* SAVE */}
                        <button
                            type="button"
                            onClick={
                                saveToServer
                            }
                            style={{
                                padding:
                                    '6px 14px',
                                backgroundColor:
                                    '#2E7D32',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
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

                        {/* CLEAR */}
                        <button
                            type="button"
                            onClick={
                                handleClear
                            }
                            style={{
                                padding:
                                    '6px 14px',
                                backgroundColor:
                                    '#dd6b20',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
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

                        {/* DELETE */}
                        <button
                            type="button"
                            onClick={
                                handleDelete
                            }
                            style={{
                                padding:
                                    '6px 14px',
                                backgroundColor:
                                    '#e53e3e',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
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

                        {/* GENERATE REPORT */}
                        <button
                            type="button"
                            onClick={
                                handlePrintUploadedFile
                            }
                            style={{
                                padding:
                                    '6px 14px',
                                backgroundColor:
                                    '#805ad5',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor:
                                    'pointer',
                                fontWeight:
                                    'bold',
                                fontSize:
                                    '12px'
                            }}
                        >
                            Generate Report all
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Criteria7_5;