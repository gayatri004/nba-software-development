import CrudPage from "../components/CrudPage";

function Attendance({ setIsLoggedIn }) {
  return (
    <CrudPage
      setIsLoggedIn={setIsLoggedIn}
      title="Attendance Management"
      fields={[
        { name: "id", label: "Employee ID" },
        { name: "name", label: "Name" },
        { name: "date", label: "Date" },
        { name: "status", label: "Status" },
        { name: "timeIn", label: "Time In" },
        { name: "timeOut", label: "Time Out" },
      ]}
      initialData={[
        { id: "EMP001", name: "Ramesh Sharma", date: "26-05-2025", status: "Present", timeIn: "10:00 AM", timeOut: "05:00 PM" },
      ]}
    />
  );
}

export default Attendance;