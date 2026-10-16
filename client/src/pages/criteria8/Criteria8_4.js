import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria8_4.css";
const API_BASE_URL = "http://localhost:5000/api/criteria/8";
const LOCAL_STORAGE_KEY = "criteria_8_4_table_data";

const Criteria8_4 = () => {
    const navigate = useNavigate();

    const initialRows = [
        { 
            id: 1, 
            srNo: '1', 
            point: 'Academic Performance Index (API) of the First-Year Students in the Program', 
            details: '', 
            fileName: null, 
            fileObject: null 
        },
        { 
            id: 2, 
            srNo: '2', 
            point: 'Academic Performance Index (API) of the Second-Year Students in the Program', 
            details: '', 
            fileName: null, 
            fileObject: null 
        },
        { 
            id: 3, 
            srNo: '3', 
            point: 'Academic Performance Index (API) of the Third Year Students in the Program', 
            details: '', 
            fileName: null, 
            fileObject: null 
        }
    ];

    const [tableData, setTableData] = useState(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Failed to parse local storage data", e);
            }
        }
        return initialRows;
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const dataToStore = tableData.map(row => ({
            ...row,
            fileObject: null 
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    }, [tableData]);

    const loadData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/8.4/data`, {
                params: {
                    academicYear: '2024-25',
                    department: 'Computer Engineering'
                }
            });

            if (res.data && res.data.length > 0) {
                const fetchedData = res.data.map((dbRow, index) => {
                    const defaultRow = initialRows[index] || {};
                    return {
                        id: dbRow.row_id || dbRow.rowId || index + 1,
                        srNo: String(dbRow.s_n || dbRow.sr_no || dbRow.srNo || index + 1),
                        point: dbRow.item || dbRow.point || defaultRow.point || '',
                        details: dbRow.details || dbRow.description || dbRow.current_status || '',
                        fileName: dbRow.file_name || dbRow.fileName || dbRow.filePath || dbRow.filename || dbRow.file || null,
                        fileObject: null
                    };
                });
                setTableData(fetchedData);
                setIsSaved(true);
            }
        } catch (err) {
            console.log("Error loading data from API:", err);
        }
    };

    useEffect(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!savedData) {
            loadData();
        }
    }, []);

    const handleAddRow = () => {
        const newId = tableData.length > 0 ? Math.max(...tableData.map(r => r.id)) + 1 : 1;
        const newSrNo = String(tableData.length + 1);

        const newRow = {
            id: newId,
            srNo: newSrNo,
            point: '',
            details: '',
            fileName: null,
            fileObject: null
        };

        setTableData(prev => [...prev, newRow]);
        setIsSaved(false);
    };

    const handleInputChange = (id, field, value) => {
        setTableData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
        setIsSaved(false);
        
        if (errors[`${id}-${field}`]) {
            const newErrors = { ...errors };
            delete newErrors[`${id}-${field}`];
            setErrors(newErrors);
        }
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInBytes = 5 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                alert("File size must be less than 5MB!");
                event.target.value = null;
                return;
            }

            setTableData(prev => prev.map(row => 
                row.id === id ? { ...row, fileName: file.name, fileObject: file } : row
            ));

            setIsSaved(false);

            if (errors[`${id}-file`]) {
                const newErrors = { ...errors };
                delete newErrors[`${id}-file`];
                setErrors(newErrors);
            }
        }
    };

    const handleViewFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);
            window.open(fileURL, '_blank');
        } else if (row.fileName) {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert(`Row ${row.srNo}: No document available for viewing!`);
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
            alert(`Row ${row.srNo}: No document available for download!`);
        }
    };

    const handleSave = async () => {
        if (isSaved) {
            alert("Already saved!");
            return;
        }

        setIsSubmitting(true);
        try {
            for (const row of tableData) {
                const formData = new FormData();
                formData.append("rowId", row.id);
                formData.append("s_n", row.srNo);
                formData.append("item", row.point);
                formData.append("details", row.details);
                formData.append("academicYear", "2024-25");
                formData.append("department", "Computer Engineering");

                if (row.fileObject) {
                    formData.append("file", row.fileObject);
                }

                await axios.post(
                    `${API_BASE_URL}/8.4/submit`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            alert("Saved Successfully");
            setIsSaved(true);
        } catch (err) {
            console.log(err);
            alert("Draft Save Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to clear input data from view and storage?")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setTableData(initialRows);
            setErrors({});
            setIsSaved(false);
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setTableData(initialRows);
            setErrors({});
            setIsSaved(false);
        }
    };

    const readFileContentHTML = async (fileName, fileObj) => {
        let arrayBuffer = null;

        if (fileObj) {
            try {
                arrayBuffer = await fileObj.arrayBuffer();
            } catch (e) {
                console.error("Error reading file object", e);
            }
        }

        if (!arrayBuffer && fileName) {
            try {
                const response = await fetch(`http://localhost:5000/uploads/${fileName}`);
                if (response.ok) {
                    arrayBuffer = await response.arrayBuffer();
                }
            } catch (e) {
                console.warn(`Could not fetch ${fileName} from server`, e);
            }
        }

        const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';

        if (ext === 'docx') {
            if (arrayBuffer && arrayBuffer.byteLength > 0) {
                try {
                    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                    return `<div class="word-parsed-content" style="padding:12px; border:1px solid #cbd5e0; background:#fff; border-radius:4px;">${result.value}</div>`;
                } catch (err) {
                    console.error("Mammoth error:", err);
                }
            }
            return `
                <div style="padding:10px 14px; border:1px solid #cbd5e0; background:#f8fafc; color:#334155; border-radius:6px; margin-top:6px;">
                    <p style="margin:0 0 4px 0; font-weight:bold; font-size:13px; color:#0f172a;">📄 Attached Document: ${fileName || 'Document.docx'}</p>
                    <a href="http://localhost:5000/uploads/${fileName}" target="_blank" style="color:#0284c7; text-decoration:underline; font-size:12px; font-weight:600;">Click here to Open / Download Document</a>
                </div>
            `;
        }

        if (['xlsx', 'xls', 'csv'].includes(ext)) {
            if (arrayBuffer && arrayBuffer.byteLength > 0) {
                try {
                    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const htmlTable = XLSX.utils.sheet_to_html(worksheet);
                    return `<div class="excel-parsed-content" style="overflow-x:auto; padding:8px; border:1px solid #cbd5e0; background:#fff;">${htmlTable}</div>`;
                } catch (err) {
                    console.error("XLSX parse error:", err);
                }
            }
            return `
                <div style="padding:10px 14px; border:1px solid #cbd5e0; background:#f8fafc; color:#334155; border-radius:6px; margin-top:6px;">
                    <p style="margin:0 0 4px 0; font-weight:bold; font-size:13px; color:#0f172a;">📊 Attached Sheet: ${fileName || 'Spreadsheet'}</p>
                    <a href="http://localhost:5000/uploads/${fileName}" target="_blank" style="color:#0284c7; text-decoration:underline; font-size:12px; font-weight:600;">Click here to Open / Download Sheet</a>
                </div>
            `;
        }

        return null;
    };

    const handlePrint = async () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) { 
            alert("Please disable your browser's Pop-up blocker!"); 
            return; 
        }

        printWindow.document.write(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Preparing All NBA Criteria (8.1 to 8.4) Document Report...</h2>
                    <p>Fetching data and compiling report, please wait...</p>
                </body>
            </html>
        `);

        const criteriaList = [
            { main: '8', sub: '8.1.1' },
            { main: '8', sub: '8.1.2' },
            { main: '8', sub: '8.2' },
            { main: '8', sub: '8.3' },
            { main: '8', sub: '8.4' }
        ];

        let filesHTMLArray = [];
        let globalIndex = 0;

        for (const item of criteriaList) {
            const critMain = item.main;
            const critSub = item.sub;
            let sectionData = [];

            try {
                const response = await axios.get(`http://localhost:5000/api/criteria/${critMain}/${critSub}/data`, {
                    params: {
                        academicYear: '2024-25',
                        department: 'Computer Engineering'
                    }
                });

                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    sectionData = response.data;
                }
            } catch (err) {
                console.warn(`API failed for Criteria ${critSub}, checking LocalStorage...`);
            }

            if (!sectionData || sectionData.length === 0) {
                if (critSub === '8.4') {
                    sectionData = tableData;
                } else {
                    const possibleKeys = [
                        `criteria_${critSub.replace(/\./g, '_')}_table_data`,
                        `criteria_${critSub}_table_data`,
                        `criteria${critSub.replace(/\./g, '_')}`,
                        `criteria_${critSub.replace(/\./g, '_')}`,
                        `criteria8_1_table1`,
                        `criteria8_1_table2`
                    ];

                    for (const key of possibleKeys) {
                        const savedLocalData = localStorage.getItem(key);
                        if (savedLocalData) {
                            try {
                                const parsed = JSON.parse(savedLocalData);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    sectionData = parsed;
                                    break;
                                }
                            } catch (e) {
                                console.error(`Error parsing ${key}`, e);
                            }
                        }
                    }
                }
            }

            if (Array.isArray(sectionData) && sectionData.length > 0) {
                for (const row of sectionData) {
                    const pointName = row.point || row.item || row.pointName || row.title || (row.s_n || row.srNo ? `Point ${row.s_n || row.srNo}` : '');
                    const description = row.details || row.description || row.current_status || '';
                    const actualFileName = row.fileName || row.file_name || row.filePath || row.filename || row.file || null;
                    const fileObj = row.fileObject || null;

                    if (!pointName && !description && !actualFileName && !fileObj) {
                        continue;
                    }

                    let previewHTML = '';

                    if (actualFileName || fileObj) {
                        const fileNameToUse = actualFileName || (fileObj ? fileObj.name : "Uploaded Document");
                        const fileURL = fileObj 
                            ? URL.createObjectURL(fileObj) 
                            : `http://localhost:5000/uploads/${fileNameToUse}`;
                        
                        const ext = fileNameToUse.split('.').pop().toLowerCase();

                        if (ext === 'pdf') {
                            previewHTML = `<embed src="${fileURL}" type="application/pdf" class="embed-view" />`;
                        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                            previewHTML = `<img src="${fileURL}" class="img-view" alt="Uploaded Document" />`;
                        } else if (['docx', 'xlsx', 'xls', 'csv'].includes(ext)) {
                            previewHTML = await readFileContentHTML(fileNameToUse, fileObj);
                        } else {
                            previewHTML = `
                                <div style="padding: 12px; background: #f1f5f9; border: 1px dashed #94a3b8; border-radius: 4px;">
                                    <p style="margin:0;"><strong>Uploaded File:</strong> ${fileNameToUse}</p>
                                </div>
                            `;
                        }
                    } else {
                        previewHTML = `<p style="color: #94a3b8; font-style: italic; margin-top: 8px;">No document uploaded for this point.</p>`;
                    }

                    const isFirstPoint = (globalIndex === 0);

                    filesHTMLArray.push(`
                        <div class="file-container ${isFirstPoint ? 'first-item' : ''}">
                            <div class="file-header">
                                <span class="criteria-badge">Criteria ${critSub}</span>
                                <h3 style="margin: 6px 0; color: #0a2540; font-size: 15px;">${pointName || 'Criterion Point'}</h3>
                                ${description ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Description:</strong> ${description}</p>` : ''}
                                ${actualFileName ? `<p style="margin: 4px 0; font-size: 13px;"><strong>File Name:</strong> <span style="color:#0284c7;">${actualFileName}</span></p>` : ''}
                            </div>
                            <div class="file-content">
                                ${previewHTML}
                            </div>
                        </div>
                    `);

                    globalIndex++;
                }
            }
        }

        const filesHTML = filesHTMLArray.length > 0 
            ? filesHTMLArray.join('') 
            : '<div style="text-align:center; margin-top: 50px;"><h3>No data or uploaded documents found across Criteria 8.1 to 8.4.</h3></div>';

        printWindow.document.open();
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>NBA Criteria 8.1 - 8.4 Consolidated Report</title>
                <style>
                    @page { size: A4 portrait; margin: 10mm 12mm; }
                    * { box-sizing: border-box; }
                    html, body { font-family: 'Segoe UI', Arial, sans-serif; padding: 0 !important; margin: 0 !important; color: #333; background: #fff; }
                    .main-header { text-align: center; border-bottom: 2px solid #0a2540; padding-bottom: 6px; margin-bottom: 12px; }
                    .main-header h1 { margin: 0; color: #0a2540; font-size: 18px; text-transform: uppercase; font-weight: 700; }
                    .file-container { margin-bottom: 15px; page-break-before: always !important; break-before: page !important; page-break-inside: avoid !important; break-inside: avoid !important; }
                    .file-container.first-item { page-break-before: avoid !important; break-before: avoid !important; }
                    .file-header { background-color: #f8fafc; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #cbd5e0; border-left: 5px solid #0a2540; }
                    .criteria-badge { display: inline-block; background-color: #0a2540; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                    .embed-view { width: 100%; height: 480px; border: 1px solid #cbd5e0; border-radius: 4px; }
                    .img-view { max-width: 100%; max-height: 420px; display: block; margin: 0 auto; border: 1px solid #cbd5e0; border-radius: 4px; object-fit: contain; }
                    .excel-parsed-content table { border-collapse: collapse; width: 100%; font-size: 11px; }
                    .excel-parsed-content th, .excel-parsed-content td { border: 1px solid #cbd5e0; padding: 4px 8px; text-align: left; }
                    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .embed-view { height: 460px !important; } }
                </style>
            </head>
            <body>
                <div class="main-header">
                    <h1>NBA Criteria (8.1 - 8.4) Document Report</h1>
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
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
                <NBASidebar />
            </div>

            <div style={{ marginLeft: '260px', padding: '16px 20px', boxSizing: 'border-box', minWidth: 'calc(100% - 260px)' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ backgroundColor: '#001a4d', color: '#ffffff', padding: '10px 14px', borderRadius: '6px 6px 0 0' }}>
                        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                            8.4 &nbsp;&nbsp; Improvement in Academic Performance 
                        </h2>
                    </div>

                    {/* Compact Table Container */}
                    <div style={{ background: '#ffffff', padding: '8px', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e0', borderTop: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '11px', border: '1px solid #cbd5e0' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e0' }}>
                                    <th style={{ width: '5%', padding: '5px 4px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540', borderRight: '1px solid #cbd5e0' }}>Sr. No.</th>
                                    <th style={{ width: '32%', padding: '5px 6px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540', borderRight: '1px solid #cbd5e0' }}>Point</th>
                                    <th style={{ width: '35%', padding: '5px 6px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540', borderRight: '1px solid #cbd5e0' }}>Description / Details</th>
                                    <th style={{ width: '28%', padding: '5px 4px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => {
                                    const currentFileName = row.fileObject ? row.fileObject.name : row.fileName;

                                    return (
                                        <tr key={row.id} style={{ borderBottom: '1px solid #cbd5e0', backgroundColor: '#ffffff' }}>
                                            <td style={{ padding: '6px 4px', textAlign: 'center', fontWeight: 'bold', color: '#1e293b', borderRight: '1px solid #cbd5e0' }}>
                                                {row.srNo}
                                            </td>
                                            
                                            <td style={{ padding: '6px', borderRight: '1px solid #cbd5e0', width: '32%' }}>
                                                {index < 3 ? (
                                                    <span style={{ color: '#1e3a8a', fontWeight: '700', lineHeight: '1.2', display: 'block', fontSize: '11px' }}>
                                                        {row.point}
                                                    </span>
                                                ) : (
                                                    <textarea 
                                                        value={row.point} 
                                                        onChange={(e) => handleInputChange(row.id, 'point', e.target.value)} 
                                                        placeholder="Enter Point Title..."
                                                        disabled={isSubmitting}
                                                        rows={1}
                                                        style={{ width: '100%', padding: '3px 5px', borderRadius: '3px', border: errors[`${row.id}-point`] ? '1px solid #ef4444' : '1px solid #cbd5e1', outline: 'none', fontSize: '11px', resize: 'vertical', boxSizing: 'border-box' }}
                                                    />
                                                )}
                                            </td>
                                            
                                            <td style={{ padding: '6px', borderRight: '1px solid #cbd5e0', width: '35%' }}>
                                                <textarea 
                                                    value={row.details} 
                                                    onChange={(e) => handleInputChange(row.id, 'details', e.target.value)} 
                                                    disabled={isSubmitting}
                                                    rows={1}
                                                    placeholder="Enter details..."
                                                    style={{ width: '100%', padding: '3px 5px', borderRadius: '3px', border: errors[`${row.id}-details`] ? '1px solid #ef4444' : '1px solid #cbd5e1', outline: 'none', fontSize: '11px', resize: 'vertical', boxSizing: 'border-box' }}
                                                />
                                            </td>
                                            
                                            <td style={{ padding: '6px 4px', textAlign: 'center', width: '28%' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%' }}>
                                                    
                                                    <input 
                                                        type="file" 
                                                        id={`file-input-84-${row.id}`}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleFileChange(row.id, e)}
                                                        accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.xls,.csv"
                                                        disabled={isSubmitting}
                                                    />

                                                    <button 
                                                        type="button" 
                                                        onClick={() => document.getElementById(`file-input-84-${row.id}`).click()}
                                                        disabled={isSubmitting}
                                                        style={{ 
                                                            backgroundColor: '#f1f5f9', 
                                                            color: '#0f172a', 
                                                            border: '1px solid #cbd5e1', 
                                                            padding: '2px 8px', 
                                                            borderRadius: '3px', 
                                                            cursor: 'pointer', 
                                                            fontSize: '10px', 
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Choose File
                                                    </button>
                                                    
                                                    {currentFileName ? (
                                                        <span 
                                                            title={currentFileName}
                                                            style={{ fontSize: '10px', color: '#475569', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                        >
                                                            📄 {currentFileName}
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>No file chosen</span>
                                                    )}

                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', width: '100%' }}>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleViewFile(row)}
                                                            title="View Document"
                                                            style={{ 
                                                                backgroundColor: '#2563eb', 
                                                                color: '#ffffff', 
                                                                border: 'none', 
                                                                padding: '2px 8px', 
                                                                borderRadius: '3px', 
                                                                cursor: 'pointer', 
                                                                fontSize: '10px', 
                                                                fontWeight: '600',
                                                                opacity: (row.fileObject || row.fileName) ? 1 : 0.5 
                                                            }}
                                                        >
                                                            View
                                                        </button>

                                                        <button 
                                                            type="button"
                                                            onClick={() => handleDownloadFile(row)}
                                                            title="Download Document"
                                                            style={{ 
                                                                backgroundColor: '#16a34a', 
                                                                color: '#ffffff', 
                                                                border: 'none', 
                                                                padding: '2px 6px', 
                                                                borderRadius: '3px', 
                                                                cursor: 'pointer', 
                                                                fontSize: '10px', 
                                                                fontWeight: '600',
                                                                opacity: (row.fileObject || row.fileName) ? 1 : 0.5 
                                                            }}
                                                        >
                                                            Download
                                                        </button>
                                                    </div>

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <button 
                            type="button" 
                            onClick={handleAddRow}
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#2d3748', color: '#ffffff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontWeight: '600', fontSize: '10px' }}
                        >
                            + Add Row
                        </button>
                    </div>

                    {/* Centered Bottom Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', marginTop: '12px', flexWrap: 'wrap' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/8.1')} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            Back
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/8.3')} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            Previous
                        </button>

                        <button 
                            type="button" 
                            onClick={handleSave} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>

                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            Delete
                        </button>

                        <button 
                            type="button" 
                            onClick={handlePrint} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            Generate Report All
                        </button>

                        <button 
                            type="button" 
                            onClick={handleClear} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#f97316', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                            Clear
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Criteria8_4;