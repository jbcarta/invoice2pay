    $(document).ready(function () 
    {   
        //var xtmp = '<a href="/supplierinvoice_add" class="btn btn-success pull-left" role="button">A</a>';

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tconcepts').DataTable(
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
                    "url": "/api/concepts",
                    "type": "GET"
                },

            "columns": 
                [
                    { "title":"ID","data": "_id"},                
                    { "title":"Conceptos","data": "concept", "defaultValue": null }
                ],            
              "columnDefs": 
                    [
                        { targets: [0,1], visible: true},
                        { targets: [0], width: "30%"}           
                    ]
        });

        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tconcepts tbody').on( 'click', 'tr', function () 
        {

            var data = oTable.row( this ).data();
            // alert("data : "+data["supplier"]);

            //xcod = data["conceptcode"].split(':')[0];
            xid = data["_id"];
            console.log('data["_id"]:'+xid);

            document.body.innerHTML += '<form id="dynForm" action="/concept_detail" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();

        });
    });
