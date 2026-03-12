# Decorative assets

Drop optional texture or pattern images here for luxury UI overlays.

- **paper-texture.png** – Subtle grain overlay for `LuxuryBackground` (use with `textureImage` prop).
- **fabric-pattern.png** – Optional section or card backgrounds.

Use in code:

```ts
import { LuxuryBackground } from '../src/components/ui/LuxuryBackground';
const texture = require('../assets/decorative/paper-texture.png');
<LuxuryBackground textureImage={texture} />
```

See `docs/LUXURY_IMAGES_AND_EFFECTS.md` for the full guide.
