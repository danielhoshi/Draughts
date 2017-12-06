window.PlayerManager = function() {
	Player = {
		BLACK: 1,
		WHITE: 2,
	}

	function PlayerManager() {
		this.currentPlayer = Player.BLACK;
	}

	PlayerManager.prototype.changePlayer = function() {
		if (this.currentPlayer == Player.BLACK) {
			this.currentPlayer = Player.WHITE;
		} else {
			this.currentPlayer = Player.BLACK;
		}
	};

	return PlayerManager;
}();