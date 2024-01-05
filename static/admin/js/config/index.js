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

document.addEventListener('DOMContentLoaded', function () {
    let token = localStorage.getItem('token');
    let headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
    };

    let decodedToken = parseJwt(token);

    let userInfo = {
        username: decodedToken.hoTen,
        role: decodedToken.role,
    };

    let userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.innerText = userInfo.username;
    }

    let userRoleElement = document.getElementById('userRole');
    if (userRoleElement) {
        userRoleElement.innerText = userInfo.role;
    }

    if (userInfo.role === 'STAFF') {
        const menuToHide = document.getElementById('nhanVienMenuItem');

        if (menuToHide) {
            menuToHide.style.display = 'none';
        }
    }

    if (userInfo.role === 'STAFF') {
        const menuToHide = document.getElementById('ThongkMenuItem');

        if (menuToHide) {
            menuToHide.style.display = 'none';
        }
    }

    if (userInfo.role === 'STAFF') {
        const menuToHide = document.getElementById('ThongkeMenuItem');

        if (menuToHide) {
            menuToHide.style.display = 'none';
        }
    }

    window.addEventListener('offline', (e) => {
        const textHide = document.getElementById('running-text');
        if (textHide) {
            textHide.style.display = 'block';
        }
    });
});
