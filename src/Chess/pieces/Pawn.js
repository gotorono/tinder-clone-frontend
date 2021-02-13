import React, { useState, useEffect, useCallback } from "react";
import useMousePosition from "./useMousePosition";

import { availablePawnSquares } from "./validatePlacement";

import { newX, newY, translateX, translateY } from "./positionPlacement";

import classnames from "classnames";

function Pawn(props) {
  const [isDown, setIsDown] = useState(false);
  const [available, setAvailable] = useState([]);

  const pieceRef = React.useRef();

  const { x, y } = useMousePosition(isDown);

  useEffect(() => {
    if (props.board)
      setAvailable(
        availablePawnSquares(
          props.board,
          props.position,
          props.color,
          props.enPassant,
          props.isFirst
        )
      );
  }, [props.board]);

  useEffect(() => {
    if(isDown === false)
      if(props.grabbing)
        props.grabbing(false, available, null, props.position);
  }, [isDown]);

  useEffect(() => {
    if (isDown === true) {
      props.grabbing(
        isDown,
        available,
        {
          x: newX(x, pieceRef, props.playing),
          y: newY(y, pieceRef, props.playing),
        },
        props.position,
        props.color
      );
    }
  }, [isDown, pieceRef, available, x, y]);

  const mouseUpHandler = useCallback(
    (e) => {
      if (e.button !== 2) {
        if (isDown === true) {
          let posX = newX(x, pieceRef, props.playing);
          let posY = newY(y, pieceRef, props.playing);

          if (available.find((pos) => pos.x === posX && pos.y === posY)) {
            if (
              props.enPassant &&
              posX === props.enPassant.target.x &&
              posY === props.enPassant.target.y
            ) {
              if (props.enPassantMove)
                props.enPassantMove(
                  props.position,
                  { x: posX, y: posY },
                  props.color === "black" ? 16 : 6
                );
            } else if (props.place)
              props.place(
                props.position,
                { x: posX, y: posY },
                props.color === "black" ? 16 : 6
              );
          }
          setIsDown(false);
        }
      }
    },
    [isDown, props.isFirst, x, y, props]
  );

  const mouseRightClick = useCallback(
    (e) => {
      if (isDown === true) {
        e.preventDefault();
        setIsDown(false);
      }
    },
    [isDown]
  );

  useEffect(() => {
    window.addEventListener("contextmenu", mouseRightClick);

    return () => window.removeEventListener("contextmenu", mouseRightClick);
  }, [mouseRightClick]);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpHandler);

    return () => window.removeEventListener("mouseup", mouseUpHandler);
  }, [mouseUpHandler]);

  return (
    <div>
      {props.children}
      <div
        className={classnames(
          "piece pawn",
          props.color === "white" ? "white" : "black"
        )}
        ref={pieceRef}
        onMouseDown={props.history !== true && props.playing === props.color ? () => setIsDown(true) : null}
        style={
          isDown === true && pieceRef.current
            ? {
                zIndex: 100,
                transform: `translate(${translateX(
                  x,
                  pieceRef,
                  props.playing
                )}px, ${translateY(y, pieceRef, props.playing)}px) rotate(${
                  props.playing === "black" ? 180 : 0
                }deg)`,
                cursor: "grabbing",
              }
            : {
                zIndex: 10,
                transform: `translate(${0}px, ${0}px) rotate(${
                  props.playing === "black" ? 180 : 0
                }deg)`,
              }
        }
      >
        P
      </div>
    </div>
  );
}

export default Pawn;
