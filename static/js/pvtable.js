function GetPvLine(depth) {
	
	let move = ProbePvTable();
	let count = 0;
	
	while(move != NOMOVE && count < depth) {
	
		if( MoveExists(move) == BOOL.TRUE) {
			MakeMove(move);
			GameBoard.PvArray[count++] = move;			
		} else {
			break;
		}		
		move = ProbePvTable();	
	}
	
	while(GameBoard.ply > 0) {
		TakeMove();
	}
	
	return count;
	
}

function ProbePvTable() {
	let index = GameBoard.posKey % PVENTRIES;
	
	if(GameBoard.PvTable[index].posKey == GameBoard.posKey) {
		return GameBoard.PvTable[index].move;
	}
	
	return NOMOVE;
}

function StorePvMove(move) {
	let index = GameBoard.posKey % PVENTRIES;
	GameBoard.PvTable[index].posKey = GameBoard.posKey;
	GameBoard.PvTable[index].move = move;
}