---
lang: fr
locale: fr-fr
title: Comprendre les structural directives d'angular
date: "2019-02-01"
description: "J'ai beaucoup utilisé les directives structurelles sans avoir pris le temps de me demander comment ça fonctionnait, cependant la \"mycrosyntaxe\" d'angular paraissait suffisamment puissante pour y faire un détour, initialement je me suis souvent demander ce qui était possible de faire grace aux templates angular, alors voyons comment cela fonctionne..."
tags: ["angular",
     "directive",
     "ng-template",
     "microsyntaxe"]
belongs: 
	- en_us: 
---

J'ai beaucoup utilisé les directives structurelles sans avoir pris le temps de me demander comment ça fonctionnait, cependant la *mycrosyntaxe* d'angular paraissait suffisamment puissante pour y faire un détour, initialement je me suis souvent demander ce qui était possible de faire grace aux templates angular, alors voyons comment cela fonctionne.


## La surface de l'iceberg


Les [directives structurelles](https://angular.io/guide/structural-directives) d'angular sont les directives qui manipulent les éléments du dom, reconnaissables du fait qu'elles commencent toutes par un asterisk, comme par exemple \*ngIf et \*ngFor.
 
Pour pouvoir manipuler le dom, ces directives wrap le nœud actuel du dom dans un élément <ng-template>, le nœud conserve tous ses attributs sauf la directive elle-même, qui ne devient plus qu'un simple binding sur le template, comme suit :


```html
<div *myDirective="randomProperty" > hello </div>

<!-- Devient -->

<ng-template [myDirective]="randomProperty">
    <div > hello </div>
</ng-template>
```

## La microsyntaxe


L'exemple précédent était simple, ici on va  aller plus loins et s'intéresser à la microsyntaxe qui est un langage dédié ( ou Domain Language Specific ) et qui permet de créer le template avec tous les bindings nécessaires.
Autrement dit, c'est la string donnée à votre directive.

Prenons le cas le plus répandu et clair : la directive \*ngFor.

```html
<div *ngFor="let item of items; let i=index">
    {{item.title}}
</div>

<!-- Devient -->

<ng-template ngFor let-item [ngForOf]="items" let-i="index">
    <div>{{item.title}}</div>
</ng-template>
```

On peut identifier la microsyntaxe qui est *let item of items; let i=index* 
Le parser dédié a permit de déterminer 3 elements clef :

 - les mot clef *let * étaient des attributs.
 - le mot clef *of * un binding de type @Input() nommé *ngForOf*.
 - notre directive initiale *ngFor *.

une fois les éléments identifiés, ils sont replacé dans le template.

### Mais d'ou ça sort tout ça ?


Tout d'abord le mot clef *of * est une propriété appartenant à la directive ngFor, la microsyntaxe définit les propriétés comme étant préfixés par le nom de la directive, donc of fait référence à la propriété ngForOf et contrairement aux let-** ici c'est un binding type @Input().

En suite *let * représente un [template input variable](https://angular.io/guide/template-syntax) c'est à dire une variable à laquelle nous aurons accès, scopé dans le template ( donc aussi à ses enfants ), leurs valeurs viennent de la directive elle-même, mais nous allons voir ça par la suite

## Contenu d'une directive structurelle


### Création


Ok, avant de commencer à créer notre directive il faut savoir qu'une directive de ce type est composé d'un contexte, celui-ci est un objet contenant toutes les propriétés dont nous avons besoin ( les fameux let-i et let-item dans l'exemple du \*ngFor ) ainsi qu'une propriété spéciale *$implicit* qui représente la référence de tout ce qui n'est pas assigné par une valeur dans la microsyntaxe. Avec un schema ça passe mieux ↓


Postulat :

```ts
export class MyDirectiveContext{
  public $implicit: any = null;
  public event: any = null;
}
```

```html
<div *ngDirective=" 'Salut'; let arg; let e=event; from 'coucou' ">
    salut
</div>

<!-- Devient -->

<ng-template [ngDirective]=" 'Salut' " let-arg let-e="event" [ngDirectiveFrom]=" 'coucou' ">
    <div>salut</div>
</ng-template>
```


![microsyntaxe](/images/microsyntaxe.png)

Maintenant nous allons créer une directive nous même.

```ts
import { Directive } from '@angular/core';

@Directive({
  selector: '[appMyDirective]'
})
export class MyDirective{

  constructor() { }

}
```

Dans un premier temps il va falloir injecter 2 ressources nécessaires au templating,

 - La référence d'un template via la class [TemplateRef<C>](https://angular.io/api/core/TemplateRef)
 - La référence du conteneur pour éditer les vues, via la class [ViewContainerRef](https://angular.io/api/core/ViewContainerRef)

Puis nous rajoutons une propriété input représentant ce que l'on va binder à la directive


```ts
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[myDirective]'
})
export class MyDirective{

   constructor(
    private templateRef:TemplateRef<any>,
    private viewContainer:ViewContainerRef
  ){ }

  @Input()
  set myDirective(value:any){
    // TODO
  }
}

```


Définissons un contexte

```ts
export class MyDirectiveContext {
  public $implicit: any = null;
  public count: any = null;
}
```

Il ne reste plus qu'à créer la vue embarquée


```ts
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[myDirective]'
})
export class MyDirective{
  private _context:MyDirectiveContext = new MyDirectiveContext();
  private _myDirective;

   constructor(
    private templateRef:TemplateRef<any>,
    private viewContainer:ViewContainerRef
  ){ }

  @Input()
  set myDirective(value:any){
    this._myDirective = value;
    const values = value.split('.');
    this._context.count = values.length;
  }
}

```

Voila, seulement à ce stade , rien ne se passe, car nous disposons bien d'une balise <ng-template> mais sans contenu !

### Manipulation du DOM


Pour créer des vues embedded, il suffit d'utiliser le templateRef et le viewContainerRef afin de créer une vues enfant basé sur un template donné.
On va faire quelque chose de semblable à la directive \*ngFor, tout à l'heure nous avions splité notre chaine de caractères, nous allons créer une vue pour chacune des cases du tableau obtenu.

```ts
this.viewContainer.clear();
    values.forEach((message, index)=>{
      this.viewContainer.createEmbeddedView(this.templateRef, {$implicit:message, count:this._context.count, index});
    });
```


d'abord un clear pour vider le container, puis pour chacune des entrées nous créons une vue, en donnant en guise de paramètre , le template initial , et un nouveau contexte.

il ne reste plus qu'à appeler la directive dans une vue

```ts
<p *myDirective="initialString; let implicit; let a=count; let i="index">
- $implicit = {{implicit}} &amp; totalCount = {{a}} &amp; currentIndex = {{i}}
</p>
```

Et voila vous savez l'essentiel sur les directives structurelles. Maintenant les syntaxes comme *ngIf="condition else otherTemplate"* deviennent clair, tout comme le fait qu'angular nous limite à une seule directive structurelle par balise, forcément il serait difficile pour 2 directives de vouloir manipuler le même DOM en simultané. Du coup la derniere question à se poser c'est :component ou directive ?

En fait je dirai que les 2 ont un role bien different, on va répondre à une demande de structuration avec les components, qui sont les briques principales de l'application et au contraire plutot répondre à un besoin de logique et de dynamisme avec les directives structurelles qui sont plus souples (intéraction facile avec l'host ou lels éléments enfants), un exemple simple serait un tableau dynamique qui peut , dans chaque case afficher différent type de donnée : texte brut, input de formulaire, boutton ..etc, le tableau en lui même sera un composant, tandis qu'on va jouer sur les template pour fournir le bon format de donnée dans les cases.


Code complet et démo sur le Stackblitz ci-dessous ↓↓

<iframe src="https://stackblitz.com/edit/kal-structural-directive?embed=1&amp;file=src/app/my.directive.ts" width="770" height="800px"></iframe>

## Bonus

Si vous etes habitué du pipe async d'angular vous devez parfois voir ce genre de code

```ts
<div *ngIf="data$|async as data">
    {{data.title}} 
    {{data.info}}
</div>
```

Le mot clef *as* est propre à la microsyntaxe (donc utilisable au sein d'un template) et permet d'exporter une valeur vers une nouvelle variable. Via une directive vide de logique on va pouvoir réutiliser ce qui est fait ci-dessus sans être obligé d'utiliser un ngIf qui va masquer votre template si la condition n'est pas remplie. ( voir *mySecondDirective* sur le stackblitz )