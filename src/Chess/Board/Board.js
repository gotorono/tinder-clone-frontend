import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Board.css";

import { formatMoves } from "./moves";

import { getMatchString } from "../../variables";

import _ from "lodash";

import classnames from "classnames";

import moveSoundFile from "./audio/move.wav";

import { Link } from "react-router-dom";

import King from "../pieces/King";
import Rook from "../pieces/Rook";
import Bishop from "../pieces/Bishop";
import Queen from "../pieces/Queen";
import Knight from "../pieces/Knight";
import Pawn from "../pieces/Pawn";

import axios from "../../axios";
import { socket } from "../../socket";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getPieceName } from "./position";

import { getBoardSize } from "./boardSize";

import {
  checkIfKingIsInCheck,
  isCheckmateOrStalemate,
  availableKnightSquares,
  availableBishopSquares,
  availableQueenSquares,
  availableRookSquares,
  isVertical,
  isDraw,
} from "../pieces/validatePlacement";

function Board(props) {
  const [isDown, setIsDown] = useState({ state: false, pos: { x: 0, y: 0 } });
  const [boardSize, setBoardSize] = useState({});
  const [gameState, setGameState] = useState({});

  const [opponent, setOpponent] = useState({});
  const [matchString, setMatchString] = useState("");

  const [turn, setTurn] = useState(null);
  const [promote, setPromote] = useState({
    state: false,
    piece: 0,
    newPos: {},
    oldPos: {},
    board: [],
  });

  const [canCastle, setCanCastle] = useState({
    white: {
      queenside: true,
      kingside: true,
    },
    black: {
      queenside: true,
      kingside: true,
    },
  });

  const [enPassant, setEnPassant] = useState({
    white: {
      pawns: [],
    },
    black: {
      pawns: [],
    },
  });

  const [captures, setCaptures] = useState({
    white: [],
    black: [],
  });

  const [boardHistory, setBoardHistory] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [tableBoard, setTableBoard] = useState([]);

  const tableRef = useRef();

  const [board, setBoard] = useState([
    [13, 14, 15, 12, 11, 15, 14, 13],
    [16, 16, 16, 16, 16, 16, 16, 16],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [6, 6, 6, 6, 6, 6, 6, 6],
    [3, 4, 5, 2, 1, 5, 4, 3],
  ]);

  const [boardHistoryLive, setBoardHistoryLive] = useState({
    state: null,
    index: -1,
  });

  // k1 | q2 | r3 | n4 | b5 | p6

  const refs = useRef(new Array(64));

  const setLiveBoard = () => {
    setBoardHistoryLive({ state: null, index: -1 });
  };

  const getGame = async (opponentId, id) => {
    getMatchString(id, opponentId).then((matchStr) => {
      setMatchString(matchStr);
      socket.emit("chessJoin", matchStr);
    });
  };

  const setNewGame = (data) => {
    setGameState(data.game.game);
    setCanCastle(data.game.castles);
    setCaptures(data.game.captures);
    setEnPassant(data.game.enPassant);
    setBoardHistory(data.game.boardHistory);
    setMoveHistory(data.game.moveHistory);
    setBoard(data.game.board);

    setTurn(data.game.turn);
    props.sides(data.game.game);

    setOpponent(data.opponent);
  };

  const fetchData = useCallback(async () => {
    const req = await axios.get("/tinder/chess/game", {
      params: {
        id: props.auth.user.id,
        opponentId: props.match.params.game,
        matchString,
      },
    });

    if (req.data.game) {
      setGameState(req.data.game.game);
      setBoard(req.data.game.board);
      setCanCastle(req.data.game.castles);
      setCaptures(req.data.game.captures);
      setEnPassant(req.data.game.enPassant);
      setBoardHistory(req.data.game.boardHistory);
      setMoveHistory(req.data.game.moveHistory);
      setTurn(req.data.game.turn);
      props.sides(req.data.game.game);
    } else {
      setTurn("white");
      setGameState(req.data.state);
      props.sides(req.data.state);
    }
    setOpponent(req.data.opponent);
  }, [props.auth.user.id, props.match.params.game, matchString]);

  useEffect(() => {
    socket.on("inviteSent", () => {
      setGameState({...gameState, invited: [props.auth.user.id]})
    });

    socket.on("hasBeenInvited", () => {
      setGameState({...gameState, invited: [props.match.params.game]})
    });

    return () => {
        socket.off("inviteSent");
        socket.off("hasBeenInvited");
    };
  }, [gameState])

  useEffect(() => {
    if (matchString !== "") {
      fetchData();

      socket.on("newGame", (data) => {
        console.log(data);
        setNewGame(data);
      });
    }

    return () => {
      if (matchString !== "") {
        socket.emit("chessLeave", matchString);
        socket.off("inviteSent");
        socket.off("hasBeenInvited");
        socket.off("newGame");
      }
    };
  }, [matchString, props.match.params.game, props.auth.user.id]);

  useEffect(() => {
    socket.on("newChessBoard", (data) => {
      setTurn(data.turn);
      setCanCastle(data.canCastle);
      setCaptures(data.captures);
      setEnPassant(data.enPassant);
      setBoardHistory(data.boardHistory);
      setMoveHistory(data.moveHistory);
      setBoard(data.board);
    });

    return () => socket.off("newChessBoard");
  }, [moveHistory.length]);

  useEffect(() => {
    getGame(props.match.params.game, props.auth.user.id);
  }, [props.match.params.game, props.auth.user.id]);

  const setLiveHistoryBoard = useCallback(
    (i, origin) => {
      if (origin === "left") {
        if (
          boardHistory[moveHistory.length - 1] &&
          boardHistoryLive.index === -1
        )
          setBoardHistoryLive({
            state: boardHistory[moveHistory.length - 1],
            index: moveHistory.length - 1,
          });
        else if (
          boardHistory[boardHistoryLive.index - 1] &&
          boardHistoryLive.index !== 0
        )
          setBoardHistoryLive({
            state: boardHistory[boardHistoryLive.index - 1],
            index: boardHistoryLive.index - 1,
          });
      } else if (origin === "right") {
        if (
          boardHistoryLive.index !== -1 &&
          boardHistoryLive.index + 1 < boardHistory.length &&
          boardHistoryLive.index !== boardHistory.length - 2
        )
          setBoardHistoryLive({
            state: boardHistory[boardHistoryLive.index + 1],
            index: boardHistoryLive.index + 1,
          });
        else if (boardHistoryLive.index === boardHistory.length - 2)
          setLiveBoard();
      } else setBoardHistoryLive({ state: boardHistory[i], index: i });
    },
    [boardHistory, boardHistoryLive.index]
  );

  const keyPressHistory = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        setLiveHistoryBoard(0, "left");
        break;
      case "ArrowRight":
        e.preventDefault();
        setLiveHistoryBoard(0, "right");
        break;
    }
  };

  const moveSound = new Audio(moveSoundFile);

  useEffect(() => {
    const resizeBoard = () => {
      if (tableRef.current.parentNode.parentNode)
        setBoardSize(
          getBoardSize(window.innerWidth, window.innerHeight, tableRef)
        );
    };

    resizeBoard();
    if (tableRef.current && tableRef.current.clientWidth) {
      window.addEventListener("resize", resizeBoard);
      document.addEventListener("keydown", keyPressHistory);

      return () => {
        document.removeEventListener("keydown", keyPressHistory);
        window.removeEventListener("resize", resizeBoard);
      };
    }
  }, [tableRef.current, setLiveHistoryBoard]);

  const getAvailableSquares = (oldBoard, oldPos, newPos, piece, color) => {
    let merged = [];

    let vertical = isVertical(oldBoard, oldPos, color, piece);

    if (piece === 4 || piece === 14)
      availableKnightSquares(oldBoard, color).map((obj) => {
        merged.push(obj);
      });
    else if (piece === 5 || piece === 15)
      availableBishopSquares(oldBoard, color).map((obj) => {
        merged.push(obj);
      });
    else if (piece === 2 || piece === 12)
      availableQueenSquares(oldBoard, color).map((obj) => {
        merged.push(obj);
      });
    else if (piece === 3 || piece === 13)
      availableRookSquares(oldBoard, color).map((obj) => {
        merged.push(obj);
      });

    let duplicates = _.filter(
      _.uniq(
        _.map(merged, function (item) {
          if (
            _.filter(merged, {
              x: item.x,
              y: item.y,
            }).length > 1
          ) {
            return item;
          }

          return false;
        })
      ),
      function (value) {
        return value;
      }
    );

    duplicates = [
      ...new Set(duplicates.map((o) => JSON.stringify(o))),
    ].map((s) => JSON.parse(s));

    if (duplicates.some((e) => e.x === newPos.x && e.y === newPos.y))
      return vertical === true ? "vertical" : "horizontal";
    else return false;
  };

  const enPassantMove = useCallback(
    (oldPos, newPos, piece) => {
      let newBoard = _.cloneDeep(board);

      newBoard[oldPos.y][oldPos.x] = 0;
      newBoard[newPos.y][newPos.x] = piece;
      if (turn === "white") newBoard[newPos.y + 1][newPos.x] = 0;
      if (turn === "black") newBoard[newPos.y - 1][newPos.x] = 0;

      if (!checkIfKingIsInCheck(newBoard, turn)) {
        if (turn === "white") setTurn("black");
        else setTurn("white");
        setMoveHistory([
          ...moveHistory,
          {
            piece,
            take: true,
            includePosition: "horizontal",
            check: checkIfKingIsInCheck(
              _.cloneDeep(newBoard),
              turn === "white" ? "black" : "white"
            ),
            checkMate:
              checkIfKingIsInCheck(
                _.cloneDeep(newBoard),
                turn === "white" ? "black" : "white"
              ) === true
                ? isCheckmateOrStalemate(
                    _.cloneDeep(newBoard),
                    turn === "white" ? "black" : "white"
                  ) === true
                : false,
            from: { y: oldPos.y, x: oldPos.x },
            to: { y: newPos.y, x: newPos.x },
          },
        ]);
        setBoard(newBoard);
      } else {
        console.log("inCheck?");
      }
    },
    [board, turn, moveHistory.length]
  );

  useEffect(() => {
    if (promote.piece !== 0) {
      let newBoard = _.cloneDeep(promote.board);
      newBoard[promote.newPos.y][promote.newPos.x] = promote.piece;
      setMoveHistory([
        ...moveHistory,
        {
          promote: true,
          oldPiece: turn === "white" ? 6 : 16,
          piece: promote.piece,
          check: checkIfKingIsInCheck(
            _.cloneDeep(newBoard),
            turn === "white" ? "black" : "white"
          ),
          checkMate:
            checkIfKingIsInCheck(
              _.cloneDeep(newBoard),
              turn === "white" ? "black" : "white"
            ) === true
              ? isCheckmateOrStalemate(
                  _.cloneDeep(newBoard),
                  turn === "white" ? "black" : "white",
                  enPassant[turn]
                ) === true
              : false,
          from: { y: promote.oldPos.y, x: promote.oldPos.x },
          to: { y: promote.newPos.y, x: promote.newPos.x },
        },
      ]);
      setBoard(newBoard);
      if (turn === "white") setTurn("black");
      else setTurn("white");
      setPromote({ state: false, piece: 0, newPos: {}, oldPos: {}, board: [] });
    }
  }, [promote, turn, moveHistory]);

  const castles = useCallback(
    (side, oldPos, newPos, piece) => {
      let newBoard = _.cloneDeep(board);

      newBoard[oldPos.y][oldPos.x] = 0;
      newBoard[newPos.y][newPos.x] = piece;

      if (side === "kingside") {
        newBoard[newPos.y][newPos.x + 1] = 0;
        newBoard[newPos.y][newPos.x - 1] = turn === "white" ? 3 : 13;
        if (turn === "white")
          setCanCastle({
            ...canCastle,
            white: { queenside: false, kingside: false },
          });
        else if (turn === "black")
          setCanCastle({
            ...canCastle,
            black: { queenside: false, kingside: false },
          });
      } else {
        newBoard[newPos.y][newPos.x - 2] = 0;
        newBoard[newPos.y][newPos.x + 1] = turn === "white" ? 3 : 13;
      }

      if (!checkIfKingIsInCheck(newBoard, turn)) {
        if (turn === "white") setTurn("black");
        else setTurn("white");
        setMoveHistory([
          ...moveHistory,
          {
            side,
            from: { y: oldPos.y, x: oldPos.x },
            to: { y: newPos.y, x: newPos.x },
          },
        ]);
        setBoard(newBoard);
      } else {
        console.log("inCheck?");
      }
    },
    [board, turn, canCastle, moveHistory.length]
  );

  const getNotation = useCallback(() => {
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8];

    let notation = [
      letters.map((letter, i) => (
        <div
          className="mark"
          style={
            boardSize.width
              ? {
                  bottom: 1,
                  left: ((i + 1) * boardSize.width) / 8,
                  marginLeft: -((0.15 * boardSize.width) / 8),
                  fontSize: (0.175 * boardSize.width) / 8,
                }
              : null
          }
        >
          {props.playing === "black" ? letters[letters.length - 1 - i] : letter}
        </div>
      )),
      numbers.map((number, i) => (
        <div
          className="mark"
          style={
            boardSize.width
              ? {
                  left: 5,
                  bottom: ((i + 1) * boardSize.width) / 8,
                  marginBottom: -((0.245 * boardSize.width) / 8),
                  fontSize: (0.175 * boardSize.width) / 8,
                }
              : null
          }
        >
          {props.playing === "black" ? numbers[numbers.length - 1 - i] : number}
        </div>
      )),
    ];

    return notation;
  }, [boardSize.width, props.playing]);

  const getCaptures = (captures, capturesEnemy) => {
    const getScore = (pieces, piecesEnemy) => {
      let score = 0;
      let scoreEnemy = 0;

      pieces.map((piece) => {
        if (piece === 6 || piece === 16) score += 1;
        else if (piece === 5 || piece === 15) score += 3;
        else if (piece === 4 || piece === 14) score += 3;
        else if (piece === 3 || piece === 13) score += 5;
        else if (piece === 2 || piece === 12) score += 9;
      });

      piecesEnemy.map((piece) => {
        if (piece === 6 || piece === 16) scoreEnemy += 1;
        else if (piece === 5 || piece === 15) scoreEnemy += 3;
        else if (piece === 4 || piece === 14) scoreEnemy += 3;
        else if (piece === 3 || piece === 13) scoreEnemy += 5;
        else if (piece === 2 || piece === 12) scoreEnemy += 9;
      });

      return score - scoreEnemy <= 0 ? "" : `+` + (score - scoreEnemy);
    };

    let groups = {};

    let capturedPiecesJSX = [];

    captures.map((capture) => {
      if (groups[capture]) groups[capture].push(capture);
      else groups[capture] = [capture];
    });

    Object.getOwnPropertyNames(groups).map((name) => {
      capturedPiecesJSX.push(
        <div className="pieceGroup">
          {groups[name].map((piece) => (
            <span>{getPieceName(piece)}</span>
          ))}
        </div>
      );
    });

    capturedPiecesJSX.push(
      <div className="pieceScore">{`${getScore(captures, capturesEnemy)}`}</div>
    );

    return capturedPiecesJSX;
  };

  const place = useCallback(
    (oldPos, newPos, piece) => {
      let oldBoard = _.cloneDeep(board);
      let newBoard = _.cloneDeep(board);

      newBoard[oldPos.y][oldPos.x] = 0;
      newBoard[newPos.y][newPos.x] = piece;

      if (!checkIfKingIsInCheck(newBoard, turn)) {
        if (turn === "white") {
          if (oldBoard[oldPos.y][oldPos.x] === 3) {
            if (oldPos.x === 0)
              setCanCastle({
                ...canCastle,
                white: { ...canCastle.white, queenside: false },
              });
            else if (oldPos.x === 7)
              setCanCastle({
                ...canCastle,
                white: { ...canCastle.white, kingside: false },
              });
          } else if (oldBoard[oldPos.y][oldPos.x] === 1) {
            setCanCastle({
              ...canCastle,
              white: { queenside: false, kingside: false },
            });
          }
        } else {
          if (oldBoard[oldPos.y][oldPos.x] === 13) {
            if (oldPos.x === 0)
              setCanCastle({
                ...canCastle,
                black: { ...canCastle.black, queenside: false },
              });
            else if (oldPos.x === 7)
              setCanCastle({
                ...canCastle,
                black: { ...canCastle.black, kingside: false },
              });
          } else if (oldBoard[oldPos.y][oldPos.x] === 11) {
            setCanCastle({
              ...canCastle,
              black: { queenside: false, kingside: false },
            });
          }
        }

        setEnPassant({
          white: {
            pawns: [],
          },
          black: {
            pawns: [],
          },
        });

        let isPromoteAvailable = false;

        if (piece === 6 && turn === "white" && newPos.y === 0) {
          setPromote({
            state: true,
            piece: 0,
            newPos,
            oldPos,
            board: newBoard,
          });
          isPromoteAvailable = true;
        }

        if (piece === 16 && turn === "black" && newPos.y === 7) {
          setPromote({
            state: true,
            piece: 0,
            newPos,
            oldPos,
            board: newBoard,
          });
          isPromoteAvailable = true;
        }

        if (
          piece === 6 &&
          turn === "white" &&
          oldBoard[newPos.y + 2][newPos.x] === piece &&
          newPos.y + 2 === 6
        ) {
          let pawns = [];
          if (newBoard[newPos.y][newPos.x + 1] === 16)
            pawns.push({
              x: newPos.x + 1,
              y: newPos.y,
              target: { x: newPos.x, y: newPos.y + 1 },
            });
          if (newBoard[newPos.y][newPos.x - 1] === 16)
            pawns.push({
              x: newPos.x - 1,
              y: newPos.y,
              target: { x: newPos.x, y: newPos.y + 1 },
            });
          setEnPassant({
            ...enPassant,
            black: {
              pawns,
            },
          });
        } else if (
          piece === 16 &&
          turn === "black" &&
          oldBoard[newPos.y - 2][newPos.x] === piece &&
          newPos.y - 2 === 1
        ) {
          let pawns = [];
          if (newBoard[newPos.y][newPos.x + 1] === 6)
            pawns.push({
              x: newPos.x + 1,
              y: newPos.y,
              target: { x: newPos.x, y: newPos.y - 1 },
            });
          if (newBoard[newPos.y][newPos.x - 1] === 6)
            pawns.push({
              x: newPos.x - 1,
              y: newPos.y,
              target: { x: newPos.x, y: newPos.y - 1 },
            });

          if (pawns.length > 0)
            setEnPassant({
              ...enPassant,
              white: {
                pawns,
              },
            });
        }

        if (isPromoteAvailable === false) {
          if (turn === "white") setTurn("black");
          else setTurn("white");

          let includePosition = "horizontal";

          if (piece !== 1 || piece !== 11 || piece !== 6 || piece !== 16)
            includePosition = getAvailableSquares(
              oldBoard,
              oldPos,
              newPos,
              piece,
              turn
            );

          if (oldBoard[newPos.y][newPos.x] !== 0) {
            if (turn === "white")
              setCaptures({
                ...captures,
                white: [...captures.white, oldBoard[newPos.y][newPos.x]],
              });
            else
              setCaptures({
                ...captures,
                black: [...captures.black, oldBoard[newPos.y][newPos.x]],
              });
          }

          setMoveHistory([
            ...moveHistory,
            {
              piece,
              includePosition,
              check: checkIfKingIsInCheck(
                _.cloneDeep(newBoard),
                turn === "white" ? "black" : "white"
              ),
              checkMate:
                checkIfKingIsInCheck(
                  _.cloneDeep(newBoard),
                  turn === "white" ? "black" : "white"
                ) === true
                  ? isCheckmateOrStalemate(
                      _.cloneDeep(newBoard),
                      turn === "white" ? "black" : "white",
                      enPassant[turn]
                    ) === true
                  : false,
              from: { y: oldPos.y, x: oldPos.x },
              take: oldBoard[newPos.y][newPos.x] !== 0 ? true : false,
              to: { y: newPos.y, x: newPos.x },
            },
          ]);
          setBoard(newBoard);
        }
      } else {
        console.log("in check");
      }
    },
    [refs.current, board, turn, canCastle, enPassant, moveHistory.length]
  );

  const mapBoard = useCallback(
    (state, board) => {
      if (state === "live")
        return board.map((row, y) => {
          return row.map((piece, x) => {
            switch (piece) {
              case 1:
                return (
                  <King
                    color="white"
                    key={`k${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "white" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    canCastle={canCastle.white}
                    castles={turn === "white" ? castles : null}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </King>
                );
              case 2:
                return (
                  <Queen
                    color="white"
                    key={`q${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "white" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Queen>
                );
              case 3:
                return (
                  <Rook
                    color="white"
                    key={`r${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "white" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Rook>
                );
              case 4:
                return (
                  <Knight
                    color="white"
                    key={`n${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "white" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Knight>
                );
              case 5:
                return (
                  <Bishop
                    color="white"
                    key={`b${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "white" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Bishop>
                );
              case 6:
                return (
                  <Pawn
                    color="white"
                    key={`p${y}-${x}`}
                    isFirst={y === 6 ? true : false}
                    position={{ x, y }}
                    place={turn === "white" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    enPassant={enPassant.white.pawns.find(
                      (pawn) => pawn.x === x && pawn.y === y
                    )}
                    enPassantMove={
                      enPassant.white.pawns.find(
                        (pawn) => pawn.x === x && pawn.y === y
                      )
                        ? enPassantMove
                        : null
                    }
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Pawn>
                );
              case 11:
                return (
                  <King
                    color="black"
                    key={`k${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "black" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    canCastle={canCastle.black}
                    castles={turn === "black" ? castles : null}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </King>
                );
              case 12:
                return (
                  <Queen
                    color="black"
                    key={`q${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "black" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Queen>
                );
              case 13:
                return (
                  <Rook
                    color="black"
                    key={`r${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "black" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Rook>
                );
              case 14:
                return (
                  <Knight
                    color="black"
                    key={`n${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "black" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Knight>
                );
              case 15:
                return (
                  <Bishop
                    color="black"
                    key={`b${y}-${x}`}
                    position={{ x, y }}
                    place={turn === "black" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Bishop>
                );
              case 16:
                return (
                  <Pawn
                    color="black"
                    key={`p${y}-${x}`}
                    isFirst={y === 1 ? true : false}
                    position={{ x, y }}
                    place={turn === "black" ? place : null}
                    board={_.cloneDeep(board)}
                    playing={props.playing}
                    enPassant={enPassant.black.pawns.find(
                      (pawn) => pawn.x === x && pawn.y === y
                    )}
                    enPassantMove={
                      enPassant.black.pawns.find(
                        (pawn) => pawn.x === x && pawn.y === y
                      )
                        ? enPassantMove
                        : null
                    }
                    grabbing={grabbing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </Pawn>
                );
              default:
                return (
                  <div key={`e${y}-${x}`}>
                    <div
                      className={classnames(
                        "squareBackground",
                        moveHistory[moveHistory.length - 1]
                          ? (moveHistory[moveHistory.length - 1].from.y === y &&
                              moveHistory[moveHistory.length - 1].from.x ===
                                x) ||
                            (moveHistory[moveHistory.length - 1].to.y === y &&
                              moveHistory[moveHistory.length - 1].to.x === x)
                            ? "lastMove"
                            : ""
                          : ""
                      )}
                      ref={(el) => (refs.current[y * 8 + x] = el)}
                    >
                      <div className="dot"></div>
                    </div>
                  </div>
                );
            }
          });
        });
      else
        return board.map((row, y) => {
          return row.map((piece, x) => {
            switch (piece) {
              case 1:
                return (
                  <King
                    color="white"
                    key={`kh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </King>
                );
              case 2:
                return (
                  <Queen
                    color="white"
                    key={`qh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Queen>
                );
              case 3:
                return (
                  <Rook
                    color="white"
                    key={`rh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Rook>
                );
              case 4:
                return (
                  <Knight
                    color="white"
                    key={`nh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Knight>
                );
              case 5:
                return (
                  <Bishop
                    color="white"
                    key={`bh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Bishop>
                );
              case 6:
                return (
                  <Pawn
                    color="white"
                    key={`ph${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Pawn>
                );
              case 11:
                return (
                  <King
                    color="black"
                    key={`kh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </King>
                );
              case 12:
                return (
                  <Queen
                    color="black"
                    key={`qh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Queen>
                );
              case 13:
                return (
                  <Rook
                    color="black"
                    key={`rh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Rook>
                );
              case 14:
                return (
                  <Knight
                    color="black"
                    key={`nh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Knight>
                );
              case 15:
                return (
                  <Bishop
                    color="black"
                    key={`bh${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Bishop>
                );
              case 16:
                return (
                  <Pawn
                    color="black"
                    key={`ph${y}-${x}`}
                    position={{ x, y }}
                    history={true}
                    playing={props.playing}
                  >
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </Pawn>
                );
              default:
                return (
                  <div key={`eh${y}-${x}`}>
                    <div
                      className={classnames(
                        "squareBackground",
                        boardHistoryLive.index - 1 >= 0 &&
                          ((moveHistory[boardHistoryLive.index - 1].from.x ===
                            x &&
                            moveHistory[boardHistoryLive.index - 1].from.y ===
                              y) ||
                            (moveHistory[boardHistoryLive.index - 1].to.x ===
                              x &&
                              moveHistory[boardHistoryLive.index - 1].to.y ===
                                y))
                          ? "lastMove"
                          : ""
                      )}
                    ></div>
                  </div>
                );
            }
          });
        });
    },
    [
      canCastle,
      enPassant,
      props.playing,
      turn,
      place,
      enPassantMove,
      castles,
      refs,
      moveHistory.length,
      boardHistoryLive.index,
    ]
  );

  const promoteWrapper = () => {
    return (
      <div
        className={classnames(
          "promoteWrapper",
          props.playing === "black" ? "black" : ""
        )}
        style={{
          transform: `translate(${
            props.playing === "black"
              ? boardSize.width -
                boardSize.width / 8 -
                promote.newPos.x * (boardSize.width / 8) +
                tableRef.current.offsetLeft
              : promote.newPos.x * (boardSize.width / 8) +
                tableRef.current.offsetLeft
          }px, 0px)`,
        }}
      >
        <div
          onClick={() =>
            setPromote({
              ...promote,
              state: false,
              piece: props.playing === "black" ? 12 : 2,
            })
          }
        >
          Q
        </div>
        <div
          onClick={() =>
            setPromote({
              ...promote,
              state: false,
              piece: props.playing === "black" ? 14 : 4,
            })
          }
        >
          N
        </div>
        <div
          onClick={() =>
            setPromote({
              ...promote,
              state: false,
              piece: props.playing === "black" ? 13 : 3,
            })
          }
        >
          R
        </div>
        <div
          onClick={() =>
            setPromote({
              ...promote,
              state: false,
              piece: props.playing === "black" ? 15 : 5,
            })
          }
        >
          B
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (boardHistoryLive.state === null) {
      if (moveHistory[moveHistory.length - 2] && refs.current[0]) {
        refs.current[
          moveHistory[moveHistory.length - 2].from.y * 8 +
            moveHistory[moveHistory.length - 2].from.x
        ].classList.remove("lastMove");
        refs.current[
          moveHistory[moveHistory.length - 2].to.y * 8 +
            moveHistory[moveHistory.length - 2].to.x
        ].classList.remove("lastMove");
      }
      if (moveHistory[moveHistory.length - 1] && refs.current[0]) {
        refs.current[
          moveHistory[moveHistory.length - 1].from.y * 8 +
            moveHistory[moveHistory.length - 1].from.x
        ].classList.add("lastMove");
        refs.current[
          moveHistory[moveHistory.length - 1].to.y * 8 +
            moveHistory[moveHistory.length - 1].to.x
        ].classList.add("lastMove");
      }
    }
  }, [tableBoard, moveHistory.length, boardHistoryLive.state]);

  const hasMoved = useCallback(() => {
    moveSound.play();
    if (moveHistory.length !== 0) {
      if (turn !== props.playing) {
        socket.emit("chessMove", {
          from: props.auth.user.id,
          to: props.match.params.game,
          matchString,
          board,
          turn,
          enPassant,
          canCastle,
          captures,
          boardHistory,
          moveHistory,
        });
      }
    }
  }, [
    matchString,
    board,
    turn,
    enPassant,
    canCastle,
    boardHistory.length,
    moveHistory.length,
    props.auth.user.id,
    props.match.params.game,
  ]);

  const gameEnded = useCallback(
    (color, state) => {
      if (gameState.result === null) {
        setGameState({
          ...gameState,
          result:
            state === "checkmate"
              ? color === props.playing
                ? props.auth.user.id
                : props.match.params.game
              : state,
        });
        socket.emit("gameEnded", {
          _id: props.auth.user.id,
          opponentId: props.match.params.game,
          matchString,
          playing: props.playing,
          state,
          color,
        });
      }
    },
    [
      matchString,
      props.playing,
      props.auth.user.id,
      props.match.params.game,
      gameState,
    ]
  );

  useEffect(() => {
    if (boardHistoryLive.state === null) {
      if (matchString !== "") hasMoved();

      if (isDraw(_.cloneDeep(board), _.cloneDeep(boardHistory), turn)) {
        gameEnded(turn, "draw");
      } else if (checkIfKingIsInCheck(_.cloneDeep(board), turn)) {
        console.log("check");
        if (
          isCheckmateOrStalemate(_.cloneDeep(board), turn, enPassant[turn]) ===
          true
        ) {
          console.log(turn + " is checkmated");
          console.log(boardHistory);
          gameEnded(turn === "white" ? "black" : "white", "checkmate");
        }
      } else if (
        isCheckmateOrStalemate(_.cloneDeep(board), turn, enPassant[turn]) ===
        true
      ) {
        gameEnded(turn, "stalemate");
      }

      for (let i = 0; i < 64; i++) {
        if (refs.current[i]) refs.current[i].classList.remove("active", "take");
      }
    }

    if (opponent.name)
      setTableBoard(
        boardHistoryLive.state !== null
          ? mapBoard("history", boardHistoryLive.state)
          : mapBoard("live", board)
      );

    if (
      boardHistoryLive.state === null &&
      JSON.stringify(boardHistory[boardHistory.length - 1]) !==
        JSON.stringify(board)
    )
      setBoardHistory([...boardHistory, board]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(boardHistoryLive.state), JSON.stringify(board), opponent]);

  const grabbing = useCallback(
    (state, squares, pos, currPos, color) => {
      if (state === true) {
        refs.current[currPos.y * 8 + currPos.x].classList.add("lastMove");
        if (isDown.pos !== pos) setIsDown({ state: true, pos });
        squares.map((square) => {
          if (refs.current[square.y * 8 + square.x]) {
            if (
              (board[square.y][square.x] > 10 && turn === "white") ||
              (board[square.y][square.x] < 10 &&
                board[square.y][square.x] !== 0 &&
                turn === "black")
            ) {
              refs.current[square.y * 8 + square.x].classList.add(
                "active",
                "take"
              );
            } else if (color === turn)
              refs.current[square.y * 8 + square.x].classList.add("active");
          }
        });
      } else {
        if (!moveHistory[moveHistory.length - 1])
          refs.current[currPos.y * 8 + currPos.x].classList.remove("lastMove");
        else if (
          currPos.y !== moveHistory[moveHistory.length - 1].to.y ||
          currPos.x !== moveHistory[moveHistory.length - 1].to.x
        )
          refs.current[currPos.y * 8 + currPos.x].classList.remove("lastMove");
        squares.map((square) => {
          if (refs.current[square.y * 8 + square.x])
            refs.current[square.y * 8 + square.x].classList.remove(
              "active",
              "take"
            );
        });
        setIsDown({ state: false, pos: { x: 0, y: 0 } });
      }
    },
    [refs.current, JSON.stringify(board), turn, isDown, moveHistory.length]
  ); 

  return (
    <div className="chessboardWrapper">
      <div className="chessboard">
        {promote.state === true ? promoteWrapper() : null}
        {getNotation()}
        {gameState.result !== null ? (
          <div className="newGame">
            <div className="newGameBox">
              <div className="newGameResult">
                {
                gameState.result === "draw" ? "DRAW" :
                gameState.result === "stalemate" ? "STALEMATE" :
                gameState.result === props.auth.user.id
                  ? `${props.playing} is victorious`.toUpperCase()
                  : props.playing === "white"
                  ? "BLACK IS VICTORIOUS"
                  : "WHITE IS VICTORIOUS"}
              </div>
              <div className="newGameActions">
                <button
                  onClick={
                    gameState.invited
                      ? !gameState.invited.includes(props.auth.user.id)
                        ? 
                        () => {
                            socket.emit("newGameInvite", {
                              _id: props.auth.user.id,
                              matchString,
                              opponentId: props.match.params.game,
                            });
                          }
                        : null
                      : null
                  }
                >
                  {gameState.invited
                    ? gameState.invited.includes(props.auth.user.id)
                      ? "Opponent invited"
                      : gameState.invited.includes(props.match.params.game)
                      ? "Accept rematch"
                      : "Invite for rematch"
                    : null}
                </button>
                <button>
                  <Link to={"/app/messages/" + props.match.params.game}>
                    Close
                  </Link>
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div
          ref={tableRef}
          style={{
            height: boardSize.height + "px",
            width: boardSize.width + "px",
            fontSize: Math.round(0.825 * (boardSize.width / 8)),
          }}
          className={classnames(
            "mainBoard",
            props.playing === "black" ? "black" : ""
          )}
        >
          <div
            className="hoverSquare"
            style={
              isDown.state === true
                ? {
                    zIndex: 10,
                    transform: `translate(${
                      isDown.pos.x * (boardSize.width / 8)
                    }px, ${isDown.pos.y * (boardSize.width / 8)}px)`,
                  }
                : { display: "none" }
            }
          ></div>
          {tableBoard}
        </div>
        <div className="playerInfo enemy">
          <div
            className="playerImg"
            style={{ backgroundImage: `url(${opponent.profileImg})` }}
          />
          <div>
            <div className="playerName">{opponent.name}</div>
            <div
              className={classnames(
                "captures enemy",
                props.playing === "white" ? "" : "black"
              )}
            >
              {props.playing === "white"
                ? getCaptures(captures.black, captures.white)
                : getCaptures(captures.white, captures.black)}
            </div>
          </div>
        </div>
        <div className="playerInfo">
          <div
            className="playerImg"
            style={{ backgroundImage: `url(${props.auth.user.profileImg})` }}
          />
          <div>
            <div className="playerName">{props.auth.user.name}</div>
            <div
              className={classnames(
                "captures",
                props.playing === "white" ? "black" : ""
              )}
            >
              {props.playing === "white"
                ? getCaptures(captures.white, captures.black)
                : getCaptures(captures.black, captures.white)}
            </div>
          </div>
        </div>
      </div>
      <div className="chessSidebar">
        <div className="moveHistory">
          {formatMoves(
            moveHistory,
            (i) => setLiveHistoryBoard(i),
            () => setLiveBoard()
          )}
        </div>
        <div className="chessActions">
          <button>Resign</button>
          <button>Offer a draw</button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(Board));
