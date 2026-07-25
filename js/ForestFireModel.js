export default class ForestFireModel {
    constructor(size, treeDensity = 0.55) {
        this.size = size;
        this.treeDensity = treeDensity;

        this.cellState = {
            EMPTY: 0,
            TREE: 1,
            ASH: 2,
            FIRE: 3
        };

        this.cells = this.createGrid();
        this.cellsOld = this.createGrid();

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

        this.cells[this.getIndex(fire.x, fire.y)] = this.cellState.FIRE;
    }

    update() {
        [this.cells, this.cellsOld] = [this.cellsOld, this.cells];

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const index = this.getIndex(x, y);
                const state = this.cellsOld[index];

                switch (state) {
                    case this.cellState.FIRE:
                        this.cells[index] = this.cellState.ASH;
                        break;

                    case this.cellState.TREE:
                        this.cells[index] =
                            this.hasFireNeighbour(x, y)
                                ? this.cellState.FIRE
                                : this.cellState.TREE;
                        break;

                    case this.cellState.ASH:
                        this.cells[index] = this.cellState.ASH;
                        break;

                    case this.cellState.EMPTY:
                        this.cells[index] = this.cellState.EMPTY;
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