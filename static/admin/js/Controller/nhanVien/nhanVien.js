app.controller('NhanVienController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    let decodedToken = parseJwt(token);

    $http.get('http://localhost:8080/nhanVien/danhSach', { headers }).then(function (response) {
        const promotions = response.data;
        promotions.forEach(function (promotion) {
            promotion.trangThai2 = getTrangThai(promotion.trangThai);
        });
        $scope.promotions = promotions;
    });

    function getTrangThai(trangThai) {
        if (trangThai == 0) {
            return 'Đang hoạt động';
        } else if (trangThai == 1) {
            return 'Nghỉ việc';
        }
    }

    // Phân trang
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

    //Chuyển hướng đến trang edit theo id
    $scope.editStaff = function (promotion) {
        let idStaff = promotion.id;
        window.location.href = '#!/edit-Staff?id=' + idStaff;
    };

    //   // Xóa trong danh sách
    $scope.deleteStaff = function (promotion) {
        let id = promotion.id;
        let data = {
            id,
        };
        Swal.fire({
            title: 'Xác nhận xóa nhân viên',
            text: 'Bạn có chắc chắn muốn xóa nhân viên này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                $http
                    .put('http://localhost:8080/nhanVien/xoa', data, { headers })
                    .then(function (response) {
                        const promotions = response.data;

                        // Thêm trường status2 và fomattienGiamToiDa vào từng đối tượng promotion
                        promotions.forEach(function (promotion) {
                            promotion.trangThai2 = getTrangThai(promotion.trangThai);
                        });

                        // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
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

    $scope.$watch('searchTerm', function (newVal) {
        if (newVal) {
            $http.get('http://localhost:8080/nhanVien/timKiem/' + newVal, { headers }).then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {});
                promotions.forEach(function (promotion) {
                    promotion.trangThai2 = getTrangThai(promotion.trangThai);
                });

                $scope.$evalAsync(function () {
                    $scope.promotions = promotions;
                });
            });
        } else {
            $http.get('http://localhost:8080/nhanVien/danhSach', { headers }).then(function (response) {
                const promotions = response.data;
                // Thêm trường status2 vào từng đối tượng promotion
                promotions.forEach(function (promotion) {
                    promotion.trangThai2 = getTrangThai(promotion.trangThai);
                });

                $scope.promotions = promotions;
            });
        }
    });

    // Tìm kiếm
    $scope.searchAllStaff = function (searchTerm) {
        $http.get('http://localhost:8080/nhanVien/timKiem/' + searchTerm, { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.trangThai2 = getTrangThai(promotion.trangThai);
            });
            // Cập nhật lại dữ liệu trong table nhưng không load lại trang by hduong25
            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };

    $scope.searchStaff = function (selectedDate) {
        let formattedDate = formatDate(selectedDate);

        $http
            .get('http://localhost:8080/nhanVien/timKiemNgay/' + formattedDate, {
                headers,
            })
            .then(function (response) {
                const promotions = response.data;
                promotions.forEach(function (promotion) {
                    promotion.trangThai2 = getTrangThai(promotion.trangThai);
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
    //     // Re load
    $scope.reLoad = function () {
        $http.get('http://localhost:8080/nhanVien/danhSach', { headers }).then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.trangThai2 = getTrangThai(promotion.trangThai);
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };
});

// Create controller
app.controller('CreateNhanVienController', function ($scope, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    let gioiTinh;
    $scope.batDauQuet = function () {
        let vm = this;
        vm.duLieuQuet = null;
        vm.createStaff = {}; // Khởi tạo đối tượng createStaff

        // Tạo đối tượng quét
        let quetMQR = new Instascan.Scanner({
            video: document.getElementById('preview'),
        });

        // Xử lý sự kiện quét mã QR
        quetMQR.addListener('scan', function (noiDung) {
            vm.duLieuQuet = fixVietnameseCharacters(noiDung);

            let qrCodeParts = vm.duLieuQuet.split(/(?:\||\|\|)/);

            vm.createStaff = {
                soCanCuoc: qrCodeParts[0] || '',
                hoTen: qrCodeParts[2] || '',
                ngaySinh: qrCodeParts[3] || '',
                gioiTinh: qrCodeParts[4] || '',
                diaChi: qrCodeParts[5] || '',
            };

            let ngaySinhFormatted = formatNgaySinh(vm.createStaff.ngaySinh);

            function formatNgaySinh(ngaySinh) {
                // Kiểm tra xem ngày sinh có đúng định dạng không (ddmmyyyy)
                if (/^\d{8}$/.test(ngaySinh)) {
                    // Chia thành các phần tử dd, mm, yyyy
                    let dd = ngaySinh.substring(0, 2);
                    let mm = ngaySinh.substring(2, 4);
                    let yyyy = ngaySinh.substring(4, 8);

                    // Định dạng lại thành yyyy-MM-dd
                    return yyyy + '-' + mm + '-' + dd;
                } else {
                    // Nếu không đúng định dạng, trả lại giá trị ban đầu
                    return ngaySinh;
                }
            }

            let radioBtn1 = document.getElementById('inlineRadio1');
            let radioBtn2 = document.getElementById('inlineRadio2');

            if (radioBtn1 && radioBtn2) {
                if (vm.createStaff.gioiTinh === 'Nam') {
                    gioiTinh = true;
                    radioBtn1.checked = true;
                } else {
                    gioiTinh = false;
                    radioBtn2.checked = true;
                }
            }

            angular.element(document.getElementById('inputName')).val(vm.createStaff.hoTen);
            angular.element(document.getElementById('inputPhone')).val(vm.createStaff.soDienThoai);
            angular.element(document.getElementById('inputEmail')).val(vm.createStaff.email);
            angular.element(document.getElementById('inputDob')).val(ngaySinhFormatted);
            angular.element(document.getElementById('inputAddress')).val(vm.createStaff.diaChi);
            angular.element(document.getElementById('inputSoCanCuoc')).val(vm.createStaff.soCanCuoc);

            setTimeout(function () {
                // document.getElementById("scanButton").classList.remove("hidden");
                quetMQR.stop();
            }, 2000);
        });

        vm.batDauQuet = function () {
            Instascan.Camera.getCameras()
                .then(function (cameras) {
                    if (cameras.length > 0) {
                        document.getElementById('scanButton').classList.add('hidden');
                        quetMQR.start(cameras[0]);
                    } else {
                        console.error('Không tìm thấy camera.');
                    }
                })
                .catch(function (loi) {
                    console.error('Lỗi khi lấy danh sách camera:', loi);
                });
        };

        // Hàm giải mã nội dung từ QR
        function decodeQRContent(noiDung) {
            try {
                return iconv.decode(new Buffer(noiDung, 'binary'), 'utf-8');
            } catch (error) {
                console.error('Lỗi khi giải mã QR:', error);
                return noiDung;
            }
        }
        function fixVietnameseCharacters(str) {
            let decodedStr = decodeURIComponent(escape(str));
            return decodedStr;
        }
    };

    $scope.saveCreateStaff = function () {
        let ngaySinh = formatNgaySinh($scope.createStaff.ngaySinh);

        function formatNgaySinh(ngaySinh) {
            // Kiểm tra xem ngày sinh có đúng định dạng không (ddmmyyyy)
            if (/^\d{8}$/.test(ngaySinh)) {
                // Chia thành các phần tử dd, mm, yyyy
                let dd = ngaySinh.substring(0, 2);
                let mm = ngaySinh.substring(2, 4);
                let yyyy = ngaySinh.substring(4, 8);

                // Định dạng lại thành yyyy-MM-dd
                return yyyy + '-' + mm + '-' + dd;
            } else {
                // Nếu không đúng định dạng, trả lại giá trị ban đầu
                return ngaySinh;
            }
        }

        let data = {
            hoTen: $scope.createStaff.hoTen,
            soDienThoai: $scope.createStaff.soDienThoai,
            email: $scope.createStaff.email,
            ngaySinh: ngaySinh,
            diaChi: $scope.createStaff.diaChi,
            gioiTinh: gioiTinh,
            matKhau: $scope.createStaff.matKhau,
            soCanCuoc: $scope.createStaff.soCanCuoc,
        };

        if ($scope.createStaff === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Please enter complete information',
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        $http
            .post('http://localhost:8080/nhanVien/themMoi', data, { headers })
            .then(function (response) {
                // Xử lý thành công nếu có
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm mới thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    localStorage.removeItem('qr');
                    window.location.href = '#!/list-Staff';
                });
            })
            .catch(function (error) {
                if (error.status == 400) {
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
        window.location.href = '#!/list-Staff';
    };

    $scope.reload = function () {
        window.location.href = 'http://127.0.0.1:5501/templates/admin/home/index.html#!/create-Staff/';
    };
});

//Edit Staff
app.controller('EditNhanVienController', function ($scope, $routeParams, $http) {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };
    let idStaff = $routeParams.id;

    function formatNgaySinh(ngaySinh) {
        // Kiểm tra xem ngày sinh có đúng định dạng không (ddmmyyyy)
        if (/^\d{8}$/.test(ngaySinh)) {
            // Chia thành các phần tử dd, mm, yyyy
            let dd = ngaySinh.substring(0, 2);
            let mm = ngaySinh.substring(2, 4);
            let yyyy = ngaySinh.substring(4, 8);

            // Định dạng lại thành yyyy-MM-dd
            return yyyy + '-' + mm + '-' + dd;
        } else {
            // Nếu không đúng định dạng, trả lại giá trị ban đầu
            return ngaySinh;
        }
    }
    $scope.ngaySinh = '';
    $http.get('http://localhost:8080/nhanVien/chinhSua/' + idStaff, { headers }).then(function (response) {
        const editStaff = response.data;
        $scope.ngaySinh = formatNgaySinh(editStaff.ngaySinh);
        $scope.editStaff = editStaff;

        if (editStaff.gioiTinh === true) {
            document.getElementById('inlineRadio1').checked = true;
        } else if (editStaff.gioiTinh === false) {
            document.getElementById('inlineRadio2').checked = true;
        }
        document.getElementById('statusSelect').value = editStaff.trangThai.toString();
        // Gán giá trị cho trường nhập liệu ngày sinh
        document.getElementById('inputDateOfBirth').value = editStaff.ngaySinh;
    });

    //Lưu edit
    $scope.saveEditStaff = function () {
        let gioiTinh = document.getElementById('inlineRadio1').checked;
        let trangThai = document.getElementById('statusSelect').value;
        let editStaff = {
            id: idStaff,
            hoTen: $scope.editStaff.hoTen,
            soDienThoai: $scope.editStaff.soDienThoai,
            email: $scope.editStaff.email,
            ngaySinh: $scope.editStaff.ngaySinh,
            diaChi: $scope.editStaff.diaChi,
            gioiTinh: gioiTinh,
            trangThai: trangThai,
        };

        $http
            .put('http://localhost:8080/nhanVien/luuChinhSua', editStaff, {
                headers,
            })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-Staff';
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
        window.location.href = '#!/list-Staff';
    };
});
