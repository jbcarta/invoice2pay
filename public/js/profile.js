    // ***********************************
    //         Document Ready
    // ***********************************

    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#ts').DataTable(
        {
            "pagingType": "numbers",
            "searching": false,
            "bLengthChange": false,
             dom: 'Bfrtip',
             select: true,
	        "columnDefs": 
	        [
	            {
	               "width": 20, 
	               	"targets": 0,
	                "searchable": true
	            },
	            {
	                "targets": 1,
 					"width": "50%",	                
	                "searchable": true
	            },
	            {
	                "targets": [ 3 ],
	                "visible": false
	            }
	        ]
    	});


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
		$('#ts tbody').on( 'click', 'td', function () 
		{

			var ncolum = oTable.cell( this ).index().columnVisible;
			if (ncolum => 2 && ncolum <= 3)
			{
	  			if (oTable.cell( this ).index().columnVisible === 4)
	  			{
	  				alert('Modificar:', this);
			

					var $row = $(this).closest('td');
					alert("$row:", $row);

					alert(oTable.row( this ).data());
					alert(oTable.row( this ).data()[0]);
					document.getElementById('m_codsupplier').value = oTable.row( this ).data()[0];
					document.getElementById('m_namesupplier').value = oTable.row( this ).data()[1];

	  			}
	  			else
	  				// --------------------------------------------------
	  				//             Eliminar Proveedor
	  				// --------------------------------------------------
	  				if (oTable.cell( this ).index().columnVisible === 2)
	  				{
	  					document.getElementById('temporal_row').value = this;
	  					document.getElementById('m_codsupplier').value = oTable.row( this ).data()[0];
						document.getElementById('addRowSupplier').style.visibility = 'hidden';
						document.getElementById('delRowSupplier').innerHTML = 'Eliminar Proveedor->'+
										oTable.row( this ).data()[0];

						document.getElementById('delRowSupplier').style.visibility = 'visible';
						document.getElementById('cancelDelRowSupplier').style.visibility = 'visible';

//	  					alert('Eliminar');
	  				}

			}
		});


		// ------------------------------------
	    //         saveRowSupplier
	    // -----------------------------------
	    $('#saveRowSupplier').on( 'click', function (e) 
	    {

	    	e.preventDefault();
	    	alert('SaveRowSupplier', req.session.ncolum);


			//		otable
			//        	.row( this )
			//        	.data( "Supplier5" )
			//        	.draw();    	
	    });

		// ------------------------------------
	    //         cancelDelRowSupplier
	    // -----------------------------------
	    $('#cancelDelRowSupplier').on( 'click', function (e) 
	    {
	    	e.preventDefault();

			document.getElementById('addRowSupplier').style.visibility = 'visible';
			document.getElementById('delRowSupplier').style.visibility = 'hidden';
			document.getElementById('cancelDelRowSupplier').style.visibility = 'hidden';


	    });

    });
