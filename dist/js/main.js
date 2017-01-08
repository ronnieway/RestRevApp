'use strict';

//- inject:parts
var ll;
var userToken;

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, errPos);
	} else {
		alert('Geolocation is not supported by this browser.');
	}
}

function showPosition(position) {
	var vurl;
	var chosenRestaurant = $('#restNameInput').val();
	var chosenCategoryV = $('#catInput').val();
	var chosenCategory = $('#catList option[value="' + chosenCategoryV + '"]').attr('data-value');
	ll = position.coords.latitude + ',' + position.coords.longitude;
	if (chosenCategoryV != '' && chosenRestaurant != '') {
		vurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=' + chosenCategory + '&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll=' + ll + '&query=' + chosenRestaurant;
	} else if (chosenCategoryV == '' && chosenRestaurant != '') {
		vurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll=' + ll;
	} else if (chosenCategoryV != '' && chosenRestaurant == '') {
		vurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=' + chosenCategory + '&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll=' + ll + '&query=' + chosenRestaurant;
	} else {
		vurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll=' + ll;
	}

	$.ajax({
		type: 'GET',
		url: vurl,
		dataType: 'json',
		success: getThemAll,
		error: function error() {
			console.log('Error getting your location');
		}
	});
	return false;
}

function errPos(errr) {
	console.log(errr);
}

function findRestaurant() {
	var xurl;
	var chosenCity = $('#cityInput').val();
	var chosenCategoryV = $('#catInput').val();
	var chosenCategory = $('#catList option[value="' + chosenCategoryV + '"]').attr('data-value');
	var chosenRestaurant = $('#restNameInput').val();
	if (chosenCity != '' && chosenRestaurant == '') {
		if (chosenCategoryV == '') {
			xurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near=' + chosenCity;
		} else {
			xurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=' + chosenCategory + '&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near=' + chosenCity;
		}
		$.ajax({
			type: 'GET',
			url: xurl,
			dataType: 'json',
			success: getThemAll,
			error: function error() {
				console.log('Error finding venues nearby');
			}
		});
	} else if (chosenCity != '' && chosenRestaurant != '') {
		if (chosenCategoryV == '') {
			xurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near=' + chosenCity + '&query=' + chosenRestaurant;
		} else {
			xurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=' + chosenCategory + '&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near=' + chosenCity + '&query=' + chosenRestaurant;
		}
		$.ajax({
			type: 'GET',
			url: xurl,
			dataType: 'json',
			success: getThemAll,
			error: function error() {
				console.log('Error finding selected venues');
			}
		});
	} else {
		alert('We can not find any restaurant with provided search data');
	}
}

function getThemAll(rests) {
	$('#restResults').html('');
	$('#restResults').append('<h3>Found restaurants</h3>');
	for (var i = 0; i < rests.response.venues.length; i++) {
		venueInfo(rests.response.venues[i].id);
	}
}

function venueInfo(id) {
	var wurl = 'https://api.foursquare.com/v2/venues/' + id + '?oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD&v=20170104';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: venueInfoResult,
		error: function error() {
			console.log('Error getting venues info');
		}
	});
	return false;
}

function venueInfoResult(results) {
	var catego = '';
	for (var i = 0; i < results.response.venue.categories.length; i++) {
		if (results.response.venue.categories[i].name != '' && i == 0) {
			catego = catego + results.response.venue.categories[i].name;
		} else {
			catego = catego + ', ' + results.response.venue.categories[i].name;
		}
	}
	var theStatus;
	if (results.response.venue.hours && results.response.venue.hours.status != 'undefined') {
		theStatus = results.response.venue.hours.status;
	} else {
		theStatus = 'not available';
	}
	$('#restResults').append('<div class="venue" id="venue' + results.response.venue.id + '"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><h4>' + results.response.venue.name + '</h4></div></div><div class="row"><div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"><img src="' + results.response.venue.bestPhoto.prefix + '300x300' + results.response.venue.bestPhoto.suffix + '" alt="Photo of ' + results.response.venue.name + '" class="center-block"></div><div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"><p><b>Categories:</b> ' + catego + '</p><p><b>Address:</b> ' + results.response.venue.location.address + ', ' + results.response.venue.location.city + ', ' + results.response.venue.location.country + '</p><p><b>Working hours today: </b>' + theStatus + '</p><p><b>Rating: </b>' + results.response.venue.rating + '. <b>Tips: </b>' + results.response.venue.stats.tipCount + ' <button type="button" class="btn btn-link tips" id="tips' + results.response.venue.id + '" onclick="viewTips(this.id);"><b>View last top 10 tips</b></button> or <button type="button" class="btn btn-link addtips" id="adds' + results.response.venue.id + '" onclick="addTips(this.id);"><b>Add your own tip</b></button></p></div></div><div class="venueInfo" id="venueInfo' + results.response.venue.id + '"></div></div>');

	$('html,body').animate({
		scrollTop: $('#restResults').offset().top - 30
	});
}

function viewTips(theID) {
	var venueID = theID.slice(4);
	var wurl = 'https://api.foursquare.com/v2/venues/' + venueID + '/tips?sort=recent&v=20170101&oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: getTips,
		error: function error() {
			console.log('Error getting venue tips');
		}
	});

	function getTips(tipss) {
		var counttip = 10;
		if (counttip > tipss.response.tips.count) {
			counttip = tipss.response.tips.count;
		}
		if (tipss.response.tips.count > 0) {
			$('.venueInfo').html('');
			$('#venueInfo' + venueID).append('<p><b>Top 10 recent tips for this restaurant</b></p>');
			for (var i = 0; i < counttip; i++) {
				if (tipss.response.tips.items.length != 0) {
					var theDates = new Date(tipss.response.tips.items[i].createdAt * 1000);
					var theDate = theDates.toString().slice(0, 24);
					$('#venueInfo' + venueID).append('<div class="tipsDiv"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tipText">' + tipss.response.tips.items[i].text + '</div><div class="row"><div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">Created by: <i>' + tipss.response.tips.items[i].user.firstName + ' on ' + theDate + '</i></div><div class="col-xs-12 col-sm-12 col-md-5 col-lg-5"><a href="' + tipss.response.tips.items[i].canonicalUrl + '" class="tipLink text-right">View this tip at foursquare.com</a></div></div></div>');
				}
			}
			$('#venueInfo' + venueID).append('<div class="row"><div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div><div class="col-xs-10 col-sm-10 col-md-6 col-lg-6"><button type="button" class="btn btn-default center-block addtips addtipsbottom" id="add2' + venueID + '" onclick="addTips(this.id);"><b>Add your own tip</b></button></div><div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div></div>');
		}
		$('html,body').animate({
			scrollTop: $('#venueInfo' + venueID).offset().top - 20
		});
	}
}

function addTips(addID) {
	var venueID = addID.slice(4);
	$('.addTipDiv').html('');
	$('#venue' + venueID).append('<div class="row addTipDiv"><div class="col-xs-12 col-sm-12 col-md-10 col-lg-10"><label for="addedTip' + venueID + '">Add your tip here:</label><input id="addedTip' + venueID + '" type="text" class="form-control addedTip"><p class="tipInputRestriction">Tip should contain at least 10 symbols and not more than 100 symbols</p></></div><div class="col-md-2 col-lg-2"><button id="btn' + venueID + '" class="btn btn-default btnToAddTip" onclick="addTheTip(this.id);"><b>Add your tip</b></button>');
	$('html,body').animate({
		scrollTop: $('#addedTip' + venueID).offset().top - 100
	});
	$('#addedTip' + venueID).focus();
}

function addTheTip(theID) {
	var thevenueID = theID.slice(3);
	var thetext = $('#addedTip' + thevenueID).val();
	var thedata = 'venueId=' + thevenueID + '&text=' + thetext;
	var wurl = 'https://api.foursquare.com/v2/tips/add?v=20170107&oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD';
	$.ajax({
		type: 'POST',
		data: thedata,
		url: wurl,
		success: newTips,
		error: function error() {
			console.log('Error adding your tip');
		}
	});

	function newTips(newtip) {
		var theDates = new Date(newtip.response.tip.createdAt * 1000);
		var theDate = theDates.toString().slice(0, 24);
		$('#venueInfo' + thevenueID).prepend('<div class="tipsDiv"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tipText">' + newtip.response.tip.text + '</div><div class="row"><div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">Created by: <i>' + newtip.response.tip.user.firstName + ' on ' + theDate + '</i></div><div class="col-xs-12 col-sm-12 col-md-5 col-lg-5"><a href="' + newtip.response.tip.canonicalUrl + '" class="tipLink text-right">View this tip at foursquare.com</a></div></div></div>');
		$('html,body').animate({
			scrollTop: $('#venueInfo' + thevenueID).offset().top - 20
		});
	}
}

$(document).ready(function () {
	var wurl = 'js/categories.json';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: addCats,
		error: function error() {
			console.log('Can not get cats');
		}
	});
});

function addCats(cats) {
	$('#catList').html('');
	for (var i = 0; i < cats.Restaurants.length; i++) {
		$('#catList').append('<option value="' + cats.Restaurants[i].Name + '" data-value="' + cats.Restaurants[i].ID + '"></option>');
	}
}

function hideMobMenu() {
	$('#mobMenuButton').attr('aria-expanded', 'false');
}

$('#getLocationBtn').click(getLocation);
$('#findRestaurantBtn').click(findRestaurant);

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/swGetData.js').then(function (registration) {
		console.log('ServiceWorker registration', registration);
	}).catch(function (err) {
		console.log('ServiceWorker error: ' + err);
	});
}

//- endinject
//- inject:plugins

//- endinject
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8tIGluamVjdDpwYXJ0c1xudmFyIGxsO1xudmFyIHVzZXJUb2tlbjtcblxuZnVuY3Rpb24gZ2V0TG9jYXRpb24oKSB7XG5cdGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcblx0XHRuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKHNob3dQb3NpdGlvbiwgZXJyUG9zKTtcblx0fSBlbHNlIHtcblx0XHRhbGVydCgnR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2hvd1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG5cdHZhciB2dXJsO1xuXHR2YXIgY2hvc2VuUmVzdGF1cmFudCA9ICQoJyNyZXN0TmFtZUlucHV0JykudmFsKCk7XG5cdHZhciBjaG9zZW5DYXRlZ29yeVYgPSAkKCcjY2F0SW5wdXQnKS52YWwoKTtcblx0dmFyIGNob3NlbkNhdGVnb3J5ID0gJCgnI2NhdExpc3Qgb3B0aW9uW3ZhbHVlPVwiJyArIGNob3NlbkNhdGVnb3J5ViArICdcIl0nKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG5cdGxsID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICsgJywnICsgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcblx0aWYgKGNob3NlbkNhdGVnb3J5ViAhPSAnJyAmJiBjaG9zZW5SZXN0YXVyYW50ICE9ICcnKSB7XG5cdFx0dnVybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi92ZW51ZXMvc2VhcmNoP3Y9MjAxNzAxMDcmY2F0ZWdvcnlJZD0nICsgY2hvc2VuQ2F0ZWdvcnkgKyAnJmNsaWVudF9pZD1JWlFXM0gzUDIyQUJLUkJVVldYTkVaTExDWURFVkVRWUxNNDM0NTUyMVRUS0pBTUYmY2xpZW50X3NlY3JldD1YWUdPRklaTFVINExDMFRXWVBIQ0dNR1ZCNDIzMVlPUlAzVUdUUkxVWEJVS0szUkImbGltaXQ9MTAmbGw9JyArIGxsICsgJyZxdWVyeT0nICsgY2hvc2VuUmVzdGF1cmFudDtcblx0fSBlbHNlIGlmIChjaG9zZW5DYXRlZ29yeVYgPT0gJycgJiYgY2hvc2VuUmVzdGF1cmFudCAhPSAnJykge1xuXHRcdHZ1cmwgPSAnaHR0cHM6Ly9hcGkuZm91cnNxdWFyZS5jb20vdjIvdmVudWVzL3NlYXJjaD92PTIwMTcwMTA3JmNhdGVnb3J5SWQ9NGQ0YjcxMDVkNzU0YTA2Mzc0ZDgxMjU5JmNsaWVudF9pZD1JWlFXM0gzUDIyQUJLUkJVVldYTkVaTExDWURFVkVRWUxNNDM0NTUyMVRUS0pBTUYmY2xpZW50X3NlY3JldD1YWUdPRklaTFVINExDMFRXWVBIQ0dNR1ZCNDIzMVlPUlAzVUdUUkxVWEJVS0szUkImbGltaXQ9MTAmbGw9JyArIGxsO1xuXHR9IGVsc2UgaWYgKGNob3NlbkNhdGVnb3J5ViAhPSAnJyAmJiBjaG9zZW5SZXN0YXVyYW50ID09ICcnKSB7XG5cdFx0dnVybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi92ZW51ZXMvc2VhcmNoP3Y9MjAxNzAxMDcmY2F0ZWdvcnlJZD0nICsgY2hvc2VuQ2F0ZWdvcnkgKyAnJmNsaWVudF9pZD1JWlFXM0gzUDIyQUJLUkJVVldYTkVaTExDWURFVkVRWUxNNDM0NTUyMVRUS0pBTUYmY2xpZW50X3NlY3JldD1YWUdPRklaTFVINExDMFRXWVBIQ0dNR1ZCNDIzMVlPUlAzVUdUUkxVWEJVS0szUkImbGltaXQ9MTAmbGw9JyArIGxsICsgJyZxdWVyeT0nICsgY2hvc2VuUmVzdGF1cmFudDtcblx0fSBlbHNlIHtcblx0XHR2dXJsID0gJ2h0dHBzOi8vYXBpLmZvdXJzcXVhcmUuY29tL3YyL3ZlbnVlcy9zZWFyY2g/dj0yMDE3MDEwNyZjYXRlZ29yeUlkPTRkNGI3MTA1ZDc1NGEwNjM3NGQ4MTI1OSZjbGllbnRfaWQ9SVpRVzNIM1AyMkFCS1JCVVZXWE5FWkxMQ1lERVZFUVlMTTQzNDU1MjFUVEtKQU1GJmNsaWVudF9zZWNyZXQ9WFlHT0ZJWkxVSDRMQzBUV1lQSENHTUdWQjQyMzFZT1JQM1VHVFJMVVhCVUtLM1JCJmxpbWl0PTEwJmxsPScgKyBsbDtcblx0fVxuXG5cdCQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0dXJsOiB2dXJsLFxuXHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0c3VjY2VzczogZ2V0VGhlbUFsbCxcblx0XHRlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgZ2V0dGluZyB5b3VyIGxvY2F0aW9uJyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBlcnJQb3MoZXJycikge1xuXHRjb25zb2xlLmxvZyhlcnJyKTtcbn1cblxuZnVuY3Rpb24gZmluZFJlc3RhdXJhbnQoKSB7XG5cdHZhciB4dXJsO1xuXHR2YXIgY2hvc2VuQ2l0eSA9ICQoJyNjaXR5SW5wdXQnKS52YWwoKTtcblx0dmFyIGNob3NlbkNhdGVnb3J5ViA9ICQoJyNjYXRJbnB1dCcpLnZhbCgpO1xuXHR2YXIgY2hvc2VuQ2F0ZWdvcnkgPSAkKCcjY2F0TGlzdCBvcHRpb25bdmFsdWU9XCInICsgY2hvc2VuQ2F0ZWdvcnlWICsgJ1wiXScpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcblx0dmFyIGNob3NlblJlc3RhdXJhbnQgPSAkKCcjcmVzdE5hbWVJbnB1dCcpLnZhbCgpO1xuXHRpZiAoY2hvc2VuQ2l0eSAhPSAnJyAmJiBjaG9zZW5SZXN0YXVyYW50ID09ICcnKSB7XG5cdFx0aWYgKGNob3NlbkNhdGVnb3J5ViA9PSAnJykge1xuXHRcdFx0eHVybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi92ZW51ZXMvc2VhcmNoP3Y9MjAxNzAxMDcmY2F0ZWdvcnlJZD00ZDRiNzEwNWQ3NTRhMDYzNzRkODEyNTkmY2xpZW50X2lkPUlaUVczSDNQMjJBQktSQlVWV1hORVpMTENZREVWRVFZTE00MzQ1NTIxVFRLSkFNRiZjbGllbnRfc2VjcmV0PVhZR09GSVpMVUg0TEMwVFdZUEhDR01HVkI0MjMxWU9SUDNVR1RSTFVYQlVLSzNSQiZsaW1pdD0xMCZuZWFyPScgKyBjaG9zZW5DaXR5O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR4dXJsID0gJ2h0dHBzOi8vYXBpLmZvdXJzcXVhcmUuY29tL3YyL3ZlbnVlcy9zZWFyY2g/dj0yMDE3MDEwNyZjYXRlZ29yeUlkPScgKyBjaG9zZW5DYXRlZ29yeSArICcmY2xpZW50X2lkPUlaUVczSDNQMjJBQktSQlVWV1hORVpMTENZREVWRVFZTE00MzQ1NTIxVFRLSkFNRiZjbGllbnRfc2VjcmV0PVhZR09GSVpMVUg0TEMwVFdZUEhDR01HVkI0MjMxWU9SUDNVR1RSTFVYQlVLSzNSQiZsaW1pdD0xMCZuZWFyPScgKyBjaG9zZW5DaXR5O1xuXHRcdH1cblx0XHQkLmFqYXgoe1xuXHRcdFx0dHlwZTogJ0dFVCcsXG5cdFx0XHR1cmw6IHh1cmwsXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0c3VjY2VzczogZ2V0VGhlbUFsbCxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGZpbmRpbmcgdmVudWVzIG5lYXJieScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKGNob3NlbkNpdHkgIT0gJycgJiYgY2hvc2VuUmVzdGF1cmFudCAhPSAnJykge1xuXHRcdGlmIChjaG9zZW5DYXRlZ29yeVYgPT0gJycpIHtcblx0XHRcdHh1cmwgPSAnaHR0cHM6Ly9hcGkuZm91cnNxdWFyZS5jb20vdjIvdmVudWVzL3NlYXJjaD92PTIwMTcwMTA3JmNhdGVnb3J5SWQ9NGQ0YjcxMDVkNzU0YTA2Mzc0ZDgxMjU5JmNsaWVudF9pZD1JWlFXM0gzUDIyQUJLUkJVVldYTkVaTExDWURFVkVRWUxNNDM0NTUyMVRUS0pBTUYmY2xpZW50X3NlY3JldD1YWUdPRklaTFVINExDMFRXWVBIQ0dNR1ZCNDIzMVlPUlAzVUdUUkxVWEJVS0szUkImbGltaXQ9MTAmbmVhcj0nICsgY2hvc2VuQ2l0eSArICcmcXVlcnk9JyArIGNob3NlblJlc3RhdXJhbnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHh1cmwgPSAnaHR0cHM6Ly9hcGkuZm91cnNxdWFyZS5jb20vdjIvdmVudWVzL3NlYXJjaD92PTIwMTcwMTA3JmNhdGVnb3J5SWQ9JyArIGNob3NlbkNhdGVnb3J5ICsgJyZjbGllbnRfaWQ9SVpRVzNIM1AyMkFCS1JCVVZXWE5FWkxMQ1lERVZFUVlMTTQzNDU1MjFUVEtKQU1GJmNsaWVudF9zZWNyZXQ9WFlHT0ZJWkxVSDRMQzBUV1lQSENHTUdWQjQyMzFZT1JQM1VHVFJMVVhCVUtLM1JCJmxpbWl0PTEwJm5lYXI9JyArIGNob3NlbkNpdHkgKyAnJnF1ZXJ5PScgKyBjaG9zZW5SZXN0YXVyYW50O1xuXHRcdH1cblx0XHQkLmFqYXgoe1xuXHRcdFx0dHlwZTogJ0dFVCcsXG5cdFx0XHR1cmw6IHh1cmwsXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdFx0c3VjY2VzczogZ2V0VGhlbUFsbCxcblx0XHRcdGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGZpbmRpbmcgc2VsZWN0ZWQgdmVudWVzJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0YWxlcnQoJ1dlIGNhbiBub3QgZmluZCBhbnkgcmVzdGF1cmFudCB3aXRoIHByb3ZpZGVkIHNlYXJjaCBkYXRhJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0VGhlbUFsbChyZXN0cykge1xuXHQkKCcjcmVzdFJlc3VsdHMnKS5odG1sKCcnKTtcblx0JCgnI3Jlc3RSZXN1bHRzJykuYXBwZW5kKCc8aDM+Rm91bmQgcmVzdGF1cmFudHM8L2gzPicpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHJlc3RzLnJlc3BvbnNlLnZlbnVlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZlbnVlSW5mbyhyZXN0cy5yZXNwb25zZS52ZW51ZXNbaV0uaWQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHZlbnVlSW5mbyhpZCkge1xuXHR2YXIgd3VybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi92ZW51ZXMvJyArIGlkICsgJz9vYXV0aF90b2tlbj1KRFhMVkRTVUQxRlhFMU9LVEgyWUZBV1ZNRVZaRDNFSzU0WjNHT1hUMjBJRUJST0Qmdj0yMDE3MDEwNCc7XG5cdCQuYWpheCh7XG5cdFx0dHlwZTogJ0dFVCcsXG5cdFx0dXJsOiB3dXJsLFxuXHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0c3VjY2VzczogdmVudWVJbmZvUmVzdWx0LFxuXHRcdGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBnZXR0aW5nIHZlbnVlcyBpbmZvJyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB2ZW51ZUluZm9SZXN1bHQocmVzdWx0cykge1xuXHR2YXIgY2F0ZWdvID0gJyc7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5jYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHJlc3VsdHMucmVzcG9uc2UudmVudWUuY2F0ZWdvcmllc1tpXS5uYW1lICE9ICcnICYmIGkgPT0gMCkge1xuXHRcdFx0Y2F0ZWdvID0gY2F0ZWdvICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5jYXRlZ29yaWVzW2ldLm5hbWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNhdGVnbyA9IGNhdGVnbyArICcsICcgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLmNhdGVnb3JpZXNbaV0ubmFtZTtcblx0XHR9XG5cdH1cblx0dmFyIHRoZVN0YXR1cztcblx0aWYgKHJlc3VsdHMucmVzcG9uc2UudmVudWUuaG91cnMgJiYgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5ob3Vycy5zdGF0dXMgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHR0aGVTdGF0dXMgPSByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLmhvdXJzLnN0YXR1cztcblx0fSBlbHNlIHtcblx0XHR0aGVTdGF0dXMgPSAnbm90IGF2YWlsYWJsZSc7XG5cdH1cblx0JCgnI3Jlc3RSZXN1bHRzJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwidmVudWVcIiBpZD1cInZlbnVlJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuaWQgKyAnXCI+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMiBjb2wtbGctMTJcIj48aDQ+JyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUubmFtZSArICc8L2g0PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtNCBjb2wtbGctNFwiPjxpbWcgc3JjPVwiJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuYmVzdFBob3RvLnByZWZpeCArICczMDB4MzAwJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuYmVzdFBob3RvLnN1ZmZpeCArICdcIiBhbHQ9XCJQaG90byBvZiAnICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5uYW1lICsgJ1wiIGNsYXNzPVwiY2VudGVyLWJsb2NrXCI+PC9kaXY+PGRpdiBjbGFzcz1cImNvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTggY29sLWxnLThcIj48cD48Yj5DYXRlZ29yaWVzOjwvYj4gJyArIGNhdGVnbyArICc8L3A+PHA+PGI+QWRkcmVzczo8L2I+ICcgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLmxvY2F0aW9uLmFkZHJlc3MgKyAnLCAnICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5sb2NhdGlvbi5jaXR5ICsgJywgJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUubG9jYXRpb24uY291bnRyeSArICc8L3A+PHA+PGI+V29ya2luZyBob3VycyB0b2RheTogPC9iPicgKyB0aGVTdGF0dXMgKyAnPC9wPjxwPjxiPlJhdGluZzogPC9iPicgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLnJhdGluZyArICcuIDxiPlRpcHM6IDwvYj4nICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5zdGF0cy50aXBDb3VudCArICcgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmsgdGlwc1wiIGlkPVwidGlwcycgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLmlkICsgJ1wiIG9uY2xpY2s9XCJ2aWV3VGlwcyh0aGlzLmlkKTtcIj48Yj5WaWV3IGxhc3QgdG9wIDEwIHRpcHM8L2I+PC9idXR0b24+IG9yIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rIGFkZHRpcHNcIiBpZD1cImFkZHMnICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5pZCArICdcIiBvbmNsaWNrPVwiYWRkVGlwcyh0aGlzLmlkKTtcIj48Yj5BZGQgeW91ciBvd24gdGlwPC9iPjwvYnV0dG9uPjwvcD48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwidmVudWVJbmZvXCIgaWQ9XCJ2ZW51ZUluZm8nICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5pZCArICdcIj48L2Rpdj48L2Rpdj4nKTtcblxuXHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRzY3JvbGxUb3A6ICQoJyNyZXN0UmVzdWx0cycpLm9mZnNldCgpLnRvcCAtIDMwXG5cdH0pO1xufVxuXG5mdW5jdGlvbiB2aWV3VGlwcyh0aGVJRCkge1xuXHR2YXIgdmVudWVJRCA9IHRoZUlELnNsaWNlKDQpO1xuXHR2YXIgd3VybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi92ZW51ZXMvJyArIHZlbnVlSUQgKyAnL3RpcHM/c29ydD1yZWNlbnQmdj0yMDE3MDEwMSZvYXV0aF90b2tlbj1KRFhMVkRTVUQxRlhFMU9LVEgyWUZBV1ZNRVZaRDNFSzU0WjNHT1hUMjBJRUJST0QnO1xuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdHVybDogd3VybCxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdHN1Y2Nlc3M6IGdldFRpcHMsXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGdldHRpbmcgdmVudWUgdGlwcycpO1xuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZ2V0VGlwcyh0aXBzcykge1xuXHRcdHZhciBjb3VudHRpcCA9IDEwO1xuXHRcdGlmIChjb3VudHRpcCA+IHRpcHNzLnJlc3BvbnNlLnRpcHMuY291bnQpIHtcblx0XHRcdGNvdW50dGlwID0gdGlwc3MucmVzcG9uc2UudGlwcy5jb3VudDtcblx0XHR9XG5cdFx0aWYgKHRpcHNzLnJlc3BvbnNlLnRpcHMuY291bnQgPiAwKSB7XG5cdFx0XHQkKCcudmVudWVJbmZvJykuaHRtbCgnJyk7XG5cdFx0XHQkKCcjdmVudWVJbmZvJyArIHZlbnVlSUQpLmFwcGVuZCgnPHA+PGI+VG9wIDEwIHJlY2VudCB0aXBzIGZvciB0aGlzIHJlc3RhdXJhbnQ8L2I+PC9wPicpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudHRpcDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aXBzcy5yZXNwb25zZS50aXBzLml0ZW1zLmxlbmd0aCAhPSAwKSB7XG5cdFx0XHRcdFx0dmFyIHRoZURhdGVzID0gbmV3IERhdGUodGlwc3MucmVzcG9uc2UudGlwcy5pdGVtc1tpXS5jcmVhdGVkQXQgKiAxMDAwKTtcblx0XHRcdFx0XHR2YXIgdGhlRGF0ZSA9IHRoZURhdGVzLnRvU3RyaW5nKCkuc2xpY2UoMCwgMjQpO1xuXHRcdFx0XHRcdCQoJyN2ZW51ZUluZm8nICsgdmVudWVJRCkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwidGlwc0RpdlwiPjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtMTIgY29sLWxnLTEyIHRpcFRleHRcIj4nICsgdGlwc3MucmVzcG9uc2UudGlwcy5pdGVtc1tpXS50ZXh0ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtNyBjb2wtbGctN1wiPkNyZWF0ZWQgYnk6IDxpPicgKyB0aXBzcy5yZXNwb25zZS50aXBzLml0ZW1zW2ldLnVzZXIuZmlyc3ROYW1lICsgJyBvbiAnICsgdGhlRGF0ZSArICc8L2k+PC9kaXY+PGRpdiBjbGFzcz1cImNvbC14cy0xMiBjb2wtc20tMTIgY29sLW1kLTUgY29sLWxnLTVcIj48YSBocmVmPVwiJyArIHRpcHNzLnJlc3BvbnNlLnRpcHMuaXRlbXNbaV0uY2Fub25pY2FsVXJsICsgJ1wiIGNsYXNzPVwidGlwTGluayB0ZXh0LXJpZ2h0XCI+VmlldyB0aGlzIHRpcCBhdCBmb3Vyc3F1YXJlLmNvbTwvYT48L2Rpdj48L2Rpdj48L2Rpdj4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0JCgnI3ZlbnVlSW5mbycgKyB2ZW51ZUlEKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJyb3dcIj48ZGl2IGNsYXNzPVwiY29sLXhzLTEgY29sLXNtLTEgY29sLW1kLTMgY29sLWxnLTNcIj48L2Rpdj48ZGl2IGNsYXNzPVwiY29sLXhzLTEwIGNvbC1zbS0xMCBjb2wtbWQtNiBjb2wtbGctNlwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGNlbnRlci1ibG9jayBhZGR0aXBzIGFkZHRpcHNib3R0b21cIiBpZD1cImFkZDInICsgdmVudWVJRCArICdcIiBvbmNsaWNrPVwiYWRkVGlwcyh0aGlzLmlkKTtcIj48Yj5BZGQgeW91ciBvd24gdGlwPC9iPjwvYnV0dG9uPjwvZGl2PjxkaXYgY2xhc3M9XCJjb2wteHMtMSBjb2wtc20tMSBjb2wtbWQtMyBjb2wtbGctM1wiPjwvZGl2PjwvZGl2PicpO1xuXHRcdH1cblx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRcdHNjcm9sbFRvcDogJCgnI3ZlbnVlSW5mbycgKyB2ZW51ZUlEKS5vZmZzZXQoKS50b3AgLSAyMFxuXHRcdH0pO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFkZFRpcHMoYWRkSUQpIHtcblx0dmFyIHZlbnVlSUQgPSBhZGRJRC5zbGljZSg0KTtcblx0JCgnLmFkZFRpcERpdicpLmh0bWwoJycpO1xuXHQkKCcjdmVudWUnICsgdmVudWVJRCkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicm93IGFkZFRpcERpdlwiPjxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMCBjb2wtbGctMTBcIj48bGFiZWwgZm9yPVwiYWRkZWRUaXAnICsgdmVudWVJRCArICdcIj5BZGQgeW91ciB0aXAgaGVyZTo8L2xhYmVsPjxpbnB1dCBpZD1cImFkZGVkVGlwJyArIHZlbnVlSUQgKyAnXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBhZGRlZFRpcFwiPjxwIGNsYXNzPVwidGlwSW5wdXRSZXN0cmljdGlvblwiPlRpcCBzaG91bGQgY29udGFpbiBhdCBsZWFzdCAxMCBzeW1ib2xzIGFuZCBub3QgbW9yZSB0aGFuIDEwMCBzeW1ib2xzPC9wPjwvPjwvZGl2PjxkaXYgY2xhc3M9XCJjb2wtbWQtMiBjb2wtbGctMlwiPjxidXR0b24gaWQ9XCJidG4nICsgdmVudWVJRCArICdcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG5Ub0FkZFRpcFwiIG9uY2xpY2s9XCJhZGRUaGVUaXAodGhpcy5pZCk7XCI+PGI+QWRkIHlvdXIgdGlwPC9iPjwvYnV0dG9uPicpO1xuXHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHtcblx0XHRzY3JvbGxUb3A6ICQoJyNhZGRlZFRpcCcgKyB2ZW51ZUlEKS5vZmZzZXQoKS50b3AgLSAxMDBcblx0fSk7XG5cdCQoJyNhZGRlZFRpcCcgKyB2ZW51ZUlEKS5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBhZGRUaGVUaXAodGhlSUQpIHtcblx0dmFyIHRoZXZlbnVlSUQgPSB0aGVJRC5zbGljZSgzKTtcblx0dmFyIHRoZXRleHQgPSAkKCcjYWRkZWRUaXAnICsgdGhldmVudWVJRCkudmFsKCk7XG5cdHZhciB0aGVkYXRhID0gJ3ZlbnVlSWQ9JyArIHRoZXZlbnVlSUQgKyAnJnRleHQ9JyArIHRoZXRleHQ7XG5cdHZhciB3dXJsID0gJ2h0dHBzOi8vYXBpLmZvdXJzcXVhcmUuY29tL3YyL3RpcHMvYWRkP3Y9MjAxNzAxMDcmb2F1dGhfdG9rZW49SkRYTFZEU1VEMUZYRTFPS1RIMllGQVdWTUVWWkQzRUs1NFozR09YVDIwSUVCUk9EJztcblx0JC5hamF4KHtcblx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0ZGF0YTogdGhlZGF0YSxcblx0XHR1cmw6IHd1cmwsXG5cdFx0c3VjY2VzczogbmV3VGlwcyxcblx0XHRlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgYWRkaW5nIHlvdXIgdGlwJyk7XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBuZXdUaXBzKG5ld3RpcCkge1xuXHRcdHZhciB0aGVEYXRlcyA9IG5ldyBEYXRlKG5ld3RpcC5yZXNwb25zZS50aXAuY3JlYXRlZEF0ICogMTAwMCk7XG5cdFx0dmFyIHRoZURhdGUgPSB0aGVEYXRlcy50b1N0cmluZygpLnNsaWNlKDAsIDI0KTtcblx0XHQkKCcjdmVudWVJbmZvJyArIHRoZXZlbnVlSUQpLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJ0aXBzRGl2XCI+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC0xMiBjb2wtbGctMTIgdGlwVGV4dFwiPicgKyBuZXd0aXAucmVzcG9uc2UudGlwLnRleHQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cInJvd1wiPjxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTEyIGNvbC1tZC03IGNvbC1sZy03XCI+Q3JlYXRlZCBieTogPGk+JyArIG5ld3RpcC5yZXNwb25zZS50aXAudXNlci5maXJzdE5hbWUgKyAnIG9uICcgKyB0aGVEYXRlICsgJzwvaT48L2Rpdj48ZGl2IGNsYXNzPVwiY29sLXhzLTEyIGNvbC1zbS0xMiBjb2wtbWQtNSBjb2wtbGctNVwiPjxhIGhyZWY9XCInICsgbmV3dGlwLnJlc3BvbnNlLnRpcC5jYW5vbmljYWxVcmwgKyAnXCIgY2xhc3M9XCJ0aXBMaW5rIHRleHQtcmlnaHRcIj5WaWV3IHRoaXMgdGlwIGF0IGZvdXJzcXVhcmUuY29tPC9hPjwvZGl2PjwvZGl2PjwvZGl2PicpO1xuXHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0c2Nyb2xsVG9wOiAkKCcjdmVudWVJbmZvJyArIHRoZXZlbnVlSUQpLm9mZnNldCgpLnRvcCAtIDIwXG5cdFx0fSk7XG5cdH1cbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXHR2YXIgd3VybCA9ICdqcy9jYXRlZ29yaWVzLmpzb24nO1xuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdHVybDogd3VybCxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdHN1Y2Nlc3M6IGFkZENhdHMsXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0NhbiBub3QgZ2V0IGNhdHMnKTtcblx0XHR9XG5cdH0pO1xufSk7XG5cbmZ1bmN0aW9uIGFkZENhdHMoY2F0cykge1xuXHQkKCcjY2F0TGlzdCcpLmh0bWwoJycpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNhdHMuUmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcblx0XHQkKCcjY2F0TGlzdCcpLmFwcGVuZCgnPG9wdGlvbiB2YWx1ZT1cIicgKyBjYXRzLlJlc3RhdXJhbnRzW2ldLk5hbWUgKyAnXCIgZGF0YS12YWx1ZT1cIicgKyBjYXRzLlJlc3RhdXJhbnRzW2ldLklEICsgJ1wiPjwvb3B0aW9uPicpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGhpZGVNb2JNZW51KCkge1xuXHQkKCcjbW9iTWVudUJ1dHRvbicpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbn1cblxuJCgnI2dldExvY2F0aW9uQnRuJykuY2xpY2soZ2V0TG9jYXRpb24pO1xuJCgnI2ZpbmRSZXN0YXVyYW50QnRuJykuY2xpY2soZmluZFJlc3RhdXJhbnQpO1xuXG5pZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuXHRuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3N3R2V0RGF0YS5qcycpLnRoZW4oZnVuY3Rpb24gKHJlZ2lzdHJhdGlvbikge1xuXHRcdGNvbnNvbGUubG9nKCdTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbicsIHJlZ2lzdHJhdGlvbik7XG5cdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciBlcnJvcjogJyArIGVycik7XG5cdH0pO1xufVxuXG4vLy0gZW5kaW5qZWN0XG4vLy0gaW5qZWN0OnBsdWdpbnNcblxuLy8tIGVuZGluamVjdCJdLCJmaWxlIjoibWFpbi5qcyJ9
