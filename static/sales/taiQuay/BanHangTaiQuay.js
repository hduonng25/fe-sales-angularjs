$(document).ready(function () {
    $('.tienKhachDua-input').on('input', function () {
        const inputValue = $(this).val();
        if (!/^[,\d]*$/.test(inputValue)) {
            Swal.fire({
                icon: 'error',
                title: 'Vui lòng chỉ nhập số',
                showConfirmButton: false,
                timer: 2000,
            });

            $(this).val('');
            return;
        }

        const tienTraLaiInput = $('#tienTralai').val();
        let tienKhachDuaInput = parseInt($(this).val());
        let tienKhachDuaInputFomat = parseFloat($('#tienKhachDuaInput').val().replace(/[^\d]/g, ''));
        const tienTienChuoi = $('#tongTienHoaDon-taiQuay').text(); // Ví dụ chuỗi số tiền
        const tienThanhToan = parseFloat(tienTienChuoi.replace(/[^\d]/g, '').trim());

        const tienGiam = parseFloat($('#discount-taiQuay').text().replace(/[^\d]/g, ''));
        const tienFomat = tienKhachDuaInput.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        let tienTraLai;
        if (!isNaN(tienKhachDuaInput)) {
            tienTraLai = tienKhachDuaInputFomat - tienThanhToan;
            if (tienTraLai >= 0) {
                $('#tienTralai').text(tienTraLai.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
                $('#tienThieu').text('0 VNĐ');
            } else if (tienTraLai < 0) {
                $('#tienThieu').text(tienTraLai.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
                $('#tienTralai').text('0 VNĐ');
            }
        } else {
            tienKhachDuaInputFomat = 0;
            tienTraLai = tienKhachDuaInputFomat - tienThanhToan;
            if (tienTraLai >= 0) {
                $('#tienTralai').text(tienTraLai.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
                $('#tienThieu').text('0 VNĐ');
            } else if (tienTraLai < 0) {
                $('#tienThieu').text(tienTraLai.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));
                $('#tienTralai').text('0 VNĐ');
            }
        }
    });
});
