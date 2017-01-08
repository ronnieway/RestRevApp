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
	}else if (chosenCategoryV != '' && chosenRestaurant == '') {
		vurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=' + chosenCategory + '&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll=' + ll + '&query=' + chosenRestaurant;
	} else {
		vurl = 'https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll=' + ll;
	}
	
	$.ajax({
		type: 'GET',
		url: vurl,
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
			error: function() {
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
			error: function() {
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
	for (let i=0; i<rests.response.venues.length; i++) {
		venueInfo(rests.response.venues[i].id);
	}
}

function venueInfo(id) {
	let wurl = 'https://api.foursquare.com/v2/venues/' + id + '?oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD&v=20170104';
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
	var catego = '';
	for (let i=0; i<results.response.venue.categories.length; i++) {
		if (results.response.venue.categories[i].name != '' && i == 0) {
			catego = catego + results.response.venue.categories[i].name;
		} else {
			catego = catego + ', ' + results.response.venue.categories[i].name;
		}
	}
	var theStatus;
	if(results.response.venue.hours && results.response.venue.hours.status != 'undefined'){
		theStatus = results.response.venue.hours.status;
	} else {
		theStatus ='not available';
	}
	$('#restResults').append('<div class="venue" id="venue' + results.response.venue.id + '"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><h4>' + results.response.venue.name + '</h4></div></div><div class="row"><div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"><img src="' + results.response.venue.bestPhoto.prefix + '300x300' + results.response.venue.bestPhoto.suffix + '" alt="Photo of ' + results.response.venue.name + '" class="center-block"></div><div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"><p><b>Categories:</b> ' + catego + '</p><p><b>Address:</b> ' + results.response.venue.location.address + ', ' + results.response.venue.location.city + ', ' + results.response.venue.location.country + '</p><p><b>Working hours today: </b>' + theStatus + '</p><p><b>Rating: </b>' + results.response.venue.rating + '. <b>Tips: </b>' + results.response.venue.stats.tipCount + ' <button type="button" class="btn btn-link tips" id="tips' + results.response.venue.id + '" onclick="viewTips(this.id);"><b>View last top 10 tips</b></button> or <button type="button" class="btn btn-link addtips" id="adds' + results.response.venue.id + '" onclick="addTips(this.id);"><b>Add your own tip</b></button></p></div></div><div class="venueInfo" id="venueInfo' + results.response.venue.id + '"></div></div>');

	$('html,body').animate({
		scrollTop: $('#restResults').offset().top -30
	});
}

function viewTips(theID) {
	let venueID = theID.slice(4);	
	let wurl = 'https://api.foursquare.com/v2/venues/' + venueID + '/tips?sort=recent&v=20170101&oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD';
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
		let counttip = 10;
		if (counttip > tipss.response.tips.count) {
			counttip = tipss.response.tips.count;
		}
		if (tipss.response.tips.count > 0) {
			$('.venueInfo').html('');
			$('#venueInfo' + venueID).append('<p><b>Top 10 recent tips for this restaurant</b></p>');
			for (let i=0; i<counttip; i++) {
				if (tipss.response.tips.items.length != 0) {
					var theDates = new Date (tipss.response.tips.items[i].createdAt * 1000);
					var theDate = theDates.toString().slice(0,24);
					$('#venueInfo' + venueID).append('<div class="tipsDiv"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tipText">' + tipss.response.tips.items[i].text + '</div><div class="row"><div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">Created by: <i>' + tipss.response.tips.items[i].user.firstName + ' on '+ theDate + '</i></div><div class="col-xs-12 col-sm-12 col-md-5 col-lg-5"><a href="' + tipss.response.tips.items[i].canonicalUrl + '" class="tipLink text-right">View this tip at foursquare.com</a></div></div></div>');
				}
			}
			$('#venueInfo' + venueID).append('<div class="row"><div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div><div class="col-xs-10 col-sm-10 col-md-6 col-lg-6"><button type="button" class="btn btn-default center-block addtips addtipsbottom" id="add2' + venueID + '" onclick="addTips(this.id);"><b>Add your own tip</b></button></div><div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div></div>');
		}
		$('html,body').animate({
			scrollTop: $('#venueInfo' + venueID).offset().top -20
		});
	}
}

function addTips (addID) {
	let venueID = addID.slice(4);
	$('.addTipDiv').html('');
	$('#venue' + venueID).append('<div class="row addTipDiv"><div class="col-xs-12 col-sm-12 col-md-10 col-lg-10"><label for="addedTip' + venueID + '">Add your tip here:</label><input id="addedTip' + venueID + '" type="text" class="form-control addedTip"><p class="tipInputRestriction">Tip should contain at least 10 symbols and not more than 100 symbols</p></></div><div class="col-md-2 col-lg-2"><button id="btn' + venueID + '" class="btn btn-default btnToAddTip" onclick="addTheTip(this.id);"><b>Add your tip</b></button>');
	$('html,body').animate({
		scrollTop: $('#addedTip' + venueID).offset().top -100
	});
	$('#addedTip' + venueID).focus();
}

function addTheTip(theID) {	
	let thevenueID = theID.slice(3);
	let thetext = $('#addedTip' + thevenueID).val();
	let thedata = 'venueId=' + thevenueID + '&text=' + thetext;
	let wurl = 'https://api.foursquare.com/v2/tips/add?v=20170107&oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD';
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
		var theDates = new Date (newtip.response.tip.createdAt * 1000);
		var theDate = theDates.toString().slice(0,24);
		$('#venueInfo' + thevenueID).prepend('<div class="tipsDiv"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tipText">' + newtip.response.tip.text + '</div><div class="row"><div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">Created by: <i>' + newtip.response.tip.user.firstName + ' on '+ theDate + '</i></div><div class="col-xs-12 col-sm-12 col-md-5 col-lg-5"><a href="' + newtip.response.tip.canonicalUrl + '" class="tipLink text-right">View this tip at foursquare.com</a></div></div></div>');
		$('html,body').animate({
			scrollTop: $('#venueInfo' + thevenueID).offset().top -20
		});
	}	
}

$(document).ready(function() {
	let wurl = 'js/categories.json';
	$.ajax({
		type: 'GET',
		url: wurl,
		dataType: 'json',
		success: addCats,
		error: function() {
			console.log('Can not get cats');
		}
	});
});

function addCats(cats) {
	$('#catList').html('');
	for (let i=0; i< cats.Restaurants.length; i++) {
		$('#catList').append('<option value="' + cats.Restaurants[i].Name + '" data-value="' + cats.Restaurants[i].ID + '"></option>');
	}
}

function hideMobMenu() {
	$('#mobMenuButton').attr( 'aria-expanded', 'false');
}


$('#getLocationBtn').click(getLocation);
$('#findRestaurantBtn').click(findRestaurant);

if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/swGetData.js')
		.then(function(registration) {
			console.log('ServiceWorker registration', registration);
		}).catch(function(err) {
			console.log('ServiceWorker error: ' + err);
		});
}

//- endinject
//- inject:plugins

//- endinject
