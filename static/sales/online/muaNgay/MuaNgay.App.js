const app = angular.module('MuaNgayApp', ['ngRoute']);

app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/banHang/muaNgay/CheckOut.html',
            controller: 'MuaNgayController',
        });
    },
]);
