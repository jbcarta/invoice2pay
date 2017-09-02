    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table 
        // -----------------------------------
        var oTable =  $('#t_aprovallevels').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": true,
            "language": {
                          "url": "//cdn.datatables.net/plug-ins/1.10.13/i18n/Spanish.json"
                        },
            "serverSide": false,
            dom: 'Blfrtip',
//            dom: 'B<"clear">lfrtip',            
             buttons: [
                    'colvis',
                    'excel',
                    'print'
                ],       

//           "searching": true,
//            "bLengthChange": false,
//             dom: 'Bfrtip',
            "dataSrc": "data",
            "ajax": 
                {
                    "url": "/api/approvallevels",
                    "type": "GET"
                },
            "columns": 
                [
                    // { "title":"ID","data": "_id"},                
                    { "title":"Nivel de Aprobación","data": "aplevel", "defaultValue": null },
                    { "title":"Moneda","data": "currency", "defaultValue": null },
                    { "title":"Min Valor","data": "valmin", "defaultValue": null },
                    { "title":"Max Valor","data": "valmax", "defaultValue": null }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#t_aprovallevels tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

           $("#modal-aplevel").modal('hide');         
            $("#aplevel").val(data["aplevel"]);

            // xid = data["_id"];
            //console.log('data["_id"]:'+xid);

            //document.body.innerHTML += '<form id="dynForm" action="/approvallevels_detail" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            //document.getElementById("dynForm").submit();

        });
    });
