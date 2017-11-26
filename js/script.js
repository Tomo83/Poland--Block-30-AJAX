
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    
    $greeting.text('So, you want to live at ' + address + '?');
    
    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + address + '';
    
    
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    //ny times request
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=6cf7911d3e2a4797b083ee0d4cc9ba5b'
    
    $.getJSON( nytimesUrl, function(data) {
        
        $nytHeaderElem.text('New York Times Article About ' + cityStr);
        
        var article = data.response.docs;
        for(var i = 0; i < article.length; i++){
            var article = article[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });
    
    //wikipedia ajax request
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('failed to get wikipedia resources');
    }, 8000);
    
    $.ajax ({
        url: wikiUrl,
        dataType: "jsonp",
        /*jsonp: "callback",*/
        success: function(response) {
            var  articleList = response[1];

            for(var i = 0; i < articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
