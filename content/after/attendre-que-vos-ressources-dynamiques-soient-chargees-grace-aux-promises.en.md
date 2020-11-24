---
{
	"title": "Attendre que vos ressources dynamiques soient chargées grâce aux promises",
   	"date": "2016-02-16",
   	"description": "Dans une webApp, s’il est nécessaire de charger des scripts/ressources dynamiquement, il est alors important de pouvoir s’assurer du chargement complet de ceux-ci dans notre application avant de pouvoir exécuter du code lié à ces éléments...",
   	"tags": [
      "angularjs",
      "typescript",
      "promises"
   	],
}
---

Dans une webApp, s’il est nécessaire de charger des scripts/ressources dynamiquement, il est alors important de pouvoir s’assurer du chargement complet de ceux-ci dans notre application avant de pouvoir exécuter du code lié à ces éléments.

Pour reprendre l’exemple de mon article traitant des GoogleMap nous chargions des scripts dynamiquement, pour gérer le cas nous avons 2 étapes:

 

Dans un premier temps nous allons disposer d’une méthode retournant une promise, qui va être, soit résolue directement, soit en stocker le deferred, en fonction d’une simple propriété isLoaded : boolean.

Cette méthode sera appelée avant chaque exécution nécessitant d’être certain que les script soient chargés ( comme l’initialisation de la carte par exemple )

```
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

*La methode loadGoogleMap renverra directement une promise résolue ou bien stockée dans un tableau.*

Maintenant il ne nous reste plus qu’à dépiler les deferred dans la callback qui nous assure que les ressources sont chargées.
```
(<any>this.$window).googleMapLoaded = () => {
    this.isLoaded = true;
 
    while (this.waitingLoadGoogleMapDeferred.length > 0) {
        var deferred = this.waitingLoadGoogleMapDeferred.shift();
        deferred.resolve();
    }
};
```

Et voila, tout ce qui touchera de près ou de loin à la GoogleMap sera appelé de la sorte

```
loadGoogleMap().then(
()=>{
    //Manipulation de la carte
});
```

Simple et pratique, soit notre code s’exécute directement, soit il sera en attente que l’application soit prête !