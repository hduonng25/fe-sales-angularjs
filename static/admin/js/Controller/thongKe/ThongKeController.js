app.controller('thongKeController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $http.get('http://localhost:8080/thongKe/tongDoanhSo', { headers }).then(function (response) {
        $scope.tongDoanhSo = response.data;
        $scope.tongTien = 0;

        angular.forEach($scope.tongDoanhSo, function (item) {
            $scope.tongTien += item.tong_tien_hoadon;
        });
    });

    $http.get('http://localhost:8080/thongKe/tongDoanhSoonline', { headers }).then(function (response) {
        $scope.tongDoanhSo = response.data;
        $scope.tongTien_online = 0;

        angular.forEach($scope.tongDoanhSo, function (item) {
            $scope.tongTien_online += item.tong_tien_hoadon;
        });
    });

    $http.get('http://localhost:8080/thongKe/tongDoanhSooffline', { headers }).then(function (response) {
        $scope.tongDoanhSo = response.data;
        $scope.tongTien_offline = 0;

        angular.forEach($scope.tongDoanhSo, function (item) {
            $scope.tongTien_offline += item.tong_tien_hoadon;
        });
    });

    $http.get('http://localhost:8080/thongKe/thongKeTheoNgay', { headers }).then(function (response) {
        $scope.tongTienHomNay = 0;
        $scope.hangBanDuocHomNay = 0;
        angular.forEach(response.data, function (item) {
            $scope.hangBanDuocHomNay += item.so_san_pham_da_ban;
            $scope.tongTienHomNay += item.tong_tien_hoadon;
        });
    });

    $scope.thangLoad = '';
    $http.get('http://localhost:8080/thongKe/thongKeTheoThang', { headers }).then(function (response) {
        $scope.tongTienThang = 0;
        $scope.hangBanDuocThang = 0;
        let currentDate = new Date();

        // Lấy tháng từ đối tượng ngày
        let currentMonth = currentDate.getMonth() + 1;
        $scope.thangLoad = currentMonth;

        angular.forEach(response.data, function (item) {
            $scope.hangBanDuocThang += item.so_san_pham_da_ban;
            $scope.tongTienThang += item.tong_tien_hoadon;
        });
    });

    function createChart(months, values) {
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Dữ liệu thống kê',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
    $scope.namLoad = '';
    $http.get('http://localhost:8080/thongKe/thongKeTheoNam', { headers }).then(function (response) {
        let data = response.data;
        let currentDate = new Date();
        $scope.namLoad = currentDate.getFullYear();

        let months = [];
        let values = [];
        // let values1 = [];

        data.forEach(function (item) {
            months.push(item.thang);
            values.push(item.tong_tien_hoadon);
            // values1.push(item.tong_tien_hoadon);
        });

        ctx = document.getElementById('myChart').getContext('2d');
        createChart(months, values);
    });

    $http.get('http://localhost:8080/thongKe/sanPhambanChay', { headers }).then(function (response) {
        const sanPhamBanChay = response.data;
        $scope.sanPhamBanChay = sanPhamBanChay;
    });

    $scope.thang = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.locTheoThang = function (thang) {
        $scope.thangLoad = thang;
        $http
            .get('http://localhost:8080/thongKe/thongKeTheothangTruyenVao/' + thang, { headers })
            .then(function (response) {
                $scope.tongTienThang = 0;
                $scope.hangBanDuocThang = 0;

                angular.forEach(response.data, function (item) {
                    $scope.hangBanDuocThang += item.so_san_pham_da_ban;
                    $scope.tongTienThang += item.tong_tien_hoadon;
                });
            });
    };

    $scope.nam = [2023, 2024, 2025];
    $scope.locTheoNam = function (nam) {
        $scope.namLoad = nam;
        $http
            .get('http://localhost:8080/thongKe/thongKeTheoNamTruyenVao/' + nam, { headers })
            .then(function (response) {
                let data = response.data;

                months = [];
                values = [];

                data.forEach(function (item) {
                    months.push(item.thang);
                    values.push(item.tong_tien_hoadon);
                });

                if (window.myChart) {
                    window.myChart.destroy();
                }

                createChart(months, values);
            });
    };
});
