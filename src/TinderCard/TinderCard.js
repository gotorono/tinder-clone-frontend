import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import "./TinderCard.css";

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

export default React.forwardRef(function TinderCard(props, ref) {
  const [isDown, setIsDown] = useState(false);
  const [offset, setOffset] = useState({ top: null, left: null });
  const [swiped, setSwiped] = useState("");

  const cardRef = React.useRef();

  useImperativeHandle(ref, () => ({
    swipe: (dir) => {
      swipe(dir, "button");
    },
  }));

  const mouseUpHandler = useCallback(() => {
    setIsDown(false);
    setOffset({ top: null, left: null });
    if (swiped === "left") {
      swipe("left");
    } else if (swiped === "right") {
      swipe("right");
    }
    setSwiped("");
  }, [swiped]);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpHandler);

    return () => window.removeEventListener("mouseup", mouseUpHandler);
  }, [mouseUpHandler]);

  const { x, y } = useMousePosition();

  const mouseDownHandler = (e) => {
    setIsDown(true);
    setOffset({ top: e.clientY, left: e.clientX });
  };

  const opacity = (x) => {
    if ((x * 100) / cardRef.current.parentNode.clientWidth > 16) {
      if (swiped !== "right") setSwiped("right");
    } else if ((x * 100) / cardRef.current.parentNode.clientWidth < -16) {
      if (swiped !== "left") setSwiped("left");
    } else {
      if (swiped !== "") setSwiped("");
    }
    const opacity =
      Math.abs((x * 100) / cardRef.current.parentNode.clientWidth) / 30;
    return opacity;
  };

  const rotation = (x) => {
    if (
      offset.top - cardRef.current.parentNode.offsetTop >
      cardRef.current.clientHeight / 1.5
    )
      return -(x / 25);
    else return x / 25;
  };

  const swipe = (direction, type) => {
    if (type !== "button") props.onSwipe(direction);

    if (direction === "left") {
      cardRef.current.style = `transition: transform ${
        type === "button" ? "1000ms" : "750ms"
      } ease ${type === "button" ? "100ms" : "0ms"}; transform: translate(-${
        window.innerWidth
      }px, 0);`;
      cardRef.current.children[0].style = `transition: opacity 100ms ease; opacity: 1;`;
    //   setTimeout(() => {
    //     if (cardRef.current && cardRef.current.style);
    //         cardRef.current.style = "display: none;";
    //   }, 750);
    } else if (direction === "right") {
      cardRef.current.style = `transition: transform ${
        type === "button" ? "1000ms" : "750ms"
      } ease ${type === "button" ? "100ms" : "0ms"}; transform: translate(${
        window.innerWidth
      }px, 0);`;
      cardRef.current.children[1].style = `transition: opacity 100ms ease; opacity: 1;`;
    //   setTimeout(() => {
    //     if (cardRef.current && cardRef.current.style);
    //     cardRef.current.style = "display: none;";
    //   }, 750);
    }
  };

  return (
    <div
      ref={cardRef}
      className="tinderCard"
      onMouseDown={(e) => mouseDownHandler(e)}
      style={
        isDown === true
          ? {
              transform: `translate(${x - offset.left}px, ${
                y - offset.top
              }px) rotate(${
                (x - offset.left) / 25 > 25
                  ? offset.top - cardRef.current.parentNode.offsetTop >
                    cardRef.current.clientHeight / 1.5
                    ? -25
                    : 25
                  : (x - offset.left) / 25 < -25
                  ? offset.top - cardRef.current.parentNode.offsetTop >
                    cardRef.current.clientHeight / 1.5
                    ? 25
                    : -25
                  : rotation(x - offset.left)
              }deg)`,
            }
          : {
              transform: `translate(0px, 0px)`,
              transition: "transform 500ms ease",
            }
      }
    >
      <div
        className="nope"
        style={
          isDown === true && x - offset.left < 0
            ? { opacity: opacity(x - offset.left) }
            : { opacity: 0, transition: "opacity 420ms ease" }
        }
      >
        NOPE
      </div>
      <div
        className="like"
        style={
          isDown === true && x - offset.left > 0
            ? { opacity: opacity(x - offset.left) }
            : { opacity: 0, transition: "opacity 420ms ease" }
        }
      >
        LIKE
      </div>
      {props.children}
    </div>
  );
});
