    $(document).ready(function () 
    {   
        var xtmp = '<a href="/supplierinvoice_add" class="btn btn-success pull-left" role="button">A</a>';

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tsupplierinvoice').DataTable(
        {
            //"pagingType": "full",
            "bPaginate": false,
            "pageLength": 200,            
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
                    "url": "/api/supplierinvoice",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"ID","data": "_id"},                
                    { "title":"Proveedor","data": "supplier", "defaultValue": null },
                    { "title":"FechaDoc","data": "documentdate", "defaultValue": null },                    
                    { "title":"DocType","data": "documenttype", "defaultValue": null },
                    { "title":"NroDoc","data": "documentnumber", "defaultValue": null }
                ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tsupplierinvoice tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);

            xcodsup = data["supplier"].split(':')[0];
            xid = data["_id"];

            // $.ajax({
            //  type: "GET",
            //  url: "/supplierInvoiceNew",
            //  data: "{'id': '2'}",
            //  contentType: "application/json; charset=utf-8",
            //  dataType: "json",
            //  success: function (message) {
            //    ShowPopup(message);
            //  }
            // });


            document.body.innerHTML += '<form id="dynForm" action="/supplierinvoice_view" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();

//            $.ajax({
 //                       dataType: 'jsonp',
//                        data: "data=yeah",                      
//                        jsonp: 'callback',
//                        url: '/supplierInvoiceNew?callback=?',
//                        url: '/supplierinvoice_add',
                        //success: function(data) {
//                            console.log('success');
//                            console.log(JSON.stringify(data));
//                        }
//            });


//            $("#modal-provee").modal('hide');         
//            $("#supplier").val(data["codsupplier"]+":"+data["name"]);

  //          var oTable1 = $('#tconcepts').DataTable();

 //           oTable1.ajax.reload( null, false )           
//            alert( 'You clicked on '+data["ceco"]+'\'s row' );
//            saveRow( data );

//            alert( 'You clicked on '+data["ceco"]+'\'s row' );
//            saveRow( data );
        });
    });
