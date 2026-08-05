export default {
    OAK: {
        name: "OAK",
        fuel: 30,
        ignitionProbability: 0.6, // The probability of a tree igniting when exposed to fire
        spottingFactor: 0.5 // A burning tree is more likely than burning grass to produce firebrands that ignite spot fires
    },
    PINE: {
        name: "PINE",
        fuel: 15,
        ignitionProbability: 0.8,
        spottingFactor: 1
    },
    BEECH: {
        name: "BEECH",
        fuel: 25,
        ignitionProbability: 0.7,
        spottingFactor: 0.4
    },
    SHRUB: {
        name: "SHRUB",
        fuel: 5,
        ignitionProbability: 0.9,
        spottingFactor: 0.1
    },
    GRASS: {
        name: "GRASS",
        fuel: 2,
        ignitionProbability: 0.95,
        spottingFactor: 0.01
    }
};