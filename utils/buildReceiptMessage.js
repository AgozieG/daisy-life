export function buildReceiptMessage({ reference, cartItems, deliveryDetails, userProfile, deliveryType, paidAmount }) {
  const itemLines = cartItems
    .map((item) => {
      const toppingList = item.selectedToppings?.length
        ? `\n    Extras: ${item.selectedToppings.map((t) => t.name).join(', ')}`
        : '';
      const flavourLine = item.selectedFlavours?.length ? `\n    Flavour: ${item.selectedFlavours.join(', ')}` : '';
      const variantLine = item.selectedVariant ? `\n    Size/Type: ${item.selectedVariant}` : '';
      const drinkLine = item.selectedDrink ? `\n    Drink: ${item.selectedDrink}` : '';
      const noteLines = item.specialInstructions ? `\n    Note: "${item.specialInstructions}"` : '';
      return `▸ ${item.productName} ×${item.quantity} — ₦${item.lineTotal.toLocaleString()}${variantLine}${flavourLine}${toppingList}${drinkLine}${noteLines}`;
    })
    .join('\n');

  const deliveryBlock =
    deliveryType === 'delivery'
      ? `🛵 *DELIVERY*\n📍 Address: ${deliveryDetails.address}\n📝 Note: ${deliveryDetails.deliveryNote || 'None'}`
      : `🏃 *PICKUP*\n📍 Customer picking up at the restaurant`;

  return `
🌼 *NEW ORDER — DAISY LIFE* 🌼
━━━━━━━━━━━━━━━━━━━━━
🔖 Order Ref: *${reference}*
🕐 Time: ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}
━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS*
Name: ${userProfile.name}
Email: ${userProfile.email}
Phone: ${deliveryDetails.phone}
━━━━━━━━━━━━━━━━━━━━━
🛒 *ORDER ITEMS*
${itemLines}
━━━━━━━━━━━━━━━━━━━━━
${deliveryBlock}
━━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL PAID: ₦${paidAmount.toLocaleString()}*
✅ PAYMENT VERIFIED BY PAYSTACK
━━━━━━━━━━━━━━━━━━━━━
`.trim();
}
