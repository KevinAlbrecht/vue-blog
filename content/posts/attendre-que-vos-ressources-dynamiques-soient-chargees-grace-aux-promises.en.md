---
lang: en
locale: en-us
title: Waiting dynamic resources with Promises
date: "2016-02-16"
tags: ["angularjs",
      "typescript",
      "promises"]
belongs: 
	- en_us: 
---

In a webapp, when you deal with loading dynamic/external resources Dans une webApp, it could be mandatory to wait the loading to be complete before your app use thoses resources. I will take as example my [google-map use case](https://www.kevinalbrecht.dev/blog/), in this case we loaded dynamically the google (map) scripts.

First, we create a function that return a Promise, which can be already resolved or not, depending on a property "isLoaded".

This function will be called before any action which need the dynamic scripts to be loaded ( like the init of the map).

```ts
private waitingLoadGoogleMapDeferred: ng.IDeferred<void>[] = [];
private isLoaded: boolean = false;

public loadGoogleMap(): ng.IPromise<void> {
    if (this.isLoaded) {
        return this.$q.when();
    } else {
        var deferred = this.$q.defer<void>();

        this.waitingLoadGoogleMapDeferred.push(deferred);

        return deferred.promise;
    }
}
```

*The loadGoogleMap function return a "resolve" or the reference to the current promise, stored in ad array representings every "subscribers".*

Now a callback for unstacking the deferred when the scripts are loaded.
```ts
(<any>this.$window).googleMapLoaded = () => {
    this.isLoaded = true;
 
    while (this.waitingLoadGoogleMapDeferred.length > 0) {
        var deferred = this.waitingLoadGoogleMapDeferred.shift();
        deferred.resolve();
    }
};
```

So every code which need to access the dynamic resource must be executed with this

```ts
loadGoogleMap().then(
()=>{
    //I can use Dynamic resources here
});
```

So we can have as many subscribers as needed, the execution is safe.