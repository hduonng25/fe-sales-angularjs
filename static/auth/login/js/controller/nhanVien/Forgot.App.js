const app = angular.module('senkeysApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/',
    });
});
