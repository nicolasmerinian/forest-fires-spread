export default class ForestFireRenderer {
    constructor(model, cellSize) {
        this.model = model;
        this.cellSize = cellSize;
        this.step = 0;

        this.createCanvas();

        this.colors = [
            "#000",         // empty
            "#422b24",      // ash
            "#F50",         // fire
            "#147216",      // tree
            "#9bb71d",      // shrub
            "#90EE90",      // grass
        ];
    }

    createCanvas() {
        const container = document.getElementById("container");

        this.canvas = document.createElement("canvas");
        this.canvas.width =
            this.model.size * this.cellSize;
        this.canvas.height =
            this.model.size * this.cellSize;

        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
    }

    render() {
        this.clear();

        for (let y = 0; y < this.model.size; y++) {
            for (let x = 0; x < this.model.size; x++) {

                const index =
                    this.model.getIndex(x, y);

                const state =
                    this.model.cells[index];

                this.ctx.fillStyle =
                    this.colors[state];

                this.ctx.fillRect(
                    x * this.cellSize,
                    y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        }

        this.renderTimeElapsed();

        this.step += 1;
    }

    clear() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    renderTimeElapsed() {
        const timeElapsed = this.step * 0.03;

        const text = `Time: ${timeElapsed.toFixed(1)}h`;

        this.ctx.font = "24px Arial";

        // Background
        const padding = 8;
        const textWidth = this.ctx.measureText(text).width;

        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.fillRect(
            5,
            5,
            textWidth + padding * 2,
            34
        );

        // Text
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(
            text,
            5 + padding,
            30
        );
    }
}