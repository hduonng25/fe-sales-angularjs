app.controller('ProductDetailsController', function ($scope, $http) {
    $http.get('http://localhost:8080/sanPhamChiTiet/danhSach').then(function (response) {
        const promotions = response.data;

        promotions.forEach(function (promotion) {
            promotion.status2 = getStatusText(promotion.status);
        });

        $scope.promotions = promotions;
    });

    function getStatusText(status) {
        if (status == 0) {
            return 'Active';
        } else if (status == 1) {
            return 'Expired';
        } else {
            return 'Awaiting';
        }
    }

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

    //Chuyển hướng đến trang edit theo id
    $scope.edit = function (promotion) {
        let idProDetails = promotion.id;
        window.location.href = '#!/edit-ProductDetails?id=' + idProDetails;
    };

    //Xóa trong danh sách
    $scope.delete = function (promotion) {
        let idProDetails = promotion.id;

        $http
            .delete('http://localhost:8080/api/productDetails/deleteprodtuctDetails/' + idProDetails)
            .then(function (response) {
                const promotions = response.data;

                // Thêm trường status2 và fomatMaximumValue vào từng đối tượng promotion
                promotions.forEach(function (promotion) {
                    promotion.status2 = getStatusText(promotion.status);
                });

                // Cập nhật lại dữ liệu trong table nhưng không load lại trang by SD_94
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
    };

    // Re load
    $scope.reLoad = function () {
        $http.get('http://localhost:8080/api/productDetails/list').then(function (response) {
            const promotions = response.data;
            promotions.forEach(function (promotion) {
                promotion.status2 = getStatusText(promotion.status);
            });

            $scope.$evalAsync(function () {
                $scope.promotions = promotions;
            });
        });
    };
});

//Edit controller
app.controller('EditProductDetailsController', function ($scope, $routeParams, $http) {
    let idProDetails = $routeParams.id;

    $http.get('http://localhost:8080/sanPhamChiTiet/chinhSua/' + idProDetails).then(function (response) {
        const editproductDetails = response.data;
        $scope.editproductDetails = editproductDetails;
    });

    //Lưu edit
    $scope.saveEdit = function () {
        let maxValue = $scope.editproductDetails.fomatMaximumValue;
        let numericValue = parseFloat(maxValue.replace(/[^\d.-]/g, ''));

        let editproductDetails = {
            id: idProDetails,
            name: $scope.editproductDetails.name,
            startedDate: $scope.editproductDetails.startedDate,
            endDate: $scope.editproductDetails.endDate,
            percentproductDetails: $scope.editproductDetails.percentproductDetails,
        };

        $http
            .put('http://localhost:8080/sanPhamChiTiet/luuChinhSua', editproductDetails)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sửa thành công',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(function () {
                    sessionStorage.setItem('isConfirmed', true);
                    window.location.href = '#!/list-productDetails';
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
        window.location.href = '#!/list-ProductDetails';
    };
});
