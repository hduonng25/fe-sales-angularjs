const app = angular.module('myAppCustomer', ['ngRoute']);

//Gio hang
app.config(function ($routeProvider) {
    $routeProvider
        .when('/cart-list', {
            templateUrl: '/templates/customer/cart/cart.html',
            controller: 'cartController',
        })
        .when('/thong-tin-khach-hang', {
            templateUrl: '/templates/customer/home/ThongTin.html',
            controller: 'ThongTinKhachHang',
        })
        .when('/doi-mat-khau', {
            templateUrl: '/templates/customer/home/DoiMatKhau.html',
            controller: 'doimatkhau',
        })

        .otherwise({
            redirectTo: '/',
        });
});

//San pham
app.config(function ($routeProvider) {
    $routeProvider
        .when('/product-list', {
            templateUrl: '/templates/customer/sanPham/DanhSach.html',
            controller: 'danhSachSanPhamController',
        })

        .when('/product-details', {
            templateUrl: '/templates/customer/sanPham/ChiTiet.html',
            controller: 'ChiTietSanPhamController',
        })

        .when('/don-hang', {
            templateUrl: '/templates/customer/hoaDon/danhSach/Customer_ChoXacNhan.html',
            controller: 'choXacNhanCustomerController',
        })

        .when('/choGiaoHang-Customer', {
            templateUrl: '/templates/customer/hoaDon/danhSach/Customer_ChoGiaoHang.html',
            controller: 'choGiaoHangCustomerController',
        })

        .when('/dangGiaoHang-Customer', {
            templateUrl: '/templates/customer/hoaDon/danhSach/Customer_DangGiaoHang.html',
            controller: 'dangGiaoHangCustomerController',
        })

        .when('/daGiaoHang-Customer', {
            templateUrl: '/templates/customer/hoaDon/danhSach/Customer_DaGiaoHang.html',
            controller: 'daGiaoHangCustomerController',
        })

        .when('/daHuy-Customer', {
            templateUrl: '/templates/customer/hoaDon/danhSach/Customer_DaHuy.html',
            controller: 'daHuyCustomerController',
        })

        .when('/CTChoGiaoHangCustomer', {
            templateUrl: '/templates/customer/hoaDon/chiTiet/ChiTietChoGiaoHangCus.html',
            controller: 'CTchoGiaoHangCustomer',
        })

        .when('/CTChoXacNhanCustomer', {
            templateUrl: '/templates/customer/hoaDon/chiTiet/ChiTietChoXacNhanCus.html',
            controller: 'CTChoXacNhanCustomer',
        })

        .when('/CTDaGiaoHangCustomer', {
            templateUrl: '/templates/customer/hoaDon/chiTiet/ChiTietDaGiaoCus.html',
            controller: 'CTDaGiaoHangCustomer',
        })

        .when('/CTDaHuyCustomer', {
            templateUrl: '/templates/customer/hoaDon/chiTiet/ChiTietDaHuyCus.html',
            controller: 'CTDaHuyCustomer',
        })

        .when('/CTDangGiaoHangCustomer', {
            templateUrl: '/templates/customer/hoaDon/chiTiet/ChiTietDangGiaoHangCus.html',
            controller: 'CTDangGiaoHangCustomer',
        })

        .otherwise({
            redirectTo: '/',
        });
});
