import React, { useState } from 'react';

// Categories component
const Categories = ({ onSelectCategory }) => {
  const categoriesList = [
    "Business", "Crime", "Culture", "Entertainment", "International",
    "Judiciary", "Politics", "Science", "Sports", "Technology"
  ];

  return (
    <div className="flex justify-center items-center space-x-20 pt-3 font-bold bg-gray-50 pb-3 pl-5 pr-5">
      {categoriesList.map((category, index) => (
        <a
          key={index}
          className="hover:cursor-pointer hover:scale-[1.2] duration-300"
          onClick={() => onSelectCategory(category)}
          href="#"
        >
          {category}
        </a>
      ))}
    </div>
  );
};

// Main App component
function App() {
  // Define state variable for category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample News Data
  const newsData = [
    { id: 1, title: "News 1", category: "Business" },
    { id: 2, title: "News 2", category: "Crime" },
    { id: 3, title: "News 3", category: "Culture" },
    { id: 4, title: "News 4", category: "Entertainment" },
    { id: 5, title: "News 5", category: "International" },
    { id: 6, title: "News 6", category: "Judiciary" },
    { id: 7, title: "News 7", category: "Politics" },
    { id: 8, title: "News 8", category: "Science" },
    { id: 9, title: "News 9", category: "Sports" },
    { id: 10, title: "News 10", category: "Technology" }
  ];

  // Function to handle category selection
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  // Filtered news based on selected category
  const filteredNewsData = selectedCategory !== null ?
    newsData.filter((item) => item.category === selectedCategory) :
    newsData;
    
  return (
    <div>
      <h1>Selected Category: {selectedCategory}</h1>
      {/* Render Categories component and pass onSelectCategory function */}
      <Categories onSelectCategory={handleSelectCategory} />

      {/* Display filtered news */}
      <ul>
        {filteredNewsData.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
