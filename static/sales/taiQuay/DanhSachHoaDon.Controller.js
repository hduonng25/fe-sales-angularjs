app.controller('danhSachHoaDonController', function ($scope, $http) {
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

    $http.get('http://localhost:8080/api/banHang/taiQuay/danhSachHoaDon', { headers }).then(function (response) {
        const hoaDon = response.data;
        $scope.hoaDon = hoaDon;
    });

    let id_HoaDonTaiQuay;

    $scope.updateIdHoaDonTaiQuay = function (id) {
        id_HoaDonTaiQuay = id;
    };

    $scope.banHang = function (hoaDon) {
        $scope.updateIdHoaDonTaiQuay(hoaDon.id);
        window.location.href = '#!/banHang?id=' + id_HoaDonTaiQuay;
    };

    $scope.taoHoaDon = function () {
        let data = {
            email_user: decodedToken.email,
        };
        $http
            .post('http://localhost:8080/api/banHang/taiQuay/taoHoaDon', data, { headers })
            .then(function (response) {
                $scope.updateIdHoaDonTaiQuay(response.data);
                window.location.href = '#!/banHang?id=' + id_HoaDonTaiQuay;
            })
            .catch(function (e) {
                Swal.fire({
                    icon: 'error',
                    title: e.data.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    $scope.xoaHoaDon = function (hoaDon) {
        let data = {
            email_user: decodedToken.email,
            id: hoaDon.id,
        };
        Swal.fire({
            title: 'Xác nhận xóa hóa đơn',
            text: 'Bạn có chắc chắn muốn xóa hóa đơn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .post('http://localhost:8080/api/banHang/taiQuay/xoaHoaDon', data, { headers })
                    .then(function (response) {
                        const hoaDon = response.data;
                        // Cập nhật lại dữ liệu trong bảng mà không load lại trang
                        $scope.$evalAsync(function () {
                            $scope.hoaDon = hoaDon;
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                    })
                    .catch(function (error) {
                        console.log('Lỗi');
                    });
            }
        });
    };
});
