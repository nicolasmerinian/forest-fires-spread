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

        const buttonsPanel = this.createButtonsPanel(container);

        // Start button
        this.createStartButton(buttonsPanel);

        // Stop button
        this.createStopButton(buttonsPanel);

        // Reset button
        this.createResetButton(buttonsPanel);

        // Density slider
        this.createDensitySlider(container);
    }

    createButtonsPanel(container) {
        const buttonsPanel = document.createElement("div");
        buttonsPanel.className = "buttons_panel controls_section";
        container.appendChild(buttonsPanel);
        return buttonsPanel;
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
        // Container for the slider, its label, the value display and the additional information
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "slider_container controls_section";
        container.appendChild(sliderContainer);

        // Contain the label, the slider and the value display
        const sliderAndValueContainer = document.createElement("div");
        sliderContainer.appendChild(sliderAndValueContainer);

        // Label
        const densityLabel = document.createElement("label");
        densityLabel.textContent = "Density:";
        sliderAndValueContainer.appendChild(densityLabel);

        // Slider
        const densitySlider = document.createElement("input");
        densitySlider.type = "range";
        densitySlider.min = 0;
        densitySlider.max = 1;
        densitySlider.step = 0.01;
        densitySlider.value = this.defaults.forest.treeDensity;
        sliderAndValueContainer.appendChild(densitySlider);

        // Value display
        const densityValue = document.createElement("span");
        densityValue.textContent = densitySlider.value;
        sliderAndValueContainer.appendChild(densityValue);

        // span beneath for additional information
        const densityInfo = document.createElement("span");
        densityInfo.className = "slider_info";
        densityInfo.textContent = `↖ Threshold: ${this.defaults.forest.treeDensity}`;
        sliderContainer.appendChild(densityInfo);

        // Event listener
        densitySlider.addEventListener("input", () => {
            densityValue.textContent = densitySlider.value;  
            this.onDensityChange(parseFloat(densitySlider.value));
        });
    }
}