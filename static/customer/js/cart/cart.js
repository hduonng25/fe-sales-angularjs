app.controller('cartController', function ($scope, $http, $window) {
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
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Bạn cần phải đăng nhập để sử dụng chức năng này',
            showConfirmButton: false,
            timer: 2000,
        }).then(function () {
            window.location.href = 'http://127.0.0.1:5501/templates/auth/Login.html#!/login';
        });
    }

    $scope.soLuongBanDau = 0;
    $http.get('http://localhost:8080/gioHang/danhSach/' + decodedToken.email, { headers }).then(function (response) {
        const gioHangChiTiet = response.data;
        gioHangChiTiet.forEach((item) => {
            $scope.soLuongBanDau = item.soLuong;
        });
        $scope.gioHangChiTiet = gioHangChiTiet;
    });

    $scope.onInputChange = function (gioHangChiTiet) {
        if (gioHangChiTiet.soLuong !== gioHangChiTiet.initialQuantity) {
            gioHangChiTiet.showButtons = true;
        } else {
            gioHangChiTiet.showButtons = false;
        }
    };

    $scope.updateValue = function (gioHangChiTiet) {
        const idCart = gioHangChiTiet.id;
        const quantity = $('#cart-inputSoLuong').val();
        let data = {
            id: idCart,
            soLuongCapNhat: quantity,
        };
        $http.post('http://localhost:8080/gioHang/sua/soLuong/sanPham', data, { headers }).then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
        });

        promotion.showButtons = false;
    };

    $scope.cancelUpdate = function (promotion) {
        $http
            .get('http://localhost:8080/gioHang/danhSach/' + decodedToken.email, { headers })
            .then(function (response) {
                const gioHangChiTiet = response.data;
                $scope.gioHangChiTiet = gioHangChiTiet;
            });
    };

    $scope.deletecart = function (gioHangChiTiet) {
        let id_cart_details = gioHangChiTiet.id;
        Swal.fire({
            title: 'Xác nhận xóa ',
            text: 'Bạn có chắc chắn muốn xóa ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    id: id_cart_details,
                };
                $http
                    .post('http://localhost:8080/gioHang/xoa/gioHangChiTiet', data, { headers })

                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Xóa thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            $http
                                .get('http://localhost:8080/gioHang/danhSach/' + decodedToken.email, { headers })
                                .then(function (response) {
                                    const gioHangChiTiet = response.data;
                                    gioHangChiTiet.forEach((item) => {
                                        $scope.soLuongBanDau = item.soLuong;
                                    });
                                    $scope.gioHangChiTiet = gioHangChiTiet;
                                });
                        });
                    })
                    .catch(function (error) {
                        console.log('Lỗi');
                    });
            }
        });
    };

    $scope.checkboxDaChon = false;

    $scope.checkTatCaDaChon = function () {
        $scope.checkboxDaChon = $scope.gioHangChiTiet.some(function (item) {
            return item.selected;
        });
    };
    $scope.toggleSelectAll = function () {
        angular.forEach($scope.gioHangChiTiet, function (item) {
            if ($scope.selectAll) {
                // Nếu chọn tất cả, thì chỉ thêm vào nếu chưa được chọn trước đó
                if (!item.selected) {
                    item.selected = true;
                    $scope.selectedGioHangChiTiet(item);
                }
            } else {
                // Nếu bỏ chọn tất cả, thì giảm giá trị đã chọn trước đó
                item.selected = false;
                $scope.selectedGioHangChiTiet(item);
            }
        });
        $scope.checkTatCaDaChon();
    };

    $scope.tienTamTinh = 0;
    $scope.gioHangChiTietID = [];
    $scope.selectedGioHangChiTiet = function (gioHangChiTiet) {
        if (gioHangChiTiet.selected) {
            $scope.tienTamTinh += gioHangChiTiet.thanhTien;
            $scope.gioHangChiTietID.push(gioHangChiTiet.id);
        } else {
            $scope.tienTamTinh -= gioHangChiTiet.thanhTien;
            const index = $scope.gioHangChiTietID.indexOf(gioHangChiTiet.id);
            if (index !== -1) {
                $scope.gioHangChiTietID.splice(index, 1);
            }
        }
        $scope.checkTatCaDaChon();
    };

    $scope.$watch(
        'gioHangChiTietID',
        function (newVal, oldVal) {
            $scope.checkOut = function () {
                let data = {
                    id_gioHangChiTiet: newVal,
                    tongTien: $scope.tienTamTinh,
                };
                $http
                    .post('http://localhost:8080/api/banHang/online/checkOut', data, { headers })
                    .then(function (response) {
                        localStorage.setItem('id_HoaDon', response.data.body);
                        const id_HoaDon = localStorage.getItem('id_HoaDon');
                        if (response.data.statusCodeValue === 400) {
                            Swal.fire({
                                icon: 'error',
                                title: response.data.body.err,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Chuyển hướng đến trang đặt hàng',
                                showConfirmButton: false,
                                timer: 2000,
                            }).then(function () {
                                window.location.href =
                                    'http://127.0.0.1:5501/templates/banHang/online/BanHangOnline.html?id_HoaDon=' +
                                    id_HoaDon;
                            });
                        }
                    })
                    .catch(function (error) {
                        const errorMessage = error.data[Object.keys(error.data)[0]];
                        Swal.fire({
                            icon: 'error',
                            title: errorMessage,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    });
            };
        },
        true,
    );

    $scope.tiepTucMuaSam = function () {
        // Replace 'your-product-page-url' with the actual URL of your product page
        $window.location.href = 'http://127.0.0.1:5501/templates/customer/home/index.html#!/product-list';
    };

    $scope.updateSoLuong = function (gioHangChiTiet) {
        let data = {
            id: gioHangChiTiet.id,
            sanPhamChiTiet: gioHangChiTiet.sanPhamChiTiet,
            soLuongCapNhat: gioHangChiTiet.soLuong,
            email_user: decodedToken.email,
        };

        $http
            .post('http://localhost:8080/gioHang/update/soLuongGioHangChiTiet', data, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.success,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    $http
                        .get('http://localhost:8080/gioHang/danhSach/' + decodedToken.email, { headers })
                        .then(function (response) {
                            const gioHangChiTiet = response.data;
                            gioHangChiTiet.forEach((item) => {
                                $scope.soLuongBanDau = item.soLuong;
                            });
                            $scope.gioHangChiTiet = gioHangChiTiet;
                        });
                });
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: error.data.err,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };
});
