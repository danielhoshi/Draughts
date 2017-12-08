var canvas, ctx, HEIGHT, WIDTH, board, player;

window.onload = function() {
	initCanvas();
	initBoard();
	initPlayer();
}

initCanvas = function() {
	//INIT THE BOARD
	HEIGHT = 600;
	WIDTH = 600;
	CELL_WIDTH = WIDTH / 8;
	CELL_HEIGHT = HEIGHT / 8;

	canvas = document.querySelector('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	ctx = canvas.getContext('2d');
	canvas.style.background = '#BC7D19';
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			ctx.moveTo(CELL_WIDTH * i, CELL_HEIGHT * j);
			if ((i + j) % 2 == 0) {
				ctx.fillStyle = '#FBF597';
				ctx.fillRect((i * CELL_WIDTH), (j * CELL_HEIGHT), CELL_WIDTH, CELL_HEIGHT);
			}
		}
	}
}

initBoard = function() {
	//GET A REFERENCE OF A NEW BOARD 
	board = new Board();
	renderPieces();
}

initPlayer = function() {
	//GET A REFERENCE OF THE PLAYER MANAGER
	player = new PlayerManager();
	document.getElementById('turn').textContent = 'BLACK';
}

//RENDER THE PIECES
//KING: YELLOW CIRCLE INSIDE THE BLACK/WHITE CIRCLE
//SELECTED PIECE: GREEN BORDER 
renderPieces = function() {
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			var centerY = i * CELL_WIDTH + CELL_WIDTH / 2;
			var centerX = j * CELL_HEIGHT + CELL_HEIGHT / 2;
			ctx.beginPath();
			if (board.matrix[i][j] == Piece.BLACK) {
				ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'black';
				ctx.fill();
			} else if (board.matrix[i][j] == Piece.WHITE) {
				ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'white';
				ctx.fill();
			} else if (board.matrix[i][j] == Piece.SELECTED_BLACK) {
				ctx.arc(centerX, centerY, 29, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'black';
				ctx.fill();
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00FF48';
				ctx.stroke();
			} else if (board.matrix[i][j] == Piece.SELECTED_WHITE) {
				ctx.arc(centerX, centerY, 29, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00FF48';
				ctx.stroke();
			} else if (board.matrix[i][j] == Piece.KING_BLACK) {
				ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'black';
				ctx.fill();
				ctx.beginPath();
				ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'yellow';
				ctx.fill();
			} else if (board.matrix[i][j] == Piece.KING_WHITE) {
				ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.beginPath();
				ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'yellow';
				ctx.fill();
			} else if (board.matrix[i][j] == Piece.SELECTED_KING_BLACK) {
				ctx.arc(centerX, centerY, 29, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'black';
				ctx.fill();
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00FF48';
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'yellow';
				ctx.fill();
			} else if (board.matrix[i][j] == Piece.SELECTED_KING_WHITE) {
				ctx.arc(centerX, centerY, 29, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#00FF48';
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'yellow';
				ctx.fill();
			} else if (board.matrix[i][j] == Piece.NONE) {
				ctx.fillStyle = '#BC7D19';
				ctx.fillRect((j * CELL_WIDTH), (i * CELL_HEIGHT), CELL_WIDTH, CELL_HEIGHT);
			}
		}
	}
}

handleClick = function(row, col) {
	var cell = board.matrix[row][col];
	if (board.hasSelected()) {
		//IF A PIECE IS SELECTED AND IT IS CLICKED AGAIN, DESELECT THE PIECE
		if (cell == player.currentPlayer + 2 || cell == player.currentPlayer + 6) {
			//IF IT IS A PIECE THAT HAS JUST JUMPED AND CAN JUMP AGAIN, IT DOES NOT DESELECT THE PIECE
			if (!board.jumpAgain) {
				board.deselectCell(row, col);
			}
		} else if (board.makeMove(row, col, player.currentPlayer)) {
			player.changePlayer();

			//CHANGE THE 'TURN' TEXT
			if (player.currentPlayer == Piece.BLACK)
				document.getElementById('turn').textContent = 'BLACK';
			else
				document.getElementById('turn').textContent = 'WHITE';
		}
	} else if (cell == player.currentPlayer || cell == player.currentPlayer + 4) {
		board.selectCell(row, col);
	}

	renderPieces();
}

//CREATE AN EVENT LISTENER FOR THE BOARD
//GET THE POSITION/CELL CLICKED
document.getElementById('board').addEventListener('click', function(event) {
	var posX = event.clientX;
	var posY = event.clientY;
	var row = Math.floor(posY / 75);
	var col = Math.floor(posX / 75);
	handleClick(row, col);
});

document.getElementById('btnRestart').addEventListener('click', function(event){
	window.location.reload();
});