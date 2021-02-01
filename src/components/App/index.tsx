import React, { useEffect, useState } from "react";
import NumberDisplay from "src/components/NumberDisplay";
import Button from "src/components/Button";
import GameSetting from "src/components/Setting";

import { generateCells, openMultipleCells } from "src/utils";
import { Face, Cell, CellState, CellValue } from "src/types";
import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from "src/constants";

import "./App.scss";

interface GameSettingState {
  [key: string]: number;
  bombs: number;
  rows: number;
  cols: number;
}

const App: React.FC = () => {
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [isLose, setIsLose] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [gameSettingData, setGameSettingData] = useState<GameSettingState>({
    bombs: NO_OF_BOMBS,
    rows: MAX_ROWS,
    cols: MAX_COLS,
  });
  const [bombCounter, setBombCounter] = useState<number>(gameSettingData.bombs);
  const [cells, setCells] = useState<Cell[][]>(
    generateCells(
      gameSettingData.rows,
      gameSettingData.cols,
      gameSettingData.bombs
    )
  );

  useEffect(() => {
    if (live) {
      const timer = setInterval(() => setTime(time + 1), 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  useEffect(() => {
    if (isLose) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [isLose]);

  useEffect(() => {
    if (isWin) {
      setLive(false);
      setFace(Face.won);
    }
  }, [isWin]);

  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (!live) {
      // if not live, then cant right click
      return;
    }

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (isWin || isLose) {
      return;
    }
    let newCells = cells.slice();
    // Start the game
    if (!live) {
      let isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
      while (isBomb) {
        newCells = generateCells(
          gameSettingData.rows,
          gameSettingData.cols,
          gameSettingData.bombs
        );
        if (newCells[rowParam][colParam].value !== CellValue.bomb) {
          isBomb = false;
          break;
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setIsLose(true);
      newCells[rowParam][colParam].red = true;
      newCells = _showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam,
        gameSettingData.rows,
        gameSettingData.cols
      );
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    // Check win conditions
    let isSafeOpenCellsExist = false;
    for (let row = 0; row < gameSettingData.rows; row++) {
      for (let col = 0; col < gameSettingData.cols; col++) {
        const currentCell = newCells[row][col];
        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          isSafeOpenCellsExist = true;
          break;
        }
      }
    }
    // Won!
    if (!isSafeOpenCellsExist) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setIsWin(true);
    }
    setCells(newCells);
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(
      generateCells(
        gameSettingData.rows,
        gameSettingData.cols,
        gameSettingData.bombs
      )
    );
    setFace(Face.smile);
    setIsLose(false);
    setBombCounter(gameSettingData.bombs);
    setIsWin(false);
  };

  const handleBtnClickChangeFace = (face: Face): void => {
    if (isWin || isLose) {
      return;
    }
    setFace(face);
  };

  const handleSettingBtnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setIsOpenSetting(true);
  };

  const handleSettingSaveBtnClick = (
    newGameSetting: GameSettingState
  ): void => {
    if (
      newGameSetting.bombs > 0 &&
      newGameSetting.rows >= 9 &&
      newGameSetting.cols >= 9 &&
      newGameSetting.rows <= 20 &&
      newGameSetting.cols <= 20 &&
      newGameSetting.rows * newGameSetting.cols > newGameSetting.bombs
    ) {
      setGameSettingData(newGameSetting);
      setIsOpenSetting(false);
      setLive(false);
      setTime(0);
      console.log("handle setting save");
      setCells(
        generateCells(
          newGameSetting.rows,
          newGameSetting.cols,
          newGameSetting.bombs
        )
      );
      setIsLose(false);
      setBombCounter(newGameSetting.bombs);
      setIsWin(false);
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          red={cell.red}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
          onMouseClick={handleBtnClickChangeFace}
        />
      ))
    );
  };

  const renderGameSetting = (): React.ReactNode => {
    return (
      <GameSetting
        settingdata={gameSettingData}
        handleSave={handleSettingSaveBtnClick}
      />
    );
  };

  // private functions
  const _showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return { ...cell, state: CellState.visible };
        }
        return cell;
      })
    );
  };

  return (
    <div className="Game">
      <div className="Control">
        <button onClick={handleSettingBtnClick}>Game</button>
      </div>
      <div className="App">
        <div className="Header">
          <NumberDisplay value={bombCounter} />
          <div className="Face">
            <span role="img" aria-label="face" onClick={handleFaceClick}>
              {face}
            </span>
          </div>
          <NumberDisplay value={time} />
        </div>
        <div
          className="Body"
          style={{
            gridTemplateRows: `repeat(${gameSettingData.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${gameSettingData.cols}, 1fr)`,
          }}
        >
          {renderCells()}
        </div>
      </div>
      {isOpenSetting ? renderGameSetting() : null}
    </div>
  );
};

export default App;
