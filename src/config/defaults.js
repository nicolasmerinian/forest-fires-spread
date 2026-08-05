export default {
    environment: {
        humidity: 0.2, // default : 0.1 (resistance to fire spread, 0 = no resistance, 1 = full resistance)
        wind: {
            direction: "EAST",
            strength: 0.5
        }
    },
    forest: {
        treeDensity: 0.55 // default and threshold: 0.55 (probability of a cell being a tree)
    },
    simulation: {
        gridSize: 100, // default : 100 (number of rows and columns in the grid)
        cellSize: 4, // default : 7 (size of each cell in pixels)
        speed: 100 // default : 100 (ms between calculations)
    }
};