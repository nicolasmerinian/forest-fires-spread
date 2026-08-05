export default class Controls {
    constructor({ onStart }) {
        this.onStart = onStart;
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
    }
}