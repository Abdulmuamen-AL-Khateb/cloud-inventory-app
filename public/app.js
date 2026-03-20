document.addEventListener('DOMContentLoaded', () => {

  // ── Entrance Animations ──
  const animatedEls = document.querySelectorAll('header, .info-box, .filter-panel, .table-section');
  animatedEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 80 * i);
  });

  // Stagger table rows
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach((row, i) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-16px)';
    row.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
    }, 300 + 40 * i);
  });

  // ── Sortable Table Columns ──
  const table = document.querySelector('table');
  if (!table) return;

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const headers = thead.querySelectorAll('th');
  let sortCol = -1;
  let sortAsc = true;

  headers.forEach((th, colIndex) => {
    // Add sort indicator and styling
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';
    th.style.position = 'relative';

    const arrow = document.createElement('span');
    arrow.className = 'sort-arrow';
    arrow.textContent = ' \u2195';
    arrow.style.opacity = '0.4';
    arrow.style.fontSize = '12px';
    arrow.style.marginLeft = '4px';
    th.appendChild(arrow);

    th.addEventListener('click', () => {
      if (sortCol === colIndex) {
        sortAsc = !sortAsc;
      } else {
        sortCol = colIndex;
        sortAsc = true;
      }

      // Update all arrows
      headers.forEach((h, hi) => {
        const a = h.querySelector('.sort-arrow');
        if (hi === colIndex) {
          a.textContent = sortAsc ? ' \u25B2' : ' \u25BC';
          a.style.opacity = '1';
        } else {
          a.textContent = ' \u2195';
          a.style.opacity = '0.4';
        }
      });

      // Sort the rows
      const rowsArr = Array.from(tbody.querySelectorAll('tr'));
      if (rowsArr.length === 0) return;

      // Check if only the "No products found" row exists
      if (rowsArr.length === 1 && rowsArr[0].querySelector('.empty')) return;

      rowsArr.sort((a, b) => {
        const aText = a.children[colIndex].textContent.trim();
        const bText = b.children[colIndex].textContent.trim();

        // Try numeric comparison (strip $ and commas)
        const aNum = parseFloat(aText.replace(/[$,]/g, ''));
        const bNum = parseFloat(bText.replace(/[$,]/g, ''));

        let cmp;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          cmp = aNum - bNum;
        } else {
          cmp = aText.localeCompare(bText, undefined, { sensitivity: 'base' });
        }

        return sortAsc ? cmp : -cmp;
      });

      // Re-append sorted rows with a quick animation
      rowsArr.forEach((row, i) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-8px)';
        tbody.appendChild(row);
        setTimeout(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateX(0)';
        }, 20 * i);
      });
    });
  });

});
