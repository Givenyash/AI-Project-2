// =====================================
// SUPABASE CONFIG
// =====================================

const SUPABASE_URL = "https://eejffngwdyxpicxadxpq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0TCbmYLHtkL4WHmMkX3HQQ_2R8--KZJ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// =====================================
// SELECT ELEMENTS
// =====================================

const form = document.getElementById("registerForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const registerBtn = document.getElementById("registerBtn");

const alertBox = document.getElementById("alertBox");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// =====================================
// PASSWORD TOGGLE
// =====================================

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);
        const icon = button.querySelector("i");

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }

    });

});

// =====================================
// ALERT
// =====================================

function showAlert(message, type) {

    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;

}

function hideAlert() {

    alertBox.className = "alert";
    alertBox.textContent = "";

}

// =====================================
// CLEAR ERRORS
// =====================================

function clearErrors() {

    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

}

// =====================================
// VALIDATION
// =====================================

function validateForm() {

    clearErrors();

    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Name Validation
    if (name.length < 3) {
        nameError.textContent = "Enter at least 3 characters.";
        valid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        emailError.textContent = "Enter a valid email.";
        valid = false;
    }

    // Password Validation
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
        passwordError.textContent =
            "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.";
        valid = false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        valid = false;
    }

    return valid;

}

// =====================================
// LOADING
// =====================================

function setLoading(isLoading) {

    if (isLoading) {
        registerBtn.classList.add("loading");
        registerBtn.disabled = true;
    } else {
        registerBtn.classList.remove("loading");
        registerBtn.disabled = false;
    }

}

// =====================================
// REGISTER USER
// =====================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    hideAlert();

    if (!validateForm()) return;

    setLoading(true);

    try {

        const { data, error } = await supabaseClient.auth.signUp({

            email: emailInput.value.trim(),

            password: passwordInput.value,

            options: {
                data: {
                    full_name: nameInput.value.trim()
                }
            }

        });

        if (error) {

            showAlert(error.message, "error");

        } else {

            showAlert(
                "Account created successfully! Please check your email to verify your account.",
                "success"
            );

            form.reset();

            console.log(data);

        }

    } catch (err) {

        console.error(err);

        showAlert(
            "Something went wrong. Please try again.",
            "error"
        );

    }

    setLoading(false);

});