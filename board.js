window.Board = function() {
	Piece = {
		INVALID: -1,
		NONE: 0,
		BLACK: 1,
		WHITE: 2,
		SELECTED_BLACK: 3,
		SELECTED_WHITE: 4,
		KING_BLACK: 5,
		KING_WHITE: 6,
		SELECTED_KING_BLACK: 7,
		SELECTED_KING_WHITE: 8
	}

	//INITIALIZE THE BOARD
	function Board() {
		this.matrix = [
			[-1, 2, -1, 2, -1, 2, -1, 2],
			[2, -1, 2, -1, 2, -1, 2, -1],
			[-1, 2, -1, 2, -1, 2, -1, 2],
			[0, -1, 0, -1, 0, -1, 0, -1],
			[-1, 0, -1, 0, -1, 0, -1, 0],
			[1, -1, 1, -1, 1, -1, 1, -1],
			[-1, 1, -1, 1, -1, 1, -1, 1],
			[1, -1, 1, -1, 1, -1, 1, -1],
		];
		this.jumpAgain = false;
		this.player = 1;
	}

	//VERIFY IF THE BOARD HAS A PIECE SELECTED
	Board.prototype.hasSelected = function() {
		for (i = 0; i < 8; i++)
			for (j = 0; j < 8; j++)
				if (this.matrix[i][j] == Piece.SELECTED_WHITE || this.matrix[i][j] == Piece.SELECTED_BLACK ||
					this.matrix[i][j] == Piece.SELECTED_KING_WHITE || this.matrix[i][j] == Piece.SELECTED_KING_BLACK)
					return true;

		return false;
	};

	Board.prototype.selectCell = function(row, col) {
		this.matrix[row][col] += 2;
	};

	Board.prototype.deselectCell = function(row, col) {
		this.matrix[row][col] -= 2;
	};

	Board.prototype.makeMove = function(newRow, newCol, player) {
		this.player = player;
		var selected = this.getSelectedCell();

		if (!this.isValid(newRow, newCol, selected.row, selected.col, selected.piece))
			//INVALID MOVE
			return false;

		if (Math.abs(newRow - selected.row) == 2 && Math.abs(newCol - selected.col) == 2) {
			//JUMP MOVE
			return this.jumpMove(newRow, newCol, selected);
		} else if (Math.abs(newRow - selected.row) == 1 && Math.abs(newCol - selected.col) == 1) {
			//NORMAL MOVE
			if (this.canJumpAll(this.player)) {
				alert('You must jump');
				return false;
			} else {
				this.move(selected.row, selected.col, newRow, newCol, selected.piece);
				return true;
			}
		}
		return false;
	};

	//RETURN THE POSITION AND THE TYPE OF THE SELECTED PIECE
	Board.prototype.getSelectedCell = function() {
		for (i = 0; i < 8; i++) {
			for (j = 0; j < 8; j++) {
				if (this.matrix[i][j] == Piece.SELECTED_WHITE || this.matrix[i][j] == Piece.SELECTED_BLACK ||
					this.matrix[i][j] == Piece.SELECTED_KING_WHITE || this.matrix[i][j] == Piece.SELECTED_KING_BLACK) {
					return {
						row: i,
						col: j,
						piece: this.matrix[i][j] - 2
					}
				}
			}
		}
	};

	//CHANGE THE VALUES IN THE MATRIX AFTER A MOVE AND VERIFY IF THE PLAYER GETS A KING
	Board.prototype.move = function(oldRow, oldCol, newRow, newCol, piece) {
		if (piece == Piece.BLACK && newRow == 0) {
			this.matrix[newRow][newCol] = Piece.KING_BLACK;
		} else if (piece == Piece.WHITE && newRow == 7) {
			this.matrix[newRow][newCol] = Piece.KING_WHITE;
		} else {
			this.matrix[newRow][newCol] = piece;
		}
		this.matrix[oldRow][oldCol] = 0;
	};

	//MAKE A JUMP MOVE
	Board.prototype.jumpMove = function(newRow, newCol) {
		var selected = this.getSelectedCell();
		var opponentPieceRow = (newRow + selected.row) / 2;
		var opponentPieceCol = (newCol + selected.col) / 2;
		if (this.isJumpValid(newRow, newCol, selected.row, selected.col, selected.piece)) {
			this.matrix[opponentPieceRow][opponentPieceCol] = 0;

			if (this.canJump(newRow - 2, newCol - 2, newRow, newCol, selected.piece) || this.canJump(newRow - 2, newCol + 2, newRow, newCol, selected.piece) ||
				this.canJump(newRow + 2, newCol - 2, newRow, newCol, selected.piece) || this.canJump(newRow + 2, newCol + 2, newRow, newCol, selected.piece)) {

				this.move(selected.row, selected.col, newRow, newCol, selected.piece + 2);
				this.verifyEndGame();
				this.jumpAgain = true;
				return false;
			}

			this.move(selected.row, selected.col, newRow, newCol, selected.piece);
			this.verifyEndGame();
			this.jumpAgain = false;
			return true;
		}
		return false;
	};

	//VERIFY IF A MOVE IS VALID
	Board.prototype.isValid = function(newRow, newCol, row, col, piece) {
		//VERIFY IF IT IS OUT OF BOUNDS
		if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7)
			return false;
		//IT MUST BE AN EMPTY CELL
		if (this.matrix[newRow][newCol] != Piece.NONE)
			return false;
		//NORMAL PIECES CAN NOT MOVE BACKWARDS
		if (piece == Piece.BLACK && (newRow > row))
			return false;
		if (piece == Piece.WHITE && (newRow < row))
			return false;

		return true;
	};

	//VERIFY IF A JUMP MOVE IS VALID
	Board.prototype.isJumpValid = function(newRow, newCol, row, col, piece) {
		//GET THE POSITION OF THE PIECE THAT IS JUMPED
		var opponentPieceRow = (newRow + row) / 2;
		var opponentPieceCol = (newCol + col) / 2;

		//THE JUMPED CELL MUST NOT BE EMPTY OR BE A PIECE OF THE SAME PLAYER
		if (this.matrix[opponentPieceRow][opponentPieceCol] == Piece.NONE || piece == this.matrix[opponentPieceRow][opponentPieceCol] ||
			(piece + 2) == this.matrix[opponentPieceRow][opponentPieceCol] || (piece - 2) == this.matrix[opponentPieceRow][opponentPieceCol] ||
			(piece + 4) == this.matrix[opponentPieceRow][opponentPieceCol] || (piece - 4) == this.matrix[opponentPieceRow][opponentPieceCol] ||
			(piece + 6) == this.matrix[opponentPieceRow][opponentPieceCol] || (piece - 6) == this.matrix[opponentPieceRow][opponentPieceCol])
			return false;

		return true;
	};

	//VERIFY IF IT IS POSSIBLE TO JUMP FROM A POSITION TO A NEW POSITION
	Board.prototype.canJump = function(newRow, newCol, row, col, piece) {
		if (!this.isValid(newRow, newCol, row, col, piece) || !this.isJumpValid(newRow, newCol, row, col, piece))
			return false;

		return true;
	};

	//VERIFY IF A PLAYER HAS A PIECE THAT CAN JUMP A PIECE OF THE OPPONENT
	Board.prototype.canJumpAll = function(player) {
		for (i = 0; i < 8; i++) {
			for (j = 0; j < 8; j++) {
				var piece = this.matrix[i][j];
				if (piece == player || piece == (player + 2) || piece == (player + 4) || piece == (player + 6)) {
					if (this.canJump(i - 2, j - 2, i, j, piece) || this.canJump(i - 2, j + 2, i, j, piece) ||
						this.canJump(i + 2, j - 2, i, j, piece) || this.canJump(i + 2, j + 2, i, j, piece)) {
						return true;
					}
				}
			}
		}
		return false;
	};

	//VERIFY IF THERE IS A WINNER
	Board.prototype.verifyEndGame = function() {
		var countBlack, countWhite = 0;
		for (i = 0; i < 8; i++) {
			for (j = 0; j < 8; j++) {
				var cell = this.matrix[i][j];
				if (cell == Piece.BLACK || cell == Piece.SELECTED_BLACK || cell == Piece.KING_BLACK || cell == Piece.SELECTED_KING_BLACK)
					countBlack++;
				if (cell == Piece.WHITE || cell == Piece.SELECTED_WHITE || cell == Piece.KING_WHITE || cell == Piece.SELECTED_KING_WHITE)
					countWhite++;
			}
		}
		if(countBlack == 0)
			alert('Player WHITE wins!');
		if(countWhite == 0)
			alert('Player BLACK wins!');
	};

	return Board;

}();