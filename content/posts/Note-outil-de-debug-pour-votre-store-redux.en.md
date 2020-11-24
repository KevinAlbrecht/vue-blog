---
lang: en
locale: en-us
title: "Note : Redux store debugging"
date: "2018-11-30"
description: "Here is a little note about the debug of a Redux state managed web app, and for the example I will use angular with NGRX, but don't worry this tool works with pretty any of the most known spa frameworks.  ..."
tags: ["ngrx", "redux", "devtool"]
belongs: 
	- fr_fr: ""
---
Here is a little note about the debug of a Redux state managed web app, and for the example I will use angular with NGRX, but don't worry this tool works with pretty any of the most known spa frameworks. 
  

## What tools ?


- Chrome/Firefox Extension: **Redux DevTools Extension**
First download this extension , it will represent your board on your browser when debugging: **[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension).**

 - Npm Package  **@ngrx/store-devtool (ngrx purpose, optional)** 
[https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md](https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md).
```bash
npm install @ngrx/store-devtools --save
```

*⚐ If you don't to add extra packages, you can follow the documentation of the browser extention, he explain how to configure it for any framework.*

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

## Dashboards
First you can see the left menu "Inspector", you can choose from 3 options:

 - Inspector: The classic view, in two parts

![redux-devtool-board.png](/images/redux-devtool-board.png)

 - On the left, the actions chronology   
Here you can see every dispatched actions.
3 triggers (visible if you hover your mouse over an action):
	- "jump" Navigate to the differents states
	- "skip" Exclude an action
	- In addition you are able to reorder actions with drag&drop maybe to **replay a set of actions** in a different order.
- On the right, the details of an action :
	- Choose "Action" to see the details of the object (type + action)
	- "State" means the current state at the moment of the action
	- Then "Diff" to compare the state before and after the action was applied
-   Thoses datas ar visible in 3 modes "Tree" "Chart" and "Raw"

![redux-devtool-tabs.gif](/images/redux-devtool-tabs.gif)

-   "Log monitor", the same view but focused on the timestamp
-   And finally "Chart" which updates itself in real time while your application is running. Represents you global state.

![redux-devtool-chart.png](/images/redux-devtool-chart.png)

## Conclusion

-   🔥Import/export of state history (perfect for reproducing bugs)🔥
-   "Time travelling" slider
-   The possibility to jump on any state of the application
-   Reordering dispatched actions

bonus

-   You can dispatch actions to your app direclty from an input in the dashboard.
-   Your are not limited to localhost, it can run on any website which allow it.

Enjoy debugging.