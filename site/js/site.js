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
  var receipt = new URL(window.location.href);
  if (receipt.searchParams.get("waitlist") === "received") {
    status.textContent = "You're on the waitlist. Look out for Breachmatrix updates.";
    receipt.searchParams.delete("waitlist");
    window.history.replaceState(null, "", receipt.pathname + receipt.search + receipt.hash);
  }
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
      var response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: form.elements.email.value.trim(),
          _honey: form.elements._honey.value
        }),
        signal: controller.signal
      });
      var result = await response.json();
      if (!response.ok || result.success !== true) {
        status.classList.add("is-error");
        status.textContent = result.message || "We couldn't save your request. Please try again shortly.";
        return;
      }
      status.textContent = "You're on the waitlist. Look out for Breachmatrix updates.";
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