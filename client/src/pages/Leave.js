import CrudPage from "../components/CrudPage";

function Leave({ setIsLoggedIn }) {
  return (
    <CrudPage
      setIsLoggedIn={setIsLoggedIn}
      title="Leave Management"
      fields={[
        { name: "id", label: "Leave ID" },
        { name: "name", label: "Employee Name" },
        { name: "type", label: "Leave Type" },
        { name: "from", label: "From Date" },
        { name: "to", label: "To Date" },
        { name: "status", label: "Status" },
      ]}
      initialData={[
        { id: "LEV001", name: "Priya Patil", type: "Casual", from: "26-05-2025", to: "28-05-2025", status: "Pending" },
      ]}
    />
  );
}

export default Leave;