export default class Simulation {
    constructor(model, renderer, config) {
        this.model = model;
        this.renderer = renderer;
        this.simulationSpeed = config.simulation.speed;

        this.isRunning = false;
        this.lastUpdate = 0;
        this.animationFrameId = null;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastUpdate = 0;
            this.animationFrameId = requestAnimationFrame(this.loop);
        }
    }

    stop() {
        this.isRunning = false;

        if (this.isRunning) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    reset() {
        this.stop();
        this.model.reset();
        this.start();
    }

    loop = (timestamp) => {

        if (!this.isRunning) {
            return;
        }

        if (timestamp - this.lastUpdate > this.simulationSpeed) {
            this.model.update();
            this.lastUpdate = timestamp;
        }

        this.renderer.render();


        if (this.model.isFinished()) {
            // No more fires to spread
            this.stop();
            return;

        }

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    setDensity(newDensity) {
        this.model.setDensity(newDensity);
        this.reset();
    }
}
