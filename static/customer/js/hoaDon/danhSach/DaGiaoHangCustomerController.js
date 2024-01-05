app.controller('daGiaoHangCustomerController', function ($scope, $http) {
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
        .get('http://localhost:8080/customer/donHang/daGiaoHang/' + decodedToken.email, { headers })
        .then(function (response) {
            const hoaDon = response.data;
            $scope.hoaDons = hoaDon;
        });

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
        window.location.href = '#!/CTDaGiaoHangCustomer?id=' + id;
    };
});

app.controller('CTDaGiaoHangCustomer', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    const id = $routeParams.id;
    $http.get('http://localhost:8080/hoaDon/chiTietHoaDon/daGiaoHang/id=' + id, { headers }).then(function (response) {
        const respone = response.data;
        const hdct = respone.list_HDCT;
        $scope.hdct = hdct;

        const timeLine_ChoXacNhan = respone.timeLine_ChoXacNhan;
        $scope.timeLine_ChoXacNhan = timeLine_ChoXacNhan;

        const timeLine_ChoGiaoHang = respone.timeLine_ChoGiaoHang;
        $scope.timeLine_ChoGiaoHang = timeLine_ChoGiaoHang;

        const timeLine_DangGiaoHang = respone.timeLine_DangGiaoHang;
        $scope.timeLine_DangGiaoHang = timeLine_DangGiaoHang;

        const timeLine_DaGiaoHang = respone.timeLine_DaGiaoHang;
        $scope.timeLine_DaGiaoHang = timeLine_DaGiaoHang;

        const hoaDon = respone.hoaDon;
        $scope.hoaDon = hoaDon;

        const lsHoaDons = respone.lsHoaDons;
        $scope.lsHoaDons = lsHoaDons;
    });
    $scope.quayLai = function () {
        window.location.href = '#!/daGiaoHang-Customer';
    };
});
