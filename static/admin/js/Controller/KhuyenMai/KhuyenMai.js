app.controller('KhuyenMaiController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
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

    $http
        .get('http://localhost:8080/khuyenMai/danhSach', { headers })
        .then(function (response) {
            const promotions = response.data;

            // Thêm trường status2 vào từng đối tượng promotion
            promotions.forEach(function (promotion) {
                promotion.trangThai2 = getStatusText(promotion.trangThai);
                promotion.fomattienGiamToiDa = fomatMaxValue(promotion.tienGiamToiDa);
            });

            $scope.promotions = promotions;
        })
        .catch((e) => {
            Swal.fire({
                icon: 'error',
                title: 'Token inval',
                showConfirmButton: false,
                timer: 2000,
            }).then(function () {});
        });

    function getStatusText(status) {
        if (status == 0) {
            return 'Đang hoạt động';
        } else if (status == 1) {
            return 'Chờ hoạt động';
        } else {
            return 'Hết hạn';
        }
    }

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 5,
        get promotions() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.promotions.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil((1.0 * $scope.promotions.length) / this.size);
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

    function fomatMaxValue(tienGiamToiDa) {
        return tienGiamToiDa.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    //Chuyển hướng đến trang edit theo id
    $scope.editKhuyenMai = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idkhuyenMai = promotion.id;
        window.location.href = '#!/edit-khuyenMai?id=' + idkhuyenMai;
    };

    //Xóa trong danh sách
    $scope.deletekhuyenMai = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let id = promotion.id;
        let data = {
            id,
        };
        Swal.fire({
            title: 'Xác nhận xóa khuyến Mại',
            text: 'Bạn có chắc chắn muốn xóa khuyến mại này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .put('http://localhost:8080/khuyenMai/xoa', data, { headers })
                    .then(function (response) {
                        const promotions = response.data;

                        // Thêm trường trangThai2 và fomattienGiamToiDa vào từng đối tượng promotion
                        promotions.forEach(function (promotion) {
                            promotion.trangThai2 = getStatusText(promotion.trangThai);
                            promotion.fomattienGiamToiDa = fomatMaxValue(promotion.tienGiamToiDa);
                        });
                        // Cập nhật lại dữ liệu trong table nhưng không load lại trang
                        $scope.$evalAsync(function () {
                            $scope.promotions = promotions;
                            Swal.fire({
                                icon: 'success',
                                title: 'Xóa thành công',
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                    })
                    .catch(function (error) {
                        console.log('Error');
                    });
            }
        });
    };

    //Tìm kiếm
    $scope.searchkhuyenMai = function (searchTerm) {
        $http.get('http://localhost:8080/khuyenMai/timKiem=' + searchTerm, { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.trangThai2 = getStatusText(promotion.status);
                promotion.fomattienGiamToiDa = fomatMaxValue(promotion.tienGiamToiDa);
            });

            // Cập nhật lại dữ liệu trong table nhưng không load lại trang
            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };

    //Tìm kiếm ngày bắt đầu
    $scope.searchDatekhuyenMai = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http
            .get('http://localhost:8080/khuyenMai/timKiemNgay=' + formattedDate, { headers })
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.trangThai2 = getStatusText(promotion.status);
                    promotion.fomattienGiamToiDa = fomatMaxValue(promotion.tienGiamToiDa);
                });

                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
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
        $http.get('http://localhost:8080/khuyenMai/danhSach', { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.trangThai2 = getStatusText(promotion.status);
                promotion.fomattienGiamToiDa = fomatMaxValue(promotion.tienGiamToiDa);
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };
});

//Edit controller
app.controller('EditKhuyenMaiController', function ($scope, $routeParams, $http) {
    let idkhuyenMai = $routeParams.id;
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $http.get('http://localhost:8080/khuyenMai/chinhSua/' + idkhuyenMai, { headers }).then(function (response) {
        const editkhuyenMai = response.data;
        editkhuyenMai.fomattienGiamToiDa = fomatMaxValue(editkhuyenMai.tienGiamToiDa);
        $scope.editkhuyenMai = editkhuyenMai;
    });

    function fomatMaxValue(tienGiamToiDa) {
        return tienGiamToiDa.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    //Lưu edit
    $scope.saveEditkhuyenMai = function () {
        let token = localStorage.getItem('token');
        let headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        };
        let idkhuyenMai = $routeParams.id;

        let maxValue = $scope.editkhuyenMai.fomattienGiamToiDa;
        let tienGiamToiDa = parseFloat(maxValue.replace(/[^\d.-]/g, ''));

        let editkhuyenMai = {
            id: idkhuyenMai,
            tenKhuyenMai: $scope.editkhuyenMai.tenKhuyenMai,
            ngayBatDau: $scope.editkhuyenMai.ngayBatDau,
            ngayKetThuc: $scope.editkhuyenMai.ngayKetThuc,
            phanTramGiam: $scope.editkhuyenMai.phanTramGiam,
            tienGiamToiDa: $scope.editkhuyenMai.tienGiamToiDa,
        };

        Swal.fire({
            title: 'Xác nhận cập nhập khuyến Mại',
            text: 'Bạn có chắc chắn muốn cập nhập khuyến mại này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Cập nhập',
            cancelButtonText: 'Không',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .put('http://localhost:8080/khuyenMai/luuChinhSua', editkhuyenMai, { headers })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sửa thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(function () {
                            sessionStorage.setItem('isConfirmed', true);
                            window.location.href = '#!/list-khuyenMai';
                        });
                    })
                    .catch(function (errorResponse) {
                        if (errorResponse.status === 400) {
                            const errorMassage = errorResponse.data.message;
                            Swal.fire({
                                icon: 'error',
                                title: errorMassage + '',
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        }
                    });
            }
        });
    };

    //Return
    $scope.returnEdit = function () {
        window.location.href = '#!/list-khuyenMai';
    };
});

//Create controller
app.controller('CreateKhuyenMaiController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
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

    $scope.saveCreatekhuyenMai = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let createKhuyenMai = {
            tenKhuyenMai: $scope.createkhuyenMai.tenKhuyenMai,
            ngayBatDau: $scope.createkhuyenMai.ngayBatDau,
            ngayKetThuc: $scope.createkhuyenMai.ngayKetThuc,
            phanTramGiam: $scope.createkhuyenMai.phanTramGiam,
            tienGiamToiDa: $scope.createkhuyenMai.tienGiamToiDa,
        };

        if ($scope.createkhuyenMai === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http
            .post('http://localhost:8080/khuyenMai/themMoi', createKhuyenMai, { headers })
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-khuyenMai';
                });
            })
            .catch(function (error) {
                if (error.status === 400) {
                    const errorMessage = error.data.message;
                    Swal.fire({
                        icon: 'error',
                        title: errorMessage + '',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                } else {
                    // Xử lý lỗi khác nếu cần
                    console.error(error);
                }
            });
    };

    $scope.returnCreate = function () {
        window.location.href = '#!/list-khuyenMai';
    };
});
