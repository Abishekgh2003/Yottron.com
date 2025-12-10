
        const jobsData = {
            'net-tech-lead': {
                title: '.NET Technical Lead',
                experience: '2+ Years',
                location: 'On-site',
                type: 'Full Time',
                salary: '8-15 LPA',
                email: 'hr@yottron.com',
                phone: '+91 98765 43210'
            },
            'business-analytics': {
                title: 'Business Analytics',
                experience: '2+ Years',
                location: 'Hybrid',
                type: 'Full Time',
                salary: '6-12 LPA',
                email: 'hr@yottron.com',
                phone: '+91 98765 43210'
            },
            'net-developer': {
                title: '.NET Developer fresher',
                experience: '0-1 Years',
                location: 'On-site',
                type: 'Full Time',
                salary: '3-6 LPA',
                email: 'hr@yottron.com',
                phone: '+91 98765 43210'
            },
            'android-developer': {
                title: 'Android Developer',
                experience: '2+ Years',
                location: 'On-site',
                type: 'Full Time',
                salary: '6-10 LPA',
                email: 'hr@yottron.com',
                phone: '+91 98765 43210'
            },
            'firmware-engineer': {
                title: 'Firmware Engineer',
                experience: '4+ Years',
                location: 'On-site',
                type: 'Full Time',
                salary: '8-14 LPA',
                email: 'hr@yottron.com',
                phone: '+91 98765 43210'
            },
            'hr-executive': {
                title: 'HR Executive',
                experience: '2+ Years',
                location: 'On-site',
                type: 'Full Time',
                salary: '4-7 LPA',
                email: 'hr@yottron.com',
                phone: '+91 98765 43210'
            },
            'sales-specialist-hms': {
                title: 'Sales Specialist (Hospital Management Software)',
                experience: '0-5 Years',
                location: 'Hybrid',
                type: 'Full Time',
                language: 'Hindi & English',
                salary: '6-12 LPA',
                email: 'careers@shmsolutions.in',
                phone: '+91 98765 43210',
                closing: 'Dec 22, 2025',
                posted: 'Nov 07, 2025'
            }
        };

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



        // Method 1: Direct navigation to Google Form
        function openFutureOpportunitiesForm() {
            // Replace this URL with your actual Google Form URL
            const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScwhIBEMiJg2SgHi2hKl8sOekz0zt7BaGDr4ppDC7WVHv7MlQ/viewform?usp=preview';
            
            // Option A: Open in new tab (recommended for better UX)
            window.open(googleFormUrl, '_blank');
            
            // Option B: Open in same tab
            // window.location.href = googleFormUrl;
        }