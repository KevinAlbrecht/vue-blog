---
lang: fr
locale: fr-fr
title: Implémenter une GoogleMap avec AngularJS et TypeScript dans Cordova
date: "2016-02-18"
description: "Depuis quelques années il devient de plus en plus important de pouvoir permettre à une web application de fonctionner de façon offline (notamment pour les Single Page Applications)...."
tags: ["angularjs",
      "Windows",
      "Cordova",
      "typescript",
      "google map"]
belongs: 
	- en_us: 
---

## Introduction


Récemment nous avons dû afficher une GoogleMap dans une application Cordova.

Lors de son initialisation, la librairie cherche à injecter dynamiquement des scripts nécessaires à son bon fonctionnement ce qui est, sur la plateforme Windows, interdit.
Le seul moyen de le permettre est que la carte se retrouve sandboxée dans le composant **ms-web-view**.

Nous avons donc des solutions différentes suivant la plateforme d’utilisation, c’est là que les “merges” de Cordova entrent en jeu, il va falloir une implémentation différente par plateforme sans faire faillir l'IntelliSense et la compilation TypeScript. 
Si ce n’est pas déjà fait, je vous invite vivement à lire l’article de Sébastien Ollivier :

[Utiliser les merges Cordova dans une application AngularJS avec TypeScript.](https://blogs.infinitesquare.com/posts/mobile/merges-cordova-application-angularjs-typescript)

Dans cet article nous allons voir comment implémenter 2 mécanismes différents tout en conservant un maximum de code commun

## Implémentation

L’implémentation se fera en 3 parties principales:

* Un service Angular MapSupervisorService  chargé de contenir toutes les méthodes de manipulation de la carte.
* Une directive MapDirective affichera la GoogleMap.
* Un 2eme service Angular spécifique par plateforme, pour pouvoir gérer indépendamment les spécificités de chacune.
    * MapHandlerForWindows
    * MapHandlerForAndroid

*(Voir schéma utilisé dans l’article de Sebastien O. cité précédemment)*

### Le service


Le service regroupe les fonctions propres à GoogleMap comme l’initialisation de la carte avec les différentes options proposées par la librairie/sdk : son type ( satellite, terrain …etc ),  le niveau de zoom maximal ou minimal, l’autorisation de certaines manipulations de la carte ou encore les coordonnées de départ. On y trouvera aussi les abonnements aux différents évènements que la carte peut lever  ( zoom_changed, center_changed …etc. )

```ts
module project.Cartographie {
    export class MapSupervisorService {
        private map: google.maps.Map;
        public mapConfiguration: IMapConfiguration;

        initMap(elementId: string, mapConfiguration: IMapConfiguration) {
            var element: HTMLElement;
            element = document.getElementById(elementId);

            this.map = new google.maps.Map(element, {
                mapTypeControl: false,
                overviewMapControl: false,
                rotateControl: false,
                streetViewControl: true,
                mapTypeId: mapTypeId,
                disableDefaultUI: false,
                zoomControl: false,
                center: new google.maps.LatLng(mapConfiguration.position.center.lat, mapConfiguration.position.center.lng),
                zoom: mapConfiguration.zoom
            });
        }

        setMapType = function (mapType: MapType) {

            var mapTypeId;

            switch (mapType) {
                case MapType.Plan:
                    mapTypeId = google.maps.MapTypeId.ROADMAP;
                    break;
                case MapType.Hybride:
                    mapTypeId = google.maps.MapTypeId.HYBRID;
                    break;
                case MapType.Satellite:
                    mapTypeId = google.maps.MapTypeId.SATELLITE;
                    break;
                case MapType.Terrain:
                    mapTypeId = google.maps.MapTypeId.TERRAIN;
                    break;
            }

            this.map.setMapTypeId(mapTypeId);
        }

    }
	angular.module("project-cartographie").service("mapSupervisorService", [MapSupervisorService]);
}
```

*(MapSupervisorService)*

### La directive principale


Nous allons maintenant créer la directive angular  dans laquelle devra être injecté le MapHandler, le second service angular.

Ici aussi la logique est plutôt simple, nous souhaitons simplement initialiser la carte dans la phase de link de notre directive.
Mais à noter que le template de la directive n’est pas le même sur toutes les plateformes, nous faisons donc appel au MapHandler ( qui lui est spécifique par plateforme ) pour récupérer le template nécessaire.

```
export class MapDirective implements ng.IDirective {
 
    //constructeur
    //attributs
    //etc 
    [...]
 
 
    template = this.mapHandler.getDirectiveTemplate();
 
    link = (scope: IMapDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
        var centerHasChanged = 0;
        var zoomHasChanged = 0;
        scope.zoom = 6;
 
        this.mapHandler.configure(element[0].id,
            {
                mapType: scope.mapType,
                zoom: scope.zoom,
                position: {
                    center: {
                        lat: 46.8,
                        lng: 1.7
                    }
                }
            });
    }
 
    scope.$watch(() => {
            return scope.mapType;
        }, () => {
            this.mapHandler.mapTypeWatchCallback(scope.mapType);
        });
     
    [...]
}
```
*(MapSupervisorService)*

### La directive principale


Nous allons maintenant créer la directive angular  dans laquelle devra être injecté le MapHandler, le second service angular.

Ici aussi la logique est plutôt simple, nous souhaitons simplement initialiser la carte dans la phase de link de notre directive.
Mais à noter que le template de la directive n’est pas le même sur toutes les plateformes, nous faisons donc appel au MapHandler ( qui lui est spécifique par plateforme ) pour récupérer le template nécessaire.

```ts
export class MapDirective implements ng.IDirective {
 
    //constructeur
    //attributs
    //etc 
    [...]
 
 
    template = this.mapHandler.getDirectiveTemplate();
 
    link = (scope: IMapDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
        var centerHasChanged = 0;
        var zoomHasChanged = 0;
        scope.zoom = 6;
 
        this.mapHandler.configure(element[0].id,
            {
                mapType: scope.mapType,
                zoom: scope.zoom,
                position: {
                    center: {
                        lat: 46.8,
                        lng: 1.7
                    }
                }
            });
    }
 
    scope.$watch(() => {
            return scope.mapType;
        }, () => {
            this.mapHandler.mapTypeWatchCallback(scope.mapType);
        });
     
    [...]
}
```

*(MapDirective)*

### Le MapHandler


Jusqu’ici tout est assez abstrait, nous allons voir le MapHandler, le cœur de notre solution qui va joindre la directive au service

Android & iOS

Le mapHandler pour android & iOS est le plus simple car il représente une implémentation basique de la GoogleMap.

Nous devons définir :

* le script google à injecter, qui se trouve directement dans le constructeur de notre classe

```ts
constructor(
    private $q: ng.IQService,
    private $window: ng.IWindowService,
    private mapSupervisorService: MapSupervisorService) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=<strong>googleMapLoaded'</strong>;
    document.body.appendChild(script);
 
    […]
```
Ici “googleMapLoaded” est une callback appelée lorsque toute l’API de google est bien chargée.

* Un getter du template du DOM pour la directive

```ts
getDirectiveTemplate(): string {
    return '<div class="map"> </div>'
}
```

* une méthode de configuration qui permettra au mapSupervisorService de lancer l’initialisation de la carte. exemple :

```ts
configure(element: string, mapConfiguration) {
    this.loadGoogleMap().then(()=>
    this.mapSupervisorService.initMap(domElement, mapConfiguration));
}
```

à noter que “loadGoogleMap()” est une méthode pour nous assurer que les script soient bien chargés avant d’exécuter le code.

Windows

c’est ici que ça devient délicat, comme l’énonce la problématique, il nous est impossible d’injecter des scripts directement dans l’application, il faut donc passer par une iframe.

Commençons donc par voir le template à donner à notre directive :
```ts
'<x-ms-webview id="master" scrolling="no" draggable="false" sandbox="allow-same-origin allow-scripts" class="map" style="position:absolute;"></x-ms-webview>'
```

Avant de continuer, petit point sur les webview pour pouvoir comprendre la suite.

Les communications entre le scope courant et une iframe en faisant partie s’effectue avec les window.external.notify et invokeScriptAsync , donc à chaque fois qu’il faut exécuter une méthode pour l’iframe ( donc pour la GoogleMap) nous allons devoir passer par l’invokeScriptAsync de la fonction native “eval” avec en paramètre notre code sérialisé.

Nous pouvons maintenant nous occuper de la méthode configure , en effet celle-ci va prendre en charge le chargement et la configuration de l’iframe. va se découper en 2 actions:

* l’insertion de la vue dans l’iframe

```ts
var domElement = document.getElementById(element);
this.webview = <MSHTMLWebViewElement>domElement;
this.webview.src = "ms-appx-web:///www/views/_iframeMaster.html";
```

* l’abonnement aux évènements de l’iframe : 
    * MSWebViewScriptNotify qui est l’évènement par défaut d’une notification venant de l’iframe.
    * MSWebViewNavigationCompleted qui permet de savoir quand l’iframe est chargé.

```ts
this.webview.addEventListener("MSWebViewScriptNotify", (evt: any) => {
    var event: Cartographie.INotification = JSON.parse(evt.value)
    if (event.notificationType === Cartographie.NotificationType.Loaded) {
        this.iframeCompletelyLoaded();
    }
});
 
this.webview.addEventListener("MSWebViewNavigationCompleted", () => {
    var asyncOp = this.webview.invokeScriptAsync(
        "eval",
        this.prepareMsWebview());
 
    asyncOp.oncomplete = (success) => {
        //Pas utile à exploiter
        //nous attendrons que la webview nous notifie
    }
    asyncOp.onerror = (err) => {
        //Alerter d'une erreur
    };
    asyncOp.start();
});
```

Voilà pour la méthode configure, mais regardons de plus près l’initialisation des scripts GoogleMap, à exécuter cette fois-ci dans l’iframe grâce à “prepareMsWebview”

```ts
(<any>window).map = null;
(<any>window).googleMapLoaded = function () {
    notifyMethod(iframeNotification);
};
(<any>window).Cartographie = { MapType: null };
(<any>window).Cartographie.MapType = mapTypeEnum;
 
//[…]
 
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=googleMapLoaded';
document.body.appendChild(script);
```

à noter que nous utilisons des variables globales, pour simplifier nos scripts lors de prochaines exécutions nécessitant d’utiliser l’objet Cartographie.

Il ne faut pas oublier que notre méthode sera sérialisée afin d’être envoyée à la webview (pour plus de détails sur ce morceau de code et sur la sérialisation des fonctions, voir le chapitre “En complément” en fin d’article. ) ,l’important est de savoir que “notifyMethod()” permet de lever un évènement MSWebViewScriptNotify  qui nous avertira que les scripts de google sont bien chargés.

 

Et voilà. vous disposez maintenant d’une carte Google initialisée dans votre webview et pour exécuter un appel à la carte il ne vous reste plus qu’à sérialiser l’action et l’envoyer grâce à l’invokescript.

## En complément


*Un dernier exemple d’instruction vers la ms-webview ?*

Dans la directive et dans le superviseur, il y a des méthodes pour modifier le “mapType” qui est la carte voulue (satellite, hybrid …etc.)

Si nous suivons la logique de l’article, voilà ce qu’il faudrait ajouter au MapHandlerForWindows pour réussir à modifier le type de carte de la GoogleMap:

```ts
public mapTypeWatchCallback(mapType: MapType) {
    this.loadGoogleMap().then(() => {
        var setMapTypeMethod = this.makeAutoEvaluable(
            this.mapSupervisorService.setMapType,
            mapType
        );
 
        var asyncOp = this.webview.invokeScriptAsync(
            "eval",
            setMapTypeMethod);
        asyncOp.oncomplete = (success) => {
            //success
        }
        asyncOp.onerror = (err) => {
            //err
        };
        asyncOp.start();
    });
}
```

*Comment sérialiser une méthode et ses paramètres de façon générique ?*

Voilà une astuce très utile (et plutôt sexy ) pour ce qui est de communiquer avec une iframe, proposé par [Thomas Ouvré](https://blogs.infinitesquare.com/users/touvre)
```ts
private makeAutoEvaluable(func: (...args: any[]) => any, ...args: any[]): string {
    return `(${(<any>func).toString()})(${args.join(",")});`;
}
```

Cette fonction assez barbare à première vue est finalement assez simple:

on passe en paramètre une fonction ou nous allons définir le code à exécuter dans l’iframe, puis en second une série de paramètres qui seront disponibles dans ce scope .
 

Maintenant jetons un œil à un cas concret d’utilisation, nous avons parlé de la méthode “prepareMsWebview”, voilà le code réel de la fonction.

```ts
private prepareMsWebview() {
 
    return this.makeAutoEvaluable(
//Reference vers les paramètres à mapper
(notifyMethod, iframeNotification, mapTypeEnum ) => {
        debugger;
        (<any>window).map = null;
        (<any>window).googleMapLoaded = function () {
            notifyMethod(iframeNotification);
        };
        (<any>window).Cartographie = { MapType: null };
        (<any>window).Cartographie.MapType = mapTypeEnum;<br>
     
    //[…]
 
    var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=googleMapLoaded';
        document.body.appendChild(script);
    },
        //Parametres qui seront mappés à l'eval final.
        this.notifyApp.toString(),
        JSON.stringify(loadedNotification),
        JSON.stringify(Cartographie.MapType));
}
```

En fait, nous avons besoin de sérialiser le contenu et pour ce qui est du code qui appartient à notre scope, il est simplement passé en paramètre (lui aussi sérialisé) pour pouvoir y être “copié” pour être exécuté


Et voilà. L’article est quelque peu compliqué mais comporte plusieurs points importants dans l’utilisation des fichiers “merges” de cordova , et vous donne les cartes en main pour pouvoir communiquer avec les iframes.