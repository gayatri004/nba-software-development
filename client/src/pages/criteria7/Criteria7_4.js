import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria7_4.css";

const Criteria7_4 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.4";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;
    const LOCAL_STORAGE_KEY = `criteria_7_4_draft_data`;

    // Header States
    const [academicYear] = useState("2024-25");
    const [department] = useState("Computer Engineering");
    const [program] = useState("B.E. Computer Engineering");

    // Track Save Status
    const [isSaved, setIsSaved] = useState(false);

    // Initial table points for Criteria 7.4
    const getInitialTableData = () => [
        { 
            id: 1, 
            s_n: 1, 
            point: 'Project laboratory', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 2, 
            s_n: 2, 
            point: 'Safety measures in laboratories', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 3, 
            s_n: 3, 
            point: 'Facility for design/development activities', 
            description: '', 
            fileObject: null, 
            fileName: null 
        }
    ];

    // State initialization with LocalStorage check
    const [tableData, setTableData] = useState(() => {
        const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedLocal) {
            try {
                return JSON.parse(savedLocal);
            } catch (e) {
                console.error("Error parsing local data", e);
            }
        }
        return getInitialTableData();
    });

    // Save to LocalStorage whenever tableData changes
    useEffect(() => {
        // Save minimal version to LocalStorage (fileObject cannot be stringified)
        const cacheData = tableData.map(row => ({
            id: row.id,
            s_n: row.s_n,
            point: row.point,
            description: row.description,
            fileName: row.fileName
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cacheData));
    }, [tableData]);

    // Fetch saved data from backend API on initial render if available
    useEffect(() => {
        const fetchSavedData = async () => {
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
                    setIsSaved(true);
                }
            } catch (err) {
                console.error("Error fetching data from server:", err);
            }
        };
        fetchSavedData();
    }, [API_BASE_URL, academicYear, department, program]);

    // Add row to table
    const handleAddRow = () => {
        setIsSaved(false);
        setTableData(prev => {
            const nextId = prev.length > 0 ? Math.max(...prev.map(row => row.id)) + 1 : 1;
            const nextSn = prev.length + 1;
            return [
                ...prev,
                {
                    id: nextId,
                    s_n: nextSn,
                    point: '', 
                    description: '',
                    fileObject: null,
                    fileName: null
                }
            ];
        });
    };

    const handleInputChange = (id, field, value) => {
        setIsSaved(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            setIsSaved(false);
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

    const resetTableForm = () => {
        const initial = getInitialTableData();
        setTableData(initial);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setIsSaved(false);
    };

    // Save Draft to Server Handler
    const saveToServer = async () => {
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

            setIsSaved(true);
            alert(" saved successfully! 💾");
            return true;

        } catch (err) {
            console.error(err);
            alert("Process Failed. Please try again.");
            return false;
        }
    };

    // Direct Navigation
    const handleNavigation = (targetPath) => {
        navigate(targetPath);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to clear data from frontend view?")) {
            resetTableForm();
            alert("Data cleared successfully!");
        }
    };

    // Parse file contents for print view
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

        const fileName = row.fileName || (row.fileObject ? row.fileObject.name : '');
        const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';

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

    // Print functionality
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

        printWindow.document.write(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h3>Processing uploaded files for preview... Please wait.</h3>
                </body>
            </html>
        `);

        const filesHTMLArray = [];

        for (let i = 0; i < uploadedRows.length; i++) {
            const row = uploadedRows[i];
            const fileURL = row.fileObject 
                ? URL.createObjectURL(row.fileObject) 
                : `http://localhost:5000/uploads/${row.fileName}`;
            
            const fileName = row.fileName || (row.fileObject ? row.fileObject.name : "Uploaded File");
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
                previewHTML = parsedHTML || `<p>Unable to render content.</p>`;
            } 
            else {
                previewHTML = `
                    <div style="padding: 15px; border: 1px dashed #718096; background: #edf2f7; border-radius: 6px;">
                        <p><strong>File Name:</strong> ${fileName}</p>
                    </div>
                `;
            }

            const isFirstItem = i === 0;

            filesHTMLArray.push(`
                <div class="file-container ${!isFirstItem ? 'page-break-before' : ''}">
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

        const filesHTML = filesHTMLArray.join('');

        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Criteria 7.4 - Project Laboratory and Safety Measures</title>
                <style>
                    * { box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 15px; color: #333; background: #fff; margin: 0; }
                    .main-header { text-align: center; border-bottom: 2px solid #0a2540; padding-bottom: 8px; margin-bottom: 15px; }
                    .main-header h2 { margin: 0; color: #0a2540; font-size: 18px; }
                    .file-container { margin-bottom: 15px; }
                    .page-break-before { page-break-before: always; break-before: page; }
                    .file-header { background-color: #f7fafc; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e2e8f0; border-left: 5px solid #0a2540; }
                    .embed-view { width: 100%; height: 70vh; border: 1px solid #cbd5e0; }
                    .img-view { max-width: 100%; max-height: 75vh; display: block; margin: 0 auto; }
                    @media print {
                        body { padding: 0; }
                        .embed-view { height: 82vh; }
                        .page-break-before { page-break-before: always; break-before: page; }
                    }
                </style>
            </head>
            <body>
                <div class="main-header">
                    <h2>CRITERION 7: FACILITIES AND TECHNICAL SUPPORT</h2>
                    <h3>7.4: Project Laboratory and Safety Measures</h3>
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
        <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#eef2f6' }}>
            
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                <NBASidebar />
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '24px', boxSizing: 'border-box' }}>
                
                {/* Banner Header */}
                <div style={{ 
                    backgroundColor: '#0c1b40', 
                    color: '#fff', 
                    padding: '14px 20px', 
                    borderRadius: '8px 8px 0 0', 
                    fontWeight: '600', 
                    fontSize: '16px' 
                }}>
                    7.4 Project Laboratory and Safety Measures (10)
                </div>

                {/* Content Box */}
                <div style={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '0 0 8px 8px', 
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    
                    {/* Data Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e0' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#dce8f5' }}>
                                <th rowSpan="2" style={{ width: '8%', padding: '12px 6px', border: '1px solid #cbd5e0', fontSize: '14px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>Sr. No.</th>
                                <th rowSpan="2" style={{ width: '34%', padding: '12px 10px', border: '1px solid #cbd5e0', fontSize: '14px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>Point</th>
                                <th rowSpan="2" style={{ width: '44%', padding: '12px 10px', border: '1px solid #cbd5e0', fontSize: '14px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>Description / Details</th>
                                <th colSpan="3" style={{ width: '14%', padding: '8px', border: '1px solid #cbd5e0', fontSize: '14px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>Action</th>
                            </tr>
                            <tr style={{ backgroundColor: '#dce8f5' }}>
                                <th style={{ padding: '6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>View</th>
                                <th style={{ padding: '6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>Upload</th>
                                <th style={{ padding: '6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#0c1b40', fontWeight: 'bold' }}>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    
                                    {/* Sr. No. */}
                                    <td style={{ fontWeight: '600', textAlign: 'center', padding: '10px 6px', fontSize: '13px', borderRight: '1px solid #e2e8f0' }}>
                                        {row.s_n}
                                    </td>

                                    {/* Point Input */}
                                    <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}>
                                        <textarea 
                                            rows="2"
                                            value={row.point} 
                                            onChange={(e) => handleInputChange(row.id, 'point', e.target.value)} 
                                            placeholder="Enter Point..."
                                            style={{ 
                                                width: '100%', 
                                                height: '50px', 
                                                padding: '8px', 
                                                border: '1px solid #cbd5e0', 
                                                borderRadius: '6px', 
                                                resize: 'vertical', 
                                                fontSize: '13px', 
                                                boxSizing: 'border-box',
                                                color: '#1a202c',
                                                fontWeight: row.id <= 3 ? 'bold' : 'normal'
                                            }}
                                        />
                                    </td>

                                    {/* Description Input */}
                                    <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}>
                                        <textarea 
                                            rows="2"
                                            value={row.description} 
                                            onChange={(e) => handleInputChange(row.id, 'description', e.target.value)} 
                                            placeholder="Enter description here..."
                                            style={{ 
                                                width: '100%', 
                                                height: '50px', 
                                                padding: '8px', 
                                                border: '1px solid #cbd5e0', 
                                                borderRadius: '6px', 
                                                resize: 'vertical', 
                                                fontSize: '13px', 
                                                boxSizing: 'border-box' 
                                            }}
                                        />
                                    </td>

                                    {/* Action: View */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', padding: '6px' }}>
                                        <button 
                                            type="button" 
                                            title="View File"
                                            onClick={() => handleViewFile(row)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                        >
                                            👁️
                                        </button>
                                    </td>

                                    {/* Action: Upload */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', padding: '6px' }}>
                                        <input 
                                            type="file" 
                                            id={`file-input-74-${row.id}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(row.id, e)}
                                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv"
                                        />
                                        <button 
                                            type="button" 
                                            title={row.fileName ? `Uploaded: ${row.fileName}` : "Upload File"}
                                            onClick={() => document.getElementById(`file-input-74-${row.id}`).click()}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                        >
                                            {row.fileName ? '✅' : '📤'}
                                        </button>
                                    </td>

                                    {/* Action: Download */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '6px' }}>
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

                    {/* Add Row Button */}
                    <div style={{ marginTop: '16px', marginBottom: '20px' }}>
                        <button 
                            type="button" 
                            onClick={handleAddRow}
                            style={{ 
                                padding: '8px 18px', 
                                backgroundColor: '#5c59e8', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 4px rgba(92, 89, 232, 0.3)'
                            }}
                        >
                            ➕ Add Row
                        </button>
                    </div>

                    {/* Action & Navigation Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        justify: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'nowrap',
                        overflowX: 'auto',
                        gap: '10px',
                        borderTop: '1px solid #edf2f7',
                        paddingTop: '16px'
                    }}>
                        
                        {/* Save, Delete, Print, Clear */}
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                            <button 
                                type="button" 
                                onClick={saveToServer}
                                style={{ padding: '8px 14px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                 Save 
                            </button>

                            <button 
                                type="button" 
                                onClick={handleDelete}
                                style={{ padding: '8px 14px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                 Delete
                            </button>

                            <button 
                                type="button" 
                                onClick={handlePrintUploadedFile}
                                style={{ padding: '8px 14px', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                 Print
                            </button>

                            <button 
                                type="button" 
                                onClick={resetTableForm}
                                style={{ padding: '8px 14px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                 Clear
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                            <button 
                                type="button" 
                                onClick={() => handleNavigation('/criteria/7.1')}
                                style={{ padding: '8px 14px', backgroundColor: '#2d3748', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                Back
                            </button>

                            <button 
                                type="button" 
                                onClick={() => handleNavigation('/criteria/7.3')}
                                style={{ padding: '8px 14px', backgroundColor: '#E65100', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                 Previous
                            </button>

                            <button 
                                type="button" 
                                onClick={() => handleNavigation('/criteria/7.5')}
                                style={{ padding: '8px 14px', backgroundColor: '#00695c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' }}
                            >
                                Next 
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Criteria7_4;