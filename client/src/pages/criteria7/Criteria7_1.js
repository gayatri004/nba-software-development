import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import NBASidebar from "../NBASidebar";
import "../../styles/Criteria7_1.css";

const Criteria7_1 = () => {
    const navigate = useNavigate();

    const criteriaNo = "7";
    const subSection = "7.1";
    const API_BASE_URL = `http://localhost:5000/api/criteria/${criteriaNo}/${subSection}`;

    // Header Dropdown States
    const [academicYear, setAcademicYear] = useState("2024-25");
    const [department, setDepartment] = useState("Computer Engineering");
    const [program, setProgram] = useState("B.E. Computer Engineering");

    // Save Status tracking state
    const [isSaved, setIsSaved] = useState(false);

    // Initial Table State
    const getInitialTableData = () => [
        { 
            id: 1, 
            s_n: 1, 
            point: 'Adequacy and well-equipped laboratories running the program.', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 2, 
            s_n: 2, 
            point: 'Quality of instruments', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 3, 
            s_n: 3, 
            point: 'Utilization of laboratories/workshops', 
            description: '', 
            fileObject: null, 
            fileName: null 
        },
        { 
            id: 4, 
            s_n: 4, 
            point: 'Availability of adequate and qualified technical supporting staff in the Department', 
            description: '', 
            fileObject: null, 
            fileName: null 
        }
    ];

    // 💾 LOCAL STORAGE मधून डेटा लोड करणे (नेव्हिगेशन किंवा रिफ्रेश नंतर डेटा टिकवून ठेवण्यासाठी)
    const [tableData, setTableData] = useState(() => {
        const localSaved = localStorage.getItem("temp_criteria_7_1");
        return localSaved ? JSON.parse(localSaved) : getInitialTableData();
    });

    // 🔄 डेटा टेबलमधील कोणत्याही बदलावर ऑटो-सेव्ह (Local Storage मध्ये)
    useEffect(() => {
        // fileObject LocalStorage मध्ये सेव्ह होऊ शकत नाही, त्यामुळे ते वगळून फक्त fileName आणि मजकूर सेव्ह होतो
        const serializableData = tableData.map(item => ({
            ...item,
            fileObject: null 
        }));
        localStorage.setItem("temp_criteria_7_1", JSON.stringify(serializableData));
    }, [tableData]);

    // 🔄 बॅकएंडकडून डेटा लोड करणे (जर LocalStorage रिकामं असेल तरच)
    useEffect(() => {
        const fetchSavedData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/data`, {
                    params: { academicYear, department, program }
                });

                const hasLocalData = localStorage.getItem("temp_criteria_7_1");
                
                if (res.data && res.data.length > 0 && !hasLocalData) {
                    const fetchedRows = res.data.map((dbRow, index) => ({
                        id: dbRow.row_id || index + 1,
                        s_n: index + 1,
                        point: dbRow.item || '',
                        description: dbRow.current_status || '',
                        fileName: dbRow.file_name || null,
                        fileObject: null
                    }));
                    setTableData(fetchedRows);
                    setIsSaved(true);
                }
            } catch (err) {
                console.error("error occurred:", err);
            }
        };

        fetchSavedData();
    }, [academicYear, department, program]);

    // Handle Point/Title Change
    const handlePointChange = (id, value) => {
        setIsSaved(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, point: value } : row));
    };

    const handleInputChange = (id, value) => {
        setIsSaved(false);
        setTableData(prev => prev.map(row => row.id === id ? { ...row, description: value } : row));
    };

    // Add New Row Functionality
    const handleAddRow = () => {
        setIsSaved(false);
        setTableData(prev => {
            const newId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
            const newSn = prev.length + 1;
            return [
                ...prev,
                { id: newId, s_n: newSn, point: '', description: '', fileObject: null, fileName: null }
            ];
        });
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
            window.open(`http://localhost:5000/uploads/${encodeURIComponent(row.fileName)}`, '_blank');
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
            window.open(`http://localhost:5000/uploads/${encodeURIComponent(row.fileName)}`, '_blank');
        } else {
            alert("No file available for download!");
        }
    };

    // 🧹 स्पष्टपणे Clear/Delete केल्यावरच LocalStorage आणि State डेटा डिलीट होईल
    const resetTableForm = () => {
        localStorage.removeItem("temp_criteria_7_1");
        setTableData(getInitialTableData());
        setIsSaved(false);
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all form fields from display?")) {
            resetTableForm();
        }
    };

    // Next Page Navigation
    const handleNext = () => {
        navigate('/criteria/7.2');
    };

    // 💾 Save Draft Logic
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

        } catch (err) {
            console.error(err);
            alert("Save Failed. Please try again.");
        }
    };

    // 🗑️ Delete Button Action
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to clear front-end data?")) {
            resetTableForm();
            alert("Data cleared from display!");
        }
    };

    const readFileContentHTML = async (row) => {
        let fileBlob = row.fileObject;

        if (!fileBlob && row.fileName) {
            try {
                const response = await fetch(`http://localhost:5000/uploads/${encodeURIComponent(row.fileName)}`);
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

    // 🖨️ Print Functionality
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
                : `http://localhost:5000/uploads/${encodeURIComponent(row.fileName)}`;
            
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
                    </div>
                `;
            }

            filesHTMLArray.push(`
                <div class="file-container">
                    <div class="file-header">
                        <h2>Point ${row.s_n}: ${row.point}</h2>
                        <p><strong>Department:</strong> ${department} | <strong>Program:</strong> ${program} | <strong>Academic Year:</strong> ${academicYear}</p>
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
                <title>Criteria 7.1 - Uploaded Documents</title>
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
                    <h3>7.1: Adequate and Well-Equipped Laboratories and Technical Manpower</h3>
                </div>
                ${filesHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => { printWindow.print(); }, 2000);
    };

    return (
        <div className="main-container-71" style={{ display: 'flex', width: '100%' }}>
            
            {/* Sidebar */}
            <div style={{ flexShrink: 0 }}>
                <NBASidebar />
            </div>

            {/* Main Content Layout */}
            <div className="criteria-main-layout-71" style={{ padding: '20px', flex: 1, backgroundColor: '#f8fafc' }}>
                <div className="container-71">
                    
                    {/* TOP HEADER SECTION */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0a2540', margin: 0 }}>CRITERION 7</h1>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a365d', marginTop: '5px' }}>
                                FACILITIES AND TECHNICAL SUPPORT (100)
                            </h3>
                            <p style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                                Dashboard &gt; Criteria Management &gt; <strong>Criterion 7</strong>
                            </p>
                        </div>
                    </div>

                    {/* DROPDOWN CONTROLS */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        
                        {/* Academic Year */}
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '5px' }}>Academic Year</label>
                            <select 
                                value={academicYear} 
                                onChange={(e) => setAcademicYear(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: '#fff' }}
                            >
                                <option value="2025-26">📅 2025-26</option>
                                <option value="2024-25">📅 2024-25</option>
                                <option value="2023-24">📅 2023-24</option>
                                <option value="2022-23">📅 2022-23</option>
                                <option value="2021-22">📅 2021-22</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div style={{ flex: '1', minWidth: '220px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '5px' }}>Department</label>
                            <select 
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: '#fff' }}
                            >
                                <option value="Computer Engineering">💻 Computer Engineering</option>
                                <option value="Information Technology">🌐 Information Technology</option>
                                <option value="Mechanical Engineering">⚙️ Mechanical Engineering</option>
                                <option value="Civil Engineering">🏗️ Civil Engineering</option>
                                <option value="Electronics & Telecommunication">📡 Electronics & Telecommunication (ENTC)</option>
                                <option value="Electrical Engineering">⚡ Electrical Engineering</option>
                                <option value="Artificial Intelligence & Data Science">🤖 Artificial Intelligence & Data Science</option>
                                <option value="Robotics & Automation">🦾 Robotics & Automation</option>
                                <option value="Chemical Engineering">🧪 Chemical Engineering</option>
                            </select>
                        </div>

                        {/* Program */}
                        <div style={{ flex: '1', minWidth: '240px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4a5568', display: 'block', marginBottom: '5px' }}>Program</label>
                            <select 
                                value={program} 
                                onChange={(e) => setProgram(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: '#fff' }}
                            >
                                <option value="B.E. Computer Engineering">🎓 B.E. Computer Engineering</option>
                                <option value="B.Tech Computer Engineering">🎓 B.Tech Computer Engineering</option>
                                <option value="B.E. Information Technology">🎓 B.E. Information Technology</option>
                                <option value="B.E. Mechanical Engineering">🎓 B.E. Mechanical Engineering</option>
                                <option value="B.E. Civil Engineering">🎓 B.E. Civil Engineering</option>
                                <option value="B.E. ENTC Engineering">🎓 B.E. ENTC Engineering</option>
                                <option value="M.E. Computer Engineering">🎓 M.E. Computer Engineering</option>
                                <option value="M.Tech Data Science">🎓 M.Tech Data Science</option>
                            </select>
                        </div>

                    </div>

                    {/* TABLE BANNER */}
                    <div style={{ backgroundColor: '#0a2540', color: '#fff', padding: '12px 20px', borderRadius: '6px 6px 0 0', fontWeight: 'bold', fontSize: '15px' }}>
                        7.1 Adequate and Well-Equipped Laboratories and Technical Manpower (40)
                    </div>

                    {/* DATA TABLE */}
                    <div className="table-responsive-container-71" style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0 0 6px 6px' }}>
                        <table className="data-table-71" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#fffaf0', borderBottom: '1px solid #e2e8f0' }}>
                                    <th rowSpan="2" style={{ width: '8%', textAlign: 'center', padding: '12px', borderRight: '1px solid #edf2f7' }}>Sr. No.</th>
                                    <th rowSpan="2" style={{ width: '32%', padding: '12px', borderRight: '1px solid #edf2f7' }}>Point</th>
                                    <th rowSpan="2" style={{ width: '35%', padding: '12px', borderRight: '1px solid #edf2f7' }}>Description</th>
                                    <th colSpan="3" style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #edf2f7' }}>Action</th>
                                </tr>
                                <tr style={{ backgroundColor: '#fffaf0' }}>
                                    <th style={{ width: '8%', textAlign: 'center', padding: '8px', borderRight: '1px solid #edf2f7' }}>View</th>
                                    <th style={{ width: '9%', textAlign: 'center', padding: '8px', borderRight: '1px solid #edf2f7' }}>Upload</th>
                                    <th style={{ width: '8%', textAlign: 'center', padding: '8px' }}>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ fontWeight: 'bold', textAlign: 'center', padding: '12px' }}>{row.s_n}</td>
                                        <td style={{ padding: '10px', fontSize: '14px', color: '#2d3748' }}>
                                            <textarea 
                                                className="table-textarea-71" 
                                                rows="2"
                                                value={row.point} 
                                                onChange={(e) => handlePointChange(row.id, e.target.value)} 
                                                placeholder="Enter Point Title..."
                                                style={{ width: '95%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px', resize: 'vertical', fontWeight: 'bold', color: '#0a2540' }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <textarea 
                                                className="table-textarea-71" 
                                                rows="2"
                                                value={row.description} 
                                                onChange={(e) => handleInputChange(row.id, e.target.value)} 
                                                placeholder="Enter details..."
                                                style={{ width: '95%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px', resize: 'vertical' }}
                                            />
                                        </td>

                                        {/* Action: View */}
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <button 
                                                type="button" 
                                                title="View File"
                                                onClick={() => handleViewFile(row)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                                            >
                                                👁️
                                            </button>
                                        </td>

                                        {/* Action: Upload */}
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <input 
                                                type="file" 
                                                id={`file-input-71-${row.id}`}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(row.id, e)}
                                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                                            />
                                            <button 
                                                type="button" 
                                                title={row.fileName ? `Uploaded: ${row.fileName}` : "Upload File"}
                                                onClick={() => document.getElementById(`file-input-71-${row.id}`).click()}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                                            >
                                                {row.fileName ? '✅' : '📤'}
                                            </button>
                                            
                                            {row.fileName && (
                                                <div style={{ fontSize: '11px', color: '#2f855a', fontWeight: 'bold', marginTop: '4px', maxWidth: '100px', wordBreak: 'break-all', margin: '0 auto' }}>
                                                    {row.fileName}
                                                </div>
                                            )}
                                        </td>

                                        {/* Action: Download */}
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <button 
                                                type="button" 
                                                title="Download File"
                                                onClick={() => handleDownloadFile(row)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                                            >
                                                📥
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ➕ ADD ROW BUTTON */}
                    <div style={{ marginTop: '15px' }}>
                        <button 
                            className="btn-act-71" 
                            type="button" 
                            onClick={handleAddRow}
                            style={{ padding: '10px 20px', backgroundColor: '#5c67f2', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                        >
                            ➕ Add Row
                        </button>
                    </div>

                    {/* 🔘 ACTION BUTTONS ROW */}
                    <div style={{ marginTop: '15px', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                            className="btn-act-71 btn-sv-71" 
                            type="button" 
                            onClick={saveToServer}
                            style={{ padding: '10px 18px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Save 
                        </button>
                        <button 
                            className="btn-act-71 btn-del-71" 
                            type="button" 
                            onClick={handleDelete}
                            style={{ padding: '10px 18px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                             Delete
                        </button>
                        <button 
                            className="btn-act-71 btn-prt-71" 
                            type="button" 
                            onClick={handlePrintUploadedFile}
                            style={{ padding: '10px 18px', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                             Print 
                        </button>
                        <button 
                            className="btn-act-71 btn-clr-71" 
                            type="button" 
                            onClick={handleClear}
                            style={{ padding: '10px 18px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                             Clear
                        </button>
                        <button 
                            className="btn-act-71 btn-nxt-71" 
                            type="button" 
                            onClick={handleNext}
                            style={{ padding: '10px 18px', backgroundColor: '#00695c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Next 
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Criteria7_1;