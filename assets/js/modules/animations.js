/**
 * GSAP Animations Module
 */

export function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Prevent scrolling initially
    document.body.style.overflow = "hidden";

    // Initial state
    gsap.set(".hero-logo", { y: -20, opacity: 0 });
    gsap.set(".nav-links a", { y: -20, opacity: 0 });
    gsap.set(".btn-lets-talk", { y: -20, opacity: 0 });
    gsap.set(".hero-huge-title", { y: 60, opacity: 0, scale: 0.95 });
    gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
    gsap.set(".btn-lime", { y: 30, opacity: 0, scale: 0.9 });
    gsap.set(".hero-top-shape", { opacity: 0, y: -20, scale: 0 });

    const loaderTl = gsap.timeline({
        timeScale: 1.4,
        onComplete: () => {
            document.body.style.overflow = "";
            const loaderEl = document.getElementById("initial-loader");
            if (loaderEl) loaderEl.style.display = "none";
        }
    });

    gsap.set("#logo-border", { drawSVG: "0%" });
    gsap.set(".logo-letter", { opacity: 0, y: 10 });
    gsap.set(".loader-logo-container", { opacity: 1 });

    loaderTl.from(".loader-shape", {
        x: (i) => (i - 2) * 120,
        rotation: (i) => (Math.random() - 0.5) * 360,
        opacity: 0,
        scale: 0.2,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.1
    })
    .addLabel("morphStart", "-=0.2")
    .to("#logo-border", {
        drawSVG: "100%",
        duration: 1.2,
        ease: "power2.inOut"
    }, "morphStart-=0.3")
    .to(".loader-shape:not(.green-morph-shape)", {
        x: (i) => (Math.random() - 0.5) * 600,
        y: (i) => (Math.random() - 0.5) * 600,
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 0.8,
        ease: "power3.in"
    }, "morphStart")
    .to("#fig1", {
        duration: 1,
        morphSVG: "#figlogo",
        ease: "power3.inOut"
    }, "morphStart")
    .to(".green-morph-shape", {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "power3.inOut"
    }, "morphStart")
    .to(".green-morph-shape", { opacity: 0, duration: 0.1 }, "morphStart+=0.9")
    .to("#figlogo", { opacity: 1, duration: 0.1 }, "morphStart+=0.9")
    .to(".logo-letter", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)"
    }, "morphStart+=0.4")
    .addLabel("meltStart", "+=0.6")
    .to("#initial-loader", {
        backgroundColor: "#5A1FB2",
        duration: 0.6,
        ease: "power2.inOut"
    }, "meltStart")
    .to("#initial-loader", {
        yPercent: -100,
        opacity: 0,
        duration: 0.8,
        ease: "expo.inOut"
    }, "meltStart+=0.6");

    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    loaderTl.add(tl, "-=0.5");

    tl.to(".hero-logo", { y: 0, opacity: 1, duration: 0.8 })
        .to(".nav-links a, .btn-lets-talk", {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1
        }, "-=0.6")
        .fromTo(".hero-top-shape", {
            opacity: 0,
            y: -100,
            scale: 0.2,
            rotation: -180
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.1
        }, "-=0.4")
        .to(".hero-huge-title", {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "expo.out"
        }, "-=0.8")
        .to(".hero-subtitle", {
            y: 0,
            opacity: 1,
            duration: 0.8
        }, "-=0.8")
        .to(".btn-lime", {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.5)"
        }, "-=0.6");
}

export function initProjectsScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    const transitionSection = document.getElementById("projects-transition");
    if (transitionSection) {
        gsap.to(transitionSection, {
            scrollTrigger: {
                trigger: transitionSection,
                start: "top center",
                end: "bottom center",
                scrub: 0.5
            },
            backgroundColor: "#F2EEFC",
            ease: "none"
        });
    }

    const horizontalSection = document.getElementById("projects-horizontal");
    const wrapper = document.getElementById("horizontalScrollWrapper");

    if (horizontalSection && wrapper) {
        function getScrollAmount() {
            let wrapperWidth = wrapper.scrollWidth;
            return -(wrapperWidth - window.innerWidth + 100);
        }

        ScrollTrigger.matchMedia({
            "(min-width: 768px)": function () {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: horizontalSection,
                        start: "top top",
                        end: () => `+=${(getScrollAmount() * -1) + 2500}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true
                    }
                });

                tl.to({}, { duration: 0.5 });
                tl.to(wrapper, {
                    x: getScrollAmount,
                    ease: "none",
                    duration: 1.0
                });
                tl.to({}, { duration: 0.2 });
            },
            "(max-width: 767px)": function () {
                const mobileCards = gsap.utils.toArray('.new-project-card, .horizontal-intro');
                mobileCards.forEach(card => {
                    gsap.fromTo(card, {
                        y: 40,
                        opacity: 0
                    }, {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 95%",
                            toggleActions: "play none none none"
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: "power2.out",
                        clearProps: "transform"
                    });
                });
            }
        });
    }
}

export function initAboutAnimations() {
    const heading = document.getElementById('about-heading');
    const tagline = document.getElementById('about-tagline');
    const stats = document.getElementById('about-stats');
    const badgesEl = document.getElementById('about-badges');
    const cards = document.querySelectorAll('.about-new__card');

    if (!heading || !cards.length) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: '#about',
            start: 'top 75%',
            once: true
        }
    })
    .to(heading, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .to(tagline, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');

    const isMobile = window.innerWidth < 768;
    const spreadMultiplier = isMobile ? 0.6 : 1;

    const basePositions = [
        { x: -220, y: 30 },
        { x: -100, y: -40 },
        { x: 100, y: 20 },
        { x: 220, y: -30 },
        { x: 0, y: 10 }
    ];

    const restingPositions = basePositions.map(pos => ({
        x: (pos.x * spreadMultiplier) + (Math.random() * (isMobile ? 30 : 60) - (isMobile ? 15 : 30)),
        y: pos.y + (Math.random() * 60 - 30),
        rotation: (Math.random() * 50 - 25)
    }));

    cards.forEach((card, i) => {
        const pos = restingPositions[i] || { x: 0, y: 0, rotation: 0 };
        gsap.set(card, {
            opacity: 0,
            x: pos.x,
            y: -640,
            rotation: pos.rotation - 8,
            transformOrigin: '50% 50%',
            zIndex: i + 1
        });
    });

    ScrollTrigger.create({
        trigger: '#about-stack',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            cards.forEach((card, i) => {
                const pos = restingPositions[i] || { x: 0, y: 0, rotation: 0 };
                gsap.to(card, {
                    opacity: 1,
                    x: pos.x,
                    y: pos.y,
                    rotation: pos.rotation,
                    duration: 1.0,
                    ease: 'power3.out',
                    delay: i * 0.14,
                    onComplete: () => {
                        if (i === cards.length - 1) enableDraggable();
                    }
                });
            });

            const dragHint = document.getElementById('drag-hint');
            if (dragHint) {
                gsap.to(dragHint, {
                    opacity: 1,
                    duration: 1.0,
                    delay: cards.length * 0.14 + 0.5,
                    ease: 'power2.out'
                });
            }
        }
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: '#about-stats',
            start: 'top 85%',
            once: true
        }
    })
    .to(stats, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });

    const badgeItems = badgesEl ? badgesEl.querySelectorAll('.about-new__badge') : [];
    if (badgeItems.length) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '#about-badges',
                start: 'top 90%',
                once: true
            }
        })
        .to(badgesEl, { opacity: 1, duration: 0.1 })
        .to(badgeItems, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out'
        }, '-=0.1');
    }

    function enableDraggable() {
        if (typeof Draggable === 'undefined') return;
        Draggable.create('.about-new__card', {
            type: 'x,y',
            edgeResistance: 0.65,
            bounds: '.about-new',
            inertia: false,
            onPress: function () {
                gsap.set(this.target, { zIndex: 999 });
            },
            onRelease: function () {
                gsap.set(this.target, { zIndex: '' });
            }
        });
    }
}

export function initExperienceAnimations() {
    const cards = document.querySelectorAll('.experience-card');
    if (!cards.length) return;

    gsap.set(cards, {
        opacity: 0,
        y: 36,
        boxShadow: '0px 0px 0px #9966E2',
    });

    ScrollTrigger.create({
        trigger: '#experience',
        start: 'top 72%',
        once: true,
        onEnter: () => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                boxShadow: '4px 4px 0px #9966E2',
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.11,
            });
        },
    });

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (parseFloat(gsap.getProperty(card, 'opacity')) < 0.5) return;
            gsap.to(card, {
                boxShadow: '6px 6px 0px #9966E2',
                y: '-=2',
                duration: 0.2,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        card.addEventListener('mouseleave', () => {
            const isExpanded = card.querySelector('.collapse.show');
            gsap.to(card, {
                boxShadow: isExpanded ? '6px 6px 0px #9966E2' : '4px 4px 0px #9966E2',
                y: 0,
                duration: 0.25,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        });

        const collapseEl = card.querySelector('.collapse');
        if (!collapseEl) return;

        collapseEl.addEventListener('show.bs.collapse', () => {
            gsap.timeline()
                .to(card, {
                    boxShadow: '8px 8px 0px #9966E2',
                    borderColor: '#9966E2',
                    duration: 0.25,
                    ease: 'power3.out',
                })
                .to(card, {
                    boxShadow: '6px 6px 0px #9966E2',
                    duration: 0.2,
                    ease: 'power2.inOut',
                });
        });

        collapseEl.addEventListener('hide.bs.collapse', () => {
            gsap.to(card, {
                boxShadow: '4px 4px 0px #9966E2',
                borderColor: '#0b0b0b',
                duration: 0.25,
                ease: 'power2.out',
            });
        });
    });
}
