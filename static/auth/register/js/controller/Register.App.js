const app = angular.module('RegisterApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/',
    });
});
