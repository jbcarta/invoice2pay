    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tcecos').DataTable(
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
                    "url": "/api/restPostCecosField",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Ceco","data": "ceco" },
                    { "title":"Descripción","data": "description" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tcecos tbody').on( 'click', 'tr', function () 
        {
            var data = oTable.row( this ).data();
//            alert("data : "+data["codsupplier"]);
            $("#modal-cecos").modal('hide');         
            $("#costcenter").val(data["ceco"]+":"+data["description"]);

        });
    });
