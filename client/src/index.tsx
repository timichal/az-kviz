import * as React from "react";
import { render } from "react-dom";
import { createContainer } from "react-tracked";

const { useState, useEffect, useRef, useReducer } = React;

interface field {
  x: number;
  y: number;
  state: number;
}

enum fieldStateEnum {
  UNTOUCHED,
  PLAYER_1,
  PLAYER_2,
  CONTESTED,
}

const initialGlobalState = {
  fields: [
    { x: 3, y: 0, state: fieldStateEnum.UNTOUCHED },
    { x: 2, y: 1, state: fieldStateEnum.UNTOUCHED },
    { x: 3, y: 1, state: fieldStateEnum.UNTOUCHED },
    { x: 2, y: 2, state: fieldStateEnum.UNTOUCHED },
    { x: 3, y: 2, state: fieldStateEnum.UNTOUCHED },
    { x: 4, y: 2, state: fieldStateEnum.UNTOUCHED },
    { x: 1, y: 3, state: fieldStateEnum.UNTOUCHED },
    { x: 2, y: 3, state: fieldStateEnum.PLAYER_2 },
    { x: 3, y: 3, state: fieldStateEnum.UNTOUCHED },
    { x: 4, y: 3, state: fieldStateEnum.UNTOUCHED },
    { x: 1, y: 4, state: fieldStateEnum.UNTOUCHED },
    { x: 2, y: 4, state: fieldStateEnum.UNTOUCHED },
    { x: 3, y: 4, state: fieldStateEnum.UNTOUCHED },
    { x: 4, y: 4, state: fieldStateEnum.UNTOUCHED },
    { x: 5, y: 4, state: fieldStateEnum.UNTOUCHED },
    { x: 0, y: 5, state: fieldStateEnum.UNTOUCHED },
    { x: 1, y: 5, state: fieldStateEnum.UNTOUCHED },
    { x: 2, y: 5, state: fieldStateEnum.PLAYER_1 },
    { x: 3, y: 5, state: fieldStateEnum.UNTOUCHED },
    { x: 4, y: 5, state: fieldStateEnum.UNTOUCHED },
    { x: 5, y: 5, state: fieldStateEnum.UNTOUCHED },
    { x: 0, y: 6, state: fieldStateEnum.UNTOUCHED },
    { x: 1, y: 6, state: fieldStateEnum.UNTOUCHED },
    { x: 2, y: 6, state: fieldStateEnum.UNTOUCHED },
    { x: 3, y: 6, state: fieldStateEnum.UNTOUCHED },
    { x: 4, y: 6, state: fieldStateEnum.UNTOUCHED },
    { x: 5, y: 6, state: fieldStateEnum.UNTOUCHED },
    { x: 6, y: 6, state: fieldStateEnum.UNTOUCHED },
  ],
  playerTurn: 1, // 1 or 2
};
const useValue = () => useReducer(
  (state: any, newValue: any) => ({ ...state, ...newValue }),
  initialGlobalState,
);
const { Provider, useTracked } = createContainer(useValue);
const GlobalStateProvider = ({ children }: { children: any }) => <Provider useValue={useValue}>{children}</Provider>;


const makeBoard = (ctx: any, fields: field[]) => {
  const hexagonAngle = 0.523598776; // 30 degrees in radians
  const sideLength = 36;
  const hexHeight = Math.sin(hexagonAngle) * sideLength;
  const hexRadius = Math.cos(hexagonAngle) * sideLength;
  const hexRectangleHeight = sideLength + 2 * hexHeight;
  const hexRectangleWidth = 2 * hexRadius;

  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#CCCCCC";
  ctx.lineWidth = 1;

  function drawHexagon(canvasContext: any, x: any, y: any, state: number) {
    canvasContext.beginPath();
    canvasContext.moveTo(x + hexRadius, y);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
    canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
    canvasContext.lineTo(x, y + sideLength + hexHeight);
    canvasContext.lineTo(x, y + hexHeight);
    canvasContext.closePath();

    if (state === fieldStateEnum.UNTOUCHED) {
      canvasContext.stroke();
    } else if (state === fieldStateEnum.PLAYER_1) {
      ctx.fillStyle = "#ff0000";
      canvasContext.fill();
    } else if (state === fieldStateEnum.PLAYER_2) {
      ctx.fillStyle = "#00ff00";
      canvasContext.fill();
    }
  }

  const drawBoard = (canvasContext: any, fields: field[]) => {
    fields.map(({ x, y, state }: field) => {
      drawHexagon(
        canvasContext,
        x * hexRectangleWidth + ((y % 2) * hexRadius),
        y * (sideLength + hexHeight),
        state,
      );
    });
  };

  drawBoard(ctx, fields);
};

const Board = () => {
  const [state, dispatch] = useTracked();
  const { fields } = state;
  const canvas = useRef(null);
  useEffect(() => makeBoard(canvas.current.getContext("2d"), fields));
  return <canvas ref={canvas} width="660" height="624" />;
};

const Header = () => {
  const [state, dispatch] = useTracked();
  const { playerTurn, fields } = state;
  return (
    <>
      <div>
        {`Hraje hráč ${playerTurn}.`}
      </div>
      <button onClick={() => dispatch({ fields: [ ...fields ] })}>Klik!</button>
    </>
  );
}

const App = (
  <GlobalStateProvider>
    <Header />
    <Board />
  </GlobalStateProvider>
);

render(App, document.getElementById("app"));

/*
const Cell = ({ value, id, changeValue }: { value: number, id: number, changeValue: any }) => {
  let cellClass = "";
  if (value === fieldStateEnum.PLAYER_1) cellClass = "cell--player1";
  if (value === fieldStateEnum.PLAYER_2) cellClass = "cell--player2";
  return (
    <div
      className={cellClass ? `cell ${cellClass}` : "cell"}
      onClick={() => console.log("clicked", id)}
    />
  );
};

const GameBoard = () => {
  // there are 1+2+3+4+5+6+7=28 fields
  const [fields, setFields] = useState(new Array(28).fill(fieldStateEnum.PLAYER_1));
  const [player, changePlayer] = useState(1);
  console.log(Object.values(fields));

  return (
    <>
      <div>{`Na tahu hráč ${player}`}</div>
      <div className="field">
        {fields.map((field, index) => <Cell value={field} id={index} changeValue={setFields} />)}
      </div>
    </>
  );
};
*/
