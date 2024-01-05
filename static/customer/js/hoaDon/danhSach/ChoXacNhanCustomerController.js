app.controller('choXacNhanCustomerController', function ($scope, $http) {
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
        .get('http://localhost:8080/customer/donHang/choXacNhan/' + decodedToken.email, { headers })
        .then(function (response) {
            const hoaDon = response.data;
            $scope.hoaDons = hoaDon;
        });

    $scope.customerhuyDon = function (hoaDon) {
        Swal.fire({
            title: 'Xác nhận hủy đơn hàng',
            text: 'Bạn có muốn hủy đơn hàng không?',
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
                    .post('http://localhost:8080/customer/donHang/huyDonCustomer/', data, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Hủy đơn hàng thành công',
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
        window.location.href = '#!/CTChoXacNhanCustomer?id=' + id;
    };
});

app.controller('CTChoXacNhanCustomer', function ($scope, $routeParams, $http) {
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
    $http.get('http://localhost:8080/hoaDon/chiTietHoaDon/choXacNhan/id=' + id, { headers }).then(function (response) {
        const respone = response.data;
        const hdct = respone.list_HDCT;
        $scope.hdct = hdct;

        const timeLine = respone.timeLine;
        $scope.timeLine = timeLine;

        const hoaDon = respone.hoaDon;
        $scope.hoaDon = hoaDon;

        const lsHoaDons = respone.lsHoaDons;
        $scope.lsHoaDons = lsHoaDons;
    });

    $scope.huyDonCT = function () {
        Swal.fire({
            title: 'Xác nhận hủy đơn hàng',
            text: 'Bạn có muốn hủy đơn hàng không?',
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
                    .post('http://localhost:8080/customer/donHang/huyDonCustomer/', data, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Hủy đơn hàng thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        window.location.href = '#!/don-hang';
                    });
            }
        });
    };
    $scope.quayLai = function () {
        window.location.href = '#!/don-hang';
    };
});
