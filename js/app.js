import ForestFireModel from "../model/ForestFireModel.js";
import ForestFireRenderer from "../renderer/ForestFireRenderer.js";
import defaults from "../config/defaults.js";
import buildConfig from "../config/buildConfig.js";
import pineForest from "../scenarios/pineForest.js";
import vegetationTypes from "../data/vegetationTypes.js";
import directionVectors from "../constants/directions.js";

const treeDensity = 0.45; // default and threshold: 0.55 (probability of a cell being a tree)

const modelConfig = buildConfig(defaults, pineForest, vegetationTypes, treeDensity, directionVectors);

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