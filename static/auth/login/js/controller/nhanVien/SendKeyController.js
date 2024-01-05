app.controller('senkeyController', function ($scope, $http) {
    $scope.senKeys = function () {
        let email = $scope.email_user;
        if (email === undefined) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập đúng định dạng email',
                showConfirmButton: false,
                timer: 2000,
            });
        }

        let data = {
            email: email,
        };
        $http
            .post('http://localhost:8080/api/password/get-keys', data)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.sucess,
                    showConfirmButton: false,
                    timer: 2000,
                });
            })

            .catch((e) => {
                Swal.fire({
                    icon: 'error',
                    title: e.data.error,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    $scope.checkKeys = function () {
        let data = {
            keys: $scope.keys,
        };

        $http
            .post('http://localhost:8080/api/password/check-keys', data)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.sucess,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    window.location.href = 'http://127.0.0.1:5501/templates/auth/Reset.html#!/';
                });
            })

            .catch((e) => {
                Swal.fire({
                    icon: 'error',
                    title: e.data.error,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };
});
