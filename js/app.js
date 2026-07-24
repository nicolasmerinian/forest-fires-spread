var FF = function(rowAndColNumber, cellSize, i, speed, p, firemenNumber) {
	this.rowAndColNumber = rowAndColNumber;
	this.cellSize = cellSize;
	this.interval = i;
	this.speed = speed || 1;
	this.p = p || 0.55;
	this.firemenNumber = firemenNumber;
	this.createCanvas();
	this.ctx = this.canvas.getContext('2d');
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.size = rowAndColNumber;
	this.init();
}

FF.prototype.createCanvas = function createCanvas() {
	var container = document.getElementById('container');
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', this.rowAndColNumber * this.cellSize);
	this.canvas.setAttribute('height', this.rowAndColNumber * this.cellSize);
	this.canvas.style.border = '1px solid #000';
	this.canvas.style.position = 'absolute';
	this.canvas.style.top = '0';
	this.canvas.style.left = '1px';
	this.canvas.id = 'canvas';
	container.appendChild(this.canvas);
}

FF.prototype.init = function init() {
	this.timer = null;
	this.cells = null;
	this.cellsOld = null;
	this.steps = 0;
	this.cellColor = ['#000', '#5D2', '#521', '#F50', '#2ea8dc', '#F0F']; // #f5d9e8
	this.cellState = { 'EMPTY': 0, 'TREE': 1, 'ASH': 2, 'FIRE': 3, 'FIREMAN': 4, 'WET': 5 };
	this.initCells();
	this.run();
}

FF.prototype.initCells = function initCells() {
	this.cells = [];
	var subArray;
	var trees = [];
	var emptyCells = [];
	var fireCell;
	var fireman;
	var rand;
	
	for (var j = 0; j < this.size; j++) {
		subArray = [];
		for (var i = 0; i < this.size; i++) {
			subArray.push(0);
		}
		this.cells.push(subArray);
	}
	
	for (var i = 0; i < this.cells.length; i++) {
		for (var j = 0; j < this.cells[i].length; j++) {
			rand = Math.random();
			if (rand < this.p) {
				this.cells[i][j] = this.cellState.TREE;
				trees.push({ i: i, j: j });
			}
			else {
				this.cells[i][j] = this.cellState.EMPTY;
				emptyCells.push({ i: i, j: j });
			}
		}
	}
	
	rand = Math.floor(Math.random() * trees.length);
	fireCell = trees[rand];
	this.cells[fireCell.i][fireCell.j] = this.cellState.FIRE;
	
	for (var k = 0; k < this.firemenNumber; k++) {
		rand = Math.floor(Math.random() * emptyCells.length);
		fireman = emptyCells[rand];
		this.cells[fireman.i][fireman.j] = this.cellState.FIREMAN;
	}
}

FF.prototype.run = function run() {
	var self = this;
	this.draw();
	for (var i = 0; i < this.speed; i++) {
		this.calc();
		this.steps += 1;
	}
	this.timer = setTimeout(function() {
		self.run();
	}, this.interval);
}

FF.prototype.draw = function draw() {
	this.clear();
	this.drawCells();
	// this.drawBoard();
}

FF.prototype.clear = function clear() {
	this.ctx.fillStyle = '#fff';
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

FF.prototype.drawBoard = function drawBoard() {
	this.ctx.strokeStyle = '#000';
	this.ctx.beginPath();
	for (var i = 0; i < this.size; i++) {
		this.ctx.moveTo(i * this.cellSize, 0);
		this.ctx.lineTo(i * this.cellSize, this.height);
	}
	for (var j = 0; j < this.size; j++) {
		this.ctx.moveTo(0, j * this.cellSize);
		this.ctx.lineTo(this.width, j * this.cellSize);
	}
	this.ctx.closePath();
	this.ctx.stroke();
}

FF.prototype.drawCells = function drawCells() {
	var currentCellValue;
	for (var j = 0; j < this.cells.length; j++) {
		for (var i = 0; i < this.cells[j].length; i++) {
			currentCellValue = this.cells[j][i];
			this.drawCell(i, j, this.cellColor[currentCellValue]);
		}
	}
}

FF.prototype.drawCell = function drawCell(x, y, color) {
	var cx = x * this.cellSize;
	var cy = y * this.cellSize;
	this.ctx.fillStyle = color;
	this.ctx.fillRect(cx, cy, this.cellSize, this.cellSize);
}

FF.prototype.calc = function calc() {
	var fireNeightboursNumber;
	var treeNeightboursNumber;
	var firemanNeightboursNumber;
	var currentCellState;

	this.prepareData();
	
	for (var j = 0; j < this.cellsOld.length; j++) {
		for (var i = 0; i < this.cellsOld[j].length; i++) {
			fireNeightboursNumber = this.getNeighboursNumber(j, i, this.cellState.FIRE);
			treeNeightboursNumber = this.getNeighboursNumber(j, i, this.cellState.TREE);
			firemanNeightboursNumber = this.getNeighboursNumber(j, i, this.cellState.FIREMAN);
			currentCellState = this.cellsOld[j][i];
			
			if (currentCellState === this.cellState.WET) {
				this.cells[j][i] = this.cellState.EMPTY;
			}
			else if (currentCellState === this.cellState.FIRE) {
				if (firemanNeightboursNumber === 0) {
					this.cells[j][i] = this.cellState.ASH;
				}
				else {
					this.cells[j][i] = this.cellState.FIREMAN;
				}
			}
			else if (currentCellState === this.cellState.FIREMAN) {
				if (fireNeightboursNumber > 0 && fireNeightboursNumber < 4) {
					this.cells[j][i] = this.cellState.WET;
				}
				else if (fireNeightboursNumber > 5) {
					this.cells[j][i] = this.cellState.FIRE;
				}
			}
			else if (currentCellState === this.cellState.TREE) {
				if (fireNeightboursNumber !== 0) {
					this.cells[j][i] = this.cellState.FIRE;
				}
			}
		}
	}
}

FF.prototype.prepareData = function prepareData() {
	this.cellsOld = [];
	var subArray;
	for (var j = 0; j < this.size; j++) {
		subArray = [];
		for (var i = 0; i < this.size; i++) {
			subArray.push(0);
		}
		this.cellsOld.push(subArray);
	}
	for (var j = 0; j < this.cellsOld.length; j++) {
		for (var i = 0; i < this.cellsOld[j].length; i++) {
			this.cellsOld[j][i] = this.cells[j][i];
		}
	}
}

FF.prototype.getNeighboursNumber = function getNeighboursNumber(j, i, state) {
	var numberOfNeightbours = 0;
	var neightbourValue;
	// Top left
	if (i - 1 >= 0 && j - 1 >= 0) {
		if (this.hasState(i - 1, j - 1, state)) {
			numberOfNeightbours += 1;
		}
	}
	// Top
	if (j - 1 >= 0) {
		if (this.hasState(i, j - 1, state)) {
			numberOfNeightbours += 1;
		}
	}
	// Top right
	if (i + 1 < this.size && j - 1 >= 0) {
		if (this.hasState(i + 1, j - 1, state)) {
			numberOfNeightbours += 1;
		}
	}
	// Center left
	if (i - 1 >= 0) {
		if (this.hasState(i - 1, j, state)) {
			numberOfNeightbours += 1;
		}
	}
	// No center
	// Center right
	if (i + 1 <= this.size) {
		if (this.hasState(i + 1, j, state)) {
			numberOfNeightbours += 1;
		}
	}
	// Bottom left
	if (i - 1 >= 0 && j + 1 < this.size) {
		if (this.hasState(i - 1, j + 1, state)) {
			numberOfNeightbours += 1;
		}
	}
	// Bottom
	if (j + 1 < this.size) {
		if (this.hasState(i, j + 1, state)) {
			numberOfNeightbours += 1;
		}
	}
	// Bottom right
	if (i + 1 <= this.size && j + 1 < this.size) {
		if (this.hasState(i + 1, j + 1, state)) {
			numberOfNeightbours += 1;
		}
	}
	return numberOfNeightbours;
}

FF.prototype.hasState = function hasState(i, j, state) {
	var cellValue = this.cellsOld[j][i];
	return cellValue === state;
}


var ff = new FF(100, 7, 60, 5, 0.45, 0);
