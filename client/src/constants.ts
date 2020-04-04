// board constants
const HEXAGON_ANGLE = 0.523598776; // 30 degrees in radians
export const SIDE_LENGTH = 36;
export const HEX_HEIGHT = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
export const HEX_RADIUS = Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH;
export const HEX_RECTANGLE_HEIGHT = SIDE_LENGTH + 2 * HEX_HEIGHT;
export const HEX_RECTANGLE_WIDTH = 2 * HEX_RADIUS;

export const FIELD_COORDS = [
  [3, 0],
  [2, 1], [3, 1],
  [2, 2], [3, 2], [4, 2],
  [1, 3], [2, 3], [3, 3], [4, 3],
  [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
];
