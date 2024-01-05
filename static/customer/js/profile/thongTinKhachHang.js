app.controller('ThongTinKhachHang', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    let decodedToken;

    if (token) {
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

        decodedToken = parseJwt(token);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Bạn cần phải đăng nhập để xem thông tin',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/templates/auth/Login.html#!/login';
        });
    }

    decodedToken = parseJwt(token);
    let email = decodedToken.email;

    $http.get('http://localhost:8080/api/customer/thongTin/' + email, { headers }).then(function (response) {
        const KhachHang = response.data;
        $scope.hoTen = KhachHang.hoTen;
        $scope.email = KhachHang.email;
        $scope.sdt = KhachHang.soDienThoai;
        $scope.ngaySinh = KhachHang.ngaySinh;
        $scope.diaChi = KhachHang.diaChi;
    });
    $scope.chinhSua = function () {
        let data = {
            hoTen: $scope.hoTen,
            soDienThoai: $scope.sdt,
            email: $scope.email,
            ngaySinh: $scope.ngaySinh,
            diaChi: $scope.diaChi,
        };
        $http.post('http://localhost:8080/api/customer/suaThongTinKhach', data, { headers }).then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Sửa thành công',
                showConfirmButton: false,
                timer: 2000,
            });

            const KhachHang = response.data;
            $scope.hoTen = KhachHang.hoTen;
            $scope.email = KhachHang.email;
            $scope.sdt = KhachHang.soDienThoai;
            $scope.ngaySinh = KhachHang.ngaySinh;
            $scope.diaChi = KhachHang.diaChi;
        });
    };
    $scope.doimatkhau = function () {
        window.location.href = '#!/doi-mat-khau';
    };
});
