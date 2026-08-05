export default class ForestFireModel {
    constructor(size, treeDensity = 0.55, humidity = 0) {
        this.size = size;
        this.treeDensity = treeDensity;
        this.humidity = humidity;
        this.newFires = [];

        this.cellState = {
            EMPTY: 0,
            ASH: 1,
            FIRE: 2,
            TREE: 3,
            SHRUB: 4,
            GRASS: 5
        };

        this.cellTypes = {
            [this.cellState.TREE]: {
                name: "TREE",
                fuel: 20,
                spottingFactor: 0.5 // A burning tree is more likely than burning grass to produce firebrands that ignite spot fires
            },
            [this.cellState.SHRUB]: {
                name: "SHRUB",
                fuel: 5,
                spottingFactor: 0.1
            },
            [this.cellState.GRASS]: {
                name: "GRASS",
                fuel: 2,
                spottingFactor: 0.01
            }
        };

        this.directions = {
            NORTH: { x: 0, y: -1 },
            EAST: { x: 1, y: 0 },
            SOUTH: { x: 0, y: 1 },
            WEST: { x: -1, y: 0 }
        };

        this.wind = {
            direction: this.directions.EAST,
            strength: 0.5 // between 0 and 1
        }

        this.cells = this.createGrid();
        this.cellsOld = this.createGrid();
        this.fuel = this.createGrid();
        this.fuelType = this.createGrid();
        this.fireCount = 0;

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
                const vegetationType = this.getRandomVegetationType();

                if (Math.random() < this.treeDensity) {
                    this.cells[index] = vegetationType;
                    trees.push({ x, y });
                }
            }
        }

        const fire = trees[Math.floor(Math.random() * trees.length)];
        const index = this.getIndex(fire.x, fire.y);
        this.cells[index] = this.cellState.FIRE;
        this.fuel[index] = this.cellTypes[this.cellState.GRASS].fuel; // Start with grass fuel for the initial fire
        this.fireCount += 1;
    }

    update() {
        [this.cells, this.cellsOld] = [this.cellsOld, this.cells];
        this.newFires = [];

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
                            this.fireCount -= 1;
                        }
                        
                        const burningType = this.cellTypes[this.fuelType[index]];
                        if (burningType) {
                            this.createFireSpotting(x, y, burningType);

                            // Introduce a random chance for a second fire spotting to occur
                            if (Math.random() > 0.5) {
                                this.createFireSpotting(x, y, burningType);
                            }
                        }

                        break;

                    case this.cellState.TREE:
                        if (this.canCatchFire(x, y)) {
                            this.cells[index] = this.cellState.FIRE;
                            this.fuel[index] = this.cellTypes[this.cellState.TREE].fuel;
                            this.fuelType[index] = this.cellState.TREE;
                            this.fireCount += 1;
                        }
                        else {
                            this.cells[index] = this.cellState.TREE;
                        }
                        break;

                    case this.cellState.SHRUB:
                        if (this.canCatchFire(x, y)) {
                            this.cells[index] = this.cellState.FIRE;
                            this.fuel[index] = this.cellTypes[this.cellState.SHRUB].fuel;
                            this.fuelType[index] = this.cellState.SHRUB;
                            this.fireCount += 1;
                        }
                        else {
                            this.cells[index] = this.cellState.SHRUB;
                        }
                        break;

                    case this.cellState.GRASS:
                        if (this.canCatchFire(x, y)) {
                            this.cells[index] = this.cellState.FIRE;
                            this.fuel[index] = this.cellTypes[this.cellState.GRASS].fuel;
                            this.fuelType[index] = this.cellState.GRASS;
                            this.fireCount += 1;
                        }
                        else {
                            this.cells[index] = this.cellState.GRASS;
                        }
                        break;
                }
            }
        }

        // Update the new fires after processing all cells
        for (const fire of this.newFires) {
            this.cells[fire.index] = this.cellState.FIRE;
            this.fuel[fire.index] = fire.fuel;
            this.fireCount += 1;
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

    getRandomVegetationType() {
        const rand = Math.random();
        if (rand < 0.3) {
            return this.cellState.TREE;
        } else if (rand < 0.6) {
            return this.cellState.SHRUB;
        } else {
            return this.cellState.GRASS;
        }
    }

    getFireNeighbours(x, y) {
        const directions = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0], [1, 0],
            [-1, 1], [0, 1], [1, 1]
        ];

        const fireNeighbours = [];

        for (const [dx, dy] of directions) {
            const neighbourX = x + dx;
            const neighbourY = y + dy;

            if (
                neighbourX >= 0 &&
                neighbourX < this.size &&
                neighbourY >= 0 &&
                neighbourY < this.size
            ) {
                if (this.hasState(
                    neighbourX,
                    neighbourY,
                    this.cellState.FIRE
                )) {
                    fireNeighbours.push({
                        x: neighbourX,
                        y: neighbourY
                    });
                }
            }
        }

        return fireNeighbours;
    }

    canCatchFire(x, y) {
        const fireNeighbours = this.getFireNeighbours(x, y);

        if (fireNeighbours.length === 0) {
            return false;
        }

        let probability = fireNeighbours.reduce(
            (chance, fire) =>
                chance * this.getWindEffect(
                    fire.x,
                    fire.y,
                    x,
                    y
                ),
            1
        );

        // console.log("probability1 ", probability.toFixed(4));
        probability *= this.getHumidityEffect();
        // console.log("probability2 ", probability.toFixed(4));

        return Math.random() < probability;
    }

    getWindEffect(fireX, fireY, targetX, targetY) {
        const dx = targetX - fireX;
        const dy = targetY - fireY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const directionX = dx / distance;
        const directionY = dy / distance;

        const alignment =
            directionX * this.wind.direction.x +
            directionY * this.wind.direction.y;

        // entre 0.1 et 1.0
        return 0.1 + ((alignment + 1) / 2) * this.wind.strength;
    }

    getHumidityEffect() {
        // The humidity effect reduces the probability of fire spread based on the humidity level.
        // A higher humidity value (closer to 1) means more resistance to fire spread.
        return 1 - this.humidity; // Returns a value between 0 (full resistance) and 1 (no resistance)
    }

    // Spotting effect: If the wind is strong and the cell is on fire, it can ignite a random cell in the wind direction
    createFireSpotting(x, y, type) {
        // Only create fire spotting if the wind is strong enough
        if (this.wind.strength <= 0.5) {
            return;
        }

        // Randomly determine whether to the fire spotting occurs based on wind strength
        const spottingProbability = this.wind.strength * type.spottingFactor;
        if (Math.random() > spottingProbability) {
            return;
        }

        // Randomly determine the distance for spotting based on wind strength
        const distance = Math.floor(Math.random() * this.wind.strength * 10) + 1;
        
        // Introduce a random spread to the fire spotting to make it less predictable
        const spread = Math.floor(Math.random() * 3) - 1;

        // Calculate the target cell in the wind direction
        const fireX = x + this.wind.direction.x * distance + spread;
        const fireY = y + this.wind.direction.y * distance + spread;

        // Check if the target cell is within bounds and is a tree, shrub, or grass
        if (
            fireX >= 0 && fireX < this.size &&
            fireY >= 0 && fireY < this.size
        ) {
            const targetIndex = this.getIndex(fireX, fireY);

            if (this.cellsOld[targetIndex] === this.cellState.TREE ||
                this.cellsOld[targetIndex] === this.cellState.SHRUB ||
                this.cellsOld[targetIndex] === this.cellState.GRASS
            ) {
                const targetState = this.cellsOld[targetIndex];

                // Ignite the target cell
                this.newFires.push({
                    index: targetIndex,
                    fuel: this.cellTypes[targetState].fuel
                });
            }
        }
    }

    isFinished() {
        return this.fireCount === 0;
    }
}