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
    // WINDOW MANAGER LOGIC
    // ==========================================

    const desktopEnv = document.getElementById('desktopEnv');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    let zIndexCounter = 100;
    let windowOffset = 0; // Stagger new windows

    // Window Content Definitions
    const windowContents = {
        'computer': {
            title: 'System Properties',
            icon: 'computer_explorer-4.png',
            type: 'sys-prop',
            width: '600px',
            height: '450px',
            body: `
                <div class="sys-prop-tabs">
                    <button class="sys-tab active" data-tab="general">General</button>
                    <button class="sys-tab" data-tab="hardware">Hardware</button>
                    <button class="sys-tab" data-tab="performance">Performance</button>
                </div>
                <div class="sys-prop-content">
                    <!-- Tab 1: General -->
                    <div class="sys-pane active" id="general">
                        <div class="sys-info-grid">
                            <div class="sys-icon-large"><img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png"></div>
                            <div class="sys-info-text">
                                <p><strong>System:</strong></p><p>Francis Amante</p><p>Copyright © 2024</p><br>
                                <p><strong>Computer:</strong></p><p>UofT Computer Science</p><p>Strategic Planning</p><p>Problem Solving</p>
                            </div>
                        </div>
                    </div>
                    <!-- Tab 2: Hardware -->
                    <div class="sys-pane" id="hardware">
                        <div class="dev-mgr-list">
                            <div class="dev-node"><span class="dev-icon">🖧</span><strong>Network Adapters</strong><ul><li>Wireless Connectivity (IEEE 802.11)</li><li>MikroTik Routing Systems</li><li>Ubiquiti Networks Infrastructure</li></ul></div>
                            <div class="dev-node"><span class="dev-icon">💻</span><strong>System Devices</strong><ul><li>Hardware Refurbishment</li><li>System Administration</li><li>Network Diagnostics</li></ul></div>
                        </div>
                    </div>
                    <!-- Tab 3: Performance -->
                    <div class="sys-pane" id="performance">
                        <div class="perf-settings">
                            <fieldset><legend>Graphics</legend><div class="perf-row"><img src="https://win98icons.alexmeub.com/icons/png/video_-0.png"><div><strong>Video Production</strong><p>Premiere Pro, DaVinci Resolve</p></div></div></fieldset>
                            <fieldset><legend>Imaging Devices</legend><div class="perf-row"><img src="https://win98icons.alexmeub.com/icons/png/camera-2.png"><div><strong>Photography</strong><p>Analog (Nikon EM) & Digital</p></div></div></fieldset>
                            <fieldset><legend>Documentation</legend><div class="perf-row"><img src="https://win98icons.alexmeub.com/icons/png/notepad-5.png"><div><strong>Technical Writing</strong><p>Visual Storytelling & Feasibility Studies</p></div></div></fieldset>
                        </div>
                    </div>
                </div>
                <div class="sys-prop-footer">
                    <button class="sys-btn close-win-btn">OK</button>
                    <button class="sys-btn close-win-btn">Cancel</button>
                    <button class="sys-btn" disabled>Apply</button>
                </div>
            `
        },
        'network': {
            title: 'Network Neighborhood',
            icon: 'network_neighborhood-4.png',
            type: 'explorer',
            width: '500px',
            height: '300px',
            body: `
                <div style="padding: 10px;">
                    <p><strong>Network Connections:</strong></p>
                    <ul style="list-style: none; padding-left: 10px; margin-top: 10px;">
                        <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            <img src="https://win98icons.alexmeub.com/icons/png/network_connection-0.png" width="16">
                            <span><strong>Local ISP Infrastructure</strong><br><span style="font-size: 0.8rem; color: #666;">Designed routing for remote towns.</span></span>
                        </li>
                        <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            <img src="https://win98icons.alexmeub.com/icons/png/network_connection-0.png" width="16">
                            <span><strong>Mesh Networks</strong><br><span style="font-size: 0.8rem; color: #666;">Deployed Ubiquiti systems.</span></span>
                        </li>
                    </ul>
                </div>
            `
        },
        'documents': {
            title: 'My Documents',
            icon: 'directory_open_file_mydocs-4.png',
            type: 'explorer',
            width: '500px',
            height: '300px',
            body: `
                <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 10px;">
                    <div style="text-align: center; width: 80px;">
                        <img src="https://win98icons.alexmeub.com/icons/png/video_-0.png" width="32"><br>
                        <span style="font-size: 0.8rem;">Film_Project.mp4</span>
                    </div>
                    <div style="text-align: center; width: 80px;">
                        <img src="https://win98icons.alexmeub.com/icons/png/camera-2.png" width="32"><br>
                        <span style="font-size: 0.8rem;">Photos.zip</span>
                    </div>
                    <div style="text-align: center; width: 80px;">
                        <img src="https://win98icons.alexmeub.com/icons/png/notepad-5.png" width="32"><br>
                        <span style="font-size: 0.8rem;">Thesis.txt</span>
                    </div>
                </div>
            `
        },
        'recycle': {
            title: 'Recycle Bin',
            icon: 'recycle_bin_empty-4.png',
            type: 'explorer',
            width: '400px',
            height: '250px',
            body: `
                <div style="padding: 10px;">
                    <p><strong>Deleted Items:</strong></p>
                    <ul style="list-style: none; padding-left: 10px; margin-top: 10px;">
                        <li style="margin-bottom: 5px; color: #888;">Adobe Flash Player</li>
                        <li style="margin-bottom: 5px; color: #888;">Internet Explorer 6</li>
                        <li style="margin-bottom: 5px; color: #888;">My Myspace Page</li>
                    </ul>
                </div>
            `
        }
    };

    function openWindow(key) {
        const config = windowContents[key];
        if (!config) return;

        // Create Window DOM
        const win = document.createElement('div');
        win.className = `window window-${config.type} active`;
        win.style.width = config.width;
        win.style.height = config.height;
        win.style.left = `${50 + windowOffset}px`;
        win.style.top = `${50 + windowOffset}px`;
        win.style.zIndex = ++zIndexCounter;

        // Stagger next window
        windowOffset = (windowOffset + 30) % 150;

        win.innerHTML = `
            <div class="window-title-bar">
                <img src="https://win98icons.alexmeub.com/icons/png/${config.icon}" alt="icon">
                <span>${config.title}</span>
                <div class="window-controls">
                    <button class="window-btn close-btn">×</button>
                </div>
            </div>
            <div class="window-content">
                ${config.body}
            </div>
        `;

        // Append to Desktop
        desktopEnv.appendChild(win);

        // Add Event Listeners
        makeDraggable(win);

        // Close Button
        const closeBtns = win.querySelectorAll('.close-btn, .close-win-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent drag start
                win.remove();
            });
        });

        // Bring to front on click
        win.addEventListener('mousedown', () => {
            win.style.zIndex = ++zIndexCounter;
            document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
            win.classList.add('active');
        });

        // Initialize Tabs if SysProp
        if (config.type === 'sys-prop') {
            initTabs(win);
        }
    }

    function makeDraggable(el) {
        const titleBar = el.querySelector('.window-title-bar');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = el.offsetLeft;
            initialTop = el.offsetTop;
            el.style.zIndex = ++zIndexCounter; // Bring to front
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${initialLeft + dx}px`;
            el.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function initTabs(win) {
        const tabs = win.querySelectorAll('.sys-tab');
        const panes = win.querySelectorAll('.sys-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const paneId = tab.getAttribute('data-tab');
                const pane = win.querySelector(`#${paneId}`);
                if (pane) pane.classList.add('active');
            });
        });
    }

    // Desktop Icon Click Handlers
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const key = icon.getAttribute('data-window');
            openWindow(key);
        });
    });

    // Open "My Computer" by default on load (if visible)
    const windowManagerSection = document.getElementById('expertise');
    const windowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !document.querySelector('.window-sys-prop')) {
                // Only open if not already open
                setTimeout(() => openWindow('computer'), 500);
            }
        });
    }, { threshold: 0.3 });

    if (windowManagerSection) windowObserver.observe(windowManagerSection);

    // ==========================================
    // CONNECT PROTOCOL (DIAL-UP) LOGIC
    // ==========================================
    const dialBtn = document.getElementById('dialBtn');
    const dialStatus = document.getElementById('dialStatus');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBarFill = document.querySelector('.progress-bar-fill');
    const statusText = document.querySelector('.status-text');

    if (dialBtn) {
        dialBtn.addEventListener('click', () => {
            const userName = document.getElementById('userName').value;
            const userPass = document.getElementById('userPass').value;
            const userMsg = document.getElementById('userMsg').value;

            if (!userName || !userPass) {
                alert('User name and Password are required.');
                return;
            }

            // Start Dialing Sequence
            dialBtn.disabled = true;
            statusText.textContent = "Dialing...";
            progressBarContainer.style.display = 'block';

            // Simulation Steps
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 100) progress = 100;
                progressBarFill.style.width = `${progress}%`;

                if (progress > 30 && progress < 60) {
                    statusText.textContent = "Verifying user name and password...";
                } else if (progress > 60 && progress < 90) {
                    statusText.textContent = "Registering your computer on the network...";
                } else if (progress >= 100) {
                    clearInterval(interval);
                    statusText.textContent = "Connection Established.";
                    setTimeout(() => {
                        // Create Retro Message Box
                        const msgBox = document.createElement('div');
                        msgBox.className = 'window';
                        // Inline styles for centering within the connect container
                        msgBox.style.position = 'absolute';
                        msgBox.style.zIndex = '1000';
                        msgBox.style.width = '300px';
                        msgBox.style.left = '50%';
                        msgBox.style.top = '50%';
                        msgBox.style.transform = 'translate(-50%, -50%)';
                        msgBox.style.boxShadow = '4px 4px 10px rgba(0,0,0,0.5)';

                        msgBox.innerHTML = `
                            <div class="window-title-bar">
                                <img src="https://win98icons.alexmeub.com/icons/png/network_connection-0.png" alt="icon">
                                <span>Connection Established</span>
                                <div class="window-controls">
                                    <button class="window-btn close-msg-btn">×</button>
                                </div>
                            </div>
                            <div class="window-content" style="text-align: center; padding: 20px; background: #c0c0c0; border: none;">
                                <img src="https://win98icons.alexmeub.com/icons/png/msg_information-0.png" style="margin-bottom: 10px;">
                                <p style="margin-bottom: 5px;"><strong>Connected to Francis Amante</strong></p>
                                <p style="margin-bottom: 15px; font-size: 0.9rem;">Message sent successfully.</p>
                                <button class="sys-btn close-msg-btn" style="width: 80px;">OK</button>
                            </div>
                        `;

                        // Ensure container is positioned
                        const container = document.querySelector('.connect-container');
                        if (getComputedStyle(container).position === 'static') {
                            container.style.position = 'relative';
                        }
                        container.appendChild(msgBox);

                        // Add close handlers
                        msgBox.querySelectorAll('.close-msg-btn').forEach(btn => {
                            btn.addEventListener('click', () => msgBox.remove());
                        });

                        // Reset Form
                        dialBtn.disabled = false;
                        progressBarFill.style.width = '0%';
                        progressBarContainer.style.display = 'none';
                        statusText.textContent = "Ready to connect.";
                    }, 500);
                }
            }, 200);
        });
    }
});
