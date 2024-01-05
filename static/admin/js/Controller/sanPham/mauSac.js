app.controller('ColorrController', function ($scope, $http) {
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

    $http.get('http://localhost:8080/mauSac/danhSach', { headers }).then(function (response) {
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
        let idColor = promotion.id;
        Swal.fire({
            title: 'Xác nhận xóa màu sắc',
            text: 'Bạn có chắc chắn muốn xóa màu sắc này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://localhost:8080/mauSac/xoa/' + idColor, { headers })
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

    $scope.editColor = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idColor = promotion.id;
        window.location.href = '#!/edit-Color?id=' + idColor;
    };

    $scope.createColorr = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        window.location.href = '#!/create-Color?id=';
    };
});

app.controller('CreateColorController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    const colorPicker = new iro.ColorPicker('#colorPicker', {
        width: 280,
        color: 'rgb(255, 0, 0)',
        borderWidth: 1,
        borderColor: '#fff',
    });

    const hexInput = document.getElementById('hexInput');

    colorPicker.on('color:change', function (color) {
        hexInput.value = color.hexString;
    });

    hexInput.addEventListener('change', function () {
        colorPicker.color.hexString = this.value;
    });

    var mau = document.getElementsByClassName('IroColorPicker');
    if (mau.length > 0) {
        mau[0].style.display = 'none';
    }

    $scope.saveCreateColor = function () {
        if ($scope.createColor === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            tenMauSac: $('#inputUsername').val(),
            maMauSac: $('#hexInput').val(),
        };

        $http
            .post('http://localhost:8080/mauSac/themMoi', data, { headers })
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Color';
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
        window.location.href = '#!/list-Color';
    };
});

app.controller('EditColorController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    let idColor = $routeParams.id;

    const colorPicker = new iro.ColorPicker('#colorPicker', {
        width: 280,
        color: 'rgb(255, 0, 0)',
        borderWidth: 1,
        borderColor: '#fff',
    });

    const hexInput = document.getElementById('hexInput');

    colorPicker.on('color:change', function (color) {
        hexInput.value = color.hexString;
    });

    hexInput.addEventListener('change', function () {
        colorPicker.color.hexString = this.value;
    });

    var mau = document.getElementsByClassName('IroColorPicker');
    if (mau.length > 0) {
        mau[0].style.display = 'none';
    }

    $http.get('http://localhost:8080/mauSac/chinhSua/' + idColor, { headers }).then(function (response) {
        let editColor = response.data;
        console.log(editColor);
        $scope.editColor = editColor;
    });

    $scope.saveEdits = function () {
        let editColor = {
            id: idColor,
            tenMauSac: $('#inputUsername').val(),
            maMauSac: $('#hexInput').val(),
        };

        $http
            .put('http://localhost:8080/mauSac/luuChinhSua', editColor, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Color';
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
        window.location.href = '#!/list-Color';
    };
});
