app.controller('themSanPhamTuongTuController', function ($scope, $routeParams, $http, $location) {
    let id_sanPham = $routeParams.id;
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $http.get('http://localhost:8080/sanPhamChiTiet/chinhSua/' + id_sanPham, { headers }).then(function (response) {
        const editproduct = response.data;
        $scope.editproduct = editproduct;
    });

    $http.get('http://localhost:8080/mauSac/danhSach', { headers }).then(function (response) {
        const mauSac = response.data;
        $scope.mauSac = mauSac;
    });

    $http.get('http://localhost:8080/kichCo/danhSach', { headers }).then(function (response) {
        const kichCo = response.data;
        $scope.kichCo = kichCo;
    });

    $scope.ThemMoiKichCo = function () {
        Swal.fire({
            title: 'Thêm mới kích cỡ',
            input: 'text',
            inputLabel: 'Nhập tên kích cỡ',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập kích cỡ';
                }
                if (!/^\d+(\.\d+)?$/.test(value)) {
                    return 'Vui lòng nhập số';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    kichCo: result.value,
                };
                $http
                    .post('http://localhost:8080/kichCo/themMoi', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm mới thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        $http.get('http://localhost:8080/kichCo/danhSach', { headers }).then(function (response) {
                            const kichCo = response.data;
                            $scope.kichCo = kichCo;
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
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    };

    $scope.ThemMoiMauSac = function () {
        Swal.fire({
            title: 'Thêm mới màu sắc',
            html: `
                   <label for="color-input">Chọn màu sắc:</label>
                   <input type="color" id="color-input" class="form-control">
                   <label for="name-input">Nhập tên màu sắc:</label>
                   <input type="text" id="name-input" class="form-control">
                 `,
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
            preConfirm: () => {
                const colorInput = document.getElementById('color-input').value;
                const nameInput = document.getElementById('name-input').value;

                if (!nameInput || !colorInput) {
                    Swal.showValidationMessage('Vui lòng nhập tên và chọn màu sắc');
                } else {
                    let data = {
                        tenMauSac: nameInput,
                        maMauSac: colorInput,
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
                            });

                            $http.get('http://localhost:8080/mauSac/danhSach', { headers }).then(function (response) {
                                const mauSac = response.data;
                                $scope.mauSac = mauSac;
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
                }
            },
        });
    };

    $scope.mauSacDaChon = '';
    $scope.onColorChange = function () {
        let mauSac = JSON.parse($scope.selectedColor);
        $scope.mauSacDaChon = mauSac.id;
    };

    $scope.kichCocDaChon = '';
    $scope.onKichCoChange = function () {
        let kichCo = JSON.parse($scope.selectedSizes);
        $scope.kichCocDaChon = kichCo.id;
    };

    $scope.LuuThemMoiSanPhamTuongTu = function () {
        let data = {
            id: id_sanPham,
            mauSac_id: $scope.mauSacDaChon,
            kichCo_id: $scope.kichCocDaChon,
            soLuong: $scope.editproduct.soLuong,
        };
        $http
            .post('http://localhost:8080/sanPham/themSanPhamTuongTu', data, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.success,
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    let idProduct = $routeParams.id;
                    window.location.href = '#!/list-CTSP?id=' + idProduct;
                });
            })
            .catch(function (errorResponse) {
                console.error('Error Response:', errorResponse);

                if (errorResponse.status === 400) {
                    const errorMessage = errorResponse.data.err;
                    showError(errorMessage);
                } else {
                    showError('Vui lòng nhập thông tin sản phẩm muốn thêm');
                }
            });

        function showError(errorMessage) {
            Swal.fire({
                icon: 'error',
                title: errorMessage,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    $scope.returnEdit = function () {
        let idProduct = $routeParams.id;
        $location.path('/list-CTSP').search({ id: idProduct });
    };
});
