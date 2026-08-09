/**
 * Hymnal PDF Generator Utility
 * Creates a beautifully formatted printable booklet of all hymns
 * with an Index Table of Contents (فهرس الترانيم) at the end.
 */
export const generateHymnsPDF = (hymnsList) => {
  if (!hymnsList || hymnsList.length === 0) {
    alert('لا توجد ترانيم متاحة للتحميل حالياً.');
    return;
  }

  // Sort hymns by title or keep original list order, assigning sequential numbers
  const sortedHymns = [...hymnsList].map((hymn, index) => ({
    ...hymn,
    number: index + 1
  }));

  const printWindow = window.open('', '_blank', 'width=950,height=850');
  if (!printWindow) {
    alert('الرجاء السماح بالنوافذ المنبثقة (Popups) لتوليد وتحميل كتاب الترانيم PDF.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('ar-LB', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>كتاب الترانيم والعبادة - كنيسة خربة قنافار الإنجيلية</title>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Cairo', sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      direction: rtl;
      line-height: 1.6;
    }
    
    /* Top Action Bar (Hidden during printing) */
    .no-print-bar {
      position: sticky;
      top: 0;
      background: #0f2343;
      color: #ffffff;
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
      z-index: 9999;
    }
    .print-btn {
      background: #c5a880;
      color: #0f2343;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .print-btn:hover {
      background: #e2c9a5;
    }

    .document-container {
      padding: 25px 35px;
      max-width: 850px;
      margin: 0 auto;
    }

    /* Cover Header */
    .hymnal-header {
      text-align: center;
      border-bottom: 3px double #c5a880;
      padding-bottom: 24px;
      margin-bottom: 35px;
    }
    .hymnal-header img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin-bottom: 12px;
    }
    .hymnal-header h1 {
      color: #0f2343;
      margin: 4px 0;
      font-size: 26px;
      font-weight: 800;
    }
    .hymnal-header h2 {
      color: #c5a880;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
    }
    .hymnal-header p {
      color: #64748b;
      font-size: 13px;
      margin-top: 10px;
      font-weight: 600;
    }

    /* Hymn Cards */
    .hymn-card {
      background: #fafafa;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 22px 26px;
      margin-bottom: 28px;
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .hymn-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .hymn-number-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hymn-num-badge {
      background: #0f2343;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
      padding: 5px 14px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }
    .hymn-title {
      color: #0f2343;
      font-size: 20px;
      font-weight: 800;
      margin: 0;
    }
    .hymn-category {
      background: #e2e8f0;
      color: #334155;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
    }
    .hymn-lyrics {
      font-size: 16px;
      white-space: pre-wrap;
      line-height: 1.95;
      color: #1e293b;
      margin-top: 12px;
      font-weight: 600;
    }

    /* Index Section at the End of PDF */
    .index-section {
      page-break-before: always;
      margin-top: 40px;
      padding-top: 25px;
    }
    .index-header {
      text-align: center;
      border-bottom: 3px double #c5a880;
      padding-bottom: 15px;
      margin-bottom: 30px;
    }
    .index-header h2 {
      color: #0f2343;
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 6px 0;
    }
    .index-header p {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .index-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .index-table th {
      background: #0f2343;
      color: #ffffff;
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 700;
      text-align: right;
    }
    .index-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    .index-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .index-num {
      font-weight: 800;
      color: #0f2343;
      width: 18%;
    }
    .index-name {
      font-weight: 700;
      color: #0f2343;
    }
    .index-cat {
      color: #64748b;
      width: 25%;
      font-weight: 600;
    }

    @media print {
      .no-print-bar {
        display: none !important;
      }
      .document-container {
        padding: 0;
        max-width: 100%;
      }
      .hymn-card {
        box-shadow: none;
        border: 1px solid #d1d5db;
        background: #ffffff;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <strong style="font-size: 16px;">كتيب ترانيم الكنيسة المعمدانية الإنجيلية - خربة قنافار</strong> 
      <span style="font-size: 13px; opacity: 0.85; margin-right: 12px;">(إجمالي ${sortedHymns.length} ترنيمة)</span>
    </div>
    <button class="print-btn" onclick="window.print()">
      📄 حفظ كملف PDF / طباعة
    </button>
  </div>

  <div class="document-container">
    <!-- Header -->
    <div class="hymnal-header">
      <img src="${window.location.origin}/logo.png" alt="شعار الكنيسة" onError="this.style.display='none'" />
      <h1>الكنيسة المعمدانية الإنجيلية - خربة قنافار</h1>
      <h2>كتيب الترانيم والعبادة الكنسي الشامل</h2>
      <p>تاريخ الاستخراج: ${currentDate} | إجمالي الترانيم المحفوظة: ${sortedHymns.length} ترنيمة</p>
    </div>

    <!-- Hymns Collection -->
    <div class="hymns-collection">
      ${sortedHymns.map((hymn) => `
        <div class="hymn-card">
          <div class="hymn-meta">
            <div class="hymn-number-title">
              <span class="hymn-num-badge">ترنيمة ${hymn.number}</span>
              <h3 class="hymn-title">${hymn.title}</h3>
            </div>
            ${hymn.category ? `<span class="hymn-category">${hymn.category}</span>` : ''}
          </div>
          <div class="hymn-lyrics">${hymn.lyrics || 'كلمات الترنيمة غير متوفرة مكتوبة.'}</div>
        </div>
      `).join('')}
    </div>

    <!-- Index Section at the End of PDF -->
    <div class="index-section">
      <div class="index-header">
        <h2>فهرس كتاب الترانيم والعبادة</h2>
        <p>فهرس متسلسل لجميع ترانيم الكنيسة والمجموعات</p>
      </div>
      <table class="index-table">
        <thead>
          <tr>
            <th class="index-num">رقم الترنيمة</th>
            <th class="index-name">اسم الترنيمة</th>
            <th class="index-cat">التصنيف</th>
          </tr>
        </thead>
        <tbody>
          ${sortedHymns.map((hymn) => `
            <tr>
              <td class="index-num">ترنيمة ${hymn.number}</td>
              <td class="index-name">${hymn.title}</td>
              <td class="index-cat">${hymn.category || 'عامة'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 600);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
