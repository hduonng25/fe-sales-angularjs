app.controller('DaThanhToanController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $scope.loadData = function () {
        $http.get('http://localhost:8080/hoaDon/taiQuay/daThanhToan/danhSach', { headers }).then(function (response) {
            const pending = response.data;
            $scope.pending = pending;
        });
    };

    $scope.loadData();

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 4,
        get pending() {
            if ($scope.pending && $scope.pending.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.pending.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.pending && $scope.pending.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil((1.0 * $scope.pending.length) / this.size);
            } else {
                // Trả về 0
                return 0;
            }
        },
        get pageNumbers() {
            const pageCount = this.count;
            const pageNumbers = [];
            for (let i = 1; i <= pageCount; i++) {
                pageNumbers.push(i);
            }
            return pageNumbers;
        },
    };

    //Tìm kiếm
    $scope.$watch('search', function (newVal) {
        if (newVal) {
            $http
                .get('http://localhost:8080/hoaDon/taiQuay/daThanhToan/timKiem=' + newVal, { headers })
                .then(function (response) {
                    const pending = response.data;

                    // Cập nhật lại dữ liệu trong table nhưng không load lại trang
                    $scope.$evalAsync(function () {
                        $scope.pending = pending;
                    });
                });
        } else {
            $scope.loadData();
        }
    });

    //Tìm kiếm ngày bắt đầu
    $scope.searchDateBill = function (searchDate) {
        let formattedDate = formatDate(searchDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http
            .get('http://localhost:8080/hoaDon/taiQuay/daThanhToan/timKiemNgay=' + formattedDate, { headers })
            .then(function (response) {
                const pending = response.data;

                $scope.$evalAsync(function () {
                    $scope.pending = pending;
                });
            });
    };

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    //Re load
    $scope.reLoad = function () {
        $scope.loadData();
    };

    // Hoá đơn chi tiết
    $scope.look = function (pending) {
        const id = pending.id;
        window.location.href = '#!/hdct_dathanhtoan?id=' + id;
    };
});

app.controller('HDCT_DaThanhToanController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    const id = $routeParams.id;
    $scope.loadData = function () {
        $http.get('http://localhost:8080/hoaDon/chiTietHoaDon/taiQuay/id=' + id, { headers }).then(function (response) {
            const respone = response.data;
            const hdct = respone.list_HDCT;
            $scope.hdct = hdct;
            const hoaDon = respone.hoaDon;

            $scope.hoaDon = hoaDon;
        });
    };

    $scope.loadData();
    $scope.quayLai = function () {
        window.location.href = '#!/da-thanh-toan';
    };
    $scope.inHoaDon = function () {
        const id = $routeParams.id;
        let data = {
            id: id,
        };
        $http
            .post('http://localhost:8080/api/banHang/taiQuay/inHoaDon/daThanhToan', data, {
                headers,
                responseType: 'arraybuffer',
            })
            .then(function (response) {
                let pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                let pdfUrl = URL.createObjectURL(pdfBlob);

                let newWindow = window.open(pdfUrl, '_blank'); // Mở trang mới chứa file PDF
                if (newWindow) {
                    newWindow.document.title = 'Hóa đơn của bạn';
                } else {
                    alert('Vui lòng cho phép trình duyệt mở popup để xem và lưu hóa đơn.');
                }
            });
    };
});
