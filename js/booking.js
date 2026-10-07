// The fragment navigation that follows a link click resets focus once the click
// handlers have run: right away in Blink, in a later task in Gecko. Focusing the
// element during the click makes that reset arrive as a blur with no new focus
// target, so the element is focused again after it, and `afterReset` runs.
const focusThroughFragmentNavigation = (element, afterReset) => {
  const focus = () => element.focus({ preventScroll: true });

  element.addEventListener(
    "blur",
    (event) => {
      if (event.relatedTarget) return;
      window.setTimeout(() => {
        focus();
        afterReset();
      }, 0);
    },
    { once: true }
  );
  focus();
};

// The anchor aligns its target with the viewport top, which on a short viewport
// can leave an element of the target below the visible area, its bottom scroll
// margin included. Only then is the element scrolled into view, two frames on:
// Blink starts the anchor scroll in the frame after the navigation, so the
// correction takes that scroll over instead of racing it.
const revealBelowAnchor = (target, element) => {
  const clearance = parseFloat(getComputedStyle(element).scrollMarginBottom) || 0;
  const bottom = element.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
  if (bottom + clearance <= window.innerHeight) return;

  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() => element.scrollIntoView({ block: "nearest" }))
  );
};

export const initBooking = () => {
  const root = document.querySelector("[data-booking]");
  if (!root) return;

  const serviceButtons = root.querySelectorAll("[data-booking-service]");
  const stylistButtons = root.querySelectorAll("[data-booking-stylist]");
  const summaryService = root.querySelector("[data-summary-service]");
  const summaryStylist = root.querySelector("[data-summary-stylist]");
  const summaryStatus = root.querySelector("[data-summary-status]");
  const cta = root.querySelector("[data-booking-cta]");

  let selectedService = null;
  let selectedStylist = null;

  const updateSummary = () => {
    summaryService.textContent = selectedService || "—";
    summaryStylist.textContent = selectedStylist || "—";

    if (selectedService && selectedStylist) {
      summaryStatus.textContent = "Gotowe do potwierdzenia";
      cta.removeAttribute("disabled");
    } else {
      summaryStatus.textContent = "Wybierz opcje";
      cta.setAttribute("disabled", "true");
    }
  };

  const handleSelect = (buttons, selectedButton, setter) => {
    setter(selectedButton.textContent);
    buttons.forEach((btn) => {
      const isSelected = btn === selectedButton;
      btn.classList.toggle("is-selected", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
    });
    updateSummary();
  };

  const selectService = (button) =>
    handleSelect(serviceButtons, button, (value) => {
      selectedService = value;
    });

  const selectStylist = (button) =>
    handleSelect(stylistButtons, button, (value) => {
      selectedStylist = value;
    });

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => selectService(button));
  });

  stylistButtons.forEach((button) => {
    button.addEventListener("click", () => selectStylist(button));
  });

  // Card links stay plain links to #booking that add a preselection, so without
  // JavaScript, or when their value or fragment names nothing, they only navigate.
  // A link names its choice by the choice's data value, not by its label.
  const initPreselectLinks = (linkAttribute, buttons, choiceAttribute, select) => {
    document.querySelectorAll(`[${linkAttribute}]`).forEach((link) => {
      const value = link.getAttribute(linkAttribute);
      const choice = Array.from(buttons).find((button) => button.getAttribute(choiceAttribute) === value);
      const target = document.getElementById(link.hash.slice(1));
      if (!choice || !target) return;

      link.addEventListener("click", (event) => {
        // A modified click opens the link elsewhere and leaves this page as it is.
        const isPrimaryClick = event.button === 0;
        const opensNewContext = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (!isPrimaryClick || opensNewContext) return;

        select(choice);
        focusThroughFragmentNavigation(choice, () => revealBelowAnchor(target, choice));
      });
    });
  };

  initPreselectLinks("data-booking-preselect-service", serviceButtons, "data-booking-service", selectService);
  initPreselectLinks("data-booking-preselect-stylist", stylistButtons, "data-booking-stylist", selectStylist);

  cta.addEventListener("click", () => {
    if (!selectedService || !selectedStylist) return;
    summaryStatus.textContent = "Rezerwacja wstępnie zapisana";
    cta.textContent = "Wysłano";
    cta.setAttribute("disabled", "true");
  });

  updateSummary();
};
