    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otSupplier =  $('#tsupplier').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": true,

//            "serverSide": false,

//           "searching": true,
//            "bLengthChange": false,
//             dom: 'Bfrtip',
            "language": {
                            "url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json"
                        },
            "dataSrc": "data",
            "ajax": 
                {
                    "url": "/api/restGetAllSupplier",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Código","data": "codsupplier" },
                    { "title":"Nombre","data": "name" },
                    { "title":"País","data": "country" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tsupplier tbody').on( 'click', 'tr', function () 
        {
            var data = otSupplier.row( this ).data();
//            alert("data : "+data["codsupplier"]);
            $("#modal-provee").modal('hide');         
            $("#supplier").val(data["codsupplier"]+":"+data["name"]);
//            alert( 'You clicked on '+data["ceco"]+'\'s row' );
//            saveRow( data );
        });
    });
