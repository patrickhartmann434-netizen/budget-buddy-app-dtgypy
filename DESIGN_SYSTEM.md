
# BudgetBuddy Design System

## Color Palette

### Primary Colors
- **Primary**: `#3F51B5` (Indigo) - Main brand color, used for primary actions
- **Secondary**: `#E91E63` (Pink) - Accent color for secondary actions
- **Accent**: `#00BCD4` (Cyan) - Highlights and special features

### Semantic Colors
- **Success**: `#4CAF50` (Green) - Positive actions, income, savings
- **Warning**: `#FF9800` (Orange) - Warnings, approaching limits
- **Error**: `#F44336` (Red) - Errors, expenses, over budget

### Neutral Colors
- **Background**: `#F9F9F9` (Light Gray) - Main background
- **Card**: `#FFFFFF` (White) - Card backgrounds
- **Text**: `#212121` (Dark Gray) - Primary text
- **Text Secondary**: `#757575` (Medium Gray) - Secondary text
- **Border**: `#E0E0E0` (Light Gray) - Borders and dividers

### Dark Mode Colors
The app automatically adapts to dark mode using the system theme:
- Background: `rgb(1, 1, 1)` - True black for OLED
- Card: `rgb(28, 28, 30)` - Dark card surfaces
- Text: `rgb(255, 255, 255)` - White text
- Border: `rgb(44, 44, 46)` - Dark borders

## Typography

### Font Weights
- **Regular**: 400 - Body text
- **Medium**: 500 - Subheadings, labels
- **Semi-Bold**: 600 - Card titles, buttons
- **Bold**: 700 - Page titles, emphasis

### Font Sizes
- **Header Title**: 32px - Main page titles
- **Section Title**: 20-22px - Section headings
- **Card Title**: 18px - Card headings
- **Body**: 16px - Regular text
- **Body Small**: 14px - Secondary information
- **Caption**: 12-13px - Labels, metadata

## Spacing

### Padding
- **Screen Padding**: 16px - Horizontal screen padding
- **Card Padding**: 16-24px - Internal card padding
- **Section Spacing**: 24px - Between major sections
- **Item Spacing**: 8-12px - Between list items

### Border Radius
- **Large Cards**: 20px - Main feature cards
- **Medium Cards**: 16px - Standard cards
- **Small Cards**: 12px - Compact cards
- **Buttons**: 8-12px - Action buttons
- **Icons**: 24px (50% for circles) - Icon containers

## Components

### Cards
```typescript
{
  borderRadius: 16,
  padding: 16-24,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  elevation: 2-4,
  backgroundColor: theme.colors.card
}
```

### Buttons
```typescript
Primary: {
  backgroundColor: colors.primary,
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 12,
  color: '#fff'
}
```

### Progress Bars
- Height: 8px
- Border Radius: 4px
- Colors: Success (green), Warning (orange), Error (red)

### Icons
- Small: 20px
- Medium: 24px
- Large: 32px
- Extra Large: 48-80px (profile, empty states)

## Shadows & Elevation

### Light Mode
- **Card Shadow**: `0px 2px 8px rgba(0, 0, 0, 0.1)`
- **Elevated Card**: `0px 4px 12px rgba(0, 0, 0, 0.1)`
- **Android Elevation**: 2-4

### Dark Mode
- Shadows are less prominent
- Rely more on borders and background color differences

## Accessibility

### Contrast Ratios
- All text meets WCAG AA standards (4.5:1 for normal text)
- Interactive elements have clear focus states
- Color is not the only indicator of state

### Touch Targets
- Minimum size: 44x44 points (iOS HIG)
- Adequate spacing between interactive elements
- Clear visual feedback on press

### Screen Reader Support
- All interactive elements have accessibility labels
- Meaningful hints provided for complex interactions
- Proper heading hierarchy

## Platform-Specific Design

### iOS
- Uses native tab bar with SF Symbols
- Large navigation titles
- System fonts (SF Pro)
- Native haptic feedback
- Follows iOS Human Interface Guidelines

### Android
- Custom floating tab bar
- Material Design icons
- Roboto font family
- Material elevation and shadows
- Follows Material Design guidelines

## Animation Guidelines

### Timing
- Quick transitions: 200ms
- Standard transitions: 300ms
- Complex animations: 400-500ms

### Easing
- Standard: ease-in-out
- Enter: ease-out
- Exit: ease-in

### Types
- Fade in/out for content changes
- Slide for navigation
- Scale for emphasis
- No jarring or excessive animations

## Best Practices

1. **Consistency**: Use the same patterns throughout the app
2. **Clarity**: Make sure all actions are clear and predictable
3. **Feedback**: Provide immediate visual feedback for all interactions
4. **Performance**: Keep animations smooth (60fps)
5. **Accessibility**: Ensure the app is usable by everyone
6. **Platform Conventions**: Respect platform-specific patterns
7. **Dark Mode**: Test all screens in both light and dark modes
8. **Error States**: Always show helpful error messages
9. **Loading States**: Indicate when data is being loaded
10. **Empty States**: Provide guidance when there's no data

## Component Library

All reusable components are located in the `/components` folder:
- `BudgetOverview.tsx` - Budget display with progress bars
- `RecentTransactions.tsx` - Transaction list with icons
- `QuickActions.tsx` - Action button grid
- `FloatingTabBar.tsx` - Custom tab navigation
- `IconSymbol.tsx` - Cross-platform icon component

## Resources

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
