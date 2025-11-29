

    $(document).ready(function () {
    // Fetch data using AJAX

    function addRow(user) {
        $("#usersList").append("<tr><td>" + user.id + "</td>" +
            "<td>" + user.firstName +
            "</td><td>" + user.secondName + "</td>" +
            "<td>"+user.email+"</td>" +"<td>"+user.address+"</td>"+
            "<td>"+user.phoneNumber+"</td>"+
            "<td>" +
            "<button onclick='findUserById(" + user.id + ")'>" + "Profile" + "</button>" +
            "</td>"+
            "</tr>");
    }
    $.ajax({
    type: "GET",
    url: "/users/getAll",
    success: function (users) {
    // Iterate through the products and display them in the table
    const usersList = $("#usersList");
    users.forEach(function (users) {
    usersList.append("<tr>" +
    "<td>" + users.id + "</td>"
    +"<td>"+ users.firstName + "</td>"
    +"<td>"+ users.secondName +"</td>"+
    "<td>"+ users.email+"</td>"+
    "<td>"+users.address+"</td>"
    +"<td>"+ users.phoneNumber+ "</td>"+
    "<td>" +
    "<button onclick='findUserById(" + users.id + ")'>" + "Profile" + "</button>" +
    "</td>"
    +"</tr>");
});
},
    error: function (error) {
    console.error("Error fetching product data: ", error);
}
});

    $("#userForm").submit(function (event) {
    event.preventDefault();
    let user = {
    firstName: $("#firstName").val(),
    secondName: $("#secondName").val(),
    email: $("#email").val(),
    address: $("#address").val(),
    phoneNumber: $("#phoneNumber").val()
};

    $.ajax({
    type: "POST",
    url: "/users/addUser",
    contentType: "application/json",
    data: JSON.stringify(user),
    success: function () {
    alert("user saved successfully!");
    addRow(user)

},
    error: function (error) {
    console.log("Error saving person: ", error);
}
});
});
});


    function findUserById(id) {
    $.ajax({
        type: "Get",
        url: "/user/findUserId/"+id,
        success: function (user) {
            alert("find user successfully id="+user.id);
            window.location.href = "/profile.html?id="+user.id;//+ encodeURIComponent(user.id);

        },
        error: function (error) {
            console.log("Error saving person: ", error);
        }
    });

}
    async function encryptNumber(number, key) {
        const encoder = new TextEncoder();
        const data = encoder.encode(number.toString());

        // Import the key
        const importedKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(key),
            { name: 'AES-CBC' },
            false,
            ['encrypt', 'decrypt']
        );

        // Encrypt the data
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: crypto.getRandomValues(new Uint8Array(16)) },
            importedKey,
            data
        );

        // Convert the encrypted buffer to a hexadecimal string
        const encryptedArray = Array.from(new Uint8Array(encryptedData));
        const encryptedHex = encryptedArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

        return encryptedHex;
    }

    async function decryptNumber(encryptedHex, key) {
        // Import the key
        const importedKey = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(key),
            { name: 'AES-CBC' },
            false,
            ['encrypt', 'decrypt']
        );

        // Convert the hexadecimal string to a buffer
        const encryptedArray = encryptedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
        const encryptedBuffer = new Uint8Array(encryptedArray).buffer;

        // Decrypt the data
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: new Uint8Array(16) },
            importedKey,
            encryptedBuffer
        );

        // Decode the decrypted data
        const decryptedText = new TextDecoder().decode(decryptedData);

        return decryptedText;
    }
