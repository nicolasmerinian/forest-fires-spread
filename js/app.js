import ForestFireModel from "./ForestFireModel.js";
import ForestFireRenderer from "./ForestFireRenderer.js";

const rowAndColNumber = 150; 	// default : 100 (number of rows and columns in the grid)
const cellSize = 4; 			// default : 7 (size of each cell in pixels)
const treeDensity = 0.45;  		// default and threshold: 0.55 (probability of a cell being a tree)
const simulationSpeed = 100; 	// default : 100 (ms between calculations)

const model = new ForestFireModel(rowAndColNumber, treeDensity);

const renderer = new ForestFireRenderer(
    model,
    cellSize
);

let lastUpdate = 0;

function loop(timestamp) {

    if (timestamp - lastUpdate > simulationSpeed) {
        model.update();
        lastUpdate = timestamp;
    }

    renderer.render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);