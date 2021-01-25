import React, { useState, useEffect, useCallback } from "react";
import "./Slider.css";

import axios from "../axios";

import PropTypes from "prop-types";
import { connect } from "react-redux";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};

function Slider(props) {
  const min = React.useRef();
  const max = React.useRef();

  const [width, setWidth] = useState(0);
  const [isDown, setIsDown] = useState({ min: false, max: false });
  const [positions, setPositions] = useState({ min: 0, max: 284 });
  const [age, setAge] = useState({ min: props.min, max: props.max });
  const { x } = useMousePosition();

  useEffect(() => {
    const getAgeRange = async () => {
      const req = await axios.get("/tinder/users/ageRange", {
        params: {
          id: props.auth.user.id,
        },
      });
      setAge(req.data);
      const sum = props.max - props.min;
      const delitel = width / sum;
      setPositions({
        min: (req.data.min - 18) * delitel,
        max: (req.data.max - 18) * delitel,
      });
    };
    getAgeRange();
  }, [props.auth.user.id, width, props.max, props.min]);

  useEffect(() => {
    setWidth(max.current.parentNode.parentNode.clientWidth - 24);
    setPositions({
      ...positions,
      max: max.current.parentNode.parentNode.clientWidth - 24,
    });
  }, [max.current]);

  const values = (min, max) => {
    const sum = props.max - props.min;
    const delitel = width / sum;
    setAge({
      min: Math.floor(min / delitel + props.min),
      max: Math.floor(max / delitel + props.min),
    });
  };

  const minHandler = (x) => {
    x = x - min.current.offsetParent.offsetLeft;

    if (x <= 0) return 0;
    else if (x >= positions.max - 28) {
      return positions.max - 28;
    } else {
      return x;
      // const sum = props.max - props.min;
      // const delitel = Math.floor(250 / sum);
      // if(x % delitel === 0)
      //     return x;
      // else return null;
    }
  };

  const maxHandler = (x) => {
    x = x - max.current.offsetParent.offsetLeft;

    if (x >= max.current.parentNode.parentNode.clientWidth - 24)
      return max.current.parentNode.parentNode.clientWidth - 24;
    else if (x <= positions.min + 28) {
      return positions.min + 28;
    } else {
      return x;
      // const sum = props.max - props.min;
      // const delitel = Math.floor(250 / sum);
      // if(x % delitel === 0)
      //     return x;
      // else return null;
    }
  };

  useEffect(() => {
    if (isDown.min === true || isDown.max === true)
      values(positions.min, positions.max);
    if (isDown.min === true)
      setPositions({
        ...positions,
        min: minHandler(x - 12) === null ? positions.min : minHandler(x - 12),
      });
    else if (isDown.max === true)
      setPositions({
        ...positions,
        max: maxHandler(x - 12) === null ? positions.max : maxHandler(x - 12),
      });
  }, [x]);

  const mouseUpHandler = useCallback(() => {
    if (isDown.min === true || isDown.max === true) {
      axios.post("/tinder/users/ageRange", {
        min: age.min,
        max: age.max,
        id: props.auth.user.id,
      }).then(() => {
        props.forceUpdate();
      });
      setIsDown({ min: false, max: false });
    }
  }, [age, isDown]);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpHandler);

    return () => window.removeEventListener("mouseup", mouseUpHandler);
  }, [mouseUpHandler]);

  const mouseDownHandler = (button) => {
    if (isDown.min === true || isDown.max === true) {
    } else {
      if (button === "min") setIsDown({ min: true, max: false });
      else setIsDown({ min: false, max: true });
    }
  };

  return (
    <div className="slider">
      <div className="insideSlider">
        <button
          ref={min}
          style={
            min.current !== undefined
              ? {
                  left: positions.min + "px",
                  cursor: isDown.min === true ? "grabbing" : "grab"
                }
              : null
          }
          className="min"
          onMouseDown={() => mouseDownHandler("min")}
        ></button>
        <button
          ref={max}
          style={
            max.current !== undefined
              ? {
                  left: positions.max + "px",
                  cursor: isDown.max === true ? "grabbing" : "grab"
                }
              : null
          }
          className="max"
          onMouseDown={() => mouseDownHandler("max")}
        ></button>
        <div className="line"></div>
        <div
          className="lineActive"
          style={{
            left: positions.min,
            right: positions.max,
            width: positions.max - positions.min,
          }}
        ></div>
      </div>
      <div className="showAgeRange">
        {age.min + " - "}
        {age.max === props.max ? age.max + "+" : age.max}
      </div>
    </div>
  );
}

Slider.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Slider);
