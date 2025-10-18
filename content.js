// Initialize observer once DOM is ready
let observer;

function initializeObserver() {
  if (!document.body) {
    // Document body not ready yet, retry
    setTimeout(initializeObserver, 100);
    return;
  }

  if (observer) {
    return; // Already initialized
  }

  // Observer to detect new messages and replace em dashes in UI
  observer = new MutationObserver((mutations) => {
    // Replace em dashes in the page
    replaceEmDashesInPage(mutations);
    // Add copy button interception
    addCopyButtonsToMessages();
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  console.log('ChatGPT Enhanced Copy Button observer initialized');
}

// Tags to skip when replacing em dashes
const SKIP = new Set([
  "SCRIPT","STYLE","TEXTAREA","PRE","KBD","SAMP","NOSCRIPT","IFRAME","OBJECT","INPUT","SELECT"
]);

function shouldSkip(el) {
  if (!el) return true;
  if (SKIP.has(el.tagName)) return true;
  if (el.isContentEditable) return true;
  return false;
}

// Replace em dashes in text nodes
function replaceInTextNode(node) {
  const before = node.data;
  const after = before.replace(new RegExp(`\\s*${EM_DASH}\\s*`, "g"), REPLACER);
  if (after !== before) node.data = after;
}

// Replace em dashes in the visible page
function replaceEmDashesInPage(mutations) {
  for (const m of mutations) {
    if (m.type === "characterData") {
      const n = m.target;
      if (n.nodeType === Node.TEXT_NODE && n.data.includes(EM_DASH)) {
        const p = n.parentElement;
        if (p && !shouldSkip(p)) replaceInTextNode(n);
      }
      continue;
    }
    for (const node of m.addedNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const p = node.parentElement;
        if (p && !shouldSkip(p) && node.data.includes(EM_DASH)) replaceInTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE && !shouldSkip(node)) {
        if (node.textContent && node.textContent.includes(EM_DASH)) {
          walkAndReplace(node);
        }
      }
    }
  }
}

// Walk through elements and replace em dashes
function walkAndReplace(root) {
  const w = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(n) {
        const p = n.parentElement;
        return p && !shouldSkip(p) && n.data.includes(EM_DASH)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );
  let n;
  while ((n = w.nextNode())) replaceInTextNode(n);
}

// Em dash replacement
const EM_DASH = "\u2014"; // —
const REPLACER = ", ";

// Add CSS for smooth animation
function addAnimationStyles() {
  if (document.getElementById('aiva-copy-styles')) return; // Already added

  const style = document.createElement('style');
  style.id = 'aiva-copy-styles';
  style.textContent = `
    @keyframes aiva-check-in {
      0% {
        opacity: 0;
        transform: scale(0.3) rotate(-45deg);
      }
      50% {
        opacity: 1;
        transform: scale(1.1) rotate(5deg);
      }
      100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    @keyframes aiva-check-out {
      0% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: scale(0.3) rotate(45deg);
      }
    }

    .aiva-check-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      animation: aiva-check-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .aiva-check-icon.fade-out {
      animation: aiva-check-out 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
    }

    .aiva-copy-button-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `;

  // Wait for head to be available
  if (document.head) {
    document.head.appendChild(style);
  } else {
    // Retry if head not ready yet
    setTimeout(addAnimationStyles, 100);
  }
}

// Function to clean message text
function cleanMessageText(text) {
  // Remove "ChatGPT said:" prefix
  text = text.replace(/^ChatGPT said:\s*/i, '');

  // Remove common UI text patterns
  text = text.replace(/^(Copy|Edit)\s*/gi, '');

  // Replace em dashes with ", "
  text = text.replace(new RegExp(`\\s*${EM_DASH}\\s*`, "g"), REPLACER);

  return text.trim();
}

// Function to get text content with em dashes preserved
function getTextWithEmDashes(element) {
  let text = '';
  const walk = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  let node;
  while (node = walk.nextNode()) {
    text += node.data;
  }
  return text;
}

// Function to find all message containers and intercept copy button
function addCopyButtonsToMessages() {
  // Target article elements (ChatGPT's main message containers)
  const messageContainers = document.querySelectorAll('article');

  messageContainers.forEach((container) => {
    // Check if we already modified this container
    if (container.dataset.aivaIntercepted === 'true') {
      return;
    }

    // Get the text content from the message (preserves em dashes)
    let textContent = getTextWithEmDashes(container);

    // Only add button if there's actual content
    if (!textContent || textContent.trim().length === 0) {
      return;
    }

    // Clean the text
    textContent = cleanMessageText(textContent);

    // Find the ChatGPT copy button
    let copyButton = null;
    const allButtons = container.querySelectorAll('button');

    for (let button of allButtons) {
      // Look for the copy button - it usually has a data attribute or aria-label with "copy"
      const ariaLabel = button.getAttribute('aria-label') || '';
      const dataTestId = button.getAttribute('data-testid') || '';

      if (ariaLabel.toLowerCase().includes('copy') ||
          dataTestId.toLowerCase().includes('copy')) {
        copyButton = button;
        break;
      }
    }

    // If we found the copy button, intercept its click event
    if (copyButton && !copyButton.dataset.aivaIntercepted) {
      copyButton.dataset.aivaIntercepted = 'true';

      // Track if animation is in progress
      let isAnimating = false;

      // Add a capture phase listener that fires before other handlers
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Prevent multiple clicks during animation
        if (isAnimating) return;
        isAnimating = true;

        // Copy the text
        interceptCopyClick(textContent);

        // Store original state
        const originalHTML = copyButton.innerHTML;

        // Create checkmark icon with ChatGPT's exact styling (grey color)
        const checkmarkSVG = `
          <span class="aiva-check-icon" style="color: currentColor;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12.5L9 16.5L19 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        `;

        // Replace button content with checkmark
        copyButton.innerHTML = checkmarkSVG;

        // After animation plays, add fade out class
        setTimeout(() => {
          const checkIcon = copyButton.querySelector('.aiva-check-icon');
          if (checkIcon) {
            checkIcon.classList.add('fade-out');
          }

          // After fade out completes, restore original button
          setTimeout(() => {
            copyButton.innerHTML = originalHTML;
            isAnimating = false;
          }, 200);
        }, 1500); // Show checkmark for 1.5 seconds
      }, true);

      container.dataset.aivaIntercepted = 'true';
    }
  });
}

// Function to handle the intercepted copy click
async function interceptCopyClick(textContent) {
  try {
    await navigator.clipboard.writeText(textContent);
    console.log('Copied cleaned text to clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}


// Initialize observer when DOM is ready
if (document.body) {
  // Add animation styles
  addAnimationStyles();
  // Do initial pass to replace em dashes
  walkAndReplace(document.body);
  addCopyButtonsToMessages();
  initializeObserver();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    walkAndReplace(document.body);
    addCopyButtonsToMessages();
    initializeObserver();
  });
}

// Also run on page load to catch any remaining messages
window.addEventListener('load', () => {
  addAnimationStyles();
  walkAndReplace(document.body);
  addCopyButtonsToMessages();
});

console.log('ChatGPT Enhanced Copy Button extension loaded');
