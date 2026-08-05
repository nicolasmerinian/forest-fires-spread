export default class Controls {
    constructor({ onStart, onStop }) {
        this.onStart = onStart;
        this.onStop = onStop;
        this.createControls();
    }

    createControls() {
        const container = document.getElementById("controls");

        // Start button
        const startButton = document.createElement("button");
        startButton.textContent = "Start";

        startButton.addEventListener("click", () => {
            this.onStart();
        });
        
        container.appendChild(startButton);

        // Stop button
        const stopButton = document.createElement("button");
        stopButton.textContent = "Stop";

        stopButton.addEventListener("click", () => {
            this.onStop();
        });
        
        container.appendChild(stopButton);
    }
}