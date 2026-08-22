import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria8_2.css";

const STORAGE_KEY = "criteria_8_2_table_data";

const Criteria8_2 = () => {
    const navigate = useNavigate();

    // Default Initial State
    const initialTableData = [
        { 
            id: 1, 
            s_n: 1, 
            point: 'Availability of external academic audit process', 
            description: '', 
            fileName: '', 
            fileObject: null 
        },
        { 
            id: 2, 
            s_n: 2, 
            point: 'Plan of action to address the recommendations', 
            description: '', 
            fileName: '', 
            fileObject: null 
        },
        { 
            id: 3, 
            s_n: 3, 
            point: 'Record of actions/corrective measures taken during the assessment period', 
            description: '', 
            fileName: '', 
            fileObject: null 
        }
    ];

    // 1. Initial State: First check localStorage, then fallback to initialTableData
    const [tableData, setTableData] = useState(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Ensure fileObject is initialized to null after parsing from local storage
                return parsed.map(row => ({ ...row, fileObject: null }));
            } catch (e) {
                console.error("Error parsing localStorage data:", e);
            }
        }
        return initialTableData;
    });

    const [isSaved, setIsSaved] = useState(false);

    // 2. Auto-save tableData to localStorage whenever tableData changes
    useEffect(() => {
        // Strip non-serializable properties (like fileObject) before saving to localStorage
        const dataToSave = tableData.map(({ fileObject, ...rest }) => rest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [tableData]);

    // API Load Data
    const loadData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/criteria/8/8.2/data");
            if (res.data && res.data.length > 0) {
                let hasBackendData = false;
                setTableData(prevRows =>
                    prevRows.map((defaultRow) => {
                        const foundRow = res.data.find(r => (r.rowId == defaultRow.id) || (r.row_id == defaultRow.id) || (r.s_n == defaultRow.s_n));
                        if (foundRow) {
                            hasBackendData = true;
                            return {
                                ...defaultRow,
                                id: foundRow.rowId || foundRow.row_id || defaultRow.id,
                                description: foundRow.description !== undefined && foundRow.description !== null && foundRow.description !== '' 
                                    ? foundRow.description 
                                    : (foundRow.item !== undefined && foundRow.item !== null && foundRow.item !== '' && foundRow.item !== defaultRow.point ? foundRow.item : defaultRow.description),
                                fileName: foundRow.fileName || foundRow.file_name || defaultRow.fileName,
                                fileObject: null
                            };
                        }
                        return defaultRow;
                    })
                );
                if (hasBackendData) setIsSaved(true);
            }
        } catch(err) {
            console.log("Error loading saved data for 8.2:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Add Row Logic
    const handleAddRow = () => {
        const nextSn = tableData.length + 1;
        const newRow = {
            id: Date.now(),
            s_n: nextSn,
            point: '',
            description: '',
            fileName: '',
            fileObject: null
        };
        setTableData(prev => [...prev, newRow]);
        setIsSaved(false);
    };

    const handleInputChange = (id, field, value) => {
        setIsSaved(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleFileChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            setIsSaved(false);
            setTableData(prev => prev.map(row => 
                row.id === id ? { ...row, fileName: file.name, fileObject: file } : row
            ));
        }
    };

    const handleViewFile = (row) => {
        if (row.fileObject) {
            const fileURL = URL.createObjectURL(row.fileObject);
            window.open(fileURL, '_blank');
        } else if (row.fileName && row.fileName !== 'No file chosen') {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert("Please upload a file first.");
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
        } else if (row.fileName && row.fileName !== 'No file chosen') {
            window.open(`http://localhost:5000/uploads/${row.fileName}`, '_blank');
        } else {
            alert("No file has been uploaded.");
        }
    };

    // Print Handling
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
                return `<div class="excel-parsed-content">${XLSX.utils.sheet_to_html(worksheet)}</div>`;
            } catch (err) {
                return `<p style="color:red;">Failed to parse Excel file: ${err.message}</p>`;
            }
        }
        return null;
    };

    const handlePrintUploadedFile = async () => {
        const uploadedRows = tableData.filter(row => row.fileObject || (row.fileName && row.fileName !== 'No file chosen'));
        if (uploadedRows.length === 0) {
            alert("No uploaded files found to print!");
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) { alert("Please disable your browser's Pop-up blocker!"); return; }

        printWindow.document.write(`<html><body style="font-family: Arial; text-align: center; margin-top: 50px;"><h3>Processing uploaded files for preview...</h3></body></html>`);

        const filesHTMLArray = [];
        for (const row of uploadedRows) {
            const fileURL = row.fileObject ? URL.createObjectURL(row.fileObject) : `http://localhost:5000/uploads/${row.fileName}`;
            const fileName = row.fileName || "Uploaded File";
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
                <div style="margin-bottom:20px; padding:15px; border:1px solid #ddd;">
                    <h2>Point ${row.s_n}: ${row.point}</h2>
                    <p><strong>Description:</strong> ${row.description || 'N/A'}</p>
                    <div>${previewHTML}</div>
                </div>
            `);
        }

        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>Criteria 8.2 Print</title>
                <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
            </head>
            <body>
                <h2 style="text-align:center; color:#0d233a;">8.2 Academic Audit and Actions Taken</h2>
                ${filesHTMLArray.join('<div style="page-break-after:always;"></div>')}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 1200);
    };

    // Save Draft Handling
    const handleSave = async () => {
        if (isSaved) { alert("Already Data is Saved!"); return; }
        try {
            for (const row of tableData) {
                const desc = row.description ? String(row.description).trim() : '';
                if (!desc && (!row.fileName || row.fileName === 'No file chosen')) continue;

                const formData = new FormData();
                formData.append("rowId", row.id);
                formData.append("s_n", row.s_n);
                formData.append("point", row.point);
                formData.append("description", desc);

                if (row.fileObject) formData.append("file", row.fileObject);
                else if (row.fileName) formData.append("fileName", row.fileName);

                await axios.post("http://localhost:5000/api/criteria/8/8.2/submit", formData, { headers: { "Content-Type": "multipart/form-data" } });
            }
            alert(" Saved Successfully!");
            setIsSaved(true);
        } catch (err) { alert("Draft Save Failed."); }
    };

    // Clear handler: Clears state AND removes key from localStorage
    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear table inputs?")) {
            setTableData(initialTableData);
            localStorage.removeItem(STORAGE_KEY);
            setIsSaved(false);
        }
    };

    // Delete handler: Removes state and local storage state
    const handleDelete = () => {
        if (window.confirm("Delete data from Frontend view? (Backend data won't be deleted)")) {
            setTableData(initialTableData);
            localStorage.removeItem(STORAGE_KEY);
            setIsSaved(false);
        }
    };

    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9', width: '100%', overflowX: 'hidden' }}>
        
        {/* Fixed Left Sidebar Container */}
        <div style={{ width: '250px', flexShrink: 0, position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
            <NBASidebar />
        </div>

        {/* Right Main Content Area */}
        <div style={{ flex: 1, marginLeft: '250px', padding: '25px', width: 'calc(100% - 250px)', boxSizing: 'border-box' }}>
            
            {/* Header Box */}
            <div style={{ backgroundColor: '#0b2545', color: '#ffffff', padding: '14px 20px', fontSize: '16px', fontWeight: 'bold', borderRadius: '4px', marginBottom: '20px' }}>
                8.2 Academic Audit and Actions Taken thereof during the Period of Assessment (15)
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f4f9', borderBottom: '2px solid #cbd5e1' }}>
                            <th rowSpan="2" style={{ width: '6%', padding: '12px 8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '700', color: '#0f2a4a' }}>Sr. No.</th>
                            <th rowSpan="2" style={{ width: '32%', padding: '12px 10px', border: '1px solid #d1d5db', textAlign: 'left', fontWeight: '700', color: '#0f2a4a' }}>Point</th>
                            <th rowSpan="2" style={{ width: '42%', padding: '12px 10px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '700', color: '#0f2a4a' }}>Description / Details</th>
                            <th colSpan="3" style={{ width: '20%', padding: '8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '700', color: '#0f2a4a' }}>Action</th>
                        </tr>
                        <tr style={{ backgroundColor: '#f0f4f9' }}>
                            <th style={{ padding: '8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '600', fontSize: '12px', color: '#0f2a4a' }}>View</th>
                            <th style={{ padding: '8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '600', fontSize: '12px', color: '#0f2a4a' }}>Upload</th>
                            <th style={{ padding: '8px', border: '1px solid #d1d5db', textAlign: 'center', fontWeight: '600', fontSize: '12px', color: '#0f2a4a' }}>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={row.id} style={{ backgroundColor: index % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                                <td style={{ border: '1px solid #e5e7eb', textAlign: 'center', padding: '12px 8px', fontWeight: 'bold', color: '#334155' }}>
                                    {row.s_n}
                                </td>
                                
                                <td style={{ border: '1px solid #e5e7eb', padding: '10px 12px', color: '#1e293b' }}>
                                    {row.s_n <= 3 ? (
                                        row.point
                                    ) : (
                                        <input 
                                            type="text" 
                                            value={row.point} 
                                            onChange={(e) => handleInputChange(row.id, 'point', e.target.value)}
                                            placeholder="Enter Point..."
                                            style={{ width: '100%', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }}
                                        />
                                    )}
                                </td>
                                
                                <td style={{ border: '1px solid #e5e7eb', padding: '10px 12px' }}>
                                    <textarea 
                                        rows="2"
                                        value={row.description || ''} 
                                        onChange={(e) => handleInputChange(row.id, 'description', e.target.value)} 
                                        placeholder="Enter details..."
                                        style={{ width: '100%', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                    {row.fileName && row.fileName !== 'No file chosen' && (
                                        <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>
                                            📄 {row.fileName}
                                        </div>
                                    )}
                                </td>
                                
                                <td style={{ border: '1px solid #e5e7eb', textAlign: 'center', padding: '8px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => handleViewFile(row)} 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                                        title="View File"
                                    >
                                        👁️
                                    </button>
                                </td>

                                <td style={{ border: '1px solid #e5e7eb', textAlign: 'center', padding: '8px' }}>
                                    <label htmlFor={`file-input-${row.id}`} style={{ cursor: 'pointer', fontSize: '16px', display: 'inline-block' }}>
                                        {row.fileName ? '✅' : '📤'}
                                    </label>
                                    <input 
                                        id={`file-input-${row.id}`} 
                                        type="file" 
                                        accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.xls,.csv" 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => handleFileChange(row.id, e)} 
                                    />
                                </td>

                                <td style={{ border: '1px solid #e5e7eb', textAlign: 'center', padding: '8px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => handleDownloadFile(row)} 
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                                        title="Download File"
                                    >
                                        📥
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add Row Button */}
                <div style={{ marginTop: '15px' }}>
                    <button 
                        type="button" 
                        onClick={handleAddRow}
                        style={{ backgroundColor: '#4c4b63', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                        <span>+</span> Add Row
                    </button>
                </div>

                {/* Bottom Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '25px', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap', width: '100%', overflowX: 'auto' }}>
                    <button type="button" onClick={() => navigate('/criteria/8.1')} style={{ backgroundColor: '#E65100', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' }}> Previous</button>
                    <button type="button" onClick={() => navigate('/criteria/8.1')} style={{ backgroundColor: '#37474F', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' }}> Back</button>
                    
                    <button type="button" onClick={handleSave} style={{ backgroundColor: '#2E7D32', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' }}> Save </button>
                    <button type="button" onClick={handleClear} style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' }}> Clear</button>
                    <button type="button" onClick={handleDelete} style={{ backgroundColor: '#ef4444', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' }}> Delete</button>
                    <button type="button" onClick={handlePrintUploadedFile} style={{ backgroundColor: '#8b5cf6', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' }}> Print</button>
                    
                    <button type="button" onClick={() => navigate('/criteria/8.3')} style={{ backgroundColor: '#0f766e', color: '#fff', padding: '8px 18px', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600', marginLeft: 'auto' }}>Next </button>
                </div>

            </div>
        </div>
      </div>  
    );
};

export default Criteria8_2;