# Illustration assets

Drop optional illustrations here for empty states, success screens, or error fallbacks.

Suggested files (PNG or SVG, transparent background):

- **empty-cart.png** – Cart empty state
- **empty-orders.png** – Orders list empty
- **empty-search.png** – No search results
- **success-order.png** – Order confirmation

Use in code:

```ts
import { EmptyState } from '../src/components/ui/EmptyState';
const emptyCartImg = require('../assets/illustrations/empty-cart.png');
<EmptyState image={emptyCartImg} title={t('cart.empty')} ... />
```

See `docs/LUXURY_IMAGES_AND_EFFECTS.md` for the full guide.
