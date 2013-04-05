function getTweets() {
    if($('#search-field').val() === "")
        return;
    $.ajax({
        url: 'http://search.twitter.com/search.json?q=' + $('#search-field').val() + "&rpp=" + $('#tweet-amount').text() +"&result_type=recent",
        dataType: 'jsonp',
        success: function(data) {
            var tweets = $('#tweets');
            tweets.find('.tweet:not(.template)').remove();
            var temp = tweets.find('.tweet.template');
            $.each(data.results, function(i, item) {
            	var tweet = temp.clone();
            	tweet.find('.username').prepend("<b>" + item.from_user_name + "</b> <i>@" + item.from_user + " (" + item.created_at + ")</i>");
            	tweet.find('.content').text(item.text);
            	tweet.find('.pic').attr("src",item.profile_image_url_https);
            	tweet.find('.link').attr("href","https://www.twitter.com/" + item.from_user);
            	tweet.removeClass('template').appendTo(tweets).show();
            });
        }
    });
}

$(document).ready(function(){
    var intervalId;
    function intervalSetter(){
        clearInterval(intervalId);
        intervalId = setInterval(function(){
            getTweets();
        },$('#refresh-amount').text()*1000)
    }   
    
	$('#search-button').on("click",function(){
		getTweets();
        intervalSetter();
		return false;
	});

    $('#tweet-slider').slider({
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 100,
        value: 5,
        slide: function( event, ui ) {
            $('#tweet-amount').text( ui.value );
        },
        stop: getTweets
    });
    $('#amount').val( $('#slider-vertical').slider( "value" ) );

    $('#refresh-slider').slider({
        orientation: "horizontal",
        range: "min",
        min: 1,
        max: 100,
        value: 10,
        slide: function( event, ui ) {
            $( "#refresh-amount" ).text( ui.value );
        },
        stop: intervalSetter
    });
    $('#amount').val( $( "#slider-vertical" ).slider( "value" ) );
});

