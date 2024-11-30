import React, { useState } from "react";

interface Task {
  task: string;
  time: string;
}

type WeekData = {
  [key: string]: Task[];
};

const App: React.FC = () => {
  const [daysData, setDaysData] = useState<WeekData>(() => {
    const savedData = localStorage.getItem("weekTasks");
    return savedData
      ? JSON.parse(savedData)
      : {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };
  });

  const [day, setDay] = useState<string>("Monday");
  const [task, setTask] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const saveData = (data: WeekData) => {
    localStorage.setItem("weekTasks", JSON.stringify(data));
    setDaysData(data);
  };

  const addTask = () => {
    if (!task || !time) {
      alert("Please provide both a task and a time!");
      return;
    }

    const updatedData = {
      ...daysData,
      [day]: [...daysData[day], { task, time }],
    };

    saveData(updatedData);
    setTask("");
    setTime("");
    alert(`Task added to ${day}!`);
  };

  const deleteTask = (day: string, index: number) => {
    const updatedData = {
      ...daysData,
      [day]: daysData[day].filter((_, i) => i !== index),
    };

    saveData(updatedData);
    alert(`Task removed from ${day}!`);
  };

  const updateTask = (day: string, index: number) => {
    const existingTask = daysData[day][index];
    const newTask = prompt("Enter updated task:", existingTask?.task);
    const newTime = prompt("Enter updated time:", existingTask?.time);

    if (newTask && newTime) {
      const updatedData = {
        ...daysData,
        [day]: daysData[day].map((item, i) =>
          i === index ? { task: newTask, time: newTime } : item
        ),
      };

      saveData(updatedData);
      alert(`Task updated for ${day}!`);
    }
  };

  return (
    <div className="App">
      <h1>Task Manager for the Week</h1>

      <select value={day} onChange={(e) => setDay(e.target.value)}>
        {Object.keys(daysData).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <input
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="time"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <h2>Tasks for {day}</h2>
      <ul>
        {daysData[day]?.map((item, index) => (
          <li key={index}>
            <strong>Task:</strong> {item.task} | <strong>Time:</strong>{" "}
            {item.time}{" "}
            <button onClick={() => updateTask(day, index)}>Edit</button>
            <button onClick={() => deleteTask(day, index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
