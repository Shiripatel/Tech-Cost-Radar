/* ==========================================================================
   AI Cost Radar — Landing Page JavaScript
   Counter animations, Intersection Observer scroll reveals, hero chart,
   navbar scroll effect, mobile hamburger toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ===== Navbar scroll effect =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ===== Mobile hamburger toggle =====
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // ===== Animated counter =====
    function animateCounter(el, target, suffix) {
        const duration = 2000;
        const startTime = performance.now();
        const startVal = 0;

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + (target - startVal) * ease);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    // ===== Intersection Observer for scroll-triggered animations =====
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

    // Problem cards — fade in
    const problemCards = document.querySelectorAll('.problem-card');
    const problemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 120);
                problemObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    problemCards.forEach(card => problemObserver.observe(card));

    // Counter elements — animate when visible
    const counterEls = document.querySelectorAll('[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'), 10);
                animateCounter(entry.target, target, '');
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    counterEls.forEach(el => counterObserver.observe(el));

    // Generic fade-in for cards
    const fadeTargets = document.querySelectorAll('.bento-card, .step-card, .integ-card, .metric-card');
    fadeTargets.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    fadeTargets.forEach(el => fadeObserver.observe(el));

    // ===== Hero Chart (mini spend chart) =====
    const heroCtx = document.getElementById('heroChart');
    if (heroCtx) {
        new Chart(heroCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                    {
                        label: 'AI Spend',
                        data: [8200, 11400, 14100, 18500, 16900, 22300, 28600],
                        borderColor: '#818cf8',
                        backgroundColor: 'rgba(129,140,248,0.08)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        borderWidth: 2,
                    },
                    {
                        label: 'Cloud Infra',
                        data: [12000, 12800, 13100, 14200, 14800, 15400, 16100],
                        borderColor: 'rgba(255,255,255,0.15)',
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        borderWidth: 1.5,
                        borderDash: [4, 3],
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        display: true,
                        ticks: { color: 'rgba(255,255,255,0.2)', font: { size: 9, family: "'JetBrains Mono'" } },
                        grid: { display: false },
                        border: { display: false },
                    },
                    y: {
                        display: false,
                        grid: { display: false },
                    }
                },
                interaction: { intersect: false, mode: 'index' },
            }
        });
    }

    // ===== Bento Chart 1 (cost analytics mini chart) =====
    const bentoCtx = document.getElementById('bentoChart1');
    if (bentoCtx) {
        new Chart(bentoCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Eng', 'Support', 'Mktg', 'Ops', 'Legal', 'Finance'],
                datasets: [
                    {
                        label: 'GPT-4o',
                        data: [18500, 12200, 8800, 6200, 2100, 1800],
                        backgroundColor: '#818cf8',
                        borderRadius: 3,
                        barPercentage: 0.7,
                    },
                    {
                        label: 'Claude',
                        data: [14200, 8100, 4200, 3800, 1200, 900],
                        backgroundColor: 'rgba(244,114,182,0.6)',
                        borderRadius: 3,
                        barPercentage: 0.7,
                    },
                    {
                        label: 'Gemini',
                        data: [4100, 6900, 2100, 5200, 800, 400],
                        backgroundColor: 'rgba(34,197,94,0.5)',
                        borderRadius: 3,
                        barPercentage: 0.7,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: 'rgba(255,255,255,0.4)',
                            font: { size: 9, family: "'JetBrains Mono'" },
                            boxWidth: 8,
                            boxHeight: 8,
                            padding: 10,
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: { color: 'rgba(255,255,255,0.25)', font: { size: 9, family: "'JetBrains Mono'" } },
                        grid: { display: false },
                        border: { display: false },
                    },
                    y: {
                        stacked: true,
                        display: false,
                    }
                }
            }
        });
    }

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
