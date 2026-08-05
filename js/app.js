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

const model = new ForestFireModel(rowAndColNumber, treeDensity, humidity, forestComposition);

const renderer = new ForestFireRenderer(
    model,
    cellSize
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