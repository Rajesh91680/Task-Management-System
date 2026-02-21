import { useState } from "react";
import axios from "axios";
import { useTasks } from "./hooks/useTasks";
import "./App.css";
import logo from "./assets/logo.png"; 
import Registration from "./Registration";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // SIDEBAR NAVIGATION STATES
  const [activeTab, setActiveTab] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");

  // Task Form States
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isAdding, setIsAdding] = useState(false); 

  // Edit States
  const [editTask, setEditTask] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setShowWelcome(false);
  };

  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks(token, handleLogout);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      });
      const new_token = res.data.access;
      setToken(new_token);
      localStorage.setItem("token", new_token);
      setShowWelcome(true); 
    } catch (error) {
      alert("Invalid Username or Password!");
    }
  };

  const handleAddTaskSubmit = () => {
    addTask(taskName, description, dueDate);
    setTaskName("");
    setDescription("");
    setDueDate("");
    setIsAdding(false); 
  };

  // FILTER LOGIC
  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const filteredTasks = tasks.filter(task => {
    if (activeTab === "Search") {
      return task.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeTab === "Inbox") return true; // Show everything
    if (activeTab === "Today") return task.due_date === todayDate;
    if (activeTab === "Upcoming") return task.due_date > todayDate;
    return true;
  });

  // ==============================
  // 1. LOGIN & REGISTRATION SCREEN
  // ==============================
  if (!token) {
    if (showRegister) {
      return (
        <div className="center-screen" style={{ flexDirection: 'column' }}>
           <Registration onBackToLogin={() => setShowRegister(false)} />
           
           {/* 🔹 FIX 1: Added color: '#333' to make text visible */}
           <button 
             onClick={() => setShowRegister(false)} 
             style={{ width: '100%', maxWidth: '400px', padding: '12px', background: '#f1f1f1', color: '#333', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}>
             ← Back to Login
           </button>
        </div>
      );
    }

    return (
      <div className="center-screen">
        <div className="auth-card">
          <img src={logo} alt="Logo" style={{ width: '60px', marginBottom: '15px' }} />
          <h2 style={{ fontSize: '22px', marginBottom: '25px', marginTop: '0' }}>Log in to Workspace</h2>
          <input 
            type="text" placeholder="Username" value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="auth-input"
          />
          <input 
            type="password" placeholder="Password" value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="auth-input"
          />
          <button onClick={handleLogin} className="add-btn" style={{ width: '100%', padding: '12px', marginBottom: '15px' }}>Log in</button>
          
          {/* 🔹 FIX 1: Added color: '#333' to make text visible */}
          <button 
            onClick={() => setShowRegister(true)} 
            style={{ width: '100%', padding: '12px', background: '#f1f1f1', color: '#333', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
            Don't have an account? Register here
          </button>

        </div>
      </div>
    );
  }

  // ==============================
  // 2. WELCOME SCREEN
  // ==============================
  if (showWelcome) {
    return (
      <div className="center-screen">
        <div className="auth-card" style={{ maxWidth: '450px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <img src={logo} alt="Logo" style={{ width: '35px' }} />
            <strong style={{ fontSize: '20px', color: '#db4c3f' }}>Task Manager</strong>
          </div>
          <h1 style={{ fontSize: '26px', margin: '0 0 15px 0' }}>Welcome to your Workspace!</h1>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>This tool can help you...</p>
            <p style={{ margin: '8px 0', color: '#555' }}>✅ Organize the everyday chaos</p>
            <p style={{ margin: '8px 0', color: '#555' }}>✅ Focus on the right things</p>
            <p style={{ margin: '8px 0', color: '#555' }}>✅ Achieve goals and finish projects</p>
            <p style={{ margin: '8px 0', color: '#555' }}>✨ Now it's your turn!</p>
          </div>
          <button className="add-btn" style={{ width: '100%', padding: '12px' }} onClick={() => setShowWelcome(false)}>
            Let's go!
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // 3. MAIN APP
  // ==============================
  return (
    <div className="app-layout">
      
      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <span>Rajesh's Workspace</span>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => setIsAdding(true)}>
            <span style={{ color: '#db4c3f', fontWeight: 'bold' }}>+</span> Add task
          </li>
          <li className={activeTab === "Search" ? "active" : ""} onClick={() => setActiveTab("Search")}>🔍 Search</li>
          <li className={activeTab === "Inbox" ? "active" : ""} onClick={() => setActiveTab("Inbox")}>📥 Inbox</li>
          <li className={activeTab === "Today" ? "active" : ""} onClick={() => setActiveTab("Today")}>📅 Today</li>
          <li className={activeTab === "Upcoming" ? "active" : ""} onClick={() => setActiveTab("Upcoming")}>🗓 Upcoming</li>
        </ul>
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="cancel-btn" style={{width: '100%', background: '#eee'}}>Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <div className="main-header">
          <h1>{activeTab}</h1>
          {activeTab === "Search" && (
            <input 
              type="text" 
              placeholder="Type to search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="task-input" // Added style to search bar too
            />
          )}
        </div>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task._id || task.name} className={`task-item ${task.completed ? 'completed' : ''}`}>
              
              {editTask === task.name ? (
                /* 🔹 FIX 2: EDIT FORM INPUTS */
                <div className="add-task-form" style={{width: '100%', marginTop: 0}}>
                  <input 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)} 
                    placeholder="Task name" 
                    className="task-input" /* Added class */
                  />
                  <textarea 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)} 
                    placeholder="Description" 
                    className="task-input" /* Added class */
                  />
                  <div className="form-actions">
                    <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} style={{ width: 'auto', border: '1px solid #ddd', padding: '5px', borderRadius: '5px' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="cancel-btn" onClick={() => setEditTask(null)}>Cancel</button>
                      <button className="add-btn" onClick={() => { updateTask(editTask, editValue, editDescription, editDueDate); setEditTask(null); }}>Save</button>
                    </div>
                  </div>
                </div>
              ) : (
                
              /* VIEW MODE */
              <>
                <div 
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`} 
                  onClick={() => toggleTaskCompletion(task)}
                ></div>

                <div className="task-content">
                  <strong>{task.name}</strong>
                  {task.description && <div className="task-description">{task.description}</div>}
                  {task.due_date && <div className="task-date">📅 {task.due_date}</div>}
                </div>
                
                <div className="task-actions">
                  <button onClick={() => { setEditTask(task.name); setEditValue(task.name); setEditDescription(task.description || ""); setEditDueDate(task.due_date || ""); }} className="action-btn">✏️</button>
                  <button onClick={() => deleteTask(task.name)} className="action-btn">🗑️</button>
                </div>
              </>
              )}
            </li>
          ))}
        </ul>

        {/* INLINE ADD TASK FORM */}
        <div className="add-task-container">
          {!isAdding ? (
            <button className="add-task-btn-trigger" onClick={() => setIsAdding(true)}>
              <span style={{ color: '#db4c3f', fontSize: '18px', fontWeight: 'bold' }}>+</span> Add task
            </button>
          ) : (
            /* 🔹 FIX 2: ADD TASK FORM INPUTS */
            <div className="add-task-form">
              <input 
                type="text" 
                placeholder="Task name" 
                value={taskName} 
                onChange={(e) => setTaskName(e.target.value)} 
                className="task-input" /* Added class to fix black box */
                autoFocus 
              />
              <textarea 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="task-input" /* Added class to fix black box */
              />
              <div className="form-actions">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: 'auto', border: '1px solid #ddd', padding: '5px', borderRadius: '5px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                  <button className="add-btn" onClick={handleAddTaskSubmit}>Add task</button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;