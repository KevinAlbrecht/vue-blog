---
lang: fr
locale: fr-fr
title: Le State management pour les webapps avec Redux
date: "2017-12-11"
description: "Dans une web app simple, par défaut on va permettre à nos composants de consommer de la donnée : un composant peut lire, créer ou éditer une donnée 'A' , tandis qu'un autre peut lui aussi modifier cette donnée 'A', et qu'un troisième composant va pouvoir éditer une propriété de la donnée 'A'. Il est facile d'avoir la référence d'un objet distribué à droite à gauche et de permettre un accès vers de multiples composants..."
tags: ["redux",
     "webapp"]
belongs: 
	- en_us: 
---

## Introduction


### Problématique


Dans une web app simple, par défaut on va permettre à nos composants de consommer de la donnée : un composant peut lire, créer ou éditer une donnée "A" , tandis qu'un autre peut lui aussi modifier cette donnée "A", et qu'un troisième composant va pouvoir éditer une propriété de la donnée "A". Il est facile d'avoir la référence d'un objet distribué à droite à gauche et de permettre un accès vers de multiples composants.

Aïe, le problème avec ce genre de process est qu'il se schématise par une grande toile d'araignée d'accès et de modification de donnée un peu partout, chaque cas totalement dépendant du contexte, ce qui devient très dur à suivre et à debugger …

### State management


C'est là qu'intervient la notion de State Management.
Pour le moment on peut considérer qu'un State représente plusieurs éléments :

 * Une donnée initiale A
 * Une réponse http
 * Un input utilisateur
 * Une navigation
 * … etc.

 L'idée de base est de pouvoir représenter l'état d'une application en un seul endroit afin d’obtenir un data flow one way. On peut voir le comportement problématique et la solution que nous souhaitons apporter par le schema suivant :

![47133006-86ab-4c72-b9d9-a2c18c18cce3_global dataflow.png](/images/globalDataflow.png)

Pour se faire on va voir l'architecture proposée par Redux. 

## Qu'est ce que Redux 


![redux](/images/redux.png)

Redux est une simple librairie Javascript , agnostique de tout framework SPA ou autre ( bien que couramment utilisé dans un environnent React ). Il met à disposition un pattern de gestion d'état via plusieurs éléments  représentant un data flow oneway cyclique.

### Les principes

Voici les 3 principes de Redux :

 * Single source of truth: l'état de l'application globale est stocké dans un "store" unique.
 * State readonly : la notion d'Immutabilité est importante, en gros, une fois qu'un state est créé, il ne peut pas être modifié, il faut en recréer un pour apporter une évolution.
 * Changes are made with pure functions: des fonctions seront dédiées aux modifications à apporter au State de l'application et celles-ci doivent être dites "pures". Pour rappel le terme de fonction pure designe une fonction qui :
    * N'a aucun effet de bord, elle ne modifie aucune autre donnée que sa valeur de retour.
    * Ne prend en compte que ses paramètres d'entrée, sans notion d'état extérieur, elle peut etre executée n fois avec les mêmes paramètres et retournera toujours la même valeur.

Ces fonctions sont apppelées "Reducers".

### Dataflow


Maintenant que les principes de base sont posés, nous allons voir les éléments qui composent le flux de donnée de notre pattern suivi d'un exemple concret:

 * Un State tree: l'état de notre application, qui a été créée / composée par un reducer
 * Des Dispatched Actions: une action est un objet composé d'un type (identifiant : string, enum …etc) et d'un payload représentant une donnée.
 * Des Reducers: fonction pure, elle reçoit une dispatched action, répondant à un type particulier, le réducer va composer un nouveau State en ayant pris en compte le payload de l'action

Tout ceci représente notre Store, qui est la brique de gestion d'état et qui peut être représentée comme suit :

![dataflow](/images/dataflow.png)

Pour bien comprendre le flux, un composant A représentant un formulaire HTML, souhaite soumettre un champ texte dont la valeur doit s'afficher à l'écran.

La soumission du formulaire va donc appeler un dispatcher en lui précisant une action dont le type est: "ADD_TEXT" et le paylod : "Lorem Impsum".

Le dispatcher, lui, va contacter le réducer correspondant au type d'action et lui demander de mettre à jour l'état de notre application. Le reducer retournera donc un nouveau State qui contiendra la valeur à notre composant initial.

### Exemple simpliste d'implémentation


Postulat

*la vue:*

```html
<div>
  <ul id="resultat"></ul>
  <input id="firstname" type="text" value="" />
  <input id="lastname" type="text" value="" />
  <button id="validate" type="submit">Valider</button>
</div>
```

*le code behind*

```js
var main = function () {
      var submitButton = document.getElementById("validate");
      var resultsHtml = document.getElementById("resultat");
 
      var currentFirstname = document.getElementById("firstname");
      var currentLastname = document.getElementById("lastname");
 
      var results = [];
       
      function init() {
          submitButton.addEventListener("click", (e) => {
            results.push({
              firstname: currentFirstname.value,
              lastname: currentLastname.value
            });
            refreshResults();
          });
      }
       
      function refreshResults(){
        var resultsAsString = '';
        results.forEach((item) => {
          resultsAsString += `<li>${item.firstname} ${item.lastname}</li>`;
        });
        resultsHtml.innerHTML = resultsAsString;
      }
      return {
        init: init
      };
    }();
```

Dans cet exemple, nous avons simplement un formulaire, et lors du clic sur le bouton de validation, nous voulons afficher la nouvelle entrée dans une liste, le tableau "results" est accessible  par tous, et peut être modifié à n'importequel moment, voyons donc comment faire en sorte qu'il soit représenté dans un State.

Rajout du Store

 * Nous allons deja créer un objet "store" qui contiendra nos differents élément, d'abord un state:
```js
var store = function () {
      var state = {
        persons: []
      };
}()
```

 * Un reducer:

```js
 function reducer(action) {
       switch (action.type) {
         case "ADD_PERSON":
           var currentPayload = action.newPerson;
           var newPayload = [...state.persons, currentPayload]
           // nouveau State
           return { persons: newPayload }
       }
       return state;
     }
```

 <bold>/!\ Remarque :</bold> on voit bien dans l'exemple du reducer la notion d'immutabilité, on créé un nouveau payload ainsi qu'on retourne un nouveau State englobant notre payload.
A noter l'utilisation du "spread operator" javascript ". . ." qui sert à ré-assigner les propriétés dans l'objet courant.
Voir aussi : *Object.assign() ou Function.prototype.apply() mais attention au DeepClone et au Shallow-cloning.*

 * Et enfin un dispatcher:
```js
 function dispatch(action) {
        state = reducer(action);
      }
```

 Il ne reste plus qu'à dispatcher une action, voici l'évolution de notre handler pour l'évenement click:

```js
 submitButton.addEventListener("click", (e) => {
        var action = {
          type: "ADD_PERSON",
          newPerson: {
            firstname: currentFirstname.value,
            lastname: currentLastname.value
          }
        };
 
        store.dispatch(action);
      });
```


Ok, à ce stade nous informons le store qu'une nouvelle valeur s'ajoute à notre tableau "persons" et que l'on doit donc faire évoluer le State. Cependant comment récupérer le nouveau State depuis un composant ? Nous allons ajouter des souscription !

Subscribe & Notify

Rajoutons donc à notre store des subscribers, une methode de subscribe, et une de notify comme suit:

```js
//subscribers
var subscribers = [];
 
//getter
function getState() {
  return state;
}
 
//notify
function notify() {
  subscribers.forEach((sub) => {
    sub(getState());
  });
}
 
//subscribe
function subscribe(fn) {
  subscribers = [...subscribers, fn];
  notify();
}
```

 Maintenant nous touchons au but, mais attention, <bold> ne pas oublier d'appeler le notify lors d'un dispatch évidement </bold> et il nous reste plus qu'à nous abonner dans la methode "init" de notre "main"comme suit :

```js
 store.subscribe((newState) => {
    results = newState.persons;
    refreshResults();
  });
```

 <bold>Voila !</bold>

 Maintenant n'importequel composant peut s'abonner et se refresh à la moindre modification de donnée.
Code complet ici ==> [https://jsfiddle.net/mv9jads1/](https://jsfiddle.net/mv9jads1/)


## Quelle solution


Il existe plusieurs librairies JS, la plupart basées sur Redux, sensiblement similaires plus ou moins adaptées en fonction du projet comme par exemple :

 * [Conventional-redux](https://github.com/mjaneczek/conventional-redux)
 * [MobX](https://github.com/mobxjs/mobx)
 * [Flux](https://facebook.github.io/flux/) (par Facebook)  ➜ Est avant tout une architecture faite pour React, très similaire à Redux.
 * [Ngrx](https://github.com/ngrx/platform)  ➜ Basé sur Redux, mais comprend des Observable, spécialisé pour Angular
 * ...

## Conclusion


La notion de state management nous apporte les bénéfices suivants 

 * Plus de visiibilité sur les modifications d'état, fini les objets modifiés par x références passées à droite à gauche.
 * L'application devient donc plus prédictible.
 * Les modifications peuvent être tracés ou annulées ➜ les modifications étant toutes centralisées dans des reducers il est facile de donner un comportement par défaut à chacun.
 * Plus de facilité pour tester l'application ➜ Grâce à la propriété "pure" des fonctions

 Voila pour la partie théorique je vous propose maintenant de suivre sur l'article suivant dont le sujet est l'implémentation avec ngrx dans le cadre d'une application Angular.
Rendez-vous par là -> [Librairies NGRX pour une application Angular réactive. Part 1/3 : ngrx/store](https://www.kevinalbrecht.dev/fr/blog/librairies-ngrx-pour-une-application-angular-reactive-part-1-ngrx-store/)