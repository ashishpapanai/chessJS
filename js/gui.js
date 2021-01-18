$("#SetFen").click(function() {
    let fenStr = $("#fenIn").val();
    NewGame(fenStr);
});

$('#TakeButton').click(function() {
    if (GameBoard.hisPly > 0) {
        TakeMove();
        GameBoard.ply = 0;
        SetInitialBoardPieces();
    }
});

$('#ResignButton').click(function(){
    if(GameBoard.side === COLOURS.WHITE) {
        alert('White Resigns, Black Wins.');
        return BOOL.TRUE;

    }else{
        alert('Black Resigns, White Wins.');
        return BOOL.TRUE;
    }
});

var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;

var MirrorFiles = [FILES.FILE_H, FILES.FILE_G, FILES.FILE_F, FILES.FILE_E, FILES.FILE_D, FILES.FILE_C, FILES.FILE_B, FILES.FILE_A];
var MirrorRanks = [RANKS.RANK_8, RANKS.RANK_7, RANKS.RANK_6, RANKS.RANK_5, RANKS.RANK_4, RANKS.RANK_3, RANKS.RANK_2, RANKS.RANK_1];

function MIRROR120(sq) {
    var file = MirrorFiles[FilesBrd[sq]];
    var rank = MirrorRanks[RanksBrd[sq]];
    return FR2SQ(file, rank);
}


$('#NewGameButton').click(function() {
    clearEngineOutput();
    NewGame(START_FEN);
});

function NewGame(fenStr) {
    ParseFen(fenStr);
    PrintBoard();
    SetInitialBoardPieces();
    CheckAndSet();
}

function ClearAllPieces() {
    $(".Piece").remove();
}

function SetInitialBoardPieces() {

    let sq;
    let sq120;
    let file, rank;
    let rankName;
    let fileName;
    let imageString;
    let pieceFileName;
    let pce;

    ClearAllPieces();

    for (sq = 0; sq < 64; ++sq) {
        sq120 = SQ120(sq);
        pce = GameBoard.pieces[sq120];
        if (pce >= PIECES.wP && pce <= PIECES.bK) {
            AddGUIPiece(sq120, pce);
        }
    }
}

function DeSelectSq(sq) {
    $('.Square').each(function(index) {
        if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
            $(this).removeClass('SqSelected');
        }
    });
}

function SetSqSelected(sq) {
    $('.Square').each(function(index) {
        if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
            $(this).addClass('SqSelected');
        }
    });
}

function ClickedSquare(pageX, pageY) {
    console.log('ClickedSquare() at ' + pageX + ',' + pageY);
    let position = $('#Board').position();

    let workedX = Math.floor(position.left + 250);
    let workedY = Math.floor(position.top);

    if (window.innerWidth <= 1200) {
        workedX = Math.floor(position.left + 100);
    }

    if (window.innerWidth <= 1000) {
        workedX = Math.floor(position.left + 30);
    }

    if (window.innerWidth <= 900) {
        workedX = Math.floor(position.left + (window.innerWidth) * (0.10));
    }

    if (window.innerWidth <= 680) {
        workedX = Math.floor(position.left - (window.innerWidth) * (0.10));
    }

    pageX = Math.floor(pageX);
    pageY = Math.floor(pageY);

    let file = Math.floor((pageX - workedX) / 60);
    let rank = 7 - Math.floor((pageY - workedY) / 60);

    let sq = FR2SQ(file, rank);

    if (GameController.BoardFlipped == BOOL.TRUE) {
        sq = MIRROR120(sq);
    }

    console.log('Clicked sq:' + PrSq(sq));

    SetSqSelected(sq);

    return sq;
}

$(document).on('click', '.Piece', function(e) {
    console.log('Piece Click');

    if (UserMove.from == SQUARES.NO_SQ) {
        UserMove.from = ClickedSquare(e.pageX, e.pageY);
    } else {
        UserMove.to = ClickedSquare(e.pageX, e.pageY);
    }

    MakeUserMove();

});

$(document).on('click', '.Square', function(e) {
    console.log('Square Click');
    if (UserMove.from != SQUARES.NO_SQ) {
        UserMove.to = ClickedSquare(e.pageX, e.pageY);
        MakeUserMove();
    }

});

function MakeUserMove() {

    if (UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {

        console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));

        let parsed = ParseMove(UserMove.from, UserMove.to);

        if (parsed != NOMOVE) {
            MakeMove(parsed);
            PrintBoard();
            MoveGUIPiece(parsed);
            CheckAndSet();
            PreSearch();
            console.log(UserMove.from+" "+UserMove.to);
        }

        DeSelectSq(UserMove.from);
        DeSelectSq(UserMove.to);

        UserMove.from = SQUARES.NO_SQ;
        UserMove.to = SQUARES.NO_SQ;
    }

}

function PieceIsOnSq(sq, top, left) {

    if ((RanksBrd[sq] == 7 - Math.round(top / 60)) &&
        FilesBrd[sq] == Math.round(left / 60)) {
        return BOOL.TRUE;
    }

    return BOOL.FALSE;

}

function RemoveGUIPiece(sq) {

    $('.Piece').each(function(index) {
        if (PieceIsOnSq(sq, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
            $(this).remove();
        }
    });

}

function AddGUIPiece(sq, pce) {

    let file = FilesBrd[sq];
    let rank = RanksBrd[sq];
    let rankName = "rank" + (rank + 1);
    let fileName = "file" + (file + 1);
    let pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
    let imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
    $("#Board").append(imageString);
}

function MoveGUIPiece(move) {

    let from = FROMSQ(move);
    let to = TOSQ(move);

    if (move & MFLAGEP) {
        let epRemove;
        if (GameBoard.side == COLOURS.BLACK) {
            epRemove = to - 10;
        } else {
            epRemove = to + 10;
        }
        RemoveGUIPiece(epRemove);
    } else if (CAPTURED(move)) {
        RemoveGUIPiece(to);
    }

    let file = FilesBrd[to];
    let rank = RanksBrd[to];
    let rankName = "rank" + (rank + 1);
    let fileName = "file" + (file + 1);

    $('.Piece').each(function(index) {
        if (PieceIsOnSq(from, $(this).position().top, $(this).position().left) == BOOL.TRUE) {
            $(this).removeClass();
            $(this).addClass("Piece " + rankName + " " + fileName);
        }
    });

    if (move & MFLAGCA) {
        switch (to) {
            case SQUARES.G1:
                RemoveGUIPiece(SQUARES.H1);
                AddGUIPiece(SQUARES.F1, PIECES.wR);
                break;
            case SQUARES.C1:
                RemoveGUIPiece(SQUARES.A1);
                AddGUIPiece(SQUARES.D1, PIECES.wR);
                break;
            case SQUARES.G8:
                RemoveGUIPiece(SQUARES.H8);
                AddGUIPiece(SQUARES.F8, PIECES.bR);
                break;
            case SQUARES.C8:
                RemoveGUIPiece(SQUARES.A8);
                AddGUIPiece(SQUARES.D8, PIECES.bR);
                break;
        }
    } else if (PROMOTED(move)) {
        RemoveGUIPiece(to);
        AddGUIPiece(to, PROMOTED(move));
    }

}

function DrawMaterial() {

    if (GameBoard.pceNum[PIECES.wP] != 0 || GameBoard.pceNum[PIECES.bP] != 0) return BOOL.FALSE;
    if (GameBoard.pceNum[PIECES.wQ] != 0 || GameBoard.pceNum[PIECES.bQ] != 0 ||
        GameBoard.pceNum[PIECES.wR] != 0 || GameBoard.pceNum[PIECES.bR] != 0) return BOOL.FALSE;
    if (GameBoard.pceNum[PIECES.wB] > 1 || GameBoard.pceNum[PIECES.bB] > 1) { return BOOL.FALSE; }
    if (GameBoard.pceNum[PIECES.wN] > 1 || GameBoard.pceNum[PIECES.bN] > 1) { return BOOL.FALSE; }

    if (GameBoard.pceNum[PIECES.wN] != 0 && GameBoard.pceNum[PIECES.wB] != 0) { return BOOL.FALSE; }
    if (GameBoard.pceNum[PIECES.bN] != 0 && GameBoard.pceNum[PIECES.bB] != 0) { return BOOL.FALSE; }

    return BOOL.TRUE;
}

function ThreeFoldRep() {
    let i = 0,
        r = 0;

    for (i = 0; i < GameBoard.hisPly; ++i) {
        if (GameBoard.history[i].posKey == GameBoard.posKey) {
            r++;
        }
    }
    return r;
}

function CheckResult() {
    if (GameBoard.fiftyMove >= 100) {
        alert('GAME DRAWN: Fifty Move Rule');
        return BOOL.TRUE;
    }

    if (ThreeFoldRep() >= 2) {
        alert('GAME DRAWN: 3-Fold Repetition');
        return BOOL.TRUE;
    }

    if (DrawMaterial() == BOOL.TRUE) {
        alert('GAME DRAWN: Insufficient Material To Mate')
        return BOOL.TRUE;
    }

    GenerateMoves();

    let MoveNum = 0;
    let found = 0;

    for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {

        if (MakeMove(GameBoard.moveList[MoveNum]) == BOOL.FALSE) {
            continue;
        }
        found++;
        TakeMove();
        break;
    }

    if (found != 0) return BOOL.FALSE;

    let InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);

    if (InCheck == BOOL.TRUE) {
        if (GameBoard.side == COLOURS.WHITE) {
            alert('GAME OVER: Black Mates');
            return BOOL.TRUE;
        } else {
            alert('GAME OVER: White Mates');
            return BOOL.TRUE;
        }
    } else {
        alert('GAME DRAWN: Stalemate');
        return BOOL.TRUE;
    }

    return BOOL.FALSE;
}

function CheckAndSet() {
    if (CheckResult() == BOOL.TRUE) {
        GameController.GameOver = BOOL.TRUE;
    } else {
        GameController.GameOver = BOOL.FALSE;
        $("#GameStatus").text('');
    }
}

function PreSearch() {
    if (GameController.GameOver == BOOL.FALSE) {
        SearchController.thinking = BOOL.TRUE;
        setTimeout(function() { StartSearch(); }, 200);
    }
}

function clearEngineOutput() {
	$("#OrderingOut").text("Ordering: ");
	$("#DepthOut").text("Depth: ");
	$("#ScoreOut").text("Score");
	$("#NodesOut").text("Nodes: ");
	$("#TimeOut").text("Time: ");
	$("#BestOut").text("BestMove: ");
}

$('#SearchButton').click(function() {
    GameController.PlayerSide = GameController.side ^ 1;
    PreSearch();
});

$("#FlipButton").click(function() {
    GameController.BoardFlipped ^= 1;
    console.log("Flipped:" + GameController.BoardFlipped);
    SetInitialBoardPieces();
});

function StartSearch() {

    SearchController.depth = MAXDEPTH;
    let t = $.now();
    let tt = $('#ThinkTimeChoice').val();

    SearchController.time = parseInt(tt) * 1000;
    SearchPosition();

    MakeMove(SearchController.best);
    MoveGUIPiece(SearchController.best);
    CheckAndSet();
}