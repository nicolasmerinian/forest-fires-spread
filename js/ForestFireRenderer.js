export default class ForestFireRenderer {
    constructor(model, config) {
        this.model = model;
        this.cellSize = config.cellSize;
        this.directions = config.directions;
        this.step = 0;

        this.createCanvas();

        this.colors = [
            "#000",         // empty
            "#422b24",      // ash
            "#F50",         // fire
            "#45f345",      // grass
            "#aed20f",      // shrub
            "#557416",      // oak
            "#228B22",      // pine
            "#20653e",      // beech
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

        // Render the HUD
        const HUDParams = {
            x: 5,
            y: 5,
            width: 110,
            height: 68,
            padding: 8,
            fontSize: 20
        };
        this.renderHUD(HUDParams);

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

    renderHUD({ x, y, width, height, padding, fontSize }) {
        // Background
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // semi-transparent white
        this.ctx.fillRect(
            x,
            y,
            width + padding * 2,
            height
        );

        this.ctx.font = `${fontSize}px Arial`;

        // Elapsed Time
        this.renderTimeElapsed(x, y, padding);

        // Wind direction and strength
        this.renderWindInfo(x, y, padding);
    }

    renderTimeElapsed(x, y, padding) {
        const timeElapsed = this.step * 0.03;
        const text = `Time: ${timeElapsed.toFixed(1)}h`;
        const textWidth = this.ctx.measureText(text).width;

        // Text
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(
            text,
            x + padding,
            y + 25
        );
    }

    renderWindInfo(x, y, padding) {
        const wind = this.model.wind;
        const arrow = {
            EAST: "→",
            WEST: "←",
            NORTH: "↑",
            SOUTH: "↓"
        }
        const windDirection = arrow[Object.keys(this.directions).find(key => this.directions[key] === wind.direction)];

        const text = `Wind: ${wind.strength} ${windDirection}`;

        // Text
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(
            text,
            x + padding,
            y + 55
        );
    }
}