app.controller('DangGiaoHangController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    $scope.soDonHang = 0;
    $scope.loadData = function () {
        $http.get('http://localhost:8080/hoaDon/datHang/dangGiaoHang/danhSach', { headers }).then(function (response) {
            const pending = response.data;
            $scope.pending = pending;
        });
    };
    $scope.loadData();
    $scope.loadDataXN = function () {
        $http.get('http://localhost:8080/hoaDon/datHang/xacNhanDaGiao/danhSach', { headers }).then(function (response) {
            $scope.soDonHang = response.data.length;
        });
    };

    $scope.loadDataXN();
    // lay ra thong tin nguoi dang nhap
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

    // xác nhận đơn
    $scope.confirm = function (pending) {
        const id = pending.id;
        const checkOut_email = decodedToken.email;
        Swal.fire({
            title: 'Xác nhận đã giao đơn hàng',
            text: 'Đơn hàng này đã tới tay khách hàng?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đã giao',
            cancelButtonText: 'Chưa',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id,
                    email_user: checkOut_email,
                };
                $http
                    .post('http://localhost:8080/hoaDon/datHang/dangGiaoHang/capNhatTrangThai/daGiaoHang', data, {
                        headers,
                    })
                    .then(function (response) {
                        $scope.loadData();
                        Swal.fire('Xác nhận thành công!', '', 'success');
                        $http
                            .get('http://localhost:8080/hoaDon/datHang/choXacNhan/guiMail/' + id, { headers })
                            .then(function (response) {});
                    })
                    .catch(function (error) {});
            }
        });
    };

    // từ chối xác nhận ( trạng thái đã huỷ đơn 5)
    $scope.huyDon = function (pending) {
        const id = pending.id;
        const checkOut_email = decodedToken.email;

        Swal.fire({
            title: 'Xác nhận huỷ đơn hàng',
            html: '<input type="text" id="cancelReason" class="swal2-input" placeholder="Lý do hủy">',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                const cancelReason = document.getElementById('cancelReason').value;
                let data = {
                    id: id,
                    email_user: checkOut_email,
                    ghiChu: cancelReason, // Include the cancel reason in the data
                };
                $http
                    .post('http://localhost:8080/hoaDon/datHang/dangGiaoHang/capNhatTrangThai/huyDon5', data, {
                        headers,
                    })
                    .then(function (response) {
                        $scope.loadData();
                        ///end lệnh
                        Swal.fire('Huỷ đơn hàng thành công!', '', 'success');
                        $http
                            .get('http://localhost:8080/hoaDon/datHang/choXacNhan/guiMail/' + id, { headers })
                            .then(function (response) {});
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    };

    //Tìm kiếm
    $scope.$watch('search', function (newVal) {
        if (newVal) {
            $http
                .get('http://localhost:8080/hoaDon/datHang/dangGiaoHang/timKiem=' + newVal, { headers })
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
            .get('http://localhost:8080/hoaDon/datHang/dangGiaoHang/timKiemNgay=' + formattedDate, { headers })
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
        window.location.href = '#!/CTDangGiaoHang?id=' + id;
    };
});

app.controller('CTDangGiaoHang', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    const id = $routeParams.id;
    $scope.loadData = function () {
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
    };

    $scope.loadData();

    $scope.quayLai = function () {
        window.location.href = '#!/dang-giao';
    };
    // lay ra thong tin nguoi dang nhap
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
    // xác nhận đơn
    $scope.confirm = function (pending) {
        const id = $routeParams.id;
        const checkOut_email = decodedToken.email;
        Swal.fire({
            title: 'Xác nhận đã giao đơn hàng',
            text: 'Đơn hàng này đã tới tay khách hàng?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đã giao',
            cancelButtonText: 'Chưa',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id,
                    email_user: checkOut_email,
                };
                $http
                    .post('http://localhost:8080/hoaDon/datHang/dangGiaoHang/capNhatTrangThai/daGiaoHang', data, {
                        headers,
                    })
                    .then(function (response) {
                        $scope.quayLai();
                        Swal.fire('Xác nhận thành công!', '', 'success');
                        $http
                            .get('http://localhost:8080/hoaDon/datHang/choXacNhan/guiMail/' + id, { headers })
                            .then(function (response) {});
                    })
                    .catch(function (error) {});
            }
        });
    };

    // từ chối xác nhận ( trạng thái đã huỷ đơn 5)
    $scope.huyDon = function (pending) {
        const id = $routeParams.id;
        const checkOut_email = decodedToken.email;

        Swal.fire({
            title: 'Xác nhận huỷ đơn hàng',
            html: '<input type="text" id="cancelReason" class="swal2-input" placeholder="Lý do hủy">',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                const cancelReason1 = document.getElementById('cancelReason').value;
                let data = {
                    id: id,
                    email_user: checkOut_email,
                    ghiChu: cancelReason1, // Include the cancel reason in the data
                };
                $http
                    .post('http://localhost:8080/hoaDon/datHang/dangGiaoHang/capNhatTrangThai/huyDon5', data, {
                        headers,
                    })
                    .then(function (response) {
                        $scope.quayLai();
                        ///end lệnh
                        Swal.fire('Huỷ đơn hàng thành công!', '', 'success');
                        $http
                            .get('http://localhost:8080/hoaDon/datHang/choXacNhan/guiMail/' + id, { headers })
                            .then(function (response) {});
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    };
});
