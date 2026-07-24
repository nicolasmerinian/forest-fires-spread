# Forest Fire Propagation

A simple JavaScript cellular automaton exploring how forest density affects wildfire propagation.

## Objective

This project was inspired by the concept of a **critical density** (or percolation threshold) in forest fire models.

The idea is that below a certain tree density, fires tend to remain local because they eventually run out of neighbouring trees to ignite. Above a critical density, however, a continuous path of trees is likely to exist across the forest, allowing the fire to spread much farther and sometimes consume a large part of the map.

The goal of this project was to observe this phenomenon by varying the initial proportion of trees.

## Rules

Each cell of the grid can be in one of several states:

* Empty
* Tree
* Burning
* Ash

### Initialization

* Each cell becomes a tree with probability `p`.
* Otherwise it starts empty.
* One random tree is ignited.
* A configurable number of firefighters can also be placed randomly.

### Simulation

At each step:

* A burning tree becomes ash.
* Any tree adjacent to at least one burning tree catches fire.
* Firefighters extinguish nearby fires according to simple neighbourhood rules.
* Wet cells eventually become empty.

The simulation uses the Moore neighbourhood (8 surrounding cells).

## Result

Although this is a simplified model, it reproduces an interesting qualitative behaviour.

For low values of `p`, fires generally die out quickly because the forest is too sparse to sustain propagation.

As the density increases, larger connected clusters of trees appear, allowing fires to travel much farther. Around a density of approximately **0.55**, the simulation begins to exhibit a transition where fires are much more likely to spread across a significant portion of the forest.

This behaviour is consistent with the intuition behind **percolation theory**, although the exact threshold depends on the model's rules and should not be interpreted as a scientific measurement.

## Technologies

* Vanilla JavaScript
* HTML5 Canvas

## Running the project

This project uses native ES6 modules, so it needs to be served through a local web server instead of being opened directly from the file system.

To run the simulation locally:

```bash
npx serve
```

Then open the URL provided by the server (usually http://localhost:3000) in your browser.

## Notes

This is a personal experiment created to explore cellular automata and emergent behaviour. The model intentionally favours simplicity over physical realism and should be viewed as a visual simulation rather than an accurate wildfire model.
