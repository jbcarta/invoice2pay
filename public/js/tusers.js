    $(document).ready(function () 
    {   

        // ------------------------------------
        //         Actitate table Supply
        // -----------------------------------
        var oTable =  $('#tusers').DataTable(
        {
            "pagingType": "full_numbers",
            "processing": true,

//            "serverSide": false,

//           "searching": true,
//            "bLengthChange": false,
//             dom: 'Bfrtip',
            "dataSrc": "data",
            "ajax": 
                {
                    "url": "/api/restPostUsersField",
                    "type": "GET"
                },
            "columns": 
                [
                    { "title":"Id","data": "_id" },                
                    { "title":"Email","data": "email" },
                    { "title":"Nombre","data": "name" }
                ]
        });


        // ------------------------------------
        //         #ts tbody CLICK
        // -----------------------------------
        $('#tusers tbody').on( 'click', 'tr', function () 
        {
            var data = oTable.row( this ).data();
//            alert("data : "+data["supplier"]);


            xid = data["_id"];
            console.log('data["_id"]:'+xid);

            document.body.innerHTML += '<form id="dynForm" action="/userscecos_detail" method="post"><input type="hidden" name="post_id" value="'+xid+'"></form>';
            document.getElementById("dynForm").submit();
        });
    });
