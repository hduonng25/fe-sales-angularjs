app.controller('changePassController', function ($scope, $http) {
    $scope.change = function () {
        if ($scope.new_pass !== $scope.confirm_pass) {
            Swal.fire({
                icon: 'error',
                title: 'Mật khẩu không khớp',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            password_new: $scope.new_pass,
        };
        $http
            .put('http://localhost:8080/api/password/fogot-password', data)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.mess,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = 'http://127.0.0.1:5501/templates/auth/Login.html#!/login';
                });
            })

            .catch((e) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Co loi xay ra',
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };
});
