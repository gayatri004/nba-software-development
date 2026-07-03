const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running...");
});

// Get All Employees
app.get("/employees", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM employees ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

// Add Employee
app.post("/employees", async (req, res) => {
    try {
        const { name, department, designation, mobile, email, status } = req.body;

        const result = await pool.query(
            `INSERT INTO employees(name, department, designation, mobile, email, status)
             VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
            [name, department, designation, mobile, email, status]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});