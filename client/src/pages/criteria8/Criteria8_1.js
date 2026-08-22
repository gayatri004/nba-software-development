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

    // 🔄 Active Table Step (1: 8.1.1 Table | 2: 8.1.2 Table)
    const [activeSection, setActiveSection] = useState(1);

    // Save Status Tracking States
    const [isSavedSection1, setIsSavedSection1] = useState(false);
    const [isSavedSection2, setIsSavedSection2] = useState(false);

    // 📋 Table 8.1.1 Data Structure Initializer (with synchronized localStorage keys)
    const getInitialTableData1 = () => {
        const localData = localStorage.getItem('criteria_8_1_1_table_data') || localStorage.getItem('criteria8_1_table1');
        if (localData) {
            try { return JSON.parse(localData); } catch (e) { console.error(e); }
        }
        return [
            { id: 1, s_n: 1, point: 'Documentary evidences of identification of gaps in COs attainment', description: '', fileObject: null, fileName: null },
            { id: 2, s_n: 2, point: 'Plan of action to bridge the gaps / improvement', description: '', fileObject: null, fileName: null },
            { id: 3, s_n: 3, point: 'Implementation', description: '', fileObject: null, fileName: null }
        ];
    };

    // 📋 Table 8.1.2 Data Structure Initializer (with synchronized localStorage keys)
    const getInitialTableData2 = () => {
        const localData = localStorage.getItem('criteria_8_1_2_table_data') || localStorage.getItem('criteria8_1_table2');
        if (localData) {
            try { return JSON.parse(localData); } catch (e) { console.error(e); }
        }
        return [
            { id: 101, s_n: 1, point: 'Documentary evidences of identification of gaps in POs/PSOs attainment', description: '', fileObject: null, fileName: null },
            { id: 102, s_n: 2, point: 'Plan of action to bridge the gaps / improvement', description: '', fileObject: null, fileName: null },
            { id: 103, s_n: 3, point: 'Implementation', description: '', fileObject: null, fileName: null }
        ];
    };

    const [tableData1, setTableData1] = useState(getInitialTableData1());
    const [tableData2, setTableData2] = useState(getInitialTableData2());

    // 💾 Sync Table 1 to LocalStorage (8.4 च्या रिपोर्टसाठी दोन्ही Keys सेव्ह केल्या आहेत)
    useEffect(() => {
        const cleanData = tableData1.map(row => ({ 
            ...row, 
            details: row.description || row.details || '',
            fileObject: null 
        }));
        localStorage.setItem('criteria8_1_table1', JSON.stringify(cleanData));
        localStorage.setItem('criteria_8_1_1_table_data', JSON.stringify(cleanData));
    }, [tableData1]);

    // 💾 Sync Table 2 to LocalStorage (8.4 च्या रिपोर्टसाठी दोन्ही Keys सेव्ह केल्या आहेत)
    useEffect(() => {
        const cleanData = tableData2.map(row => ({ 
            ...row, 
            details: row.description || row.details || '',
            fileObject: null 
        }));
        localStorage.setItem('criteria8_1_table2', JSON.stringify(cleanData));
        localStorage.setItem('criteria_8_1_2_table_data', JSON.stringify(cleanData));
    }, [tableData2]);

    // 🔄 डेटाबेसमधून डेटा लोड करणे (GET)
    useEffect(() => {
        const fetchSavedData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/data`, {
                    params: { academicYear, department, program }
                });
                if (res.data && res.data.length > 0) {
                    setTableData1(prev => prev.map(row => {
                        const dbRow = res.data.find(d => Number(d.row_id) === row.id);
                        return dbRow ? { ...row, description: dbRow.details || '', fileName: dbRow.file_name || null, fileObject: null } : row;
                    }));

                    setTableData2(prev => prev.map(row => {
                        const dbRow = res.data.find(d => Number(d.row_id) === row.id);
                        return dbRow ? { ...row, description: dbRow.details || '', fileName: dbRow.file_name || null, fileObject: null } : row;
                    }));
                }
            } catch (err) {
                console.error("डेटा लोड करताना एरर आली:", err);
            }
        };
        fetchSavedData();
    }, [API_BASE_URL, academicYear, department, program]);

    const handleInputChange = (id, value, tableNum) => {
        if (tableNum === 1) {
            setTableData1(prev => prev.map(row => row.id === id ? { ...row, description: value, details: value } : row));
            setIsSavedSection1(false);
        } else {
            setTableData2(prev => prev.map(row => row.id === id ? { ...row, description: value, details: value } : row));
            setIsSavedSection2(false);
        }
    };

    const handlePointChange = (id, value, tableNum) => {
        if (tableNum === 1) {
            setTableData1(prev => prev.map(row => row.id === id ? { ...row, point: value } : row));
            setIsSavedSection1(false);
        } else {
            setTableData2(prev => prev.map(row => row.id === id ? { ...row, point: value } : row));
            setIsSavedSection2(false);
        }
    };

    const handleFileChange = (id, event, tableNum) => {
        const file = event.target.files[0];
        if (file) {
            if (tableNum === 1) {
                setTableData1(prev => prev.map(row => row.id === id ? { ...row, fileName: file.name, fileObject: file } : row));
                setIsSavedSection1(false);
            } else {
                setTableData2(prev => prev.map(row => row.id === id ? { ...row, fileName: file.name, fileObject: file } : row));
                setIsSavedSection2(false);
            }
        }
    };

    // ➕ Dynamic Row Add Logic
    const handleAddRow = (tableNum) => {
        if (tableNum === 1) {
            const nextSn = tableData1.length + 1;
            const newRow = {
                id: Date.now(),
                s_n: nextSn,
                point: `New Point ${nextSn}`,
                description: '',
                details: '',
                fileObject: null,
                fileName: null
            };
            setTableData1([...tableData1, newRow]);
            setIsSavedSection1(false);
        } else {
            const nextSn = tableData2.length + 1;
            const newRow = {
                id: Date.now() + 100,
                s_n: nextSn,
                point: `New Point ${nextSn}`,
                description: '',
                details: '',
                fileObject: null,
                fileName: null
            };
            setTableData2([...tableData2, newRow]);
            setIsSavedSection2(false);
        }
    };

    const handleViewFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);
            window.open(fileURL, '_blank');
        } else if (row.fileName) {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert("No file uploaded for this point!");
        }
    };

    const handleDownloadFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = row.fileName || row.fileObject.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (row.fileName) {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert("No file available for download!");
        }
    };

    // 🔄 Clear Form Logic
    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear the form?")) {
            if (activeSection === 1) {
                localStorage.removeItem('criteria8_1_table1');
                localStorage.removeItem('criteria_8_1_1_table_data');
                setTableData1([
                    { id: 1, s_n: 1, point: 'Documentary evidences of identification of gaps in COs attainment', description: '', details: '', fileObject: null, fileName: null },
                    { id: 2, s_n: 2, point: 'Plan of action to bridge the gaps / improvement', description: '', details: '', fileObject: null, fileName: null },
                    { id: 3, s_n: 3, point: 'Implementation', description: '', details: '', fileObject: null, fileName: null }
                ]);
                setIsSavedSection1(false);
            } else {
                localStorage.removeItem('criteria8_1_table2');
                localStorage.removeItem('criteria_8_1_2_table_data');
                setTableData2([
                    { id: 101, s_n: 1, point: 'Documentary evidences of identification of gaps in POs/PSOs attainment', description: '', details: '', fileObject: null, fileName: null },
                    { id: 102, s_n: 2, point: 'Plan of action to bridge the gaps / improvement', description: '', details: '', fileObject: null, fileName: null },
                    { id: 103, s_n: 3, point: 'Implementation', description: '', details: '', fileObject: null, fileName: null }
                ]);
                setIsSavedSection2(false);
            }
        }
    };

    // 💾 Save Draft Logic for Both Tables
    const saveToServer = async () => {
        const isCurrentSec1 = activeSection === 1;
        const isAlreadySaved = isCurrentSec1 ? isSavedSection1 : isSavedSection2;

        if (isAlreadySaved) {
            alert("The data for this section is already saved as a draft!");
            return;
        }

        const currentData = isCurrentSec1 ? tableData1 : tableData2;

        try {
            for (const row of currentData) {
                const formData = new FormData();
                formData.append("rowId", row.id);
                formData.append("s_n", row.s_n);
                formData.append("item", row.point);
                formData.append("details", row.description || row.details || '');
                formData.append("academicYear", academicYear);
                formData.append("department", department);
                formData.append("program", program);
                formData.append("section", activeSection);

                if (row.fileObject) {
                    formData.append("file", row.fileObject);
                }

                await axios.post(`${API_BASE_URL}/submit`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            if (isCurrentSec1) {
                setIsSavedSection1(true);
            } else {
                setIsSavedSection2(true);
            }

            alert(" saved successfully! 💾");

        } catch (err) {
            console.error(err);
            alert("Process Failed. Please try again.");
        }
    };

    // 🗑️ Delete Data
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to clear the screen data and local cache?")) {
            if (activeSection === 1) {
                localStorage.removeItem('criteria8_1_table1');
                localStorage.removeItem('criteria_8_1_1_table_data');
                setTableData1([
                    { id: 1, s_n: 1, point: 'Documentary evidences of identification of gaps in COs attainment', description: '', details: '', fileObject: null, fileName: null },
                    { id: 2, s_n: 2, point: 'Plan of action to bridge the gaps / improvement', description: '', details: '', fileObject: null, fileName: null },
                    { id: 3, s_n: 3, point: 'Implementation', description: '', details: '', fileObject: null, fileName: null }
                ]);
                setIsSavedSection1(false);
            } else {
                localStorage.removeItem('criteria8_1_table2');
                localStorage.removeItem('criteria_8_1_2_table_data');
                setTableData2([
                    { id: 101, s_n: 1, point: 'Documentary evidences of identification of gaps in POs/PSOs attainment', description: '', details: '', fileObject: null, fileName: null },
                    { id: 102, s_n: 2, point: 'Plan of action to bridge the gaps / improvement', description: '', details: '', fileObject: null, fileName: null },
                    { id: 103, s_n: 3, point: 'Implementation', description: '', details: '', fileObject: null, fileName: null }
                ]);
                setIsSavedSection2(false);
            }
            alert("Data cleared from screen and local cache!");
        }
    };

    // 📄 Word / Excel File Content Read Logic
    const readFileContentHTML = async (row) => {
        let fileBlob = row.fileObject;

        if (!fileBlob && row.fileName) {
            try {
                const response = await fetch(`http://localhost:5000/uploads/${row.fileName}`);
                if (!response.ok) return `<p style="color:red;">File missing on server: ${row.fileName}</p>`;
                fileBlob = await response.blob();
            } catch (e) {
                console.error("File fetch failed", e);
                return `<p style="color:red;">Error loading file from server.</p>`;
            }
        }

        if (!fileBlob) return '<p>No file available.</p>';

        const ext = row.fileName ? row.fileName.split('.').pop().toLowerCase() : '';

        if (ext === 'docx') {
            try {
                const arrayBuffer = await fileBlob.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                return `<div class="word-parsed-content">${result.value}</div>`;
            } catch (err) {
                return `<p style="color:red;">Failed to parse Word file: ${err.message}</p>`;
            }
        }

        if (['xlsx', 'xls', 'csv'].includes(ext)) {
            try {
                const arrayBuffer = await fileBlob.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const htmlTable = XLSX.utils.sheet_to_html(worksheet);
                return `<div class="excel-parsed-content">${htmlTable}</div>`;
            } catch (err) {
                return `<p style="color:red;">Failed to parse Excel file: ${err.message}</p>`;
            }
        }

        return null;
    };

    // 🖨️ Complete Print Logic
    const handlePrintUploadedFile = async () => {
        const currentRows = activeSection === 1 ? tableData1 : tableData2;
        const uploadedRows = currentRows.filter(row => row.fileObject || row.fileName);

        if (uploadedRows.length === 0) {
            alert("No uploaded files found to print!");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) { 
            alert("Please disable your browser's Pop-up blocker!"); 
            return; 
        }

        printWindow.document.write(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h3>Processing uploaded files for preview... Please wait.</h3>
                </body>
            </html>
        `);

        const filesHTMLArray = [];

        for (const row of uploadedRows) {
            const fileURL = row.fileObject 
                ? URL.createObjectURL(row.fileObject) 
                : `http://localhost:5000/uploads/${row.fileName}`;
            
            const fileName = row.fileName || "Uploaded File";
            const ext = fileName.split('.').pop().toLowerCase();

            let previewHTML = '';

            if (ext === 'pdf') {
                previewHTML = `<embed src="${fileURL}" type="application/pdf" class="embed-view" />`;
            } 
            else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                previewHTML = `<img src="${fileURL}" class="img-view" alt="Uploaded Document" />`;
            } 
            else if (['docx', 'xlsx', 'xls', 'csv'].includes(ext)) {
                const parsedHTML = await readFileContentHTML(row);
                previewHTML = parsedHTML;
            } 
            else {
                previewHTML = `
                    <div style="padding: 15px; border: 1px dashed #718096; background: #edf2f7; border-radius: 6px;">
                        <p><strong>File Name:</strong> ${fileName}</p>
                        <p style="color: #e53e3e; font-size: 13px;">Note: Older formats (like .doc) cannot be directly rendered inside the browser.</p>
                    </div>
                `;
            }

            filesHTMLArray.push(`
                <div class="file-container">
                    <div class="file-header">
                        <h2>Point ${row.s_n}: ${row.point}</h2>
                        <p><strong>Description:</strong> ${row.description || row.details || 'N/A'}</p>
                        <p><strong>Uploaded File:</strong> ${fileName}</p>
                    </div>
                    <div class="file-content">
                        ${previewHTML}
                    </div>
                </div>
            `);
        }

        const filesHTML = filesHTMLArray.join('<div class="page-break"></div>');

        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Criteria 8.1 - Continuous Improvement Documents</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; background: #fff; margin: 0; }
                    .main-header { text-align: center; border-bottom: 2px solid #0a2540; padding-bottom: 10px; margin-bottom: 20px; page-break-after: avoid; }
                    .main-header h2 { margin: 0; color: #0a2540; font-size: 18px; }
                    .main-header h3 { margin: 5px 0 0 0; color: #4a5568; font-size: 14px; font-weight: 500; }
                    
                    .file-container { margin-bottom: 20px; }
                    .file-header { background-color: #f7fafc; padding: 12px 16px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0; border-left: 5px solid #0a2540; page-break-after: avoid; }
                    .file-header h2 { margin: 0 0 6px 0; font-size: 15px; color: #0a2540; }
                    .file-header p { margin: 3px 0; font-size: 13px; color: #4a5568; }
                    
                    .embed-view { width: 100%; height: 75vh; border: 1px solid #cbd5e0; border-radius: 4px; }
                    .img-view { max-width: 100%; max-height: 80vh; display: block; margin: 0 auto; border: 1px solid #cbd5e0; border-radius: 4px; }
                    
                    .word-parsed-content { padding: 20px; border: 1px solid #cbd5e0; background: #ffffff; border-radius: 6px; line-height: 1.6; font-size: 14px; }
                    .word-parsed-content h1, .word-parsed-content h2, .word-parsed-content h3 { color: #2b6cb0; }
                    
                    .excel-parsed-content { overflow-x: auto; }
                    .excel-parsed-content table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
                    .excel-parsed-content th, .excel-parsed-content td { border: 1px solid #cbd5e0; padding: 8px 10px; text-align: left; }
                    .excel-parsed-content tr:nth-child(even) { background-color: #f7fafc; }
                    .excel-parsed-content tr:first-child { background-color: #edf2f7; font-weight: bold; }

                    .page-break { page-break-after: always; height: 0; display: block; clear: both; }

                    @media print {
                        body { padding: 0; }
                        .embed-view { height: 88vh; }
                        .page-break { page-break-after: always; }
                    }
                </style>
            </head>
            <body>
                <div class="main-header">
                    <h2>CRITERION 8: CONTINUOUS IMPROVEMENT</h2>
                    <h3>8.1: Actions Taken Based on the Results of Evaluation of the COs, POs and PSOs</h3>
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

    // Table Render Helper Function
    const renderTable = (tableData, tableNum) => (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e0' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e0' }}>
                        <th rowSpan="2" style={{ width: '8%', padding: '10px 8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>Sr. No.</th>
                        <th rowSpan="2" style={{ width: '32%', padding: '10px 12px', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', color: '#0a2540' }}>Point</th>
                        <th rowSpan="2" style={{ width: '40%', padding: '10px 12px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>Description / Details</th>
                        <th colSpan="3" style={{ width: '20%', padding: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540', borderBottom: '1px solid #cbd5e0' }}>Action</th>
                    </tr>
                    <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
                        <th style={{ padding: '6px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>View</th>
                        <th style={{ padding: '6px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>Upload</th>
                        <th style={{ padding: '6px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: '#2d3748' }}>
                                {row.s_n}
                            </td>
                            <td style={{ padding: '8px 12px', fontSize: '13px', color: '#2d3748' }}>
                                <input 
                                    type="text"
                                    value={row.point}
                                    onChange={(e) => handlePointChange(row.id, e.target.value, tableNum)}
                                    style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '13px', fontWeight: '500' }}
                                />
                            </td>
                            <td style={{ padding: '10px' }}>
                                <textarea 
                                    rows="2"
                                    value={row.description} 
                                    onChange={(e) => handleInputChange(row.id, e.target.value, tableNum)} 
                                    placeholder="Enter description here..."
                                    style={{ width: '100%', height: '42px', padding: '6px 10px', border: '1px solid #cbd5e0', borderRadius: '6px', resize: 'vertical', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                                />
                            </td>

                            {/* Action: View */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                <button 
                                    type="button" 
                                    title="View File"
                                    onClick={() => handleViewFile(row)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#0a2540' }}
                                >
                                    👁️
                                </button>
                            </td>

                            {/* Action: Upload */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                <input 
                                    type="file" 
                                    id={`file-input-${tableNum}-${row.id}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(row.id, e, tableNum)}
                                    accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.xls,.csv"
                                />
                                <button 
                                    type="button" 
                                    title={row.fileName ? `Uploaded: ${row.fileName}` : "Upload File"}
                                    onClick={() => document.getElementById(`file-input-${tableNum}-${row.id}`).click()}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                >
                                    {row.fileName ? '✅' : '☁️'}
                                </button>
                                
                                {row.fileName && (
                                    <div style={{ fontSize: '10px', color: '#276749', fontWeight: 'bold', marginTop: '2px', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {row.fileName}
                                    </div>
                                )}
                            </td>

                            {/* Action: Download */}
                            <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                <button 
                                    type="button" 
                                    title="Download File"
                                    onClick={() => handleDownloadFile(row)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#0a2540' }}
                                >
                                    📥
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ➕ Add New Row Button */}
            <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                <button 
                    type="button" 
                    onClick={() => handleAddRow(tableNum)}
                    style={{ padding: '6px 14px', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                    ➕ Add Row
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                <NBASidebar />
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '25px', boxSizing: 'border-box' }}>
                
                {/* TOP HEADER SECTION */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#0a2540' }}>
                            CRITERION 8
                        </h1>
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600', color: '#1a365d' }}>
                            CONTINUOUS IMPROVEMENT (80)
                        </h2>
                        <div style={{ fontSize: '13px', color: '#4a5568' }}>
                            <span style={{ cursor: 'pointer', color: '#3182ce' }} onClick={() => navigate('/dashboard')}>Dashboard</span> &gt; 
                            <span style={{ cursor: 'pointer', color: '#3182ce' }} onClick={() => navigate('/criteria-management')}> Criteria Management</span> &gt; 
                            <span style={{ fontWeight: '500', color: '#2d3748' }}> Criterion 8</span>
                        </div>
                    </div>
                </div>

                {/* FILTERS BAR */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Academic Year</label>
                        <select 
                            value={academicYear} 
                            onChange={(e) => setAcademicYear(e.target.value)} 
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: '#fff', fontSize: '13px', color: '#2d3748', outline: 'none' }}
                        >
                            <option value="2024-25">📅 2024-25</option>
                            <option value="2023-24">📅 2023-24</option>
                            <option value="2022-23">📅 2022-23</option>
                            <option value="2021-22">📅 2021-22</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Department</label>
                        <select 
                            value={department} 
                            onChange={(e) => setDepartment(e.target.value)} 
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: '#fff', fontSize: '13px', color: '#2d3748', outline: 'none' }}
                        >
                            <option value="Computer Engineering">🏛️ Computer Engineering</option>
                            <option value="Information Technology">🏛️ Information Technology</option>
                            <option value="Electronics & Telecommunication">🏛️ Electronics & Telecommunication</option>
                            <option value="Mechanical Engineering">🏛️ Mechanical Engineering</option>
                            <option value="Civil Engineering">🏛️ Civil Engineering</option>
                            <option value="Electrical Engineering">🏛️ Electrical Engineering</option>
                            <option value="Artificial Intelligence & Data Science">🏛️ AI & Data Science</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>Program</label>
                        <select 
                            value={program} 
                            onChange={(e) => setProgram(e.target.value)} 
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: '#fff', fontSize: '13px', color: '#2d3748', outline: 'none' }}
                        >
                            <option value="B.E. Computer Engineering">📖 B.E. Computer Engineering</option>
                            <option value="B.Tech Computer Engineering">📖 B.Tech Computer Engineering</option>
                            <option value="B.E. Information Technology">📖 B.E. Information Technology</option>
                            <option value="B.E. Electronics & Telecommunication">📖 B.E. E&TC Engineering</option>
                            <option value="B.E. Mechanical Engineering">📖 B.E. Mechanical Engineering</option>
                            <option value="B.E. Civil Engineering">📖 B.E. Civil Engineering</option>
                            <option value="B.E. Electrical Engineering">📖 B.E. Electrical Engineering</option>
                            <option value="B.Tech AI & Data Science">📖 B.Tech AI & Data Science</option>
                        </select>
                    </div>
                </div>

                {/* SECTION 8.1 HEADER BANNER */}
                <div style={{ backgroundColor: '#0a2540', color: '#fff', padding: '12px 18px', borderRadius: '8px 8px 0 0', fontWeight: 'bold', fontSize: '15px' }}>
                    8.1 Actions Taken Based on the Results of Evaluation of the COs, POs and PSOs (40)
                </div>

                {/* DATA TABLE CONTAINER */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e0', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                    
                    {/* SECTION 8.1.1 VIEW */}
                    {activeSection === 1 && (
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a202c', marginBottom: '15px' }}>
                                8.1.1 Actions Taken Based on the Results of Evaluation of the COs Attainment (20)
                            </div>

                            {renderTable(tableData1, 1)}

                            {/* ACTION BUTTONS FOR TABLE 8.1.1 */}
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button 
                                    type="button" 
                                    onClick={saveToServer}
                                    style={{ padding: '8px 16px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Save 
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handleDelete}
                                    style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Delete
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handlePrintUploadedFile}
                                    style={{ padding: '8px 16px', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Print
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handleClear}
                                    style={{ padding: '8px 16px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Clear
                                </button>

                                {/* NEXT CLICK TO OPEN 8.1.2 TABLE */}
                                <button 
                                    type="button" 
                                    onClick={() => setActiveSection(2)}
                                    style={{ padding: '8px 16px', backgroundColor: '#00695c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginLeft: 'auto' }}
                                >
                                    Next 
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SECTION 8.1.2 VIEW (OPENED ON NEXT CLICK) */}
                    {activeSection === 2 && (
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a202c', marginBottom: '15px' }}>
                                8.1.2 Actions Taken Based on the Results of Evaluation of the POs/PSOs Attainment (20)
                            </div>

                            {renderTable(tableData2, 2)}

                            {/* ACTION BUTTONS FOR TABLE 8.1.2 */}
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setActiveSection(1)}
                                    style={{ padding: '8px 16px', backgroundColor: '#37474F', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                    Back
                                </button>

                                <button 
                                    type="button" 
                                    onClick={saveToServer}
                                    style={{ padding: '8px 16px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Save 
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handleDelete}
                                    style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Delete
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handlePrintUploadedFile}
                                    style={{ padding: '8px 16px', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Print
                                </button>

                                <button 
                                    type="button" 
                                    onClick={handleClear}
                                    style={{ padding: '8px 16px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                                >
                                     Clear
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => navigate('/criteria/8.2')}
                                    style={{ padding: '8px 16px', backgroundColor: '#00695c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginLeft: 'auto' }}
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