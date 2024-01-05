app.controller('MuaNgayController', function ($scope, $routeParams, $http) {
    let id_HoaDonMuaNgay = localStorage.getItem('id_HoaDonMuaNgay');

    $http.get('http://localhost:8080/api/muaNgay/getHoaDon/' + id_HoaDonMuaNgay).then(function (response) {
        const hoaDon = response.data;
        $scope.tienTamTinh = hoaDon.tongTienHoaDon;
        $scope.tienShip = hoaDon.tienShip;
        $scope.tongTienHoaDon = hoaDon.tongTienDonHang;
        $scope.hoaDon = hoaDon;
    });

    $http.get('http://localhost:8080/api/muaNgay/getHoaDonChiTiet/' + id_HoaDonMuaNgay).then(function (response) {
        const hoaDonChiTiet = response.data;
        $scope.hoaDonChiTiet = hoaDonChiTiet;
    });

    $http.get('http://localhost:8080/api/muaNgay/khuyenMai/list').then(function (response) {
        const khuyenMai = response.data;
        $scope.khuyenMai = khuyenMai;
    });

    $scope.onKhuyenMaiChange = function () {
        $scope.addKhuyenMai = function () {
            let data = {
                id: id_HoaDonMuaNgay,
                id_khuyenMai: $scope.KhuyenMaiDangChon,
            };

            let tienShip = parseFloat(
                $('#shippingFee')
                    .text()
                    .replace(/[^0-9]/g, ''),
            );

            $http
                .post('http://localhost:8080/api/muaNgay/add/khuyenMai', data)
                .then(function (response) {
                    const hoaDon = response.data;
                    $scope.$evalAsync(function () {
                        console.log(hoaDon);
                        $scope.tienTamTinh = hoaDon.tongTienHoaDon;
                        $scope.tongTienHoaDon = hoaDon.tongTienDonHang;
                        $scope.hoaDon = hoaDon;
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm mã giảm giá thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });

                        let tongTienHoaDon = hoaDon.tongTienHoaDon;
                        let tongTienSauGiam = tongTienHoaDon + tienShip - hoaDon.tienGiam;

                        $('#total').text(
                            tongTienSauGiam.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }),
                        );
                    });
                })
                .catch(function (e) {
                    Swal.fire({
                        icon: 'error',
                        title: e.data.mess,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                });
        };
    };

    function fomatTien(tien) {
        let chuoiDaLoaiBo = tien.replace(/\./g, '').replace(' ₫', '');
        return parseFloat(chuoiDaLoaiBo);
    }

    $scope.datHang = function () {
        Swal.fire({
            title: 'Xác nhận đặt hàng',
            text: 'Bạn có muốn đặt hàng không?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let a = $('#total').text();
                let b = $('#shippingFee').text();
                let c = $('#subtotal').text();

                let tinhThanhPho = $('#province option:selected').text();
                let quanHuyen = $('#district option:selected').text();
                let phuongXa = $('#ward option:selected').text();
                let diaChiNhap = $scope.diaChi;
                let diaChi = diaChiNhap + ' - ' + phuongXa + ' - ' + quanHuyen + ' - ' + tinhThanhPho;

                let diaChi2;
                if (
                    diaChi.includes('Chọn Tỉnh/Thành phố') ||
                    diaChi.includes('Chọn Quận/Huyện') ||
                    diaChi.includes('Chọn Phường/Xã')
                ) {
                    diaChi2 = '';
                } else {
                    diaChi2 = diaChi;
                }

                const tongTienHoaDon = fomatTien(c);
                const tienShip = fomatTien(b);
                const tongTienDonHang = fomatTien(a);

                let data = {
                    id: id_HoaDonMuaNgay,
                    ghiChu: $scope.ghiChu,
                    email: $scope.email,
                    soDienThoai: $scope.soDienThoai,
                    tienShip: tienShip,
                    tongTienHoaDon: tongTienHoaDon,
                    tongTienDonHang: tongTienDonHang,
                    diaChi: diaChi2,
                    nguoiTao: $scope.hoTen,
                };
                $http
                    .post('http://localhost:8080/api/muaNgay/datHang', data)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đặt hàng thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            window.location.href =
                                'http://127.0.0.1:5501/templates/customer/home/index.html#!/product-list';
                        });
                    })
                    .catch(function (e) {
                        const errorMessage = e.data[Object.keys(e.data)[0]];
                        Swal.fire({
                            icon: 'error',
                            title: errorMessage,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        });
    };

    $scope.thanhToan = function () {
        Swal.fire({
            title: 'Xác nhận đặt hàng',
            text: 'Bạn có muốn đặt hàng không?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let a = $('#total').text();
                let b = $('#shippingFee').text();
                let c = $('#subtotal').text();

                let tinhThanhPho = $('#province option:selected').text();
                let quanHuyen = $('#district option:selected').text();
                let phuongXa = $('#ward option:selected').text();
                let diaChiNhap = $scope.diaChi;
                let diaChi = diaChiNhap + ' - ' + phuongXa + ' - ' + quanHuyen + ' - ' + tinhThanhPho;

                let diaChi2;
                if (
                    diaChi.includes('Chọn Tỉnh/Thành phố') ||
                    diaChi.includes('Chọn Quận/Huyện') ||
                    diaChi.includes('Chọn Phường/Xã')
                ) {
                    diaChi2 = '';
                } else {
                    diaChi2 = diaChi;
                }

                const tongTienHoaDon = fomatTien(c);
                const tienShip = fomatTien(b);
                const tongTienDonHang = fomatTien(a);

                let data = {
                    id: id_HoaDonMuaNgay,
                    ghiChu: $scope.ghiChu,
                    email: $scope.email,
                    soDienThoai: $scope.soDienThoai,
                    tienShip: tienShip,
                    tongTienHoaDon: tongTienHoaDon,
                    tongTienDonHang: tongTienDonHang,
                    diaChi: diaChi2,
                    nguoiTao: $scope.hoTen,
                };

                $http
                    .post('http://localhost:8080/payment/MuaNgay/create', data)
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đang chuyển hướng sang trang thanh toán',
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            window.location.href = response.data.createURL;
                        });
                    })
                    .catch(function (e) {
                        const errorMessage = e.data[Object.keys(e.data)[0]];
                        Swal.fire({
                            icon: 'error',
                            title: errorMessage,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            }
        });
    };

    $scope.quayLai = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/customer/home/index.html#!/product-list';
    };
});
