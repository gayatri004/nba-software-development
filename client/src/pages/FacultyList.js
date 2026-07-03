import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/FacultyList.css";

function FacultyList() {

  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {

      const response = await axios.get(
        "http://localhost:5000/faculty"
      );

      setFaculty(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div>

    </div>
  );
}

export default FacultyList;