import React, { useState } from "react";
import CalendarComponent from "./CalendarComponent";
import "./../styles/App.css";

function App() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="app">
      <CalendarComponent filter={filter} setFilter={setFilter} />
    </div>
  );
}

export default App;