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

    useEffect(() => {
        const dataToSave = tableData.map(({ fileObject, ...rest }) => rest);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, [tableData]);

    const loadData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/data`);
            if (res.data && res.data.length > 0) {
                const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
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

    const handleInputChange = (id, field, value) => {
        setTableData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
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
                return;
            }
            setTableData(prev => prev.map(row => 
                row.id === id ? { ...row, fileName: file.name, fileObject: file } : row
            ));
        }
    };

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

    const readFileContentHTML = async (row) => {
        let fileBlob = row.fileObject;
        if (!fileBlob && row.fileName) {
            try {
                const response = await fetch(`http://localhost:5000/uploads/${row.fileName}`);
                fileBlob = await response.blob();
            } catch (e) {
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
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                return `<div class="excel-parsed-content">${XLSX.utils.sheet_to_html(worksheet)}</div>`;
            } catch (err) {
                return `<p style="color:red;">Failed to parse Excel file: ${err.message}</p>`;
            }
        }
        return null;
    };

    const handlePrint = async () => {
        const uploadedRows = tableData.filter(row => row.fileObject || row.fileName);
        if (uploadedRows.length === 0) {
            alert("No uploaded files found to print!");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) { alert("Please disable pop-up blocker!"); return; }

        printWindow.document.write('<h3>Processing files for preview... Please wait.</h3>');
        const filesHTMLArray = [];

        for (const row of uploadedRows) {
            const fileURL = row.fileObject ? URL.createObjectURL(row.fileObject) : `http://localhost:5000/uploads/${row.fileName}`;
            const fileName = row.fileObject?.name || row.fileName || "Uploaded File";
            const ext = fileName.split('.').pop().toLowerCase();
            let previewHTML = '';

            if (ext === 'pdf') {
                previewHTML = `<embed src="${fileURL}" type="application/pdf" style="width:100%; height:75vh;" />`;
            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                previewHTML = `<img src="${fileURL}" style="max-width:100%; max-height:80vh; display:block; margin:0 auto;" />`;
            } else if (['docx', 'xlsx', 'xls', 'csv'].includes(ext)) {
                previewHTML = await readFileContentHTML(row);
            } else {
                previewHTML = `<p>File Name: ${fileName}</p>`;
            }

            filesHTMLArray.push(`
                <div style="margin-bottom: 20px;">
                    <div style="background:#f7fafc; padding:12px; border:1px solid #cbd5e0; border-left:5px solid #0a2540; margin-bottom:10px;">
                        <h3>Point ${row.s_n}: ${row.item}</h3>
                        <p><strong>Description:</strong> ${row.description || 'N/A'}</p>
                    </div>
                    <div>${previewHTML}</div>
                </div>
                <div style="page-break-after: always;"></div>
            `);
        }

        printWindow.document.open();
        printWindow.document.write(`<html><head><title>Print Preview</title></head><body>${filesHTMLArray.join('')}</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 1000);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            for (const row of tableData) {
                const formData = new FormData();
                formData.append("rowId", row.id);
                formData.append("s_n", row.s_n);
                formData.append("item", row.item);
                formData.append("currentStatus", row.description);
                if (row.fileObject) formData.append("file", row.fileObject);

                await axios.post(`${API_BASE_URL}/submit`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            alert("Saved Successfully");
        } catch (err) {
            console.log(err);
            alert("Draft Save Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all input fields?")) {
            setTableData(tableData.map(row => ({ ...row, description: '', fileName: null, fileObject: null })));
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to reset table data?")) {
            setTableData(initialRows);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
            <NBASidebar />

            <div style={{ flex: 1, marginLeft: '260px', padding: '20px', boxSizing: 'border-box' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    
                    {/* Header Bar */}
                    <div style={{ backgroundColor: '#0a2540', padding: '12px 18px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffffff' }}>
                            8.3 Improvement in Faculty Qualification/Contribution 
                        </span>
                    </div>

                    {/* Table Section */}
                    <div style={{ padding: '15px' }}>
                        <div style={{ background: '#ffffff', padding: '8px', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e0', borderTop: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '11px', border: '1px solid #cbd5e0' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e0' }}>
                                        <th style={{ width: '5%', padding: '6px 4px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540', borderRight: '1px solid #cbd5e0' }}>Sr. No.</th>
                                        <th style={{ width: '39%', padding: '6px 8px', fontWeight: 'bold', textAlign: 'left', color: '#0a2540', borderRight: '1px solid #cbd5e0' }}>Point</th>
                                        <th style={{ width: '38%', padding: '6px 8px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540', borderRight: '1px solid #cbd5e0' }}>Description / Details</th>
                                        <th style={{ width: '18%', padding: '6px 6px', fontWeight: 'bold', textAlign: 'center', color: '#0a2540' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row) => (
                                        <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#1e293b', padding: '6px 4px', borderRight: '1px solid #e2e8f0', verticalAlign: 'middle' }}>
                                                {row.s_n}
                                            </td>
                                            <td style={{ color: '#334155', padding: '6px 8px', borderRight: '1px solid #e2e8f0', verticalAlign: 'middle', lineHeight: '1.3' }}>
                                                {row.item}
                                            </td>
                                            
                                            {/* Description Column */}
                                            <td style={{ padding: '6px 8px', borderRight: '1px solid #e2e8f0', verticalAlign: 'middle', textAlign: 'center' }}>
                                                <textarea 
                                                    rows="1"
                                                    value={row.description} 
                                                    onChange={(e) => handleInputChange(row.id, 'description', e.target.value)} 
                                                    placeholder="Enter details..."
                                                    disabled={isSubmitting}
                                                    style={{ width: '100%', padding: '4px 6px', borderRadius: '3px', border: '1px solid #cbd5e0', resize: 'vertical', fontSize: '11px', outline: 'none', fontFamily: 'inherit', textAlign: 'center' }}
                                                />
                                            </td>

                                            {/* Action Column */}
                                            <td style={{ padding: '6px 6px', verticalAlign: 'middle' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', width: '100%' }}>
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
                                                        style={{ backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e0', padding: '3px 8px', borderRadius: '3px', cursor: 'pointer', fontWeight: '600', fontSize: '10px' }}
                                                    >
                                                        Choose File
                                                    </button>

                                                    {(row.fileName || row.fileObject) && (
                                                        <div 
                                                            title={row.fileObject ? row.fileObject.name : row.fileName}
                                                            style={{ fontSize: '10px', color: '#475569', fontWeight: '500', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                        >
                                                            📄 {row.fileObject ? row.fileObject.name : row.fileName}
                                                        </div>
                                                    )}

                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleViewFile(row)}
                                                            disabled={!row.fileObject && !row.fileName}
                                                            style={{ backgroundColor: (!row.fileObject && !row.fileName) ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', cursor: (!row.fileObject && !row.fileName) ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '10px' }}
                                                        >
                                                            View
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleDownloadFile(row)}
                                                            disabled={!row.fileObject && !row.fileName}
                                                            style={{ backgroundColor: (!row.fileObject && !row.fileName) ? '#94a3b8' : '#16a34a', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '3px', cursor: (!row.fileObject && !row.fileName) ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '10px' }}
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

                            {/* + Add Row Button */}
                            <div style={{ marginTop: '10px' }}>
                                <button 
                                    type="button" 
                                    onClick={handleAddRow}
                                    style={{ backgroundColor: '#2d3748', color: '#fff', padding: '5px 12px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: '600', fontSize: '10px' }}
                                >
                                    + Add Row
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Navigation Buttons */}
                    <div style={{ padding: '0px 15px 15px 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => navigate('/criteria/8.2')} style={{ backgroundColor: '#E65100', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Previous</button>
                        <button type="button" onClick={() => navigate('/criteria/8.2')} style={{ backgroundColor: '#37474F', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Back</button>
                        <button type="button" onClick={handleSave} disabled={isSubmitting} style={{ backgroundColor: '#2E7D32', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>{isSubmitting ? "Saving..." : "Save"}</button>
                        <button type="button" onClick={handleClear} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Clear</button>
                        <button type="button" onClick={handleDelete} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Delete</button>
                        <button type="button" onClick={handlePrint} style={{ backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Print</button>
                        <button type="button" onClick={() => navigate('/criteria/8.4')} style={{ backgroundColor: '#00695c', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Next</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Criteria8_3;