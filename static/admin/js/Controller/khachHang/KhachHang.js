app.controller('CustomerController', function ($scope, $http) {
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
        .get('http://localhost:8080/khachHang/danhSach', { headers })
        .then(function (response) {
            const promotions = response.data;
            $scope.promotions = promotions;
        })
        .catch((e) => {
            console.log('e =><', e);
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần phải đăng nhập để sử dụng chức năng này',
                showConfirmButton: false,
                timer: 2000,
            }).then(function () {
                window.location.href = '#!/login';
            });
            // if()
        });

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 8,
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

    function fomatMaxValue(dateBirth) {
        return dateBirth.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    //Chuyển hướng đến trang edit theo id
    $scope.editCustomer = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idCustomer = promotion.id;
        window.location.href = '#!/edit-Customer?id=' + idCustomer;
    };

    // Xóa trong danh sách
    $scope.deleteCustomer = function (promotion) {
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
            title: 'Xác nhận xóa khách hàng',
            text: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .post('http://localhost:8080/khachHang/xoaKhachHang', data, { headers })
                    .then(function (response) {
                        const promotions = response.data;
                        promotions.forEach(function (promotion) {});

                        // Cập nhật lại dữ liệu trong bảng mà không load lại trang
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
                        console.log('Lỗi');
                    });
            }
        });
    };

    $scope.$watch('searchTerm', function (newVal) {
        if (newVal) {
            $http.get('http://localhost:8080/khachHang/timKiem=' + newVal, { headers }).then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {});
                promotions.forEach(function (promotion) {
                    promotion.status5 = getStatusText(promotion.status);
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                });
            });
        } else {
            $http.get('http://localhost:8080/khachHang/danhSach', { headers }).then(function (response) {
                const promotions = response.data;

                $scope.promotions = promotions;
            });
        }
    });

    // Tìm kiếm
    $scope.searchAllCustomer = function (searchTerm) {
        $http.get('http://localhost:8080/khachHang/timKiem=' + searchTerm, { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {});

            // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };

    $scope.searchDateCustomer = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        // Tiếp tục với yêu cầu HTTP và xử lý dữ liệu
        $http
            .get('http://localhost:8080/khachHang/timKiemNgay=' + formattedDate, { headers })
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {});

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

    // Re load
    $scope.reLoad = function () {
        $http.get('http://localhost:8080/khachHang/danhSach', { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {});

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };
});
// Create controller
app.controller('CreateCustomerController', function ($scope, $http) {
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
    $scope.saveCreateCustomer = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        if ($scope.createCustomer === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http
            .post('http://localhost:8080/khachHang/themMoi', $scope.createCustomer, { headers })
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Customer';
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
        window.location.href = '#!/list-Customer';
    };
});

//Edit controller
app.controller('EditCustomerController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    let idCustomer = $routeParams.id;

    $http.get('http://localhost:8080/khachHang/chinhSua/' + idCustomer, { headers }).then(function (response) {
        const editCustomer = response.data;
        $scope.editCustomer = editCustomer;
    });

    //Lưu edit
    $scope.saveEditCustomer = function () {
        let editCustomer = {
            id: idCustomer,
            hoTen: $scope.editCustomer.hoTen,
            soDienThoai: $scope.editCustomer.soDienThoai,
            email: $scope.editCustomer.email,
            ngaySinh: $scope.editCustomer.ngaySinh,
            diaChi: $scope.editCustomer.diaChi,
            // matKhau: $scope.editCustomer.matKhau
        };

        $http
            .put('http://localhost:8080/khachHang/luu-chinh-sua', editCustomer, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Customer';
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
    };

    //Return
    $scope.returnEdit = function () {
        window.location.href = '#!/list-Customer';
    };
});
