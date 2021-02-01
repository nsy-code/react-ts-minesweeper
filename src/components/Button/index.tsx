import React from "react";
import { CellState, CellValue, Face, BtnIcon } from "src/types";
import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
  onMouseClick(face: Face): void;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  red,
  onClick,
  onContext,
  onMouseClick,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span role="img" aria-label="bomb">
            {BtnIcon.bomb}
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      }
      return value;
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="flag">
          {BtnIcon.flag}
        </span>
      );
    }
    return null;
  };

  const handleMouseDownEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    onMouseClick(Face.oh);
  };

  const handleMouseUpEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
    onMouseClick(Face.smile);
  };

  return (
    <div
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value} ${red ? "red" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
      onMouseDown={handleMouseDownEvent}
      onMouseUp={handleMouseUpEvent}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
