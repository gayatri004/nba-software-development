import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // Header States
    const [academicYear] = useState("2024-25");
    const [department] = useState("Computer Engineering");
    const [program] = useState("B.E. Computer Engineering");

    // Status Tracks
    const [isSaved, setIsSaved] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Default Initial Table Data
    const getInitialTableData = () => [
        { 
            id: 1, 
            s_n: 1, 
            point: 'Maintenance policy', 
            description: '', 
            fileObject: null, 
            fileName: null
        },
        { 
            id: 2, 
            s_n: 2, 
            point: 'Corrective & preventive maintenance', 
            description: '', 
            fileObject: null, 
            fileName: null
        },
        { 
            id: 3, 
            s_n: 3, 
            point: 'Overall ambiance', 
            description: '', 
            fileObject: null, 
            fileName: null
        }
    ];

    const [tableData, setTableData] = useState(() => {
        // First preference: Local Storage मधील ड्राफ्ट डेटा लोड करणे
        const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localDraft) {
            try {
                const parsed = JSON.parse(localDraft);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {
                console.error("Local draft parsing failed", e);
            }
        }
        return getInitialTableData();
    });

    // 🔄 Load Data from Server (जर LocalStorage मध्ये काही नसेल तर DB मधून येईल)
    useEffect(() => {
        const fetchSavedData = async () => {
            const localDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (localDraft) return; 

            try {
                const res = await axios.get(`${API_BASE_URL}/data`, {
                    params: { academicYear, department, program }
                });
                if (res.data && res.data.length > 0) {
                    const loadedData = res.data.map((dbRow, index) => ({
                        id: dbRow.row_id || index + 1,
                        s_n: index + 1,
                        point: dbRow.item || dbRow.point || '',
                        description: dbRow.current_status || dbRow.description || '',
                        fileName: dbRow.file_name || null,
                        fileObject: null
                    }));
                    setTableData(loadedData);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadedData));
                    setIsSaved(true);
                } else {
                    setTableData(getInitialTableData());
                    setIsSaved(false);
                    setIsSubmitted(false);
                }
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };
        fetchSavedData();
    }, [API_BASE_URL, academicYear, department, program]);

    // 💾 ऑटो-सेव्ह स्टेट टू LocalStorage (पेज बदलल्यावर डेटा न जाण्यासाठी)
    useEffect(() => {
        const serializableData = tableData.map(row => ({
            ...row,
            fileObject: null 
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableData));
    }, [tableData]);

    // ➕ Add Row Function
    const handleAddRow = () => {
        setIsSaved(false);
        setIsSubmitted(false);
        setTableData(prev => {
            const newRowId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
            return [
                ...prev,
                {
                    id: newRowId,
                    s_n: prev.length + 1,
                    point: '', 
                    description: '',
                    fileObject: null,
                    fileName: null
                }
            ];
        });
    };

    const handleInputChange = (id, value) => {
        setIsSaved(false);
        setIsSubmitted(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, description: value } : row));
    };

    const handlePointChange = (id, value) => {
        setIsSaved(false);
        setIsSubmitted(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, point: value } : row));
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            setIsSaved(false);
            setIsSubmitted(false);
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
            if (!row.point.trim()) {
                alert(`Please enter the point name for Sr. No. ${row.s_n}.`);
                return false;
            }
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
        setIsSaved(false);
        setIsSubmitted(false);
    };

    // 💾 Save Logic
    const saveToServer = async (isFinalSubmit = false) => {
        if (isFinalSubmit && isSubmitted) {
            alert("Data is already submitted! 🚀");
            return;
        }

        if (!isFinalSubmit && isSaved) {
            alert("Data is already saved as draft! 💾");
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

            if (isFinalSubmit) {
                setIsSubmitted(true);
                setIsSaved(true);
                alert("Data submitted successfully! 🚀");
            } else {
                setIsSaved(true);
                alert("t saved successfully! 💾");
            }

        } catch (err) {
            console.error(err);
            alert("Process Failed. Please try again.");
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to clear the frontend data?")) {
            resetTableForm();
            alert("Frontend data cleared successfully!");
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all fields in the table?")) {
            resetTableForm();
        }
    };

    const extractDocxHTML = async (row) => {
        try {
            if (row.fileObject && row.fileName.toLowerCase().endsWith('.docx')) {
                const arrayBuffer = await row.fileObject.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                return result.value;
            } else if (row.fileName && row.fileName.toLowerCase().endsWith('.docx')) {
                const fileUrl = `http://localhost:5000/uploads/${row.fileName}`;
                const response = await fetch(fileUrl);
                const arrayBuffer = await response.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                return result.value;
            }
        } catch (error) {
            console.error("Error reading docx file:", error);
            return `<p style="color: red;"><em>Error reading Word document content.</em></p>`;
        }
        return null;
    };

    // 🖨️ Print Function
    const handlePrintUploadedFile = async () => {
        let cardsHTMLArray = [];

        for (const row of tableData) {
            const fileURL = row.fileObject 
                ? URL.createObjectURL(row.fileObject) 
                : (row.fileName ? `http://localhost:5000/uploads/${row.fileName}` : null);
            
            const fileNameLower = row.fileName ? row.fileName.toLowerCase() : '';
            const isPdf = fileNameLower.endsWith('.pdf');
            const isImage = fileNameLower.endsWith('.png') || fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg') || fileNameLower.endsWith('.gif');
            const isDoc = fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx');

            let renderContent = '';

            if (isDoc) {
                const docHTML = await extractDocxHTML(row);
                if (docHTML) {
                    renderContent = `<div class="docx-rendered-content">${docHTML}</div>`;
                } else {
                    renderContent = `<div class="file-info-box">📄 <strong>Word Document Attached:</strong> ${row.fileName}</div>`;
                }
            } else if (isPdf) {
                renderContent = `
                    <div class="pdf-wrapper">
                        <object data="${fileURL}#toolbar=0&navpanes=0" type="application/pdf" class="pdf-object">
                            <embed src="${fileURL}" type="application/pdf" />
                        </object>
                        <p class="pdf-note">📄 <strong>Attached PDF:</strong> ${row.fileName}</p>
                    </div>
                `;
            } else if (isImage) {
                renderContent = `<img src="${fileURL}" class="img-view" alt="Uploaded Document" />`;
            } else if (fileURL) {
                renderContent = `<div class="file-info-box">📎 <strong>Attachment:</strong> ${row.fileName}</div>`;
            } else {
                renderContent = `<p class="no-file-text"><em>No document attached for this point.</em></p>`;
            }

            const cardHTML = `
                <div class="print-card">
                    <div class="card-header">${row.s_n}. ${row.point}</div>
                    <div class="card-details">
                        <p><strong>Description:</strong> ${row.description.trim() ? row.description : 'N/A'}</p>
                        <p><strong>Attachment Name:</strong> ${row.fileName ? row.fileName : 'None'}</p>
                    </div>
                    ${renderContent ? `<div class="card-media">${renderContent}</div>` : ''}
                </div>
            `;

            cardsHTMLArray.push(cardHTML);
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Pop-up blocker active! Please allow pop-ups for this site.");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Criteria 7.3 Complete Report</title>
                <style>
                    @page { size: A4; margin: 15mm; }
                    *, *:before, *:after { box-sizing: border-box !important; }
                    html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; font-family: Arial, sans-serif; color: #000; }
                    .header-title { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 20px; }
                    .header-title h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
                    .header-title h4 { margin: 5px 0 0 0; font-size: 14px; font-weight: normal; }
                    .print-card { border: 1px solid #000; margin-bottom: 20px; background: #fff; page-break-inside: auto; }
                    .card-header { background-color: #f0f0f0; padding: 8px 12px; font-weight: bold; font-size: 14px; border-bottom: 1px solid #000; page-break-after: avoid; }
                    .card-details { padding: 10px 12px; font-size: 13px; }
                    .card-details p { margin: 4px 0; line-height: 1.4; }
                    .card-media { padding: 10px; border-top: 1px solid #ccc; }
                    .pdf-wrapper { width: 100%; }
                    .pdf-object { width: 100%; height: 1000px; border: 1px solid #ccc; }
                    .pdf-note { font-size: 11px; color: #444; margin-top: 4px; }
                    .img-view { max-width: 100%; height: auto; display: block; margin: 0 auto; page-break-inside: avoid; }
                    .docx-rendered-content { font-size: 12px; padding: 8px; line-height: 1.5; }
                    .docx-rendered-content table { width: 100% !important; border-collapse: collapse !important; }
                    .docx-rendered-content td, .docx-rendered-content th { border: 1px solid #000 !important; padding: 4px !important; }
                    .file-info-box { font-size: 13px; padding: 8px 12px; background: #f9f9f9; border: 1px solid #ccc; }
                    .no-file-text { font-size: 12px; color: #666; margin: 0; }
                </style>
            </head>
            <body>
                <div class="header-title">
                    <h2>CRITERION 7: FACILITIES AND TECHNICAL SUPPORT</h2>
                    <h4>7.3 Maintenance of Laboratories and Overall Ambiance</h4>
                </div>
                ${cardsHTMLArray.join('')}
            </body>
            </html>
        `);

        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 800);
    };

    return (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', overflowX: 'hidden' }}>
            
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                <NBASidebar />
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '16px', boxSizing: 'border-box', overflowX: 'hidden' }}>
                
                {/* TABLE HEADER BANNER */}
                <div style={{ backgroundColor: '#0f2942', color: '#fff', padding: '12px 16px', borderRadius: '6px 6px 0 0', fontWeight: 'bold', fontSize: '15px' }}>
                    7.3 Maintenance of Laboratories and Overall Ambiance (10)
                </div>

                {/* DATA CONTAINER */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e0', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '16px', boxSizing: 'border-box' }}>
                    
                    {/* DATA TABLE */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e2e8f0', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0' }}>
                                <th rowSpan="2" style={{ width: '6%', padding: '8px 4px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#718096' }}>Sr. No.</th>
                                <th rowSpan="2" style={{ width: '28%', padding: '8px 6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#718096' }}>Point</th>
                                <th rowSpan="2" style={{ width: '48%', padding: '8px 6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#718096' }}>Description / Details</th>
                                <th colSpan="3" style={{ width: '18%', padding: '6px 2px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', color: '#718096' }}>Action</th>
                            </tr>
                            <tr style={{ backgroundColor: '#f7fafc' }}>
                                <th style={{ width: '6%', padding: '4px 2px', border: '1px solid #cbd5e0', fontSize: '11px', textAlign: 'center', color: '#a0aec0' }}>View</th>
                                <th style={{ width: '6%', padding: '4px 2px', border: '1px solid #cbd5e0', fontSize: '11px', textAlign: 'center', color: '#a0aec0' }}>Upload</th>
                                <th style={{ width: '6%', padding: '4px 2px', border: '1px solid #cbd5e0', fontSize: '11px', textAlign: 'center', color: '#a0aec0' }}>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    
                                    {/* Sr. No */}
                                    <td style={{ fontWeight: 'bold', textAlign: 'center', padding: '8px 4px', fontSize: '12px', borderRight: '1px solid #e2e8f0' }}>
                                        {row.s_n}
                                    </td>
                                    
                                    {/* Point Textarea/Input */}
                                    <td style={{ padding: '6px', borderRight: '1px solid #e2e8f0' }}>
                                        <textarea
                                            rows="2"
                                            value={row.point}
                                            onChange={(e) => handlePointChange(row.id, e.target.value)}
                                            placeholder="Enter point name..."
                                            style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box', fontWeight: '500' }}
                                        />
                                    </td>

                                    {/* Description Textarea */}
                                    <td style={{ padding: '6px', borderRight: '1px solid #e2e8f0' }}>
                                        <textarea 
                                            rows="2"
                                            value={row.description} 
                                            onChange={(e) => handleInputChange(row.id, e.target.value)} 
                                            placeholder="Enter description here..."
                                            style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', resize: 'vertical', fontSize: '12px', boxSizing: 'border-box' }}
                                        />
                                    </td>

                                    {/* Action: View */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', padding: '4px' }}>
                                        <button 
                                            type="button" 
                                            title="View File"
                                            onClick={() => handleViewFile(row)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                                        >
                                            👁️
                                        </button>
                                    </td>

                                    {/* Action: Upload */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #e2e8f0', padding: '4px' }}>
                                        <input 
                                            type="file" 
                                            id={`file-input-73-${row.id}`}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(row.id, e)}
                                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                                        />
                                        <button 
                                            type="button" 
                                            title={row.fileName ? `Uploaded: ${row.fileName}` : "Upload File"}
                                            onClick={() => document.getElementById(`file-input-73-${row.id}`).click()}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                                        >
                                            {row.fileName ? '✅' : '📤'}
                                        </button>
                                        
                                        {row.fileName && (
                                            <div style={{ fontSize: '9px', color: '#276749', fontWeight: 'bold', marginTop: '2px', maxWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.fileName}
                                            </div>
                                        )}
                                    </td>

                                    {/* Action: Download */}
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '4px' }}>
                                        <button 
                                            type="button" 
                                            title="Download File"
                                            onClick={() => handleDownloadFile(row)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                                        >
                                            📥
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ➕ ADD ROW BUTTON */}
                    <div style={{ marginTop: '14px', marginBottom: '18px' }}>
                        <button 
                            type="button" 
                            onClick={handleAddRow}
                            style={{ 
                                padding: '8px 16px', 
                                backgroundColor: '#6b46c1', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold', 
                                fontSize: '13px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            ➕ Add Row
                        </button>
                    </div>

                    {/* ALL ACTION BUTTONS IN A SINGLE LINE */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        alignItems: 'center', 
                        gap: '6px',
                        width: '100%'
                    }}>
                        <button 
                            type="button" 
                            onClick={() => saveToServer(false)}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                        >
                             Save 
                        </button>

                        <button 
                            type="button" 
                            onClick={handleDelete}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                        >
                             Delete
                        </button>

                        <button 
                            type="button" 
                            onClick={handlePrintUploadedFile}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                        >
                             Print
                        </button>

                        <button 
                            type="button" 
                            onClick={handleClear}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                        >
                             Clear
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/7.1')}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#2d3748', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                        >
                             Back 
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/7.2')}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#E65100', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
                        >
                            Previous
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/7.4')}
                            style={{ flex: 1, padding: '8px 4px', backgroundColor: '#00695c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}
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