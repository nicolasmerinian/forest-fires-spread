export default class FF {
    constructor(rowAndColNumber, cellSize, treeDensity = 0.55, simulationSpeed) {
        this.rowAndColNumber = rowAndColNumber; // number of rows and columns in the grid
        this.cellSize = cellSize; // size of each cell in pixels
        this.treeDensity = treeDensity; // probability of a cell being a tree
        this.simulationSpeed = simulationSpeed; // ms between calculations
        this.lastUpdate = 0;

        this.createCanvas();
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.size = rowAndColNumber;

        this.init();
    }

    createCanvas() {
        const container = document.getElementById('container');
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', this.rowAndColNumber * this.cellSize);
        this.canvas.setAttribute('height', this.rowAndColNumber * this.cellSize);
        this.canvas.style.border = '1px solid #000';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '1px';
        this.canvas.id = 'canvas';
        container.appendChild(this.canvas);
    }

    init() {
        this.animationFrame = null;
        this.lastUpdate = 0;
        this.cells = this.createGrid();
        this.cellsOld = this.createGrid();
        this.steps = 0;
        this.cellColor = ['#000', '#5D2', '#521', '#F50']; // #f5d9e8
        this.cellState = { 'EMPTY': 0, 'TREE': 1, 'ASH': 2, 'FIRE': 3 };
        this.initCells();
        this.run();
    }

    createGrid() {
        return new Uint8Array(this.size * this.size);
    }

    getIndex(x, y) {
        return y * this.size + x;
    }

    initCells() {
        const trees = [];
        const emptyCells = [];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {

                const index = this.getIndex(x, y);
                const rand = Math.random();

                if (rand < this.treeDensity) {
                    this.cells[index] = this.cellState.TREE;
                    trees.push({ x, y });
                } else {
                    this.cells[index] = this.cellState.EMPTY;
                    emptyCells.push({ x, y });
                }
            }
        }

        const fireCell = trees[Math.floor(Math.random() * trees.length)];
        if (fireCell) {
            this.cells[this.getIndex(fireCell.x, fireCell.y)] = this.cellState.FIRE;
        }
    }

    run(timestamp) {
        if (timestamp - this.lastUpdate >= this.simulationSpeed) {
            this.calc();
            this.steps += 1;
            this.lastUpdate = timestamp;
        }

        this.draw();

        this.animationFrame = requestAnimationFrame((timestamp) => {
            this.run(timestamp);
        });
    }

    stop() {
        cancelAnimationFrame(this.animationFrame);
    }

    draw() {
        this.clear();
        this.drawCells();
        // this.drawBoard();
    }

    clear() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBoard() {
        this.ctx.strokeStyle = '#000';
        this.ctx.beginPath();

        for (let x = 0; x < this.size; x++) {
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.height);
        }

        for (let y = 0; y < this.size; y++) {
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.width, y * this.cellSize);
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawCells() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {

                const index = this.getIndex(x, y);
                const currentCellValue = this.cells[index];

                this.drawCell(
                    x,
                    y,
                    this.cellColor[currentCellValue]
                );
            }
        }
    }

    drawCell(x, y, color) {
        const cx = x * this.cellSize;
        const cy = y * this.cellSize;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(cx, cy, this.cellSize, this.cellSize);
    }

    calc() {
        let fireNeightboursNumber;
        let treeNeightboursNumber;
        let currentCellState;

        [this.cells, this.cellsOld] = [this.cellsOld, this.cells];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {

                const index = this.getIndex(x, y);

                currentCellState = this.cellsOld[index];
                fireNeightboursNumber = this.getNeighboursNumber(x, y, this.cellState.FIRE);
                treeNeightboursNumber = this.getNeighboursNumber(x, y, this.cellState.TREE);

                switch (currentCellState) {
                    case this.cellState.FIRE:
                        this.cells[this.getIndex(x, y)] = this.cellState.ASH;
                        break;
                    case this.cellState.TREE:
                        if (fireNeightboursNumber !== 0) {
                            this.cells[index] = this.cellState.FIRE;
                        } else {
                            this.cells[index] = this.cellState.TREE;
                        }
                        break;
                    case this.cellState.ASH:
                        this.cells[index] = this.cellState.ASH;
                        break;
                    case this.cellState.EMPTY:
                        this.cells[index] = this.cellState.EMPTY;
                        break;
                    default:
                        this.cells[index] = currentCellState;
                }
            }
        }
    }

    getNeighboursNumber(x, y, state) {
        const directions = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0], [1, 0],
            [-1, 1], [0, 1], [1, 1]
        ];

        let numberOfNeighbours = 0;

        for (const [dx, dy] of directions) {
            const neighbourX = x + dx;
            const neighbourY = y + dy;

            if (
                neighbourX >= 0 &&
                neighbourX < this.size &&
                neighbourY >= 0 &&
                neighbourY < this.size
            ) {
                if (this.hasState(neighbourX, neighbourY, state)) {
                    numberOfNeighbours += 1;
                }
            }
        }

        return numberOfNeighbours;
    }

    hasState(x, y, state) {
        return this.cellsOld[this.getIndex(x, y)] === state;
    }
}
