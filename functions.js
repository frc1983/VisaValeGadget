$(document).ready(function(){
	window.setInterval(autoRefresh, 3600000);	
	readFile();
});

function autoRefresh(){
	var d = new Date();
	var n = d.getHours();
	if(n == '12') readFile();
}

function WriteToFile()
{
	var input = $('input#numCartao');
	
	if(input.val() != ""){
	   var fso  = new ActiveXObject("Scripting.FileSystemObject");
	   var txtFile = fso.CreateTextFile("C:\\Program Files\\Windows Sidebar\\Gadgets\\VisaVale.Gadget\\cartao.txt", true);
	   txtFile.WriteLine(input.val());
	   txtFile.Close();	   
	   
	   readFile();
	}
}

function readFile(){
	var rand = Math.ceil(Math.random()*100000);

	var fso, f1;
	fso = new ActiveXObject("Scripting.FileSystemObject");
	ts = fso.OpenTextFile("C:\\Program Files\\Windows Sidebar\\Gadgets\\VisaVale.Gadget\\cartao.txt", 1, false, 0);

	if(ts.size != "undefined"){
		s = ts.ReadLine();	
		if(s != ""){
			$('#cadastroCartao').hide();		
			
			req = new ActiveXObject("Msxml2.XMLHTTP");
			if (req) {		
				req.onreadystatechange = processStateChange;
				req.open("GET", 'http://www.cartoesbeneficio.com.br/inst/convivencia/SaldoExtrato.jsp?numeroCartao='+ 
							s +'&periodoSelecionado=0&r=' + rand, true);
				req.send();
			}
		}
	}
	else 
		$('#cadastroCartao').show();
	
}

function processStateChange(){
  statusDiv = document.getElementById("gadgetContent");
  if (req.readyState == 0){ statusDiv.innerHTML = "UNINITIALIZED"; }
  if (req.readyState == 1){ statusDiv.innerHTML = "LOADING"; }
  if (req.readyState == 2){ statusDiv.innerHTML = "LOADED"; }
  if (req.readyState == 3){ statusDiv.innerHTML = "INTERACTIVE"; }
  if (req.readyState == 4){
	parseHTML(req.responseText, statusDiv);
  }
}

function parseHTML(text, statusDiv){
	statusDiv.innerHTML = text;
	var frase = "";
	$("table:first tr").map(function( index ) {
		if(index < 2){
			var row = $(this);				
			frase += ("<b>" + row.find(':nth-child(1)').text() + "</b><br /> " + row.find(':nth-child(2)').text()) + "<br />";
		}
	}).get();
	
	$("table:last tr").map(function( index ) {
		var row = $(this);			
		frase += ("<b>" + row.find(':nth-child(1)').text() + "</b><br /> " + row.find(':nth-child(2)').text()) + "<br />";
	}).get();
	
	statusDiv.innerHTML = frase;
}