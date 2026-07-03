import CrudPage from "../components/CrudPage";

function Reports({ setIsLoggedIn }) {
  return (
    <CrudPage
      setIsLoggedIn={setIsLoggedIn}
      title="Reports"
      fields={[
        { name: "id", label: "Report ID" },
        { name: "name", label: "Report Name" },
        { name: "type", label: "Type" },
        { name: "date", label: "Date" },
        { name: "status", label: "Status" },
      ]}
      initialData={[
        { id: "REP001", name: "Salary Report", type: "PDF", date: "26-05-2025", status: "Generated" },
      ]}
    />
  );
}

export default Reports;