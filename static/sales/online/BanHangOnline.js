//Api Giao Hàng Nhanh
$(document).ready(function () {
    $.ajax({
        url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        type: 'POST',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Token: 'ab5e296c-25a3-11ee-b394-8ac29577e80e',
        },
        success: function (response) {
            const provinces = response.data;
            const provinceSelect = $('#province');

            provinces.forEach(function (province) {
                provinceSelect.append(
                    "<option value='" + province.ProvinceID + "'>" + province.ProvinceName + '</option>',
                );
            });
        },
        error: function (xhr, status, error) {
            console.log('API Request Failed:', error);
        },
    });

    $('#province').change(function () {
        const selectedProvinceId = $(this).val();

        $('#district').prop('disabled', true).empty().append("<option value=''>Chọn Quận/Huyện</option>");
        $('#ward').prop('disabled', true).empty().append("<option value=''>Chọn Phường/Xã</option>");

        if (selectedProvinceId) {
            $.ajax({
                url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Token: 'ab5e296c-25a3-11ee-b394-8ac29577e80e',
                },
                data: {
                    province_id: selectedProvinceId,
                },
                success: function (response) {
                    const districts = response.data;
                    const districtSelect = $('#district');
                    districts.forEach(function (district) {
                        districtSelect.append(
                            "<option value='" + district.DistrictID + "'>" + district.DistrictName + '</option>',
                        );
                    });

                    districtSelect.prop('disabled', false);
                },
                error: function (xhr, status, error) {
                    console.log('API Request Failed:', error);
                },
            });
        }
    });

    $('#district').change(function () {
        const selectedDistrictId = $(this).val();

        $('#ward').prop('disabled', true).empty().append("<option value=''>Chọn Phường/Xã</option>");

        if (selectedDistrictId) {
            // Populate wards based on selected district
            $.ajax({
                url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Token: 'ab5e296c-25a3-11ee-b394-8ac29577e80e',
                },
                data: {
                    district_id: selectedDistrictId,
                },
                success: function (response) {
                    const wards = response.data;
                    const wardSelect = $('#ward');
                    wards.forEach(function (ward) {
                        wardSelect.append("<option value='" + ward.WardCode + "'>" + ward.WardName + '</option>');
                    });

                    // Enable ward selection
                    wardSelect.prop('disabled', false);
                },
                error: function (xhr, status, error) {
                    console.log('API Request Failed:', error);
                },
            });
        }
    });

    $('#province, #district, #ward').change(function () {
        calculateShippingFee();
    });

    function calculateShippingFee() {
        const toDistrictId = parseInt($('#district').val());
        const toWardCode = $('#ward').val();

        if (toDistrictId && toWardCode) {
            $.ajax({
                url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json',
                    Token: 'ab5e296c-25a3-11ee-b394-8ac29577e80e',
                },
                data: JSON.stringify({
                    shop_id: 4365806,
                    from_district: 1454,
                    to_district: toDistrictId,
                }),
                success: function (response) {
                    const availableServices = response.data;
                    if (availableServices.length > 0) {
                        const serviceId = availableServices[0].service_id;

                        $.ajax({
                            url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                            type: 'POST',
                            dataType: 'json',
                            headers: {
                                'Content-Type': 'application/json',
                                Token: 'ab5e296c-25a3-11ee-b394-8ac29577e80e',
                                ShopId: 4365806,
                            },
                            data: JSON.stringify({
                                from_district_id: 1454,
                                from_ward_code: '21211',
                                service_id: serviceId,
                                to_district_id: toDistrictId,
                                to_ward_code: toWardCode,
                                weight: 200,
                            }),
                            success: function (response) {
                                const shippingFee = response.data.total;

                                // Format the shipping fee with commas and "VNĐ" before updating the label
                                const formattedShippingFee = shippingFee.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                });

                                // Update shipping fee in the label
                                $('#shippingFee').text(formattedShippingFee);
                                $('#tienShip').text(formattedShippingFee);
                                calculateTotal();
                            },
                            error: function (xhr, status, error) {
                                console.log('API Request Failed:', error);
                            },
                        });
                    } else {
                        console.log('No available services.');
                    }
                },
                error: function (xhr, status, error) {
                    console.log('API Request Failed:', error);
                },
            });
        }
    }

    function calculateTotal() {
        const subtotal = parseFloat($('#subtotal').text().replace(/[^\d]/g, ''));
        const discountText = $('#discount').text();
        let discountType = 'percentage';
        let discountValue = 0;

        if (discountText.indexOf('%') !== -1) {
            // Giảm giá dưới dạng phần trăm
            discountType = 'percentage';
            discountValue = parseFloat(discountText.replace('%', ''));
        } else {
            // Giảm giá dưới dạng số tiền
            discountType = 'amount';
            discountValue = parseFloat(discountText.replace(/[^\d]/g, ''));
        }

        const shippingFee = parseFloat($('#shippingFee').text().replace(/[^\d]/g, ''));

        // Tính toán giá trị giảm giá dựa vào loại giảm giá và giá trị giảm giá
        const discountAmount =
            discountType === 'percentage' ? (subtotal + shippingFee) * (discountValue / 100) : discountValue;

        // Tính tổng tiền sau giảm giá
        let total = subtotal + shippingFee - discountAmount;

        if (isNaN(total) || !total) {
            total = 0;
        }

        // Chuyển đổi giá trị tổng tiền thành chỉ số (số nguyên)
        const totalIndex = Math.round(total);

        // Hiển thị chỉ số tổng tiền trong nhãn có id="total"
        $('#total').text(totalIndex.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }));

        // Gán giá trị chỉ số tổng tiền vào trường input ẩn có name="amount"
        $("input[name='amount']").val(totalIndex);
    }
});

$(document).ready(function () {
    const paymentMethod = $('input[name="paymentMethod"]:checked').val();
    if (paymentMethod === 'method1') {
        $('#buttonDatHang').show();
        $('#buttonThanhToan').hide();
    } else if (paymentMethod === 'method2') {
        $('#buttonDatHang').hide();
        $('#buttonThanhToan').show();
    }

    // Gán sự kiện change cho radio buttons
    $('input[name="paymentMethod"]').change(function () {
        const selectedMethod = $(this).val();
        if (selectedMethod === 'method1') {
            $('#buttonDatHang').show();
            $('#buttonThanhToan').hide();
        } else if (selectedMethod === 'method2') {
            $('#buttonDatHang').hide();
            $('#buttonThanhToan').show();
        }
    });
});

function getFullAddress() {
    const address = $('#addressInput').val();
    const province = $('#province option:selected').text();
    const district = $('#district option:selected').text();
    const ward = $('#ward option:selected').text();

    const fullAddress = address + ', ' + ward + ', ' + district + ', ' + province;
    return fullAddress;
}
