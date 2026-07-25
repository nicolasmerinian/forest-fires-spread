export default class ForestFireRenderer {
    constructor(model, cellSize) {
        this.model = model;
        this.cellSize = cellSize;

        this.createCanvas();

        this.colors = [
            "#000",     // empty
            "#422b24",  // ash
            "#F50",     // fire
            "#5D2",     // tree
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
}