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

    // 7. Status Bar Updates
    function updateStatusBar() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }

    // Update time immediately and every minute
    updateStatusBar();
    setInterval(updateStatusBar, 60000);

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
    // DISK DEFRAGMENTER LOGIC
    // ==========================================
    const driveMap = document.getElementById('driveMap');
    const sectorDetails = document.getElementById('sectorDetails');
    const defragStatus = document.getElementById('defragStatus');
    const defragProgress = document.getElementById('defragProgress');

    // Skills Data
    const skills = [
        // IT & Infrastructure (Blue)
        { type: 'optimized', name: 'Wireless Connectivity (IEEE 802.11)', detail: 'Implemented last-mile connectivity for remote locations.' },
        { type: 'optimized', name: 'MikroTik Routing', detail: 'Advanced configuration for optimized bandwidth management.' },
        { type: 'optimized', name: 'Ubiquiti Networks', detail: 'Deployment of point-to-point and mesh network systems.' },
        { type: 'optimized', name: 'Hardware Refurbishment', detail: 'Restoring legacy hardware for cost-effective deployment.' },
        { type: 'optimized', name: 'System Administration', detail: 'Managing local ISP infrastructure and user databases.' },
        { type: 'optimized', name: 'Network Diagnostics', detail: 'Troubleshooting physical and logical network layers.' },

        // Creative (Orange)
        { type: 'fragmented', name: 'Video Production', detail: 'End-to-end production using Premiere Pro and DaVinci Resolve.' },
        { type: 'fragmented', name: 'Film Photography', detail: 'Analog workflow: Nikon EM, Minox, developing & scanning.' },
        { type: 'fragmented', name: 'Digital Photography', detail: 'Event and portrait photography with Nikon ecosystem.' },
        { type: 'fragmented', name: 'Visual Storytelling', detail: 'Translating technical concepts into human narratives.' },
        { type: 'fragmented', name: 'Technical Writing', detail: 'Documentation and feasibility studies for telecom projects.' },

        // Core (Green)
        { type: 'system', name: 'Problem Solving', detail: 'Diagnosing root causes in complex technical systems.' },
        { type: 'system', name: 'Strategic Planning', detail: 'Feasibility studies and infrastructure optimization.' },
        { type: 'system', name: 'Adaptability', detail: 'Pivoting from hardware to ISP services to CS degree.' },
        { type: 'system', name: 'Computer Science', detail: 'UofT: Algorithms, Data Structures, LLMs.' }
    ];

    // Generate Blocks
    const totalBlocks = 250; // Total grid size
    let blocksGenerated = false;

    function initDefrag() {
        if (blocksGenerated || !driveMap) return;

        driveMap.innerHTML = '';

        // Create an array with skills distributed
        let blockArray = new Array(totalBlocks).fill({ type: 'free', name: 'Free Space', detail: 'Available for future learning.' });

        // Distribute skills randomly but clustered
        skills.forEach(skill => {
            // Assign each skill to ~3-5 blocks to make them visible
            const count = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < count; i++) {
                // Find a random free spot
                let index;
                do {
                    index = Math.floor(Math.random() * totalBlocks);
                } while (blockArray[index].type !== 'free');

                blockArray[index] = skill;
            }
        });

        // Render Blocks
        blockArray.forEach((data, index) => {
            const block = document.createElement('div');
            block.className = `defrag-block type-${data.type}`;
            block.dataset.index = index;

            // Hover Event
            block.addEventListener('mouseenter', () => {
                sectorDetails.textContent = `Sector ${index}: ${data.name} - ${data.detail}`;
                sectorDetails.style.color = data.type === 'free' ? '#888' : '#000';
            });

            driveMap.appendChild(block);
        });

        blocksGenerated = true;
        runDefragAnimation();
    }

    function runDefragAnimation() {
        if (!defragStatus) return;

        defragStatus.textContent = "Defragmenting...";
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            if (defragProgress) defragProgress.style.width = `${progress}%`;

            // Randomly flash a "reading" block
            const blocks = document.querySelectorAll('.defrag-block');
            const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
            const originalType = randomBlock.className;

            randomBlock.className = 'defrag-block type-reading';
            setTimeout(() => {
                randomBlock.className = originalType;
            }, 50);

            if (progress >= 100) {
                clearInterval(interval);
                defragStatus.textContent = "Optimization Complete";
                if (defragProgress) defragProgress.style.width = '100%';
            }
        }, 30);
    }

    // Trigger Defrag when visible
    const defragSection = document.getElementById('expertise');
    if (defragSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initDefrag();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(defragSection);
    }
});
