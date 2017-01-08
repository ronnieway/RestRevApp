'use strict';var ll,userToken;function getLocation(){if(navigator.geolocation){navigator.geolocation.getCurrentPosition(showPosition,errPos)}else{alert('Geolocation is not supported by this browser.')}}function showPosition(a){var b,c=$('#restNameInput').val(),d=$('#catInput').val(),e=$('#catList option[value="'+d+'"]').attr('data-value');ll=a.coords.latitude+','+a.coords.longitude;if(d!=''&&c!=''){b='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId='+e+'&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll='+ll+'&query='+c}else if(d==''&&c!=''){b='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll='+ll}else if(d!=''&&c==''){b='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId='+e+'&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll='+ll+'&query='+c}else{b='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&ll='+ll}$.ajax({type:'GET',url:b,dataType:'json',success:getThemAll,error:()=>{console.log('Error getting your location')}});return!1}function errPos(a){console.log(a)}function findRestaurant(){var a,b=$('#cityInput').val(),c=$('#catInput').val(),d=$('#catList option[value="'+c+'"]').attr('data-value'),e=$('#restNameInput').val();if(b!=''&&e==''){if(c==''){a='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near='+b}else{a='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId='+d+'&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near='+b}$.ajax({type:'GET',url:a,dataType:'json',success:getThemAll,error:()=>{console.log('Error finding venues nearby')}})}else if(b!=''&&e!=''){if(c==''){a='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId=4d4b7105d754a06374d81259&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near='+b+'&query='+e}else{a='https://api.foursquare.com/v2/venues/search?v=20170107&categoryId='+d+'&client_id=IZQW3H3P22ABKRBUVWXNEZLLCYDEVEQYLM4345521TTKJAMF&client_secret=XYGOFIZLUH4LC0TWYPHCGMGVB4231YORP3UGTRLUXBUKK3RB&limit=10&near='+b+'&query='+e}$.ajax({type:'GET',url:a,dataType:'json',success:getThemAll,error:()=>{console.log('Error finding selected venues')}})}else{alert('We can not find any restaurant with provided search data')}}function getThemAll(a){$('#restResults').html('');$('#restResults').append('<h3>Found restaurants</h3>');for(var i=0;i<a.response.venues.length;i++){venueInfo(a.response.venues[i].id)}}function venueInfo(a){var b='https://api.foursquare.com/v2/venues/'+a+'?oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD&v=20170104';$.ajax({type:'GET',url:b,dataType:'json',success:venueInfoResult,error:()=>{console.log('Error getting venues info')}});return!1}function venueInfoResult(a){var b='';for(var i=0;i<a.response.venue.categories.length;i++){if(a.response.venue.categories[i].name!=''&&i==0){b=b+a.response.venue.categories[i].name}else{b=b+', '+a.response.venue.categories[i].name}}var c;if(a.response.venue.hours&&a.response.venue.hours.status!='undefined'){c=a.response.venue.hours.status}else{c='not available'}$('#restResults').append('<div class="venue" id="venue'+a.response.venue.id+'"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><h4>'+a.response.venue.name+'</h4></div></div><div class="row"><div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"><img src="'+a.response.venue.bestPhoto.prefix+'300x300'+a.response.venue.bestPhoto.suffix+'" alt="Photo of '+a.response.venue.name+'" class="center-block"></div><div class="col-xs-12 col-sm-12 col-md-8 col-lg-8"><p><b>Categories:</b> '+b+'</p><p><b>Address:</b> '+a.response.venue.location.address+', '+a.response.venue.location.city+', '+a.response.venue.location.country+'</p><p><b>Working hours today: </b>'+c+'</p><p><b>Rating: </b>'+a.response.venue.rating+'. <b>Tips: </b>'+a.response.venue.stats.tipCount+' <button type="button" class="btn btn-link tips" id="tips'+a.response.venue.id+'" onclick="viewTips(this.id);"><b>View last top 10 tips</b></button> or <button type="button" class="btn btn-link addtips" id="adds'+a.response.venue.id+'" onclick="addTips(this.id);"><b>Add your own tip</b></button></p></div></div><div class="venueInfo" id="venueInfo'+a.response.venue.id+'"></div></div>');$('html,body').animate({scrollTop:$('#restResults').offset().top-30})}function viewTips(a){var c=a.slice(4),d='https://api.foursquare.com/v2/venues/'+c+'/tips?sort=recent&v=20170101&oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD';$.ajax({type:'GET',url:d,dataType:'json',success:b,error:()=>{console.log('Error getting venue tips')}});function b(e){var f=10;if(f>e.response.tips.count){f=e.response.tips.count}if(e.response.tips.count>0){$('.venueInfo').html('');$('#venueInfo'+c).append('<p><b>Top 10 recent tips for this restaurant</b></p>');for(var i=0;i<f;i++){if(e.response.tips.items.length!=0){var g=new Date(e.response.tips.items[i].createdAt*1000),h=g.toString().slice(0,24);$('#venueInfo'+c).append('<div class="tipsDiv"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tipText">'+e.response.tips.items[i].text+'</div><div class="row"><div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">Created by: <i>'+e.response.tips.items[i].user.firstName+' on '+h+'</i></div><div class="col-xs-12 col-sm-12 col-md-5 col-lg-5"><a href="'+e.response.tips.items[i].canonicalUrl+'" class="tipLink text-right">View this tip at foursquare.com</a></div></div></div>')}}$('#venueInfo'+c).append('<div class="row"><div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div><div class="col-xs-10 col-sm-10 col-md-6 col-lg-6"><button type="button" class="btn btn-default center-block addtips addtipsbottom" id="add2'+c+'" onclick="addTips(this.id);"><b>Add your own tip</b></button></div><div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div></div>')}$('html,body').animate({scrollTop:$('#venueInfo'+c).offset().top-20})}}function addTips(a){var b=a.slice(4);$('.addTipDiv').html('');$('#venue'+b).append('<div class="row addTipDiv"><div class="col-xs-12 col-sm-12 col-md-10 col-lg-10"><label for="addedTip'+b+'">Add your tip here:</label><input id="addedTip'+b+'" type="text" class="form-control addedTip"><p class="tipInputRestriction">Tip should contain at least 10 symbols and not more than 100 symbols</p></></div><div class="col-md-2 col-lg-2"><button id="btn'+b+'" class="btn btn-default btnToAddTip" onclick="addTheTip(this.id);"><b>Add your tip</b></button>');$('html,body').animate({scrollTop:$('#addedTip'+b).offset().top-100});$('#addedTip'+b).focus()}function addTheTip(a){var c=a.slice(3),d=$('#addedTip'+c).val(),e='venueId='+c+'&text='+d,f='https://api.foursquare.com/v2/tips/add?v=20170107&oauth_token=JDXLVDSUD1FXE1OKTH2YFAWVMEVZD3EK54Z3GOXT20IEBROD';$.ajax({type:'POST',data:e,url:f,success:b,error:()=>{console.log('Error adding your tip')}});function b(g){var h=new Date(g.response.tip.createdAt*1000),j=h.toString().slice(0,24);$('#venueInfo'+c).prepend('<div class="tipsDiv"><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tipText">'+g.response.tip.text+'</div><div class="row"><div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">Created by: <i>'+g.response.tip.user.firstName+' on '+j+'</i></div><div class="col-xs-12 col-sm-12 col-md-5 col-lg-5"><a href="'+g.response.tip.canonicalUrl+'" class="tipLink text-right">View this tip at foursquare.com</a></div></div></div>');$('html,body').animate({scrollTop:$('#venueInfo'+c).offset().top-20})}}$(document).ready(()=>{var a='js/categories.json';$.ajax({type:'GET',url:a,dataType:'json',success:addCats,error:()=>{console.log('Can not get cats')}})});function addCats(a){$('#catList').html('');for(var i=0;i<a.Restaurants.length;i++){$('#catList').append('<option value="'+a.Restaurants[i].Name+'" data-value="'+a.Restaurants[i].ID+'"></option>')}}function hideMobMenu(){$('#mobMenuButton').attr('aria-expanded','false')}$('#getLocationBtn').click(getLocation);$('#findRestaurantBtn').click(findRestaurant);if('serviceWorker'in navigator){navigator.serviceWorker.register('/swGetData.js').then(a=>{console.log('ServiceWorker registration',a)}).catch(a=>{console.log('ServiceWorker error: '+a)})}