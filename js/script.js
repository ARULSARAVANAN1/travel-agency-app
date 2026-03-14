/**
 * Shared interactions for the Thilagamani Tours and Travels site.
 */

document.addEventListener("DOMContentLoaded", function () {
    const mobileBreakpoint = 980;
    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFHNxEWdf9Cy0tGZ6ZE60KXWsVq7r0BRtGToziV_m5nieufdzOswnxoCE7rxvXzmzNTA/exec";
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    const header = document.querySelector("header");
    const menuOpenIcon = "\u2715";
    const menuClosedIcon = "\u2630";

    function setMenuState(isOpen) {
        if (!menuToggle || !nav) {
            return;
        }

        nav.classList.toggle("active", isOpen);
        menuToggle.textContent = isOpen ? menuOpenIcon : menuClosedIcon;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    if (menuToggle && nav) {
        setMenuState(false);

        menuToggle.addEventListener("click", function () {
            setMenuState(!nav.classList.contains("active"));
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (window.innerWidth <= mobileBreakpoint) {
                    setMenuState(false);
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (window.innerWidth <= mobileBreakpoint && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
                setMenuState(false);
            }
        });
    }

    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                header.style.boxShadow = "0 16px 40px rgba(14, 34, 53, 0.1)";
            } else {
                header.style.boxShadow = "none";
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");
            if (!href || href === "#") {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            const headerOffset = header ? header.offsetHeight + 16 : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: top, behavior: "smooth" });
        });
    });

    const contactForm = document.querySelector("#contactForm");

    if (contactForm) {
        const name = contactForm.querySelector('input[name="name"]');
        const phone = contactForm.querySelector('input[name="number"]');
        const email = contactForm.querySelector('input[name="email"]');
        const tripDetails = contactForm.querySelector('textarea[name="tripDetails"]');
        const statusMessage = contactForm.querySelector("#formStatus");
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const fields = [name, phone, email, tripDetails];
        let isSubmitting = false;

        function getErrorElement(field) {
            return contactForm.querySelector("#" + field.id + "Error");
        }

        function setFieldError(field, messageText) {
            const errorElement = getErrorElement(field);

            field.classList.add("error");
            field.setAttribute("aria-invalid", "true");

            if (errorElement) {
                errorElement.textContent = messageText;
            }
        }

        function clearFieldError(field) {
            const errorElement = getErrorElement(field);

            field.classList.remove("error");
            field.setAttribute("aria-invalid", "false");

            if (errorElement) {
                errorElement.textContent = "";
            }
        }

        function validateField(field, shouldShowError) {
            const value = field.value.trim();
            const showError = shouldShowError !== false;

            function fail(messageText) {
                if (showError) {
                    setFieldError(field, messageText);
                }

                return false;
            }

            if (field === name) {
                if (value === "") {
                    return fail("Full name is required.");
                }

                if (value.length < 3) {
                    return fail("Please enter at least 3 characters.");
                }
            }

            if (field === phone) {
                const phoneValue = value.replace(/\D/g, "");

                if (phoneValue === "") {
                    return fail("Phone number is required.");
                }

                if (!/^[6-9]\d{9}$/.test(phoneValue)) {
                    return fail("Enter a valid 10-digit mobile number.");
                }

                if (field.value !== phoneValue) {
                    field.value = phoneValue;
                }
            }

            if (field === email) {
                if (value === "") {
                    if (showError) {
                        clearFieldError(field);
                    }

                    return true;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return fail("Enter a valid email address.");
                }
            }

            if (field === tripDetails) {
                if (value === "") {
                    return fail("Trip details are required.");
                }

                if (value.length < 10) {
                    return fail("Please share a few more trip details.");
                }
            }

            if (showError) {
                clearFieldError(field);
            }

            return true;
        }

        function updateSubmitState() {
            if (!submitButton) {
                return;
            }

            submitButton.disabled = isSubmitting || !fields.every(function (field) {
                return field && validateField(field, false);
            });
        }

        fields.forEach(function (field) {
            if (!field) {
                return;
            }

            field.setAttribute("aria-invalid", "false");

            field.addEventListener("input", function () {
                if (field === phone) {
                    field.value = field.value.replace(/\D/g, "").slice(0, 10);
                }

                validateField(field);
                updateSubmitState();

                if (statusMessage) {
                    statusMessage.textContent = "";
                    statusMessage.classList.remove("success");
                }
            });

            field.addEventListener("blur", function () {
                validateField(field);
                updateSubmitState();
            });
        });

        updateSubmitState();

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const firstInvalidField = fields.find(function (field) {
                return field && !validateField(field);
            });

            updateSubmitState();

            if (firstInvalidField) {
                if (statusMessage) {
                    statusMessage.textContent = "Please correct the highlighted fields before sending your enquiry.";
                    statusMessage.classList.remove("success");
                }

                firstInvalidField.focus();
                return;
            }

            isSubmitting = true;
            updateSubmitState();

            if (statusMessage) {
                statusMessage.textContent = "Sending your travel request...";
                statusMessage.classList.remove("success");
            }

            if (GOOGLE_APPS_SCRIPT_URL.indexOf("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") !== -1) {
                isSubmitting = false;
                updateSubmitState();

                if (statusMessage) {
                    statusMessage.textContent = "Add your deployed Google Apps Script web app URL in js/script.js to start receiving enquiries.";
                    statusMessage.classList.remove("success");
                }

                return;
            }

            const formPayload = new URLSearchParams();
            formPayload.append("name", name ? name.value.trim() : "");
            formPayload.append("number", phone ? phone.value.trim() : "");
            formPayload.append("email", email ? email.value.trim() : "");
            formPayload.append("tripDetails", tripDetails ? tripDetails.value.trim() : "");

            fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: formPayload
            }).then(function () {
                contactForm.reset();

                fields.forEach(function (field) {
                    if (field) {
                        clearFieldError(field);
                    }
                });

                if (statusMessage) {
                    statusMessage.textContent = "Thank you. Your travel request has been submitted successfully.";
                    statusMessage.classList.add("success");
                }
            }).catch(function () {
                if (statusMessage) {
                    statusMessage.textContent = "We could not submit your request right now. Please try again or contact us on WhatsApp.";
                    statusMessage.classList.remove("success");
                }
            }).finally(function () {
                isSubmitting = false;
                updateSubmitState();
            });
        });
    }

    const statNumbers = document.querySelectorAll(".number[data-count]");

    function animateCount(element) {
        const target = Number(element.dataset.count || 0);
        const suffix = element.dataset.suffix || "";
        const duration = 2600;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = value + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        }

        window.requestAnimationFrame(tick);
    }

    if (statNumbers.length > 0) {
        const triggered = new WeakSet();

        function startCounter(element) {
            if (triggered.has(element)) {
                return;
            }

            triggered.add(element);
            animateCount(element);
        }

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        startCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.45 });

            statNumbers.forEach(function (element) {
                observer.observe(element);
            });
        } else {
            statNumbers.forEach(startCounter);
        }
    }

    window.addEventListener("resize", function () {
        if (window.innerWidth > mobileBreakpoint) {
            setMenuState(false);
        }
    });
});
