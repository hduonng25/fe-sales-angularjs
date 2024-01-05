app.controller('LoginController', function ($scope, $http) {
    $scope.email = '';
    $scope.password = '';
    $scope.login = function () {
        let data = JSON.stringify({
            email: $scope.email,
            password: $scope.password,
        });
        let config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $http
            .post('http://localhost:8080/login', data, config)
            .then(function (response) {
                localStorage.setItem('token', response.data.token);
                let token = localStorage.getItem('token');

                function parseJwt(token) {
                    let base64Url = token.split('.')[1];
                    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    let jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map(function (c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            })
                            .join(''),
                    );

                    let payload = JSON.parse(jsonPayload);
                    return payload;
                }
                let decodedToken = parseJwt(token);

                if (decodedToken.role === 'ADMIN' || decodedToken.role === 'STAFF') {
                    window.location.href = 'http://127.0.0.1:5501/templates/admin/home/index.html#!/';
                } else {
                    window.location.href = 'http://127.0.0.1:5501/templates/customer/home/index.html#!/';
                }
            })
            .catch(function (error) {
                if (error.status === 500) {
                    Swal.fire({
                        icon: 'warning',
                        title: error.data.message,
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(function () {
                        sessionStorage.setItem('isConfirmed', true);
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: error.data.message,
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(function () {
                        sessionStorage.setItem('isConfirmed', true);
                    });
                }
            });
    };

    $scope.returnDangKy = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/auth/Register.html#!/';
    };
    $scope.quenMatKhau = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/auth/ForgotPassword.html#!/';
    };
});
