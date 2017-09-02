    $(document).ready(function () 
    {    

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var otUaccounts =  $('#tuseraccounts').DataTable(
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
                    "url": "/api/restUserAccount",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Cuenta","data": "account" }
                    //,
                    //{ "title":"Descripción","data": "description" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tuseraccounts tbody').on( 'click', 'tr', function () 
        {
            var data = otUaccounts.row( this ).data();
            // alert("data : "+data["codsupplier"]);
            $("#modal-accounts").modal('hide');         
            // $("#account").val(data["account"]+":"+data["description"]);


            // supplierinvoice_create.hbs
            // supplierinvoice_edit.hbs            
            var table = $('#tdetail').DataTable();
            if (table.cell( $("#currentRow").val(), 3).data())
            {
                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique la Cuenta" name="accountcode" id="accountaccountcode" '+
                            ' value="'+data["account"]+':'+data["description"]+'"| "{{this.accountcode}}"/><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-accounts">'+
                            '<span class="fa fa-external-link"></a></span>'

                table.cell( $("#currentRow").val(), 3).data(tval);
            }

            // userdm_create.hbs
            // userdm_edit.hbs
            var table1 = $('#taccount').DataTable();            
            if (table1.cell( $("#currentRow").val(), 1).data())
            {

                var tval =  '<input type="text" class="form-control separate-bottom" readonly="readonly" '+ 
                            'placeholder="indique la Cuenta" name="accountcode" id="accountcode" '+
                            ' value='+data["account"]+':'+data["description"]+'| "{{this.accountcode}}"/><span class="input-group-addon">'+
                            '<a href="#" data-toggle="modal" data-target=".modal-accounts">'+
                            '<span class="fa fa-external-link"></a></span>'            
                table1.cell( $("#currentRow").val(), 1).data(tval);
            }
        });
    });
