---
{
	"title": "Use enterprise certificate for windows Cordova package",
   	"date": "2016-02-11",
   	"description": "Dealing with windows applications you may have to use enterprise certificate but unlike simple Windows 8.1/10 app, in Cordova we can't just press a button to import a certificate...",
   	"tags": [
      "Windows",
      "Cordova",
      "Certificat"
   	],
}
---
Dealing with windows applications you may have to use enterprise certificate but unlike simple Windows 8.1/10 app, in Cordova we can't just press a button to import a certificate.

The task il simple but just a bit longer than traditional native apps here is the process :

First: Install and add the certificate.
--------------------------------------------------

Indeed you have to install the certificate, when you are at the installation options, don't forget to select the current user then the "personal store" to avoid issues at the build. Then add the certificate in the native resources folder.

![result image](/cert_6B272457.png)

Second : thet the Thumbprint
------------------------------------

You have to give the Thumbprint, to find it, open PowerShell and execute the following :

**Get-ChildItem -path cert:\LocalMachine\My**

![result image](/cert_6717AA8B.png)

Third : Configure build informations
---

We'll now fill the build.json file in the root of your project.

It may already contains the following build information in depending on platform and the release/debug state.

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

Voila, you are now able to build in release and use the “Create App Package” option.