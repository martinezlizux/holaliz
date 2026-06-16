// Contact Form Handler
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Clear validation styles on input for real-time feedback
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                }
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            let isValid = true;

            // Get form data
            const formData = new FormData(contactForm);
            const name = (formData.get('name') || '').trim();
            const email = (formData.get('email') || '').trim();
            const message = (formData.get('message') || '').trim();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // 1. Name validation
            if (!name) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
            }

            // 2. Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            // 3. Message validation
            if (!message) {
                messageInput.classList.add('is-invalid');
                isValid = false;
            } else {
                messageInput.classList.remove('is-invalid');
            }

            // Stop submission if form is invalid
            if (!isValid) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;

            // Send email using Formspree
            fetch('https://formspree.io/f/xgvzgrzj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
                .then(response => {
                    if (response.ok) {
                        // Success - Show confirmation message
                        showSuccessMessage();
                        contactForm.reset();

                        // Track successful form submission
                        if (window.GATracking && window.GATracking.trackContactSuccess) {
                            window.GATracking.trackContactSuccess();
                        }
                    } else {
                        throw new Error('Failed to send message');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Sorry, there was an error sending your message. Please try again or email me directly at liz@holaliz.com');
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                });
        });
    }

    // Function to show success message with animation
    function showSuccessMessage() {
        const formContainer = document.getElementById('contactFormContainer');
        const successMessage = document.getElementById('successMessage');

        if (formContainer && successMessage) {
            // Fade out form
            formContainer.classList.add('fade-out');

            // After form fades out, show success message
            setTimeout(() => {
                formContainer.style.display = 'none';
                successMessage.classList.remove('d-none');

                // Trigger animation
                setTimeout(() => {
                    successMessage.classList.add('show');
                }, 100);
            }, 500);
        }
    }

    // Alternative: Use mailto as fallback if Formspree fails
    function sendEmailFallback(name, email, message) {
        const subject = encodeURIComponent('Contact from Portfolio Website');
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:liz@holaliz.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    }
});

// Function to close modal (called from HTML)
function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    if (modal) {
        modal.hide();
    }

    // Reset form view after modal closes
    setTimeout(() => {
        const formContainer = document.getElementById('contactFormContainer');
        const successMessage = document.getElementById('successMessage');

        if (formContainer && successMessage) {
            formContainer.style.display = 'block';
            formContainer.classList.remove('fade-out');
            successMessage.classList.remove('show');
            successMessage.classList.add('d-none');
        }
    }, 300);
}
