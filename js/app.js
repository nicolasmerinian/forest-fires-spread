import ForestFireModel from "./ForestFireModel.js";
import ForestFireRenderer from "./ForestFireRenderer.js";
import defaults from "../config/defaults.js";
import pineForest from "../scenarios/pineForest.js";
import vegetationTypes from "../data/vegetationTypes.js";

const treeDensity = 0.45;  		// default and threshold: 0.55 (probability of a cell being a tree)

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
        vegetationTypes: vegetationTypes,
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