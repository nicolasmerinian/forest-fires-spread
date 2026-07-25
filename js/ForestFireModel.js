export default class ForestFireModel {
    constructor(size, treeDensity = 0.55) {
        this.size = size;
        this.treeDensity = treeDensity;

        this.cellState = {
            EMPTY: 0,
            ASH: 1,
            FIRE: 2,
            TREE: 3
        };

        this.cellFuel = {
            TREE: 3
        }

        this.cells = this.createGrid();
        this.cellsOld = this.createGrid();
        this.fuel = this.createGrid();

        this.initCells();
    }

    createGrid() {
        return new Uint8Array(this.size * this.size);
    }

    getIndex(x, y) {
        return y * this.size + x;
    }

    initCells() {
        const trees = [];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const index = this.getIndex(x, y);

                if (Math.random() < this.treeDensity) {
                    this.cells[index] = this.cellState.TREE;
                    trees.push({ x, y });
                }
            }
        }

        const fire = trees[Math.floor(Math.random() * trees.length)];
        const index = this.getIndex(fire.x, fire.y);
        this.cells[index] = this.cellState.FIRE;
        this.fuel[index] = this.cellFuel.TREE;
    }

    update() {
        [this.cells, this.cellsOld] = [this.cellsOld, this.cells];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const index = this.getIndex(x, y);
                const state = this.cellsOld[index];

                switch (state) {
                    case this.cellState.ASH:
                        this.cells[index] = this.cellState.ASH;
                        break;

                    case this.cellState.EMPTY:
                        this.cells[index] = this.cellState.EMPTY;
                        break;

                    case this.cellState.FIRE:
                        if (this.fuel[index] > 0) {
                            this.fuel[index] -= 1;
                            this.cells[index] = this.cellState.FIRE;
                        } 
                        else {
                            this.cells[index] = this.cellState.ASH;
                        }
                        break;

                    case this.cellState.TREE:
                        if (this.hasFireNeighbour(x, y)) {
                            this.cells[index] = this.cellState.FIRE;
                            this.fuel[index] = this.cellFuel.TREE;
                        }
                        else {
                            this.cells[index] = this.cellState.TREE;
                        }
                        break;
                }
            }
        }
    }

    hasFireNeighbour(x, y) {
        return this.getNeighboursNumber(
            x,
            y,
            this.cellState.FIRE
        ) > 0;
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