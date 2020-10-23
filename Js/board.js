let GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOUR.WHITE;
GameBoard.fityMove = 0;
GameBoard.hisPly = 0; // will be used as index of array storing all moves in the game.
GameBoard.ply = 0; // number of half moves made in the search tree.
GameBoard.castlePerm = 0; //will keep a track of castling permission. 
GameBoard.material = new Array(2); //WHITE, BLACK material of pieces
GameBoard.pceNum = new Array(13); //Number of unique Pieces in game
GameBoard.pList = new Array(14*10);