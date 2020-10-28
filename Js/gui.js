$("#SetFen").click(function () {
	let fenStr = $("#fenIn").val();	
	ParseFen(fenStr);
	PrintBoard();
	SearchPosition();
});