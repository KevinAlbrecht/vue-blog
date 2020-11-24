---
lang: fr
locale: fr-fr
title: Utiliser les fonctionnalités du cache html 5
date: "2015-03-20"
description: "Depuis quelques années il devient de plus en plus important de pouvoir permettre à une web application de fonctionner de façon offline (notamment pour les Single Page Applications)..."
tags: ["html5", "cache", "manifest"]
belongs: 
	- en_us: Html 5 Cache Features

---

Depuis quelques années il devient de plus en plus important de pouvoir permettre à une web application de fonctionner de façon offline (notamment pour les Single Page Applications). Grace aux spécifications HTML5 de nombreux outils sont à notre disposition dans 2 catégories , le Storage et le Cache. Ici nous allons voir comment exploiter les fonctionnalités du Cache à bon escient.

## Comment fonctionne le cache HTML 5 ?


Le cache HTML5 est une spécification qui apporte une logique unique aux navigateurs pour gérer les ressources (html, javascript, CSS, images …etc), il est compatible avec tous les navigateurs récents et à partir d'Internet Explorer 10. Il est possible de le configurer via un simple fichier appelé: “manifest”.

### Cache Manifest

Pour pouvoir configurer le cache il nous suffit donc de créer son manifeste "cache.manifest" par exemple, puis de le référencer comme ceci sur toutes les pages de votre application :
```html
<html manifest="site.manifest">
```

*Sachez que le nom et l’extension de fichier ne sont pas importants tant que celui-ci est associé au bon type MIME : “text/cache-manifest”*

En ce qui concerne le contenu du manifeste, la première ligne doit être l’entête “CACHE MANIFEST” elle peut être suivie d’une note en commentaire (grâce au symbole “#”) indiquant généralement un timestamp et la version actuelle du manifeste, ce qui permet au navigateur de détecter une modification et de revérifier les ressources.

La suite est divisée en plusieurs parties :

* CACHE qui définit les ressources à impérativement mettre en cache.
* FALLBACK qui permet de donner des ressources alternatives si la récupération de l’une d’elles depuis le cache échoue.
* NETWORK, ordonne au navigateur de récupérer les ressources choisies depuis le serveur sans les sauvegarder dans le cache. On peut utiliser le symbole “ * ” pour spécifier toutes les ressources n’appartenant pas aux catégories précédentes.

Voilà un exemple:

```
CACHE MANIFEST
## 18-03-2015 v1.1.7

CACHE:
index.html
content/site.css
app/application.js

NETWORK:
*
```

### Explications

Lors de la première navigation sur le site, le navigateur va télécharger la page HTML comme il le ferait pour tout autre site web et si l’attribut manifest est renseigné le navigateur va alors  récupérer le manifeste avec le chemin donné, puis requêter toutes les ressources spécifiées dans la section CACHE  pour les stocker dans le cache avec le manifeste courant. Suite à ça le navigateur requêtera les autres ressources simplement avec ou sans fallback suivant votre configuration.

*Attention, la sauvegarde du manifeste par le navigateur est automatique, il faut faire attention à ne pas référencer explicitement le manifeste dans la section CACHE, sinon le navigateur ne pourra jamais être conscient d’une nouvelle version.*

Lorsque le navigateur accèdera une prochaine fois sur l’application web, il récupèrera automatiquement les ressources ( spécifiés dans la section CACHE ) depuis son cache sans les requêter au serveur, le manifeste coté serveur sera évalué pour vérifier si ce dernier a été modifié, d’où l’importance d’ajouter un en tête avec la version et/ou la date de mise à jour  de vos ressources car même si vous ne modifiez pas la configuration de votre manifeste il est nécessaire de déclarer une nouvelle version de celui-ci pour que les clients téléchargent une nouvelle fois les ressources si vous avez effectué une modification sur l’une d’elles.

## API Javascript Offline

Maintenant que nous connaissons le fonctionnement de la mise en cache, intéressons nous à l’API Javascript

### ApplicationCache API

Les navigateurs ont aussi accès à l’objet window.applicationCache qui nous permet d’interagir avec le cache de l’application, cet objet nous met à disposition d’abord une suite d’évènements en fonction de l’état de la mise en cache :

* downloading : Lorsque le téléchargement des ressources commence, nous affichons alors notre barre de progression
* checking : Le navigateur compare le manifeste courant avec celui du serveur pour détecter d’éventuels changements ou s’apprête à récupérer le manifeste pour la première fois.
* progress : Lorsqu’un fichier de ressource est chargé cet évènement nous retourne un objet “ProgressEvent” donc les attributs “loaded” et “total” désignent respectivement le nombre de ressources chargés et le total des ressources.
* cached : toutes les ressources spécifiées par le manifeste ont bien été chargés localement et l’application est prête.
* updateready : une nouvelle version des ressources du cache sont disponible sur le serveur, à nous d’utiliser la méthode swapCache() pour renouveler les ressources.
* noupdate : le manifeste n’a pas changé, les ressources non plus.
* obsolete : le manifeste est introuvable, toute la logique de cache est alors abandonnée et le cache vidé.
* error : Une erreur quelconque est survenue, le processus de cache s’arrête là.

L’objet nous permet aussi d’accéder à l’état de la mise en cache aussi via la propriété status et enfin expose les methodes update() pour lancer une la vérification d’une nouvelle version des ressources et swapCache() pour remplacer le cache avec un nouveau.

### Exemple d’utilisation de l’API pour créer une progress-bar

Nous voulons créer une barre de progression qui indique l’état de chargement des ressources lors de l’initialisation d’une WebApp. Le processus est simple, afficher la progression dés la mise en cache des ressources, la faire progresser en fonction de l’avancement puis afficher le résultat si tout s’est bien passé ou si une erreur est survenue.

On implémente tout d’abord les methodes pour manipuler la barre de progression :

```js
function showProgressBar() {
    var progressBar = "<div class='progress-bar'><progress id='progressBar' max='100' value='0'></progress><div class='message'>Mise en cache de l'application <span id='progress-message'></span></div></div>";
    $("body").append(progressBar );
    $(".progress-bar").fadeIn("slow");
    }
}
     
     
function updateProgressBar(loaded, total) {
    var pourcentage = Math.round(loaded / total * 100);
     
    $("#progressBar").attr("value", pourcentage);
    $("#progress-message").text(pourcentage + " %");
}
     
     
function cacheFailed() {
    hideProgressBar("Une erreur est survenu lors de la mise en cache de l'application");
}
     
function cacheSucceed() {
    hideProgressBar("L'application a été correctement mise en cache");
}
```

Et maintenant les abonnements aux évenements :

```js
applicationCache.addEventListener('downloading', function (e) {
showProgressBar();
}, false);
 
applicationCache.addEventListener('progress', function (e) {
updateProgressBar(e.loaded, e.total);
}, false);
 
applicationCache.addEventListener('cached', function (e) {
cacheSucceed();
}, false);
 
applicationCache.addEventListener('updateready', function (e) {
appCache.swapCache();
}, false);
 
applicationCache.addEventListener('noupdate', function (e) {
cacheSucceed();
}, false);
 
applicationCache.addEventListener('error', function (e) {
cacheFailed();
}, false);
```

Voila le résultat :

![result image](/cache-mobile-view_219204D2.gif)

Evidement pour beaucoup de WebApp le chargement sera quasi instantané depuis un ordinateur, mais avoir une barre de chargement prend du sens pour une navigation depuis un mobile ou un device où la connexion est souvent plus lente.

