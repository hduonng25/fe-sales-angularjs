app.controller('doimatkhauNV', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
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
    $scope.luuMK = function () {
        let data = {
            password_old: $scope.currentPassword,
            password_new: $scope.newPassword,
            email: decodedToken.email,
        };
        $http
            .post('http://localhost:8080/api/changePass/staff/changePass', data, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công',
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

    $scope.quayLai = function () {
        window.location.href = '#!/thong-tin-user';
    };
});
