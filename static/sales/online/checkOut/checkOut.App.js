const app = angular.module('checkOutApp', ['ngRoute']);

app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/banHang/online/BanHangOnline.html',
            controller: 'checkOutController',
        });
    },
]);
