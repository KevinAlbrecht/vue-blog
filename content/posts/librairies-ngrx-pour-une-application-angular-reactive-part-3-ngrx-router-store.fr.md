---
lang: fr
locale: fr-fr
title: Librairies ngrx pour une application angular reactive part 3 ngrx router store
date: "2018-06-04"
description: "la librairie router-store est tout simplement un pont pour faire communiquer le router Angular à notre store, l'idée est de renforcer la notion de \"single source of truth\" du pattern Redux...."
tags: ["angular",
     "ngrx",
     "redux",
     "router"]
belongs: 
	- en_us: 

---

Voici la derniere partie sur les librairies NGRX, si vous n'avez pas déjà vu les précédentes, ça commence là → :[Librairies NGRX pour une application Angular réactive. Part 1/3 : ngrx/store](https://www.kevinalbrecht.dev/fr/blog/librairies-ngrx-pour-une-application-angular-reactive-part-1-ngrx-store)


ngrx/router-store
===

![ngrx](/images/ngrx.png)

ngrx/router-store ?
---

la librairie router-store est tout simplement un pont pour faire communiquer le router Angular à notre store, l'idée est de renforcer la notion de "single source of truth" du pattern Redux.

Github →  [https://github.com/ngrx/platform/tree/master/docs/effects](https://github.com/ngrx/platform/tree/master/docs/effects)

Nous allons voir 3 points principaux, fonctionnements que nous rajoutons au projet initial:

 - Rajouter les éléments de la route courante à notre state
 - Récupérer automatiquement une donnée en fonction de la route
 - La navigation via un Effect ?


Intégrer le routeSnapshot à notre state
---

Comme pour notre state créé dans la partie 1/3 nous allons rajouter un enregistrement dans le module de notre application (facultatif si l'on choisit de tout enregistrer en tant que root)

```ts
// Register au module
StoreModule.forFeature('router', routerReducers),
 
// ****
 
// ActionReducerMap
export const routerReducers: ActionReducerMap<RouterState> = {
    routerReducer: routerReducer
};
 
// Le state
export interface RouterState {
    routerReducer: RouterReducerState<MyRouterStateSnapshot>;
}
 
// Le modele représentant le snapshot
 
export interface MyRouterStateSnapshot {
    url: string;
    params: Params;
    queryParams: Params;
}
 
// Enfin le selecteur 
export const getRouterState = createFeatureSelector<RouterReducerState<MyRouterStateSnapshot>>('router');
```

Voila le résultat brut retourné à une url donnée : 

```ts
{ "routerReducerState": { "state": { "url": "/category/1", "params": { "categoryId": "1" }, "queryParams": {} }, "navigationId": 1 } }
```

Enfin nous pouvons créer un sélecteur qui va agréger les states de films et de la route tel que :

```ts
export const getSelectedMoviesState = createSelector(getElementsState, getRouterState, (state: ElementsState, router: any) => {
    return { router: router ? router.routerReducer : {}, movies: state.movies };
});
```

Et voila, pour la suite nous n'utiliserons pas ce dernier sélecteur, mais plutôt le premier afin de récupérer uniquement les données de la route avant de récupérer la donnée finale dans le composant.

Récupérer une donnée automatiquement en fonction de la route
---

Nous savons requêter les données du routeur, mais il serait dommage, si l'on veut récupérer de la data à afficher en fonction de la route de devoir d'abord requêter l'un, puis l'autre.

Voilà le postulat actuel : nous sommes dans une application présentant une liste de catégories de films, si l’on clique sur une catégorie nous naviguons sur une route avec l’identifiant de la catégorie voulue et ainsi nous voulons récupérer tous les films appartenant à cette catégorie.

Voici notre route:

```ts
{ path: 'category/:categoryId', component: MoviesComponent, pathMatch: 'full' },
```

Contrairement au précédent exemple nous allons récupérer le state de la route directement dans l’Effect associé à la récupération de movies et ainsi permettre de récupérer uniquement les movies par l’Id de catégorie.

Pour cela je vous invite à créer :
 - 2 actions :
  - GetSelectedMovies
  - GetSelectedMoviesSuccess
 - 2 cas dans le réducer de categories, un pour chaque action.

 Tout cela nous l’avons vu dans les articles précédents.

Ce qui nous interesse ici c’est l’Effect, en effet on va voir comment utiliser un selector pour récupérer le snapshot de la route.

Voila comment procéder :

```ts
@Effect()
    selectedMovies$ = this.actions$.ofType(MovieActions.GET_SELECTED_MOVIE)
        .pipe(
            withLatestFrom(

            // recuperation de la route
 
            ),
            switchMap((newPayload: { action: Action, payload: number }) => {

            // appel au service pour récupérer les films

            }));
```

Nous avons notre Effect, avant d’utiliser l’opérateur switchMap pour pouvoir retourner notre nouvel observable, nous utilisons l’opérator withLatestFrom, cet opérateur prend plusieurs paramètres, en l’occurrence , un ou plusieurs élément asynchrones ( observable , promise … ) et enfin une fonction retournant un nouvel observable, l’opérateur sert à déclencher cette fonction à chaque nouvelle version des observable donnés.

```ts
@Effect()
    selectedMovies$ = this.actions$.ofType(MovieActions.GET_SELECTED_MOVIE)
        .pipe(
            withLatestFrom(
                this.store.select<any>(getRouter),
                (action, payload) => {
                    if (!payload.state.params['categoryId']) {
                        throw { message: 'no category Id given' };
                    }
                    return {
                        action: action,
                        payload: payload.state.params['categoryId']
                    };
                }),
            switchMap((newPayload: { action: Action, payload: number }) => {
 
                //
  
            }));
```

Le premier paramètre de notre opérateur sera un sélecteur pour notre snapshot de route, le second est notre méthode pour extraire le paramètre voulu et l’on retourne un nouvel objet contenant l’action reçue initialement ainsi qu’un payload contenant notre paramètre de route.

Ceci sera reçu par la suite dans le switchmap qui, comme vu dans l’article sur les effect, nous permet de retourner le nouvel observable avec notre donnée.

Effect final

```ts
@Effect()
    selectedMovies$ = this.actions$.ofType(MovieActions.GET_SELECTED_MOVIE)
        .pipe(
            withLatestFrom(
                this.store.select<any>(getRouter),
                (action, payload) => {
                    if (!payload.state.params['categoryId']) {
                        throw { message: 'no category Id given' };
                    }
                    return {
                        action: action,
                        payload: payload.state.params['categoryId']
                    };
                }),
            switchMap((newPayload: { action: Action, payload: number }) => {
                return this.movieService.getMoviesByCategoryId(newPayload.payload)
                    .pipe(
                        map(movies => {
                            return new MovieActions.GetSelectedMovieActionSuccess(movies);
                        }),
                        catchError(err => of(new MovieActions.GetMovieActionError(err)))
                    );
            }));
```

Voilà plus besoin de récupérer le paramètre depuis le composant, il ne reste plus qu’à utiliser le sélecteur et dispatch l’action dans notre composant comme suit :

```ts
this.selectedMoviesState$ = this.store.select<any>(getSelectedMovies);
        this.store.dispatch(new GetSelectedMovieAction());
```

Naviguer depuis un effect
---

La navigation aussi peut être ajoutée dans le cycle.

Pour cela nous pouvons créer des effects & actions pour les types de navigation :

 - **Go** pour la navigation vers une route
 - **Foreward** pour une navigation « suivant » navigateur
 - **Back** pour une navigation « retour » navigateur

**⚐ Pas besoin de réducers ici car nous ne touchons pas au state.**

Voilà un exemple tel qu’implémenté dans l’application angular ngrx vitrine [https://github.com/ngrx/example-app]( https://github.com/ngrx/example-app )


```ts
export class Go implements Action {
    readonly type = GO;
 
    constructor(public payload: {
        path: any[];
        query?: object;
        extras?: NavigationExtras;
    }) { }
}
 
export class Back implements Action {
    readonly type = BACK;
}
```

Et les effects:

**⚐ Attention à préciser dans le décorator « dispatch :false » car effectuant une navigation nous ne renvoyons pas de nouvelle action à traiter.**

```ts
@Effect({ dispatch: false })
    CustomGoNavigation$ = this.actions$.ofType(GO)
        .pipe(
            tap((action: Go) => {
                this.router.navigate(action.payload.path, { queryParams: action.payload.query, ...action.payload.extras });
            }));
 
    @Effect({ dispatch: false })
    CustomBackNavigation$ = this.actions$.ofType(BACK)
        .pipe(
            tap((action: Back) => {
                // or you can wrap the window reference and inject as angularJS does it natively with $window.
                window.history.back();
            }));
 
    @Effect({ dispatch: false })
    CustomForwardNavigation$ = this.actions$.ofType(FORWARD)
        .pipe(
            tap((action) => {
                window.history.forward();
            }));
```

Maintenant nous pouvons considérer lors d’une erreur de récupération de donnée dans un effect précédent, de retourner une action de type « Go » pour naviguer sur une page d’erreur par exemple.

Dans les faits, la navigation directement depuis un composant , en passant par le Router.navigate() n’est pas vraiment anti-pattern par ailleurs, à la version 2 du framework , le package contenait des actions natives « Go ,Back ,Foreward… »  qui se sont avérées plutôt négligeables et retirées du package à la version 4.x .

Conclusion
---

C'est la fin de cette première série d'articles sur la librairie Ngrx, nous avons vu les briques principales et suffisantes pour débuter une application complète.

Pour finir, quelques mots de "pour et contres" , d'abord nous sommes encouragés à scinder nos composants en container/presenter afin d'utiliser la stratégie OnPush, donc de gagner en principe de "Single responsibility" des composants, et éviter certaines erreur/compléxités dues au fait de faire transiter une donnée à travers plusieurs couches avant d'être consommées. 
Aussi une des premières questions à se poser est si l'on va réutiliser une donnée de multiples fois à travers l'application, plus on nécessite une donné plus elle sera transportée au travers des composants et dans une architecture classique il peut en résulter une source de complexité, Redux se propose comme étant une solution à ce problème.

En points négatifs on peut citer en premier lieu la charge de code nécessaire pour un simple fonctionnement, récupérer une simple donnée demande de créer de nombreuses classes et fonctions nécessaire au dataflow, donc évidement pour une application de petite envergure c'est à réfléchir.
Ensuite cela reste une dépendance externe à gérer et toute la conception d'une application à comprendre et apprivoiser. Cependant la plupart des notions (redéfinir la responsabilité des composants, stratégie OnPush, ) sont ici encouragées ce qui veut dire qu'on peut bien entendu les appliquer sans utiliser Redux.

Maintenant à vous de voir, que la Réactivité soit avec vous.