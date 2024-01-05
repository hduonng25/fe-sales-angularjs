app.controller('checkOutController', function ($scope, $routeParams, $http) {
    let id_HoaDon = localStorage.getItem('id_HoaDon');
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

    if (decodedToken) {
        $scope.hoTen = decodedToken.hoTen;
        $scope.email = decodedToken.email;
        $scope.soDienThoai = decodedToken.soDienThoai;
        $scope.diaChi = decodedToken.diaChi;
    }

    $http
        .get('http://localhost:8080/api/banHang/online/getHoaDon/' + id_HoaDon, {
            headers,
        })
        .then(function (response) {
            const hoaDon = response.data;
            $scope.tienTamTinh = hoaDon.tongTienHoaDon;
            $scope.tienShip = hoaDon.tienShip;
            $scope.tongTienHoaDon = hoaDon.tongTienDonHang;
            $scope.hoaDon = hoaDon;
        });

    $http
        .get('http://localhost:8080/api/banHang/online/getHoaDonChiTiet/' + id_HoaDon, { headers })
        .then(function (response) {
            const hoaDonChiTiet = response.data;
            $scope.hoaDonChiTiet = hoaDonChiTiet;
        });

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
                    id: id_HoaDon,
                    ghiChu: $scope.ghiChu,
                    email: $scope.email,
                    soDienThoai: $scope.soDienThoai,
                    tienShip: tienShip,
                    tongTienHoaDon: tongTienHoaDon,
                    tongTienDonHang: tongTienDonHang,
                    email_user: decodedToken.email,
                    diaChi: diaChi2,
                    nguoiTao: $scope.hoTen,
                };
                $http
                    .post('http://localhost:8080/api/banHang/online/datHang', data, {
                        headers,
                    })
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
                    id: id_HoaDon,
                    ghiChu: $scope.ghiChu,
                    email: $scope.email,
                    soDienThoai: $scope.soDienThoai,
                    tienShip: tienShip,
                    tongTienHoaDon: tongTienHoaDon,
                    tongTienDonHang: tongTienDonHang,
                    email_user: decodedToken.email,
                    diaChi: diaChi2,
                    nguoiTao: $scope.hoTen,
                    loaiHoaDon: 2,
                };

                $http
                    .post('http://localhost:8080/payment/create', data)
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

    // $scope.addKhuyenMai = function () {
    //   let a = $("#maGiamGia").val();
    //   let data = {
    //     id: id_HoaDon,
    //     tenMaGiamGia: a,
    //   };

    //   let tienShip = parseFloat(
    //     $("#shippingFee")
    //       .text()
    //       .replace(/[^0-9]/g, "")
    //   );

    //   $http
    //     .post("http://localhost:8080/api/banHang/online/add/khuyenMai", data, {
    //       headers,
    //     })
    //     .then(function (response) {
    //       const hoaDon = response.data;
    //       $scope.$evalAsync(function () {
    //         $scope.tienTamTinh = hoaDon.tongTienHoaDon;
    //         $scope.tongTienHoaDon = hoaDon.tongTienDonHang;
    //         $scope.hoaDon = hoaDon;
    //         Swal.fire({
    //           icon: "success",
    //           title: "Thêm mã giảm giá thành công",
    //           showConfirmButton: false,
    //           timer: 2000,
    //         });

    //         let tongTienHoaDon = hoaDon.tongTienHoaDon;
    //         let tongTienSauGiam = tongTienHoaDon + tienShip - hoaDon.tienGiam;

    //         $("#total").text(
    //           tongTienSauGiam.toLocaleString("vi-VN", {
    //             style: "currency",
    //             currency: "VND",
    //           })
    //         );
    //       });
    //     })
    //     .catch(function (e) {
    //       Swal.fire({
    //         icon: "error",
    //         title: e.data.mess,
    //         showConfirmButton: false,
    //         timer: 2000,
    //       });
    //       console.log(e);
    //     });
    // };
    $http
        .get('http://localhost:8080/api/banHang/online/khuyenMai/list', {
            headers,
        })
        .then(function (response) {
            const khuyenMai = response.data;
            console.log(khuyenMai);
            $scope.khuyenMai = khuyenMai;
        });

    $scope.onKhuyenMaiChange = function () {
        $scope.addKhuyenMai = function () {
            let data = {
                id: id_HoaDon,
                id_khuyenMai: $scope.KhuyenMaiDangChon,
            };

            let tienShip = parseFloat(
                $('#shippingFee')
                    .text()
                    .replace(/[^0-9]/g, ''),
            );

            $http
                .post('http://localhost:8080/api/banHang/online/add/khuyenMai', data, {
                    headers,
                })
                .then(function (response) {
                    const hoaDon = response.data;
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

    $scope.quayLaiGioHang = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/customer/home/index.html#!/cart-list';
    };
});
