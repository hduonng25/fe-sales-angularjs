app.controller('dangGiaoHangCustomerController', function ($scope, $http) {
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
    }

    $http
        .get('http://localhost:8080/customer/donHang/dangGiaoHang/' + decodedToken.email, { headers })
        .then(function (response) {
            const hoaDon = response.data;
            $scope.hoaDons = hoaDon;
        });

    $scope.DaNhanDuocHang = function (hoaDon) {
        Swal.fire({
            title: 'Xác nhận đã nhận được đơn hàng',
            text: 'Xác nhận đã nhận được đơn hàng?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: hoaDon.id,
                    nguoi_thao_tac: decodedToken.email,
                };

                $http
                    .post('http://localhost:8080/customer/donHang/daNhanDuocHang/', data, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thao tác thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        const hoaDon = response.data;
                        $scope.hoaDons = hoaDon;
                    });
            }
        });
    };

    $scope.DaNhanTatCa = function () {
        Swal.fire({
            title: 'Xác nhận đã nhận được tất cả đơn hàng',
            text: 'Xác nhận đã nhận được tất cả đơn hàng?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    nguoi_thao_tac: decodedToken.email,
                };

                $http
                    .post('http://localhost:8080/customer/donHang/daNhanTatCa/', data, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thao tác thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        const hoaDon = response.data;
                        $scope.hoaDons = hoaDon;
                    });
            }
        });
    };

    $scope.tochoXacNhan = function () {
        window.location.href = '#!/don-hang';
    };

    $scope.tochoGiaoHang = function () {
        window.location.href = '#!/choGiaoHang-Customer';
    };

    $scope.toDangGiao = function () {
        window.location.href = '#!/dangGiaoHang-Customer';
    };

    $scope.toDaGiao = function () {
        window.location.href = '#!/daGiaoHang-Customer';
    };

    $scope.toDaHuy = function () {
        window.location.href = '#!/daHuy-Customer';
    };

    $scope.chiTiet = function (hoaDon) {
        const id = hoaDon.id;
        window.location.href = '#!/CTDangGiaoHangCustomer?id=' + id;
    };
});

app.controller('CTDangGiaoHangCustomer', function ($scope, $routeParams, $http) {
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
    }

    const id = $routeParams.id;
    $http
        .get('http://localhost:8080/hoaDon/chiTietHoaDon/dangGiaoHang/id=' + id, { headers })
        .then(function (response) {
            const respone = response.data;
            const hdct = respone.list_HDCT;
            $scope.hdct = hdct;

            const timeLine_ChoXacNhan = respone.timeLine_ChoXacNhan;
            $scope.timeLine_ChoXacNhan = timeLine_ChoXacNhan;

            const timeLine_ChoGiaoHang = respone.timeLine_ChoGiaoHang;
            $scope.timeLine_ChoGiaoHang = timeLine_ChoGiaoHang;

            const timeLine_DangGiaoHang = respone.timeLine_DangGiaoHang;
            $scope.timeLine_DangGiaoHang = timeLine_DangGiaoHang;

            const hoaDon = respone.hoaDon;
            $scope.hoaDon = hoaDon;

            const lsHoaDons = respone.lsHoaDons;
            $scope.lsHoaDons = lsHoaDons;
        });

    $scope.daNhanDuocHangCT = function () {
        Swal.fire({
            title: 'Xác nhận đã nhận được đơn hàng',
            text: 'Xác nhận đã nhận được đơn hàng?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id,
                    nguoi_thao_tac: decodedToken.email,
                };

                $http
                    .post('http://localhost:8080/customer/donHang/daNhanDuocHang/', data, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thao tác thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        window.location.href = '#!/dangGiaoHang-Customer';
                    });
            }
        });
    };
    $scope.quayLai = function () {
        window.location.href = '#!/dangGiaoHang-Customer';
    };
});
