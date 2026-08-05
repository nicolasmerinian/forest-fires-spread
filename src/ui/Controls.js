export default class Controls {
    constructor({ onStart, onStop, onReset }) {
        this.onStart = onStart;
        this.onStop = onStop;
        this.onReset = onReset;
        this.createControls();
    }

    createControls() {
        const container = document.getElementById("controls");

        // Start button
        this.createStartButton(container);

        // Stop button
        this.createStopButton(container);

        // Reset button
        this.createResetButton(container);
    }
    
    createStartButton(container) {
        const startButton = document.createElement("button");
        startButton.textContent = "Start";

        startButton.addEventListener("click", () => {
            this.onStart();
        });
        
        container.appendChild(startButton);
    }

    createStopButton(container) {
        const stopButton = document.createElement("button");
        stopButton.textContent = "Stop";

        stopButton.addEventListener("click", () => {
            this.onStop();
        });
        
        container.appendChild(stopButton);
    }

    createResetButton(container) {
        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";

        resetButton.addEventListener("click", () => {
            this.onReset();
        });
        
        container.appendChild(resetButton);
    }
}