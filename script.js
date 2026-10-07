/* =========================================================
   PORTFOLIO SCRIPT — CHAYA.DEV
   Sections:
   1. Theme Toggle (Auto-Detection + Persistent Mode)
   2. Vertical Sidebar Navigation (Accessible Drawer & ScrollSpy)
   3. ScrollSpy (Active Link Highlighting)
   4. Project Modal
   5. AI Chat Engine (Simulated — API Integration Ready)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------------------------------
    // 1. THEME CONTROLS & BROWSER PREFERENCE DETECTION
    // ---------------------------------------------------------
    const rootElement = document.documentElement;
    const sidebarThemeBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle-btn');
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return systemThemeQuery.matches ? 'dark' : 'light';
    }

    function updateThemeUI(theme) {
        const isDark = theme === 'dark';

        if (sidebarThemeBtn) {
            const icon = sidebarThemeBtn.querySelector('.theme-icon');
            const label = sidebarThemeBtn.querySelector('.theme-toggle-label');
            if (icon) icon.textContent = isDark ? '🌙' : '☀️';
            if (label) label.textContent = isDark ? 'NIGHT' : 'DAY';
            sidebarThemeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        }

        if (mobileThemeBtn) {
            const mobileIcon = mobileThemeBtn.querySelector('.theme-icon');
            if (mobileIcon) mobileIcon.textContent = isDark ? '🌙' : '☀️';
            mobileThemeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        }
    }

    function applyTheme(theme, isUserAction = false) {
        rootElement.setAttribute('data-theme', theme);
        updateThemeUI(theme);
        if (isUserAction) localStorage.setItem('theme-preference', theme);
    }

    applyTheme(getPreferredTheme(), false);

    // ---------------------------------------------------------
    // 1b. SCROLL-REVEAL — IntersectionObserver
    // Watches elements with .reveal or .reveal-stagger class and
    // adds .visible once they enter the viewport, triggering the
    // CSS opacity/transform transition defined in style.css.
    // ---------------------------------------------------------
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after reveal so animation fires once
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,    // 12% of element must be visible to trigger
            rootMargin: '0px 0px -40px 0px'  // trigger slightly before bottom edge
        }
    );

    // Observe all .reveal and .reveal-stagger elements
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
        revealObserver.observe(el);
    });

    function toggleThemeAction() {
        const current = rootElement.getAttribute('data-theme') || (systemThemeQuery.matches ? 'dark' : 'light');
        applyTheme(current === 'dark' ? 'light' : 'dark', true);
    }

    if (sidebarThemeBtn) sidebarThemeBtn.addEventListener('click', toggleThemeAction);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleThemeAction);

    systemThemeQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme-preference')) {
            applyTheme(e.matches ? 'dark' : 'light', false);
        }
    });


    // ---------------------------------------------------------
    // 2. VERTICAL SIDEBAR DRAWER (MOBILE & ACCESSIBILITY)
    // ---------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');

    function openSidebar() {
        document.body.classList.add('sidebar-open');
        if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
        if (sidebarCloseBtn) sidebarCloseBtn.focus();
    }

    function closeSidebar() {
        document.body.classList.remove('sidebar-open');
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.focus();
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            document.body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
        });
    }

    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) closeSidebar();
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                document.body.classList.remove('sidebar-open');
                if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });


    // ---------------------------------------------------------
    // 3. SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 140;
        let currentSectionId = '';

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            sidebarLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();


    // ---------------------------------------------------------
    // 4. PROJECT MODAL (if present)
    // ---------------------------------------------------------
    const modalSecondaryClose = document.getElementById('modal-secondary-close');
    if (modalSecondaryClose) {
        modalSecondaryClose.addEventListener('click', () => {
            const modal = document.getElementById('project-modal');
            if (modal) modal.hidden = true;
        });
    }


    // =========================================================
    // 5. AI CHAT ENGINE
    // =========================================================
    // This chat uses a keyword-matching simulation engine.
    //
    // ► HOW TO UPGRADE TO A REAL AI API:
    //   Replace the body of `fetchAIResponse(userMessage)` below
    //   with an actual API call. The rest of the UI logic
    //   (typing indicator, message rendering, etc.) stays the same.
    //
    //   Supported APIs: OpenAI GPT-4o, Google Gemini, Anthropic Claude
    //   See the `fetchAIResponse` function below for the exact swap point.
    // =========================================================

    // -- DOM References --
    const chatForm         = document.getElementById('chat-input-form');
    const chatInput        = document.getElementById('chat-input');
    const chatMessages     = document.getElementById('chat-messages');
    const typingIndicator  = document.getElementById('chat-typing-indicator');
    const clearBtn         = document.getElementById('chat-clear-btn');
    const suggestionChips  = document.querySelectorAll('.suggestion-chip');
    const sendBtn          = document.getElementById('chat-send-btn');

    if (!chatForm || !chatInput || !chatMessages) return; // Guard: exit if chat section not in DOM

    // -- State --
    let isBotThinking = false;
    let messageCount  = 0;

    // -- Utility: Escape HTML to prevent XSS --
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // -- Utility: Get current time as HH:MM --
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // -- Render a message bubble into the chat window --
    function appendMessage(text, sender) {
        // sender: 'user' | 'bot'
        messageCount++;
        const msgId = `chat-msg-${messageCount}`;

        const wrapper = document.createElement('div');
        wrapper.className = `chat-msg chat-msg-${sender}`;
        wrapper.id = msgId;

        const avatarEmoji = sender === 'user' ? '👤' : '🤖';
        const labelText   = sender === 'user' ? 'YOU' : 'CHAYA AI';
        const bubbleClass = sender === 'user' ? 'user-bubble' : 'bot-bubble';

        wrapper.innerHTML = `
            <span class="chat-avatar ${sender}-avatar" aria-hidden="true">${avatarEmoji}</span>
            <div class="chat-bubble ${bubbleClass}">
                <p class="chat-bubble-text">
                    <span class="chat-sender-label">${labelText}</span>
                    ${escapeHtml(text)}
                </p>
                <span class="chat-timestamp" aria-label="Message time">${getCurrentTime()}</span>
            </div>
        `;

        chatMessages.appendChild(wrapper);
        scrollToBottom();
        return wrapper;
    }

    // -- Append bot message with inline HTML (for rich formatting) --
    function appendBotRichMessage(htmlContent) {
        messageCount++;
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg chat-msg-bot';
        wrapper.id = `chat-msg-${messageCount}`;
        wrapper.innerHTML = `
            <span class="chat-avatar bot-avatar" aria-hidden="true">🤖</span>
            <div class="chat-bubble bot-bubble">
                <p class="chat-bubble-text">
                    <span class="chat-sender-label">CHAYA AI</span>
                    ${htmlContent}
                </p>
                <span class="chat-timestamp">${getCurrentTime()}</span>
            </div>
        `;
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    // -- Auto-scroll chat messages area to bottom --
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // -- Show / hide typing indicator --
    function showTyping() {
        if (typingIndicator) typingIndicator.hidden = false;
        scrollToBottom();
    }

    function hideTyping() {
        if (typingIndicator) typingIndicator.hidden = true;
    }

    // -- Disable/enable send button + input while bot is thinking --
    function setInputLocked(locked) {
        isBotThinking = locked;
        if (chatInput) chatInput.disabled = locked;
        if (sendBtn)   sendBtn.disabled   = locked;
        if (sendBtn)   sendBtn.classList.toggle('loading', locked);
    }

    // =========================================================
    // SIMULATED RESPONSE ENGINE
    // This function maps user input to pre-written replies.
    //
    // ► API_INTEGRATION_POINT:
    //   To replace this with a real AI, modify `fetchAIResponse`
    //   below so it calls your LLM API instead of `getSimulatedReply`.
    //   The `appendBotRichMessage` + typing indicator flow stays the same.
    // =========================================================
    const knowledgeBase = [
        {
            keywords: ['skill', 'tech', 'stack', 'language', 'know', 'technologies'],
            reply: `My core stack includes:<br><br>
                    ⚡ <strong>Languages:</strong> Java, Python, JavaScript (ES6+), C<br>
                    🎨 <strong>Frontend:</strong> HTML5, CSS3, Responsive Design, DOM APIs<br>
                    🗄️ <strong>Databases:</strong> MySQL, Database Design<br>
                    🛠️ <strong>Tools:</strong> Git, GitHub, Linux, REST APIs<br>
                    🧩 <strong>CS Fundamentals:</strong> DSA, OOP, OS, Multi-Threading`
        },
        {
            keywords: ['project', 'work', 'built', 'portfolio', 'gramsetu', 'algovis', 'cloudtask', 'arcade'],
            reply: `Here are Chaya's featured projects:<br><br>
                    🌾 <strong>GramSetu</strong> — Rural community platform bridging digital gaps for rural India<br>
                    📊 <strong>AlgoVis</strong> — Real-time algorithm visualizer with step-by-step execution<br>
                    ☁️ <strong>CloudTask</strong> — Cloud-native task manager with role-based access<br>
                    🕹️ <strong>Pixel Arcade</strong> — Collection of browser-based mini games<br><br>
                    Scroll up to the Projects section for full details and demos!`
        },
        {
            keywords: ['hire', 'available', 'opportunity', 'job', 'work with', 'freelance', 'recruit'],
            reply: `Chaya is <strong>actively open to opportunities</strong>! 🚀<br><br>
                    Whether it's full-time roles, internships, or freelance projects — feel free to reach out.<br><br>
                    📧 <strong>chayaschayas713@gmail.com</strong><br>
                    💼 <a href="#contact" style="color:var(--accent-primary)">Use the Contact form below ↓</a>`
        },
        {
            keywords: ['contact', 'email', 'reach', 'message', 'connect', 'linkedin'],
            reply: `You can reach Chaya through multiple channels:<br><br>
                    📧 <strong>Email:</strong> chayaschayas713@gmail.com<br>
                    💼 <strong>LinkedIn:</strong> linkedin.com/in/chaya-s-370a84392<br>
                    🐙 <strong>GitHub:</strong> github.com/chaya-s-370a84392<br>
                    📝 Or use the <a href="#contact" style="color:var(--accent-primary)">Contact form below ↓</a>`
        },
        {
            keywords: ['hello', 'hi', 'hey', 'greet', 'howdy', 'sup', 'hola'],
            reply: `Hello, Traveler! 👾 Welcome to Chaya's portfolio terminal.<br><br>
                    You can ask me about her <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, how to <strong>hire her</strong>, or anything else. What quest brings you here today?`
        },
        {
            keywords: ['resume', 'cv', 'download', 'pdf'],
            reply: `Chaya's resume is available for download! 📄<br><br>
                    Click the <strong>"RESUME"</strong> button in the Hero section at the top of the page, or use the download button in the About section.<br><br>
                    You'll get a PDF with her full experience, education, and skills.`
        },
        {
            keywords: ['backend', 'server', 'api', 'database', 'java', 'python', 'rest'],
            reply: `Chaya has solid backend experience, including:<br><br>
                    ☕ <strong>Java</strong> — OOP, multi-threading, data structures<br>
                    🐍 <strong>Python</strong> — scripting, automation, algorithms<br>
                    🔌 <strong>REST APIs</strong> — design, integration, documentation<br>
                    🗄️ <strong>MySQL</strong> — schema design, complex queries, normalization<br>
                    🏗️ <strong>Architecture</strong> — clean code, SOLID principles, system design`
        },
        {
            keywords: ['frontend', 'ui', 'design', 'css', 'html', 'javascript', 'web'],
            reply: `Chaya builds pixel-perfect, accessible UIs! 🎨<br><br>
                    ✅ HTML5 semantic markup<br>
                    ✅ Vanilla CSS (animations, grid, flexbox, custom properties)<br>
                    ✅ JavaScript ES6+ (DOM manipulation, event handling, async)<br>
                    ✅ Responsive & mobile-first design<br>
                    ✅ Web Accessibility (ARIA, keyboard navigation)`
        },
        {
            keywords: ['education', 'degree', 'college', 'university', 'study', 'studied', 'qualification'],
            reply: `Chaya has a strong academic foundation in Computer Science, covering:<br><br>
                    📚 Data Structures & Algorithms<br>
                    🧮 Object-Oriented Programming<br>
                    💽 Operating Systems & Multi-threading<br>
                    🗃️ Database Management Systems<br>
                    🌐 Computer Networks<br><br>
                    Her academics are backed by hands-on project work across full-stack domains.`
        },
        {
            keywords: ['fun', 'hobby', 'interest', 'outside', 'personal', 'about you', 'yourself'],
            reply: `Fun fact about Chaya! 🎮<br><br>
                    Beyond code, she's obsessed with:<br>
                    👾 8-bit & retro pixel art aesthetics (obviously — look at this portfolio!)<br>
                    🧩 Algorithm puzzles & LeetCode grinding<br>
                    📖 Software architecture books<br>
                    ☕ Fueling late-night coding sessions with strong coffee<br>
                    🌐 Exploring open web standards<br><br>
                    She believes great software is a craft, not just a job.`
        },
        {
            keywords: ['github', 'code', 'repo', 'repository', 'open source', 'source'],
            reply: `Check out Chaya's GitHub for source code and projects! 🐙<br><br>
                    🔗 <strong>github.com/chaya-s-370a84392</strong><br><br>
                    You'll find her project repositories, contributions, and commit history there.`
        },
        {
            keywords: ['experience', 'year', 'how long', 'senior', 'junior', 'level'],
            reply: `Chaya is a driven software engineer with experience across full-stack development.<br><br>
                    She's worked on:<br>
                    🏗️ End-to-end web applications (frontend + backend + DB)<br>
                    🧪 Algorithm-heavy systems with clean OOP architecture<br>
                    ☁️ Cloud-native app design patterns<br>
                    🤝 Collaborative, agile team workflows with Git & code reviews<br><br>
                    Classified as: <strong>LVL 99 Engineer, Class: FULL-STACK</strong> 🎖️`
        }
    ];

    // Default fallback replies (randomly chosen)
    const fallbackReplies = [
        `Hmm, I'm not sure about that one — I'm still a <strong>simulation</strong> after all! 🤖<br>For a detailed answer, <a href="#contact" style="color:var(--accent-primary)">contact Chaya directly ↓</a>`,
        `That's outside my knowledge base. Try asking about <strong>skills, projects, or how to hire Chaya</strong>! Or <a href="mailto:chayaschayas713@gmail.com" style="color:var(--accent-primary)">email her directly</a>.`,
        `Command not recognized! 📡 Try a different query — I know all about Chaya's tech stack, projects, and experience. Or use the chips below for quick questions!`
    ];

    // -- Match user query against knowledge base --
    function getSimulatedReply(query) {
        const normalised = query.toLowerCase();

        for (const entry of knowledgeBase) {
            if (entry.keywords.some(kw => normalised.includes(kw))) {
                return { html: entry.reply };
            }
        }

        // No match → random fallback
        const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
        return { html: fallback };
    }

    // =========================================================
    // ► API_INTEGRATION_POINT — fetchAIResponse()
    //
    // Currently this function calls `getSimulatedReply()` which
    // uses keyword matching. To upgrade to a real AI:
    //
    // OPTION A — OpenAI GPT-4o:
    // ---------------------------------------------------
    // async function fetchAIResponse(userMessage) {
    //     const OPENAI_API_KEY = 'sk-YOUR_KEY_HERE'; // ← store securely, not in client JS!
    //     const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${OPENAI_API_KEY}`
    //         },
    //         body: JSON.stringify({
    //             model: 'gpt-4o',
    //             messages: [
    //                 { role: 'system', content: 'You are Chaya S, a full-stack software engineer. Answer questions about your skills, projects, and experience in a friendly, concise way.' },
    //                 { role: 'user',   content: userMessage }
    //             ],
    //             max_tokens: 300
    //         })
    //     });
    //     const data = await response.json();
    //     return { html: escapeHtml(data.choices[0].message.content) };
    // }
    //
    // OPTION B — Google Gemini API:
    // ---------------------------------------------------
    // async function fetchAIResponse(userMessage) {
    //     const GEMINI_API_KEY = 'YOUR_GEMINI_KEY';
    //     const response = await fetch(
    //         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    //         {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] })
    //         }
    //     );
    //     const data = await response.json();
    //     return { html: escapeHtml(data.candidates[0].content.parts[0].text) };
    // }
    //
    // ⚠️  SECURITY NOTE: Never expose API keys in client-side JS for production!
    //     Route calls through your own backend endpoint or serverless function instead.
    //
    // =========================================================
    async function fetchAIResponse(userMessage) {
        // --- SIMULATION MODE (replace this block with an API call above) ---
        return new Promise((resolve) => {
            // Simulate network latency (600ms – 1400ms)
            const delay = 600 + Math.random() * 800;
            setTimeout(() => {
                resolve(getSimulatedReply(userMessage));
            }, delay);
        });
        // --- END SIMULATION MODE ---
    }

    // -- Core: handle sending a message --
    async function handleSendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed || isBotThinking) return;

        // 1. Render user message
        appendMessage(trimmed, 'user');
        chatInput.value = '';

        // 2. Lock input & show typing indicator
        setInputLocked(true);
        showTyping();

        try {
            // 3. Fetch response (simulated or real API)
            const { html } = await fetchAIResponse(trimmed);

            // 4. Hide typing & render bot reply
            hideTyping();
            appendBotRichMessage(html);

        } catch (err) {
            hideTyping();
            appendBotRichMessage(`⚠️ Connection error. Please <a href="#contact" style="color:var(--accent-primary)">contact Chaya directly</a>.`);
            console.error('[ChatEngine] fetchAIResponse error:', err);
        } finally {
            // 5. Unlock input
            setInputLocked(false);
            chatInput.focus();
        }
    }

    // -- Form submit handler --
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage(chatInput.value);
    });

    // -- Suggestion chip click handler --
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (isBotThinking) return;
            const query = chip.getAttribute('data-query');
            if (query) handleSendMessage(query);
        });
    });

    // -- Clear chat history --
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (isBotThinking) return;

            // Remove all dynamic messages (keep welcome message)
            const allMsgs = chatMessages.querySelectorAll('.chat-msg:not(#chat-welcome-msg)');
            allMsgs.forEach(m => m.remove());

            messageCount = 0;

            // Append a cleared confirmation
            appendBotRichMessage(`🗑️ Chat history cleared. Ask me anything about Chaya — skills, projects, availability, and more!`);

            chatInput.focus();
        });
    }

    // -- Enter key sends message, Shift+Enter = newline (if textarea used in future) --
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // -- Auto-scroll on load to bottom of welcome message --
    scrollToBottom();

}); // end DOMContentLoaded
