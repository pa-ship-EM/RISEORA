document.addEventListener('DOMContentLoaded', () => {
    const letterForm = document.getElementById('letterForm');
    const preview = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');

    if (letterForm) {
        letterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('userName').value;
            const ssn = document.getElementById('ssn').value;
            const address = document.getElementById('address').value;
            const bureau = document.getElementById('bureau').value;
            const reason = document.getElementById('reason').value;
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            const template = `
${date}

${name}
${address}
SSN (Last 4): ${ssn}

To:
${bureau}

To Whom It May Concern,

I am writing to formally dispute the following information appearing on my credit report. I have reason to believe this information is inaccurate or unverifiable under the Fair Credit Reporting Act (FCRA).

Inaccurate Item:
${reason}

Pursuant to the FCRA, please investigate these items and provide a response within 30 days. If the information cannot be verified, it must be removed from my file immediately.

Sincerely,

${name}
            `;

            preview.textContent = template.trim();
            preview.classList.add('active');
            downloadBtn.style.display = 'block';
            
            // Scroll to preview
            preview.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const text = preview.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = downloadBtn.textContent;
                downloadBtn.textContent = 'Copied!';
                downloadBtn.classList.add('btn-primary');
                downloadBtn.style.color = 'white';
                setTimeout(() => {
                    downloadBtn.textContent = originalText;
                    downloadBtn.classList.remove('btn-primary');
                    downloadBtn.style.color = '#333';
                }, 2000);
            });
        });
    }

    // Nav Background scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.9)';
        } else {
            nav.style.background = 'rgba(30, 41, 59, 0.7)';
        }
    });

    // Simple fade-in animations for cards on load
    const cards = document.querySelectorAll('.card, .module');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(card);
    });
});
