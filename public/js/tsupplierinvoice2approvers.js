    $(document).ready(function () 
    {   
        //var xtmp = '<a href="/supplierinvoice_add" class="btn btn-success pull-left" role="button">A</a>';



        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tsupplierinvoice2approvers').DataTable(
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
                    "url": "/api/supplierinvoice2approvers", 
                    "type": "GET"
                },
            "columns": 
                [
                    //{ "title":"ID","data": "_id"},                
                    { "title":"Proveedor","data": "supplier", "defaultValue": null },
                    { "title":"FechaDoc","data": "documentdate", "defaultValue": null },                    
                    { "title":"DocType","data": "documenttype", "defaultValue": null },
                    { "title":"NroDoc","data": "documentnumber", "defaultValue": null },
                    { "title":"Monto Total","data": "totalinvoice", "defaultValue": null },
                    { "title":"Mon","data": "currency", "defaultValue": null },                    
                    { "title":"Aprobador 1","data": "approver1", "defaultValue": null },
                    { "title":"L","data": "release1", "defaultValue": null },
                    { "title":"Aprobador 2","data": "approver1", "defaultValue": null },
                    { "title":"L","data": "release2", "defaultValue": null },                                     
                    { "title":"Aprobador 3","data": "approver3", "defaultValue": null },
                    { "title":"L","data": "release3", "defaultValue": null },
                    { "title":"Aprobador 4","data": "approver4", "defaultValue": null },
                    { "title":"L","data": "release4", "defaultValue": null },                                     
                    /*  
                    { "title":"Aprobador 5","data": "approver5", "defaultValue": null },
                    { "title":"L","data": "release5", "defaultValue": null },                    
                    */
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tsupplierinvoice2approvers tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            xcodsup = data["supplier"].split(':')[0];
            xid = data["_id"];

            document.body.innerHTML += '<form id="dynForm" action="/supplierInvoice2release_view" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();


        });
    });
