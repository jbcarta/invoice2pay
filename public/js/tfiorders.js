    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otFiorders =  $('#tfiorders').DataTable(
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
                    "url": "/api/restPostFiordersField",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Order","data": "order" },
                    { "title":"Descripción","data": "description" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tfiorders tbody').on( 'click', 'tr', function () 
        {
            var data = otFiorders.row( this ).data();
//            alert("data : "+data["codsupplier"]);
            $("#modal-fiorder").modal('hide');         
//            $("#account").val(data["account"]+":"+data["description"]);



            // supplierinvoice_create.hbs
            // supplierinvoice_edit.hbs
            var table = $('#tdetail').DataTable();
            if (table.cell( $("#currentRow").val(), 3).data())
            {
                var table = $('#tdetail').DataTable();
                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique la Orden" name="order" id="order" '+
                            ' value='+data["order"]+':'+data["description"]+'| "{{this.order}}"/><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-tfiorders">'+
                            '<span class="fa fa-external-link"></a></span>'            
                table.cell( $("#currentRow").val(), 4).data(tval);
            }


            // userdm_create.hbs
            // userdm_edit.hbs
            var table = $('#tfiorder').DataTable();
            if (table.cell( $("#currentRow").val(), 1).data())
            {
                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique la orden" name="fiorder" id="firorder" '+
                            ' value="'+data["order"]+':'+data["description"]+'"/><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-fiorders">'+
                            '<span class="fa fa-external-link"></a></span>';
                //var xx = $("#currentRow").val();
                table.cell( $("#currentRow").val(), 1).data(tval);
            }



        });
    });
