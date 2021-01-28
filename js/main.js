$(function() {
	init();
	console.log("Main Init Called");	
	NewGame(START_FEN);
});

function InitFilesRanksBrd() {
	
	let index = 0;
	let file = FILES.FILE_A;
	let rank = RANKS.RANK_1;
	let sq = SQUARES.A1;
	
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		FilesBrd[index] = SQUARES.OFFBOARD;
		RanksBrd[index] = SQUARES.OFFBOARD;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
	}
}

function InitHashKeys() {
    let index = 0;
	
	for(index = 0; index < 14 * 120; ++index) {				
		PieceKeys[index] = RAND_32();
	}
	
	SideKey = RAND_32();
	
	for(index = 0; index < 16; ++index) {
		CastleKeys[index] = RAND_32();
	}
}

function InitSq120To64() {

	let index = 0;
	let file = FILES.FILE_A;
	let rank = RANKS.RANK_1;
	let sq = SQUARES.A1;
	let sq64 = 0;

	for(index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}
	
	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}

}

function InitBoardVars() {

	let index = 0;
	for(index = 0; index < MAXGAMEMOVES; ++index) {
		GameBoard.history.push( {
			move : NOMOVE,
			castlePerm : 0,
			enPas : 0,
			fiftyMove : 0,
			posKey : 0
		});
	}	
	
	for(index = 0; index < PVENTRIES; ++index) {
		GameBoard.PvTable.push({
			move : NOMOVE,
			posKey : 0
		});
	}
}

function InitBoardSquares() {
	let light = 0;
	let rankName;
	let fileName;
	let divString;
	let lastLight = 0;
	let rankIter = 0;
	let fileIter = 0;
	let lightString;
	
	for(rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
		light = lastLight ^ 1;
		lastLight ^= 1;
		rankName = "rank" + (rankIter+1);
		for(fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
			fileName = "file" + (fileIter+1);
			
			if(light==0) lightString="Light";
			else lightString = "Dark";
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			light^=1;
			$("#Board").append(divString);
 		}
 	}
}

function InitBoardSquares() {
	let light = 1;
	let rankName;
	let fileName;
	let divString;
	let rankIter;
	let fileIter;
	let lightString;
	
	for(rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
		light ^= 1;
		rankName = "rank" + (rankIter + 1);
		for(fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
			fileName = "file" + (fileIter + 1);
			if(light == 0) lightString="Light";
			else lightString = "Dark";
			light^=1;
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			$("#Board").append(divString);
		}
	}
	
}

function init() {
	console.log("init() called");
	InitFilesRanksBrd();
	InitHashKeys();
	InitSq120To64();
	InitBoardVars();
	InitMvvLva();
	InitBoardSquares();

	const color1 = document.querySelector('.board-color-1');
	color1.addEventListener('click', () => {
		const lightNodeList = document.querySelectorAll('.Light')
		const darkNodeList = document.querySelectorAll('.Dark')

		const lightArray = Array.from(lightNodeList)
		const darkArray = Array.from(darkNodeList)

		lightArray.forEach(le => {
			le.style.backgroundColor = '#eee'
		})

		darkArray.forEach(de => {
			de.style.backgroundColor = '#254117'
		})

	})

	const color2 = document.querySelector('.board-color-2');
	color2.addEventListener('click', () => {
		const lightNodeList = document.querySelectorAll('.Light')
		const darkNodeList = document.querySelectorAll('.Dark')

		const lightArray = Array.from(lightNodeList)
		const darkArray = Array.from(darkNodeList)

		lightArray.forEach(le => {
			le.style.backgroundColor = '#FFEBCD'
		})

		darkArray.forEach(de => {
			de.style.backgroundColor = '#6F4E37'
		})

	})

	const color3 = document.querySelector('.board-color-3');
	color3.addEventListener('click', () => {
		const lightNodeList = document.querySelectorAll('.Light')
		const darkNodeList = document.querySelectorAll('.Dark')

		const lightArray = Array.from(lightNodeList)
		const darkArray = Array.from(darkNodeList)

		lightArray.forEach(le => {
			le.style.backgroundColor = '#eee'
		})

		darkArray.forEach(de => {
			de.style.backgroundColor = '#3D3C3A'
		})

	})

}