(function(){
  var compactHeaderQuery = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');

  function isCompactHeader(){
    return compactHeaderQuery.matches;
  }

  function closeAllMenus(){
    document.querySelectorAll('[data-aa-menu]').forEach(function(menu){
      if(isCompactHeader()){
        menu.setAttribute('hidden', '');
      }else{
        menu.removeAttribute('hidden');
      }
    });
    document.querySelectorAll('[data-aa-menu-toggle]').forEach(function(btn){
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  function closeAllLangMenus(){
    document.querySelectorAll('[data-aa-lang-menu]').forEach(function(menu){
      menu.setAttribute('hidden', '');
    });
    document.querySelectorAll('[data-aa-lang-btn]').forEach(function(btn){
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    closeAllMenus();

    document.querySelectorAll('[data-aa-menu-toggle]').forEach(function(btn){
      var nav = btn.closest('.aa-nav');
      var menu = (nav && nav.querySelector('[data-aa-menu]')) || document.querySelector('[data-aa-menu]');
      if(!menu) return;

      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', function(e){
        e.stopPropagation();
        if(!isCompactHeader()) return;

        closeAllLangMenus();

        var isOpen = !menu.hasAttribute('hidden');
        if(isOpen){
          menu.setAttribute('hidden', '');
          btn.setAttribute('aria-expanded', 'false');
        }else{
          menu.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    if(compactHeaderQuery.addEventListener){
      compactHeaderQuery.addEventListener('change', closeAllMenus);
    }else{
      compactHeaderQuery.addListener(closeAllMenus);
    }

    document.querySelectorAll('[data-aa-lang-wrap]').forEach(function(wrap){
      var btn = wrap.querySelector('[data-aa-lang-btn]');
      var menu = wrap.querySelector('[data-aa-lang-menu]');
      if(!btn || !menu) return;

      menu.setAttribute('hidden', '');

      btn.addEventListener('click', function(e){
        e.stopPropagation();
        closeAllMenus();

        var isOpen = !menu.hasAttribute('hidden');
        closeAllLangMenus();

        if(!isOpen){
          menu.removeAttribute('hidden');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function(){
      closeAllMenus();
      closeAllLangMenus();
    });

    document.querySelectorAll('[data-aa-menu], [data-aa-lang-menu]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.stopPropagation();
      });
    });

    document.addEventListener('click', function(e){
      var el = e.target.closest('[data-matomo-category]');
      if(!el || !window._paq) return;

      window._paq.push([
        'trackEvent',
        el.getAttribute('data-matomo-category') || 'CTA',
        el.getAttribute('data-matomo-action') || 'Click',
        el.getAttribute('data-matomo-name') || el.href || el.textContent.trim()
      ]);
    });
  });
})();
