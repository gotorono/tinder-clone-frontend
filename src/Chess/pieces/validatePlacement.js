import _ from "lodash";

const take = (board, newPos, color) => {
  if (board[newPos.y][newPos.x] > 10 && color === "white") return true;
  else if (
    board[newPos.y][newPos.x] < 10 &&
    board[newPos.y][newPos.x] !== 0 &&
    color === "black"
  )
    return true;
  else return false;
};

export const getVerticalHorizontalSquares = (board, pos, color) => {
  let availableSquares = [];

  for (let i = 1; i < 8; i++) {
    // +x
    if (pos.x + i < 8) {
      if (board[pos.y][pos.x + i] === 0)
        availableSquares.push({ x: pos.x + i, y: pos.y });
      else if (take(board, { x: pos.x + i, y: pos.y }, color) === true) {
        availableSquares.push({ x: pos.x + i, y: pos.y });
        break;
      } else break;
    } else break;
  }
  for (let i = 1; i < 8; i++) {
    // -x
    if (pos.x - i >= 0) {
      if (board[pos.y][pos.x - i] === 0)
        availableSquares.push({ x: pos.x - i, y: pos.y });
      else if (take(board, { x: pos.x - i, y: pos.y }, color) === true) {
        availableSquares.push({ x: pos.x - i, y: pos.y });
        break;
      } else break;
    } else break;
  }
  for (let i = 1; i < 8; i++) {
    // +y
    if (pos.y + i < 8) {
      if (board[pos.y + i][pos.x] === 0)
        availableSquares.push({ x: pos.x, y: pos.y + i });
      else if (take(board, { x: pos.x, y: pos.y + i }, color) === true) {
        availableSquares.push({ x: pos.x, y: pos.y + i });
        break;
      } else break;
    } else break;
  }
  for (let i = 1; i < 8; i++) {
    // -y

    if (pos.y - i >= 0) {
      if (board[pos.y - i][pos.x] === 0)
        availableSquares.push({ x: pos.x, y: pos.y - i });
      else if (take(board, { x: pos.x, y: pos.y - i }, color) === true) {
        availableSquares.push({ x: pos.x, y: pos.y - i });
        break;
      } else break;
    } else break;
  }

  return availableSquares;
};

export const getDiagonalSquares = (board, pos, color) => {
  let availableSquares = [];

  for (let i = 1; i < 8; i++) {
    // +, +
    if (pos.y + i < 8 && pos.x + i < 8) {
      if (board[pos.y + i][pos.x + i] === 0)
        availableSquares.push({ x: pos.x + i, y: pos.y + i });
      else if (take(board, { x: pos.x + i, y: pos.y + i }, color) === true) {
        availableSquares.push({ x: pos.x + i, y: pos.y + i });
        break;
      } else break;
    } else break;
  }
  for (let i = 1; i < 8; i++) {
    // -, -
    if (pos.y - i >= 0 && pos.x - i >= 0) {
      if (board[pos.y - i][pos.x - i] === 0)
        availableSquares.push({ x: pos.x - i, y: pos.y - i });
      else if (take(board, { x: pos.x - i, y: pos.y - i }, color) === true) {
        availableSquares.push({ x: pos.x - i, y: pos.y - i });
        break;
      } else break;
    } else break;
  }
  for (let i = 1; i < 8; i++) {
    // +, -
    if (pos.y + i < 8 && pos.x - i >= 0) {
      if (board[pos.y + i][pos.x - i] === 0)
        availableSquares.push({ x: pos.x - i, y: pos.y + i });
      else if (take(board, { x: pos.x - i, y: pos.y + i }, color) === true) {
        availableSquares.push({ x: pos.x - i, y: pos.y + i });
        break;
      } else break;
    } else break;
  }
  for (let i = 1; i < 8; i++) {
    // -, +
    if (pos.y - i >= 0 && pos.x + i < 8) {
      if (board[pos.y - i][pos.x + i] === 0)
        availableSquares.push({ x: pos.x + i, y: pos.y - i });
      else if (take(board, { x: pos.x + i, y: pos.y - i }, color) === true) {
        availableSquares.push({ x: pos.x + i, y: pos.y - i });
        break;
      } else break;
    } else break;
  }

  return availableSquares;
};

const pawnTake = (board, oldPos, newPos, color) => {
  if (newPos.x === oldPos.x + 1 || newPos.x === oldPos.x - 1) {
    if (color === "white") {
      if (board[newPos.y][newPos.x] > 10 && newPos.y === oldPos.y - 1)
        return true;
    } else {
      if (
        board[newPos.y][newPos.x] < 10 &&
        board[newPos.y][newPos.x] !== 0 &&
        newPos.y === oldPos.y + 1
      )
        return true;
    }
  }
};

export const availablePawnSquares = (
  board,
  pos,
  color,
  enPassant,
  firstMove
) => {
  let availableSquares = [];

  if (color === "white") {
    if (pos.y - 1 >= 0 && board[pos.y - 1][pos.x] === 0)
      availableSquares.push({ x: pos.x, y: pos.y - 1 });
    if (
      pos.y - 2 >= 0 &&
      board[pos.y - 2][pos.x] === 0 &&
      board[pos.y - 1][pos.x] === 0 &&
      firstMove === true
    )
      availableSquares.push({ x: pos.x, y: pos.y - 2 });
    if (
      pos.y - 1 >= 0 &&
      pos.x + 1 < 8 &&
      pawnTake(board, pos, { x: pos.x + 1, y: pos.y - 1 }, color)
    )
      availableSquares.push({ x: pos.x + 1, y: pos.y - 1 });
    if (
      pos.y - 1 >= 0 &&
      pos.x - 1 >= 0 &&
      pawnTake(board, pos, { x: pos.x - 1, y: pos.y - 1 }, color)
    )
      availableSquares.push({ x: pos.x - 1, y: pos.y - 1 });
    if (
      enPassant &&
      enPassant.target &&
      enPassant.target.x === pos.x + 1 &&
      enPassant.target.y === pos.y - 1
    )
      availableSquares.push({ x: pos.x + 1, y: pos.y - 1 });
    if (
      enPassant &&
      enPassant.target &&
      enPassant.target.x === pos.x - 1 &&
      enPassant.target.y === pos.y - 1
    )
      availableSquares.push({ x: pos.x - 1, y: pos.y - 1 });
  } else {
    if (pos.y + 1 < 8 && board[pos.y + 1][pos.x] === 0)
      availableSquares.push({ x: pos.x, y: pos.y + 1 });
    if (
      pos.y + 2 < 8 &&
      board[pos.y + 2][pos.x] === 0 &&
      board[pos.y + 1][pos.x] === 0 &&
      firstMove === true
    )
      availableSquares.push({ x: pos.x, y: pos.y + 2 });
    if (
      pos.y + 1 < 8 &&
      pos.x + 1 < 8 &&
      board &&
      pawnTake(board, pos, { x: pos.x + 1, y: pos.y + 1 }, color)
    )
      availableSquares.push({ x: pos.x + 1, y: pos.y + 1 });
    if (
      pos.y + 1 < 8 &&
      pos.x - 1 >= 0 &&
      pawnTake(board, pos, { x: pos.x - 1, y: pos.y + 1 }, color)
    )
      availableSquares.push({ x: pos.x - 1, y: pos.y + 1 });
    if (
      enPassant &&
      enPassant.target &&
      enPassant.target.x === pos.x + 1 &&
      enPassant.target.y === pos.y + 1
    )
      availableSquares.push({ x: pos.x + 1, y: pos.y + 1 });
    if (
      enPassant &&
      enPassant.target &&
      enPassant.target.x === pos.x - 1 &&
      enPassant.target.y === pos.y + 1
    )
      availableSquares.push({ x: pos.x - 1, y: pos.y + 1 });
  }

  availableSquares = availableSquares.filter(
    (square) =>
      isNewBoardInCheck(
        board,
        pos,
        square,
        color,
        color === "white" ? 6 : 16
      ) === false
  );

  return availableSquares;
};

export const isCheckmateOrStalemate = (board, color, enPassant) => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (color === "black") {
        switch (board[i][j]) {
          case 11:
            if (availableKingSquares(board, { x: j, y: i }, color).length > 0)
              return false;
            break;
          case 12:
            if (
              availableQueenSquares(board, color, { x: j, y: i }, 12).length > 0
            )
              return false;
            break;
          case 13:
            if (
              availableRookSquares(board, color, { x: j, y: i }, 13).length > 0
            )
              return false;
            break;
          case 14:
            if (
              availableKnightSquares(board, color, { x: j, y: i }, 14).length >
              0
            )
              return false;
            break;
          case 15:
            if (
              availableBishopSquares(board, color, { x: j, y: i }, 15).length >
              0
            )
              return false;
            break;
          case 16:
            if (
              availablePawnSquares(
                board,
                { x: j, y: i },
                color,
                enPassant,
                i === 1 ? true : false
              ).length > 0
            )
              return false;
            break;
          default:
            break;
        }
      } else {
        switch (board[i][j]) {
          case 1:
            if (availableKingSquares(board, { x: j, y: i }, color).length > 0)
              return false;
            break;
          case 2:
            if (
              availableQueenSquares(board, color, { x: j, y: i }, 2).length > 0
            )
              return false;
            break;
          case 3:
            if (
              availableRookSquares(board, color, { x: j, y: i }, 3).length > 0
            )
              return false;
            break;
          case 4:
            if (
              availableKnightSquares(board, color, { x: j, y: i }, 4).length > 0
            )
              return false;
            break;
          case 5:
            if (
              availableBishopSquares(board, color, { x: j, y: i }, 5).length > 0
            )
              return false;
            break;
          case 6:
            if (
              availablePawnSquares(
                board,
                { x: j, y: i },
                color,
                enPassant,
                i === 6 ? true : false
              ).length > 0
            )
              return false;
            break;
          default:
            break;
        }
      }
    }
  }

  return true;
};

export const checkIfKingIsInCheck = (board, color) => {
  let kingPosition = {};

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 1 && color === "white") {
        kingPosition.x = j;
        kingPosition.y = i;
      } else if (board[i][j] === 11 && color === "black") {
        kingPosition.x = j;
        kingPosition.y = i;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (color === "white") {
        switch (board[i][j]) {
          case 11:
            if (
              kingSquares(board, { x: j, y: i }, "black").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 12:
            if (
              [
                ...getDiagonalSquares(board, { x: j, y: i }, "black"),
                ...getVerticalHorizontalSquares(board, { x: j, y: i }, "black"),
              ].find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 13:
            if (
              getVerticalHorizontalSquares(board, { x: j, y: i }, "black").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 14:
            if (
              knightSquares(board, { x: j, y: i }, "black").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 15:
            if (
              getDiagonalSquares(board, { x: j, y: i }, "black").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;

            break;
          case 16:
            if (board[i + 1][j + 1] === 1 || board[i + 1][j - 1] === 1)
              return true;
            break;
          default:
            break;
        }
      } else {
        switch (board[i][j]) {
          case 1:
            if (
              kingSquares(board, { x: j, y: i }, "white").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 2:
            if (
              [
                ...getDiagonalSquares(board, { x: j, y: i }, "white"),
                ...getVerticalHorizontalSquares(board, { x: j, y: i }, "white"),
              ].find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 3:
            if (
              getVerticalHorizontalSquares(board, { x: j, y: i }, "white").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 4:
            if (
              knightSquares(board, { x: j, y: i }, "white").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 5:
            if (
              getDiagonalSquares(board, { x: j, y: i }, "white").find(
                (pos) => pos.x === kingPosition.x && pos.y === kingPosition.y
              )
            )
              return true;
            break;
          case 6:
            if (board[i - 1][j + 1] === 11 || board[i - 1][j - 1] === 11)
              return true;
            break;
          default:
            break;
        }
      }
    }
  }

  return false;
};

export const availableKingSquares = (board, pos, color, canCastle) => {
  let availableSquares = [];

  kingSquares(board, pos, color).map((newPos) => {
    if (
      !isNewBoardInCheck(board, pos, newPos, color, color === "white" ? 1 : 11)
    )
      availableSquares.push(newPos);
  });
  if (canCastle)
    availableSquares = [
      ...availableSquares,
      ...castleCheck(board, pos, canCastle, color),
    ];

  return availableSquares;
};

export const kingSquares = (board, pos, color) => {
  let availableSquares = [];

  if (
    pos.y + 1 < 8 &&
    (board[pos.y + 1][pos.x] === 0 ||
      take(board, { x: pos.x, y: pos.y + 1 }, color))
  )
    availableSquares.push({ x: pos.x, y: pos.y + 1 });
  if (
    pos.y - 1 >= 0 &&
    (board[pos.y - 1][pos.x] === 0 ||
      take(board, { x: pos.x, y: pos.y - 1 }, color))
  )
    availableSquares.push({ x: pos.x, y: pos.y - 1 });
  if (
    pos.y + 1 < 8 &&
    pos.x + 1 < 8 &&
    (board[pos.y + 1][pos.x + 1] === 0 ||
      take(board, { x: pos.x + 1, y: pos.y + 1 }, color))
  )
    availableSquares.push({ x: pos.x + 1, y: pos.y + 1 });
  if (
    pos.y - 1 >= 0 &&
    pos.x + 1 < 8 &&
    (board[pos.y - 1][pos.x + 1] === 0 ||
      take(board, { x: pos.x + 1, y: pos.y - 1 }, color))
  )
    availableSquares.push({ x: pos.x + 1, y: pos.y - 1 });
  if (
    pos.y - 1 >= 0 &&
    pos.x - 1 >= 0 &&
    (board[pos.y - 1][pos.x - 1] === 0 ||
      take(board, { x: pos.x - 1, y: pos.y - 1 }, color))
  )
    availableSquares.push({ x: pos.x - 1, y: pos.y - 1 });
  if (
    pos.y + 1 < 8 &&
    pos.x - 1 >= 0 &&
    (board[pos.y + 1][pos.x - 1] === 0 ||
      take(board, { x: pos.x - 1, y: pos.y + 1 }, color))
  )
    availableSquares.push({ x: pos.x - 1, y: pos.y + 1 });
  if (
    pos.x + 1 < 8 &&
    (board[pos.y][pos.x + 1] === 0 ||
      take(board, { x: pos.x + 1, y: pos.y }, color))
  )
    availableSquares.push({ x: pos.x + 1, y: pos.y });
  if (
    pos.x - 1 >= 0 &&
    (board[pos.y][pos.x - 1] === 0 ||
      take(board, { x: pos.x - 1, y: pos.y }, color))
  )
    availableSquares.push({ x: pos.x - 1, y: pos.y });
  return availableSquares;
};

export const knightSquares = (board, pos, color) => {
  let availableSquares = [];

  if (
    pos.y + 1 < 8 &&
    pos.x + 2 < 8 &&
    (board[pos.y + 1][pos.x + 2] === 0 ||
      take(board, { x: pos.x + 2, y: pos.y + 1 }, color))
  )
    availableSquares.push({ x: pos.x + 2, y: pos.y + 1 });
  if (
    pos.y + 2 < 8 &&
    pos.x + 1 < 8 &&
    (board[pos.y + 2][pos.x + 1] === 0 ||
      take(board, { x: pos.x + 1, y: pos.y + 2 }, color))
  )
    availableSquares.push({ x: pos.x + 1, y: pos.y + 2 });
  if (
    pos.y - 1 >= 0 &&
    pos.x + 2 < 8 &&
    (board[pos.y - 1][pos.x + 2] === 0 ||
      take(board, { x: pos.x + 2, y: pos.y - 1 }, color))
  )
    availableSquares.push({ x: pos.x + 2, y: pos.y - 1 });
  if (
    pos.y - 2 >= 0 &&
    pos.x + 1 < 8 &&
    (board[pos.y - 2][pos.x + 1] === 0 ||
      take(board, { x: pos.x + 1, y: pos.y - 2 }, color))
  )
    availableSquares.push({ x: pos.x + 1, y: pos.y - 2 });
  if (
    pos.y + 1 < 8 &&
    pos.x - 2 >= 0 &&
    (board[pos.y + 1][pos.x - 2] === 0 ||
      take(board, { x: pos.x - 2, y: pos.y + 1 }, color))
  )
    availableSquares.push({ x: pos.x - 2, y: pos.y + 1 });
  if (
    pos.y + 2 < 8 &&
    pos.x - 1 >= 0 &&
    (board[pos.y + 2][pos.x - 1] === 0 ||
      take(board, { x: pos.x - 1, y: pos.y + 2 }, color))
  )
    availableSquares.push({ x: pos.x - 1, y: pos.y + 2 });
  if (
    pos.y - 1 >= 0 &&
    pos.x - 2 >= 0 &&
    (board[pos.y - 1][pos.x - 2] === 0 ||
      take(board, { x: pos.x - 2, y: pos.y - 1 }, color))
  )
    availableSquares.push({ x: pos.x - 2, y: pos.y - 1 });
  if (
    pos.y - 2 >= 0 &&
    pos.x - 1 >= 0 &&
    (board[pos.y - 2][pos.x - 1] === 0 ||
      take(board, { x: pos.x - 1, y: pos.y - 2 }, color))
  )
    availableSquares.push({ x: pos.x - 1, y: pos.y - 2 });

  return availableSquares;
};

export const availableRookSquares = (board, color, pos, piece) => {
  let availableSquares = [];

  if (pos && piece) {
    getVerticalHorizontalSquares(board, pos, color).map((square) => {
      if (!isNewBoardInCheck(board, pos, square, color, piece))
        availableSquares.push(square);
    });
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 3 && color === "white") {
          getVerticalHorizontalSquares(board, { x: j, y: i }, color).map(
            (pos) => {
              if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 3))
                availableSquares.push(pos);
            }
          );
        } else if (board[i][j] === 13 && color === "black") {
          getVerticalHorizontalSquares(board, { x: j, y: i }, color).map(
            (pos) => {
              if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 13))
                availableSquares.push(pos);
            }
          );
        }
      }
    }
  }

  return availableSquares;
};

export const availableQueenSquares = (board, color, pos, piece) => {
  let availableSquares = [];

  if (pos && piece) {
    [
      ...getDiagonalSquares(board, pos, color),
      ...getVerticalHorizontalSquares(board, pos, color),
    ].map((square) => {
      if (!isNewBoardInCheck(board, pos, square, color, piece))
        availableSquares.push(square);
    });
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 2 && color === "white") {
          [
            ...getDiagonalSquares(board, { x: j, y: i }, color),
            ...getVerticalHorizontalSquares(board, { x: j, y: i }, color),
          ].map((pos) => {
            if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 2))
              availableSquares.push(pos);
          });
        } else if (board[i][j] === 12 && color === "black") {
          [
            ...getDiagonalSquares(board, { x: j, y: i }, color),
            ...getVerticalHorizontalSquares(board, { x: j, y: i }, color),
          ].map((pos) => {
            if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 12))
              availableSquares.push(pos);
          });
        }
      }
    }
  }

  return availableSquares;
};

export const availableBishopSquares = (board, color, pos, piece) => {
  let availableSquares = [];

  if (pos && piece) {
    getDiagonalSquares(board, pos, color).map((square) => {
      if (!isNewBoardInCheck(board, pos, square, color, piece))
        availableSquares.push(square);
    });
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 5 && color === "white") {
          getDiagonalSquares(board, { x: j, y: i }, color).map((pos) => {
            if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 5))
              availableSquares.push(pos);
          });
        } else if (board[i][j] === 15 && color === "black") {
          getDiagonalSquares(board, { x: j, y: i }, color).map((pos) => {
            if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 15))
              availableSquares.push(pos);
          });
        }
      }
    }
  }

  return availableSquares;
};

export const isVertical = (board, pos, color, piece) => {
  for (let i = pos.y + 1; i < 8; i++) {
    if (
      board[i][pos.x] !== piece &&
      take(board, { x: pos.x, y: i }, color === "white" ? "black" : "white")
    )
      break;
    if (board[i][pos.x] === piece) return true;
  }

  for (let i = pos.y - 1; i >= 0; i--) {
    if (
      board[i][pos.x] !== piece &&
      take(board, { x: pos.x, y: i }, color === "white" ? "black" : "white")
    )
      break;
    if (board[i][pos.x] === piece) return true;
  }

  return false;
};

export const availableKnightSquares = (board, color, pos, piece) => {
  let availableSquares = [];

  if (pos && piece) {
    knightSquares(board, pos, color).map((square) => {
      if (!isNewBoardInCheck(board, pos, square, color, piece))
        availableSquares.push(square);
    });
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === 4 && color === "white") {
          knightSquares(board, { x: j, y: i }, color).map((pos) => {
            if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 4))
              availableSquares.push(pos);
          });
        } else if (board[i][j] === 14 && color === "black") {
          knightSquares(board, { x: j, y: i }, color).map((pos) => {
            if (!isNewBoardInCheck(board, { x: j, y: i }, pos, color, 14))
              availableSquares.push(pos);
          });
        }
      }
    }
  }

  return availableSquares;
};

const isNewBoardInCheck = (board, oldKpos, newKpos, color, piece) => {
  board = _.cloneDeep(board);

  board[oldKpos.y][oldKpos.x] = 0;
  board[newKpos.y][newKpos.x] = piece;

  if (checkIfKingIsInCheck(board, color)) return true;
  else return false;
};

const castleCheck = (board, pos, canCastle, color) => {
  let availableCastles = [];

  if (!isNewBoardInCheck(board, pos, pos, color, color === "white" ? 1 : 11)) {
    if (
      board[pos.y][pos.x + 2] === 0 &&
      board[pos.y][pos.x + 1] === 0 &&
      canCastle.kingside === true
    )
      if (
        !isNewBoardInCheck(
          board,
          pos,
          { x: pos.x + 1, y: pos.y },
          color,
          color === "white" ? 1 : 11
        ) &&
        !isNewBoardInCheck(
          board,
          pos,
          { x: pos.x + 2, y: pos.y },
          color,
          color === "white" ? 1 : 11
        )
      )
        availableCastles.push({ x: pos.x + 2, y: pos.y });

    if (
      board[pos.y][pos.x - 3] === 0 &&
      board[pos.y][pos.x - 2] === 0 &&
      board[pos.y][pos.x - 1] === 0 &&
      canCastle.queenside === true
    )
      if (
        !isNewBoardInCheck(
          board,
          pos,
          { x: pos.x - 1, y: pos.y },
          color,
          color === "white" ? 1 : 11
        ) &&
        !isNewBoardInCheck(
          board,
          pos,
          { x: pos.x - 2, y: pos.y },
          color,
          color === "white" ? 1 : 11
        )
      )
        availableCastles.push({ x: pos.x - 2, y: pos.y });
  }

  return availableCastles;
};

const determineSquareColor = (pos) => {
  if ((pos.y + 1) % 2 === 0) {
    if ((pos.x + 1) % 2 === 0) return "light";
    else return "dark";
  } else {
    if ((pos.x + 1) % 2 === 0) return "dark";
    else return "light";
  }
};

export const isDraw = (board, boardHistory) => {
  let pieces = [];
  let bishops = [];

  let counts = {};

  boardHistory.map((board) => {
    counts[board] = (counts[board] || 0) + 1;
    return board;
  });

  if (Object.values(counts).find((val) => val === 3)) return true;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === 5 || board[i][j] === 15)
        bishops.push({
          x: j,
          y: i,
          piece: board[i][j],
          color: determineSquareColor({ x: j, y: i }),
        });
      if (board[i][j] !== 0) pieces.push(board[i][j]);
    }
  }

  if (pieces.length === 2) return true;
  //king vs king
  else if (
    //king and bishop versus king, king and knight vs king
    pieces.length === 3 &&
    (pieces.includes(5) ||
      pieces.includes(15) ||
      pieces.includes(4) ||
      pieces.includes(14))
  )
    return true;
  else if (pieces.length === 4 && bishops.length === 2)
    if (bishops[0].color === bishops[1].color)
      //king and bishop vs king and bishop same color
      return true;

  return false;
};
