const form = document.getElementById('contactForm');

// Your two API keys
const API_KEY_1 = 'f503a9ed-fbda-40e2-b05e-31547428431f';
const API_KEY_2 = '322561fc-db56-47fb-aadb-f39636c547e8';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
        // Create separate FormData for each API key
        const formData1 = new FormData(form);
        formData1.append('access_key', API_KEY_1);
        
        const formData2 = new FormData(form);
        formData2.append('access_key', API_KEY_2);
        
        // Submit to both APIs simultaneously
        const [response1, response2] = await Promise.all([
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData1
            }),
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData2
            })
        ]);
        
        const result1 = await response1.json();
        const result2 = await response2.json();
        
        // Check if both submissions succeeded
        if (result1.success && result2.success) {
            // Show success message with SweetAlert2
            Swal.fire({
                icon: 'success',
                html: `
                    <h2 style="color: #f5713d; margin-bottom: 15px; font-weight: 700; font-size: 2.5rem;">
                        Thank You for choosing Yottron Solutions
                    </h2>
                    <p style="color: #666; font-size: 1rem; line-height: 1.6; margin-bottom: 15px;">
                        We've received your message and our team will get back to you as soon as possible.
                    </p>
                `,
                showConfirmButton: true,
                confirmButtonText: 'Close',
                confirmButtonColor: '#f5713d',
                draggable: true,
                customClass: {
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    htmlContainer: 'custom-swal-html',
                    confirmButton: 'custom-swal-button'
                }
            });
            
            form.reset();
        } else {
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: `
                    <p style="color: #666; font-size: 16px; line-height: 1.6;">
                        Something went wrong. Please try again or contact us directly.
                    </p>
                `,
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#dc3545',
                draggable: true
            });
        }
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            html: `
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Something went wrong. Please try again or contact us directly.
                </p>
            `,
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#dc3545',
            draggable: true
        });
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});