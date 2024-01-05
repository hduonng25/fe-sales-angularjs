app.controller('RegisterController', function ($scope, $http) {
    $scope.dangKy = function () {
        let data = {
            hoTen: $scope.hoTen,
            soDienThoai: $scope.soDienThoai,
            email: $scope.email,
            ngaySinh: $scope.ngaySinh,
            diaChi: $scope.diaChi,
            matKhau: $scope.matKhau,
        };
        $http
            .post('http://localhost:8080/khachHang/register', data)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = 'http://127.0.0.1:5501/templates/auth/Login.html#!/login';
                });
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Trùng dữ liệu',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                });
            });
    };

    $scope.returnDangNhap = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/auth/Login.html#!/login';
    };
});
