$("#SetFen").click(function () {
	let fenStr = $("#fenIn").val();	
	ParseFen(fenStr);
	PrintBoard();
	PerftTest(5);
});