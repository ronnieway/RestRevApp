"use strict";

self.addEventListener("load", function () {
  // At first, let's check if we have permission for notification
  // If not, let's ask for it
  if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
  }
});

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open('RestRevApp').then(function (cache) {
    return cache.addAll(['/', '/index.html', '/README.md', '/css/main.css', '/js/main.js', '/img/512px-Carte_Printemps_Spring_menu_Switzerland_Michelin_starred_restaurant.jpg']);
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName !== 'RestRevApp';
    }).map(function (cacheName) {
      console.log('Deleting ' + cacheName);
      return caches.delete(cacheName);
    }));
  }));
});

self.addEventListener("fetch", function (event) {
  console.log('WORKER: fetch event in progress.');

  /* We should only cache GET requests, and deal with the rest of method in the
     client-side, by handling failed POST,PUT,PATCH,etc. requests.
  */
  if (event.request.method !== 'GET') {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }
  /* Similar to event.waitUntil in that it blocks the fetch event on a promise.
     Fulfillment result will be used as the response, and rejection will end in a
     HTTP response indicating failure.
  */
  event.respondWith(caches
  /* This method returns a promise that resolves to a cache entry matching
     the request. Once the promise is settled, we can then provide a response
     to the fetch request.
  */
  .match(event.request).then(function (cached) {
    /* Even if the response is in our cache, we go to the network as well.
       This pattern is known for producing "eventually fresh" responses,
       where we return cached responses immediately, and meanwhile pull
       a network response and store that in the cache.
       Read more:
       https://ponyfoo.com/articles/progressive-networking-serviceworker
    */
    var networked = fetch(event.request)
    // We handle the network request with success and failure scenarios.
    .then(fetchedFromNetwork, unableToResolve)
    // We should catch errors on the fetchedFromNetwork handler as well.
    .catch(unableToResolve);

    /* We return the cached response immediately if there is one, and fall
       back to waiting on the network as usual.
    */
    console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
    return cached || networked;

    function fetchedFromNetwork(response) {
      /* We copy the response before replying to the network request.
         This is the response that will be stored on the ServiceWorker cache.
      */
      var cacheCopy = response.clone();

      console.log('WORKER: fetch response from network.', event.request.url);

      caches
      // We open a cache to store the response for this request.
      .open('RestRevApp').then(function add(cache) {
        /* We store the response for this request. It'll later become
           available to caches.match(event.request) calls, when looking
           for cached responses.
        */
        cache.add(event.request);
      }).then(function () {
        console.log('WORKER: fetch response stored in cache.', event.request.url);
      });

      // Return the response so that the promise is settled in fulfillment.
      return response;
    }

    /* When this method is called, it means we were unable to produce a response
       from either the cache or the network. This is our opportunity to produce
       a meaningful response even when all else fails. It's the last chance, so
       you probably want to display a "Service Unavailable" view or a generic
       error response.
    */
    function unableToResolve() {
      /* There's a couple of things we can do here.
         - Test the Accept header and then return one of the `offlineFundamentals`
           e.g: `return caches.match('/some/cached/image.png')`
         - You should also consider the origin. It's easier to decide what
           "unavailable" means for requests against your origins than for requests
           against a third party, such as an ad provider.
         - Generate a Response programmaticaly, as shown below, and return that.
      */

      console.log('WORKER: fetch request failed in both cache and network.');

      /* Here we're creating a response programmatically. The first parameter is the
         response body, and the second one defines the options for the response.
      */
      return new Response('<h1>Service Unavailable</h1>', {
        status: 503,
        statusText: 'We can not get data, sorry',
        headers: new Headers({
          'Content-Type': 'text/html'
        })
      });
    }
  }));
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzd0dldERhdGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAvLyBBdCBmaXJzdCwgbGV0J3MgY2hlY2sgaWYgd2UgaGF2ZSBwZXJtaXNzaW9uIGZvciBub3RpZmljYXRpb25cbiAgLy8gSWYgbm90LCBsZXQncyBhc2sgZm9yIGl0XG4gIGlmICh3aW5kb3cuTm90aWZpY2F0aW9uICYmIE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIikge1xuICAgIE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbihmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09IHN0YXR1cykge1xuICAgICAgICBOb3RpZmljYXRpb24ucGVybWlzc2lvbiA9IHN0YXR1cztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICBldmVudC53YWl0VW50aWwoY2FjaGVzLm9wZW4oJ1Jlc3RSZXZBcHAnKS50aGVuKGZ1bmN0aW9uIChjYWNoZSkge1xuICAgIHJldHVybiBjYWNoZS5hZGRBbGwoWycvJywgJy9pbmRleC5odG1sJywgJy9SRUFETUUubWQnLCAnL2Nzcy9tYWluLmNzcycsICcvanMvbWFpbi5qcycsICcvaW1nLzUxMnB4LUNhcnRlX1ByaW50ZW1wc19TcHJpbmdfbWVudV9Td2l0emVybGFuZF9NaWNoZWxpbl9zdGFycmVkX3Jlc3RhdXJhbnQuanBnJ10pO1xuICB9KSk7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICBldmVudC53YWl0VW50aWwoY2FjaGVzLmtleXMoKS50aGVuKGZ1bmN0aW9uIChjYWNoZU5hbWVzKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGNhY2hlTmFtZXMuZmlsdGVyKGZ1bmN0aW9uIChjYWNoZU5hbWUpIHtcbiAgICAgIHJldHVybiBjYWNoZU5hbWUgIT09ICdSZXN0UmV2QXBwJztcbiAgICB9KS5tYXAoZnVuY3Rpb24gKGNhY2hlTmFtZSkge1xuICAgICAgY29uc29sZS5sb2coJ0RlbGV0aW5nICcgKyBjYWNoZU5hbWUpO1xuICAgICAgcmV0dXJuIGNhY2hlcy5kZWxldGUoY2FjaGVOYW1lKTtcbiAgICB9KSk7XG4gIH0pKTtcbn0pO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoXCJmZXRjaFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgY29uc29sZS5sb2coJ1dPUktFUjogZmV0Y2ggZXZlbnQgaW4gcHJvZ3Jlc3MuJyk7XG5cbiAgLyogV2Ugc2hvdWxkIG9ubHkgY2FjaGUgR0VUIHJlcXVlc3RzLCBhbmQgZGVhbCB3aXRoIHRoZSByZXN0IG9mIG1ldGhvZCBpbiB0aGVcclxuICAgICBjbGllbnQtc2lkZSwgYnkgaGFuZGxpbmcgZmFpbGVkIFBPU1QsUFVULFBBVENILGV0Yy4gcmVxdWVzdHMuXHJcbiAgKi9cbiAgaWYgKGV2ZW50LnJlcXVlc3QubWV0aG9kICE9PSAnR0VUJykge1xuICAgIC8qIElmIHdlIGRvbid0IGJsb2NrIHRoZSBldmVudCBhcyBzaG93biBiZWxvdywgdGhlbiB0aGUgcmVxdWVzdCB3aWxsIGdvIHRvXHJcbiAgICAgICB0aGUgbmV0d29yayBhcyB1c3VhbC5cclxuICAgICovXG4gICAgY29uc29sZS5sb2coJ1dPUktFUjogZmV0Y2ggZXZlbnQgaWdub3JlZC4nLCBldmVudC5yZXF1ZXN0Lm1ldGhvZCwgZXZlbnQucmVxdWVzdC51cmwpO1xuICAgIHJldHVybjtcbiAgfVxuICAvKiBTaW1pbGFyIHRvIGV2ZW50LndhaXRVbnRpbCBpbiB0aGF0IGl0IGJsb2NrcyB0aGUgZmV0Y2ggZXZlbnQgb24gYSBwcm9taXNlLlxyXG4gICAgIEZ1bGZpbGxtZW50IHJlc3VsdCB3aWxsIGJlIHVzZWQgYXMgdGhlIHJlc3BvbnNlLCBhbmQgcmVqZWN0aW9uIHdpbGwgZW5kIGluIGFcclxuICAgICBIVFRQIHJlc3BvbnNlIGluZGljYXRpbmcgZmFpbHVyZS5cclxuICAqL1xuICBldmVudC5yZXNwb25kV2l0aChjYWNoZXNcbiAgLyogVGhpcyBtZXRob2QgcmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIGNhY2hlIGVudHJ5IG1hdGNoaW5nXHJcbiAgICAgdGhlIHJlcXVlc3QuIE9uY2UgdGhlIHByb21pc2UgaXMgc2V0dGxlZCwgd2UgY2FuIHRoZW4gcHJvdmlkZSBhIHJlc3BvbnNlXHJcbiAgICAgdG8gdGhlIGZldGNoIHJlcXVlc3QuXHJcbiAgKi9cbiAgLm1hdGNoKGV2ZW50LnJlcXVlc3QpLnRoZW4oZnVuY3Rpb24gKGNhY2hlZCkge1xuICAgIC8qIEV2ZW4gaWYgdGhlIHJlc3BvbnNlIGlzIGluIG91ciBjYWNoZSwgd2UgZ28gdG8gdGhlIG5ldHdvcmsgYXMgd2VsbC5cclxuICAgICAgIFRoaXMgcGF0dGVybiBpcyBrbm93biBmb3IgcHJvZHVjaW5nIFwiZXZlbnR1YWxseSBmcmVzaFwiIHJlc3BvbnNlcyxcclxuICAgICAgIHdoZXJlIHdlIHJldHVybiBjYWNoZWQgcmVzcG9uc2VzIGltbWVkaWF0ZWx5LCBhbmQgbWVhbndoaWxlIHB1bGxcclxuICAgICAgIGEgbmV0d29yayByZXNwb25zZSBhbmQgc3RvcmUgdGhhdCBpbiB0aGUgY2FjaGUuXHJcbiAgICAgICBSZWFkIG1vcmU6XHJcbiAgICAgICBodHRwczovL3Bvbnlmb28uY29tL2FydGljbGVzL3Byb2dyZXNzaXZlLW5ldHdvcmtpbmctc2VydmljZXdvcmtlclxyXG4gICAgKi9cbiAgICB2YXIgbmV0d29ya2VkID0gZmV0Y2goZXZlbnQucmVxdWVzdClcbiAgICAvLyBXZSBoYW5kbGUgdGhlIG5ldHdvcmsgcmVxdWVzdCB3aXRoIHN1Y2Nlc3MgYW5kIGZhaWx1cmUgc2NlbmFyaW9zLlxuICAgIC50aGVuKGZldGNoZWRGcm9tTmV0d29yaywgdW5hYmxlVG9SZXNvbHZlKVxuICAgIC8vIFdlIHNob3VsZCBjYXRjaCBlcnJvcnMgb24gdGhlIGZldGNoZWRGcm9tTmV0d29yayBoYW5kbGVyIGFzIHdlbGwuXG4gICAgLmNhdGNoKHVuYWJsZVRvUmVzb2x2ZSk7XG5cbiAgICAvKiBXZSByZXR1cm4gdGhlIGNhY2hlZCByZXNwb25zZSBpbW1lZGlhdGVseSBpZiB0aGVyZSBpcyBvbmUsIGFuZCBmYWxsXHJcbiAgICAgICBiYWNrIHRvIHdhaXRpbmcgb24gdGhlIG5ldHdvcmsgYXMgdXN1YWwuXHJcbiAgICAqL1xuICAgIGNvbnNvbGUubG9nKCdXT1JLRVI6IGZldGNoIGV2ZW50JywgY2FjaGVkID8gJyhjYWNoZWQpJyA6ICcobmV0d29yayknLCBldmVudC5yZXF1ZXN0LnVybCk7XG4gICAgcmV0dXJuIGNhY2hlZCB8fCBuZXR3b3JrZWQ7XG5cbiAgICBmdW5jdGlvbiBmZXRjaGVkRnJvbU5ldHdvcmsocmVzcG9uc2UpIHtcbiAgICAgIC8qIFdlIGNvcHkgdGhlIHJlc3BvbnNlIGJlZm9yZSByZXBseWluZyB0byB0aGUgbmV0d29yayByZXF1ZXN0LlxyXG4gICAgICAgICBUaGlzIGlzIHRoZSByZXNwb25zZSB0aGF0IHdpbGwgYmUgc3RvcmVkIG9uIHRoZSBTZXJ2aWNlV29ya2VyIGNhY2hlLlxyXG4gICAgICAqL1xuICAgICAgdmFyIGNhY2hlQ29weSA9IHJlc3BvbnNlLmNsb25lKCk7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdXT1JLRVI6IGZldGNoIHJlc3BvbnNlIGZyb20gbmV0d29yay4nLCBldmVudC5yZXF1ZXN0LnVybCk7XG5cbiAgICAgIGNhY2hlc1xuICAgICAgLy8gV2Ugb3BlbiBhIGNhY2hlIHRvIHN0b3JlIHRoZSByZXNwb25zZSBmb3IgdGhpcyByZXF1ZXN0LlxuICAgICAgLm9wZW4oJ1Jlc3RSZXZBcHAnKS50aGVuKGZ1bmN0aW9uIGFkZChjYWNoZSkge1xuICAgICAgICAvKiBXZSBzdG9yZSB0aGUgcmVzcG9uc2UgZm9yIHRoaXMgcmVxdWVzdC4gSXQnbGwgbGF0ZXIgYmVjb21lXHJcbiAgICAgICAgICAgYXZhaWxhYmxlIHRvIGNhY2hlcy5tYXRjaChldmVudC5yZXF1ZXN0KSBjYWxscywgd2hlbiBsb29raW5nXHJcbiAgICAgICAgICAgZm9yIGNhY2hlZCByZXNwb25zZXMuXHJcbiAgICAgICAgKi9cbiAgICAgICAgY2FjaGUuYWRkKGV2ZW50LnJlcXVlc3QpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdXT1JLRVI6IGZldGNoIHJlc3BvbnNlIHN0b3JlZCBpbiBjYWNoZS4nLCBldmVudC5yZXF1ZXN0LnVybCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmV0dXJuIHRoZSByZXNwb25zZSBzbyB0aGF0IHRoZSBwcm9taXNlIGlzIHNldHRsZWQgaW4gZnVsZmlsbG1lbnQuXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuXG4gICAgLyogV2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIGl0IG1lYW5zIHdlIHdlcmUgdW5hYmxlIHRvIHByb2R1Y2UgYSByZXNwb25zZVxyXG4gICAgICAgZnJvbSBlaXRoZXIgdGhlIGNhY2hlIG9yIHRoZSBuZXR3b3JrLiBUaGlzIGlzIG91ciBvcHBvcnR1bml0eSB0byBwcm9kdWNlXHJcbiAgICAgICBhIG1lYW5pbmdmdWwgcmVzcG9uc2UgZXZlbiB3aGVuIGFsbCBlbHNlIGZhaWxzLiBJdCdzIHRoZSBsYXN0IGNoYW5jZSwgc29cclxuICAgICAgIHlvdSBwcm9iYWJseSB3YW50IHRvIGRpc3BsYXkgYSBcIlNlcnZpY2UgVW5hdmFpbGFibGVcIiB2aWV3IG9yIGEgZ2VuZXJpY1xyXG4gICAgICAgZXJyb3IgcmVzcG9uc2UuXHJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIHVuYWJsZVRvUmVzb2x2ZSgpIHtcbiAgICAgIC8qIFRoZXJlJ3MgYSBjb3VwbGUgb2YgdGhpbmdzIHdlIGNhbiBkbyBoZXJlLlxyXG4gICAgICAgICAtIFRlc3QgdGhlIEFjY2VwdCBoZWFkZXIgYW5kIHRoZW4gcmV0dXJuIG9uZSBvZiB0aGUgYG9mZmxpbmVGdW5kYW1lbnRhbHNgXHJcbiAgICAgICAgICAgZS5nOiBgcmV0dXJuIGNhY2hlcy5tYXRjaCgnL3NvbWUvY2FjaGVkL2ltYWdlLnBuZycpYFxyXG4gICAgICAgICAtIFlvdSBzaG91bGQgYWxzbyBjb25zaWRlciB0aGUgb3JpZ2luLiBJdCdzIGVhc2llciB0byBkZWNpZGUgd2hhdFxyXG4gICAgICAgICAgIFwidW5hdmFpbGFibGVcIiBtZWFucyBmb3IgcmVxdWVzdHMgYWdhaW5zdCB5b3VyIG9yaWdpbnMgdGhhbiBmb3IgcmVxdWVzdHNcclxuICAgICAgICAgICBhZ2FpbnN0IGEgdGhpcmQgcGFydHksIHN1Y2ggYXMgYW4gYWQgcHJvdmlkZXIuXHJcbiAgICAgICAgIC0gR2VuZXJhdGUgYSBSZXNwb25zZSBwcm9ncmFtbWF0aWNhbHksIGFzIHNob3duIGJlbG93LCBhbmQgcmV0dXJuIHRoYXQuXHJcbiAgICAgICovXG5cbiAgICAgIGNvbnNvbGUubG9nKCdXT1JLRVI6IGZldGNoIHJlcXVlc3QgZmFpbGVkIGluIGJvdGggY2FjaGUgYW5kIG5ldHdvcmsuJyk7XG5cbiAgICAgIC8qIEhlcmUgd2UncmUgY3JlYXRpbmcgYSByZXNwb25zZSBwcm9ncmFtbWF0aWNhbGx5LiBUaGUgZmlyc3QgcGFyYW1ldGVyIGlzIHRoZVxyXG4gICAgICAgICByZXNwb25zZSBib2R5LCBhbmQgdGhlIHNlY29uZCBvbmUgZGVmaW5lcyB0aGUgb3B0aW9ucyBmb3IgdGhlIHJlc3BvbnNlLlxyXG4gICAgICAqL1xuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZSgnPGgxPlNlcnZpY2UgVW5hdmFpbGFibGU8L2gxPicsIHtcbiAgICAgICAgc3RhdHVzOiA1MDMsXG4gICAgICAgIHN0YXR1c1RleHQ6ICdXZSBjYW4gbm90IGdldCBkYXRhLCBzb3JyeScsXG4gICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3RleHQvaHRtbCdcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkpO1xufSk7Il0sImZpbGUiOiJzd0dldERhdGEuanMifQ==
