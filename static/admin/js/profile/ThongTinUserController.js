app.controller('ThongTinUserController', function ($scope, $http) {
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
    let email = decodedToken.email;
    let sdthoai = decodedToken.sdt;

    $scope.GioiTinhChon = true;
    $http.get('http://localhost:8080/api/user/thongTin/' + email, { headers }).then(function (response) {
        const NhanVien = response.data;
        $scope.hoTen = NhanVien.hoTen;
        $scope.email = NhanVien.email;
        $scope.sdt = NhanVien.soDienThoai;
        $scope.ngaySinh = NhanVien.ngaySinh;
        sdthoai = NhanVien.soDienThoai;
    });

    $scope.$watch('selectedGender', function (newVal, oldVal) {
        if (newVal === 'Nam') {
            $scope.GioiTinhChon = true;
        } else {
            $scope.GioiTinhChon = false;
        }
    });

    $scope.chinhSua = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền chỉnh sửa thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        // let email = $scope.email;
        // if (email !== decodedToken.email || sdthoai !== decodedToken.sdt && decodedToken.role === 'STAFF') {
        // Swal.fire({
        //           icon: "warning",
        //           title: "Bạn không có quyền chỉnh sửa email hoặc số điện thoại",
        //           showConfirmButton: false,
        //           timer: 2000,
        //      });
        // }

        let data = {
            name: $scope.hoTen,
            email: $scope.email,
            phoneNumber: $scope.sdt,
            gioiTinh: $scope.GioiTinhChon,
            dateOfBirth: $scope.ngaySinh,
        };

        $http.post('http://localhost:8080/api/user/suaThongTin', data, { headers }).then(function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Sửa thành công',
                showConfirmButton: false,
                timer: 2000,
            });

            const NhanVien = response.data;
            $scope.hoTen = NhanVien.hoTen;
            $scope.email = NhanVien.email;
            $scope.sdt = NhanVien.soDienThoai;
            $scope.ngaySinh = NhanVien.ngaySinh;
            $scope.GioiTinhChon = NhanVien.gioiTinh;
            sdthoai = NhanVien.soDienThoai;
        });
    };

    $scope.doiMatKhauNV = function () {
        window.location.href = '#!/doimatkhau';
    };
});
