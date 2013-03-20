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
		GADGET_APP.containers.loader.hide();
		GADGET_APP.containers.btnRefresh.hide();
		GADGET_APP.containers.btnEdit.hide();
		GADGET_APP.containers.smile.hide();
	},
	
	getContaineirs: function() {
		GADGET_APP.containers.cadastroCartao = $('#cadastroCartao');
		GADGET_APP.containers.gadgetContent  = $("#gadgetContent");
		GADGET_APP.containers.numCartao      = $("#numCartao");
		GADGET_APP.containers.btnSave        = $("#btnSave");
		GADGET_APP.containers.btnRefresh     = $("#btnRefresh");
		GADGET_APP.containers.btnEdit     	 = $("#btnEdit");
		GADGET_APP.containers.loader     	 = $("#loader");
		GADGET_APP.containers.smile     	 = $("#smile");
	},
	
	setOnClick: function() {
		GADGET_APP.containers.btnSave.click(function() {
			GADGET_APP.writeToFile();
		});
		GADGET_APP.containers.btnRefresh.click(function() {
			GADGET_APP.readFile();
		});
		GADGET_APP.containers.btnEdit.click(function() {
			GADGET_APP.editFile();
		});
	},
	
	autoRefresh: function() {
		var d = new Date();
		if (d.getHours() == "13") 
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
		
		GADGET_APP.containers.smile.hide();

		s = (ts.AtEndOfStream) ? "" : ts.ReadLine();
		if (s != "") {
			GADGET_APP.containers.cadastroCartao.hide();
			GADGET_APP.containers.btnRefresh.show();
			GADGET_APP.containers.btnEdit.show();
			
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
	
	editFile: function() {
		var rand = Math.ceil(Math.random()*100000);
		var fso, f1;
		
		fso = new ActiveXObject(GADGET_APP.FILE.wtf);
		ts = fso.OpenTextFile(GADGET_APP.FILE.path, 1, false, 0);
		
		GADGET_APP.containers.smile.hide();

		s = (ts.AtEndOfStream) ? "" : ts.ReadLine();
		if (s != "") {
			GADGET_APP.containers.cadastroCartao.show();
			GADGET_APP.containers.btnRefresh.hide();	
			GADGET_APP.containers.btnEdit.hide();
			GADGET_APP.containers.gadgetContent.hide();
			GADGET_APP.containers.numCartao.val(s);
		}
	},

	processStateChange: function() {
		if (req.readyState == 0){  }
		if (req.readyState == 1){ 
			GADGET_APP.containers.loader.show(); 
			GADGET_APP.containers.gadgetContent.hide();
		}
		if (req.readyState == 2){  }
		if (req.readyState == 3){ 
			GADGET_APP.containers.loader.show(); 
		}
		if (req.readyState == 4){
			GADGET_APP.parseHTML(req.responseText, GADGET_APP.containers.gadgetContent);
			GADGET_APP.containers.loader.hide();
			GADGET_APP.containers.gadgetContent.show();
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
			
			GADGET_APP.containers.smile.show();
			var valorAtual = parseFloat(row.find(':nth-child(2)').text().replace('R$ ', '').replace(',', '.'));

			if(valorAtual > 150.00) {
				GADGET_APP.containers.smile.html('<img src="../images/happy.png" />');
			}	
			else if(valorAtual < 150.00 && valorAtual > 50.00) {
				GADGET_APP.containers.smile.html('<img src="../images/angry.png" />');
			}
			else {
				GADGET_APP.containers.smile.html('<img src="../images/sad.png" />');
			}				
		}).get();
		
		statusDiv.html(frase);
	}
};

$(document).ready(function() {
	GADGET_APP.init();
	window.setInterval(GADGET_APP.autoRefresh, 3600000);	
	GADGET_APP.readFile();
});
