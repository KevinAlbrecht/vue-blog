---
lang: en
locale: en-us
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

Talking about IoT, the Microsoft Azure IoT suite provide 2 really cool solutions, the "Event Hub" and the "IoT Hub". We will the big picture in order to understand typical scenarios.

## Event Hub vs IoT Hub


### Technical differences

Globally, those 2 services  are similar, made for large scale data processing, low latency but let's compare them :


  _  			| IoT Hub			| Event Hub
  ------------- | -------------		| ---------
  Communication  | Bi-directional		| Uni-directional
  Protocols  | AMQP, WebSocket, HTTP/1, MQTT | AMQP, WebSocket,  HTTP/1
  Security | Device-level identity | Shared access strategy
  Dashboards | Event logs for the devices connectivity, authentifications & communications, accurate alerts for failures. | Only charts for the Hub
  Scaling | Millions simultaneous devices connexions  | up to 5000 AMQP connexions 

### Use cases

In fact, until now , the Event Hub which was made for processing " events telemetry ", was the right choice for a communication Device -> cloud scenario.
Now the IoT became a big thing, the IoT was created to replace the Event Hub in those scenarios (thanks to the bi-directional canal) and the Event Hub is now the big brother made to manage events, in a large scale scenario.

IoT Hub exemple : An alert, made by a device (after  some data analysis ) or simply displaying real time metrics on a dashboard.

### Conclusion

The IoT Hub is a complexe service made to be the entry point of communication from devices to the Cloud, and the Event Hub, a really simple tool used in most of the case for accessing datas in a dashboard ( Cloud -> dashboard).

## Creating Hubs on the Azure platform

### IoT Hub

For the IoT hub, I will suggest you to read my colleague's article right here ( In French ) [Azure IoT Hub, provisioning et configuration](https://blogs.infinitesquare.com/posts/iot/azure-iot-hub-provisioning-et-configuration) by Michaël Fery.

### Event Hub

Let's create an Event Hub ! First, connect on the [classic Azure portal](https://manage.windowsazure.com/), then in the section "Service Bus" click on "create", complete the form, let the type on "Messaging" and don't try to change it to "Notification Hub"( which is the coice for Push Notification )

![CreationServiceBusForIot](/images/iot-hub/CreationServiceBusForIot.png)

Once it's created, continue and create an "Event Hub" :

![CreationEventHub](/images/iot-hub/CreationEventHubForIot.png)

Good, now you can manage your shared access strategy in the options like following :
![CreationEventHub](/images/iot-hub/azure-event-hub-strategy.jpg)

Voila, the connection string is accessible from the Service Bus directly.