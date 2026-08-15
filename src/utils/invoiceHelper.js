import dayjs from 'dayjs';

export function downloadInvoice(order) {
  const printWindow = window.open('', '_blank');

  const subTotal = order?.cart?.subTotal || 0;
  const couponCode = order?.cart?.couponCode || '';
  const couponDiscount = order?.cart?.couponDiscount || 0;
  const isPackingFree = order?.cart?.packingDiscount || false;
  const totalAmount = order?.cart?.totalAmount || 0;

  const packingCharge = isPackingFree ? 0 : (totalAmount - subTotal + couponDiscount);

  const itemsRows = (order?.cart?.products || []).map((item, idx) => `
    <tr class="${idx % 2 === 0 ? 'even-row' : 'odd-row'}">
      <td style="text-align: center;">${idx + 1}</td>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.type}</td>
      <td style="text-align: center;">${item.qty}</td>
      <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="text-align: right; font-weight: bold;">₹${item.total.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice - ${order.orderID}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 20px;
            background-color: #fff;
          }
          .invoice-container {
            max-width: 850px;
            margin: 0 auto;
            border: 2px solid #d4af37;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            background-color: #ffffff;
            position: relative;
          }
          
          /* Header Section Styling */
          .header-block {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px double #AA7C11;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .brand-logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .brand-logo {
            height: 70px;
            width: auto;
            object-fit: contain;
          }
          .brand-text h1 {
            color: #AA7C11;
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 0.8px;
          }
          .brand-text p {
            margin: 4px 0 0;
            color: #c5a02b;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .company-contact {
            text-align: right;
            font-size: 12px;
            color: #4b5563;
            line-height: 1.5;
          }
          .company-contact strong {
            color: #111827;
            font-size: 13px;
          }
          
          /* Invoice title flag */
          .invoice-flag {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fdf8e7;
            border: 1px solid #f2dfa7;
            padding: 10px 20px;
            border-radius: 6px;
            margin-bottom: 25px;
          }
          .invoice-flag h2 {
            margin: 0;
            color: #8c6203;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .invoice-flag span {
            font-size: 14px;
            color: #8c6203;
            font-weight: 700;
          }
 
          /* Details Columns grid */
          .grid-details {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 25px;
          }
          .bill-card, .meta-card {
            flex: 1;
            padding: 15px 20px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .bill-card {
            border-left: 4px solid #d4af37;
          }
          .meta-card {
            border-left: 4px solid #AA7C11;
          }
          .card-title {
            margin: 0 0 10px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #8c6203;
            font-weight: 700;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 4px;
          }
          .card-content p {
            margin: 4px 0;
            font-size: 13px;
            line-height: 1.4;
          }
          .card-content p strong {
            color: #111827;
          }
          
          /* Items table styling */
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .invoice-table th {
            background-color: #AA7C11;
            color: #ffffff;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            padding: 10px;
            border: 1px solid #AA7C11;
          }
          .invoice-table td {
            padding: 10px;
            border: 1px solid #e5e7eb;
            font-size: 13px;
          }
          .even-row {
            background-color: #fafaf9;
          }
          .odd-row {
            background-color: #ffffff;
          }
          
          /* Summary section */
          .bottom-layout {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 20px;
          }
          .terms-info {
            width: 45%;
            font-size: 12px;
            color: #6b7280;
            line-height: 1.5;
          }
          .terms-info h4 {
            margin: 0 0 8px;
            color: #8c6203;
            font-size: 13px;
          }
          .summary-card {
            width: 320px;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
          }
          .summary-card td {
            padding: 8px 12px;
            font-size: 13px;
            border-bottom: 1px solid #f3f4f6;
          }
          .summary-card tr.total-row {
            background-color: #AA7C11;
            color: #ffffff;
            font-weight: bold;
            font-size: 15px;
          }
          .summary-card tr.total-row td {
            padding: 10px 12px;
            border-bottom: none;
          }
          
          .signature-area {
            text-align: right;
            margin-top: 50px;
            font-size: 13px;
          }
          .signature-line {
            display: inline-block;
            border-top: 1px solid #9ca3af;
            width: 200px;
            margin-top: 50px;
            text-align: center;
            padding-top: 5px;
            color: #4b5563;
          }
 
          @media print {
            body {
              padding: 0;
              background-color: #fff;
            }
            .invoice-container {
              border: none;
              padding: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          
          <!-- Brand and Contacts Header -->
          <div class="header-block">
            <div class="brand-logo-area">
              <img src="/mickey-logo.png" alt="Logo" class="brand-logo" onerror="this.style.display='none'" />
              <div class="brand-text">
                <h1>MICKEY CRACKERS</h1>
                <p>Wholesale Fireworks Dealer</p>
              </div>
            </div>
            <div class="company-contact">
              <strong>Mickey Crackers</strong><br />
              D Amman Township, Southside school &<br />
              Government college opposite, CHENAKAMAN PATTI,<br />
              Sivakasi, Tamil Nadu – 626189<br />
              Phone: +91 90253 99060
            </div>
          </div>

          <!-- Document Flag -->
          <div class="invoice-flag">
            <h2>TAX INVOICE / BILL OF SUPPLY</h2>
            <span>ID: ${order.orderID}</span>
          </div>

          <!-- Details Cards Grid -->
          <div class="grid-details">
            <div class="bill-card">
              <h3 class="card-title">Bill To / Delivery Details</h3>
              <div class="card-content">
                <p><strong>Name:</strong> ${order?.customerData?.fullName}</p>
                <p><strong>Address:</strong> ${order?.customerData?.address}</p>
                <p><strong>Location:</strong> ${order?.customerData?.city}, ${order?.customerData?.state} - ${order?.customerData?.pincode}</p>
                <p><strong>Phone:</strong> ${order?.customerData?.phone}</p>
                <p><strong>Email:</strong> ${order?.customerData?.email}</p>
              </div>
            </div>
            
            <div class="meta-card">
              <h3 class="card-title">Billing & Order Info</h3>
              <div class="card-content">
                <p><strong>Invoice ID:</strong> #${order.orderID}</p>
                <p><strong>Booking Date:</strong> ${dayjs(order.orderedAt).format('DD MMMM YYYY, hh:mm A')}</p>
                <p><strong>Order Status:</strong> ${order.orderStatus}</p>
                <p><strong>Payment Status:</strong> <span style="color: ${order.paymentStatus === 'Paid' ? '#16a34a' : '#dc2626'}; font-weight: bold;">${order.paymentStatus}</span></p>
              </div>
            </div>
          </div>

          <!-- Itemised table -->
          <table class="invoice-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th style="text-align: left;">Item Description</th>
                <th style="width: 100px; text-align: center;">Packing Type</th>
                <th style="width: 80px; text-align: center;">Qty</th>
                <th style="width: 100px; text-align: right;">Wholesale Price</th>
                <th style="width: 120px; text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Bottom calculations and signature -->
          <div class="bottom-layout">
            <div class="terms-info">
              <h4>Terms & Conditions</h4>
              <p style="margin: 4px 0;">1. All disputes are subject to Sivakasi Jurisdiction.</p>
              <p style="margin: 4px 0;">2. Goods once dispatched will not be returned or exchanged.</p>
              <p style="margin: 4px 0;">3. Transport charges must be paid directly to the transport parcel service.</p>
            </div>
            
            <div>
              <table class="summary-card">
                <tr>
                  <td style="color: #4b5563;">Sub Total:</td>
                  <td style="text-align: right; font-weight: 600;">₹${subTotal.toLocaleString('en-IN')}</td>
                </tr>
                ${couponCode ? `
                  <tr style="color: #16a34a; font-weight: 500;">
                    <td>Coupon (${couponCode}):</td>
                    <td style="text-align: right;">- ₹${couponDiscount.toLocaleString('en-IN')}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td style="color: #4b5563;">Secured Packing Sack:</td>
                  <td style="text-align: right; font-weight: 600;">${isPackingFree ? '<span style="color: #16a34a;">FREE</span>' : `₹${packingCharge.toLocaleString('en-IN')}`}</td>
                </tr>
                <tr class="total-row">
                  <td>Grand Total:</td>
                  <td style="text-align: right; font-weight: 800;">₹${totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
              
              <div class="signature-area">
                <p>For <strong>Mickey Crackers</strong></p>
                <div class="signature-line">Authorized Signatory</div>
              </div>
            </div>
          </div>

        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}
