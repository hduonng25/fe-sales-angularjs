app.controller('LogoutController', function ($scope, $http) {
    $scope.logout = function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Đang chuyển hướng ra trang đăng nhập',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/templates/Auth/Login.html#!/login';
        });
    };
    $scope.DangKy = function () {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Đang chuyển hướng ra trang đăng ký',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/templates/auth/Register.html#!/';
        });
    };
});
