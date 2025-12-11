
        function openJobDetail(jobId) {
            sessionStorage.setItem('selectedJobId', jobId);
            window.open('job.html', '_blank');
        }

        // Smooth scroll for CTA button
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#hiring-section').scrollIntoView({
                behavior: 'smooth'
            });
        });



        // navigation to Google Form
        function openFutureOpportunitiesForm() {
            const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScwhIBEMiJg2SgHi2hKl8sOekz0zt7BaGDr4ppDC7WVHv7MlQ/viewform?usp=preview';
            window.open(googleFormUrl, '_blank');
        }