import { HttpHeaders } from "@angular/common/http";

function getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    });
}

export {
    getAuthHeaders
}