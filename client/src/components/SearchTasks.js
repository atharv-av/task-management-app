import React, { useState } from "react";
import "../css/SearchTasks.css"

const SearchTasks = ({ onSearchResults }) => {
  const [searchTitle, setSearchTitle] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/searchTasks?title=${encodeURIComponent(searchTitle)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      onSearchResults(data); // Pass results to parent component
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="search-tasks">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchTasks;
