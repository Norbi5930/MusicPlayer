

const password_input = document.getElementById("form_password");
const checkbox = document.getElementById("form_show_password");


checkbox.addEventListener("change", function() {
    if (checkbox.checked) {
        password_input.type = "text";
    } else {
        password_input.type = "password";
    }; 
});



