app.controller('ProducerController', function ($scope, $http) {
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

    $http.get('http://localhost:8080/nhaSanXuat/danhSach', { headers }).then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
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

    $scope.deleteProducer = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idProducer = promotion.id;
        Swal.fire({
            title: 'Xác nhận xóa nhà sản xuất',
            text: 'Bạn có chắc chắn muốn xóa nhà sản xuất này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://localhost:8080/nhaSanXuat/xoa/' + idProducer, { headers })
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

    $scope.editProducer = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idProducer = promotion.id;
        window.location.href = '#!/edit-Producer?id=' + idProducer;
    };

    $scope.createProducer = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        window.location.href = '#!/create-Producer?id=';
    };
});

app.controller('CreateProducerController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $scope.saveCreate = function () {
        if ($scope.createProducer === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http
            .post('http://localhost:8080/nhaSanXuat/themMoi', $scope.createProducer, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Producer';
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
        window.location.href = '#!/list-Producer';
    };
});

//
app.controller('EditProducerController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    let idProducer = $routeParams.id;

    $http.get('http://localhost:8080/nhaSanXuat/chinhSua/' + idProducer, { headers }).then(function (response) {
        let editProducer = response.data;
        $scope.editProducer = editProducer;
    });

    $scope.saveEdits = function () {
        let editProducer = {
            id: idProducer,
            name: $scope.editProducer.name,
            diaChi: $scope.editProducer.diaChi,
        };

        $http
            .put('http://localhost:8080/nhaSanXuat/luuChinhSua', editProducer, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Producer';
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
        window.location.href = '#!/list-Producer';
    };
});
