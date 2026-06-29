import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import "../App.css"; // 🔷 Import our new styles!

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  const loadEmployees = () => {
    fetch("http://localhost:8080/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.log("Error fetching data:", err));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAdd = () => {
    if (!newName) {
      alert("Please enter a name!");
      return;
    }
    const newEmployee = { name: newName, designation: newDesignation };
    fetch("http://localhost:8080/employees/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([newEmployee]) 
    })
      .then((res) => res.json())
      .then(() => {
        loadEmployees(); 
        setNewName(""); 
        setNewDesignation("");
      })
      .catch((err) => console.log("Error adding:", err));
  };

  const handleDelete = (id, name) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!isConfirmed) return; 

    fetch(`http://localhost:8080/employees/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        loadEmployees(); 
        setSelected(selected.filter((e) => e.id !== id)); 
      })
      .catch((err) => console.log("Error deleting:", err));
  };

  const toggle = (emp) => {
    setSelected((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      return exists
        ? prev.filter((e) => e.id !== emp.id)
        : [...prev, emp];
    });
  };

  // 1. Check if every single employee is currently selected
  const isAllSelected = employees.length > 0 && selected.length === employees.length;

  // 2. The function that runs when you click "Select All"
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // If checked, put ALL employees into the selected list
      setSelected([...employees]);
    } else {
      // If unchecked, empty the selected list completely
      setSelected([]);
    }
  };

  return (
    <div className="container">
      <h2>Employee Management System</h2>

      <div className="form-group">
        <input 
          placeholder="New Employee Name" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <input 
          placeholder="Designation" 
          value={newDesignation} 
          onChange={(e) => setNewDesignation(e.target.value)} 
        />
        <button onClick={handleAdd} className="btn-add">Add Employee</button>
      </div>

      <button onClick={loadEmployees}>Refresh Data</button>

      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={isAllSelected} 
                onChange={handleSelectAll} 
                title="Select All"
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No employees found</td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.some((e) => e.id === emp.id)}
                    onChange={() => toggle(emp)}
                  />
                </td>
                <td>#{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.designation}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(emp.id, emp.name)} 
                    className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selected.length > 0 && (
        <>
          <h3>Selected for Updates</h3>
          <ul>
            {selected.map((e) => (
              <li key={e.id}>{e.name}</li>
            ))}
          </ul>
        </>
      )}

      <button
        className="btn-next"
        onClick={() =>
          navigate("/personal-data", {
            state: { selectedEmployees: selected }
          })
        }
        disabled={selected.length === 0}
      >
        Update Selected Employees
      </button>
    </div>
  );
}