import CrudPage from "../components/CrudPage";

function Settings({ setIsLoggedIn }) {
  return (
    <CrudPage
      setIsLoggedIn={setIsLoggedIn}
      title="Settings"
      fields={[
        { name: "id", label: "Setting ID" },
        { name: "name", label: "Setting Name" },
        { name: "value", label: "Value" },
        { name: "status", label: "Status" },
      ]}
      initialData={[
        { id: "SET001", name: "Theme", value: "Blue White", status: "Active" },
      ]}
    />
  );
}

export default Settings;