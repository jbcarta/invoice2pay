// casupolibs.js

        // ------------------------------------
        //         transport_2_number()
        // -----------------------------------
        function transform_2_number(valor_2_convert)
        {

            // en el replace /,/g significa reemplaza todas las ocurrencias!!
            var numreturn = parseFloat(valor_2_convert.replace(/,/g,"")).toFixed(2);

            //alert('Valor Numerico: '+num);
            //alert('Valor Numerico: '+parseFloat(num).toFixed(2));  
            numreturn = Number(numreturn);
            return numreturn;

        }

        // ------------------------------------
        //         transport_2_formatnumber()
        // -----------------------------------
        function transform_2_formatnumber(valor_2_convert)
        {
            // en el replace /,/g significa reemplaza todas las ocurrencias!!
            var numreturn = parseFloat(valor_2_convert).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " $";;

            //alert('Valor Numerico: '+num);
            //alert('Valor Numerico: '+parseFloat(num).toFixed(2));  
            return numreturn;

        }     