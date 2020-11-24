---
lang: fr
locale: fr-fr
title: "Note : outil de débug pour votre store redux"
date: "2018-11-30"
description: "Voici une petite note sur le débug d'une application avec state management, notamment Redux, et plus précisément pour cet exemple, avec du NGRX. L'outil reste cependant agnostique de toute librairie et peut être implémenté n'importe où si l'on suit bien les étapes d'implémentation de la doc. ..."
tags: ["ngrx", "redux", "devtool"]
belongs: 
	- fr_fr: ""
---
Voici une petite note sur le débug d'une application avec state management, notamment Redux, et plus précisément pour cet exemple, avec du NGRX. L'outil reste cependant agnostique de toute librairie et peut être implémenté n'importe où si l'on suit bien les étapes d'implémentation de la doc.

  

Je parle ici d'une extension chrome/firerox qui permet de visualiser tout ce qui se passe du point de vue de votre store redux, cette extension est pas mal utilisé depuis plus d'un an et, vu la praticité de l'outil, ça serait dommage de passer à coté.

  

## Quels sont les outils ?

  

- Extension Chrome/Firefox **Redux DevTools Extension**
Tout d'abord, il nous faut cette extension car tout le travail est fait la dedans. L'interface va nous permettre de visualiser le flux d'actions, ainsi que les évolutions des states à chaque instant.

Vous pouvez trouver toutes les informations d'installation/d'utilisation ici :**[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension).**

 - Package npm **@ngrx/store-devtool (optionnel)** 
[https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md](https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md).
Ce package vous permet de faire communiquer votre store avec l'extension sans se soucier de rajouter vous même les configurations.  
Il vous faut juste importer le module du package dans votre module angular avec les options voulues. Ce sera la seule action à faire avant que ça marche !

⚐ **à noter que si vous n’êtes pas dans un projet angular/ngrx ou que vous ne voulez pas dépendre d'un package supplémentaire (optionnel ci dessus) vous trouverez chaque étape pour implémenter vous même la communication entre votre store et l'extension du navigateur sur le premier lien.**

```ts
@NgModule({
    declarations: [
        // ...
    ],
    imports: [
        // ...
        StoreDevtoolsModule.instrument({
            maxAge: 10
        })
    ],
    providers: [
        // ...
    bootstrap: [AppComponent]
})
```

Attention si, en Prod, vous voulez importer ce module ou non ; vous pouvez jouer avec les options ou la variable d’environnement pour ça.

## Les tableaux de bord
Commençons par le premier menu déroulant en haut à gauche où il est écrit "Inspector". Nous pouvons choisir ici 3 boards différents:

 - Inspector: vue classique divisé en 2 parties

![redux-devtool-board.png](/images/redux-devtool-board.png)

 - La chronologie des actions du store à gauche  
Elle vous permet de retrouver toutes les actions jouées dans votre store et le moment de leur exécution.  
Il y a 3 actions possibles (visibles en les survolant de la souris ):
	 - "jump" pour naviguer dans les différents états/states
	- "skip" pour exclure une action d'un rejeu
	- Aussi il est possible de réordonner les actions entres elles via un drag'n drop, à des fins de rejeu.
- Le détail de chaque action à droite montre plusieurs éléments
	- Dans un premier temps, on peut choisir entre "Action" pour les détails de l'objet ( le type et l'action dans notre cas )
	- Puis "State" qui représente le state global à l'instant T
	- Et enfin "Diff" qui montre un différentiel entre le state précédent et le nouveau ( une fois l'action appliquée )
-   Tout ceci visible avec 3 affichages différents "Tree" "Chart" et "Raw" pour un affichage formalisé, brut ou bien sous forme de graphique

![redux-devtool-tabs.gif](/images/redux-devtool-tabs.gif)

-   "Log monitor", qui est tout simplement la même vue mais plus axée sur l'ordre et la chronologie
-   Enfin la vue "Chart" qui s'actualise en temps réel pendant le traitement des actions. Cette vue nous montre le state global de l'application, l'arbre en entier.

![redux-devtool-chart.png](/images/redux-devtool-chart.png)

## Conclusion, les actions possibles

Comme je l'ai dit, il existe pas mal d'outils pour le rejeu des actions durant l'utilisation de l'application :

-   🔥La possibilité d'exporter ou importer l'historique du state de l'application ( utile pour reproduire un bug par exemple )🔥
-   Un Slider (visible ci-dessus) de type "time travelling"
-   Un saut vers n’importe quel state
-   La possibilité de réordonner les actions

Et en bonus

-   Un champ de texte vous propose de dispatcher vous-mêmes une action
-   Il est possible d'utiliser l'extension en remote, par exemple sur une application Atom/Electron ou même React native

Voila pour la petite note, attention à ce que votre package store-devtool corresponde bien à la version majeure que vous utilisez pour NGRX.

Bon débug !