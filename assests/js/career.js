// Job Details Data
const jobsData = {
    'senior-net-developer': {
        title: 'Senior .NET Developer',
        experience: '6+ Years',
        badge: 'Full Time',
        description: 'We are seeking an accomplished .NET Developer with over 6 years of hands-on experience in building, optimizing, and maintaining enterprise-level applications using the Microsoft .NET ecosystem. The ideal candidate should demonstrate strong expertise in C#, ASP.NET, .NET Core, Web API, and SQL Server, along with sound knowledge of design patterns, architecture, and modern software development practices.',
        responsibilities: [
            'Develop and maintain applications using .NET Core, C#, and .NET Framework.',
            'Ensure code quality by following best practices, coding standards, and testing methodologies.',
            'Troubleshoot issues related to application performance, security, and scalability on Microsoft Azure platform.',
            'Collaborate with cross-functional teams to identify requirements and deliver high-quality software solutions.',
            'Design and implement RESTful APIs and Web Services.',
            'Mentor junior developers and provide technical guidance.',
            'Participate in code reviews and contribute to continuous improvement initiatives.'
        ]
    },
    'senior-tech-lead': {
        title: 'Senior Tech Lead (Full Stack)',
        experience: '5+ Years',
        badge: 'Full Time',
        description: 'We are looking for an experienced Senior Tech Lead with strong expertise in front-end, back-end, server, and database technologies. The ideal candidate should have AI knowledge and excellent team leadership skills to guide development teams in building scalable, high-performance applications.',
        responsibilities: [
            'Lead and mentor a team of developers in full-stack development.',
            'Design and implement scalable architecture for web applications.',
            'Work with front-end technologies like React, Angular, or Vue.js.',
            'Develop back-end services using Node.js, Python, or Java.',
            'Manage database design and optimization (SQL and NoSQL).',
            'Integrate AI/ML capabilities into applications.',
            'Ensure code quality, performance, and security standards.',
            'Collaborate with stakeholders to define technical requirements.'
        ]
    },
    'devops-engineer': {
        title: 'DevOps Engineer',
        experience: '1.5 - 2 Year',
        badge: 'Full Time',
        description: 'We are looking for a passionate and enthusiastic DevOps Engineer to join our growing team. This is an entry-level role, ideal for recent graduates or candidates with up to 1 year of experience who want to build their career in DevOps and cloud infrastructure.',
        responsibilities: [
            'Set up and maintain CI/CD pipelines using Jenkins, GitLab CI, or similar tools.',
            'Manage cloud infrastructure on AWS, Azure, or Google Cloud Platform.',
            'Containerize applications using Docker and orchestrate with Kubernetes.',
            'Monitor system performance and troubleshoot issues.',
            'Automate deployment processes and infrastructure provisioning.',
            'Implement security best practices in DevOps workflows.',
            'Collaborate with development teams to improve deployment efficiency.'
        ]
    },
    'flutter-developer': {
        title: 'Flutter Developer',
        experience: '2 years',
        badge: 'Full Time',
        description: 'We are looking for a passionate and skilled Flutter Developer to join our team and help build high-performance, beautiful, and scalable mobile applications for Android and iOS platforms using Flutter framework.',
        responsibilities: [
            'Develop cross-platform mobile applications using Flutter and Dart.',
            'Build reusable widgets and maintain clean code architecture.',
            'Integrate RESTful APIs and third-party services.',
            'Optimize app performance and ensure smooth user experience.',
            'Collaborate with UI/UX designers to implement pixel-perfect designs.',
            'Debug and fix issues across different devices and screen sizes.',
            'Stay updated with the latest Flutter and mobile development trends.',
            'Participate in code reviews and contribute to team knowledge sharing.'
        ]
    }
};

// Function to open job detail page
function openJobDetail(jobId) {
    console.log('Opening job:', jobId);
    
    // Store the selected job ID in sessionStorage
    sessionStorage.setItem('selectedJobId', jobId);
    
    // Redirect to job application page
    window.location.href = 'job.html';
}