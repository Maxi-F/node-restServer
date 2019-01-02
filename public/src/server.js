const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

let request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/user', true);

request.setRequestHeader('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJzdGF0dXMiOnRydWUsImdvb2dsZSI6ZmFsc2UsIl9pZCI6IjVjMmE5OTdiZjU3MDNlMmYyOGQyZDk0NCIsIm5hbWUiOiJ0ZXN0MiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiX192IjowfSwiaWF0IjoxNTQ2NDQ3MjI4LCJleHAiOjE1NDY2MjAwMjh9.SLDr2kCez_u0UWw1wUqXnK9SbsxYGARTQTx1B9UZdlI')

request.onload = function() {
    let data = JSON.parse(this.responseText);

    console.log(this);
};

request.send()