# Luxury UI: Images & Effects Guide

This doc describes how images and canvas-style effects are used in the Kolia mobile app and where to add your own assets.

---

## 1. Asset structure

```
mobile/assets/
├── icon.png, favicon.png, adaptive-icon.png, splash-icon.png  # App icons
├── logo.png                                                    # Brand logo
├── IMAGE_ATTRIBUTION.md                                        # Credits (Unsplash, etc.)
├── onboarding/                                                 # Onboarding & auth heroes
│   ├── african-cuisine.jpg     # African food (Senegalese Yassa)
│   ├── jollof-restaurant.jpg   # Jollof rice – also used in empty states
│   ├── delivery.jpg            # Delivery rider
│   └── restaurant-interior.jpg # Curated restaurants slide
├── decorative/                                                 # Optional: textures, patterns
│   ├── paper-texture.png       # Subtle overlay for LuxuryBackground
│   ├── fabric-pattern.png      # Section dividers or cards
│   └── ...
└── illustrations/                                              # Optional: empty states, success
    ├── empty-cart.png
    ├── empty-orders.png
    ├── success-order.png
    └── ...
```

- **Onboarding / auth**: Use high-quality photos (e.g. African cuisine, delivery). Prefer local assets (`require('../assets/onboarding/...')`) so the app works offline and feels fast.
- **Decorative**: Low-opacity textures (paper, fabric, grain) overlay the gradient background for depth.
- **Illustrations**: Used in empty states, success screens, or error fallbacks. SVG or PNG with transparent background.

---

## 2. Where images are used

| Place | Current use | Optional upgrade |
|-------|-------------|------------------|
| **Onboarding** | 3 local hero images + restaurant-interior (slide 2) | Add more slides or swap images |
| **Login** | Hero: `african-cuisine.jpg` + effects | — |
| **LuxuryBackground** | Gradient + optional texture + animated overlay | All main screens use a texture (0.04–0.045) |
| **EmptyState** | Optional image (cart, orders, search use onboarding assets) | Add custom illustrations in `assets/illustrations/` |
| **Profile / Home / Search / Orders** | Texture on background (african-cuisine, jollof, delivery, restaurant-interior) | — |
| **Cart / Checkout / Restaurant / Tracking / Confirmation / Auth** | Texture on LuxuryBackground | — |
| **Restaurant cards** | Remote `image_url` | Fallback local placeholder |

---

## 3. Effects and “canvas-style” animations

Built with **React Native Reanimated** and **react-native-svg** (no external canvas lib). All effects are lightweight and run on the native thread.

### Current effects

- **WarmthGlow**: Large animated blurs (orange, gold, green) that scale and fade – warmth of shared meal.
- **SpiceParticles**: Small dots rising and drifting (amber/gold) – steam/spice from African cuisine.
- **AfricanPatternOverlay**: SVG diamond pattern with shimmer opacity – kente/mudcloth inspired.
- **DeliveryPath**: Animated path (onboarding slide 3) – delivery route.
- **LinearGradient**: Static gradients for headers, cards, buttons.

### Implemented effects

- **LuxuryBackground** (enhanced): Optional `textureImage` (e.g. paper texture or a photo at very low opacity) with `textureOpacity` (default `0.08`; use `0.04`–`0.05` for photos so they stay subtle). Optional `animatedOverlay` – a second gradient layer that slowly shifts for a “living” background. **Home** uses the jollof image as a light texture (`textureOpacity={0.045}`).
- **DecorativeImageOverlay**: Full-bleed or contained image with gradient overlay for hero sections or cards (image + gradient for text readability).
- **FlowingShapes**: SVG circles with Reanimated translate/opacity – canvas-style floating shapes in brand colors (used on login hero). Add `<FlowingShapes />` to any screen for subtle motion.
- **EmptyState**: Optional `image` prop – show an illustration (e.g. `empty-cart.png`) above the title instead of or in addition to an icon.

### Future options (not in repo yet)

- **Lottie** (`lottie-react-native`): Pre-made vector animations for loading, success, empty state.
- **Skia** (`@shopify/react-native-skia`): True canvas – custom particle systems, gradient meshes, complex paths. Heavier dependency.

---

## 4. Adding a new image

1. Drop the file under `assets/` (e.g. `assets/decorative/paper-texture.png`).
2. Use it with `require`:

   ```ts
   const texture = require('../../assets/decorative/paper-texture.png');
   <Image source={texture} style={StyleSheet.absoluteFill} resizeMode="cover" />
   ```

3. For **expo-image** (caching, priority):

   ```ts
   import { Image } from 'expo-image';
   <Image source={texture} style={StyleSheet.absoluteFill} contentFit="cover" />
   ```

---

## 5. Adding a new effect

- **Reanimated**: Use `useSharedValue` + `useAnimatedStyle` for layout/opacity/transform. No JS bridge after first run.
- **SVG**: Use `react-native-svg` (Svg, Path, Circle, etc.). For animation, drive props from Reanimated (e.g. `strokeDashoffset`, or wrap in `Animated.View` and animate transform/opacity).
- Keep effects **pointerEvents="none"** and avoid heavy work on the JS thread so scrolling stays smooth.
