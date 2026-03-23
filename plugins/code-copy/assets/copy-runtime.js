;(function () {
  var ICON_COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
    } catch (_e) {
      // Ignore clipboard fallback failures.
    }
    document.body.removeChild(ta);
  }

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () {
        fallbackCopy(text);
        onDone();
      });
      return;
    }
    fallbackCopy(text);
    onDone();
  }

  function flashBtn(btn, cells) {
    btn.innerHTML = ICON_CHECK;
    btn.classList.add("copied");
    cells.forEach(function (s) {
      s.classList.add("code-line--flash");
    });
    setTimeout(function () {
      btn.innerHTML = ICON_COPY;
      btn.classList.remove("copied");
      cells.forEach(function (s) {
        s.classList.remove("code-line--flash");
      });
    }, 1800);
  }

  function extractLineText(lineEl) {
    var contentEl = lineEl.querySelector(".code-line-content");
    if (contentEl) return contentEl.textContent || "";
    var clone = lineEl.cloneNode(true);
    clone.querySelectorAll(".code-line-number, .line-copy-btn, .sec-copy-btn").forEach(function (n) {
      n.remove();
    });
    return clone.textContent || "";
  }

  function extractCodeText(pre) {
    var codeEl = pre.querySelector("code");
    if (!codeEl) return pre.textContent || "";

    var codeLines = codeEl.querySelectorAll(".code-line");
    if (codeLines && codeLines.length) {
      return Array.from(codeLines).map(function (lineEl) {
        return extractLineText(lineEl);
      }).join("\n");
    }

    var clone = codeEl.cloneNode(true);
    clone.querySelectorAll(".line-copy-btn, .sec-copy-btn").forEach(function (n) {
      n.remove();
    });
    return clone.textContent || "";
  }

  window.__mdsone_copy = function (container) {
    container.querySelectorAll("pre").forEach(function (pre) {
      if (pre.querySelector(".copy-btn")) return;
      var btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.setAttribute("type", "button");
      btn.innerHTML = ICON_COPY;
      btn.addEventListener("click", function () {
        var text = extractCodeText(pre);
        copyText(text, function () {
          btn.innerHTML = ICON_CHECK;
          btn.classList.add("copied");
          setTimeout(function () {
            btn.innerHTML = ICON_COPY;
            btn.classList.remove("copied");
          }, 2000);
        });
      });
      pre.appendChild(btn);
    });
  };

  window.__mdsone_line_copy = function (container) {
    container.querySelectorAll('pre[data-line-copy-ready="1"]').forEach(function (pre) {
      var codeEl = pre.querySelector("code");
      if (!codeEl || codeEl.dataset.lineCopyBound === "1") return;
      codeEl.dataset.lineCopyBound = "1";

      codeEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".line-copy-btn");
        if (!btn) return;
        var span = btn.closest(".code-line--cmd");
        if (!span) return;
        var text = decodeURIComponent(span.dataset.cmd || "");
        if (!text) return;
        e.stopPropagation();
        copyText(text, function () {
          flashBtn(btn, Array.from(codeEl.querySelectorAll('[data-cmd="' + span.dataset.cmd + '"]')));
        });
      });

      codeEl.addEventListener("mouseover", function (e) {
        var span = e.target.closest(".code-line--cmd");
        if (!span) return;
        codeEl.querySelectorAll('[data-cmd="' + span.dataset.cmd + '"]').forEach(function (s) {
          s.classList.add("code-line--hover");
        });
      });

      codeEl.addEventListener("mouseout", function (e) {
        var span = e.target.closest(".code-line--cmd");
        if (!span) return;
        codeEl.querySelectorAll('[data-cmd="' + span.dataset.cmd + '"]').forEach(function (s) {
          s.classList.remove("code-line--hover");
        });
      });
    });
  };

  window.__mdsone_cmd_copy = function (container) {
    container.querySelectorAll('pre[data-cmd-copy-ready="1"]').forEach(function (pre) {
      var codeEl = pre.querySelector("code");
      if (!codeEl || codeEl.dataset.cmdCopyBound === "1") return;
      codeEl.dataset.cmdCopyBound = "1";

      codeEl.addEventListener("click", function (e) {
        var btn = e.target.closest(".sec-copy-btn");
        if (!btn) return;
        var head = btn.closest(".code-line--sec-head");
        if (!head) return;
        var text = decodeURIComponent(head.dataset.sec || "");
        if (!text) return;
        e.stopPropagation();
        var sid = head.dataset.secId;
        var codeCells = Array.from(codeEl.querySelectorAll('.code-line--sec-code[data-sec-id="' + sid + '"]'));
        copyText(text, function () {
          flashBtn(btn, codeCells);
        });
      });

      function getSecId(el) {
        var head = el.closest(".code-line--sec-head");
        if (head) return head.dataset.secId;
        var code = el.closest(".code-line--sec-code");
        if (code) return code.dataset.secId;
        return null;
      }

      codeEl.addEventListener("mouseover", function (e) {
        var sid = getSecId(e.target);
        if (sid === null) return;
        var head = codeEl.querySelector('.code-line--sec-head[data-sec-id="' + sid + '"]');
        if (head) head.classList.add("sec-active");
        codeEl.querySelectorAll('.code-line--sec-code[data-sec-id="' + sid + '"]').forEach(function (s) {
          s.classList.add("code-line--hover");
        });
      });

      codeEl.addEventListener("mouseout", function (e) {
        var sid = getSecId(e.target);
        if (sid === null) return;
        var head = codeEl.querySelector('.code-line--sec-head[data-sec-id="' + sid + '"]');
        if (head) head.classList.remove("sec-active");
        codeEl.querySelectorAll('.code-line--sec-code[data-sec-id="' + sid + '"]').forEach(function (s) {
          s.classList.remove("code-line--hover");
        });
      });
    });
  };

  function applyAll(root) {
    window.__mdsone_copy(root);
    window.__mdsone_line_copy(root);
    window.__mdsone_cmd_copy(root);
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        applyAll(document.body);
      });
    } else {
      applyAll(document.body);
    }

    if (typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes && m.addedNodes.forEach(function (n) {
            if (n && n.nodeType === 1) applyAll(n);
          });
        });
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  } catch (e) {
    console.warn("[mdsone] Failed to load copy button:", e.message);
  }
})();
