    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table 
        // -----------------------------------
        var oTable =  $('#t_table').DataTable(
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
                    "url": "/api/approvalscheme",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"ID","data": "_id"},                
                    { "title":"Nivel de Aprobación","data": "aplevel", "defaultValue": null },
                    { "title":"Centro Costo","data": "costcenter", "defaultValue": null },                    
                    { "title":"Aprobador 1","data": "approver1", "defaultValue": null },
                    { "title":"Aprobador 2","data": "approver2", "defaultValue": null },
                    { "title":"Aprobador 3","data": "approver3", "defaultValue": null },
                    { "title":"Aprobador 4","data": "approver4", "defaultValue": null },
                    { "title":"Aprobador 5","data": "approver5", "defaultValue": null }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#t_table tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            xid = data["_id"];
            console.log('data["_id"]:'+xid);

            document.body.innerHTML += '<form id="dynForm" action="/approvalscheme_detail" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();

        });
    });
