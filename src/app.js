import ForestFireModel from "./model/ForestFireModel.js";
import ForestFireRenderer from "./renderer/ForestFireRenderer.js";
import defaults from "./config/defaults.js";
import buildConfig from "./config/buildConfig.js";
import pineForest from "./data/scenarios/pineForest.js";
import mixedForest from "./data/scenarios/mixedForest.js";
import vegetationTypes from "./data/vegetationTypes.js";
import directionVectors from "./constants/directions.js";
import Simulation from "./simulation/Simulation.js";
import Controls from "./ui/Controls.js";

const modelConfig = buildConfig(defaults, mixedForest, vegetationTypes, directionVectors);

const model = new ForestFireModel(modelConfig);

const renderer = new ForestFireRenderer(
    model,
    {
        ...defaults,
        directionVectors
    }
);

const simulation = new Simulation(model, renderer, defaults);

const controls = new Controls({
    onStart: () => simulation.start()
});

// simulation.start();