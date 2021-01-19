import React, { useEffect, useState, useCallback } from "react";

import { EmojiList } from "./EmojiList.js";

import classnames from "classnames";

import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import EmojiNatureIcon from "@material-ui/icons/EmojiNature";
import EmojiFoodBeverageIcon from "@material-ui/icons/EmojiFoodBeverage";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";
import EmojiSymbolsIcon from "@material-ui/icons/EmojiSymbols";
import EmojiFlagsIcon from "@material-ui/icons/EmojiFlags";

import SearchIcon from "@material-ui/icons/Search";

import "./EmojiPicker.css";

function EmojiPicker(props) {
  const [listOfEmojis, setListOfEmojis] = useState([]);
  const [listOfSearch, setListOfSearch] = useState([]);
  const [mouseClick, setMouseClick] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(-1);
  const [hoverEmoji, setHoverEmoji] = useState({});

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const showCategoryEmojis = useCallback(() => {
    document.getElementById("categoryAnchor" + category).scrollIntoView();
  }, [category]);

  const mouseOverEmoji = (emoji, desc) => {
    setHoverEmoji({ emoji, desc });
  };

  const mouseOutEmoji = () => {
    setHoverEmoji({});
  };

  const mouseClickEmoji = (emoji) => {
    setMouseClick(emoji);
  };

  useEffect(() => {
    if (mouseClick !== "") {
      props.clickOnEmoji(mouseClick);
      setTimeout(function() {
        setSearch("");
        setCategory(-1);
        document.getElementById("categoryAnchor" + 0).scrollIntoView();
      }, 200)
      setMouseClick("");
    }
  }, [mouseClick]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const setDefaultEmojis = () => {
      let categoryList = [];
      EmojiList.categories.forEach((category, CategoryIndex) => {
        categoryList.push({
          html: [
            <li
              key={"Category" + category}
              className="categoryTitle"
              id={"category" + CategoryIndex}
            >
              {category}
              <div
                className="categoryAnchor"
                id={"categoryAnchor" + CategoryIndex}
              ></div>
            </li>,
          ],
        });
      });
      EmojiList.emoji.map((emoji, index) => {
        categoryList[emoji.category].html.push(
          <li
            key={emoji.emoji}
            className="emoji"
            onMouseOver={() => mouseOverEmoji(emoji.emoji, emoji.name)}
            onMouseOut={() => mouseOutEmoji()}
            onClick={() => mouseClickEmoji(emoji.emoji)}
          >
            {emoji.emoji}
          </li>
        );
        return emoji;
      });
      let mergedCategories = categoryList.map((category, index) => {
        return category.html;
      });
      setListOfEmojis([].concat.apply([], mergedCategories));
    };

    setDefaultEmojis();
  }, []);

  useEffect(() => {
    if (category !== -1) {
      showCategoryEmojis();
    }
  }, [category, showCategoryEmojis]);

  useEffect(() => {
    if (search === "") {
      setListOfSearch([]);
      if (category !== -1) {
        showCategoryEmojis();
      } 
    } else {
      setListOfSearch(
        EmojiList.emoji.map((emoji, index) => {
          return emoji.name.toLowerCase().includes(search) ? (
            <li
              key={"Search" + emoji.emoji}
              className="emoji"
              onMouseOver={() => mouseOverEmoji(emoji.emoji, emoji.name)}
              onMouseOut={() => mouseOutEmoji()}
              onClick={() => mouseClickEmoji(emoji.emoji)}
            >
              {emoji.emoji}
            </li>
          ) : null;
        })
      );
    }
  }, [search, category, showCategoryEmojis]);

  return (
      <div className="emojiPickerWrapper">
        <div className="emojiHeaderSticky">
          <div className="searchWrapper">
            <input
              placeholder="Search emojis"
              className="emojiSearch"
              type="text"
              value={search}
              onChange={(e) => searchHandler(e)}
              spellCheck="false"
            ></input>
            <SearchIcon />
          </div>
          <div
            className={classnames(
              "emojiCategories",
              search === "" ? "" : "hidden"
            )}
          >
            <div
              className={classnames(
                "",
                category === 0 || category === -1 ? "active" : ""
              )}
              onClick={() => setCategory(0)}
            >
              <EmojiEmotionsIcon />
            </div>
            <div
              className={classnames("", category === 1 ? "active" : "")}
              onClick={() => setCategory(1)}
            >
              <EmojiPeopleIcon />
            </div>
            <div
              className={classnames("", category === 2 ? "active" : "")}
              onClick={() => setCategory(2)}
            >
              <EmojiNatureIcon />
            </div>
            <div
              className={classnames("", category === 3 ? "active" : "")}
              onClick={() => setCategory(3)}
            >
              <EmojiFoodBeverageIcon />
            </div>
            <div
              className={classnames("", category === 4 ? "active" : "")}
              onClick={() => setCategory(4)}
            >
              <EmojiTransportationIcon />
            </div>
            <div
              className={classnames("", category === 5 ? "active" : "")}
              onClick={() => setCategory(5)}
            >
              <EmojiEventsIcon />
            </div>
            <div
              className={classnames("", category === 6 ? "active" : "")}
              onClick={() => setCategory(6)}
            >
              <EmojiObjectsIcon />
            </div>
            <div
              className={classnames("", category === 7 ? "active" : "")}
              onClick={() => setCategory(7)}
            >
              <EmojiSymbolsIcon />
            </div>
            <div
              className={classnames("", category === 8 ? "active" : "")}
              onClick={() => setCategory(8)}
            >
              <EmojiFlagsIcon />
            </div>
          </div>
        </div>
        <div className="emojiPadding">
          {search === "" ? <ul>{listOfEmojis}</ul> : <ul>{listOfSearch}</ul>}
        </div>
        <div className="emojiHover">
          {hoverEmoji.emoji ? (
            <div className="flexEmojiHover">
              <span className="emojiHoverBig">{hoverEmoji.emoji}</span>{" "}
              {hoverEmoji.desc}
            </div>
          ) : null}
        </div>
      </div>
  );
}

export default EmojiPicker;
