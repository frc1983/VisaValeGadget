if(!GADGET_APP)
	var GADGET_APP={};

GADGET_APP = {

	API: {
		url: "http://www.cartoesbeneficio.com.br/inst/convivencia/SaldoExtrato.jsp",
		method: "GET"
	},
	
	FILE: {
		path: "C:\\Program Files\\Windows Sidebar\\Gadgets\\VisaVale.Gadget\\cartao.txt",
		wtf: "Scripting.FileSystemObject"
	},
	
	containers: {},	
	
	init: function(){
        GADGET_APP.getContaineirs();
		GADGET_APP.setOnClick();
	},
	
	getContaineirs: function() {
		GADGET_APP.containers.cadastroCartao = $('#cadastroCartao');
		GADGET_APP.containers.gadgetContent  = $("#gadgetContent");
		GADGET_APP.containers.numCartao      = $("#numCartao");
		GADGET_APP.containers.btnSave        = $("#btnSave");
		GADGET_APP.containers.btnRefresh     = $("#btnRefresh");
	},
	
	setOnClick: function() {
		GADGET_APP.containers.btnSave.click(function() {
			GADGET_APP.writeToFile();
		});
		GADGET_APP.containers.btnRefresh.click(function() {
			GADGET_APP.readFile();
		});
	},
	
	autoRefresh: function() {
		var d = new Date();
		if (d.getHours() == "12") 
			GADGET_APP.readFile();
	},

	writeToFile: function() {
		if (GADGET_APP.containers.numCartao.val() != "") {
		   var fso  = new ActiveXObject(GADGET_APP.FILE.wtf);
		   var txtFile = fso.CreateTextFile(GADGET_APP.FILE.path, true);
		   txtFile.WriteLine(GADGET_APP.containers.numCartao.val());
		   txtFile.Close();	   
		   GADGET_APP.readFile();
		}
	},

	readFile: function() {
		var rand = Math.ceil(Math.random()*100000);
		var fso, f1;
		
		fso = new ActiveXObject(GADGET_APP.FILE.wtf);
		ts = fso.OpenTextFile(GADGET_APP.FILE.path, 1, false, 0);

		s = (ts.AtEndOfStream) ? "" : ts.ReadLine();
		if (s != "") {
			GADGET_APP.containers.cadastroCartao.hide();		
							
			req = new ActiveXObject("Msxml2.XMLHTTP");
			if (req) {		
				req.onreadystatechange = GADGET_APP.processStateChange;
				req.open(GADGET_APP.API.method, GADGET_APP.API.url + '?numeroCartao=' + s +'&periodoSelecionado=0&r=' + rand, true);
				req.send();
			}
		} else {
			GADGET_APP.containers.cadastroCartao.show();		
		}
	},

	processStateChange: function() {
		if (req.readyState == 0){ GADGET_APP.containers.gadgetContent.html("UNINITIALIZED"); }
		if (req.readyState == 1){ GADGET_APP.containers.gadgetContent.html("LOADING"); }
		if (req.readyState == 2){ GADGET_APP.containers.gadgetContent.html("LOADED"); }
		if (req.readyState == 3){ GADGET_APP.containers.gadgetContent.html("LOADING"); }
		if (req.readyState == 4){
			GADGET_APP.parseHTML(req.responseText, GADGET_APP.containers.gadgetContent);
		}
	},

	parseHTML: function(text, statusDiv) {
		statusDiv.html(text);
		var frase = "";
		$("table:first tr").map(function(index) {
			if(index < 2){
				var row = $(this);				
				frase += ("<b>" + row.find(':nth-child(1)').text() + "</b><br /> " + row.find(':nth-child(2)').text()) + "<br />";
			}
		}).get();
		
		$("table:last tr").map(function(index) {
			var row = $(this);			
			frase += ("<b>" + row.find(':nth-child(1)').text() + "</b><br /> " + row.find(':nth-child(2)').text()) + "<br />";
		}).get();
		
		statusDiv.html(frase);
	}
};

$(document).ready(function() {
	GADGET_APP.init();
	window.setInterval(GADGET_APP.autoRefresh, 3600000);	
	GADGET_APP.readFile();
});
