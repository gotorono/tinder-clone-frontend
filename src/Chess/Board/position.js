export const getHorizontalPosition = (x) => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  return letters[x];
};

export const getVerticalPosition = (y) => {
  return 8 - y;
};

export const getPieceName = (piece, notation) => {
  if (notation === true && (piece === 6 || piece === 16)) return "";
  else {
    switch (piece) {
      case 1:
        return "K";
      case 2:
        return "Q";
      case 3:
        return "R";
      case 4:
        return "N";
      case 5:
        return "B";
      case 6:
        return "P";
      case 11:
        return "K";
      case 12:
        return "Q";
      case 13:
        return "R";
      case 14:
        return "N";
      case 15:
        return "B";
      case 16:
        return "P";
      default:
        return "";
    }
  }
};

export const getMovePosition = (
  take,
  includePosition,
  piece,
  fromX,
  fromY,
  x,
  y,
  check,
  checkMate,
  promote
) => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  if (promote === true)
    return `${letters[x] + (8 - y)}=${getPieceName(piece, true)}${
      check === true ? (checkMate === true ? "#" : "+") : ""
    }`;
  else
    return (
      getPieceName(piece, true) +
      ((piece === 6 || piece === 16) && take === true
        ? letters[fromX]
        : includePosition === "horizontal"
        ? letters[fromX]
        : includePosition === "vertical"
        ? 8 - fromY
        : "") +
      (take === true ? "x" : "") +
      letters[x] +
      (8 - y) +
      (check === true ? (checkMate === true ? "#" : "+") : "")
    );
};
