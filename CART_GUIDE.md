# Shopping Cart & Row Pricing Guide

## 🛒 How the Cart System Works

### Automatic Row Pricing
The system automatically applies row discounts for ANY product where you set a "Per Row" price in the admin panel.

### Default Row Configuration
- **1 Row = 5 pieces**
- **1 Half Row = 3 pieces**

### Example: Larsor Chicken Seasoning
- Single unit: ₦200
- Per Row (5 pieces): ₦800
- **Customer buys 7 pieces:**
  - System calculates: 1 row (₦800) + 2 units (₦400) = ₦1,200
  - Saves customer ₦200!

## 📝 How to Set Up Row Pricing

### In Admin Panel:
1. Go to Add/Edit Product
2. Fill in pricing:
   - **Pack/Carton Price**: Main selling price (single unit)
   - **Per Row**: Price for 5 pieces (discounted)
   - **Half Row**: Price for 3 pieces (optional)
   - **Per Unit**: Alternative single price (optional)

### Example Setup:
```
Product: Gino Tomato Mix Sachet
- Single Unit: ₦200
- Per Row: ₦800 (5 pieces)
- Notes: "Buy 5 for ₦800 - Save ₦200!"
```

## 🎯 Products with Row Pricing

Currently configured:
1. **Larsor Chicken Seasoning** - ₦200/unit, ₦800/row
2. **Gino Asun Flavoured** - ₦200/unit, ₦800/row
3. **Gino Pepper & Onion** - ₦200/unit, ₦800/row
4. **Gino Plain Tomato Mix** - ₦200/unit, ₦800/row
5. **Tasty Tom Tomato Mix** - ₦200/unit, ₦800/row
6. **Topisto Tomato Mix** - ₦150/unit, ₦650/row

## 💡 Customer Experience

### What Customers See:
1. **Product Card**: "💰 Row Deal" badge on products with row pricing
2. **Product Details**: Shows all pricing options (unit, row, half-row)
3. **Cart**: Automatically calculates best price
   - Shows "2 rows + 3 units" breakdown
   - Real-time total updates

### Cart Features:
- ✅ Add to cart from product card
- ✅ Adjust quantity with +/- buttons
- ✅ Automatic row discount calculation
- ✅ Remove items or clear cart
- ✅ Send order via WhatsApp

## 🚀 Quick Tips

### For Fast Service:
1. Customer says "5 Larsor Chicken"
2. Click product card → Add to Cart
3. Adjust quantity to 5
4. Cart shows: "1 row - ₦800"
5. Click "Send Order via WhatsApp"
6. Done in seconds!

### Adding More Row Products:
1. Edit any product in admin
2. Set "Per Row" price
3. Add note: "Sold in rows of 5"
4. Save - it works automatically!

## 📊 Pricing Logic

```
If product has pricePerRow:
  rows = quantity ÷ 5
  remaining = quantity % 5
  total = (rows × pricePerRow) + (remaining × sellingPrice)

Example: 12 pieces at ₦200/unit, ₦800/row
  = 2 rows (₦1,600) + 2 units (₦400)
  = ₦2,000 (saves ₦400!)
```

## 🎨 Visual Indicators

- **Orange "💰 Row Deal" badge** = Product has row pricing
- **Green price tag** = Single unit price
- **Cart breakdown** = Shows rows + remaining units
- **Real-time total** = Updates as you adjust quantity

---

**No coding needed!** Just set the prices in admin panel and the system handles everything automatically! 🎉
