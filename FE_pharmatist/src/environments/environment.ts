// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3004/api',
  firebase: {
    apiKey: 'AIzaSyDgYiTfbYmTMoZ0mO2u6vAYuVQdDZS5lb0',
    authDomain: 'pharmacistai.firebaseapp.com',
    projectId: 'pharmacistai',
    storageBucket: 'pharmacistai.appspot.com',
    messagingSenderId: '616357006562',
    appId: '1:616357006562:web:a1e349d64099de0840a2bb',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
