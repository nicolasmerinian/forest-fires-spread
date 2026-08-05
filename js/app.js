import ForestFireModel from "./ForestFireModel.js";
import ForestFireRenderer from "./ForestFireRenderer.js";

const rowAndColNumber = 150; 	// default : 100 (number of rows and columns in the grid)
const cellSize = 5; 			// default : 7 (size of each cell in pixels)
const treeDensity = 0.45;  		// default and threshold: 0.55 (probability of a cell being a tree)
const simulationSpeed = 100; 	// default : 100 (ms between calculations)
const humidity = 0.1;           // default : 0.1 (resistance to fire spread, 0 = no resistance, 1 = full resistance)

const forestComposition = {
    GRASS: 0.2,
    SHRUB: 0.3,
    PINE: 0.2,
    OAK: 0.2,
    BEECH: 0.1
};

const vegetationTypes = {
    OAK: {
        name: "OAK",
        fuel: 30,
        spottingFactor: 0.5 // A burning tree is more likely than burning grass to produce firebrands that ignite spot fires
    },
    PINE: {
        name: "PINE",
        fuel: 15,
        spottingFactor: 1
    },
    BEECH: {
        name: "BEECH",
        fuel: 25,
        spottingFactor: 0.4
    },
    SHRUB: {
        name: "SHRUB",
        fuel: 5,
        spottingFactor: 0.1
    },
    GRASS: {
        name: "GRASS",
        fuel: 2,
        spottingFactor: 0.01
    }
};

const directionVectors = {
    NORTH: { x: 0, y: -1 },
    EAST: { x: 1, y: 0 },
    SOUTH: { x: 0, y: 1 },
    WEST: { x: -1, y: 0 }
};

const modelConfig = {
    forest: {
        vegetationTypes,
        composition: forestComposition,
        treeDensity
    },
    environment: {
        humidity,
        wind: {
            direction: 'EAST',
            strength: 0.5 // between 0 and 1
        }
    },
    simulation: {
        rowAndColNumber,
        cellSize,
        simulationSpeed
    }, 
    directionVectors
}

const model = new ForestFireModel(modelConfig);

const rendererConfig = {
    cellSize,
    directionVectors
}

const renderer = new ForestFireRenderer(
    model,
    {
        cellSize,
        directionVectors
    }
);


let lastUpdate = 0;
let animationFrameId = null;

function loop(timestamp) {

    if (timestamp - lastUpdate > simulationSpeed) {
        model.update();
        lastUpdate = timestamp;
    }

    renderer.render();


    if (model.isFinished()) {
        // No more fires to spread
        cancelAnimationFrame(animationFrameId);
        return;

    }

    animationFrameId = requestAnimationFrame(loop);
}

requestAnimationFrame(loop);