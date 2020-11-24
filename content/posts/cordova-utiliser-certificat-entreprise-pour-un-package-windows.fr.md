---
lang: fr
locale: fr-fr
title: Utiliser un certificat d’entreprise pour un package Windows pour Cordova
date: "2016-02-11"
description: "En ce qui concerne les application pour la plateforme Windows, il peut arriver même lors de phases de recettes d’avoir à utiliser un certificat Entreprise, sauf que contrairement à un projet d’application Windows 8.1/10, nous ne disposons pas de simple bouton pour importer un certificat...."
tags: ["Windows",
      "Cordova",
      "Certificat"]
belongs: 
	- en_us: 
---
FR
En ce qui concerne les application pour la plateforme Windows, il peut arriver même lors de phases de recettes d’avoir à utiliser un certificat Entreprise, sauf que contrairement à un projet d’application Windows 8.1/10, nous ne disposons pas de simple bouton pour importer un certificat.

La tâche est très simple mais juste un peu plus longue que pour les applications traditionnelles, voilà les étapes de packaging:

Première étape: Installer et ajouter le certificat
--------------------------------------------------

En effet il est nécessaire d’installer le certificat, lorsque vous êtes sur les options d’installation, pensez à bien sélectionner l’utilisateur courant puis le magasin“Personnel” pour éviter toute erreur lors de la build, puis ajoutez le certificat dans le dossier de ressources native.

![result image](/cert_6B272457.png)

2eme étape : récupérer le Thumbprint
------------------------------------

Il faut renseigner le Thumbprint du certificat, pour le trouver il vous suffit d’ouvrir PowerShell et d’exécuter la commande suivante :

**Get-ChildItem -path cert:\LocalMachine\My**

Et voila le résultat, vous allez pouvoir récupérer le thumbprint correspondant.

![result image](/cert_6717AA8B.png)

3eme étape : Configurer les informations de build
---

Allons maintenant remplir le fichier build.json qui se trouve à la racine de votre projet.

Celui-ci doit contenir les information de build suivant la plateforme et l’état de release ou debug

```javascript
{
  "windows": {
    "release": {
      "packageCertificateKeyFile": "res\\native\\windows\\myAppCertificate.pfx",
      "packageThumbprint": "AAAAABBBBBCCCCCDDDDD00000111112222233333",
      "publisherId": "E=moi@coucou.fr, CN=My Corp, OU=TEST, O=My Personnal Corp, L=PARIS, S=PARIS, C=FR"
    }
  }
}
```

Fin, vous pouvez maintenant build en release et faire votre petit click droit “Create App Package”.