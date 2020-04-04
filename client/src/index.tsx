import * as React from "react";
import { render } from "react-dom";
import { createContainer } from "react-tracked";
import { FieldStateEnum, PlayerTurnEnum } from "./enums";
import {
  SIDE_LENGTH, HEX_HEIGHT, HEX_RADIUS, HEX_RECTANGLE_HEIGHT, HEX_RECTANGLE_WIDTH, FIELD_COORDS,
} from "./constants";

const { useEffect, useRef, useReducer } = React;

interface field {
  x: number;
  y: number;
  state: number;
}

const initialGlobalState = {
  fields: FIELD_COORDS.map(([x, y]) => ({ x, y, state: FieldStateEnum.UNTOUCHED })),
  playerTurn: PlayerTurnEnum.PLAYER_1,
};

const reducer = (state: any, action: any) => {
  const { playerTurn, fields } = state;
  switch (action.type) {
    case "playerChange":
      if (playerTurn === PlayerTurnEnum.PLAYER_1) return { ...state, playerTurn: PlayerTurnEnum.PLAYER_2 };
      return { ...state, playerTurn: PlayerTurnEnum.PLAYER_1 };
    case "fieldChange": {
      const { newField } = action;
      const { x, y } = newField;
      return {
        ...state,
        fields: [...fields.filter((field: field) => field.x !== x || field.y !== y), newField],
      };
    }
    default: throw new Error(`unknown action type: ${action.type}`);
  }
};
const useValue = () => useReducer(reducer, initialGlobalState);

const { Provider, useTracked } = createContainer(useValue);

const makeBoard = (ctx: any, fields: field[]) => {
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#CCCCCC";
  ctx.lineWidth = 1;

  const drawHexagon = (canvasContext: any, x: any, y: any, state: number) => {
    canvasContext.beginPath();
    canvasContext.moveTo(x + HEX_RADIUS, y);
    canvasContext.lineTo(x + HEX_RECTANGLE_WIDTH, y + HEX_HEIGHT);
    canvasContext.lineTo(x + HEX_RECTANGLE_WIDTH, y + HEX_HEIGHT + SIDE_LENGTH);
    canvasContext.lineTo(x + HEX_RADIUS, y + HEX_RECTANGLE_HEIGHT);
    canvasContext.lineTo(x, y + SIDE_LENGTH + HEX_HEIGHT);
    canvasContext.lineTo(x, y + HEX_HEIGHT);
    canvasContext.closePath();

    if (state === FieldStateEnum.UNTOUCHED) {
      canvasContext.stroke();
    } else if (state === FieldStateEnum.PLAYER_1) {
      ctx.fillStyle = "#ff0000";
      canvasContext.fill();
    } else if (state === FieldStateEnum.PLAYER_2) {
      ctx.fillStyle = "#00ff00";
      canvasContext.fill();
    }
  }

  const drawBoard = (canvasContext: any, fields: field[]) => {
    fields.map(({ x, y, state }: field) => {
      drawHexagon(
        canvasContext,
        x * HEX_RECTANGLE_WIDTH + ((y % 2) * HEX_RADIUS),
        y * (SIDE_LENGTH + HEX_HEIGHT),
        state,
      );
    });
  };

  drawBoard(ctx, fields);
};

const Board = () => {
  const [state, dispatch] = useTracked();
  const { fields, playerTurn } = state;
  const onClick = (e: MouseEvent) => {
    const [x, y] = [e.offsetX, e.offsetY];
    const hexY = Math.floor(y / (HEX_HEIGHT + SIDE_LENGTH));
    const hexX = Math.floor((x - (hexY % 2) * HEX_RADIUS) / HEX_RECTANGLE_WIDTH);
    const fieldIdxToChange = fields.findIndex((field: field) => (
      field.x === hexX
      && field.y === hexY
      && [FieldStateEnum.UNTOUCHED, FieldStateEnum.CONTESTED].includes(field.state)
    ));
    if (fieldIdxToChange >= 0) {
      dispatch({
        type: "fieldChange",
        newField: {
          x: hexX,
          y: hexY,
          state: playerTurn === PlayerTurnEnum.PLAYER_1 ? FieldStateEnum.PLAYER_1 : FieldStateEnum.PLAYER_2,
        },
      });
      dispatch({ type: "playerChange" });
    }
  };

  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => makeBoard(canvas.current?.getContext("2d"), fields));
  return <canvas ref={canvas} onClick={(e) => onClick(e.nativeEvent)} width="660" height="624" />;
};

const Header = () => {
  const [state] = useTracked();
  const { playerTurn } = state;
  return (
    <>
      <div>
        {`Hraje hráč ${playerTurn}.`}
      </div>
    </>
  );
}

const App = (
  <Provider useValue={useValue}>
    <Header />
    <Board />
  </Provider>
);

render(App, document.getElementById("app"));
