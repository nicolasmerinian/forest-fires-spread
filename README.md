# Forest Fire Propagation

A simple JavaScript cellular automaton exploring how forest density affects wildfire propagation.

## Objective

This project was inspired by the concept of a **critical density** (or percolation threshold) in forest fire models.

The idea is that below a certain tree density, fires tend to remain local because they eventually run out of neighbouring trees to ignite. Above a critical density, however, a continuous path of trees is likely to exist across the forest, allowing the fire to spread much farther and sometimes consume a large part of the map.

The goal of this project was to observe this phenomenon by varying the initial proportion of trees.

## Rules

Each cell of the grid can be in one of the following states:

* Empty
* Tree
* Burning
* Ash

### Initialization

* Each cell becomes a tree with probability `treeDensity`.
* Otherwise it starts empty.
* One random tree is ignited.

### Simulation

At each step:

* A burning tree becomes ash.
* Any tree adjacent to at least one burning tree catches fire.
* Empty cells remain empty.
* Ash cells remain unchanged.

The simulation uses the **Moore neighbourhood**, meaning that each cell considers its 8 surrounding neighbours.

## Architecture

The project is split into two main components:

### ForestFireModel

Responsible for the simulation logic:

* Grid creation and initialization
* Cell states management
* Fire propagation rules
* Neighbour detection
* Simulation updates

The model is independent from the rendering system, making the simulation logic easier to test and modify.

### ForestFireRenderer

Responsible for the visual representation:

* Canvas creation
* Grid rendering
* Cell colouring

The renderer only displays the current state of the model and does not contain simulation logic.

## Result

Although this is a simplified model, it reproduces an interesting qualitative behaviour.

For low values of `treeDensity`, fires generally die out quickly because the forest is too sparse to sustain propagation.

As the density increases, larger connected clusters of trees appear, allowing fires to travel much farther. Around a density of approximately **0.55**, the simulation begins to exhibit a transition where fires are much more likely to spread across a significant portion of the forest.

This behaviour is consistent with the intuition behind **percolation theory**, although the exact threshold depends on the model's rules and should not be interpreted as a scientific measurement.

## Technologies

* Vanilla JavaScript (ES6 modules)
* HTML5 Canvas
* TypedArrays (`Uint8Array`) for efficient grid storage

## Running the project

This project uses native ES6 modules, so it needs to be served through a local web server instead of being opened directly from the file system.

To run the simulation locally:

```bash
npx serve
```

Then open the URL provided by the server (usually http://localhost:3000) in your browser.

## Notes

This is a personal experiment created to explore cellular automata, emergent behaviour and simulation architecture.

The model intentionally favours simplicity over physical realism and should be viewed as a visual experiment rather than an accurate wildfire prediction model.