---
lang: fr
locale: fr-fr
title: Librairies Ngrx Pour Une Application Angular Reactive Part 2 Ngrx Effects
date: "2018-02-13"
description: "Les reducers sont dits \"purs\" et ne doivent donc en aucun cas récupérer une donnée autre que leurs paramètres, nous allons donc rajouter un middleware pour volontairement introduire du \"side effect\" qui représentera nos intéractions serveur. ngrx/Effects est une librairie de side effects...."
tags: ["angular",
     "ngrx",
     "redux"]
belongs: 
	- en_us: 
---

Vous voici sur la partie 2 de cet article où nous allons implémenter un Effect. Si vous n'avez pas vu la première partie, c'est ici :[Librairies NGRX pour une application Angular réactive. Part 1/3 : ngrx/store](https://www.kevinalbrecht.dev/fr/blog/librairies-ngrx-pour-une-application-angular-reactive-part-1-ngrx-store/)


ngrx/effects
===

![ngrx](/images/ngrx.png)

ngrx/effects ?
---

Les reducers sont dits "purs" et ne doivent donc en aucun cas récupérer une donnée autre que leurs paramètres, nous allons donc rajouter un middleware pour volontairement introduire du "side effect" qui représentera nos intéractions serveur.

ngrx/Effects est une librairie de side effects, qui s'intègre au fonctionnement du Store, typiquement ces Effects réagissent à un dispatch d'actions qui leur sont attribuées et vont dispatcher à leur tour des actions pour les reducers.

Github →  [https://github.com/ngrx/platform/tree/master/docs/effects](https://github.com/ngrx/platform/tree/master/docs/effects)

Pour la petite visualisation je réutilise mon ancien schéma en rajoutant simplement la brique Effects:

![dataflow](/images/ngrx2-dataflow.png)


Création d'un Effect
---

 ⚐ J'ai au préalable créé un Service angular MovieService afin de récupérer de la donnée via une potentielle API.

```ts
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import * as movieAction from '../actions/index.action';
import { switchMap } from 'rxjs/operators/switchMap';
import { MovieService } from '../../services/movie.service';
import { GetMovieActionSuccess, GetMovieActionError } from '../actions/index.action';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
 
@Injectable()
export class MovieEffect {
  constructor(
    private actions$: Actions,
    private movieService: MovieService) { }
 
  @Effect()
  loadMovies$ = this.actions$.ofType(movieAction.GET_MOVIES)
    .pipe(
      switchMap((action) => {
      return this.movieService.getMovies()
        .pipe(
        map(movies => new GetMovieActionSuccess(movies)),
        catchError(err => of(new GetMovieActionError(err)))
        );
    }));
}
```

Nous avons donc une classe qui représente les différents Effects. Dans son constructeur sont injectés 2 éléments

 - le plus important "actions$" est un observable fourni par la librairie et qui se chargera de nous avertir de chaque type d'action dispatchés

 - le second élément injecté étant simplement mon service.

En soi, l'Effect est défini par le simple décorateur "@Effect()" il est de type Observable<Action>,si l'on regarde son contenu grâce au switchMap je definis notre loadMovies$ comme étant une observable de récuperation de data qui se résoud par le renvoi d'une nouvelle action , un success ou une erreur.
On retrouve donc cette notion de middleware dans la mesure où notre Effect se déclenchera à la venue d'une action et en résoudra une nouvelle.

⚐ L'utilisation des [~~lettable operators~~](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md)   ["pipeable operators"](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) via la methode '.pipe()' est recommandée, je vous laisse voir les nouveautés de RxJS 5.5  ⚐

Il ne reste plus qu'à rajouter le module Effect aux imports de notre app.module.ts comme suit :

```ts
EffectsModule.forRoot([]),
EffectsModule.forFeature(effects)
```

⚐ Code complet (article parties 1 & 2) disponible ici : [https://github.com/Bubbuls/ngrx-demo](https://github.com/Bubbuls/ngrx-demo)

Voila !
---

Pas si compliqué, nous pouvons maintenant retester notre application qui cette fois se déroulera différement.
En effet, dans la première partie, l'application ne faisait que renvoyer un state signifiant que le chargement de la donnée était en cours, mais cette fois la requête asynchrone de récupération de données renvoie une action elle aussi, qui nous donnera un tout nouveau state avec de la data, cool !

Grossièrement le principal est fait, dans la dernière partie nous allons jeter un oeil à la librairie ngrx/router-store qui permet de connecter ... notre router angular à notre store , histoire de rendre l'application encore plus réactive. ça se passe ici :Librairies NGRX pour une application Angular réactive. Part 3/3 : ngrx/router-store (Bientôt)


