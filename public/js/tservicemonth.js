    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otServicemonth =  $('#tservicemonth').DataTable(
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
                    "url": "/api/restPostServiceMonth",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Mes","data": "servicemonth" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tservicemonth tbody').on( 'click', 'tr', function () 
        {
            var data = otServicemonth.row( this ).data();
//            alert("data : "+data["codsupplier"]);
            $("#modal-tservicemonth").modal('hide');         
//            $("#account").val(data["account"]+":"+data["description"]);

            var table = $('#tdetail').DataTable();
            var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                        'placeholder="indique la Orden" name="servicemonth" id="servicemonth" '+
                        ' value='+data["servicemonth"]+'| "{{this.servicemonth}}"/><span class="input-group-addon">'+
                        '<a href="#" data-toggle="modal" data-target=".modal-tservicemonth">'+
                        '<span class="fa fa-external-link"></a></span>'            
            table.cell( $("#currentRow").val(), 6).data(tval);

        });
    });
