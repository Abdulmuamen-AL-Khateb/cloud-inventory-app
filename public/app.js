document.addEventListener('DOMContentLoaded', () => {

  // ── Entrance Animations ──
  const sections = document.querySelectorAll('.topbar, .stat-card, .toolbar, .table-card');
  sections.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 60 * i);
  });

  // Sidebar slide-in
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.style.opacity = '0';
    sidebar.style.transform = 'translateX(-20px)';
    sidebar.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      sidebar.style.opacity = '1';
      sidebar.style.transform = 'translateX(0)';
    }, 50);
  }

  // Stagger table rows
  const rows = document.querySelectorAll('tbody tr');
  rows.forEach((row, i) => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease, background 0.15s ease';
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, 250 + 30 * i);
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
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';

    const arrow = document.createElement('span');
    arrow.className = 'sort-arrow';
    arrow.textContent = ' \u2195';
    arrow.style.opacity = '0.35';
    arrow.style.fontSize = '11px';
    arrow.style.marginLeft = '4px';
    th.appendChild(arrow);

    th.addEventListener('click', () => {
      if (sortCol === colIndex) {
        sortAsc = !sortAsc;
      } else {
        sortCol = colIndex;
        sortAsc = true;
      }

      // Update arrows
      headers.forEach((h, hi) => {
        const a = h.querySelector('.sort-arrow');
        if (hi === colIndex) {
          a.textContent = sortAsc ? ' \u25B2' : ' \u25BC';
          a.style.opacity = '1';
        } else {
          a.textContent = ' \u2195';
          a.style.opacity = '0.35';
        }
      });

      // Sort rows
      const rowsArr = Array.from(tbody.querySelectorAll('tr'));
      if (rowsArr.length === 0 || (rowsArr.length === 1 && rowsArr[0].querySelector('.empty'))) return;

      rowsArr.sort((a, b) => {
        const aText = a.children[colIndex].textContent.trim();
        const bText = b.children[colIndex].textContent.trim();

        // Numeric comparison (strip #, $, commas)
        const aNum = parseFloat(aText.replace(/[#$,]/g, ''));
        const bNum = parseFloat(bText.replace(/[#$,]/g, ''));

        let cmp;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          cmp = aNum - bNum;
        } else {
          cmp = aText.localeCompare(bText, undefined, { sensitivity: 'base' });
        }
        return sortAsc ? cmp : -cmp;
      });

      // Re-append with animation
      rowsArr.forEach((row, i) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(6px)';
        tbody.appendChild(row);
        setTimeout(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 15 * i);
      });
    });
  });

});
