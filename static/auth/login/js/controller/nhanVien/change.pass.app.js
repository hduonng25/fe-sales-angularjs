const app = angular.module('changeApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/',
    });
});
