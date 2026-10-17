(function () {
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!motion.matches && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-waiting");
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(function (section) {
      section.classList.add("is-waiting");
      observer.observe(section);
    });
  }

  var form = document.getElementById("waitlist-form");
  var button = form.querySelector("button[type=submit]");
  var status = document.getElementById("waitlist-status");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (button.disabled || form.elements._honey.value) return;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.classList.remove("is-error");
    status.textContent = "Sending your request...";
    var controller = new AbortController();
    var timer = window.setTimeout(function () { controller.abort(); }, 15000);
    try {
      var response = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: form.elements.email.value.trim(),
          _subject: form.elements._subject.value,
          _honey: form.elements._honey.value
        }),
        signal: controller.signal
      });
      var result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== "true")) throw new Error("Submission failed");
      status.textContent = "Request sent. Look out for Breachmatrix updates in your inbox.";
      form.reset();
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = "We couldn't send your request. Please try again in a moment.";
    } finally {
      window.clearTimeout(timer);
      button.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
})();