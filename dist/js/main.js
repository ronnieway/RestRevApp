'use strict';

//- inject:parts
var ll;

function loadCountries() {
	var wurl = '../others/countries.json';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: setCountries,
		error: function error() {
			console.log("Something gonna wrong with data");
		}
	});

	function setCountries(countr) {
		$('#countriesList').html('');
		for (var i = 0; i < countr.Countries.length; i++) {
			$('#countriesList').append('<option value="' + countr.Countries[i].Country + '" data-value="' + countr.Countries[i].Code + '"></option>');
		}
	}
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, errPos);
	} else {
		alert('Geolocation is not supported by this browser.');
	}
}

function showPosition(position) {
	ll = position.coords.latitude + ',' + position.coords.longitude;
	var wurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=1SW1B3KW1RCV5HJRFVKM4MVSWWSW3DZO0QKDNYPGGE4TI2TI&client_secret=TFLDT221KFOZFYZD4QQROEPMRQ32YNSOMNQPSDEK4W514HJH&limit=10&ll=' + ll;
	$.ajax({
		type: 'GET',
		url: wurl,
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
	var lattt;
	var lonnn;
	var chosen = $('#countriesListInput').val();
	var chosenCountry = $('#countriesList option[value="' + chosen + '"]').attr('data-value');
	var chosenCity = $('#cityInput').val();
	var chosenRestaurant = $('#restNameInput').val();
	if (chosenCountry != '' && chosenCity != '' && chosenRestaurant == '') {
		var parseXml = function parseXml(xml) {
			var xxx = $(xml).find('geoname');
			var yyy = $(xml).find('totalResultsCount');
			var searchresults = yyy[0].innerHTML;
			console.log(searchresults);
			if (searchresults == 0) {
				alert('We can not find that city. Please check if it is named correctly');
				return false;
			}
			console.log(xxx[0].innerHTML);
			var zzz = xxx[0].innerHTML;
			var latt = zzz.split('<lat>');
			lattt = latt[1].slice(0, 5);
			var lonn = zzz.split('<lng>');
			lonnn = lonn[1].slice(0, 5);
			ll = lattt + ',' + lonnn;
			console.log(ll);
			var wurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=1SW1B3KW1RCV5HJRFVKM4MVSWWSW3DZO0QKDNYPGGE4TI2TI&client_secret=TFLDT221KFOZFYZD4QQROEPMRQ32YNSOMNQPSDEK4W514HJH&limit=10&near=' + chosenCity;
			console.log(wurl);
			$.ajax({
				type: 'GET',
				url: wurl,
				dataType: 'json',
				success: getThemAll,
				error: function error() {
					console.log('Error finding venues nearby');
				}
			});
		};

		var wurl = 'http://api.geonames.org/search?username=ronnieway&q=' + chosenCity + '&country=' + chosenCountry;
		$.ajax({
			type: 'GET',
			url: wurl,
			dataType: 'xml',
			success: parseXml,
			error: function error() {
				console.log('Error finding restaurant');
			}
		});

		return false;
	} else if (chosenCountry != '' && chosenCity != '' && chosenRestaurant != '') {
		var _wurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=1SW1B3KW1RCV5HJRFVKM4MVSWWSW3DZO0QKDNYPGGE4TI2TI&client_secret=TFLDT221KFOZFYZD4QQROEPMRQ32YNSOMNQPSDEK4W514HJH&limit=10&near=' + chosenCity + '&query=' + chosenRestaurant;
		$.ajax({
			type: 'GET',
			url: _wurl,
			dataType: 'json',
			success: getThemAll,
			error: function error() {
				console.log('Error finding selected venues');
			}
		});
	} else {
		alert('City or country is not chosen');
	}
}

function getThemAll(rests) {
	$('#restResults').html('');
	for (var i = 0; i < rests.response.venues.length; i++) {
		venueInfo(rests.response.venues[i].id);
	}
}

function venueInfo(id) {
	var wurl = 'https://api.foursquare.com/v2/venues/' + id + '?oauth_token=0ASZKCJDCQ0AEV1FUCDUYSSHME4EWHI2AWKTLAZSIJWVGO2N&v=20170104';
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
	$('#restResults').append('<div class="venue" id="venue' + results.response.venue.id + '"><div><h4>' + results.response.venue.name + '</h4></div><div><img src="' + results.response.venue.bestPhoto.prefix + '200x200' + results.response.venue.bestPhoto.suffix + '"></div><div><b>Address:</b> ' + results.response.venue.location.address + ', ' + results.response.venue.location.city + ', ' + results.response.venue.location.country + '</div><div><b>Rating: </b>' + results.response.venue.rating + '. <b>Tips: </b>' + results.response.venue.stats.tipCount + ' <a href="#" id="tips' + results.response.venue.id + '" class="tips" onclick="viewTips(this.id);">Viev tips</a>, <a href="#" id="adds' + results.response.venue.id + '" class="addtips" onclick="addTips(this.id);">Add tip</a></div><div class="venueInfo" id="venueInfo' + results.response.venue.id + '"></div></div>');
}

function viewTips(theID) {
	var venueID = theID.slice(4);
	var wurl = 'https://api.foursquare.com/v2/venues/' + venueID + '/tips?sort=recent&v=20170101&oauth_token=0ASZKCJDCQ0AEV1FUCDUYSSHME4EWHI2AWKTLAZSIJWVGO2N';
	console.log(wurl);
	console.log(venueID);
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
		console.log(tipss);
		var counttip = 10;
		if (counttip > tipss.response.tips.count) {
			counttip = tipss.response.tips.count;
		}
		if (tipss.response.tips.count > 0) {
			$('.venueInfo').html('');
			for (var i = 0; i < counttip; i++) {
				if (tipss.response.tips.items.length != 0) {
					$('#venueInfo' + venueID).append('<p>' + tipss.response.tips.items[i].text + '</p><p><a href="' + tipss.response.tips.items[i].canonicalUrl + '">View at foursquare site</a></p>');
				}
			}
		}
	}
}

function addTips(addID) {
	var venueID = addID.slice(4);
	$('#venue' + venueID).append('<p>Add your tip here (10 - 200 symbols).</p><input id="addedTip" type="text"></input><button id="btn' + venueID + '" onclick="addTheTip(this.id);">Add your tip</button>');
}

function addTheTip(theID) {
	var thevenueID = theID.slice(3);
	console.log(thevenueID);
	var thetext = $('#addedTip').val();
	var thedata = 'venueId=' + thevenueID + '&text=' + thetext;
	var wurl = 'https://api.foursquare.com/v2/tips/add?v=20170107&oauth_token=0ASZKCJDCQ0AEV1FUCDUYSSHME4EWHI2AWKTLAZSIJWVGO2N';
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
		console.log(newtip);
		$('#venueInfo' + thevenueID).prepend('<p>' + newtip.response.tip.text + '</p><p><a href="' + newtip.response.tip.canonicalUrl + '">View at foursquare site</a></p>');
	}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLy8tIGluamVjdDpwYXJ0c1xudmFyIGxsO1xuXG5mdW5jdGlvbiBsb2FkQ291bnRyaWVzKCkge1xuXHR2YXIgd3VybCA9ICcuLi9vdGhlcnMvY291bnRyaWVzLmpzb24nO1xuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdHVybDogd3VybCxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdHN1Y2Nlc3M6IHNldENvdW50cmllcyxcblx0XHRlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlNvbWV0aGluZyBnb25uYSB3cm9uZyB3aXRoIGRhdGFcIik7XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBzZXRDb3VudHJpZXMoY291bnRyKSB7XG5cdFx0JCgnI2NvdW50cmllc0xpc3QnKS5odG1sKCcnKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50ci5Db3VudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdCQoJyNjb3VudHJpZXNMaXN0JykuYXBwZW5kKCc8b3B0aW9uIHZhbHVlPVwiJyArIGNvdW50ci5Db3VudHJpZXNbaV0uQ291bnRyeSArICdcIiBkYXRhLXZhbHVlPVwiJyArIGNvdW50ci5Db3VudHJpZXNbaV0uQ29kZSArICdcIj48L29wdGlvbj4nKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gZ2V0TG9jYXRpb24oKSB7XG5cdGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcblx0XHRuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKHNob3dQb3NpdGlvbiwgZXJyUG9zKTtcblx0fSBlbHNlIHtcblx0XHRhbGVydCgnR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuJyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gc2hvd1Bvc2l0aW9uKHBvc2l0aW9uKSB7XG5cdGxsID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlICsgJywnICsgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcblx0dmFyIHd1cmwgPSAnaHR0cHM6Ly9hcGkuZm91cnNxdWFyZS5jb20vdjIvdmVudWVzL3NlYXJjaD92PTIwMTcwMTA3JmNhdGVnb3J5SWQ9NGQ0YjcxMDVkNzU0YTA2Mzc0ZDgxMjU5JmNsaWVudF9pZD0xU1cxQjNLVzFSQ1Y1SEpSRlZLTTRNVlNXV1NXM0RaTzBRS0ROWVBHR0U0VEkyVEkmY2xpZW50X3NlY3JldD1URkxEVDIyMUtGT1pGWVpENFFRUk9FUE1SUTMyWU5TT01OUVBTREVLNFc1MTRISkgmbGltaXQ9MTAmbGw9JyArIGxsO1xuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdHVybDogd3VybCxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdHN1Y2Nlc3M6IGdldFRoZW1BbGwsXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGdldHRpbmcgeW91ciBsb2NhdGlvbicpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZXJyUG9zKGVycnIpIHtcblx0Y29uc29sZS5sb2coZXJycik7XG59XG5cbmZ1bmN0aW9uIGZpbmRSZXN0YXVyYW50KCkge1xuXHR2YXIgbGF0dHQ7XG5cdHZhciBsb25ubjtcblx0dmFyIGNob3NlbiA9ICQoJyNjb3VudHJpZXNMaXN0SW5wdXQnKS52YWwoKTtcblx0dmFyIGNob3NlbkNvdW50cnkgPSAkKCcjY291bnRyaWVzTGlzdCBvcHRpb25bdmFsdWU9XCInICsgY2hvc2VuICsgJ1wiXScpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcblx0dmFyIGNob3NlbkNpdHkgPSAkKCcjY2l0eUlucHV0JykudmFsKCk7XG5cdHZhciBjaG9zZW5SZXN0YXVyYW50ID0gJCgnI3Jlc3ROYW1lSW5wdXQnKS52YWwoKTtcblx0aWYgKGNob3NlbkNvdW50cnkgIT0gJycgJiYgY2hvc2VuQ2l0eSAhPSAnJyAmJiBjaG9zZW5SZXN0YXVyYW50ID09ICcnKSB7XG5cdFx0dmFyIHBhcnNlWG1sID0gZnVuY3Rpb24gcGFyc2VYbWwoeG1sKSB7XG5cdFx0XHR2YXIgeHh4ID0gJCh4bWwpLmZpbmQoJ2dlb25hbWUnKTtcblx0XHRcdHZhciB5eXkgPSAkKHhtbCkuZmluZCgndG90YWxSZXN1bHRzQ291bnQnKTtcblx0XHRcdHZhciBzZWFyY2hyZXN1bHRzID0geXl5WzBdLmlubmVySFRNTDtcblx0XHRcdGNvbnNvbGUubG9nKHNlYXJjaHJlc3VsdHMpO1xuXHRcdFx0aWYgKHNlYXJjaHJlc3VsdHMgPT0gMCkge1xuXHRcdFx0XHRhbGVydCgnV2UgY2FuIG5vdCBmaW5kIHRoYXQgY2l0eS4gUGxlYXNlIGNoZWNrIGlmIGl0IGlzIG5hbWVkIGNvcnJlY3RseScpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyh4eHhbMF0uaW5uZXJIVE1MKTtcblx0XHRcdHZhciB6enogPSB4eHhbMF0uaW5uZXJIVE1MO1xuXHRcdFx0dmFyIGxhdHQgPSB6enouc3BsaXQoJzxsYXQ+Jyk7XG5cdFx0XHRsYXR0dCA9IGxhdHRbMV0uc2xpY2UoMCwgNSk7XG5cdFx0XHR2YXIgbG9ubiA9IHp6ei5zcGxpdCgnPGxuZz4nKTtcblx0XHRcdGxvbm5uID0gbG9ublsxXS5zbGljZSgwLCA1KTtcblx0XHRcdGxsID0gbGF0dHQgKyAnLCcgKyBsb25ubjtcblx0XHRcdGNvbnNvbGUubG9nKGxsKTtcblx0XHRcdHZhciB3dXJsID0gJ2h0dHBzOi8vYXBpLmZvdXJzcXVhcmUuY29tL3YyL3ZlbnVlcy9zZWFyY2g/dj0yMDE3MDEwNyZjYXRlZ29yeUlkPTRkNGI3MTA1ZDc1NGEwNjM3NGQ4MTI1OSZjbGllbnRfaWQ9MVNXMUIzS1cxUkNWNUhKUkZWS000TVZTV1dTVzNEWk8wUUtETllQR0dFNFRJMlRJJmNsaWVudF9zZWNyZXQ9VEZMRFQyMjFLRk9aRllaRDRRUVJPRVBNUlEzMllOU09NTlFQU0RFSzRXNTE0SEpIJmxpbWl0PTEwJm5lYXI9JyArIGNob3NlbkNpdHk7XG5cdFx0XHRjb25zb2xlLmxvZyh3dXJsKTtcblx0XHRcdCQuYWpheCh7XG5cdFx0XHRcdHR5cGU6ICdHRVQnLFxuXHRcdFx0XHR1cmw6IHd1cmwsXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXG5cdFx0XHRcdHN1Y2Nlc3M6IGdldFRoZW1BbGwsXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnRXJyb3IgZmluZGluZyB2ZW51ZXMgbmVhcmJ5Jyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHR2YXIgd3VybCA9ICdodHRwOi8vYXBpLmdlb25hbWVzLm9yZy9zZWFyY2g/dXNlcm5hbWU9cm9ubmlld2F5JnE9JyArIGNob3NlbkNpdHkgKyAnJmNvdW50cnk9JyArIGNob3NlbkNvdW50cnk7XG5cdFx0JC5hamF4KHtcblx0XHRcdHR5cGU6ICdHRVQnLFxuXHRcdFx0dXJsOiB3dXJsLFxuXHRcdFx0ZGF0YVR5cGU6ICd4bWwnLFxuXHRcdFx0c3VjY2VzczogcGFyc2VYbWwsXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBmaW5kaW5nIHJlc3RhdXJhbnQnKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSBlbHNlIGlmIChjaG9zZW5Db3VudHJ5ICE9ICcnICYmIGNob3NlbkNpdHkgIT0gJycgJiYgY2hvc2VuUmVzdGF1cmFudCAhPSAnJykge1xuXHRcdHZhciBfd3VybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi92ZW51ZXMvc2VhcmNoP3Y9MjAxNzAxMDcmY2F0ZWdvcnlJZD00ZDRiNzEwNWQ3NTRhMDYzNzRkODEyNTkmY2xpZW50X2lkPTFTVzFCM0tXMVJDVjVISlJGVktNNE1WU1dXU1czRFpPMFFLRE5ZUEdHRTRUSTJUSSZjbGllbnRfc2VjcmV0PVRGTERUMjIxS0ZPWkZZWkQ0UVFST0VQTVJRMzJZTlNPTU5RUFNERUs0VzUxNEhKSCZsaW1pdD0xMCZuZWFyPScgKyBjaG9zZW5DaXR5ICsgJyZxdWVyeT0nICsgY2hvc2VuUmVzdGF1cmFudDtcblx0XHQkLmFqYXgoe1xuXHRcdFx0dHlwZTogJ0dFVCcsXG5cdFx0XHR1cmw6IF93dXJsLFxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRcdHN1Y2Nlc3M6IGdldFRoZW1BbGwsXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdFcnJvciBmaW5kaW5nIHNlbGVjdGVkIHZlbnVlcycpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGFsZXJ0KCdDaXR5IG9yIGNvdW50cnkgaXMgbm90IGNob3NlbicpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1BbGwocmVzdHMpIHtcblx0JCgnI3Jlc3RSZXN1bHRzJykuaHRtbCgnJyk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdHMucmVzcG9uc2UudmVudWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmVudWVJbmZvKHJlc3RzLnJlc3BvbnNlLnZlbnVlc1tpXS5pZCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdmVudWVJbmZvKGlkKSB7XG5cdHZhciB3dXJsID0gJ2h0dHBzOi8vYXBpLmZvdXJzcXVhcmUuY29tL3YyL3ZlbnVlcy8nICsgaWQgKyAnP29hdXRoX3Rva2VuPTBBU1pLQ0pEQ1EwQUVWMUZVQ0RVWVNTSE1FNEVXSEkyQVdLVExBWlNJSldWR08yTiZ2PTIwMTcwMTA0Jztcblx0JC5hamF4KHtcblx0XHR0eXBlOiAnR0VUJyxcblx0XHR1cmw6IHd1cmwsXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcblx0XHRzdWNjZXNzOiB2ZW51ZUluZm9SZXN1bHQsXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGdldHRpbmcgdmVudWVzIGluZm8nKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHZlbnVlSW5mb1Jlc3VsdChyZXN1bHRzKSB7XG5cdCQoJyNyZXN0UmVzdWx0cycpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInZlbnVlXCIgaWQ9XCJ2ZW51ZScgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLmlkICsgJ1wiPjxkaXY+PGg0PicgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLm5hbWUgKyAnPC9oND48L2Rpdj48ZGl2PjxpbWcgc3JjPVwiJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuYmVzdFBob3RvLnByZWZpeCArICcyMDB4MjAwJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuYmVzdFBob3RvLnN1ZmZpeCArICdcIj48L2Rpdj48ZGl2PjxiPkFkZHJlc3M6PC9iPiAnICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5sb2NhdGlvbi5hZGRyZXNzICsgJywgJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUubG9jYXRpb24uY2l0eSArICcsICcgKyByZXN1bHRzLnJlc3BvbnNlLnZlbnVlLmxvY2F0aW9uLmNvdW50cnkgKyAnPC9kaXY+PGRpdj48Yj5SYXRpbmc6IDwvYj4nICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5yYXRpbmcgKyAnLiA8Yj5UaXBzOiA8L2I+JyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuc3RhdHMudGlwQ291bnQgKyAnIDxhIGhyZWY9XCIjXCIgaWQ9XCJ0aXBzJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuaWQgKyAnXCIgY2xhc3M9XCJ0aXBzXCIgb25jbGljaz1cInZpZXdUaXBzKHRoaXMuaWQpO1wiPlZpZXYgdGlwczwvYT4sIDxhIGhyZWY9XCIjXCIgaWQ9XCJhZGRzJyArIHJlc3VsdHMucmVzcG9uc2UudmVudWUuaWQgKyAnXCIgY2xhc3M9XCJhZGR0aXBzXCIgb25jbGljaz1cImFkZFRpcHModGhpcy5pZCk7XCI+QWRkIHRpcDwvYT48L2Rpdj48ZGl2IGNsYXNzPVwidmVudWVJbmZvXCIgaWQ9XCJ2ZW51ZUluZm8nICsgcmVzdWx0cy5yZXNwb25zZS52ZW51ZS5pZCArICdcIj48L2Rpdj48L2Rpdj4nKTtcbn1cblxuZnVuY3Rpb24gdmlld1RpcHModGhlSUQpIHtcblx0dmFyIHZlbnVlSUQgPSB0aGVJRC5zbGljZSg0KTtcblx0dmFyIHd1cmwgPSAnaHR0cHM6Ly9hcGkuZm91cnNxdWFyZS5jb20vdjIvdmVudWVzLycgKyB2ZW51ZUlEICsgJy90aXBzP3NvcnQ9cmVjZW50JnY9MjAxNzAxMDEmb2F1dGhfdG9rZW49MEFTWktDSkRDUTBBRVYxRlVDRFVZU1NITUU0RVdISTJBV0tUTEFaU0lKV1ZHTzJOJztcblx0Y29uc29sZS5sb2cod3VybCk7XG5cdGNvbnNvbGUubG9nKHZlbnVlSUQpO1xuXHQkLmFqYXgoe1xuXHRcdHR5cGU6ICdHRVQnLFxuXHRcdHVybDogd3VybCxcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxuXHRcdHN1Y2Nlc3M6IGdldFRpcHMsXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGdldHRpbmcgdmVudWUgdGlwcycpO1xuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZ2V0VGlwcyh0aXBzcykge1xuXHRcdGNvbnNvbGUubG9nKHRpcHNzKTtcblx0XHR2YXIgY291bnR0aXAgPSAxMDtcblx0XHRpZiAoY291bnR0aXAgPiB0aXBzcy5yZXNwb25zZS50aXBzLmNvdW50KSB7XG5cdFx0XHRjb3VudHRpcCA9IHRpcHNzLnJlc3BvbnNlLnRpcHMuY291bnQ7XG5cdFx0fVxuXHRcdGlmICh0aXBzcy5yZXNwb25zZS50aXBzLmNvdW50ID4gMCkge1xuXHRcdFx0JCgnLnZlbnVlSW5mbycpLmh0bWwoJycpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudHRpcDsgaSsrKSB7XG5cdFx0XHRcdGlmICh0aXBzcy5yZXNwb25zZS50aXBzLml0ZW1zLmxlbmd0aCAhPSAwKSB7XG5cdFx0XHRcdFx0JCgnI3ZlbnVlSW5mbycgKyB2ZW51ZUlEKS5hcHBlbmQoJzxwPicgKyB0aXBzcy5yZXNwb25zZS50aXBzLml0ZW1zW2ldLnRleHQgKyAnPC9wPjxwPjxhIGhyZWY9XCInICsgdGlwc3MucmVzcG9uc2UudGlwcy5pdGVtc1tpXS5jYW5vbmljYWxVcmwgKyAnXCI+VmlldyBhdCBmb3Vyc3F1YXJlIHNpdGU8L2E+PC9wPicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFkZFRpcHMoYWRkSUQpIHtcblx0dmFyIHZlbnVlSUQgPSBhZGRJRC5zbGljZSg0KTtcblx0JCgnI3ZlbnVlJyArIHZlbnVlSUQpLmFwcGVuZCgnPHA+QWRkIHlvdXIgdGlwIGhlcmUgKDEwIC0gMjAwIHN5bWJvbHMpLjwvcD48aW5wdXQgaWQ9XCJhZGRlZFRpcFwiIHR5cGU9XCJ0ZXh0XCI+PC9pbnB1dD48YnV0dG9uIGlkPVwiYnRuJyArIHZlbnVlSUQgKyAnXCIgb25jbGljaz1cImFkZFRoZVRpcCh0aGlzLmlkKTtcIj5BZGQgeW91ciB0aXA8L2J1dHRvbj4nKTtcbn1cblxuZnVuY3Rpb24gYWRkVGhlVGlwKHRoZUlEKSB7XG5cdHZhciB0aGV2ZW51ZUlEID0gdGhlSUQuc2xpY2UoMyk7XG5cdGNvbnNvbGUubG9nKHRoZXZlbnVlSUQpO1xuXHR2YXIgdGhldGV4dCA9ICQoJyNhZGRlZFRpcCcpLnZhbCgpO1xuXHR2YXIgdGhlZGF0YSA9ICd2ZW51ZUlkPScgKyB0aGV2ZW51ZUlEICsgJyZ0ZXh0PScgKyB0aGV0ZXh0O1xuXHR2YXIgd3VybCA9ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi90aXBzL2FkZD92PTIwMTcwMTA3Jm9hdXRoX3Rva2VuPTBBU1pLQ0pEQ1EwQUVWMUZVQ0RVWVNTSE1FNEVXSEkyQVdLVExBWlNJSldWR08yTic7XG5cdCQuYWpheCh7XG5cdFx0dHlwZTogJ1BPU1QnLFxuXHRcdGRhdGE6IHRoZWRhdGEsXG5cdFx0dXJsOiB3dXJsLFxuXHRcdHN1Y2Nlc3M6IG5ld1RpcHMsXG5cdFx0ZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yIGFkZGluZyB5b3VyIHRpcCcpO1xuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gbmV3VGlwcyhuZXd0aXApIHtcblx0XHRjb25zb2xlLmxvZyhuZXd0aXApO1xuXHRcdCQoJyN2ZW51ZUluZm8nICsgdGhldmVudWVJRCkucHJlcGVuZCgnPHA+JyArIG5ld3RpcC5yZXNwb25zZS50aXAudGV4dCArICc8L3A+PHA+PGEgaHJlZj1cIicgKyBuZXd0aXAucmVzcG9uc2UudGlwLmNhbm9uaWNhbFVybCArICdcIj5WaWV3IGF0IGZvdXJzcXVhcmUgc2l0ZTwvYT48L3A+Jyk7XG5cdH1cbn1cblxuJCgnI2dldExvY2F0aW9uQnRuJykuY2xpY2soZ2V0TG9jYXRpb24pO1xuJCgnI2ZpbmRSZXN0YXVyYW50QnRuJykuY2xpY2soZmluZFJlc3RhdXJhbnQpO1xuaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcblx0bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy9zd0dldERhdGEuanMnKS50aGVuKGZ1bmN0aW9uIChyZWdpc3RyYXRpb24pIHtcblx0XHRjb25zb2xlLmxvZygnU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24nLCByZWdpc3RyYXRpb24pO1xuXHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0Y29uc29sZS5sb2coJ1NlcnZpY2VXb3JrZXIgZXJyb3I6ICcgKyBlcnIpO1xuXHR9KTtcbn1cblxuLy8tIGVuZGluamVjdFxuLy8tIGluamVjdDpwbHVnaW5zXG5cbi8vLSBlbmRpbmplY3QiXSwiZmlsZSI6Im1haW4uanMifQ==
