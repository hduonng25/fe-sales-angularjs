app.controller('danhSachSanPhamController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    $http.get('http://localhost:8080/customer/sanPham/danhSach', { headers }).then(function (response) {
        const sanPham = response.data;
        $scope.sanPham = sanPham;
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

    $scope.pager = {
        page: 1,
        size: 8,
        get sanPham() {
            if ($scope.sanPham && $scope.sanPham.length > 0) {
                let start = (this.page - 1) * this.size;
                return $scope.sanPham.slice(start, start + this.size);
            } else {
                // Trả về một mảng trống hoặc thông báo lỗi tùy theo trường hợp
                return [];
            }
        },
        get count() {
            if ($scope.sanPham && $scope.sanPham.length > 0) {
                let start = (this.page - 1) * this.size;
                return Math.ceil((1.0 * $scope.sanPham.length) / this.size);
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

    $scope.getSanPhamChiTiet = function (sanPham) {
        let id_sanPham = sanPham.id;
        window.location.href = '#!/product-details?id=' + id_sanPham;
    };

    $scope.filterByLoaiSp = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/loai_san_pham', {
                params: { idloaiSanPham: $scope.idloaiSanPham },
                headers: headers,
            })
            .then(function (response) {
                const sanPham = response.data;
                $scope.sanPham = sanPham;
            });
    };

    $scope.filterByChatLieu = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/chat_lieu', {
                params: { id_chat_lieu: $scope.id_chat_lieu },
                headers: headers,
            })
            .then(function (response) {
                const sanPham = response.data;
                $scope.sanPham = sanPham;
            });
    };

    $scope.filterByNsx = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/nha_san_xuat', {
                params: { id_nsx: $scope.id_nsx },
                headers: headers,
            })
            .then(function (response) {
                const sanPham = response.data;
                $scope.sanPham = sanPham;
            });
    };

    $scope.filterByMauSac = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/mau_sac', {
                params: { mauSac_id: $scope.mauSac_id },
                headers: headers,
            })
            .then(function (response) {
                const sanPham = response.data;
                $scope.sanPham = sanPham;
            });
    };

    $scope.filterByKichCo = function () {
        $http
            .get('http://localhost:8080/customer/sanPham/loc/kich_co', {
                params: { kichCo_id: $scope.kichCo_id },
                headers: headers,
            })
            .then(function (response) {
                const sanPham = response.data;
                $scope.sanPham = sanPham;
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
                $scope.sanPham = response.data;
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
                .get('http://localhost:8080/customer/sanPham/timKiemTheoTen/' + newVal, { headers })
                .then(function (response) {
                    $scope.sanPham = response.data;
                });
        } else {
            $http.get('http://localhost:8080/customer/sanPham/danhSach', { headers }).then(function (response) {
                $scope.sanPham = response.data;
            });
        }
    });

    $scope.searchAll = function (searchTerm) {
        $http
            .get('http://localhost:8080/customer/sanPham/timKiemTheoTen/' + searchTerm, { headers })
            .then(function (response) {
                $scope.sanPham = response.data;
            });
    };

    $scope.reLoad = function () {
        $http.get('http://localhost:8080/customer/sanPham/danhSach', { headers }).then(function (response) {
            const sanPham = response.data;
            $scope.$evalAsync(function () {
                $scope.sanPham = sanPham;
            });
        });
    };
});

app.controller('ChiTietSanPhamController', function ($scope, $routeParams, $http) {
    const id_sanPham = $routeParams.id;
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
    }

    $http
        .get('http://localhost:8080/customer/sanPham/getSanPham/id=' + id_sanPham, { headers })
        .then(function (response) {
            const sanPham = response.data;
            $scope.sanPham = sanPham;
        });

    $http
        .get('http://localhost:8080/customer/sanPham/api/getSize/' + id_sanPham, {
            headers,
        })
        .then(function (response) {
            const kichCo = response.data;
            $scope.kichCo = kichCo;
        });

    $http
        .get('http://localhost:8080/customer/sanPham/api/getColor/' + id_sanPham, { headers })
        .then(function (response) {
            const mauSac = response.data;
            $scope.mauSac = mauSac;
        });

    $http.get('http://localhost:8080/customer/sanPham/getAnhSanPham/' + id_sanPham).then(function (response) {
        const hinhAnh_list = response.data;
        $scope.hinhAnhs = hinhAnh_list;
    });

    $http.get('http://localhost:8080/customer/sanPham/getAnhMacDinhSanPham/' + id_sanPham).then(function (response) {
        const hinhAnh = response.data.anhMacDinh;
        $scope.hinhAnh = hinhAnh;
    });

    $scope.selectKichCo = function (kichCo) {
        $scope.selectedKichCo = kichCo;
        return $scope.selectedKichCo;
    };

    $scope.selectMauSac = function (mauSac) {
        $scope.selectedMauSac = mauSac;
    };

    let soLuongGet;
    let kichCo;
    let maMauSac;
    $scope.soLuongHienCo = 0;

    $scope.$watchGroup(['selectedKichCo', 'selectedMauSac'], function (newValues, oldValues) {
        if (newValues[0] !== undefined && newValues[1] !== undefined) {
            let data = {
                kichCo: newValues[0],
                maMauSac: newValues[1],
                sanPhamId: $scope.sanPham.id,
            };
            kichCo = newValues[0];
            maMauSac = newValues[1];

            $http
                .post('http://localhost:8080/customer/sanPham/api/getSoLuong', data, { headers })
                .then(function (response) {
                    soLuongGet = document.getElementById('customer-sanPham-soLuongHienCo');
                    if (soLuongGet) {
                        soLuongGet.innerText = response.data;
                        $scope.soLuongHienCo = response.data;
                    }
                });
        }
    });

    $scope.maMauSac = '';
    $scope.$watch('selectedMauSac', function (newVal, oldVal) {
        if (newVal !== undefined) {
            $scope.maMauSac = newVal;
            let data = {
                id_SP: id_sanPham,
                maMauSac: $scope.maMauSac,
            };
            $http.post('http://localhost:8080/customer/sanPham/getAnhByMauSac', data).then(function (response) {
                const hinhAnh = response.data.anh;
                $scope.hinhAnh = hinhAnh;
            });
        }
    });

    $scope.addToCart = function (sanPham) {
        if (token) {
            let data = {
                kichCo: kichCo,
                maMauSac: maMauSac,
                san_pham_id: sanPham.id,
                email: decodedToken.email,
                soLuong: $scope.chonSoLuong,
                soLuongHienCo: $scope.soLuongHienCo,
                donGia: sanPham.gia,
            };

            $http
                .post('http://localhost:8080/customer/cart/addToCart', data, {
                    headers,
                })
                .then(function (response) {
                    if (response.data.err === undefined) {
                        Swal.fire({
                            icon: 'success',
                            title: response.data.done,
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: response.data.err,
                            showConfirmButton: false,
                            timer: 2000,
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập để sử dụng tính năng này',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.href = 'http://127.0.0.1:5501/templates/auth/Login.html#!/login';
            });
        }
    };

    $scope.muaNgay = function (sanPham) {
        let data = {
            kichCoDaChon: kichCo,
            maMauSac: maMauSac,
            san_pham_id: sanPham.id,
            soLuong: $scope.chonSoLuong,
            donGia: sanPham.gia,
            soLuongHienCo: $scope.soLuongHienCo,
        };

        $http
            .post('http://localhost:8080/api/muaNgay/check-out', data)
            .then(function (response) {
                const spct = response.data.san_pham_chi_tiet;
                if (spct.trangThai === false) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Chúng tôi đã ngừng kinh doanh sản phẩm này',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    return;
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đang chuyển hướng hướng đến trang đặt hàng',
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        localStorage.setItem('id_HoaDonMuaNgay', response.data.id_hoa_don);
                        const id_HoaDonMuaNgay = localStorage.getItem('id_HoaDonMuaNgay');
                        window.location.href =
                            'http://127.0.0.1:5501/templates/banHang/muaNgay/CheckOut.html?id_HoaDonMuaNgay=' +
                            id_HoaDonMuaNgay;
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
});
