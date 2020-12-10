---
lang: en
locale: en-us
title: Understand the Angular Structural Directives
date: "2019-02-01"
tags: ["angular",
     "directive",
     "ng-template",
     "microsyntax"]
belongs: 
	- en_us: 
---

I used a lot of structural directives without taking the time to understand how it works, but when you look at the *mycrosyntaxe* it seems interesting enough to look over it and see what can we do in a template node.

## The tip of the iceberg

The [structural directives](https://angular.io/guide/structural-directives) are directive which manipulate dom elements, starting with an asterisk like \*ngIf et \*ngFor. To be able to manipulate the dom, they wrap their actual node in a `<ng-template>` element, this node keep all his attributs except the directive itself, which become just like binding stuff like the following :

```html
<div *myDirective="randomProperty" > hello </div>

<!-- Become -->

<ng-template [myDirective]="randomProperty">
    <div > hello </div>
</ng-template>
```

## The Microsyntax

The precedent exemple was simple, now we are gonna deep dive into the syntax, which is a dedicated language ( Domain Language Specific ) and create template with all the bindings. To keep it simple , it's the string you provide to the directive.

Let's look the most common directive: \*ngFor.

```html
<div *ngFor="let item of items; let i=index">
    {{item.title}}
</div>

<!-- Become -->

<ng-template ngFor let-item [ngForOf]="items" let-i="index">
    <div>{{item.title}}</div>
</ng-template>
```

We can identify the microsyntax: *let item of items; let i=index* 
the dedicated parser found 3 key points: 
 - The *let* keyword are attributes.
 - The *of* keyword if a simple binding of type @Input() nammed *ngForOf*.
 - Our directive *ngFor*.

One identified they are replaced in our template.

### How it works ?

The keyword *of* is a property from *ngFor* , the microsyntax define properties as if they was prefixed by the name of the directive, so *of* represent the property *ngForOf* ( that dosen't apply to the *let-*)

Then *let* represent a [template input variable](https://angular.io/guide/template-syntax), in other words a variable we can access , scoped in the template (and for the children).

## Analyzing the content of a directive

### The creation

before creating our own structural directive, we need to understand that a directive is made with a context, the context is an object, carrying every properties we need ( the values passed by the *let-\*\** ) and a *$implicit* property which contains anything not assigned with a value in the microsyntax, let's see the schema below ↓

Assumption :

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

<!-- become -->

<ng-template [ngDirective]=" 'Salut' " let-arg let-e="event" [ngDirectiveFrom]=" 'coucou' ">
    <div>salut</div>
</ng-template>
```


![microsyntax](/images/structural-directive/microsyntaxe.png)

Now we create our own directive

```ts
import { Directive } from '@angular/core';

@Directive({
  selector: '[appMyDirective]'
})
export class MyDirective{

  constructor() { }

}
```

First we inject:

 - The template reference [TemplateRef<C>](https://angular.io/api/core/TemplateRef)
 - The container reference [ViewContainerRef](https://angular.io/api/core/ViewContainerRef)


Then we add an @Input


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

The context

```ts
export class MyDirectiveContext {
  public $implicit: any = null;
  public count: any = null;
}
```

Final base directive 
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

### DOM manipulation

We can now create our view, we'll do something similar to the *\*ngFor*, by creating an embeddedView for each iteration of our value ( an array )

*don't forget to clear the view before processing the directive, until you explicitly want to  not clear it.*

```ts
this.viewContainer.clear();
values.forEach((message, index)=>{
	this.viewContainer.createEmbeddedView(this.templateRef, {$implicit:message, count:this._context.count, index});
});
```
Then call it in the template

```ts
<p *myDirective="initialString; let implicit; let a=count; let i="index">
- $implicit = {{implicit}} &amp; totalCount = {{a}} &amp; currentIndex = {{i}}
</p>
```

Boom, that's the essential of the structural directives. Now you understand how simple the implementation of the *ngIf=condition else otherTemplate* is, and , why Angular force us to use only one structural directive on the same DOM element.

## Structural directive or component ?

I would say the two have differents uses, the components will be preferred for structural purpose and the directives, because of their flexibility ( interactions with host element or children ) will be used for logic problematics and dynamism. A simple example would be a (visual) board, containing different types of data, like Text, form input, button ... etc, the board itself would be a component and the cells drived by a directive with one template by data type.

Complete code on the Stackblitz below ↓↓

[https://stackblitz.com/edit/kal-structural-directive?embed=1&amp;file=src/app/my.directive.ts](https://stackblitz.com/edit/kal-structural-directive?embed=1&amp;file=src/app/my.directive.ts)


## Bonus

If you are used to write async pipes, you may have seen syntaxe like following

```ts
<div *ngIf="data$|async as data">
    {{data.title}} 
    {{data.info}}
</div>
```
The keyword *as* is from the microsyntax, and let you assign a new variable your value.