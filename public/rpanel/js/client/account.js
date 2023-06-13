function tokencount(){
    $.ajax({
        url: '/api/v1/aitools/tokens',
        method: 'GET',
        success: function (data) {
            $("#tokencount").empty().text("Token available "+data.tokenlength[0].updatedtokens+ " in credit.");
        },
        error: function (error) {
        },
      });
}


$( window ).on( "load", tokencount );