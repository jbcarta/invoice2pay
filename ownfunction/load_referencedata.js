// ----------------------------------------------------
	//              loadCecos
	// ----------------------------------------------------
	function loadCecos(cecos_array)
	{

	    Cecos.find(function(err, docs) {

			console.log("--------------------------------------");		
			console.log("loadCecos  - despues de find");		

			console.log("Err:",err);		

			console.log("Console-docs --------------------------------------");		
			//	console.log(docs);

			results_from_mongodb = []
			results_from_mongodb.push(docs);

			//	console.log(results_from_mongodb);
		    var docChunks = [];
			var chunkSize = 1;
			//		for (var i = 0; i < docs.length; i += chunkSize) {
			//			docChunks.push(docs.slice(i, i + chunkSize));
			//		}			

			cecos_array = results_from_mongodb;
			console.log("/Cecos/paso 2 en .find");		
			//		req.body.form_aprover = approver.aprover;

			console.log("Callback - loadCecos saliendo");		
		});


	};

	module.exports = loadCecos;