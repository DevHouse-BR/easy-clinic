
// Meteor.startup(function () {
// WebApp.rawConnectHandlers.use(function(req, res, next)
//   {
//     console.log(req);
//     // res.setHeader("X-Clacks-Overhead", "GNU Terry Pratchett");
//     // return next();
//   })
// });


/*

Changing language
To set and change the language that a user is seeing, you should call TAPi18n.setLanguage(fn), where fn is a (possibly reactive) function that returns the current language. For instance you could write


// A store to use for the current language
export const CurrentLanguage = new ReactiveVar('en');


import CurrentLanguage from '../stores/current-language.js';
TAPi18n.setLanguage(() => {
  CurrentLanguage.get();
});
Then somewhere in your UI you can CurrentLanguage.set('es') when a user chooses a new language.

*/