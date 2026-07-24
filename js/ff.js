export default class FF {
    constructor(rowAndColNumber, cellSize, speed = 1, p = 0.55, firemenNumber = 0) {
        this.rowAndColNumber = rowAndColNumber;
        this.cellSize = cellSize;
        this.speed = speed;
        this.p = p;
        this.firemenNumber = firemenNumber;

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
        this.cells = null;
        this.cellsOld = null;
        this.steps = 0;
        this.cellColor = ['#000', '#5D2', '#521', '#F50', '#2ea8dc', '#F0F']; // #f5d9e8
        this.cellState = { 'EMPTY': 0, 'TREE': 1, 'ASH': 2, 'FIRE': 3, 'FIREMAN': 4, 'WET': 5 };
        this.initCells();
        this.run();
    }

    initCells() {
        this.cells = [];
        let subArray;
        const trees = [];
        const emptyCells = [];

        for (let j = 0; j < this.size; j++) {
            subArray = [];
            for (let i = 0; i < this.size; i++) {
                subArray.push(0);
            }
            this.cells.push(subArray);
        }

        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                const rand = Math.random();

                if (rand < this.p) {
                    this.cells[y][x] = this.cellState.TREE;
                    trees.push({ x, y });
                } else {
                    this.cells[y][x] = this.cellState.EMPTY;
                    emptyCells.push({ x, y });
                }
            }
        }

        const fireCell = trees[Math.floor(Math.random() * trees.length)];
        this.cells[fireCell.y][fireCell.x] = this.cellState.FIRE;

        for (let k = 0; k < this.firemenNumber; k++) {
            const fireman = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.cells[fireman][i][fireman][j] = this.cellState.FIREMAN;
        }
    }

    run() {
        this.draw();

        for (let i = 0; i < this.speed; i++) {
            this.calc();
            this.steps += 1;
        }

        this.animationFrame = requestAnimationFrame(() => {
            this.run();
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
        for (let i = 0; i < this.size; i++) {
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.height);
        }
        for (let j = 0; j < this.size; j++) {
            this.ctx.moveTo(0, j * this.cellSize);
            this.ctx.lineTo(this.width, j * this.cellSize);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawCells() {
        let currentCellValue;
        for (let j = 0; j < this.cells.length; j++) {
            for (let i = 0; i < this.cells[j].length; i++) {
                currentCellValue = this.cells[j][i];
                this.drawCell(i, j, this.cellColor[currentCellValue]);
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
        let firemanNeightboursNumber;
        let currentCellState;

        this.prepareData();

        for (let j = 0; j < this.cellsOld.length; j++) {
            for (let i = 0; i < this.cellsOld[j].length; i++) {
                fireNeightboursNumber = this.getNeighboursNumber(j, i, this.cellState.FIRE);
                treeNeightboursNumber = this.getNeighboursNumber(j, i, this.cellState.TREE);
                firemanNeightboursNumber = this.getNeighboursNumber(j, i, this.cellState.FIREMAN);
                currentCellState = this.cellsOld[j][i];

                if (currentCellState === this.cellState.WET) {
                    this.cells[j][i] = this.cellState.EMPTY;
                }
                else if (currentCellState === this.cellState.FIRE) {
                    if (firemanNeightboursNumber === 0) {
                        this.cells[j][i] = this.cellState.ASH;
                    }
                    else {
                        this.cells[j][i] = this.cellState.FIREMAN;
                    }
                }
                else if (currentCellState === this.cellState.FIREMAN) {
                    if (fireNeightboursNumber > 0 && fireNeightboursNumber < 4) {
                        this.cells[j][i] = this.cellState.WET;
                    }
                    else if (fireNeightboursNumber > 5) {
                        this.cells[j][i] = this.cellState.FIRE;
                    }
                }
                else if (currentCellState === this.cellState.TREE) {
                    if (fireNeightboursNumber !== 0) {
                        this.cells[j][i] = this.cellState.FIRE;
                    }
                }
            }
        }
    }

    prepareData() {
        this.cellsOld = [];
        let subArray;
        for (let j = 0; j < this.size; j++) {
            subArray = [];
            for (let i = 0; i < this.size; i++) {
                subArray.push(0);
            }
            this.cellsOld.push(subArray);
        }
        for (let j = 0; j < this.cellsOld.length; j++) {
            for (let i = 0; i < this.cellsOld[j].length; i++) {
                this.cellsOld[j][i] = this.cells[j][i];
            }
        }
    }

    getNeighboursNumber(j, i, state) {
        let numberOfNeightbours = 0;
        let neightbourValue;
        // Top left
        if (i - 1 >= 0 && j - 1 >= 0) {
            if (this.hasState(i - 1, j - 1, state)) {
                numberOfNeightbours += 1;
            }
        }
        // Top
        if (j - 1 >= 0) {
            if (this.hasState(i, j - 1, state)) {
                numberOfNeightbours += 1;
            }
        }
        // Top right
        if (i + 1 < this.size && j - 1 >= 0) {
            if (this.hasState(i + 1, j - 1, state)) {
                numberOfNeightbours += 1;
            }
        }
        // Center left
        if (i - 1 >= 0) {
            if (this.hasState(i - 1, j, state)) {
                numberOfNeightbours += 1;
            }
        }
        // No center
        // Center right
        if (i + 1 <= this.size) {
            if (this.hasState(i + 1, j, state)) {
                numberOfNeightbours += 1;
            }
        }
        // Bottom left
        if (i - 1 >= 0 && j + 1 < this.size) {
            if (this.hasState(i - 1, j + 1, state)) {
                numberOfNeightbours += 1;
            }
        }
        // Bottom
        if (j + 1 < this.size) {
            if (this.hasState(i, j + 1, state)) {
                numberOfNeightbours += 1;
            }
        }
        // Bottom right
        if (i + 1 <= this.size && j + 1 < this.size) {
            if (this.hasState(i + 1, j + 1, state)) {
                numberOfNeightbours += 1;
            }
        }
        return numberOfNeightbours;
    }

    hasState(i, j, state) {
        const cellValue = this.cellsOld[j][i];
        return cellValue === state;
    }
}
