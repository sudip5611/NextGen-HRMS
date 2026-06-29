import React, { useState, useEffect } from 'react';
import './App.css';

// ==========================================
// 🛑 REUSABLE UI COMPONENTS MOVED OUTSIDE THE MAIN APP! 🛑
// ==========================================

const Divider = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
    <hr style={{ flex: 1, borderTop: '1px dashed #cbd5e1' }} />
    <span style={{ padding: '0 15px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>
      {text}
    </span>
    <hr style={{ flex: 1, borderTop: '1px dashed #cbd5e1' }} />
  </div>
);

// We now pass portalRole and setPortalRole as props so it can talk to the App
const RoleTabs = ({ portalRole, setPortalRole }) => (
  <div style={{ marginBottom: '30px', display: 'flex', borderBottom: '2px solid #e2e8f0' }}>
    <div 
      onClick={() => setPortalRole('employee')}
      style={{ flex: 1, padding: '12px 0', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s',
        color: portalRole === 'employee' ? '#0f172a' : '#94a3b8',
        borderBottom: portalRole === 'employee' ? '3px solid #0d9488' : '3px solid transparent'
      }}>
      Personnel Access
    </div>
    <div 
      onClick={() => setPortalRole('admin')}
      style={{ flex: 1, padding: '12px 0', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s',
        color: portalRole === 'admin' ? '#0f172a' : '#94a3b8',
        borderBottom: portalRole === 'admin' ? '3px solid #0d9488' : '3px solid transparent'
      }}>
      Admin Control
    </div>
  </div>
);

const SplitScreenAuth = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
    <div style={{ flex: 1, backgroundColor: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
      <div style={{ width: '80px', height: '80px', backgroundColor: '#0d9488', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '36px', marginBottom: '25px', boxShadow: '0 10px 20px rgba(13, 148, 136, 0.3)' }}>
        📄
      </div>
      <h1 style={{ fontSize: '38px', margin: '0 0 15px 0', fontWeight: '300', letterSpacing: '1px' }}>ACR<span style={{ fontWeight: 'bold', color: '#0d9488' }}>Portal</span></h1>
      <p style={{ fontSize: '16px', color: '#94a3b8', textAlign: 'center', maxWidth: '350px', lineHeight: '1.6' }}>
        Securely submit, track, and manage Annual Confidential Reports through our modernized digital infrastructure.
      </p>
    </div>
    <div style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', width: '100%', maxWidth: '420px' }}>
        {children}
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN APP COMPONENT
// ==========================================

function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [portalRole, setPortalRole] = useState('employee'); 
  const [loggedInUserId, setLoggedInUserId] = useState('');
  
  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState([]); 

  const [showDirectory, setShowDirectory] = useState(false);

  const [empId, setEmpId] = useState('');
  const [acrEntries, setAcrEntries] = useState([{ target: '', achievement: '' }]);

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupId, setSignupId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [selectedForNotice, setSelectedForNotice] = useState([]);  
  const [showAcrForm, setShowAcrForm] = useState(false);

  const [reviewingEmp, setReviewingEmp] = useState(null); 
  const [reviewDetails, setReviewDetails] = useState(null); 
  const [adminRating, setAdminRating] = useState('Good');

  const [searchTerm, setSearchTerm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const fetchData = () => {
    fetch('http://localhost:8080/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error fetching employees:', error));

    fetch('http://localhost:8080/acr/status')
      .then(response => response.json())
      .then(data => setStatuses(data))
      .catch(error => console.error('Error fetching statuses:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();

    const hasLength = signupPassword.length >= 6;
    const hasCapital = /[A-Z]/.test(signupPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword);
    
    if (!hasLength || !hasCapital || !hasSpecial) {
        alert("Please ensure your password meets all security requirements.");
        return; // Stops the function immediately
    }

    if (signupPassword !== signupConfirmPassword) {
      alert("Error: Passwords do not match!");
      return;
    }

    const newUser = { employeeId: signupId, password: signupPassword, role: portalRole };

    fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      if (message.includes("successful")) {
        setCurrentView('login'); 
        setSignupId('');
        setSignupPassword('');
      }
    })
    .catch(error => console.error('Error signing up:', error));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const credentials = { employeeId: loginId, password: loginPassword };

    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    .then(response => response.text())
    .then(text => {
      if (!text) {
        alert("Invalid Employee ID or Password!"); 
        return;
      }
      
      const user = JSON.parse(text); 
      
      if (user.role !== portalRole) {
        alert(`Access Denied! You are trying to log in through the ${portalRole} portal, but your account is registered as an ${user.role}.`);
        return;
      }

      setLoggedInUserId(user.employeeId);
      setEmpId(user.employeeId); 
      setCurrentView(user.role); 
      
      setLoginId('');
      setLoginPassword('');
    })
    .catch(error => console.error('Error logging in:', error));
  };

  const handleLogout = () => {
    setCurrentView('login');
    setLoggedInUserId('');
    setEmpId('');
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...acrEntries];
    newEntries[index][field] = value;
    setAcrEntries(newEntries);
  };

  const handleAddEntry = () => {
    setAcrEntries([...acrEntries, { target: '', achievement: '' }]);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = acrEntries.filter((_, i) => i !== index);
    setAcrEntries(newEntries);
  };

  const handleAcrSubmit = (e) => {
    e.preventDefault();
    
    // 🔷 NEW: Format the dynamic fields into a clean numbered list for the database
    const formattedTargets = acrEntries.map((entry, i) => `${i + 1}. ${entry.target}`).join('\n\n');
    const formattedAchievements = acrEntries.map((entry, i) => `${i + 1}. ${entry.achievement}`).join('\n\n');

    const acrData = { employeeId: empId, target: formattedTargets, achievement: formattedAchievements };

    fetch('http://localhost:8080/acr/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acrData)
    })
    .then(response => response.text())
    .then(message => {
      alert(message); 
      setAcrEntries([{ target: '', achievement: '' }]); // Reset form to default
      setShowAcrForm(false); 
      fetchData(); 
    })
    .catch(error => console.error('Error saving ACR:', error));
  };

  const handleViewAcr = (emp) => {
    fetch(`http://localhost:8080/acr/details/${emp.employeeId}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setReviewingEmp(emp);
          setReviewDetails(data[data.length - 1]); // Collects the latest sequential layout string
          console.log("INCOMING DATA:", data[data.length - 1]);
          setAdminRating('Good'); // Default initial fallback dropdown select string
        } else {
          alert("Operational Failure: Could not load data details for this profile.");
        }
      })
      .catch(error => console.error('Error fetching dynamic file details:', error));
  };

  const handleReviewSubmit = (approvalStatus) => {
    if (!reviewingEmp) return;

    fetch(`http://localhost:8080/acr/review/${reviewingEmp.employeeId}?rating=${adminRating}&approvalStatus=${approvalStatus}`, {
      method: 'POST'
    })
    .then(response => response.text())
    .then(message => {
      alert(message);
      setReviewingEmp(null);
      setReviewDetails(null);
      fetchData(); // 🔄 Re-fetches database layout state to shift UI bars automatically
    })
    .catch(error => console.error('Error writing review modification records:', error));
  };

  // ==========================================
  // SCREEN 1: LOGIN (Split Screen)
  // ==========================================
  if (currentView === 'login') {
    return (
      <SplitScreenAuth>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#0f172a' }}>Welcome Back</h2>
        <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '14px' }}>Please enter your credentials to continue.</p>

        {/* Notice how we pass the variables to the tabs now! */}
        <RoleTabs portalRole={portalRole} setPortalRole={setPortalRole} />

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Employee ID</label>
            <input 
              type="number" 
              value={loginId} 
              onChange={(e) => setLoginId(e.target.value)} 
              required 
              autoComplete="off" 
              style={{ width: '100%', padding: '14px', marginTop: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', outlineColor: '#0d9488' }}
            />
          </div>
          
          {/* 🔷 UPDATED PASSWORD FIELD WITH TOGGLE */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative', width: '100%', marginTop: '8px' }}>
              <input 
                type={showLoginPassword ? "text" : "password"} 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                required 
                autoComplete="current-password" 
                style={{ width: '100%', padding: '14px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', outlineColor: '#0d9488' }}
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  marginTop: '-3px',    // The manual upwards nudge
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px', 
                  padding: 0,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                {showLoginPassword ? "🔓" : "🔒"} 
              </button>
            </div>
          </div>

          <button type="submit" style={{ marginTop: '15px', padding: '16px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)' }}>
            Authenticate
          </button>
        </form>

        <Divider text="New User?" />

        <p style={{ margin: 0, fontSize: '14px', textAlign: 'center', color: '#64748b' }}>
          Don't have access? <span onClick={() => setCurrentView('signup')} style={{ color: '#0d9488', cursor: 'pointer', fontWeight: 'bold' }}>Create Account</span>
        </p>
      </SplitScreenAuth>
    );
  }

  // ==========================================
  // SCREEN 2: SIGN UP (Split Screen)
  // ==========================================
  if (currentView === 'signup') {

    const hasLength = signupPassword.length >= 6;
    const hasNumeric = /[0-9]/.test(signupPassword);
    const hasCapital = /[A-Z]/.test(signupPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword);
    const isPasswordValid = hasLength && hasNumeric && hasCapital && hasSpecial;

    return (
      <SplitScreenAuth>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#0f172a' }}>System Registration</h2>
        <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '14px' }}>Enroll your ID into the digital portal.</p>

        <RoleTabs portalRole={portalRole} setPortalRole={setPortalRole} />

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Assigned Employee ID</label>
            <input type="number" value={signupId} onChange={(e) => setSignupId(e.target.value)} required autoComplete="off" style={{ width: '100%', padding: '14px', marginTop: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', boxSizing: 'border-box', outlineColor: '#0d9488' }}/>
          </div>
          
          {/* --- CREATE SECURE PASSWORD --- */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Create Secure Password</label>
            <div style={{ position: 'relative', width: '100%', marginTop: '5px' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={signupPassword} 
                onChange={(e) => setSignupPassword(e.target.value)} 
                required 
                autoComplete="new-password" 
                style={{ width: '100%', padding: '14px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  marginTop: '-3px',    // 🔷 The manual upwards nudge!
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px', 
                  padding: 0,
                  display: 'flex',      // 🔷 Forces the emoji to behave
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                {showPassword ? "🔓" : "🔒"} 
              </button>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '5px' }}>
              <div style={{ fontSize: '13px', color: hasLength ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: hasLength ? 'bold' : 'normal', transition: '0.2s' }}>
                <span>{hasLength ? '✓' : '○'}</span> At least 6 characters
              </div>
              <div style={{ fontSize: '13px', color: hasNumeric ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: hasNumeric ? 'bold' : 'normal', transition: '0.2s' }}>
                <span>{hasNumeric ? '✓' : '○'}</span> At least one number
              </div>
              <div style={{ fontSize: '13px', color: hasCapital ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: hasCapital ? 'bold' : 'normal', transition: '0.2s' }}>
                <span>{hasCapital ? '✓' : '○'}</span> At least one capital letter
              </div>
              <div style={{ fontSize: '13px', color: hasSpecial ? '#10b981' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: hasSpecial ? 'bold' : 'normal', transition: '0.2s' }}>
                <span>{hasSpecial ? '✓' : '○'}</span> At least one special character (@, #, !, etc.)
              </div>
            </div>
          </div>

          {/* --- CONFIRM PASSWORD --- */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Confirm Password</label>
            <div style={{ position: 'relative', width: '100%', marginTop: '5px' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={signupConfirmPassword} 
                onChange={(e) => setSignupConfirmPassword(e.target.value)} 
                required 
                autoComplete="new-password" 
                style={{ width: '100%', padding: '14px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  marginTop: '-3px',    // 🔷 The manual upwards nudge!
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px', 
                  padding: 0,
                  display: 'flex',      // 🔷 Forces the emoji to behave
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                {showConfirmPassword ? "🔓" : "🔒"} 
              </button>
            </div>
          </div>

          <div style={{ marginTop: '5px', padding: '15px', borderRadius: '8px', fontSize: '13px', backgroundColor: '#f0fdf4', color: '#166534', borderLeft: '4px solid #22c55e' }}>
            <strong>Note:</strong> Ensure your ID is already present in the master HR database prior to registration.
          </div>

          <button type="submit" style={{ marginTop: '10px', padding: '16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' }}>
            Register Account
          </button>
        </form>

        <Divider text="Returning User?" />

        <p style={{ margin: 0, fontSize: '14px', textAlign: 'center', color: '#64748b' }}>
          Already enrolled? <span onClick={() => setCurrentView('login')} style={{ color: '#0d9488', cursor: 'pointer', fontWeight: 'bold' }}>Return to Login</span>
        </p>
      </SplitScreenAuth>
    );
  }

  // ==========================================
  // SCREEN 3: ADMIN DASHBOARD (With Bulk Notifications)
  // ==========================================
  if (currentView === 'admin') {

    // Calculate Metrics
    const total = employees.length;
    let submitted = 0;
    let pending = 0;
    let notNotified = 0;

    const dashboardData = employees.map(emp => {
      const stat = statuses.find(s => s.employeeId === emp.employeeId) || {};
      let currentStatus = 'Not Notified';
      
      if (stat.isAcrSubmitted) {
        if (stat.approvalStatus === 'Approved') currentStatus = 'Approved';
        else if (stat.approvalStatus === 'Disapproved') currentStatus = 'Disapproved';
        else currentStatus = 'Submitted';
        submitted++;
      } else if (stat.isNotified) {
        currentStatus = 'Pending';
        pending++;
      } else {
        notNotified++;
      }
      
      return { ...emp, currentStatus, rating: stat.rating };
    });

    const submittedPct = total ? (submitted / total) * 100 : 0;
    const pendingPct = total ? (pending / total) * 100 : 0;
    const notNotifiedPct = total ? (notNotified / total) * 100 : 0;

    // 🔷 NEW: Live Search Filter Logic
    const filteredRoster = dashboardData.filter(emp => {
      const firstName = emp.empFirstName || emp.emp_first_name || '';
      const lastName = emp.empLastName || emp.emp_last_name || '';
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      
      const empId = String(emp.employeeId || emp.employee_id || emp.id);
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || empId.includes(search);
    });

    // 🔷 NEW: Checkbox Handlers
    const eligibleEmployees = dashboardData.filter(e => e.currentStatus === 'Not Notified').map(e => e.employeeId);

    const handleSelectEmployee = (id) => {
      setSelectedForNotice(prev => 
        prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
      );
    };

    const handleSelectAll = () => {
      if (selectedForNotice.length === eligibleEmployees.length) {
        setSelectedForNotice([]); // Deselect all
      } else {
        setSelectedForNotice(eligibleEmployees); // Select all eligible
      }
    };

    // 🔷 NEW: Bulk Send Notice API Call
    const handleBulkNotify = () => {
      fetch('http://localhost:8080/acr/notify-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedForNotice)
      })
      .then(response => response.text())
      .then(message => {
        alert(message);
        setSelectedForNotice([]); // Clear checkboxes
        fetchData(); // Refresh UI instantly!
      })
      .catch(error => console.error('Error sending bulk notices:', error));
    };

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        
        {/* Navigation Bar */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#0f172a', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#0d9488', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>📄</div>
            <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>NextGen HRMS <span style={{ color: '#5eead4', fontWeight: 'normal' }}>| Admin Portal</span></h3>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>Sign Out</button>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '26px' }}>APAR Dashboard — 2025-26</h2>
            <p style={{ margin: 0, color: '#64748b' }}>Department of Finance, Government of Tripura</p>
          </div>

          {/* KPI METRICS CARDS */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {/* Same KPI Cards as before... */}
            <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #3b82f6', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#1e293b' }}>{total}</h1>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#475569' }}>Total Personnel</p>
            </div>
            <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #10b981', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#10b981' }}>{submitted}</h1>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#475569' }}>ACR Filed</p>
            </div>
            <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #f59e0b', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#f59e0b' }}>{pending}</h1>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#475569' }}>Action Pending</p>
            </div>
            <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderLeft: '5px solid #94a3b8', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#64748b' }}>{notNotified}</h1>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#475569' }}>Uninitiated</p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#1e293b' }}>Submission Progress</h4>
              <span style={{ fontWeight: 'bold', color: '#0f766e' }}>{Math.round(submittedPct)}% Completed</span>
            </div>
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
              <div style={{ width: `${submittedPct}%`, backgroundColor: '#10b981' }}></div>
              <div style={{ width: `${pendingPct}%`, backgroundColor: '#f59e0b' }}></div>
              <div style={{ width: `${notNotifiedPct}%`, backgroundColor: '#cbd5e1' }}></div>
            </div>
          </div>

          {/* EMPLOYEE STATUS LIST WITH CHECKBOXES */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            
            {/* Table Header / Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '20px 25px', backgroundColor: selectedForNotice.length > 0 ? '#eff6ff' : '#ffffff', borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.3s' }}>
  
          {/* 1. LEFT COLUMN: Checkbox and Title */}
         <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <input 
              type="checkbox" 
              checked={eligibleEmployees.length > 0 && selectedForNotice.length === eligibleEmployees.length}
              onChange={handleSelectAll}
              disabled={eligibleEmployees.length === 0}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              title="Select All Eligible Employees"
            />
           <h3 style={{ margin: 0, color: selectedForNotice.length > 0 ? '#1e40af' : '#1e293b' }}>
              {selectedForNotice.length > 0 ? `${selectedForNotice.length} Selected for Notice` : 'Personnel Roster'}
          </h3>
         </div>
            
         {/* 2. CENTER COLUMN: Dynamic Bulk Action Button */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {selectedForNotice.length > 0 && (
              <button onClick={handleBulkNotify} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
               Dispatch {selectedForNotice.length} Notices →
             </button>
            )}
         </div>

         {/* 3. RIGHT COLUMN: Live Search Bar */}
         <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
           <input 
              type="text" 
              placeholder="Search name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
               padding: '8px 12px', 
               borderRadius: '6px', 
               border: '1px solid #cbd5e1', 
               outline: 'none',
               width: '200px'
              }}
           />
          </div>
          
        </div>
          
        {/* 🔷 (Don't forget to keep your Modal out here!) */}
        {showDirectory && (
          <DirectorySearch 
           employees={dashboardData} 
           onClose={() => setShowDirectory(false)} 
         />
        )}
                    
            {/* List */}
            <div style={{ padding: '10px 25px' }}>
              {filteredRoster.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No records found.</p>
              ) : (
                filteredRoster.map((emp, index) => {
                  
                  // 🔷 1. DYNAMIC STATUS PILL COLORS (Including Approve/Disapprove)
                  let pillBg = '#f1f5f9'; let pillColor = '#64748b'; let dotColor = '#94a3b8';
                  if (emp.currentStatus === 'Submitted') { pillBg = '#eff6ff'; pillColor = '#1e40af'; dotColor = '#3b82f6'; }
                  if (emp.currentStatus === 'Pending') { pillBg = '#fef3c7'; pillColor = '#92400e'; dotColor = '#f59e0b'; }
                  if (emp.currentStatus === 'Approved') { pillBg = '#dcfce7'; pillColor = '#166534'; dotColor = '#10b981'; }
                  if (emp.currentStatus === 'Disapproved') { pillBg = '#fee2e2'; pillColor = '#991b1b'; dotColor = '#ef4444'; }
                  
                  const isEligible = emp.currentStatus === 'Not Notified';

                  return (
                    <div key={emp.employeeId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: index === dashboardData.length - 1 ? 'none' : '1px solid #f1f5f9', backgroundColor: selectedForNotice.includes(emp.employeeId) ? '#f8fafc' : 'transparent' }}>
                      
                      {/* 🔷 2. LEFT SIDE: AVATAR, NAME & CHECKBOX */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '25px' }}>
                          {isEligible && (
                            <input 
                              type="checkbox" 
                              checked={selectedForNotice.includes(emp.employeeId)}
                              onChange={() => handleSelectEmployee(emp.employeeId)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          )}
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 3px 0', color: '#0f172a' }}>
                            {emp.empFirstName} {emp.empLastName}
                          </h4>
  
                        {/* 🔷 UPDATED: Horizontal Layout for all details */}
                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: '#64748b' }}>
                          <p style={{ margin: 0 }}><strong>ID:</strong> {emp.employeeId}</p>
                          <p style={{ margin: 0 }}><strong>Dept:</strong> {emp.departmentId}</p>
                          <p style={{ margin: 0 }}><strong>Gender:</strong> {emp.gender}</p>
                          <p style={{ margin: 0 }}><strong>Mobile:</strong> {emp.mobileNumber}</p>
                        </div>
                        </div>
                      </div>

                      {/* 🔷 3. RIGHT SIDE: STATUS PILL & ACTION BUTTON */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: pillBg, color: pillColor, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }}></div>
                          {emp.currentStatus}
                        </div>
                        
                        {(emp.currentStatus === 'Submitted' || emp.currentStatus === 'Approved' || emp.currentStatus === 'Disapproved') ? (
                          <button onClick={() => handleViewAcr(emp)} style={{ padding: '8px 16px', backgroundColor: '#0f172a', border: 'none', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginTop: '-4px' }}>
                            {emp.currentStatus === 'Submitted' ? 'Review Form' : 'View Verdict'}
                          </button>
                        ) : (
                          <div style={{ width: '95px' }}></div> 
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* 🔷 MODERN ADMINISTRATIVE MODAL REVIEW OVERLAY CONTAINER */}
        {reviewingEmp && reviewDetails && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '16px', width: '90%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>ACR Document File Review</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Employee: <strong>{reviewingEmp.empFirstName} {reviewingEmp.empLastName}</strong> (ID: {reviewingEmp.employeeId})</p>
                </div>
                <button onClick={() => { setReviewingEmp(null); setReviewDetails(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
              </div>

              {/* Document Text Area Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', fontSize: '11px', color: '#475569', letterSpacing: '1px' }}>Recorded System Targets</h5>
                  <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{reviewDetails.target}</p>
                </div>
                
                <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', fontSize: '11px', color: '#475569', letterSpacing: '1px' }}>Declared Achievements Portfolio</h5>
                  <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {reviewDetails.achievement}
                    </p>
                </div>
              </div>

              {/* Appraisal Management Selection Control Wrapper */}
              <div style={{ padding: '20px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>Assign Performance Grading Tier:</label>
                <select 
                  value={adminRating} 
                  onChange={(e) => setAdminRating(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: 'white', fontSize: '14px', fontWeight: 'bold', outline: 'none' }}
                >
                  <option value="Below Average">Below Average</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Outstanding">Outstanding</option>
                </select>
              </div>

              {/* Action Buttons Footer panel */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={() => handleReviewSubmit('Disapproved')}
                  style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                >
                  Disapprove & Reject
                </button>
                <button 
                  onClick={() => handleReviewSubmit('Approved')}
                  style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                >
                  Approve Record File
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SCREEN 4: EMPLOYEE DASHBOARD (Dynamic States)
  // ==========================================
  if (currentView === 'employee') {
    
    // 1. Get the current user's status and details
    const userStatus = statuses.find(s => s.employeeId === empId) || {};
    const isNotified = userStatus.isNotified;
    const isSubmitted = userStatus.isAcrSubmitted;

    const approvalStatus = userStatus.approvalStatus; 
    const rating = userStatus.rating;
    
    // 1. Find the employee using EVERY possible ID spelling (camelCase, snake_case, or just id)
    const empDetails = employees.find(e => 
        String(e.employeeId) === String(empId) || 
        String(e.employee_id) === String(empId) || 
        String(e.id) === String(empId)
    ) || {};

    // 2. Grab the names using EVERY possible spelling
    const firstName = empDetails.empFirstName || '';
    const lastName = empDetails.empLastName || '';

    // 3. Combine them safely
    const fullName = (firstName || lastName) 
        ? `${firstName} ${lastName}`.trim() 
        : 'Personnel';

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        
        {/* 🔷 EMPLOYEE NAVIGATION BAR */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#0f172a', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>📝</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', letterSpacing: '1px' }}>NextGen HRMS <span style={{ color: '#fcd34d', fontWeight: 'normal' }}>| Employee Portal</span></h3>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>Sign Out</button>
        </nav>

        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
          
          {/* Welcome Header */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '28px' }}>Welcome, {fullName}</h2>
            <p style={{ margin: 0, color: '#64748b' }}>ID: {empId} • Dept: {empDetails.departmentId || 'Unassigned'}</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
            
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '20px' }}>Employee Dashboard Overview</h3>
            <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '15px' }}>Welcome to the NextGen HRMS Employee Portal. Securely manage your Annual Confidential Report (ACR) here.</p>

            {/* 🔷 LOGIC: WHICH SCREEN TO SHOW? */}
            {isSubmitted ? (
              
              /* 🔷 NEW: SPLIT INTO 3 POST-SUBMISSION STATES */
              approvalStatus === 'Approved' ? (
                
                /* STATE 1A: APPROVED AND GRADED */
                <div style={{ padding: '25px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ fontSize: '30px' }}>🏆</div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#166534', fontSize: '16px' }}>ACR Approved & Finalized</h4>
                    <p style={{ margin: 0, color: '#15803d', fontSize: '14px' }}>Your official records have been approved by the administrative department. <strong>Assigned Performance Rating: {rating}</strong>.</p>
                  </div>
                </div>

              ) : approvalStatus === 'Disapproved' ? (
                
                /* STATE 1B: REJECTED */
                <div style={{ padding: '25px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ fontSize: '30px' }}>⚠️</div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#991b1b', fontSize: '16px' }}>ACR Disapproved</h4>
                    <p style={{ margin: 0, color: '#b91c1c', fontSize: '14px' }}>Your submitted records were reviewed and disapproved by the administrative department. Please contact your reporting officer for immediate clarification.</p>
                  </div>
                </div>

              ) : (

                /* STATE 1C: SUBMITTED BUT WAITING FOR ADMIN REVIEW */
                <div style={{ padding: '25px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ fontSize: '30px' }}>📄</div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1e40af', fontSize: '16px' }}>ACR Successfully Submitted</h4>
                    <p style={{ margin: 0, color: '#1d4ed8', fontSize: '14px' }}>Your official records for 2025-26 have been filed and are currently awaiting review by the administrative department.</p>
                  </div>
                </div>

              )

            ) : !isNotified ? (
              
              /* STATE 2: ADMIN HAS NOT NOTIFIED YET */
              <div style={{ padding: '25px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ fontSize: '30px' }}>⏳</div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#92400e', fontSize: '16px' }}>Awaiting Administrative Action</h4>
                  <p style={{ margin: 0, color: '#b45309', fontSize: '14px' }}>The ACR workflow has not been initialized for your profile by the reporting authority yet.</p>
                </div>
              </div>

            ) : !showAcrForm ? (
              
              /* STATE 3: NOTIFIED, BUT FORM IS HIDDEN (User clicked the screenshot) */
              <div style={{ padding: '30px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '15px' }}>Current ACR Status:</span>
                  {/* Premium Red Status Pill */}
                  <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Not Submitted
                  </span>
                </div>
                
                <p style={{ color: '#475569', marginBottom: '25px', fontSize: '14px', lineHeight: '1.6' }}>
                  Your reporting officer has initiated the ACR process. You have not submitted your documentation for this period. Click below to begin the official filing process.
                </p>
                
                <button 
                  onClick={() => setShowAcrForm(true)} 
                  style={{ padding: '14px 28px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', transition: '0.2s' }}>
                  Fill ACR <span>→</span>
                </button>
              </div>

            ) : (
              
              /* STATE 4: THE ACTUAL FORM */
              <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>Official ACR Submission Form</h4>
                  <button onClick={() => setShowAcrForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>← Back to Dashboard</button>
                </div>

                {/* 🔷 NEW: READ-ONLY IDENTIFIER HEADER */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '25px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div><label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Employee ID</label><div style={{ color: '#1e293b', fontWeight: 'bold' }}>{empId}</div></div>
                  <div><label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Organisation ID</label><div style={{ color: '#1e293b', fontWeight: 'bold' }}>{empDetails.organizationId || 'N/A'}</div></div>
                  <div><label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Office ID</label><div style={{ color: '#1e293b', fontWeight: 'bold' }}>{empDetails.officeId || 'N/A'}</div></div>
                  <div><label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Department ID</label><div style={{ color: '#1e293b', fontWeight: 'bold' }}>{empDetails.departmentId || 'N/A'}</div></div>
                </div>

                <form onSubmit={handleAcrSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* 🔷 DYNAMIC FIELD MAPPING */}
                  {acrEntries.map((entry, index) => (
                    <div key={index} style={{ padding: '20px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', position: 'relative' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontWeight: 'bold', color: '#0f766e', fontSize: '14px' }}>Goal Set #{index + 1}</span>
                        {acrEntries.length > 1 && (
                          <span onClick={() => handleRemoveEntry(index)} style={{ color: '#ef4444', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>✖ Remove</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Assigned Target</label>
                          <input type="text" value={entry.target} onChange={(e) => handleEntryChange(index, 'target', e.target.value)} required style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' }}>Actual Achievement</label>
                          <textarea rows="2" value={entry.achievement} onChange={(e) => handleEntryChange(index, 'achievement', e.target.value)} required style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', resize: 'vertical' }} />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" onClick={handleAddEntry} style={{ padding: '12px', backgroundColor: 'transparent', color: '#0d9488', border: '2px dashed #0d9488', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                    + Add Another Target
                  </button>
                  
                  <button type="submit" style={{ padding: '16px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                    Submit Official Record
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;