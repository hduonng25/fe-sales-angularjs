const app = angular.module('AuthApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/list-khuyenMai', {
            templateUrl: '/templates/admin/KhuyenMai/DanhSach.html',
            controller: 'KhuyenMaiController',
        })
        .otherwise({
            redirectTo: '/login',
        });
});
