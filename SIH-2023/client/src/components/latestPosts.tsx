import React, { useState, useEffect } from "react";
import Card from "../components/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import regional from "../../public/data/regional.json";

const Categories = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    "All",
    "Sports",
    "Culture",
    "International",
    "Politics",
    "Science",
    "Technology",
    "Business",
    "Entertainment",
    "Judiciary",
    "Crime",
  ];

  return (
    <div className="flex justify-center items-center pt-3 mb-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`capitalize px-4 py-2 mx-2 rounded-md border ${
            selectedCategory === category
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-blue-100 text-black border-blue-300"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const LatestPosts = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["English"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const [newsData, setNewsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const apiUrl = "http://127.0.0.1:8000/";
  const regionalNews = regional.News;

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setNewsData(data["News"]);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const newsMap = {
    Sports: "Ministry of Youth Affairs and Sports",
    Culture: "Ministry of Culture",
    International: "Ministry of External Affairs",
    Politics: "Ministry of Home Affairs",
    Science: "Ministry of Science and Technology",
    Technology: "Ministry of Electronics and Information Technology",
    Business: "Ministry of Finance",
    Entertainment: "Ministry of Information and Broadcasting",
    Judiciary: "Ministry of Law and Justice",
    Crime: "Department of Internal Security",
  };

  const filteredNews = selectedCategory !== "All"
    ? selectedValue === "Hindi"
      ? regionalNews.filter((news) => news.Categories === selectedCategory)
      : newsData.filter((news) => news.Categories === selectedCategory)
    : selectedValue === "Hindi"
    ? regionalNews
    : newsData;

  // Filter news based on search term
  const searchedNews = filteredNews.filter((news) =>
    news.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center text-3xl font-bold m-6">
          LATEST ARTICLES IN
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="capitalize">
                <div className="flex uppercase justify-center items-center text-3xl font-bold -ml-2">
                  {selectedValue}
                  <img
                    src="/dropdown.png"
                    className="ml-1"
                    width={20}
                    height={20}
                    alt=""
                  />
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Single selection example"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem
                className="w-[100px] text-xl outline-none  hover:outline-none hover:underline"
                key="English"
              >
                English
              </DropdownItem>
              <DropdownItem
                className="w-[100px] text-xl hover:outline-none hover:underline"
                key="Hindi"
              >
                Hindi
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <hr className="mb-3" />

      {/* Categories */}
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Search Bar */}
      <div className="flex justify-center items-center pt-3 mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          className="border rounded-md px-4 py-2 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Display filtered news */}
      <div className="grid grid-cols-3 gap-4">
        {searchedNews?.map((news) => (
          <Card
            key={news.Title}
            imgUrl={news["Categories"]}
            Title={<span className="font-extrabold">{news["Title"]}</span>}
            categories={
              <span
                className="flex justify-center items-center"
                style={{
                  backgroundColor: "#d3d3d3",
                  color: "black",
                  fontWeight: "bold",
                  padding: "5px",
                }}
              >
                {newsMap[news["Categories"]]}
              </span>
            }
            description={
              <span>About- {news["Description"].slice(0, 30) + "..."}</span>
            }
            negative={
              <span style={{ textDecoration: "underline", color: "red" }}>
                {Math.round(
                  parseFloat(news["Sentiment_Score"].split(" ")[1]) * 100
                )}
              </span>
            }
            neutral={
              <span style={{ textDecoration: "underline", color: "orange" }}>
                {Math.round(
                  parseFloat(news["Sentiment_Score"].split(" ")[2]) * 100
                )}
              </span>
            }
            positive={
              <span style={{ textDecoration: "underline", color: "green" }}>
                {100 -
                  Math.round(
                    parseFloat(news["Sentiment_Score"].split(" ")[1]) * 100
                  ) -
                  Math.round(
                    parseFloat(news["Sentiment_Score"].split(" ")[2]) * 100
                  )}
              </span>
            }
            url={news["URL"]}
          />
        ))}
      </div>
    </>
  );
};

export default LatestPosts;
