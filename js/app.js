import FF from "./ff.js";

const rowAndColNumber = 150; // default : 100
const cellSize = 4; // default : 7
const p = 0.45;  // default and threshold: 0.55
const firemenNumber = 0;
const simulationSpeed = 100; // default : 100

const ff = new FF(rowAndColNumber, cellSize, p, firemenNumber, simulationSpeed);
