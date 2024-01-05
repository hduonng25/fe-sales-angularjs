const app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/list-khuyenMai', {
            templateUrl: '/templates/admin/KhuyenMai/DanhSach.html',
            controller: 'KhuyenMaiController',
        })
        .when('/edit-khuyenMai', {
            templateUrl: '/templates/admin/KhuyenMai/ChinhSua.html',
            controller: 'EditKhuyenMaiController',
        })
        .when('/create-khuyenMai', {
            templateUrl: '/templates/admin/KhuyenMai/ThemMoi.html',
            controller: 'CreateKhuyenMaiController',
        })
        .when('/list-PurchaseBill', {
            templateUrl: '/templates/admin/hoaDon/online/ChoXacNhan.html',
            controller: 'ChoXacNhanController',
        })
        .when('/cho-giao-hang', {
            templateUrl: '/templates/admin/hoaDon/online/ChoGiaoHang.html',
            controller: 'ChoGiaoHangController',
        })
        .when('/dang-giao', {
            templateUrl: '/templates/admin/hoaDon/online/DangGiaoHang.html',
            controller: 'DangGiaoHangController',
        })
        .when('/da-giao', {
            templateUrl: '/templates/admin/hoaDon/online/DaGiaoHang.html',
            controller: 'DaGiaoHangController',
        })
        .when('/da-huy', {
            templateUrl: '/templates/admin/hoaDon/online/DaHuyDon.html',
            controller: 'DaHuyDonController',
        })
        .when('/xac-nhan-da-giao', {
            templateUrl: '/templates/admin/hoaDon/online/XacNhanDaGiao.html',
            controller: 'XacNhanDaGiaoController',
        })
        .when('/login', {
            templateUrl: '/templates/admin/login/index.html',
            controller: 'loginCtrl',
        })
        .when('/CTChoXacNhan', {
            templateUrl: '/templates/admin/hoaDon/details.Online/ChiTietChoXacNhan.html',
            controller: 'CTChoXacNhan',
        })
        .when('/CTChoGiaoHang', {
            templateUrl: '/templates/admin/hoaDon/details.Online/ChiTietChoGiaoHang.html',
            controller: 'CTChoGiaoHang',
        })
        .when('/CTDangGiaoHang', {
            templateUrl: '/templates/admin/hoaDon/details.Online/ChiTietDangGiaoHang.html',
            controller: 'CTDangGiaoHang',
        })
        .when('/CTDaGiaoHang', {
            templateUrl: '/templates/admin/hoaDon/details.Online/ChiTietDaGiaoHang.html',
            controller: 'CTDaGiaoHang',
        })
        .when('/CTDaHuy', {
            templateUrl: '/templates/admin/hoaDon/details.Online/ChiTietDaHuy.html',
            controller: 'CTDaHuy',
        })
        .when('/CTXacNhanDaGiao', {
            templateUrl: '/templates/admin/hoaDon/details.Online/ChiTietXacNhanDaGiao.html',
            controller: 'CTXacNhanDaGiao',
        })
        .when('/list-CounterBill', {
            templateUrl: '/templates/admin/hoaDonTaiQuay/DaHuy.html',
            controller: 'DaHuyController',
        })
        .when('/da-thanh-toan', {
            templateUrl: '/templates/admin/hoaDonTaiQuay/DaThanhToan.html',
            controller: 'DaThanhToanController',
        })
        .when('/hdct_dahuy', {
            templateUrl: '/templates/admin/hoaDonTaiQuay/hoaDonChiTiet/HDCT_DaHuy.html',
            controller: 'HDCT_DaHuyController',
        })
        .when('/hdct_dathanhtoan', {
            templateUrl: '/templates/admin/hoaDonTaiQuay/hoaDonChiTiet/HDCT_DaThanhToan.html',
            controller: 'HDCT_DaThanhToanController',
        })
        .when('/', {
            templateUrl: '/templates/admin/home.html',
        })
        .otherwise({
            redirectTo: '/',
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/list-Customer', {
            templateUrl: '/templates/admin/khachHang/list.html',
            controller: 'CustomerController',
        })
        .when('/edit-Customer', {
            templateUrl: '/templates/admin/khachHang/edit.html',
            controller: 'EditCustomerController',
        })
        .when('/create-Customer', {
            templateUrl: '/templates/admin/khachHang/create.html',
            controller: 'CreateCustomerController',
        })

        .when('/in-store', {
            templateUrl: '/templates/admin/sales/product_list.html',
            controller: 'ListProductController',
        })
        .when('/details-product', {
            templateUrl: '/templates/admin/sales/details.html',
            controller: 'detailsController',
        })
        .otherwise({
            redirectTo: '/',
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/list-Color', {
            templateUrl: '/templates/admin/sanPham/mau_sac/list.html',
            controller: 'ColorrController',
        })
        .when('/create-Color', {
            templateUrl: '/templates/admin/sanPham/mau_sac/create.html',
            controller: 'CreateColorController',
        })
        .when('/edit-Color', {
            templateUrl: '/templates/admin/sanPham/mau_sac/edit.html',
            controller: 'EditColorController',
        })
        .when('/list-Size', {
            templateUrl: '/templates/admin/sanPham/kich_co/list.html',
            controller: 'SizeController',
        })
        .when('/create-Size', {
            templateUrl: '/templates/admin/sanPham/kich_co/create.html',
            controller: 'CreateSizeController',
        })
        .when('/edit-Size', {
            templateUrl: '/templates/admin/sanPham/kich_co/edit.html',
            controller: 'EditSizeController',
        })
        .when('/list-Img', {
            templateUrl: '/templates/admin/sanPham/san_pham/themHinhAnh.html',
            controller: 'ImgController',
        })
        .when('/edit-Img', {
            templateUrl: '/templates/admin/sanPham/san_pham/editAnhSP.html',
            controller: 'EditImgController',
        })
        .when('/list-Line', {
            templateUrl: '/templates/admin/sanPham/loai_san_pham/list.html',
            controller: 'LineController',
        })
        .when('/create-Line', {
            templateUrl: '/templates/admin/sanPham/loai_san_pham/create.html',
            controller: 'CreateLineController',
        })
        .when('/edit-Line', {
            templateUrl: '/templates/admin/sanPham/loai_san_pham/edit.html',
            controller: 'EditLineController',
        })
        .when('/list-Material', {
            templateUrl: '/templates/admin/sanPham/chat_lieu/list.html',
            controller: 'MaterialController',
        })
        .when('/create-Material', {
            templateUrl: '/templates/admin/sanPham/chat_lieu/create.html',
            controller: 'CreateMaterialController',
        })
        .when('/edit-Material', {
            templateUrl: '/templates/admin/sanPham/chat_lieu/edit.html',
            controller: 'EditMaterialController',
        })
        .when('/list-Producer', {
            templateUrl: '/templates/admin/sanPham/nha_san_xuat/list.html',
            controller: 'ProducerController',
        })
        .when('/create-Producer', {
            templateUrl: '/templates/admin/sanPham/nha_san_xuat/create.html',
            controller: 'CreateProducerController',
        })
        .when('/edit-Producer', {
            templateUrl: '/templates/admin/sanPham/nha_san_xuat/edit.html',
            controller: 'EditProducerController',
        })
        .when('/edit-ProductDetails', {
            templateUrl: '/templates/admin/sanPham/san_pham/edit.html',
            controller: 'EditProductController',
        })
        .when('/list-Product', {
            templateUrl: '/templates/admin/sanPham/san_pham/list.html',
            controller: 'ProductController',
        })
        .when('/create-Product', {
            templateUrl: '/templates/admin/sanPham/san_pham/create.html',
            controller: 'CreateProductController',
        })
        .when('/list-CTSP', {
            templateUrl: '/templates/admin/sanPham/san_pham/listSPCT.html',
            controller: 'CTSPController',
        })

        .when('/themSanPhamTuongTu', {
            templateUrl: '/templates/admin/sanPham/san_pham/create_new_sp.html',
            controller: 'themSanPhamTuongTuController',
        })

        .when('/hoaDon/danhSachSanPham', {
            templateUrl: '/templates/admin/hoaDon/online/chinhSua/danhSachSP.html',
            controller: 'danhSachSanPhamHoaDonController',
        })

        .when('/chiTietSP_hoaDon', {
            templateUrl: '/templates/admin/hoaDon/online/chinhSua/chiTietSP.html',
            controller: 'ChiTietSanPhamHoaDonController',
        })

        .otherwise({
            redirectTo: '/',
        });
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/list-Staff', {
            templateUrl: '/templates/admin/staff/list.html',
            controller: 'NhanVienController',
        })
        .when('/edit-Staff', {
            templateUrl: '/templates/admin/staff/edit.html',
            controller: 'EditNhanVienController',
        })
        .when('/create-Staff', {
            templateUrl: '/templates/admin/staff/create.html',
            controller: 'CreateNhanVienController',
        })
        .otherwise({
            redirectTo: '/',
        });
});

app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'templates/admin/login/login.html',
            controller: 'loginController',
        });
    },
]);

//Bán hàng
app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/danhSachHoaDon', {
                templateUrl: '/templates/banHang/taiQuay/DanhSachHoaDon.html',
                controller: 'danhSachHoaDonController',
            })

            .when('/banHang', {
                templateUrl: '/templates/banHang/taiQuay/BanHang.html',
                controller: 'BanHangTaiQuayController',
            })

            .when('/danhSachSanPham/taiQuay', {
                templateUrl: '/templates/banHang/taiQuay/DanhSachSanPham.html',
                controller: 'danhSachSanPhamTaiQuayController',
            })

            .when('/product-details-taiQuay', {
                templateUrl: '/templates/banHang/taiQuay/ChiTietSanPham.html',
                controller: 'ChiTietSanPhamTaiQuayController',
            })

            .when('/thong-tin-user', {
                templateUrl: '/templates/admin/profile/infor.html',
                controller: 'ThongTinUserController',
            });
    },
]);

//Bán hàng
app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/thongKe', {
                templateUrl: '/templates/admin/ThongKe.html',
                controller: 'thongKeController',
            })
            .when('/doimatkhau', {
                templateUrl: '/templates/admin/profile/DoiMatKhauNV.html',
                controller: 'doimatkhauNV',
            });
    },
]);

app.directive('fileChange', [
    '$parse',
    function ($parse) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.fileChange);
                element.on('change', function (event) {
                    scope.$apply(function () {
                        fn(scope, { $event: event });
                    });
                });
            },
        };
    },
]);
