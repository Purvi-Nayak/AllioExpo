# Responsive Web Layout with Drawer Navigation

## Changes Made

### 1. Drawer Navigation for Web
- Created `_layout.web.tsx` with a permanent drawer navigation for web platforms
- The drawer shows navigation items vertically on the side
- Mobile devices still use the bottom tab navigation

### 2. Responsive Home Screen
- Updated the home screen to use different layouts for web vs mobile
- Web layout accounts for the drawer width and provides better responsive design
- Mobile layout maintains the original Container component structure

### 3. Responsive Components
- Updated `ImageSlider`, `HeroSection`, `FeaturesCarousel`, `FeatureCard`, and `ContactUsSection` to be responsive
- Web layouts use grid systems and proper spacing for larger screens
- Mobile layouts maintain the original carousel and compact designs

### 4. Responsive Utilities
- Enhanced the `responsive.ts` utility to handle web scaling better
- Created `ResponsiveWrapper` component for consistent web layouts

## Key Features

### Web Layout
- **Permanent Drawer**: Fixed side navigation that doesn't overlay content
- **Responsive Grid**: Features are displayed in a 3-column grid instead of carousel
- **Better Spacing**: Optimized padding and margins for larger screens
- **Typography**: Adjusted font sizes for better readability on web

### Mobile Layout
- **Bottom Tabs**: Maintains the original tab navigation at the bottom
- **Carousel**: Features still use the horizontal carousel for mobile
- **Touch-Optimized**: Maintains touch-friendly sizing and spacing

## How It Works

1. **Platform Detection**: `_layout.tsx` checks if the platform is web and conditionally renders the drawer layout
2. **Drawer Navigation**: Web users see a permanent side drawer with navigation items
3. **Responsive Content**: Each component adapts its layout based on the platform
4. **Consistent Routing**: Both layouts use the same routing structure

## Usage

The app will automatically:
- Show drawer navigation on web browsers
- Show tab navigation on mobile devices (iOS/Android)
- Adapt component layouts based on screen size
- Maintain consistent functionality across platforms

## Screen Sizes

The responsive design works well for:
- **Mobile**: 375px and up
- **Tablet**: 768px and up  
- **Desktop**: 1024px and up
- **Large Desktop**: 1440px and up

All components scale appropriately within these ranges.