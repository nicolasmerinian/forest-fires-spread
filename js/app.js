import FF from "./ff.js";

const rowAndColNumber = 200; // default : 100
const cellSize = 3; // default : 7
const p = 0.55;  // default and threshold: 0.55
const firemenNumber = 0;
const simulationSpeed = 10; // default : 100

const ff = new FF(rowAndColNumber, cellSize, p, firemenNumber, simulationSpeed);
