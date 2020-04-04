// board constants
const HEXAGON_ANGLE = 0.523598776; // 30 degrees in radians
export const SIDE_LENGTH = 36;
export const HEX_HEIGHT = Math.sin(HEXAGON_ANGLE) * SIDE_LENGTH;
export const HEX_RADIUS = Math.cos(HEXAGON_ANGLE) * SIDE_LENGTH;
export const HEX_RECTANGLE_HEIGHT = SIDE_LENGTH + 2 * HEX_HEIGHT;
export const HEX_RECTANGLE_WIDTH = 2 * HEX_RADIUS;
