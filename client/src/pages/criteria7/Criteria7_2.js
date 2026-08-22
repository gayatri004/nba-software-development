import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria7_2.css";

const LOCAL_STORAGE_KEY = "criteria_7_2_draft_data";

const Criteria7_2 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.2";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;

    // Default parameters for backend queries
    const academicYear = "2024-25";
    const department = "Computer Engineering";
    const program = "B.E. Computer Engineering";

    // 🎯 Initial Table Data
    const getInitialTableData = () => [
        { 
            id: 1, 
            s_n: 1, 
            point: 'Availability and relevance of additional facilities', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 2, 
            s_n: 2, 
            point: 'Utilization and effectiveness of facilities', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 3, 
            s_n: 3, 
            point: 'Relevance to POs/PSOs', 
            description: '', 
            fileObject: null, 
            fileName: null 
        }
    ];

    const [tableData, setTableData] = useState(() => {
        // First preference: Load unsaved / active draft from Local Storage
        const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localDraft) {
            try {
                const parsed = JSON.parse(localDraft);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse local draft", e);
            }
        }
        return getInitialTableData();
    });

    const [isSavedOrSubmitted, setIsSavedOrSubmitted] = useState(false);

    // 🔄 डेटाबेसमधून डेटा लोड करणे (जर LocalStorage मध्ये काही नसेल तर DB मधून लोड होईल)
    useEffect(() => {
        const fetchSavedData = async () => {
            const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (localDraft) return; // जर लोकल ड्राफ्ट असेल तर DB कॉल स्किप करा

            try {
                const res = await axios.get(`${API_BASE_URL}/data`, {
                    params: { academicYear, department, program }
                });
                if (res.data && res.data.length > 0) {
                    const loadedData = res.data.map((dbRow, index) => ({
                        id: dbRow.row_id || index + 1,
                        s_n: index + 1,
                        point: dbRow.item || `Point ${index + 1}`,
                        description: dbRow.current_status || '',
                        fileName: dbRow.file_name || null,
                        fileObject: null
                    }));
                    setTableData(loadedData);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadedData));
                }
            } catch (err) {
                console.error("Error occurred:", err);
            }
        };

        fetchSavedData();
    }, [API_BASE_URL]);

    // 💾 ऑटो-सेव्ह स्टेट टू LocalStorage (डेटा गहाळ न होण्यासाठी)
    useEffect(() => {
        // fileObject मॅप मधून काढून लोकल स्टोरेज मध्ये सेव्ह करणे (कारण File obj serialize होत नाही)
        const serializableData = tableData.map(row => ({
            ...row,
            fileObject: null 
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableData));
    }, [tableData]);

    // ➕ Add Row Handler
    const handleAddRow = () => {
        setIsSavedOrSubmitted(false);
        setTableData(prev => {
            const newId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
            const newSn = prev.length + 1;
            return [
                ...prev,
                {
                    id: newId,
                    s_n: newSn,
                    point: 'New Additional Facility / Point',
                    description: '',
                    fileObject: null,
                    fileName: null
                }
            ];
        });
    };

    const handleInputChange = (id, field, value) => {
        setIsSavedOrSubmitted(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            setIsSavedOrSubmitted(false);
            setTableData(prev => prev.map(row => row.id === id ? { 
                ...row, 
                fileName: file.name,
                fileObject: file 
            } : row));
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
            link.download = row.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (row.fileName) {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert("No file available for download!");
        }
    };

    const validateFormData = () => {
        for (const row of tableData) {
            if (!row.description.trim()) { 
                alert(`Please fill in the description for Sr. No. ${row.s_n}.`); 
                return false; 
            }
        }
        return true;
    };

    const resetTableForm = () => {
        const initial = getInitialTableData();
        setTableData(initial);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setIsSavedOrSubmitted(false);
    };

    // 🚀 Navigation Handlers
    const handlePrevious = () => {
        navigate('/criteria/7.1');
    };

    const handleNext = () => {
        navigate('/criteria/7.3');
    };

    // 💾 Save Logic
    const saveToServer = async (isFinalSubmit = false) => {
        if (isSavedOrSubmitted) {
            alert("Data is already saved!");
            return;
        }

        if (isFinalSubmit && !validateFormData()) return;

        try {
            for (const row of tableData) {
                const formData = new FormData();
                formData.append("rowId", row.id);
                formData.append("s_n", row.s_n);
                formData.append("item", row.point);
                formData.append("currentStatus", row.description);
                formData.append("academicYear", academicYear);
                formData.append("department", department);
                formData.append("program", program);

                if (row.fileObject) {
                    formData.append("file", row.fileObject);
                }

                await axios.post(`${API_BASE_URL}/submit`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            setIsSavedOrSubmitted(true);
            alert(" saved successfully! 💾");

        } catch (err) {
            console.error(err);
            alert("Process Failed. Please try again.");
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to clear table data from screen? (Database record will not be deleted)")) {
            resetTableForm();
            alert("Frontend data cleared!");
        }
    };

    const handleClear = () => {
        resetTableForm();
    };

    // 📄 Helper Function to read Word & Excel files
    const readFileContentHTML = async (row) => {
        let fileBlob = row.fileObject;

        if (!fileBlob && row.fileName) {
            try {
                const response = await fetch(`http://localhost:5000/uploads/${row.fileName}`);
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

    // 🖨️ Print Handler Function
    const handlePrintUploadedFile = async () => {
        const uploadedRows = tableData.filter(row => row.fileObject || row.fileName);

        if (uploadedRows.length === 0) {
            alert("No uploaded files found to print!");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) { 
            alert("Please disable your browser's Pop-up blocker!"); 
            return; 
        }

        printWindow.document.write('<html><body><h3 style="font-family:sans-serif; text-align:center; margin-top:50px;">Processing uploaded files for preview... Please wait.</h3></body></html>');

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
                        <p style="color: #e53e3e; font-size: 13px;">Note: Older .doc files cannot be rendered directly in browser.</p>
                    </div>
                `;
            }

            filesHTMLArray.push(`
                <div class="file-container">
                    <div class="file-header">
                        <h2>Point ${row.s_n}: ${row.point}</h2>
                        <p><strong>Description:</strong> ${row.description || 'N/A'}</p>
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
                <title>Criteria 7.2 - Additional Facilities Documents</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; background: #fff; margin: 0; }
                    .main-header { text-align: center; border-bottom: 2px solid #0a2540; padding-bottom: 10px; margin-bottom: 20px; page-break-after: avoid; }
                    .file-container { margin-bottom: 20px; }
                    .file-header { background-color: #f7fafc; padding: 12px 16px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0; border-left: 5px solid #0a2540; page-break-after: avoid; }
                    .file-header h2 { margin: 0 0 6px 0; font-size: 16px; color: #0a2540; }
                    .file-header p { margin: 3px 0; font-size: 13px; color: #4a5568; }
                    .embed-view { width: 100%; height: 75vh; border: 1px solid #cbd5e0; border-radius: 4px; }
                    .img-view { max-width: 100%; max-height: 80vh; display: block; margin: 0 auto; border: 1px solid #cbd5e0; border-radius: 4px; }
                    .word-parsed-content { padding: 20px; border: 1px solid #cbd5e0; background: #ffffff; border-radius: 6px; line-height: 1.6; font-size: 14px; }
                    .excel-parsed-content { overflow-x: auto; }
                    .excel-parsed-content table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
                    .excel-parsed-content th, .excel-parsed-content td { border: 1px solid #cbd5e0; padding: 8px 10px; text-align: left; }
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
                    <h2>CRITERION 7: FACILITIES AND TECHNICAL SUPPORT</h2>
                    <h3>7.2: Additional Facilities Created for Improving the Quality of Learning Experience in Laboratories</h3>
                </div>
                ${filesHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 1200);
    };

    const buttonStyle = {
        padding: '8px 14px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div className="main-container-72" style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            
            <div style={{ flexShrink: 0 }}>
                <NBASidebar />
            </div>

            <div className="criteria-main-layout-72" style={{ padding: '20px', flex: 1, overflowX: 'hidden' }}>
                <div className="container-72" style={{ maxWidth: '100%' }}>
                    
                    <div style={{ backgroundColor: '#0a2540', color: '#fff', padding: '12px 20px', borderRadius: '6px 6px 0 0', fontWeight: 'bold', fontSize: '15px' }}>
                        7.2 Additional Facilities Created for Improving the Quality of Learning Experience in Laboratories (20)
                    </div>

                    <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 6px 6px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th rowSpan="2" style={{ width: '6%', textAlign: 'center', padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#4a5568', fontSize: '14px' }}>Sr. No.</th>
                                    <th rowSpan="2" style={{ width: '38%', textAlign: 'center', padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#4a5568', fontSize: '14px' }}>Point</th>
                                    <th rowSpan="2" style={{ width: '38%', textAlign: 'center', padding: '12px 8px', borderRight: '1px solid #e2e8f0', color: '#4a5568', fontSize: '14px' }}>Description</th>
                                    <th colSpan="3" style={{ width: '18%', textAlign: 'center', padding: '6px 4px', borderBottom: '1px solid #e2e8f0', color: '#4a5568', fontSize: '14px' }}>Action</th>
                                </tr>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <th style={{ textAlign: 'center', padding: '6px 2px', borderRight: '1px solid #e2e8f0', fontSize: '12px', color: '#718096' }}>View</th>
                                    <th style={{ textAlign: 'center', padding: '6px 2px', borderRight: '1px solid #e2e8f0', fontSize: '12px', color: '#718096' }}>Upload</th>
                                    <th style={{ textAlign: 'center', padding: '6px 2px', fontSize: '12px', color: '#718096' }}>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', borderRight: '1px solid #edf2f7', verticalAlign: 'middle' }}>{row.s_n}</td>
                                        
                                        <td style={{ padding: '10px', borderRight: '1px solid #edf2f7', verticalAlign: 'middle' }}>
                                            <textarea 
                                                rows="2"
                                                value={row.point} 
                                                onChange={(e) => handleInputChange(row.id, 'point', e.target.value)} 
                                                placeholder="Enter point title..."
                                                style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px', resize: 'none', boxSizing: 'border-box', fontSize: '13px', fontWeight: 'bold' }}
                                            />
                                        </td>

                                        <td style={{ padding: '10px', borderRight: '1px solid #edf2f7', verticalAlign: 'middle' }}>
                                            <textarea 
                                                rows="2"
                                                value={row.description} 
                                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)} 
                                                placeholder="Enter details..."
                                                style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px', resize: 'none', boxSizing: 'border-box', fontSize: '13px' }}
                                            />
                                        </td>

                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #edf2f7', padding: '4px' }}>
                                            <button 
                                                type="button" 
                                                title="View File"
                                                onClick={() => handleViewFile(row)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                            >
                                                👁️
                                            </button>
                                        </td>

                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #edf2f7', padding: '4px' }}>
                                            <input 
                                                type="file" 
                                                id={`file-input-72-${row.id}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(row.id, e)}
                                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                                            />
                                            <button 
                                                type="button" 
                                                title={row.fileName ? `Uploaded: ${row.fileName}` : "Upload File"}
                                                onClick={() => document.getElementById(`file-input-72-${row.id}`).click()}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                            >
                                                {row.fileName ? '✅' : '📤'}
                                            </button>
                                            
                                            {row.fileName && (
                                                <div style={{ fontSize: '10px', color: '#2f855a', fontWeight: 'bold', marginTop: '2px', wordBreak: 'break-all' }}>
                                                    {row.fileName.length > 8 ? row.fileName.substring(0, 8) + '...' : row.fileName}
                                                </div>
                                            )}
                                        </td>

                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '4px' }}>
                                            <button 
                                                type="button" 
                                                title="Download File"
                                                onClick={() => handleDownloadFile(row)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                            >
                                                📥
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <button 
                            type="button" 
                            onClick={handleAddRow}
                            style={{ 
                                padding: '8px 16px', 
                                backgroundColor: '#2b6cb0', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            ➕ Add Row
                        </button>
                    </div>

                    <div style={{ 
                        marginTop: '20px', 
                        display: 'flex', 
                        gap: '8px', 
                        alignItems: 'center', 
                        justifyContent: 'flex-start',
                        width: '100%',
                        flexWrap: 'nowrap'
                    }}>
                        <button 
                            type="button" 
                            onClick={handlePrevious}
                            style={{ ...buttonStyle, backgroundColor: '#E65100' }}
                        >
                             Previous
                        </button>

                        <button 
                            type="button" 
                            onClick={() => saveToServer(false)}
                            style={{ ...buttonStyle, backgroundColor: '#2E7D32' }}
                        >
                             Save 
                        </button>

                        <button 
                            type="button" 
                            onClick={handleDelete}
                            style={{ ...buttonStyle, backgroundColor: '#e53e3e' }}
                        >
                             Delete
                        </button>

                        <button 
                            type="button" 
                            onClick={handlePrintUploadedFile}
                            style={{ ...buttonStyle, backgroundColor: '#805ad5' }}
                        >
                             Print
                        </button>

                        <button 
                            type="button" 
                            onClick={handleClear}
                            style={{ ...buttonStyle, backgroundColor: '#dd6b20' }}
                        >
                             Clear
                        </button>

                        <button 
                            type="button" 
                            onClick={handleNext}
                            style={{ ...buttonStyle, backgroundColor: '#00695c' }}
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