# Scaling Considerations - Minna Kattelus Art Gallery

## Current Architecture (v1.0)
- localStorage-based cart
- No user-specific cart persistence
- Direct inventory checks at checkout
- Single payment simulation

## Payment & Refund Handling (added 2026-07-06)

### Current: Simulated Payment Confirmation
Checkout has no real payment gateway integration yet (Stripe vs Paytrail compared in
`INTEGRACION_PAGOS.md`, neither implemented). `createOrder` marks every order
`paymentStatus: 'paid'` immediately on creation as a placeholder — this is **technical
debt**, not a real payment guarantee. Replace with actual gateway confirmation before
processing real transactions.

### Refund as a Two-Step Process
Cancelling a paid order and returning the money are treated as separate events in time
(a bank refund can take days). Cancelling a paid order automatically sets
`paymentStatus: 'refund_pending'`; a separate admin action
(`PATCH /api/orders/:orderId/refund`) records the actual refund (amount, date, method,
reference) and moves the order to `refunded`. This keeps a clean audit trail for
accounting/tax purposes instead of forcing the admin to know refund details at
cancellation time.

### Double-Sale Prevention via Active Order Lookup
`hasActiveOrderForArtwork()` (`server/src/utils/orderValidation.js`) checks whether any
non-cancelled order still references an artwork before letting it become `available`
again — whether via order cancellation, reverting a cancellation, or manually editing
the artwork in Artwork Management. This is a synchronous DB lookup, appropriate at
current volume. See "Trigger 3: Inventory Management Issues" below for when a more
robust reservation system (locking, TTL-based holds) becomes necessary.

## When to Scale

### Trigger 1: Multi-Device Users
**Symptoms:**
- Users asking "where's my cart on mobile?"
- Complaints about losing cart items

**Solution:** Implement server-side cart synchronization

### Trigger 2: High Traffic (>1000 daily visitors)
**Symptoms:**
- Double-sales occurring
- Checkout failures
- Slow page loads

**Solution:** Add Redis caching, item reservations, queue system

### Trigger 3: Inventory Management Issues
**Symptoms:**
- Artworks showing as available when sold
- Multiple users purchasing same item

**Solution:** Real-time inventory sync, optimistic locking

### Trigger 4: Marketing Needs
**Symptoms:**
- Need abandoned cart emails
- Want conversion analytics

**Solution:** Server-side cart tracking, analytics integration

## Implementation Priority
1. Server cart sync (if multi-device needed)
2. Item reservations (if double-sales occur)
3. Analytics (if marketing team requests)
4. Redis caching (only if performance issues)



## i18n Improvements (Future Refactor)

### Priority: Medium
### Effort: High (3-5 days)

### Current Implementation
- All locales use prefix: `/en/`, `/es/`, `/fi/`, `/sv/`, `/so/`
- Same slug across all languages: `/gallery`, `/shop`, etc.

### Recommended Changes

#### 1. Default Locale without Prefix
**Before:**
- `/en/gallery`
- `/es/gallery`

**After:**
- `/gallery` (default locale)
- `/es/galeria`

**Implementation:**
- Set `localePrefix: 'as-needed'` in middleware
- Define `NEXT_PUBLIC_DEFAULT_LOCALE` in .env

#### 2. Slug Translation (Localized Routes)
**Before:**
- All languages use English slugs

**After:**
- `/gallery` (en - default)
- `/es/galeria`
- `/fi/galleria`
- `/sv/galleri`
- `/so/bandhig` (or artist preference)

**Files to modify:**
- `middleware.js` - Add pathnames map
- `i18n/index.js` - Add route translations
- All `Link` components - Use `pathnames` from next-intl

### Environment Variable Approach
```env
# .env.local
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_AVAILABLE_LOCALES=en,es,fi,sv,so
```

**Benefits for Code Reusability:**
- Change default locale in one place
- Easy to add/remove languages
- No hardcoded locale logic

### Resources
- next-intl pathnames: https://next-intl-docs.vercel.app/docs/routing/navigation
- Middleware config: https://next-intl-docs.vercel.app/docs/routing/middleware

### Estimated Impact
- **SEO:** +30-40% improvement in non-English markets
- **UX:** Cleaner URLs for main audience
- **Development:** 3-5 days refactor + testing


## Order Number Generation Strategy

### Current Implementation
```
ORD-2026-0001
[Prefix]-[Year]-[Sequential]
```

### Recommended Improvements for Multi-Store/Multi-Product

#### 1. Store-Specific Prefixes
**Purpose:** Identify business/product type at a glance

**Examples:**
- `ART-2026-0001` - Minna Kattelus Art Gallery
- `TICO-2026-0001` - TicoShop (Costa Rica products)
- `CRC-2026-0001` - Alternative Costa Rica prefix
- `PRINT-2026-0001` - If selling prints/copies
- `ORIG-2026-0001` - Original artworks vs prints

**Implementation:**
```javascript
// In .env
ORDER_PREFIX=ART  // Change per store

// In Order model
this.orderNumber = `${process.env.ORDER_PREFIX}-${year}-${sequential}`;
```

**Benefits:**
- Easy filtering in database
- Clear business unit identification
- Customer support can instantly identify store
- Useful for multi-tenant platforms

#### 2. Adding Random Component
**Format:** `ART-20260119-R4D7-0001`

**Pros:**
- Harder to guess total orders (competitive intel)
- Prevents sequential scraping
- Adds uniqueness guarantee

**Cons:**
- Longer order numbers
- Less human-readable
- Harder to sort chronologically

**When to use:**
- High-security requirements
- Competitive market (hide volume)
- B2B with sensitive pricing

**When NOT to use:**
- Low volume business (art gallery)
- Customer service needs simple references
- Debugging/support scenarios

**Recommended for art gallery:** ❌ **Not needed**
- Volume is naturally low
- Customers prefer simple numbers
- Support team benefits from sequential

#### 3. Date Format Options

**Option A: Year only (Current)**
```
ART-2026-0001
```
- ✅ Short and clean
- ✅ Easy to read
- ❌ Resets yearly (potential confusion)

**Option B: Full date**
```
ART-20260119-0001
```
- ✅ Never resets
- ✅ Precise ordering
- ❌ Longer

**Option C: Year-Month**
```
ART-202601-0001
```
- ✅ Balanced
- ✅ Monthly reporting easier
- ❌ Still resets

**Recommended:** Keep **Option A** for simplicity

#### 4. Sequential Number Length

**Current:** 4 digits (0001-9999)

**Considerations:**
- 4 digits = 9,999 orders/year max
- Art gallery realistically: <100 orders/year
- **Overkill but future-proof ✅**

**If scaling to marketplace:**
- 5-6 digits for high-volume
- Or switch to timestamp-based

---

## Inventory Management - Advanced Options

### Current: Simple Availability Toggle
```javascript
available: true/false
```
**Works for:** Unique artworks (1 unit each)

### Option 1: Stock Reservations (For Prints/Copies)

**Use case:** Selling prints where multiple copies exist

**Implementation:**
```javascript
// Artwork schema
{
  stock: { type: Number, default: 1 },
  stockReserved: { type: Number, default: 0 },
  stockAvailable: { 
    type: Number, 
    default: function() { return this.stock; }
  }
}

// Reservation model
{
  artworkId: ObjectId,
  quantity: Number,
  reservedUntil: Date,  // 15 min from now
  sessionId: String
}
```

**Flow:**
1. User adds to cart → Create reservation (15 min)
2. Cron job every minute → Remove expired reservations
3. User completes checkout → Convert reservation to order
4. User abandons → Auto-release after 15 min

**Cron Job:**
```javascript
// In server
import cron from 'node-cron';

// Run every minute
cron.schedule('* * * * *', async () => {
  const expired = await Reservation.find({
    reservedUntil: { $lt: new Date() }
  });
  
  for (const res of expired) {
    await Artwork.updateOne(
      { _id: res.artworkId },
      { $inc: { stockReserved: -res.quantity } }
    );
    await res.remove();
  }
});
```

**When to implement:**
- Selling prints (multiple copies)
- Selling merchandise
- Converting to marketplace with inventory

**Complexity:** Medium (3-4 hours implementation)

---

### Option 2: Full Marketplace Inventory System

**Use case:** Multi-vendor marketplace or physical products

**Features:**
- Real-time stock tracking
- Low stock alerts
- Backorder management
- Variant inventory (sizes, colors)

**Schema:**
```javascript
{
  sku: String,
  stock: {
    total: Number,
    reserved: Number,
    sold: Number,
    damaged: Number,
    available: Number  // Calculated: total - reserved - sold - damaged
  },
  reorderPoint: Number,
  reorderQuantity: Number,
  variants: [{
    size: String,
    color: String,
    stock: Object  // Same structure
  }]
}
```

**When to implement:**
- Converting to multi-vendor marketplace
- Selling physical products with sizes/colors
- Need warehouse management

**Complexity:** High (1-2 weeks implementation)

---

## Migration Path: Art Gallery → Marketplace

### Phase 1: Current (Art Gallery)
- Unique artworks
- Simple availability flag
- Manual inventory management

### Phase 2: Add Prints (If Needed)
- Implement stock reservations
- Add print quantity tracking
- Keep original art as `stock: 1`

### Phase 3: Multi-Vendor Marketplace
- Full inventory system
- Vendor management
- Commission tracking
- Advanced reporting

### Phase 4: Generic E-commerce Platform
- White-label solution
- Configurable product types
- Multi-currency
- International shipping

**Estimated effort per phase:** 2-4 weeks each

---

## Configuration Strategy for Reusability

### Environment-Based Configuration

**`.env` structure:**
```env
# Business Identity
BUSINESS_NAME=Minna Kattelus Art Gallery
BUSINESS_TYPE=art_gallery  # art_gallery, marketplace, ecommerce
ORDER_PREFIX=ART
DEFAULT_CURRENCY=EUR

# Feature Flags
ENABLE_PRINTS=false
ENABLE_STOCK_RESERVATIONS=false
ENABLE_MULTI_VENDOR=false
ENABLE_VARIANTS=false

# Inventory Settings
RESERVATION_TIMEOUT_MINUTES=15
LOW_STOCK_THRESHOLD=5
```

**Usage in code:**
```javascript
// Order number generation
const prefix = process.env.ORDER_PREFIX || 'ORD';

// Feature checks
if (process.env.ENABLE_STOCK_RESERVATIONS === 'true') {
  // Implement reservation logic
}
```

### Benefits:
- ✅ Single codebase for multiple stores
- ✅ Easy to spin up new store
- ✅ Feature flags for A/B testing
- ✅ Clean separation of concerns

---

## Decision Matrix: When to Implement What

| Feature | Art Gallery | Prints Shop | Marketplace | Generic Store |
|---------|-------------|-------------|-------------|---------------|
| Simple availability | ✅ | ❌ | ❌ | ❌ |
| Stock tracking | ❌ | ✅ | ✅ | ✅ |
| Reservations | ❌ | ✅ | ✅ | ✅ |
| Multi-vendor | ❌ | ❌ | ✅ | Optional |
| Variants | ❌ | Optional | ✅ | ✅ |
| Custom prefixes | Optional | ✅ | ✅ | ✅ |
| Random in order# | ❌ | ❌ | Optional | Optional |

---

## Recommended Implementation Order

### Now (MVP - Art Gallery)
1. Keep simple `ORD-YYYY-NNNN` format
2. Keep `available: Boolean`
3. Document everything in SCALING.md ✅

### Next Project (TicoShop or similar)
1. Change `ORDER_PREFIX` in .env
2. Evaluate if prints/stock needed
3. Implement reservations if needed

### Future (Marketplace Platform)
1. Full inventory system
2. Multi-vendor support
3. White-label configuration