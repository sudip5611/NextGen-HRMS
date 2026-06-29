import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css"; // 🔷 Import our new styles!

export default function PersonalData() {
  const { state } = useLocation();
  const navigate = useNavigate(); 

  const initialData = (state?.selectedEmployees || []).map(emp => ({
   ...emp,
   designation: emp.designation || "",
   posting: emp.posting || "", 
   dob: emp.dob || "", 
  }));
  
  const [employees, setEmployees] = useState(initialData);

  const handleSave = () => {
    fetch("http://localhost:8080/employees/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(employees)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Saved:", data);
      alert("Employees saved successfully!");
      navigate("/"); 
    })
    .catch(err => console.log("Error saving:", err));
  };

  return (
    <div className="container">
      <h2>Update Personal Data</h2>
      <button onClick={() => navigate("/")} style={{marginBottom: "15px"}}>← Back to List</button>

      {employees.map((emp, index) => (
        <div key={emp.id} className="employee-card">
          <h4>{emp.name}</h4>
          
          <div className="input-grid">
            <div>
              <label style={{fontSize: "12px", color: "#7f8c8d", display: "block"}}>Name</label>
              <input value={emp.name} readOnly style={{backgroundColor: "#f1f1f1"}} />
            </div>
            
            <div>
              <label style={{fontSize: "12px", color: "#7f8c8d", display: "block"}}>Date of Birth</label>
              <input 
                type="date" 
                value={emp.dob} 
                onChange={(e) => {
                  const updated = [...employees];
                  updated[index].dob = e.target.value;
                  setEmployees(updated);
                }}
              />
            </div>

            <div>
              <label style={{fontSize: "12px", color: "#7f8c8d", display: "block"}}>Designation</label>
              <input value={emp.designation} readOnly style={{backgroundColor: "#f1f1f1"}} />
            </div>
            
            <div>
              <label style={{fontSize: "12px", color: "#3498db", display: "block", fontWeight: "bold"}}>New Posting</label>
              <input
                placeholder="Enter Posting..."
                value={emp.posting}
                onChange={(e) => {
                  const updated = [...employees];
                  updated[index].posting = e.target.value;
                  setEmployees(updated);
                }}
              />
            </div>
          </div>
        </div>
      ))}

      <button onClick={handleSave} className="btn-add" style={{ width: "100%", marginTop: "20px", fontSize: "16px" }}>
        Save All Changes
      </button>
    </div>
  );
}