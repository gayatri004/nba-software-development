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
    const LOCAL_STORAGE_KEY = `criteria_7_5_table_data`;

    const [academicYear] = useState("2024-25");
    const [department] = useState("Computer Engineering");
    const [program] = useState("B.E. Computer Engineering");

    const fileInputRefs = useRef({});

    const getInitialTableData = () => [
        { id: 1, s_n: 1, point: 'Availability of project laboratories/ research laboratories', description: '', fileObject: null, fileName: null },
        { id: 2, s_n: 2, point: 'Availability of centre of excellence', description: '', fileObject: null, fileName: null },
        { id: 3, s_n: 3, point: 'Utilization of project laboratories/ research laboratory /Centre of excellence', description: '', fileObject: null, fileName: null },
        { id: 4, s_n: 4, point: 'Relevance to POs/PSOs', description: '', fileObject: null, fileName: null }
    ];

    const [tableData, setTableData] = useState(() => {
        const savedLocalData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedLocalData) {
            try {
                return JSON.parse(savedLocalData);
            } catch (e) {
                console.error("Local storage parse error:", e);
            }
        }
        return getInitialTableData();
    });

    useEffect(() => {
        const dataToSave = tableData.map(row => ({
            ...row,
            fileObject: null 
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    }, [tableData]);

    const fetchSavedData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/data`, {
                params: { academicYear, department, program }
            });
            if (res.data && res.data.length > 0) {
                setTableData(prevData => {
                    return prevData.map(row => {
                        const dbRow = res.data.find(d => Number(d.row_id || d.s_n) === Number(row.id || row.s_n));
                        if (dbRow) {
                            const newFileName = dbRow.file_name || dbRow.fileName || row.fileName;
                            return {
                                ...row,
                                description: dbRow.current_status || dbRow.details || row.description,
                                fileName: newFileName,
                                fileObject: row.fileObject 
                            };
                        }
                        return row;
                    });
                });
            }
        } catch (err) {
            console.error("Error fetching data from server:", err);
        }
    }, [API_BASE_URL, academicYear, department, program]);

    useEffect(() => {
        if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
            fetchSavedData();
        }
    }, [fetchSavedData]);

    const handleInputChange = (id, value) => {
        setTableData(prev => prev.map(row => row.id === id ? { ...row, description: value } : row));
    };

    const handleFileChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
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
            setTimeout(() => URL.revokeObjectURL(fileURL), 60000);
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
            setTimeout(() => URL.revokeObjectURL(fileURL), 60000);
        } else if (row.fileName) {
            const link = document.createElement('a');
            link.href = `http://localhost:5000/uploads/${row.fileName}`;
            link.download = row.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No file available for download!");
        }
    };

    const saveToServer = async () => {
        try {
            const uploadPromises = tableData.map(row => {
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
                } else if (row.fileName) {
                    formData.append("existingFileName", row.fileName);
                }

                return axios.post(`${API_BASE_URL}/submit`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            });

            await Promise.all(uploadPromises);

            alert("Data saved successfully! 💾");
            await fetchSavedData(); 

        } catch (err) {
            console.error(err);
            alert("Process Failed. Please try again.");
        }
    };

    const handleClear = () => {
        if (window.confirm("तुम्हाला टेबलमधील सर्व भरलेला डेटा Clear/Refresh करायचा आहे का?")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setTableData(getInitialTableData());
            
            Object.keys(fileInputRefs.current).forEach(key => {
                if (fileInputRefs.current[key]) {
                    fileInputRefs.current[key].value = "";
                }
            });
            alert("टेबल यशस्वीरीत्या Clear / Refresh झाला आहे!");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete all entered data from Server and Local Storage?")) {
            try {
                await axios.delete(`${API_BASE_URL}/delete`, {
                    data: { academicYear, department, program }
                });
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setTableData(getInitialTableData());
                alert("Data cleared successfully from server!");
            } catch (err) {
                console.error(err);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setTableData(getInitialTableData());
            }
        }
    };

    const readFileContentHTML = async (item) => {
        let fileBlob = item.fileObject;
        const fileName = item.file_name || item.fileName || (item.fileObject ? item.fileObject.name : null);

        if (!fileBlob && fileName) {
            try {
                const response = await fetch(`http://localhost:5000/uploads/${fileName}`);
                fileBlob = await response.blob();
            } catch (e) {
                console.error("File fetch failed", e);
                return `<p style="color:red; font-size:16px;">Error loading file from server.</p>`;
            }
        }

        if (!fileBlob) return '<p style="font-size:16px;">No file available.</p>';

        const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';

        if (ext === 'docx') {
            try {
                const arrayBuffer = await fileBlob.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                return `<div class="word-parsed-content">${result.value}</div>`;
            } catch (err) {
                return `<p style="color:red; font-size:16px;">Failed to parse Word file: ${err.message}</p>`;
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
                return `<p style="color:red; font-size:16px;">Failed to parse Excel file: ${err.message}</p>`;
            }
        }

        return '';
    };

    const handlePrintUploadedFile = async () => {
        try {
            const params = { academicYear, department, program };
            
            const [res71, res72, res73, res74] = await Promise.all([
                axios.get(`http://localhost:5000/api/criteria/7/7.1/data`, { params }).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/criteria/7/7.2/data`, { params }).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/criteria/7/7.3/data`, { params }).catch(() => ({ data: [] })),
                axios.get(`http://localhost:5000/api/criteria/7/7.4/data`, { params }).catch(() => ({ data: [] }))
            ]);

            const allCriteriaList = [
                { title: "7.1 Actions taken based on the reviews of higher level advisory body", data: res71.data || [] },
                { title: "7.2 Mentoring system to help at individual level", data: res72.data || [] },
                { title: "7.3 Feedback analysis and reward / corrective measures", data: res73.data || [] },
                { title: "7.4 Scope for self-learning", data: res74.data || [] },
                { 
                    title: "7.5 Project Laboratory / Research Laboratory / Centre of Excellence", 
                    data: tableData.map(r => ({
                        row_id: r.s_n,
                        s_n: r.s_n,
                        item: r.point,
                        current_status: r.description,
                        file_name: r.fileName,
                        fileObject: r.fileObject
                    })) 
                }
            ];

            const printWindow = window.open('', '_blank');
            if (!printWindow) { 
                alert("Please disable your browser's Pop-up blocker!"); 
                return; 
            }

            printWindow.document.write(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                        <h2 style="font-size: 22px;">Generating Full Report for Criteria 7 (7.1 to 7.5)... Please wait.</h2>
                    </body>
                </html>
            `);

            let fullContentHTML = '';

            for (let cIdx = 0; cIdx < allCriteriaList.length; cIdx++) {
                const crit = allCriteriaList[cIdx];

                fullContentHTML += `<div class="crit-section">`;
                fullContentHTML += `<h2 class="section-title">${crit.title}</h2>`;

                if (!crit.data || crit.data.length === 0) {
                    fullContentHTML += `<p style="padding: 10px; color: #718096; font-style: italic; font-size: 15px;">No records submitted for this sub-section.</p>`;
                } else {
                    for (let idx = 0; idx < crit.data.length; idx++) {
                        const item = crit.data[idx];
                        const fileName = item.file_name || item.fileName || (item.fileObject ? item.fileObject.name : null);
                        let fileURL = null;

                        if (item.fileObject) {
                            fileURL = URL.createObjectURL(item.fileObject);
                        } else if (fileName) {
                            fileURL = `http://localhost:5000/uploads/${fileName}`;
                        }

                        const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';
                        let previewHTML = '';

                        if (ext === 'pdf') {
                            previewHTML = `<embed src="${fileURL}" type="application/pdf" class="embed-view" />`;
                        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
                            previewHTML = `<img src="${fileURL}" class="img-view" alt="Document" />`;
                        } else if (['docx', 'xlsx', 'xls', 'csv'].includes(ext)) {
                            previewHTML = await readFileContentHTML(item);
                        } else if (fileName) {
                            previewHTML = `
                                <div style="padding: 10px; background: #edf2f7; border: 1px dashed #cbd5e0; border-radius: 4px;">
                                    <p style="margin:0; font-size: 15px; color: #4a5568;">Attachment: <strong>${fileName}</strong> (Preview unavailable for this format)</p>
                                </div>
                            `;
                        }

                        // पहिल्या पानावरचा अगदी पहिला पॉईंट ब्रेक होणार नाही, पण बाकीचे सर्व पॉईंट्स नवीन पानावर सुरू होतील
                        const isVeryFirstPoint = (cIdx === 0 && idx === 0);

                        fullContentHTML += `
                            <div class="file-card ${isVeryFirstPoint ? 'first-card-fix' : ''}">
                                <div class="card-title">Point ${item.s_n || item.row_id || idx + 1}: ${item.item || item.point || ''}</div>
                                <div class="card-body">
                                    <p style="font-size: 15px; margin-bottom: 8px;"><strong>Description:</strong> ${item.current_status || item.description || '<em>No description provided</em>'}</p>
                                    <p style="font-size: 15px; margin-bottom: 10px;"><strong>Uploaded Document:</strong> ${fileName ? fileName : '<em>No file attached</em>'}</p>
                                    ${previewHTML ? `
                                        <div class="content-preview">
                                            <strong style="font-size: 15px;">Document Preview:</strong>
                                            <div style="margin-top: 6px;">${previewHTML}</div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }
                }

                fullContentHTML += `</div>`;
            }

            printWindow.document.open();
            printWindow.document.write(`
                <html>
                <head>
                    <title>Criteria 7 (7.1 to 7.5) Full Report</title>
                    <style>
                        @page { 
                            size: A4 portrait; 
                            margin: 10mm 12mm; 
                        }
                        
                        * {
                            box-sizing: border-box;
                        }

                        html, body { 
                            font-family: 'Segoe UI', Arial, sans-serif; 
                            color: #2d3748; 
                            background: #fff; 
                            margin: 0 !important; 
                            padding: 0 !important; 
                            font-size: 14px;
                            line-height: 1.5;
                        }
                        
                        /* Header Rule for Page 1 */
                        .main-header { 
                            text-align: center; 
                            border-bottom: 2px solid #00133e; 
                            padding-bottom: 6px; 
                            margin-bottom: 12px; 
                            margin-top: 0 !important;
                            page-break-before: avoid !important;
                            break-before: avoid !important;
                            page-break-after: avoid !important;
                            break-after: avoid !important;
                        }

                        .main-header h1 { 
                            margin: 0; 
                            color: #00133e; 
                            font-size: 18px; 
                            text-transform: uppercase; 
                            font-weight: 700;
                        }

                        .crit-section { 
                            margin-top: 0px;
                        }

                        .section-title { 
                            background: #00133e; 
                            color: #fff; 
                            padding: 8px 12px; 
                            margin-top: 15px; 
                            margin-bottom: 12px; 
                            border-radius: 4px; 
                            font-size: 16px; 
                            font-weight: 600;
                            page-break-after: avoid !important; 
                            break-after: avoid !important;
                        }

                        /* १ल्या पानावरचा पहिला सेक्शन Header नंतर लगेच चालू होईल */
                        .crit-section:first-of-type,
                        .crit-section:first-of-type .section-title {
                            page-break-before: avoid !important;
                            break-before: avoid !important;
                            margin-top: 0 !important;
                        }

                        /* 🟢 प्रत्येक नवीन Point नवीन पानावर सुरू होण्यासाठी चा मुख्य नियम */
                        .file-card { 
                            border: 1px solid #cbd5e0; 
                            border-radius: 6px; 
                            margin-bottom: 15px; 
                            overflow: hidden; 
                            page-break-before: always !important; 
                            break-before: page !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }

                        /* पहिला पॉईंट १ल्या पानावर हेडरसोबत दिसेल */
                        .first-card-fix, 
                        .crit-section:first-of-type .file-card:first-of-type {
                            page-break-before: avoid !important;
                            break-before: avoid !important;
                        }

                        .card-title { 
                            background-color: #edf2f7; 
                            color: #00133e; 
                            padding: 8px 12px; 
                            font-weight: bold; 
                            font-size: 15px; 
                            border-bottom: 1px solid #cbd5e0; 
                            page-break-after: avoid !important;
                            break-after: avoid !important;
                        }
                        
                        .card-body { 
                            padding: 12px; 
                            background-color: #fff; 
                            font-size: 14px;
                        }
                        
                        .content-preview { 
                            margin-top: 8px; 
                            padding-top: 8px; 
                            border-top: 1px dashed #cbd5e0; 
                        }

                        .embed-view { 
                            width: 100%; 
                            height: 480px; 
                            border: 1px solid #cbd5e0; 
                            margin-top: 6px; 
                            border-radius: 4px; 
                        }
                        
                        .img-view { 
                            max-width: 100%; 
                            max-height: 420px; 
                            display: block; 
                            margin: 6px auto; 
                            border: 1px solid #cbd5e0; 
                            border-radius: 4px; 
                        }

                        .word-parsed-content { 
                            padding: 10px; 
                            border: 1px solid #cbd5e0; 
                            background: #ffffff; 
                            border-radius: 4px; 
                            line-height: 1.4; 
                            font-size: 14px; 
                        }

                        .excel-parsed-content { 
                            overflow-x: auto; 
                            margin-top: 6px; 
                        }

                        .excel-parsed-content table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            font-size: 13px; 
                        }

                        .excel-parsed-content th, .excel-parsed-content td { 
                            border: 1px solid #cbd5e0; 
                            padding: 6px 8px; 
                            text-align: left; 
                        }

                        @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .embed-view { height: 460px !important; }
                        }
                    </style>
                </head>
                <body>
                    <div class="main-header">
                        <h1>Criteria 7 - Institutional Values and Best Practices (7.1 to 7.5)</h1>
                    </div>
                    ${fullContentHTML}
                </body>
                </html>
            `);

            printWindow.document.close();
            printWindow.focus();

            printWindow.onafterprint = () => {
                printWindow.close();
            };

            setTimeout(() => { 
                printWindow.print(); 
            }, 1200);

        } catch (err) {
            console.error("Error generating print report:", err);
            alert("Failed to load full report for printing.");
        }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <div style={{ width: '250px', flexShrink: 0 }}>
                <NBASidebar />
            </div>

            <div style={{ flex: 1, padding: '20px', boxSizing: 'border-box' }}>
                <div style={{ backgroundColor: '#00133e', color: '#ffffff', padding: '12px 18px', borderRadius: '6px 6px 0 0', fontWeight: 'bold', fontSize: '16px' }}>
                    7.5 Project Laboratory / Research Laboratory / Centre of Excellence (20)
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e0', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '15px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e0' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#e2e8f0' }}>
                                <th rowSpan="2" style={{ width: '6%', padding: '10px 6px', border: '1px solid #cbd5e0', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>Sr. No.</th>
                                <th rowSpan="2" style={{ width: '30%', padding: '10px 10px', border: '1px solid #cbd5e0', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>Point</th>
                                <th rowSpan="2" style={{ width: '44%', padding: '10px 10px', border: '1px solid #cbd5e0', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>Description</th>
                                <th colSpan="3" style={{ width: '20%', padding: '8px', border: '1px solid #cbd5e0', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>Action</th>
                            </tr>
                            <tr style={{ backgroundColor: '#edf2f7' }}>
                                <th style={{ padding: '6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>View</th>
                                <th style={{ padding: '6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>Upload</th>
                                <th style={{ padding: '6px', border: '1px solid #cbd5e0', fontSize: '12px', textAlign: 'center', fontWeight: 'bold', color: '#00133e' }}>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px 6px', fontSize: '13px', borderRight: '1px solid #cbd5e0', color: '#000000' }}>
                                        {row.s_n}
                                    </td>
                                    <td style={{ padding: '10px', fontSize: '13px', color: '#000080', fontWeight: 'bold', borderRight: '1px solid #cbd5e0' }}>
                                        {row.point}
                                    </td>
                                    <td style={{ padding: '8px', borderRight: '1px solid #cbd5e0' }}>
                                        <textarea 
                                            rows="2"
                                            value={row.description} 
                                            onChange={(e) => handleInputChange(row.id, e.target.value)} 
                                            style={{ width: '100%', height: '42px', padding: '6px 8px', border: '1px solid #cbd5e0', borderRadius: '4px', resize: 'vertical', fontSize: '13px', boxSizing: 'border-box' }}
                                        />
                                    </td>

                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #cbd5e0', padding: '6px' }}>
                                        <button 
                                            type="button" 
                                            title="View File"
                                            onClick={() => handleViewFile(row)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                        >
                                            👁️
                                        </button>
                                    </td>

                                    <td style={{ textAlign: 'center', verticalAlign: 'middle', borderRight: '1px solid #cbd5e0', padding: '6px' }}>
                                        <input 
                                            type="file" 
                                            ref={(el) => (fileInputRefs.current[row.id] = el)}
                                            style={{ display: 'none' }}
                                            onChange={(e) => handleFileChange(row.id, e)}
                                            accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.xls,.csv"
                                        />
                                        <button 
                                            type="button" 
                                            title={row.fileName ? `Uploaded: ${row.fileName}` : "Upload File"}
                                            onClick={() => fileInputRefs.current[row.id]?.click()}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                        >
                                            {row.fileName ? '✅' : '📤'}
                                        </button>
                                        
                                        {row.fileName && (
                                            <div style={{ fontSize: '10px', color: '#276749', fontWeight: 'bold', marginTop: '2px', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.fileName}
                                            </div>
                                        )}
                                    </td>

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

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/7.1')}
                            style={{ padding: '8px 16px', backgroundColor: '#37474F', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                             Back 
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/criteria/7.4')}
                            style={{ padding: '8px 16px', backgroundColor: '#E65100', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                             Previous 
                        </button>

                        <button 
                            type="button" 
                            onClick={saveToServer}
                            style={{ padding: '8px 16px', backgroundColor: '#2E7D32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                            Save 
                        </button>

                        <button 
                            type="button" 
                            onClick={handleClear}
                            style={{ padding: '8px 16px', backgroundColor: '#dd6b20', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                             Clear 
                        </button>

                        <button 
                            type="button" 
                            onClick={handleDelete}
                            style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                             Delete
                        </button>

                        <button 
                            type="button" 
                            onClick={handlePrintUploadedFile}
                            style={{ padding: '8px 16px', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
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