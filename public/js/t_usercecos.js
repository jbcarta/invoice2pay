    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otUcecos =  $('#tusercecos').DataTable(
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
                    "url": "/api/restUserCecos",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Ceco","data": "ceco" }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tusercecos tbody').on( 'click', 'tr', function () 
        {
            var data = otUcecos.row( this ).data();
            // alert("data : "+data["codsupplier"]);
            $("#modal-cecos").modal('hide');         
            // $("#costcenter").val(data["ceco"]+":"+data["description"]);


            // supplierinvoice_create.hbs
            // supplierinvoice_edit.hbs
            var table = $('#tdetail').DataTable();
            if (table.cell( $("#currentRow").val(), 3).data())
            {
                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique el Cecos" name="costcenter" id="costcenter" '+
                            ' value="'+data["ceco"]+'"| "{{this.costcenter}}"/><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-cecos">'+
                            '<span class="fa fa-external-link"></a></span>';
                //var xx = $("#currentRow").val();
                table.cell( $("#currentRow").val(), 2).data(tval);
            }

            // userdm_create.hbs
            // userdm_edit.hbs
            var table = $('#tcostcenter').DataTable();
            if (table.cell( $("#currentRow").val(), 1).data())
            {
                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique el Cecos" name="costcenter" id="costcenter" '+
                            ' value="'+data["ceco"]+':'+data["description"]+'"/><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-cecos">'+
                            '<span class="fa fa-external-link"></a></span>';
                //var xx = $("#currentRow").val();
                table.cell( $("#currentRow").val(), 1).data(tval);
            }


        });

});