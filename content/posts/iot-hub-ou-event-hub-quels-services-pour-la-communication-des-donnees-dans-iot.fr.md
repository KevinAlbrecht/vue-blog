---
lang: fr
locale: fr-fr
title: IoT Hub ou Event Hub, Quels services pour la communication des données dans l’IoT ?
date: "2016-03-01"
description: "Parmi les briques Azures, on trouve 2 éléments particulièrement intéressants pour la communication d'information dans le domaine de l'IoT, nous avons l' Event Hub et l' IoT Hub. Dans cet article nous allons comparer ces services afin de déduire les scénarios d'utilisation adéquats à chacun...."
tags: ["azure",
      "iot",
      "event hub",
      "iot hub"]
belongs: 
	- en_us: 
---

### Introduction


Parmi les briques Azures, on trouve 2 éléments particulièrement intéressants pour la communication d'information dans le domaine de l'IoT, nous avons l' "Event Hub" et l' "IoT Hub". Dans cet article nous allons comparer ces services afin de déduire les scénarios d'utilisation adéquats à chacun.

## Event Hub vs IoT Hub


### Différences techniques

Globalement ces 2 services ont des attributs similaires, ils sont conçus pour travailler avec un débit élevé de données, une faible latence mais voyons ici un comparatif des différences techniques:


  _  			| IoT Hub			| Event Hub
  ------------- | -------------		| ---------
  Communication  | Bidirectionnelle		| Unidirectionnelle
  Protocoles  | AMQP, WebSocket, HTTP/1, MQTT | AMQP, WebSocket,  HTTP/1
  Sécurité | Fonctionne avec un carnet d'identité et un contrôle d'accès destiné aux devices communicants | Fournit des stratégies d'accès partagés entre les devices
  Observation des communications | Un panel d'évènements est fourni entre la connectivité des appareils, authentification et communication, alertant précisément de toute défaillance. | Dispose uniquement d'un graphique de mesures à l'échelle du Hub
  Scaling | Prise en charge de millions d'appareils connectés simultanément | jusqu'à 5000 connexions AMQP

### Cas d’utilisation

En réalité, ces Hubs n'ont pas toujours été en concurrence. L'Event Hub était l'outil spécialisé dans le traitement de "télémétrie et d'évènement" et donc prédestiné à être utilisé pour l'IoT, dans le cadre d'une communication Device->Cloud.
Cependant le besoin en IoT grandissant, une nouvelle solution a été apportée , l'IoT Hub, un hub entièrement pensé pour le domaine prenant la place de l'Event Hub dans la communication Device -> Cloud.
Aujourd'hui il est recommandé d'utiliser l'IoT Hub pour les messages depuis les devices vers le cloud, en profitant du canal bidirectionnel pour une éventuelle réponse vers les devices,et d'utiliser l'Event Hub pour la gestion d'évènements générés par le traitement des données massives.

Exemple : Alerte générée par un device, après analyse de ses données récupérées ou tout simplement pour de l'analyse de devices en temps réel sur un tableau de bord.

### Conclusion

Nous pouvons maintenant bien distinguer l'utilisation des 2 outils.

L'IoT Hub est un élément complexe et particulièrement complet pour les scénarios IoT, il est le point d'entrée de la communication des devices vers le cloud. Tandis que l'Event Hub est quant à lui un outil très simple à maitriser, permettant une gestion d'évènements plutôt efficace descendant du cloud vers un tableau de bord ou un service de notification cliente.

## Mise en place des Hubs sur la plateforme Azure

### IoT Hub


En ce qui concerne l'IoT Hub, je vous conseille vivement de regarder l'article [Azure IoT Hub, provisioning et configuration](https://blogs.infinitesquare.com/posts/iot/azure-iot-hub-provisioning-et-configuration#.VtMhGJzhChc) par Michaël Fery.

### Event Hub


Nous allons maintenant créer un Event Hub. Pour cela commencez par vous connecter sur le [portail Azure classique](https://manage.windowsazure.com/), puis dans la catégorie "Service Bus" cliquez sur créer, assignez un nom, une zone et laisser le type en "messagerie" et non Hub de notification (qui lui est un hub d’évènement dédié à la Push Notification)

![CreationServiceBusForIot](/images/iot-hub/CreationServiceBusForIot.png)

Une fois le service Bus créé, naviguez dessus pour atteindre la catégorie " Hub d'évènements" pour en créer un comme suit :

![CreationEventHub](/images/iot-hub/CreationEventHubForIot.png)

Voilà votre Event Hub créé. Il ne vous reste plus qu'à créer une stratégie d'accès partagé depuis l’onglet “configurer” de votre Hub comme suit afin de pouvoir consommer le service

![CreationEventHub](/images/iot-hub/azure-event-hub-strategy.jpg)

Enfin la chaine de connexion est à récupérer au niveau du service bus directement.