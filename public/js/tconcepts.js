    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Concepts
        // -----------------------------------
        var otConcepts =  $('#tconcepts').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": false,
//            "serverSide": true,
//           "searching": true,
//            "bLengthChange": false,
//             dom: 'Bfrtip',
            "language": {
                            "url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json"
                        },
            "dataSrc": "data",
            "ajax": 
                {
                    //"url": "/api/restGetSupplierConcepts",
                    "url": "/api/restGetConcepts",

                    "data": function ( d ) 
                            {
                              d.codsupplier = $('#supplier').val();
                            },
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Conceptos","data": "concept" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tconcepts tbody').on( 'click', 'tr', function () 
        {
            var data = otConcepts.row( this ).data();
//            alert("data : "+data["concept"]);
            $("#modal-concepts").modal('hide');         
//            $("#concept").val(data["ceco"]+":"+data["description"]);

        
            var table = $('#tdetail').DataTable();
            var tval =  '<input type="text" class="form-control separate-bottom"'+ 
                        ' readonly="readonly" placeholder="indique Concepto" name="concept"'+ 
                        'id="concept" value='+data["concept"]+'|/>'+
                        '<span class="input-group-addon">'+
                        '<a href="#" data-toggle="modal" data-target=".modal-concepts">'+
                        '<span class="fa fa-external-link"></a></span>'
            table.cell( $("#currentRow").val(), 5).data(tval);

        });
    });
