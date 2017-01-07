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
    return cache.addAll(['/', '/index.html', '/README.md', '/css/main.css', '/js/main.js', '/others/countries.json', '/img/512px-Carte_Printemps_Spring_menu_Switzerland_Michelin_starred_restaurant.jpg']);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzd0dldERhdGEuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAvLyBBdCBmaXJzdCwgbGV0J3MgY2hlY2sgaWYgd2UgaGF2ZSBwZXJtaXNzaW9uIGZvciBub3RpZmljYXRpb25cbiAgLy8gSWYgbm90LCBsZXQncyBhc2sgZm9yIGl0XG4gIGlmICh3aW5kb3cuTm90aWZpY2F0aW9uICYmIE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIikge1xuICAgIE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbihmdW5jdGlvbiAoc3RhdHVzKSB7XG4gICAgICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09IHN0YXR1cykge1xuICAgICAgICBOb3RpZmljYXRpb24ucGVybWlzc2lvbiA9IHN0YXR1cztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICBldmVudC53YWl0VW50aWwoY2FjaGVzLm9wZW4oJ1Jlc3RSZXZBcHAnKS50aGVuKGZ1bmN0aW9uIChjYWNoZSkge1xuICAgIHJldHVybiBjYWNoZS5hZGRBbGwoWycvJywgJy9pbmRleC5odG1sJywgJy9SRUFETUUubWQnLCAnL2Nzcy9tYWluLmNzcycsICcvanMvbWFpbi5qcycsICcvb3RoZXJzL2NvdW50cmllcy5qc29uJywgJy9pbWcvNTEycHgtQ2FydGVfUHJpbnRlbXBzX1NwcmluZ19tZW51X1N3aXR6ZXJsYW5kX01pY2hlbGluX3N0YXJyZWRfcmVzdGF1cmFudC5qcGcnXSk7XG4gIH0pKTtcbn0pO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGV2ZW50LndhaXRVbnRpbChjYWNoZXMua2V5cygpLnRoZW4oZnVuY3Rpb24gKGNhY2hlTmFtZXMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoY2FjaGVOYW1lcy5maWx0ZXIoZnVuY3Rpb24gKGNhY2hlTmFtZSkge1xuICAgICAgcmV0dXJuIGNhY2hlTmFtZSAhPT0gJ1Jlc3RSZXZBcHAnO1xuICAgIH0pLm1hcChmdW5jdGlvbiAoY2FjaGVOYW1lKSB7XG4gICAgICBjb25zb2xlLmxvZygnRGVsZXRpbmcgJyArIGNhY2hlTmFtZSk7XG4gICAgICByZXR1cm4gY2FjaGVzLmRlbGV0ZShjYWNoZU5hbWUpO1xuICAgIH0pKTtcbiAgfSkpO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImZldGNoXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICBjb25zb2xlLmxvZygnV09SS0VSOiBmZXRjaCBldmVudCBpbiBwcm9ncmVzcy4nKTtcblxuICAvKiBXZSBzaG91bGQgb25seSBjYWNoZSBHRVQgcmVxdWVzdHMsIGFuZCBkZWFsIHdpdGggdGhlIHJlc3Qgb2YgbWV0aG9kIGluIHRoZVxyXG4gICAgIGNsaWVudC1zaWRlLCBieSBoYW5kbGluZyBmYWlsZWQgUE9TVCxQVVQsUEFUQ0gsZXRjLiByZXF1ZXN0cy5cclxuICAqL1xuICBpZiAoZXZlbnQucmVxdWVzdC5tZXRob2QgIT09ICdHRVQnKSB7XG4gICAgLyogSWYgd2UgZG9uJ3QgYmxvY2sgdGhlIGV2ZW50IGFzIHNob3duIGJlbG93LCB0aGVuIHRoZSByZXF1ZXN0IHdpbGwgZ28gdG9cclxuICAgICAgIHRoZSBuZXR3b3JrIGFzIHVzdWFsLlxyXG4gICAgKi9cbiAgICBjb25zb2xlLmxvZygnV09SS0VSOiBmZXRjaCBldmVudCBpZ25vcmVkLicsIGV2ZW50LnJlcXVlc3QubWV0aG9kLCBldmVudC5yZXF1ZXN0LnVybCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8qIFNpbWlsYXIgdG8gZXZlbnQud2FpdFVudGlsIGluIHRoYXQgaXQgYmxvY2tzIHRoZSBmZXRjaCBldmVudCBvbiBhIHByb21pc2UuXHJcbiAgICAgRnVsZmlsbG1lbnQgcmVzdWx0IHdpbGwgYmUgdXNlZCBhcyB0aGUgcmVzcG9uc2UsIGFuZCByZWplY3Rpb24gd2lsbCBlbmQgaW4gYVxyXG4gICAgIEhUVFAgcmVzcG9uc2UgaW5kaWNhdGluZyBmYWlsdXJlLlxyXG4gICovXG4gIGV2ZW50LnJlc3BvbmRXaXRoKGNhY2hlc1xuICAvKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgY2FjaGUgZW50cnkgbWF0Y2hpbmdcclxuICAgICB0aGUgcmVxdWVzdC4gT25jZSB0aGUgcHJvbWlzZSBpcyBzZXR0bGVkLCB3ZSBjYW4gdGhlbiBwcm92aWRlIGEgcmVzcG9uc2VcclxuICAgICB0byB0aGUgZmV0Y2ggcmVxdWVzdC5cclxuICAqL1xuICAubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbiAoY2FjaGVkKSB7XG4gICAgLyogRXZlbiBpZiB0aGUgcmVzcG9uc2UgaXMgaW4gb3VyIGNhY2hlLCB3ZSBnbyB0byB0aGUgbmV0d29yayBhcyB3ZWxsLlxyXG4gICAgICAgVGhpcyBwYXR0ZXJuIGlzIGtub3duIGZvciBwcm9kdWNpbmcgXCJldmVudHVhbGx5IGZyZXNoXCIgcmVzcG9uc2VzLFxyXG4gICAgICAgd2hlcmUgd2UgcmV0dXJuIGNhY2hlZCByZXNwb25zZXMgaW1tZWRpYXRlbHksIGFuZCBtZWFud2hpbGUgcHVsbFxyXG4gICAgICAgYSBuZXR3b3JrIHJlc3BvbnNlIGFuZCBzdG9yZSB0aGF0IGluIHRoZSBjYWNoZS5cclxuICAgICAgIFJlYWQgbW9yZTpcclxuICAgICAgIGh0dHBzOi8vcG9ueWZvby5jb20vYXJ0aWNsZXMvcHJvZ3Jlc3NpdmUtbmV0d29ya2luZy1zZXJ2aWNld29ya2VyXHJcbiAgICAqL1xuICAgIHZhciBuZXR3b3JrZWQgPSBmZXRjaChldmVudC5yZXF1ZXN0KVxuICAgIC8vIFdlIGhhbmRsZSB0aGUgbmV0d29yayByZXF1ZXN0IHdpdGggc3VjY2VzcyBhbmQgZmFpbHVyZSBzY2VuYXJpb3MuXG4gICAgLnRoZW4oZmV0Y2hlZEZyb21OZXR3b3JrLCB1bmFibGVUb1Jlc29sdmUpXG4gICAgLy8gV2Ugc2hvdWxkIGNhdGNoIGVycm9ycyBvbiB0aGUgZmV0Y2hlZEZyb21OZXR3b3JrIGhhbmRsZXIgYXMgd2VsbC5cbiAgICAuY2F0Y2godW5hYmxlVG9SZXNvbHZlKTtcblxuICAgIC8qIFdlIHJldHVybiB0aGUgY2FjaGVkIHJlc3BvbnNlIGltbWVkaWF0ZWx5IGlmIHRoZXJlIGlzIG9uZSwgYW5kIGZhbGxcclxuICAgICAgIGJhY2sgdG8gd2FpdGluZyBvbiB0aGUgbmV0d29yayBhcyB1c3VhbC5cclxuICAgICovXG4gICAgY29uc29sZS5sb2coJ1dPUktFUjogZmV0Y2ggZXZlbnQnLCBjYWNoZWQgPyAnKGNhY2hlZCknIDogJyhuZXR3b3JrKScsIGV2ZW50LnJlcXVlc3QudXJsKTtcbiAgICByZXR1cm4gY2FjaGVkIHx8IG5ldHdvcmtlZDtcblxuICAgIGZ1bmN0aW9uIGZldGNoZWRGcm9tTmV0d29yayhyZXNwb25zZSkge1xuICAgICAgLyogV2UgY29weSB0aGUgcmVzcG9uc2UgYmVmb3JlIHJlcGx5aW5nIHRvIHRoZSBuZXR3b3JrIHJlcXVlc3QuXHJcbiAgICAgICAgIFRoaXMgaXMgdGhlIHJlc3BvbnNlIHRoYXQgd2lsbCBiZSBzdG9yZWQgb24gdGhlIFNlcnZpY2VXb3JrZXIgY2FjaGUuXHJcbiAgICAgICovXG4gICAgICB2YXIgY2FjaGVDb3B5ID0gcmVzcG9uc2UuY2xvbmUoKTtcblxuICAgICAgY29uc29sZS5sb2coJ1dPUktFUjogZmV0Y2ggcmVzcG9uc2UgZnJvbSBuZXR3b3JrLicsIGV2ZW50LnJlcXVlc3QudXJsKTtcblxuICAgICAgY2FjaGVzXG4gICAgICAvLyBXZSBvcGVuIGEgY2FjaGUgdG8gc3RvcmUgdGhlIHJlc3BvbnNlIGZvciB0aGlzIHJlcXVlc3QuXG4gICAgICAub3BlbignUmVzdFJldkFwcCcpLnRoZW4oZnVuY3Rpb24gYWRkKGNhY2hlKSB7XG4gICAgICAgIC8qIFdlIHN0b3JlIHRoZSByZXNwb25zZSBmb3IgdGhpcyByZXF1ZXN0LiBJdCdsbCBsYXRlciBiZWNvbWVcclxuICAgICAgICAgICBhdmFpbGFibGUgdG8gY2FjaGVzLm1hdGNoKGV2ZW50LnJlcXVlc3QpIGNhbGxzLCB3aGVuIGxvb2tpbmdcclxuICAgICAgICAgICBmb3IgY2FjaGVkIHJlc3BvbnNlcy5cclxuICAgICAgICAqL1xuICAgICAgICBjYWNoZS5hZGQoZXZlbnQucmVxdWVzdCk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1dPUktFUjogZmV0Y2ggcmVzcG9uc2Ugc3RvcmVkIGluIGNhY2hlLicsIGV2ZW50LnJlcXVlc3QudXJsKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZXR1cm4gdGhlIHJlc3BvbnNlIHNvIHRoYXQgdGhlIHByb21pc2UgaXMgc2V0dGxlZCBpbiBmdWxmaWxsbWVudC5cbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG5cbiAgICAvKiBXaGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgaXQgbWVhbnMgd2Ugd2VyZSB1bmFibGUgdG8gcHJvZHVjZSBhIHJlc3BvbnNlXHJcbiAgICAgICBmcm9tIGVpdGhlciB0aGUgY2FjaGUgb3IgdGhlIG5ldHdvcmsuIFRoaXMgaXMgb3VyIG9wcG9ydHVuaXR5IHRvIHByb2R1Y2VcclxuICAgICAgIGEgbWVhbmluZ2Z1bCByZXNwb25zZSBldmVuIHdoZW4gYWxsIGVsc2UgZmFpbHMuIEl0J3MgdGhlIGxhc3QgY2hhbmNlLCBzb1xyXG4gICAgICAgeW91IHByb2JhYmx5IHdhbnQgdG8gZGlzcGxheSBhIFwiU2VydmljZSBVbmF2YWlsYWJsZVwiIHZpZXcgb3IgYSBnZW5lcmljXHJcbiAgICAgICBlcnJvciByZXNwb25zZS5cclxuICAgICovXG4gICAgZnVuY3Rpb24gdW5hYmxlVG9SZXNvbHZlKCkge1xuICAgICAgLyogVGhlcmUncyBhIGNvdXBsZSBvZiB0aGluZ3Mgd2UgY2FuIGRvIGhlcmUuXHJcbiAgICAgICAgIC0gVGVzdCB0aGUgQWNjZXB0IGhlYWRlciBhbmQgdGhlbiByZXR1cm4gb25lIG9mIHRoZSBgb2ZmbGluZUZ1bmRhbWVudGFsc2BcclxuICAgICAgICAgICBlLmc6IGByZXR1cm4gY2FjaGVzLm1hdGNoKCcvc29tZS9jYWNoZWQvaW1hZ2UucG5nJylgXHJcbiAgICAgICAgIC0gWW91IHNob3VsZCBhbHNvIGNvbnNpZGVyIHRoZSBvcmlnaW4uIEl0J3MgZWFzaWVyIHRvIGRlY2lkZSB3aGF0XHJcbiAgICAgICAgICAgXCJ1bmF2YWlsYWJsZVwiIG1lYW5zIGZvciByZXF1ZXN0cyBhZ2FpbnN0IHlvdXIgb3JpZ2lucyB0aGFuIGZvciByZXF1ZXN0c1xyXG4gICAgICAgICAgIGFnYWluc3QgYSB0aGlyZCBwYXJ0eSwgc3VjaCBhcyBhbiBhZCBwcm92aWRlci5cclxuICAgICAgICAgLSBHZW5lcmF0ZSBhIFJlc3BvbnNlIHByb2dyYW1tYXRpY2FseSwgYXMgc2hvd24gYmVsb3csIGFuZCByZXR1cm4gdGhhdC5cclxuICAgICAgKi9cblxuICAgICAgY29uc29sZS5sb2coJ1dPUktFUjogZmV0Y2ggcmVxdWVzdCBmYWlsZWQgaW4gYm90aCBjYWNoZSBhbmQgbmV0d29yay4nKTtcblxuICAgICAgLyogSGVyZSB3ZSdyZSBjcmVhdGluZyBhIHJlc3BvbnNlIHByb2dyYW1tYXRpY2FsbHkuIFRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgdGhlXHJcbiAgICAgICAgIHJlc3BvbnNlIGJvZHksIGFuZCB0aGUgc2Vjb25kIG9uZSBkZWZpbmVzIHRoZSBvcHRpb25zIGZvciB0aGUgcmVzcG9uc2UuXHJcbiAgICAgICovXG4gICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKCc8aDE+U2VydmljZSBVbmF2YWlsYWJsZTwvaDE+Jywge1xuICAgICAgICBzdGF0dXM6IDUwMyxcbiAgICAgICAgc3RhdHVzVGV4dDogJ1dlIGNhbiBub3QgZ2V0IGRhdGEsIHNvcnJ5JyxcbiAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9odG1sJ1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICB9KSk7XG59KTsiXSwiZmlsZSI6InN3R2V0RGF0YS5qcyJ9
