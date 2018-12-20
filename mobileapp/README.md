# tvs-app

Versions : IONIC 3 ,Angular Cordova 

Cordova Installation : 

 sudo npm install -g cordova

To Add All Requirements /Dependencies

cordova requirements

To List out platforms 
cordova platform ls
To Add Multiple Platforms : 

cordova platform add android
cordova platform add ios
cordova platform add browser
cordova platform add windows
 
To Normal Run Code In Browser :

ionic serve 
ionic serve --lab (labview ionic compatibility for all devices -ios,android,windows)

Default Port : 8100 for ionic serve
Default Port : 8200 ionic serve --lab

To Run in Emulator

cordova emulate android 
cordova emulate ios

Alternately, you can plug the handset into your computer and test the app directly:

cordova run android

Development Build

ionic cordova run android
ionic cordova run ios

Production Build 

ionic cordova run android --prod
ionic cordova run ios     --prod

