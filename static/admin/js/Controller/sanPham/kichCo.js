app.controller('SizeController', function ($scope, $http) {
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

    $http.get('http://localhost:8080/kichCo/danhSach', { headers }).then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    });

    $scope.pager = {
        page: 1,
        size: 8,
        get promotions() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.promotions.slice(start, start + this.size);
            } else {
                return [];
            }
        },
        get count() {
            if ($scope.promotions && $scope.promotions.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil((1.0 * $scope.promotions.length) / this.size);
            } else {
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
    $scope.delete = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idSize = promotion.id;
        Swal.fire({
            title: 'Xác nhận xóa kích cỡ',
            text: 'Bạn có chắc chắn muốn xóa kích cỡ này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://localhost:8080/kichCo/xoa/' + idSize, { headers })
                    .then(function (response) {
                        const promotions = response.data;
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

    $scope.editSize = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idSize = promotion.id;
        window.location.href = '#!/edit-Size?id=' + idSize;
    };

    $scope.createSizee = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        window.location.href = '#!/create-Size?id=';
    };
});

app.controller('CreateSizeController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $scope.saveCreateSize = function () {
        if ($scope.createSize === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http
            .post('http://localhost:8080/kichCo/themMoi', $scope.createSize, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Size';
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
                    console.error(error);
                }
            });
    };

    $scope.returnCreate = function () {
        window.location.href = '#!/list-Size';
    };
});

//
app.controller('EditSizeController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    let idSize = $routeParams.id;

    $http.get('http://localhost:8080/kichCo/chinhSua/' + idSize, { headers }).then(function (response) {
        const editSize = response.data;

        $scope.editSize = editSize;
    });

    $scope.saveEdits = function () {
        let idSize = $routeParams.id;
        let editSize = {
            id: idSize,
            kichCo: $scope.editSize.kichCo,
        };

        $http
            .put('http://localhost:8080/kichCo/luuChinhSua', editSize, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Size';
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

    $scope.returnEdit = function () {
        window.location.href = '#!/list-Size';
    };
});
