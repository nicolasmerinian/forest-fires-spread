export default function buildConfig(defaults, forest, vegetationTypes, directionVectors) {
    const config = {
        environment: {
            ...defaults.environment,
        },
        forest: {
            ...defaults.forest,
            ...forest,
            vegetationTypes: vegetationTypes,
        },
        simulation: {
            ...defaults.simulation,
        },
        directionVectors
    };

    return config;
}