app.controller('BanHangTaiQuayController', function ($scope, $http, $routeParams) {
    const id_HoaDonTaiQuay = $routeParams.id;
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

    $http
        .get('http://localhost:8080/api/banHang/taiQuay/getHoaDonChitiet/' + id_HoaDonTaiQuay, { headers })
        .then(function (response) {
            const hoaDonChiTiet = response.data;
            $scope.hoaDonChiTiet = hoaDonChiTiet;
        });

    $scope.tongTienHoaDon;
    $scope.tienThieu;
    $scope.tienTraLai = '';

    $http
        .get('http://localhost:8080/api/banHang/taiQuay/getHoaDon/' + id_HoaDonTaiQuay, { headers })
        .then(function (response) {
            const hoaDon = response.data;
            $scope.tongTienHoaDon = hoaDon.tongTienHoaDon;
            $scope.tienThieu = hoaDon.tongTienHoaDon;
            $scope.hoaDon = hoaDon;
        });

    $scope.tienKhachDua = '';

    $scope.tinhTienTraLai = function () {
        let tienKhachDua = parseInt($scope.tienKhachDua);
        if (isNaN(tienKhachDua)) {
            tienKhachDua = 0;
        }

        $scope.tienThieu = $scope.tongTienHoaDon - tienKhachDua;
        if ($scope.tienThieu < 0) {
            $scope.tienThieu = 0;
        }

        $scope.tienTraLai = tienKhachDua - $scope.tongTienHoaDon;
        if ($scope.tienTraLai < 0) {
            $scope.tienTraLai = 0;
        }
    };

    $http
        .get('http://localhost:8080/api/banHang/taiQuay/khachHang/list', {
            headers,
        })
        .then(function (response) {
            const khachHangList = response.data;
            $scope.khachHangList = khachHangList;
        });

    $http
        .get('http://localhost:8080/api/banHang/taiQuay/khuyenMai/list', {
            headers,
        })
        .then(function (response) {
            const khuyenMai = response.data;
            $scope.khuyenMai = khuyenMai;
        });

    $scope.onKhuyenMaiChange = function () {
        $scope.themMaGiamGia = function () {
            let data = {
                id: id_HoaDonTaiQuay,
                tenMaGiamGia: $scope.KhuyenMaiDangChon,
            };

            $http
                .post('http://localhost:8080/api/banHang/taiQuay/add/khuyenMai', data, { headers })
                .then(function (response) {
                    const hoaDon = response.data;
                    console.log(hoaDon);
                    $scope.$evalAsync(function () {
                        $scope.tienTamTinh = hoaDon.tongTienHoaDon;
                        $scope.tongTienHoaDon = hoaDon.tongTienDonHang;
                        $scope.hoaDon = hoaDon;
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm mã giảm giá thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
                })
                .catch(function (e) {
                    Swal.fire({
                        icon: 'warning',
                        title: e.data.mess,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                });
        };
    };
    let khachHangDaChon;

    $scope.onKhachHangChange = function () {
        khachHangDaChon = $scope.KhachHangDangChon;
    };

    $scope.themThongTinKhachHang = function () {
        let data = {
            id: khachHangDaChon,
            hoTen: $scope.hoTenKhachHang,
            soDienThoai: $scope.SDTKhachHang,
            id_hoaDon: id_HoaDonTaiQuay,
        };

        $http
            .post('http://localhost:8080/api/banHang/taiQuay/add/KhachHang', data, {
                headers,
            })
            .then(function (response) {
                const hoaDon = response.data;
                console.log(hoaDon);
                $scope.$evalAsync(function () {
                    $scope.hoaDon = hoaDon;
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm khách hàng thành công',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                });
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

    $scope.quayLai = function () {
        window.location.href = '#!/danhSachHoaDon';
    };

    $scope.themSanPham = function () {
        localStorage.setItem('id_HD_TaiQuay', id_HoaDonTaiQuay);
        window.location.href = '#!/danhSachSanPham/taiQuay?id_hoaDon=' + id_HoaDonTaiQuay;
    };

    $scope.huyDon = function () {
        Swal.fire({
            title: 'Xác nhận hủy đơn',
            text: 'Bạn có chắc chắn muốn hủy đơn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id_HoaDonTaiQuay,
                };
                $http
                    .post('http://localhost:8080/api/banHang/taiQuay/huyDon', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.message,
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            window.location.href = '#!/danhSachHoaDon';
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                        console.log('Lỗi');
                    });
            }
        });
    };

    $scope.thanhToan = function () {
        Swal.fire({
            title: 'Xác nhận thanh toán',
            text: 'Bạn có chắc chắn muốn thanh toán đơn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                if ($scope.tienThieu !== 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Tiền khách đưa không đủ',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    return;
                } else {
                    let data = {
                        id: id_HoaDonTaiQuay,
                        email_user: decodedToken.email,
                    };
                    $http
                        .post('http://localhost:8080/api/banHang/taiQuay/thanhToan', data, {
                            headers,
                        })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.message,
                                showConfirmButton: false,
                                timer: 2000,
                            }).then(() => {
                                let data = {
                                    id: id_HoaDonTaiQuay,
                                    tienKhachDua: $scope.tienKhachDua,
                                    tienTraLai: $scope.tienTraLai,
                                };

                                $http
                                    .post('http://localhost:8080/api/banHang/taiQuay/inHoaDon/', data, {
                                        headers,
                                        responseType: 'arraybuffer',
                                    })
                                    .then(function (response) {
                                        let pdfBlob = new Blob([response.data], {
                                            type: 'application/pdf',
                                        });
                                        let pdfUrl = URL.createObjectURL(pdfBlob);

                                        let newWindow = window.open(pdfUrl, '_blank');
                                        if (newWindow) {
                                            newWindow.document.title = 'Hóa đơn của bạn';
                                        } else {
                                            alert('Vui lòng cho phép trình duyệt mở popup để xem và lưu hóa đơn.');
                                        }
                                    });
                                window.location.href = '#!/danhSachHoaDon';
                            });
                        })

                        .catch((e) => {
                            Swal.fire({
                                icon: 'warning',
                                title: e.data.err,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                }
            }
        });
    };

    $scope.xoaHDCT = function (hoaDonChiTiet) {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            let data = {
                id: hoaDonChiTiet.id,
            };
            $http
                .post('http://localhost:8080/api/banHang/taiQuay/xoaHDCT', data, {
                    headers,
                })
                .then(function (response) {
                    const hoaDon = response.data;
                    $scope.hoaDon = hoaDon;
                    Swal.fire({
                        icon: 'success',
                        title: 'Xóa thành công',
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        $http
                            .get('http://localhost:8080/api/banHang/taiQuay/getHoaDonChitiet/' + id_HoaDonTaiQuay, {
                                headers,
                            })
                            .then(function (response) {
                                const hoaDonChiTiet = response.data;
                                $scope.hoaDonChiTiet = hoaDonChiTiet;
                            });
                    });
                });
        });
    };
});
