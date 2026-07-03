
import CrudPage from "../components/CrudPage";

function Faculty({ setIsLoggedIn }) {
  return (
    <CrudPage
      setIsLoggedIn={setIsLoggedIn}
      title="Faculty Management"
      fields={[
        { name: "id", label: "Faculty ID" },
        { name: "name", label: "Faculty Name" },
        { name: "department", label: "Department" },
        { name: "qualification", label: "Qualification" },
        { name: "designation", label: "Designation" },
        { name: "mobile", label: "Mobile" },
      ]}
      initialData={[
        { id: "FAC001", name: "Priya Patil", department: "Computer Science", qualification: "MCA", designation: "Professor", mobile: "9876543210" },
      ]}
    />
  );
}

export default Faculty;