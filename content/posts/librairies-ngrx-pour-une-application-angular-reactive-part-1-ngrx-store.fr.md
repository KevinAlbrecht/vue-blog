---
lang: fr
locale: fr-fr
title: Librairies Ngrx Pour Une Application Angular Reactive Part 1 Ngrx Store
date: "2018-02-12"
description: "Maintenant, sur le même sujet, nous allons nous concentrer sur les applications Angular et nous allons voir des librairies de la team ngrx. Cet article est divisé en 3 parties : ngrx/store: la brique principale représentant l'ensemble du store redux..."
tags: ["angular",
     "ngrx",
     "redux"]
belongs: 
	- en_us: 
---

Mon article précédent traitait globalement de l'architecture proposée par Redux pour des web app dites "réactives". Je vous recommande de le lire si vous n'êtes pas familier avec Redux : [Le State management pour les webapps avec Redux.](/)

Maintenant, sur le même sujet, nous allons nous concentrer sur les applications Angular et nous allons voir des librairies de la team ngrx. Cet article est divisé en 3 parties :

 * ngrx/store: la brique principale représentant l'ensemble du store redux.
 * ngrx/effects: une librairie de side-effect, pour nous permettre de communiquer avec une donnée externe ( ex: une API ).
 * ngrx/router-store: tout simplement un pont entre notre router angular et le store redux.

ngrx/store
===
![ngrx](/ngrx.png)

Notions
===

Qu'est ce que ngrx/store ?
---
Le ngrx/store est tout simplement une librairie fournissant les éléments (actions, dispatcher, reducer ...etc.) pour une architecture "reactive" type state management, basée sur Redux. Elle fonctionne avec RxJS ( donc Observable based ), implémentée avec Typescript et donc tout bonnement adaptée pour Angular.

Github → [https://github.com/ngrx/platform/tree/master/docs/store](https://github.com/ngrx/platform/tree/master/docs/store)
Container components vs Presentational Components
---
Il faut bien dissocier 2 types de composants dans l'architecture Redux, la différence est très simpliste :

 * Le Container Component fait partie du dataflow de Redux
    * Récupère la donnée du Store
    * Dispatch des actions
 * Le Presentational Component n'a aucun lien avec le cycle de Redux ( les points ci-dessous étant spécifiques à Angular )
    * Récupère la donnée par des binding @Input()
    * Rappelle une action via un binding @Output()

exemple:

![container vs presentational](/ngrx1/components.png)

Mise en place 
===

Introduction
---
⚐ Je passe sur certains détails Typescript, imports de modules ...etc. Et je ne montre pas tout le découpage, mais tout ceci est visible via un lien vers le code complet à la fin de l'article, enjoy.

Pour l'exemple, nous allons créer un simple listing d'éléments, en l'occurence des films (pour info je pars d'une application générée par la cli angular, attention nous réutiliserons ce projet pour les parties 2 et 3 de cet article)

Dans l'ordre nous allons voir:

 * Le data flow grâce au Store
    * Les Actions
    * Notre State
    * Notre Reducer
    * Les Selectors
 * Un appel depuis un component

Création des Actions
---

Tout d'abord nous allons créer des actions liées aux différents états de la récupération d'un film. Pour rappel une action est simplement une association d'un type et d'un payload.

 * Les films sont en chargement.
 * Les films ont été chargés avec succés.
 * Une erreur est survenue ( veuillez réessayer plus t... ) pendant le chargement des films.

```ts
import { Action } from '@ngrx/store';
 
// Les types des differentes actions
export const GET_MOVIES = 'GET_MOVIES';
export const GET_MOVIES_SUCCESS = 'GET_MOVIES_SUCCESS';
export const GET_MOVIES_ERROR = 'GET_MOVIES_ERROR';
 
// Les actions
export class GetMovieAction implements Action {
  readonly type = GET_MOVIES;
}
 
export class GetMovieActionSuccess implements Action {
  readonly type = GET_MOVIES_SUCCESS;
  constructor(public payload: any) { }
}
 
export class GetMovieActionError implements Action {
  readonly type = GET_MOVIES_ERROR;
  constructor(public payload: any) { }
}
```
⚐ Attention, on implémente l'interface "Action" cependant elle ne possède que la propriété type (le payload ayant été enlevé de l'interface ...), le moyen le plus répandu est de rajouter la propriété en public directement dans le constructeur.

Création du Reducer
---

Pour pouvoir créer notre Reducer j'ai besoin d'avoir un State, simple interface avec une propriété Data pour contenir la donnée ( en l'occurence un tableau de Movie ), un booléen pour signifier si nous sommes en chargement et une erreur. Nous verrons après comment rattacher ce modèle au Store.

```ts
// State Type
export interface MoviesState {
  data: Movie[];
  loading: boolean;
  error: string;
}
```

Maintenant notre Reducer, en prenant soin de définir un State initial.

```ts
// Initial state
export const initialState: MoviesState = {
  data: [],
  loading: false,
  error: ''
};
 
// REDUCER
export function reducer(
  state = initialState,
  action: MovieActions.GetMovieAction | MovieActions.GetMovieActionError | MovieActions.GetMovieActionSuccess
): MoviesState {
  switch (action.type) {
    case MovieActions.GET_MOVIES: {
      return {
        ...state,
        loading: true
      };
    }
    case MovieActions.GET_MOVIES_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
    case MovieActions.GET_MOVIES_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    }
  }
 
  return state;
}
```

Plusieurs points à noter là-dessus. La fonction reducer prend en paramètre un state (avec l'initial state en propriété par défaut) et une action du type souhaité, on retrouve là notre caracteristique "pure".

A noter aussi que nous prenons le state initial par défaut et que le Reducer modifie uniquement les propriétés nécéssaires, en l'occurence, lors de l'événement "GET_MOVIES" je spécifie à mon state qu'il est en chargement et donc le isLoading passe à true, lors d'un success ou d'un cas d'erreur, j'élimine cet etat de chargement et je nourris respectivement la data ou l'erreur avec le payload.

Définition du State
---

Il faut voir le State de notre application comme un arbre, il y aura differents niveaux et accesseurs suivant la donnée que l'on souhaite acquérir.

Dans l'app module il va falloir rajouter 2 imports:

```ts
StoreModule.forRoot({}),
StoreModule.forFeature('elements', reducers),
```

Le premier définit un tableau de Reducers initiaux et le suivant permet d'importer des Reducers regroupés par "features" pour les modules lazy loadés. Dans l'exemple, 'elements' représente la clef de la feature, et le second paramètre est un objet qui représente les Reducers pour l'ensemble de notre feature. Voilà comment je l'ai défini :

```ts
// State de notre feature
export interface ElementsState {
  movies: MoviesState;
}
 
// Reducers pour notre state
export const reducers: ActionReducerMap<ElementsState> = {
  movies: reducer
};
```

Où cette fois-ci "reducer" correspond bien à notre fonction créée précédemment.

Création des Selectors
---

Pour pouvoir accèder à un élément de notre state, il faut créer des Selectors.
Il y a 2 types de Selectors, les FeatureSelector et les simples Selector, vous l'aurez compris, le FeatureSelector nous permet de récupérer au top-level le State d'une feature et les autres, des grappes à l'interieur de la feature, voici un exemple :

```ts
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
 
// globalState
export const getElementsState = createFeatureSelector<ElementsState>('elements');
 
// moviesState
export const getMoviesState = createSelector(getElementsState, (state: ElementsState) => state.movies);
 
// pure datas
export const getAllMovies = createSelector(getMoviesState, getMovies);
```

Ok, jusqu'ici on a déjà bien représenté le data flow de notre Store, nous pouvons dispatcher notre premiere action depuis un component.

Appel depuis un composant
---

Container component

Pour bien distinguer la notion de container et presentational component, nous allons en créer un de chaque, voyons le container,
côté Typescript :

```ts
import { Component, OnInit } from '@angular/core';
import { ElementsState, getAllMovies, getMoviesState } from './store/reducers/index.reducer';
import { Store } from '@ngrx/store';
import { getMovies, MoviesState } from './store/reducers/movies.reducer';
import { Observable } from 'rxjs/Observable';
import { Movie } from './models/movie.model';
import { GetMovieAction } from './store/actions/index.action';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  movies$: Observable<MoviesState>;
 
  constructor(private store: Store<ElementsState>) {}
 
  ngOnInit() {
    this.movies$ = this.store.select<MoviesState>(getMoviesState);
    this.store.dispatch(new GetMovieAction());
  }
}
```

Rien d'extraordinaire, on injecte notre store pour le type voulu, et on récupère un Observable de notre state grâce aux selectors ( que nous avons créés précédement ) avec la méthode .select. Il ne reste plus qu'à dispatch une action, en l'occurence de type GET_MOVIES.
Pour rappel, notre observable movies$ sera donc résolu 2 fois car notre Reducer et notre middleware vont être notifiés de l'action, et ce dernier renvoyant une action succeed ou error.

La vue:

{{< highlight html "linenos=table,linenostart=1" >}}
<h2>There is {{(movies$|async).data.length}} movies</h2>
<span [hidden]="!(movies$|async).loading">Loading...</span>
<span>{{(movies$|async).error}}</span>
 
<!-- Presentational component -->
<app-movies [hidden]="(movies$|async).loading" [movies]="(movies$ |async).data"></app-movies>
```

⚐ A noter l'utilisation du pipe "async"

 * aucun soucis pour gérer une valeur par défaut en attendant la résolution
 * on peut l'utiliser plusieurs fois pour le même observable ( une seule souscription est faite)
 * l'Unsubscribe est géré tout seul comme un grand
 * Utilisé dans un binding, il mettra bien à jour la référence à chaque résolution de l'observable
 * ..

 Presentational Component

 Ici le composant Movies de présentation:

```ts
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { ElementsState, getAllMovies, getMoviesState } from './store/reducers/index.reducer';
import { Store } from '@ngrx/store';
import { getMovies, MoviesState } from './store/reducers/movies.reducer';
import { Observable } from 'rxjs/Observable';
import { Movie } from './models/movie.model';
import { GetMovieAction } from './store/actions/index.action';
 
@Component({
  selector: 'app-movies',
  template: `<ul>
                <li *ngFor="let movie of movies">{{movie.title}}</li>
            </ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush
 
})
export class MoviesComponent {
 
  @Input()
  movies: Movie[];
 
  constructor() {
  }
}
```

⚐ A noter la changeDetectionStrategy d'angular sur "OnPush", en effet la détection de changement ne se fera uniquement sur modification de référence passée sur les @Input() du composant (ce qui vaut pour le binding d'un observable via le pipe async comme on le fait plus haut) ou sur les event Handler

⚐ Code complet (article parties 1 & 2) disponible ici : [https://github.com/Bubbuls/ngrx-demo](https://github.com/Bubbuls/ngrx-demo)

Voila
===

Jusqu'ici le store est mis en place, nous sommes capables de dispatcher une action, et de récupérer un nouveau state en fonction, nous avons vu plusieurs points comme le pipe async pour résoudre les observables, la stratégie de détection OnPush pour rajouter un peu d'immutabilité dans nos composants.

Mais nous n'avons pas de données, je vous invite à passer à la partie 2 de cet article qui montrera comment appeler un service Angular ou tout autre élément externe grâce aux side-effects (volontaires), ça se trouve ici : [Librairies NGRX pour une application Angular réactive. Part 2/3 : ngrx/Effects](/)