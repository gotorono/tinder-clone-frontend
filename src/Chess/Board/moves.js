import { getMovePosition } from './position';

export const formatMoves = (moveHistory, setBoardMove, setLiveBoard) => {
    return moveHistory.map((move, i) => (
        i % 2 === 0 ?
        <div className="move">
                <span className="moveNumber">{(i + 2) / 2 + "."}</span>
            {i % 2 === 0 ?
            <div className="whiteMove">
              <span onClick={i === moveHistory.length - 1 ? () => setLiveBoard() : () => setBoardMove(i + 1)}>
            {move.side === "kingside"
              ? "O-O"
              : move.side === "queenside"
              ? "O-O-O"
              : getMovePosition(
                  move.take,
                  move.includePosition,
                  move.piece,
                  move.from.x,
                  move.from.y,
                  move.to.x,
                  move.to.y,
                  move.check,
                  move.checkMate,
                  move.promote
                )}
                </span>
            </div>
            : null}
            {moveHistory[i + 1] && i % 2 === 0 ? <div className="blackMove"><span onClick={i + 1 === moveHistory.length - 1 ? () => setLiveBoard() : () => setBoardMove(i + 2)}>{moveHistory[i + 1].side === "kingside"
              ? "O-O"
              : moveHistory[i + 1].side === "queenside"
              ? "O-O-O"
              : getMovePosition(
                moveHistory[i + 1].take,
                moveHistory[i + 1].includePosition,
                moveHistory[i + 1].piece,
                moveHistory[i + 1].from.x,
                moveHistory[i + 1].from.y,
                moveHistory[i + 1].to.x,
                moveHistory[i + 1].to.y,
                moveHistory[i + 1].check,
                moveHistory[i + 1].checkMate,
                moveHistory[i + 1].promote
                )}</span></div> : null}
        </div> : null
    ))
}