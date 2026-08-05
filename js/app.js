import ForestFireModel from "./ForestFireModel.js";
import ForestFireRenderer from "./ForestFireRenderer.js";
import defaults from "../config/defaults.js";
import pineForest from "../scenarios/pineForest.js";

const treeDensity = 0.45;  		// default and threshold: 0.55 (probability of a cell being a tree)

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
    ...defaults,
    forest: {
        ...pineForest,
        vegetationTypes,
        treeDensity
    },
    directionVectors
}

const model = new ForestFireModel(modelConfig);

const renderer = new ForestFireRenderer(
    model,
    {
        ...defaults,
        directionVectors
    }
);

let lastUpdate = 0;
let animationFrameId = null;

function loop(timestamp) {

    if (timestamp - lastUpdate > defaults.simulation.speed) {
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