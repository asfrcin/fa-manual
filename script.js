// ===================================
// NAVIGATION & INTERACTION
// ===================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Update Current Date
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = new Date().getFullYear();
    }

    // 2. Smooth Scrolling for TOC Links
    const tocLinks = document.querySelectorAll('.toc-link');

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Add offset for fixed header
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Active Chapter Highlighter (Intersection Observer)
    const chapters = document.querySelectorAll('.chapter');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when chapter is near top
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chapterId = entry.target.getAttribute('id');
                updateActiveLink(chapterId);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    chapters.forEach(chapter => {
        observer.observe(chapter);
    });

    function updateActiveLink(chapterId) {
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${chapterId}`) {
                link.classList.add('active');
            }
        });
    }

    // 4. Scroll Reveal Animations (Refined with stagger)
    const revealElements = document.querySelectorAll('.expertise-item, .connect-link');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Stagger delay
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Wizard Navigation
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const wizardBack = document.getElementById('wizardBack');
    const wizardNext = document.getElementById('wizardNext');
    const currentStepSpan = document.getElementById('currentStep');
    let currentStep = 1;
    const totalSteps = wizardSteps.length;

    function updateWizard() {
        // Hide all steps
        wizardSteps.forEach(step => step.classList.remove('active'));

        // Show current step
        const activeStep = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        if (activeStep) {
            activeStep.classList.add('active');
        }

        // Update step indicator
        if (currentStepSpan) {
            currentStepSpan.textContent = currentStep;
        }

        // Update button states
        if (wizardBack) {
            wizardBack.disabled = currentStep === 1;
        }
        if (wizardNext) {
            // Always enabled to allow scrolling on last step
            wizardNext.disabled = false;

            // Change text on last step
            if (currentStep === totalSteps) {
                wizardNext.textContent = "Finish →";
            } else {
                wizardNext.textContent = "Next →";
            }
        }
    }

    if (wizardNext) {
        wizardNext.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateWizard();
            } else {
                // Scroll to expertise section on finish
                const expertiseSection = document.getElementById('expertise');
                if (expertiseSection) {
                    expertiseSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    if (wizardBack) {
        wizardBack.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizard();
            }
        });
    }

    // Initialize wizard
    if (wizardSteps.length > 0) {
        updateWizard();
    }

    // 6. Grid Animation on Scroll
    const gridOverlay = document.querySelector('.grid-overlay');
    const expertiseSection = document.getElementById('expertise');

    if (gridOverlay && expertiseSection) {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gridOverlay.classList.add('active');
                } else {
                    gridOverlay.classList.remove('active');
                }
            });
        }, {
            threshold: 0.1
        });

        gridObserver.observe(expertiseSection);
    }

    // Helper class for visible state
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 7. Status Bar & Taskbar Updates
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes} ${ampm}`;

        // Update Status Bar (if exists)
        const statusBarTime = document.getElementById('currentTime');
        if (statusBarTime) {
            statusBarTime.textContent = `${String(now.getHours()).padStart(2, '0')}:${minutes}`;
        }

        // Update Taskbar Clock
        const taskbarTime = document.getElementById('taskbarTime');
        if (taskbarTime) {
            taskbarTime.textContent = timeString;
        }
    }

    // Update time immediately and every minute
    updateTime();
    setInterval(updateTime, 60000);

    // Update current section in status bar
    function updateSection(chapterId) {
        const sectionElement = document.getElementById('currentSection');
        if (sectionElement) {
            const chapterNumber = chapterId === 'cover' ? '00' :
                chapterId === 'profile' ? '01' :
                    chapterId === 'expertise' ? '02' :
                        chapterId === 'connect' ? '03' : '00';
            sectionElement.textContent = `SECTION: ${chapterNumber}`;
        }
    }

    // Update section when chapter changes
    const originalUpdateActiveLink = updateActiveLink;
    updateActiveLink = function (chapterId) {
        originalUpdateActiveLink(chapterId);
        updateSection(chapterId);
    };

    // 8. ESC Key to scroll to top
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // ==========================================
    // SYSTEM PROPERTIES LOGIC
    // ==========================================
    const sysTabs = document.querySelectorAll('.sys-tab');
    const sysPanes = document.querySelectorAll('.sys-pane');

    if (sysTabs.length > 0) {
        sysTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                sysTabs.forEach(t => t.classList.remove('active'));
                sysPanes.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding pane
                const tabId = tab.getAttribute('data-tab');
                const pane = document.getElementById(tabId);
                if (pane) {
                    pane.classList.add('active');
                }
            });
        });
    }
});
