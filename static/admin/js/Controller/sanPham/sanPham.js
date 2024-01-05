app.controller('ProductController', function ($scope, $http) {
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

    $http.get('http://localhost:8080/sanPham/danhSach', { headers }).then(function (response) {
        const promotions = response.data;
        $scope.promotions = promotions;
    });

    $http.get('http://localhost:8080/chatLieu/danhSach', { headers }).then(function (response) {
        const chatLieu = response.data;
        $scope.chatLieu = chatLieu;
    });

    $http.get('http://localhost:8080/loaiSanPham/danhSach', { headers }).then(function (response) {
        const loaiSanPham = response.data;
        $scope.loaiSanPham = loaiSanPham;
    });

    $http.get('http://localhost:8080/nhaSanXuat/danhSach', { headers }).then(function (response) {
        const nhaSanXuat = response.data;
        $scope.nhaSanXuat = nhaSanXuat;
    });

    $http.get('http://localhost:8080/mauSac/danhSach', { headers }).then(function (response) {
        const mauSac = response.data;
        $scope.mauSac = mauSac;
    });

    $http.get('http://localhost:8080/kichCo/danhSach', { headers }).then(function (response) {
        const kichCo = response.data;
        $scope.kichCo = kichCo;
    });

    $scope.filterByLoaiSp = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/loai_san_pham', {
                params: { idloaiSanPham: $scope.idloaiSanPham },
                headers: headers,
            })
            .then(function (response) {
                const promotions = response.data;
                $scope.promotions = promotions;
            });
    };

    $scope.filterByChatLieu = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/chat_lieu', {
                params: { id_chat_lieu: $scope.id_chat_lieu },
                headers: headers,
            })
            .then(function (response) {
                const promotions = response.data;
                $scope.promotions = promotions;
            });
    };

    $scope.filterByNsx = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/nha_san_xuat', {
                params: { id_nsx: $scope.id_nsx },
                headers: headers,
            })
            .then(function (response) {
                const promotions = response.data;
                $scope.promotions = promotions;
            });
    };

    $scope.filterByMauSac = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/mau_sac', {
                params: { mauSac_id: $scope.mauSac_id },
                headers: headers,
            })
            .then(function (response) {
                const promotions = response.data;
                $scope.promotions = promotions;
            });
    };

    $scope.filterByKichCo = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/kich_co', {
                params: { kichCo_id: $scope.kichCo_id },
                headers: headers,
            })
            .then(function (response) {
                const promotions = response.data;
                $scope.promotions = promotions;
            });
    };

    $scope.filterByGia = function () {
        if ($scope.gia2 <= $scope.gia1) {
            const errorMessage = 'Giá 2 phải lớn hơn giá 1';
            Swal.fire({
                icon: 'error',
                title: errorMessage,
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http
            .get('http://localhost:8080/customer/sanPham/loc/gia', {
                params: { gia1: $scope.gia1, gia2: $scope.gia2 },
                headers: headers,
            })
            .then(function (response) {
                $scope.promotions = response.data;
            })
            .catch(function (errorResponse) {
                if (errorResponse.status === 400) {
                    const errorMessage = errorResponse.data.message;
                    Swal.fire({
                        icon: 'error',
                        title: 'Vui lòng nhập giá',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                console.log(errorResponse);
            });
    };

    $scope.$watch('searchTerm', function (newVal) {
        if (newVal) {
            $http
                .get('http://localhost:8080/sanPham/timKiem=' + newVal, {
                    headers,
                })
                .then(function (response) {
                    $scope.promotions = response.data;
                });
        } else {
            $http.get('http://localhost:8080/sanPham/danhSach', { headers }).then(function (response) {
                $scope.promotions = response.data;
            });
        }
    });

    $scope.searchAll = function (searchTerm) {
        $http
            .get('http://localhost:8080/sanPham/timKiem=' + searchTerm, {
                headers,
            })
            .then(function (response) {
                $scope.promotions = response.data;
            });
    };

    //Phân trang
    $scope.pager = {
        page: 1,
        size: 5,
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

    $scope.dsCTSP = function (promotion) {
        let idSPCT = promotion.id;
        window.location.href = '#!/list-CTSP?id=' + idSPCT;
    };

    $scope.create = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        window.location.href = '#!/create-Product?id=';
    };

    //Xóa trong danh sách
    $scope.delete = function (promotion) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền xoá',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let id = promotion.id;
        Swal.fire({
            title: 'Xác nhận xóa sản phẩm',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .delete('http://localhost:8080/sanPham/xoa/' + id, {
                        headers,
                    })
                    .then(function (response) {
                        const promotions = response.data;
                        $http
                            .get('http://localhost:8080/sanPham/danhSach', {
                                headers,
                            })
                            .then(function (response) {
                                const promotions = response.data;
                                console.log(promotions);
                                $scope.promotions = promotions;
                            });

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

    // Re load
    $scope.reLoad = function () {
        $http.get('http://localhost:8080/sanPham/danhSach', { headers }).then(function (response) {
            const promotions = response.data;
            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };
});

//Edit controller
app.controller('EditProductController', function ($scope, $routeParams, $http, $location) {
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

    let idPro = $routeParams.id;

    $http
        .get('http://localhost:8080/sanPhamChiTiet/chinhSua/' + idPro, {
            headers,
        })
        .then(function (response) {
            const editproduct = response.data;
            $scope.editproduct = editproduct;
        });

    $scope.saveEdits = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let idProduct = $routeParams.id;
        let sanPham = $scope.editproduct.sanPham;
        let soLuong = $scope.editproduct.soLuong;
        let trangThai = soLuong === 0 ? false : true;

        let editProduct = {
            id: idProduct,
            mauSac: $scope.editproduct.mauSac,
            kichCo: $scope.editproduct.kichCo,
            sanPham: sanPham,
            soLuong: soLuong,
            trangThai: trangThai,
        };

        $http
            .put('http://localhost:8080/sanPhamChiTiet/luuChinhSua', editProduct, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    let idProduct = $scope.editproduct.sanPham.id;
                    window.location.href = '#!/list-CTSP?id=' + idProduct;
                });
            })
            .catch(function (errorResponse) {
                if (errorResponse.status === 400) {
                    const errorMessage = errorResponse.data.message;
                    Swal.fire({
                        icon: 'error',
                        title: errorMessage + '',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                console.log(errorResponse);
            });
    };

    //Return
    $scope.returnEdit = function () {
        let idProduct = $scope.editproduct.sanPham.id;
        $location.path('/list-CTSP').search({ id: idProduct });
    };

    $scope.editSPCT = function () {
        let id = $routeParams.id;
        window.location.href = '#!/edit-Img?id=' + id;
    };
});

//Create controller
app.controller('CreateProductController', function ($scope, $http, $routeParams) {
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

    $http.get('http://localhost:8080/chatLieu/danhSach', { headers }).then(function (response) {
        const chatLieu = response.data;
        $scope.chatLieu = chatLieu;
    });

    $http.get('http://localhost:8080/loaiSanPham/danhSach', { headers }).then(function (response) {
        const loaiSanPham = response.data;
        $scope.loaiSanPham = loaiSanPham;
    });

    $http.get('http://localhost:8080/nhaSanXuat/danhSach', { headers }).then(function (response) {
        const nhaSanXuat = response.data;
        $scope.nhaSanXuat = nhaSanXuat;
    });

    $http.get('http://localhost:8080/mauSac/danhSach', { headers }).then(function (response) {
        const mauSac = response.data;
        $scope.mauSac = mauSac;
    });

    $http.get('http://localhost:8080/kichCo/danhSach', { headers }).then(function (response) {
        const kichCo = response.data;
        $scope.kichCo = kichCo;
    });

    let mauSac_id = [];
    $scope.mauSacDaChon = '';
    $scope.onColorChange = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let mauSac = JSON.parse($scope.selectedColor);

        if (mauSac_id.indexOf(mauSac.id) === -1) {
            mauSac_id.push(mauSac.id);
            $scope.mauSacDaChon += mauSac.tenMauSac + ', ';
        }
    };

    let kichCo_id = [];
    $scope.kichCocDaChon = '';
    $scope.onKichCoChange = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let kichCo = JSON.parse($scope.selectedSizes);

        if (kichCo_id.indexOf(kichCo.id) === -1) {
            kichCo_id.push(kichCo.id);
            $scope.kichCocDaChon += kichCo.kichCo + ', ';
        }
    };

    //TODO: tao moi san pham
    $scope.saveCreate = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        if ($scope.createProduct === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            tenSanPham: $scope.createProduct.tenSanPham,
            gia: $scope.createProduct.gia,
            soLuong: $scope.createProduct.soLuong,
            chatLieu_id: $scope.createProduct.chatLieu,
            loaiSanPham_id: $scope.createProduct.loaiSanPham,
            nhaSanXuat_id: $scope.createProduct.nhaSanXuat,
            mauSac: mauSac_id,
            kichCo: kichCo_id,
        };

        $http
            .post('http://localhost:8080/sanPham/TaoSanPham', data, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                });
                const details = response.data.list;
                $scope.details = details;
                localStorage.setItem('id_product', response.data.id_product);
            })
            .catch(function (errorResponse) {
                if (errorResponse.status === 400) {
                    const errorMessage = errorResponse.data.message;
                    if (errorMessage === 'Trùng tên sản phẩm') {
                        Swal.fire({
                            icon: 'error',
                            title: errorMessage,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    } else {
                        if (errorResponse.status === 400) {
                            const errors = errorResponse.data;
                            angular.forEach(errors, function (errorMessage, fieldName) {
                                Swal.fire({
                                    icon: 'error',
                                    title: errorMessage,
                                    showConfirmButton: false,
                                    timer: 2000,
                                });
                            });
                        }
                    }
                }
            });
    };

    //TODO: hduong lam san pham chi tiet
    $scope.luuSanPhamChiTiet = function (details) {
        const id_product = localStorage.getItem('id_product');
        const soLuong = details.soLuong;
        let data = {
            sanPhamId: id_product,
            spctId: details.id,
            soLuong: soLuong,
        };

        $http
            .post('http://localhost:8080/sanPham/chinhSua-soLuong-SanPhamChiTiet', data, { headers })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Chỉnh sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                });
                const details = response.data;
                $scope.details = details;
            });
    };

    $scope.xoaSanPhamChiTiet = function (details) {
        const id_product = localStorage.getItem('id_product');
        let data = {
            sanPhamId: id_product,
            spctId: details.id,
        };
        $http
            .post('http://localhost:8080/sanPham/xoa-SanPhamChiTiet', data, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                });
                const details = response.data;
                $scope.details = details;
            });
    };

    $scope.returnCreate = function () {
        window.location.href = '#!/list-Product';
    };

    $scope.themAnh = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let id_product = localStorage.getItem('id_product');

        if (!id_product) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng tạo sản phẩm trước khi thêm ảnh',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        window.location.href = '#!/list-Img?id=' + id_product;
    };

    $scope.ThemMoiChatLieu = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        Swal.fire({
            title: 'Thêm mới chất liệu',
            input: 'text',
            inputLabel: 'Nhập tên chất liệu',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập tên chất liệu';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    chatLieu: result.value,
                };
                $http
                    .post('http://localhost:8080/chatLieu/themMoi', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm mới thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });

                        const chatLieu = response.data;
                        $scope.chatLieu = chatLieu;
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
                // Có thể thêm xử lý nếu người dùng huỷ bỏ
            }
        });
    };

    $scope.ThemMoiLoai = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        Swal.fire({
            title: 'Thêm mới loại sản phẩm',
            input: 'text',
            inputLabel: 'Nhập tên loại sản phẩm',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập tên loại sản phẩm';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    loaiSanPham: result.value,
                };
                $http
                    .post('http://localhost:8080/loaiSanPham/themMoi', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm mới thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        $http.get('http://localhost:8080/loaiSanPham/danhSach', { headers }).then(function (response) {
                            const loaiSanPham = response.data;
                            $scope.loaiSanPham = loaiSanPham;
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

    $scope.ThemMoiHang = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        Swal.fire({
            title: 'Thêm mới nhà sản xuất',
            input: 'text',
            inputLabel: 'Nhập tên nhà sản xuất',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập tên nhà sản xuất';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    name: result.value,
                };
                $http
                    .post('http://localhost:8080/nhaSanXuat/themMoi', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thêm mới thành công',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        $http.get('http://localhost:8080/nhaSanXuat/danhSach', { headers }).then(function (response) {
                            const nhaSanXuat = response.data;
                            $scope.nhaSanXuat = nhaSanXuat;
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

    $scope.ThemMoiKichCo = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
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
                        $http
                            .get('http://localhost:8080/kichCo/danhSach', {
                                headers,
                            })
                            .then(function (response) {
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
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
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
});

app.controller('ImgController', function ($scope, $http, $routeParams) {
    let token = localStorage.getItem('token');
    let id_product = localStorage.getItem('id_product');
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

    function updateImageData(id, spcts) {
        $http
            .get('http://localhost:8080/sanPhamChiTiet/hienThiAnh/' + id, {
                headers,
            })
            .then(function (response) {
                const hinhAnh = response.data;
                spcts.hinhAnh = hinhAnh;
                $scope.hinhAnh = hinhAnh;
            });
    }

    $http
        .get('http://localhost:8080/sanPhamChiTiet/themAnh/' + id_product, {
            headers,
        })
        .then(function (response) {
            const spct = response.data;
            const uniqueProducts = {};

            spct.forEach(function (product) {
                const mauSacId = product.mauSac.id;
                if (!uniqueProducts[mauSacId]) {
                    uniqueProducts[mauSacId] = product;
                }
            });

            $scope.spct = Object.values(uniqueProducts);
        });

    $scope.loadImage = function (input) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.imagePreview = e.target.result;
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.img_name = '';

    $scope.hienThiAnh = function (event, spcts) {
        let id = spcts.id;
        let fileInput = event.target;
        let files = fileInput.files;
        let imagePreviewDiv = angular.element(document.getElementById('imagePreview' + id));

        spcts.hinhAnh = [];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();

            reader.onload = function (e) {
                let data = {
                    id_spct: id,
                    ten_anh: [file.name],
                };

                $http
                    .post('http://localhost:8080/sanPhamChiTiet/themAnhSanPham', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.mess,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        updateImageData(id, spcts);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    $scope.setAnhMacDinh = function (hinhAnh, spcts) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            id_hinh_anh: hinhAnh.id,
            id_spct: spcts.id,
        };

        $http
            .put('http://localhost:8080/sanPhamChiTiet/setAnhMacDinh/', data, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.mess,
                    showConfirmButton: false,
                    timer: 2000,
                });
                updateImageData(spcts.id, spcts);
            });
    };

    $scope.xoaAnh = function (hinhAnh, spcts) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            id_hinh_anh: hinhAnh.id,
            id_spct: spcts.id,
        };

        $http
            .put('http://localhost:8080/sanPhamChiTiet/xoaAnh/', data, {
                headers,
            })
            .then(function (response) {
                const index = spcts.hinhAnh.findIndex((item) => item.id === hinhAnh.id);
                if (index !== -1) {
                    spcts.hinhAnh.splice(index, 1);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Xóa ảnh thành công',
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    $scope.themAnhSanPhamHT = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const productsWithoutImages = $scope.spct.filter((spcts) => !spcts.hinhAnh || spcts.hinhAnh.length === 0);
        const productsWithoutDefaultImage = $scope.spct.filter(
            (spcts) => spcts.hinhAnh && !spcts.hinhAnh.some((anh) => anh.anhMacDinh),
        );

        if (productsWithoutImages.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng thêm ảnh cho tất cả sản phẩm trước khi hoàn thành.',
            });
        } else if (productsWithoutDefaultImage.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Có sản phẩm không có ảnh mặc định. Vui lòng đặt ảnh mặc định cho sản phẩm.',
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Hoàn tất thêm ảnh sản phẩm',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '#!/list-Product';
                }
            });
        }
    };
});

app.controller('CTSPController', function ($scope, $routeParams, $http) {
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

    let id = $routeParams.id;

    $http
        .get('http://localhost:8080/sanPhamChiTiet/dsCTSP', {
            params: { san_pham_id: id },
            headers: headers,
        })
        .then(function (response) {
            const details = response.data;
            $scope.details = details;
        });

    $http.get('http://localhost:8080/sanPham/chinhSua/' + id, { headers }).then(function (response) {
        const editproduct = response.data;
        $scope.editproduct = editproduct;
    });

    $scope.editSPCT = function (promotion) {
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
        window.location.href = '#!/edit-ProductDetails?id=' + id;
    };

    $scope.updateTrangThai = function (details) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        Swal.fire({
            title: 'Xác nhận chuyển trạng thái',
            text: 'Bạn có muốn chuyển trạng thái của sản phẩm không?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                // Kiểm tra xem số lượng có phải là 0 không và trạng thái là true
                if (details.soLuong === 0 && details.trangThai) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Không thể chuyển trạng thái khi số lượng bằng 0',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    $scope.$apply(function () {
                        details.trangThai = !details.trangThai; // Đảo ngược trạng thái
                    });
                } else {
                    let data = {
                        status: details.trangThai,
                        id: details.id,
                    };

                    $http
                        .post('http://localhost:8080/sanPhamChiTiet/update/trangThai', data, { headers })
                        .then(function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Chuyển trạng thái thành công',
                                showConfirmButton: false,
                                timer: 2000,
                            });

                            $http
                                .get('http://localhost:8080/sanPhamChiTiet/dsCTSP', {
                                    params: { san_pham_id: id },
                                    headers: headers,
                                })
                                .then(function (response) {
                                    const details = response.data;
                                    $scope.details = details;
                                });

                            // Cập nhật ngữ cảnh AngularJS
                            $scope.$apply(function () {
                                details.trangThai = !details.trangThai; // Đảo ngược trạng thái
                            });
                        });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                $scope.$apply(function () {
                    details.trangThai = !details.trangThai; // Đảo ngược trạng thái
                });
                console.log('Người dùng đã nhấn nút Hủy');
            }
        });
    };

    $scope.returnProduct = function () {
        window.location.href = '#!/list-Product';
    };

    $scope.themSanPhamTuongTu = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        window.location.href = '#!/themSanPhamTuongTu?id=' + id;
    };
});

app.factory('ImageService', function () {
    var images = {};

    return {
        getImages: function (productId) {
            return images[productId] || [];
        },
        setImages: function (productId, imgData) {
            images[productId] = imgData;
        },
    };
});

app.controller('EditImgController', function ($scope, $http, $routeParams, ImageService) {
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

    let id_product = $routeParams.id;
    let storedImages = ImageService.getImages(id_product);
    if (storedImages.length > 0) {
        $scope.spct = storedImages;
    } else {
        $http
            .get('http://localhost:8080/sanPhamChiTiet/themAnhSpctId/' + id_product, { headers })
            .then(function (response) {
                const spct = response.data;
                const uniqueProducts = {};

                spct.forEach(function (product) {
                    const mauSacId = product.mauSac.id;
                    if (!uniqueProducts[mauSacId]) {
                        uniqueProducts[mauSacId] = product;
                    }
                });

                $scope.spct = Object.values(uniqueProducts);
                $scope.spct.forEach(function (spcts) {
                    updateImageData(spcts);
                });
            });
    }

    $scope.loadImage = function (input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.imagePreview = e.target.result;
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.img_name = '';

    function updateImageData(spcts) {
        if (!spcts || !spcts.id) {
            return;
        }

        $http
            .get('http://localhost:8080/sanPhamChiTiet/hienThiAnh/' + spcts.id, {
                headers,
            })
            .then(function (response) {
                const hinhAnh = response.data;
                spcts.hinhAnh = hinhAnh;
            });
    }

    $http
        .get('http://localhost:8080/sanPhamChiTiet/themAnh/' + id_product, {
            headers,
        })
        .then(function (response) {
            const spct = response.data;
            const uniqueProducts = {};

            spct.forEach(function (product) {
                const mauSacId = product.mauSac.id;
                if (!uniqueProducts[mauSacId]) {
                    uniqueProducts[mauSacId] = product;
                }
            });

            $scope.spct = Object.values(uniqueProducts);
            $scope.spct.forEach(function (spcts) {
                updateImageData(spcts);
            });
        });

    $scope.hienThiAnh = function (event, spcts) {
        let id = spcts.id;
        let fileInput = event.target;
        let files = fileInput.files;

        spcts.hinhAnh = [];

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();

            reader.onload = function (e) {
                let data = {
                    id_spct: id,
                    ten_anh: [file.name],
                };

                $http
                    .post('http://localhost:8080/sanPhamChiTiet/themAnhSanPham', data, {
                        headers,
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.mess,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        updateImageData(spcts);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    $scope.setAnhMacDinh = function (hinhAnh, spcts) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            id_hinh_anh: hinhAnh.id,
            id_spct: spcts.id,
        };

        $http
            .put('http://localhost:8080/sanPhamChiTiet/setAnhMacDinh/', data, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.mess,
                    showConfirmButton: false,
                    timer: 2000,
                });
                updateImageData(spcts);
            });
    };

    $scope.xoaAnh = function (hinhAnh, spcts) {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        let data = {
            id_hinh_anh: hinhAnh.id,
            id_spct: spcts.id,
        };

        $http
            .put('http://localhost:8080/sanPhamChiTiet/xoaAnh/', data, {
                headers,
            })
            .then(function (response) {
                const index = spcts.hinhAnh.findIndex((item) => item.id === hinhAnh.id);
                if (index !== -1) {
                    spcts.hinhAnh.splice(index, 1);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Xóa ảnh thành công',
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    $scope.themAnhSanPhamHT = function () {
        if (decodedToken.role === 'STAFF') {
            Swal.fire({
                icon: 'warning',
                title: 'Bạn không có quyền thao tác',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const productsWithoutImages = $scope.spct.filter((spcts) => !spcts.hinhAnh || spcts.hinhAnh.length === 0);
        const productsWithoutDefaultImage = $scope.spct.filter(
            (spcts) => spcts.hinhAnh && !spcts.hinhAnh.some((anh) => anh.anhMacDinh),
        );

        if (productsWithoutImages.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng thêm ảnh cho tất cả sản phẩm trước khi hoàn thành.',
            });
        } else if (productsWithoutDefaultImage.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Có sản phẩm không có ảnh mặc định. Vui lòng đặt ảnh mặc định cho sản phẩm.',
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Hoàn tất sửa ảnh sản phẩm',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
            }).then((result) => {
                if (result.isConfirmed) {
                    let id = $routeParams.id;
                    window.location.href = '#!/edit-ProductDetails?id=' + id;
                }
            });
        }
    };

    $scope.returnEdit = function () {
        let idProduct = $routeParams.id;
        window.location.href = '#!/edit-ProductDetails?id=' + idProduct;
    };
});
