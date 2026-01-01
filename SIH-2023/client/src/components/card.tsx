import React from "react";
import style from "../styles/card.module.css";
import Image from "next/image";

const Card = (props) => {
  return (
    <div className="flex justify-center items-center hover:scale-[1.01] duration-300 hover:cursor-pointer">
      <div className={style.card}>
        <div className={style.card_header}>
          <Image
            src={`/categories/images/${props.imgUrl}.jpg`}
            width={400}
            height={200}
            alt="Picture of the author"
          />
        </div>
        <div className={style.card_content}>
          <h3 className="flex justify-center" id="news-title">
            {props.Title}
          </h3>
          <h6 className={style.news_source} id="news-source">
            {props.categories}
          </h6>
          <p id="news-desc">{props.description}</p>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <div className="flex flex-col justify-center items-center">
            <div className="text-green-500">Positive</div>
            <div>{props.positive}%</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-gray-500">Neutral</div>
            <div>{props.neutral}%</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="text-red-500">Negative</div>
            <div>{props.negative}%</div>
          </div>
        </div>
        <div className="flex justify-center items-center pt-3">
          <a
            className="text-lg hover:underline hover:scale-[1.01] duration-300 text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
            href={props.url}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
