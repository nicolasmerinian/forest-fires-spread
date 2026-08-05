export default function buildConfig(defaults, forest, vegetationTypes, treeDensity, directionVectors) {
    const config = {
        ...defaults,
        forest: {
            ...forest,
            vegetationTypes: vegetationTypes,
            treeDensity
        },
        directionVectors
    };

    return config;
}