import { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

function CrudPage({
  setIsLoggedIn,
  title,
  fields = [],
  initialData = [],
}) {
  const navigate = useNavigate();

  const [data, setData] = useState(initialData);

  const [search, setSearch] = useState("");

  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({});

  const filteredData = data.filter((row) =>

    fields.some((field) =>
      String(row[field.name] || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  );

  const startEdit = (index, row) => {

    setEditIndex(index);

    setEditData({ ...row });

  };

  const handleChange = (e) => {

    setEditData({

      ...editData,

      [e.target.name]: e.target.value,

    });

  };

  const saveEdit = () => {

    const temp = [...data];

    temp[editIndex] = editData;

    setData(temp);

    setEditIndex(null);

    setEditData({});

  };

  const cancelEdit = () => {

    setEditIndex(null);

    setEditData({});

  };

  const deleteRow = (index) => {

    if (!window.confirm("Delete this record?")) return;

    const temp = [...data];

    temp.splice(index, 1);

    setData(temp);

  };

  return (

    <div className="dashboard">

      <Sidebar
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="main-content">

        <div className="page-card">
                    <div className="page-title-row">

            <h2>{title}</h2>

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >

              <input
                type="text"
                placeholder={`Search ${title}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />

              <button
  className="add-btn"
  onClick={() => {
    if (title === "Course Management") {
      navigate("/course-master");
    }
  }}
>
  + Add New
</button>
            </div>

          </div>

          <div className="table-wrapper">

            <table className="employee-table">

              <thead>

                <tr>

                  {fields.map((field) => (

                    <th key={field.name}>

                      {field.label}

                    </th>

                  ))}

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredData.length === 0 ? (

                  <tr>

                    <td
                      colSpan={fields.length + 1}
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >

                      No Records Found

                    </td>

                  </tr>

                ) : (

                  filteredData.map((row, index) => (

                    <tr key={index}>

                      {fields.map((field) => (

                        <td key={field.name}>

                          {editIndex === index ? (

                            <input
                              name={field.name}
                              value={editData[field.name] || ""}
                              onChange={handleChange}
                            />

                          ) : (

                            row[field.name]

                          )}

                        </td>

                      ))}

                      <td>
                                                {editIndex === index ? (

                          <>

                            <button
                              className="save-btn"
                              onClick={saveEdit}
                            >
                              Save
                            </button>

                            <button
                              className="cancel-btn"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>

                          </>

                        ) : (

                          <>

                            <button
                              className="edit-btn"
                              onClick={() =>
                                startEdit(index, row)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                deleteRow(index)
                              }
                            >
                              Delete
                            </button>

                          </>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>

  );

}

export default CrudPage;