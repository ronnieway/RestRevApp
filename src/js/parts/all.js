var ll;

function loadCountries() {
	let wurl = '../others/countries.json';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: setCountries,
		error: function() {
			console.log("Something gonna wrong with data");
		}
	});

	function setCountries(countr) {
		$('#countriesList').html('');
		for (let i=0; i< countr.Countries.length; i++) {
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
	let wurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=1SW1B3KW1RCV5HJRFVKM4MVSWWSW3DZO0QKDNYPGGE4TI2TI&client_secret=TFLDT221KFOZFYZD4QQROEPMRQ32YNSOMNQPSDEK4W514HJH&limit=10&ll=' + ll;
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: getThemAll,
		error: function() {
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
	let chosen = $('#countriesListInput').val();
	var chosenCountry = $('#countriesList option[value="' + chosen + '"]').attr('data-value');
	var chosenCity = $('#cityInput').val();
	var chosenRestaurant = $('#restNameInput').val();
	if (chosenCountry != '' && chosenCity != '' && chosenRestaurant == '') {
		let wurl = 'http://api.geonames.org/search?username=ronnieway&q=' + chosenCity + '&country=' + chosenCountry;
		$.ajax({
			type: 'GET',
			url: wurl,
			dataType: 'xml',
			success: parseXml,
			error: function() {
				console.log('Error finding restaurant');
			}
		});

		function parseXml(xml) {
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
			lattt = latt[1].slice(0,5);
			var lonn = zzz.split('<lng>');
			lonnn = lonn[1].slice(0,5);
			ll = lattt + ',' + lonnn;
			console.log(ll); 
			let wurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=1SW1B3KW1RCV5HJRFVKM4MVSWWSW3DZO0QKDNYPGGE4TI2TI&client_secret=TFLDT221KFOZFYZD4QQROEPMRQ32YNSOMNQPSDEK4W514HJH&limit=10&near=' + chosenCity;
			console.log(wurl);
			$.ajax({
				type: 'GET',
				url: wurl,
				dataType: 'json',
				success: getThemAll,
				error: function() {
					console.log('Error finding venues nearby');
				}
			});
		}
		return false;
	} else if (chosenCountry != '' && chosenCity != '' && chosenRestaurant != '') { 
		let wurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=1SW1B3KW1RCV5HJRFVKM4MVSWWSW3DZO0QKDNYPGGE4TI2TI&client_secret=TFLDT221KFOZFYZD4QQROEPMRQ32YNSOMNQPSDEK4W514HJH&limit=10&near=' + chosenCity + '&query=' + chosenRestaurant;
		$.ajax({
			type: 'GET',
			url: wurl,
			dataType: 'json',
			success: getThemAll,
			error: function() {
				console.log('Error finding selected venues');
			}
		});
	} else {
		alert('City or country is not chosen');
	}
}

function getThemAll(rests) {
	$('#restResults').html('');
	for (let i=0; i<rests.response.venues.length; i++) {
		venueInfo(rests.response.venues[i].id);
	}
}

function venueInfo(id) {
	let wurl = 'https://api.foursquare.com/v2/venues/' + id + '?oauth_token=0ASZKCJDCQ0AEV1FUCDUYSSHME4EWHI2AWKTLAZSIJWVGO2N&v=20170104';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: venueInfoResult,
		error: function() {
			console.log('Error getting venues info');
		}
	});
	return false;
}

function venueInfoResult(results) {
	$('#restResults').append('<div class="venue" id="venue' + results.response.venue.id + '"><div><h4>' + results.response.venue.name + '</h4></div><div><img src="' + results.response.venue.bestPhoto.prefix + '200x200' + results.response.venue.bestPhoto.suffix + '"></div><div><b>Address:</b> ' + results.response.venue.location.address + ', ' + results.response.venue.location.city + ', ' + results.response.venue.location.country + '</div><div><b>Rating: </b>' + results.response.venue.rating + '. <b>Tips: </b>' + results.response.venue.stats.tipCount + ' <a href="#" id="tips' + results.response.venue.id + '" class="tips" onclick="viewTips(this.id);">Viev tips</a>, <a href="#" id="adds' + results.response.venue.id + '" class="addtips" onclick="addTips(this.id);">Add tip</a></div><div class="venueInfo" id="venueInfo' + results.response.venue.id + '"></div></div>');
}

function viewTips(theID) {
	let venueID = theID.slice(4);	
	let wurl = 'https://api.foursquare.com/v2/venues/' + venueID + '/tips?sort=recent&v=20170101&oauth_token=0ASZKCJDCQ0AEV1FUCDUYSSHME4EWHI2AWKTLAZSIJWVGO2N';
	console.log(wurl);
	console.log(venueID);
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: getTips,
		error: function() {
			console.log('Error getting venue tips');
		}
	});

	function getTips(tipss) {
		console.log(tipss);
		let counttip = 10;
		if (counttip > tipss.response.tips.count) {
			counttip = tipss.response.tips.count;
		}
		if (tipss.response.tips.count > 0) {
			$('.venueInfo').html('');
			for (let i=0; i<counttip; i++) {
				if (tipss.response.tips.items.length != 0) {
					$('#venueInfo' + venueID).append('<p>' + tipss.response.tips.items[i].text + '</p><p><a href="' + tipss.response.tips.items[i].canonicalUrl + '">View at foursquare site</a></p>');
				}
			}
		}
	}
}

function addTips (addID) {
	let venueID = addID.slice(4);
	$('#venue' + venueID).append('<p>Add your tip here (10 - 200 symbols).</p><input id="addedTip" type="text"></input><button id="btn' + venueID + '" onclick="addTheTip(this.id);">Add your tip</button>');
}

function addTheTip(theID) {	
	let thevenueID = theID.slice(3);
	console.log(thevenueID);
	let thetext = $('#addedTip').val();
	let thedata = 'venueId=' + thevenueID + '&text=' + thetext;
	let wurl = 'https://api.foursquare.com/v2/tips/add?v=20170107&oauth_token=0ASZKCJDCQ0AEV1FUCDUYSSHME4EWHI2AWKTLAZSIJWVGO2N';
	$.ajax({
		type: 'POST',
		data: thedata,
		url: wurl,
		success: newTips,
		error: function() {
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