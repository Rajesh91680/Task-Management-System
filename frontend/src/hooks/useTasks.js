import { useState, useEffect } from "react";
import axios from "axios";

export const useTasks = (token, handleLogout) => {
  const [tasks, setTasks] = useState([]);

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/tasks/", authConfig);
      setTasks(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) handleLogout();
    }
  };

  useEffect(() => { fetchTasks(); }, [token]);

  const addTask = async (taskName, description, dueDate) => {
    if (!taskName.trim()) return;
    try {
      await axios.post("http://127.0.0.1:8000/api/tasks/", {
        name: taskName, description: description, due_date: dueDate,
      }, authConfig);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const updateTask = async (oldName, newName, newDescription, newDueDate) => {
    if (!newName.trim()) return;
    try {
      await axios.put("http://127.0.0.1:8000/api/tasks/", {
        old_name: oldName, new_name: newName, description: newDescription, due_date: newDueDate,
      }, authConfig);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const deleteTask = async (name) => {
    try {
      await axios.delete("http://127.0.0.1:8000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` }, data: { name },
      });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  // 🔹 NEW: TOGGLE COMPLETED STATUS
  const toggleTaskCompletion = async (task) => {
    try {
      await axios.put("http://127.0.0.1:8000/api/tasks/", {
        old_name: task.name,
        completed: !task.completed // 👈 Flips True to False, or False to True
      }, authConfig);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  return { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion };
};