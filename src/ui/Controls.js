export default class Controls {
    constructor(defaults, { onStart, onStop, onReset, onDensityChange }) {
        this.defaults = defaults;
        this.onStart = onStart;
        this.onStop = onStop;
        this.onReset = onReset;
        this.onDensityChange = onDensityChange;
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

        // Density slider
        this.createDensitySlider(container);
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

    createDensitySlider(container) {
        // Label
        const densityLabel = document.createElement("label");
        densityLabel.textContent = "Density:";
        container.appendChild(densityLabel);

        // Slider
        const densitySlider = document.createElement("input");
        densitySlider.type = "range";
        densitySlider.min = 0;
        densitySlider.max = 1;
        densitySlider.step = 0.01;
        densitySlider.value = this.defaults.forest.treeDensity;
        container.appendChild(densitySlider);

        // Value display
        const densityValue = document.createElement("span");
        densityValue.textContent = densitySlider.value;
        container.appendChild(densityValue);

        // Event listener
        densitySlider.addEventListener("input", () => {
            densityValue.textContent = densitySlider.value;  
            this.onDensityChange(parseFloat(densitySlider.value));
        });
    }
}