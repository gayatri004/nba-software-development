import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria8_3.css";

const API_BASE_URL = "http://localhost:5000/api/criteria/8/8.3";
const LOCAL_STORAGE_KEY = "criteria8_3_tableData";

const Criteria8_3 = () => {
    const navigate = useNavigate();

    // डिफॉल्ट ३ रो
    const initialRows = [
        { 
            id: 1, 
            s_n: '1', 
            item: 'Improvement in the no. faculty with Ph.D.', 
            description: '', 
            fileName: null, 
            fileObject: null 
        },
        { 
            id: 2, 
            s_n: '2', 
            item: 'Improvement in the no. of publications in peer reviewed journals', 
            description: '', 
            fileName: null, 
            fileObject: null 
        },
        { 
            id: 3, 
            s_n: '3', 
            item: 'Improvement in the no. of publications in conferences', 
            description: '', 
            fileName: null, 
            fileObject: null 
        }
    ];

    // 💾 localStorage मधून डेटा लोड करणे किंवा initialRows वापरणे
    const [tableData, setTableData] = useState(() => {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Error parsing local storage data:", e);
                return initialRows;
            }
        }
        return initialRows;
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔄 localStorage मध्ये टेबल डेटा अपडेट करणे (fileObject वगळून JSON मध्ये सेव्ह केले जाते)
    useEffect(() => {
        const dataToSave = tableData.map(({ fileObject, ...rest }) => rest);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, [tableData]);

    // 🔄 डेटाबेसमधून डेटा लोड करणे (जर LocalStorage रिकामे असेल तर)
    const loadData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/data`);

            if (res.data && res.data.length > 0) {
                const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
                // जर लोकल स्टोरेजमध्ये डेटा नसेल, तरच डेटाबेसचा डेटा लोड करा
                if (!savedLocal) {
                    const updatedData = initialRows.map(row => {
                        const dbRow = res.data.find(
                            item => Number(item.row_id || item.rowId) === row.id
                        );

                        if (dbRow) {
                            return {
                                ...row,
                                description: dbRow.current_status || dbRow.description || "",
                                fileName: dbRow.file_name || null,
                                fileObject: null
                            };
                        }
                        return row;
                    });
                    setTableData(updatedData);
                }
            }
        } catch (err) {
            console.log("Error loading data:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // ➕ Add Row Handler
    const handleAddRow = () => {
        const nextId = tableData.length > 0 ? Math.max(...tableData.map(r => r.id)) + 1 : 1;
        const newRow = {
            id: nextId,
            s_n: `${nextId}`,
            item: `Additional Improvement Point ${nextId}`,
            description: '',
            fileName: null,
            fileObject: null
        };
        setTableData(prev => [...prev, newRow]);
    };

    // इनपुट हँडलर
    const handleInputChange = (id, field, value) => {
        setTableData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
        
        if (errors[`${id}-${field}`]) {
            const newErrors = { ...errors };
            delete newErrors[`${id}-${field}`];
            setErrors(newErrors);
        }
    };

    // फाईल अपलोड हँडलर
    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB Limit
            if (file.size > maxSizeInBytes) {
                alert("File size must be less than 5MB!");
                return;
            }

            setTableData(prev => prev.map(row => 
                row.id === id ? { ...row, fileName: file.name, fileObject: file } : row
            ));

            if (errors[`${id}-file`]) {
                const newErrors = { ...errors };
                delete newErrors[`${id}-file`];
                setErrors(newErrors);
            }
        }
    };

    // 👁️ View Function
    const handleViewFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);
            window.open(fileURL, '_blank');
        } else if (row.fileName) {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert(`Row ${row.s_n} has no uploaded file to view!`);
        }
    };

    // 📥 Download Function
    const handleDownloadFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = row.fileName || `document_row_${row.id}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (row.fileName) {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert(`Row ${row.s_n} has no uploaded file to download!`);
        }
    };

    // 📄 File Reader for Print
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

        const ext = (row.fileObject?.name || row.fileName || '').split('.').pop().toLowerCase();

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

    // 🖨️ Print Logic
    const handlePrint = async () => {
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

        for (const row of uploadedRows) {
            const fileURL = row.fileObject 
                ? URL.createObjectURL(row.fileObject) 
                : `http://localhost:5000/uploads/${row.fileName}`;
            
            const fileName = row.fileObject?.name || row.fileName || "Uploaded File";
            const ext = fileName.split('.').pop().toLowerCase();

            let previewHTML = '';

            if (ext === 'pdf') {
                previewHTML = `<embed src="${fileURL}" type="application/pdf" class="embed-view" />`;
            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                previewHTML = `<img src="${fileURL}" class="img-view" alt="Uploaded Document" />`;
            } else if (['docx', 'xlsx', 'xls', 'csv'].includes(ext)) {
                const parsedHTML = await readFileContentHTML(row);
                previewHTML = parsedHTML;
            } else {
                previewHTML = `
                    <div style="padding: 15px; border: 1px dashed #718096; background: #edf2f7; border-radius: 6px;">
                        <p><strong>File Name:</strong> ${fileName}</p>
                    </div>
                `;
            }

            filesHTMLArray.push(`
                <div class="file-container">
                    <div class="file-header">
                        <h2>Point ${row.s_n}: ${row.item}</h2>
                        <p><strong>Description / Details:</strong> ${row.description || 'N/A'}</p>
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
                <title>Criteria 8.3 - Faculty Improvement Documents</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                    .main-header { text-align: center; border-bottom: 2px solid #0a2540; padding-bottom: 10px; margin-bottom: 20px; }
                    .file-container { margin-bottom: 20px; }
                    .file-header { background-color: #f7fafc; padding: 12px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0; border-left: 5px solid #0a2540; }
                    .embed-view { width: 100%; height: 75vh; }
                    .img-view { max-width: 100%; max-height: 80vh; display: block; margin: 0 auto; }
                    .page-break { page-break-after: always; }
                </style>
            </head>
            <body>
                <div class="main-header">
                    <h2>CRITERION 8: FACULTY QUALIFICATION / CONTRIBUTION</h2>
                    <h3>8.3 Improvement in Faculty Qualification/Contribution (15)</h3>
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

    // 💾 Save Draft Handler
    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            for (const row of tableData) {
                const formData = new FormData();
                formData.append("rowId", row.id);
                formData.append("s_n", row.s_n);
                formData.append("item", row.item);
                formData.append("currentStatus", row.description);

                if (row.fileObject) {
                    formData.append("file", row.fileObject);
                }

                await axios.post(`${API_BASE_URL}/submit`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            alert(" Saved Successfully");
        } catch (err) {
            console.log(err);
            alert("Draft Save Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🧹 Clear Action (Clears inputs and LocalStorage)
    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all input fields?")) {
            const clearedData = tableData.map(row => ({
                ...row,
                description: '',
                fileName: null,
                fileObject: null
            }));
            
            setTableData(clearedData);
            setErrors({});

            tableData.forEach(row => {
                const fileInput = document.getElementById(`file-input-${row.id}`);
                if (fileInput) fileInput.value = "";
            });
        }
    };

    // 🗑️ Delete Action (Resets to initial state and clears LocalStorage)
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete and reset the table data?")) {
            setTableData(initialRows);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setErrors({});

            initialRows.forEach(row => {
                const fileInput = document.getElementById(`file-input-${row.id}`);
                if (fileInput) fileInput.value = "";
            });
        }
    };

    return (
        <div className="main-container-72" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
            <NBASidebar />

            <div className="c83-global-container" style={{ flex: 1, padding: '20px' }}>
                <div className="c83-card-wrapper" style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    
                    {/* Header Bar */}
                    <div className="c83-header-action-row" style={{ backgroundColor: '#0B2545', padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '18px', color: '#ffffff' }}>
                            8.3 Improvement in Faculty Qualification/Contribution (15)
                        </span>
                    </div>

                    {/* Table Section */}
                    <div className="c83-grid-container" style={{ padding: '20px 20px 0px 20px' }}>
                        <table className="c83-custom-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                                    <th rowSpan="2" style={{ width: '6%', textAlign: 'center', padding: '12px 8px', color: '#0f172a', fontWeight: '700', borderRight: '1px solid #cbd5e1', fontSize: '14px' }}>Sr. No.</th>
                                    <th rowSpan="2" style={{ width: '32%', padding: '12px 10px', color: '#0f172a', fontWeight: '700', borderRight: '1px solid #cbd5e1', textAlign: 'left', fontSize: '14px' }}>Point</th>
                                    <th rowSpan="2" style={{ width: '38%', textAlign: 'center', padding: '12px 10px', color: '#0f172a', fontWeight: '700', borderRight: '1px solid #cbd5e1', fontSize: '14px' }}>Description / Details</th>
                                    <th colSpan="3" style={{ width: '24%', textAlign: 'center', padding: '10px 8px', color: '#0f172a', fontWeight: '700', borderBottom: '1px solid #cbd5e1', fontSize: '14px' }}>Action</th>
                                </tr>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                                    <th style={{ width: '8%', textAlign: 'center', padding: '8px 4px', color: '#1e293b', fontSize: '13px', fontWeight: '600', borderRight: '1px solid #cbd5e1' }}>View</th>
                                    <th style={{ width: '8%', textAlign: 'center', padding: '8px 4px', color: '#1e293b', fontSize: '13px', fontWeight: '600', borderRight: '1px solid #cbd5e1' }}>Upload</th>
                                    <th style={{ width: '8%', textAlign: 'center', padding: '8px 4px', color: '#1e293b', fontSize: '13px', fontWeight: '600' }}>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#1e293b', padding: '12px 8px', borderRight: '1px solid #e2e8f0' }}>{row.s_n}</td>
                                        <td style={{ color: '#334155', padding: '12px 10px', borderRight: '1px solid #e2e8f0', fontSize: '13px', lineHeight: '1.4' }}>{row.item}</td>
                                        <td style={{ padding: '10px', borderRight: '1px solid #e2e8f0' }}>
                                            <textarea 
                                                rows="2"
                                                className={`c83-cell-input ${errors[`${row.id}-description`] ? 'input-error' : ''}`} 
                                                value={row.description} 
                                                onChange={(e) => handleInputChange(row.id, 'description', e.target.value)} 
                                                placeholder="Enter details..."
                                                disabled={isSubmitting}
                                                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
                                            />
                                            {(row.fileName || row.fileObject) && (
                                                <div style={{ marginTop: '4px', fontSize: '11px', color: '#16a34a', fontWeight: '600', textAlign: 'right' }}>
                                                    📄 {row.fileObject ? row.fileObject.name : row.fileName}
                                                </div>
                                            )}
                                        </td>
                                        
                                        {/* View Button */}
                                        <td style={{ textAlign: 'center', padding: '8px 4px', borderRight: '1px solid #e2e8f0' }}>
                                            <button 
                                                type="button" 
                                                onClick={() => handleViewFile(row)}
                                                title="View Document"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: '2px' }}
                                            >
                                                <span style={{ fontSize: '18px', filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))' }}>👁️</span>
                                            </button>
                                        </td>

                                        {/* Upload Button */}
                                        <td style={{ textAlign: 'center', padding: '8px 4px', borderRight: '1px solid #e2e8f0' }}>
                                            <input 
                                                type="file" 
                                                id={`file-input-${row.id}`}
                                                accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.xls,.csv"
                                                onChange={(e) => handleFileChange(row.id, e)}
                                                style={{ display: 'none' }}
                                                disabled={isSubmitting}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => document.getElementById(`file-input-${row.id}`).click()}
                                                disabled={isSubmitting}
                                                title="Upload Document"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: '2px' }}
                                            >
                                                <span style={{ fontSize: '18px', filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))' }}>📘</span>
                                            </button>
                                        </td>

                                        {/* Download Button */}
                                        <td style={{ textAlign: 'center', padding: '8px 4px' }}>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDownloadFile(row)}
                                                title="Download Document"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: '2px' }}
                                            >
                                                <span style={{ fontSize: '18px', filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))' }}>📕</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* + Add Row Button */}
                        <div style={{ marginTop: '12px', marginBottom: '15px' }}>
                            <button 
                                type="button" 
                                onClick={handleAddRow}
                                style={{ backgroundColor: '#2d3748', color: '#fff', padding: '6px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                            >
                                + Add Row
                            </button>
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="c83-footer-controls" style={{ 
                        padding: '10px 20px 20px 20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        gap: '6px'
                    }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/8.2')} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#E65100', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                            Previous
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/8.2')}
                            style={{ backgroundColor: '#37474F', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                            Back
                        </button>

                        <button 
                            type="button" 
                            onClick={handleSave} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#2E7D32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                            {isSubmitting ? "⏳ Saving..." : " Save "}
                        </button>

                        <button 
                            type="button" 
                            onClick={handleClear} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                             Clear
                        </button>

                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                             Delete
                        </button>

                        <button 
                            type="button" 
                            onClick={handlePrint} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                             Print
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/8.4')} 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#00695c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}
                        >
                            Next 
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Criteria8_3;