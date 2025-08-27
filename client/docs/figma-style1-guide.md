# Figma Style 1 Design System

A complete, reusable design system for creating immersive vertical layouts with consistent interactions and mobile-first responsive design.

## Overview

Figma Style 1 provides a comprehensive design system featuring:
- **Mobile-first responsive design** with desktop white margins
- **Full-screen background images** with gradient overlays
- **Bottom-positioned content** for better visual hierarchy
- **Consistent button interactions** with hover/active states
- **Enhanced replay button** with SVG graphics and drop shadows
- **Accessibility support** with ARIA labels and screen reader content

## Quick Start

### Method 1: Using the Layout Component (Recommended)

```tsx
import FigmaStyle1Layout from '../components/layouts/FigmaStyle1Layout';

const MyPage = () => {
  return (
    <FigmaStyle1Layout
      backgroundImage="https://your-image-url.com/background.jpg"
      backgroundAlt="Your background description"
      title="Your Question Text Here"
      buttons={[
        {
          text: "Option 1",
          onClick: () => handleChoice('option1'),
          ariaLabel: "Description for option 1"
        },
        {
          text: "Option 2", 
          onClick: () => handleChoice('option2'),
          ariaLabel: "Description for option 2"
        }
      ]}
      replayButton={{
        onClick: () => handleReplay(),
        ariaLabel: "Replay content"
      }}
    />
  );
};
```

### Method 2: Using CSS Classes

```tsx
const MyPage = () => {
  return (
    <div className="figma-style1-container">
      <div className="figma-style1-content">
        {/* Background */}
        <div className="figma-style1-background">
          <img 
            src="your-background.jpg" 
            alt="Background" 
            className="figma-style1-background-image"
          />
          <div className="figma-style1-background-overlay" />
        </div>
        
        {/* Content */}
        <div className="figma-style1-main">
          <div className="figma-style1-content-area">
            <div className="figma-style1-title-container">
              <h1 className="figma-style1-title">Your Title</h1>
            </div>
            
            <div className="figma-style1-button-container">
              <button className="figma-style1-button">
                <span className="figma-style1-button-text">Button Text</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Design Specifications

### Layout Structure
- **Container**: Centered with white margins on desktop
- **Content Width**: 390px mobile, 420px tablet, 390px desktop
- **Background**: Full-screen with 2:3 aspect ratio
- **Content Position**: Bottom-aligned for better UX

### Typography
- **Title Font**: Kanit, responsive sizing (24px-30px)
- **Button Font**: Prompt, 18px medium weight
- **Colors**: White text on dark overlay

### Button System
- **Size**: Full width × 53px height
- **Style**: Yellow background (#EFBA31) with black border
- **Border**: 1.5px solid black, 40px border radius
- **Hover**: Black background with yellow text
- **Interactions**: Scale (1.05×) + shadow + color change

### Replay Button
- **Size**: 68×84px mobile, 76×95px desktop
- **Style**: SVG with yellow circle and drop shadow
- **Position**: Top-left with generous padding

### Responsive Breakpoints
- **Mobile**: < 390px (full width)
- **Tablet**: 390px - 420px 
- **Desktop**: > 421px (white margins appear)

## CSS Classes Reference

### Layout Classes
- `figma-style1-container` - Main outer container
- `figma-style1-content` - Content wrapper with max-width
- `figma-style1-main` - Main content flex container
- `figma-style1-content-area` - Bottom-aligned content area

### Background Classes  
- `figma-style1-background` - Background container
- `figma-style1-background-image` - Background image styling
- `figma-style1-background-overlay` - Gradient overlay

### Typography Classes
- `figma-style1-title` - Main title styling
- `figma-style1-title-container` - Title container with spacing

### Button Classes
- `figma-style1-button` - Main button styling with interactions
- `figma-style1-button-text` - Button text with hover states
- `figma-style1-button-container` - Button container with spacing

### Replay Button Classes
- `figma-style1-replay-button` - Replay button container
- `figma-style1-replay-svg` - Replay SVG sizing

## Color Variables

```css
:root {
  --figma-style1-primary: #EFBA31;        /* Yellow primary color */
  --figma-style1-text-dark: #000000;      /* Black text */
  --figma-style1-text-light: #FFFFFF;     /* White text */
  --figma-style1-overlay-start: rgba(0, 0, 0, 0.00);  /* Gradient start */
  --figma-style1-overlay-end: rgba(0, 0, 0, 0.90);    /* Gradient end */
}
```

## Best Practices

### Accessibility
- Always provide `aria-label` or `aria-describedby` for buttons
- Use semantic HTML elements (`h1`, `button`, etc.)
- Include screen reader only content for context
- Ensure sufficient color contrast

### Performance
- Optimize background images for web (WebP format recommended)
- Use appropriate image sizes for different screen densities
- Consider lazy loading for background images

### Responsive Design
- Test on multiple device sizes
- Ensure touch targets are minimum 44px
- Verify text readability at all sizes
- Check button interactions on mobile devices

## Examples

### Basic Question Page
```tsx
<FigmaStyle1Layout
  backgroundImage="/images/subway-station.jpg"
  title="จากข้อความดังกล่าว คุณมีความคิดเห็นอย่างไร"
  buttons={[
    { text: "เห็นด้วย", onClick: () => handleAgree() },
    { text: "กลางๆ", onClick: () => handleNeutral() },
    { text: "ไม่เห็นด้วย", onClick: () => handleDisagree() }
  ]}
  replayButton={{ onClick: () => handleReplay() }}
/>
```

### Survey Question
```tsx
<FigmaStyle1Layout
  backgroundImage="/images/office-scene.jpg"
  title="What is your opinion on this policy?"
  buttons={[
    { text: "Strongly Agree", onClick: () => handleChoice(5) },
    { text: "Agree", onClick: () => handleChoice(4) },
    { text: "Neutral", onClick: () => handleChoice(3) },
    { text: "Disagree", onClick: () => handleChoice(2) },
    { text: "Strongly Disagree", onClick: () => handleChoice(1) }
  ]}
/>
```

## Customization

### Adding Custom Styles
```css
/* Custom button variant */
.figma-style1-button.custom-variant {
  @apply bg-blue-500 border-blue-600;
}

.figma-style1-button.custom-variant .figma-style1-button-text {
  @apply text-white group-hover:text-blue-100;
}
```

### Extending the Component
```tsx
interface CustomFigmaStyle1Props extends FigmaStyle1LayoutProps {
  customProp?: string;
}

const CustomFigmaStyle1Layout: React.FC<CustomFigmaStyle1Props> = (props) => {
  return (
    <FigmaStyle1Layout
      {...props}
      className={`custom-styling ${props.className || ''}`}
    />
  );
};
```

## Migration Guide

### From Previous Designs
1. Replace existing layout containers with `figma-style1-container`
2. Update button classes to use `figma-style1-button` system
3. Ensure background images use the overlay system
4. Test all interactions and hover states
5. Verify responsive behavior across devices

## Support

For questions or issues with the Figma Style 1 design system:
- Check this documentation for usage examples
- Review the CSS file at `client/styles/figma-style1.css`
- Examine the layout component at `client/components/layouts/FigmaStyle1Layout.tsx`
- Test with the reference implementation in `Ask01Page.tsx`
