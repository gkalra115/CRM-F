const container = document.getElementById('newsheadlines');
function getNews() {
    var rawRequest = {
        query: $("#queryinput").val(),
        from:$("#fromdate").val(),
        to:$("#todate").val(),
        sort:$("#sort").val()    
    }
    KTApp.blockPage();
    $.ajax({
        type: "POST",
        url: "/api/v1/getheadlines",
        data: rawRequest,
        success: function (data) {
            var items = data.response.articles;
            let content = '';
            items.forEach(p => {
              content += `
              <div class="card">
              <img src="${p.urlToImage}" style="width:100%">
              <h1>${p.source.name}</h1>
              <p id="newstitle">${p.title}</p>
              <p>`+returndate(p.publishedAt)+`</p>
              <p>${p.description}</p>
              <p><a id="newslink" href="${p.url}" target="_blank">View News</a></p>
            </div>
              `
            });

            document.querySelector("#newsheadlines").innerHTML = content;
            KTApp.unblockPage();
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            console.log("error")
        }
    })
}

function returndate(dates) {
  var condate = new Date(dates);
    console.log(dates)
    return condate;
  }
  
  