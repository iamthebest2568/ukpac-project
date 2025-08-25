# UK PACK Project Structure

## Overview

The UK PACK project has been restructured to use proper React Router routing with individual editable pages while maintaining all functionality.

## Project Structure

### 📁 `/pages/` - Individual Pages (Editable)

Each page corresponds to a specific step in the user journey and can be edited independently:

- `DashboardIndex.tsx` - Main landing page
- `Index.tsx` - Alternative entry point (redirects to main)
- `NotFound.tsx` - 404 error page

#### Survey Journey Pages

- `Ask01Page.tsx` - Initial policy stance
- `Ask02Page.tsx` - Reasoning selection
- `Ask02_2Page.tsx` - Custom reasoning input
- `Ask04Page.tsx` - Satisfaction rating (MN1/MN2 path)
- `Ask04BudgetPage.tsx` - Satisfaction rating (MN3 path)
- `Ask05Page.tsx` - User suggestions

#### Mini-Game Pages

- `MiniGameMN1Page.tsx` - Policy priorities selection
- `MiniGameMN2Page.tsx` - Beneficiary groups selection
- `MiniGameMN3Page.tsx` - Budget allocation

#### Other Journey Pages

- `SourceSelectionPage.tsx` - Information source selection
- `FakeNewsPage.tsx` - Media literacy test
- `BudgetPage.tsx` - Legacy budget allocation
- `EndSequencePage.tsx` - Reward decision and thank you
- `EndScreenPage.tsx` - Final completion screen

### 📁 `/hooks/` - Shared Logic

- `useSession.tsx` - Session management, navigation, and data storage
- `useFlowNavigation.tsx` - Flow completion handlers for mini-games
- `use-accessibility.tsx` - Accessibility utilities
- `use-mobile.tsx` - Mobile responsive utilities
- `use-toast.ts` - Toast notifications

### 📁 `/components/` - Reusable Components

#### Journey Components (`/journey/`)

Core survey components used by pages:

- `Ask01.tsx`, `Ask02.tsx`, `Ask02_2.tsx` - Survey questions
- `Ask04.tsx`, `Ask04Budget.tsx`, `Ask05.tsx` - Satisfaction and suggestions
- `SourceSelection.tsx` - Information source picker

#### Flow Components (`/flows/`)

Multi-step mini-game containers:

- `Flow_MiniGame_MN1.tsx` - Policy priorities flow
- `Flow_MiniGame_MN2.tsx` - Beneficiary groups flow
- `Flow_MiniGame_MN3.tsx` - Budget allocation flow
- `Flow_EndSequence.tsx` - Final sequence flow

#### Game Components (`/games/`)

Individual game mechanics:

- `FakeNewsTest.tsx` - Media literacy test
- `BudgetAllocation.tsx` - Legacy budget game
- `ThankYouScreen.tsx` - Completion screen

#### Dashboard Components (`/dashboard/`)

Analytics and admin interface:

- `DashboardApp.tsx` - Main dashboard container
- `LoginPage.tsx` - Authentication
- `Dashboard.tsx` - Main dashboard view
- `WorkingDashboard.tsx` - Simplified dashboard implementation

### 📁 `/services/` - Data Services

- `dataLogger.js` - Event logging to localStorage
- `/data/realTimeDashboardService.js` - Dashboard data processing
- `/data/dashboardService.js` - Dashboard utilities

## Routing Structure

### New Routes (Clean URLs)

```
/ → Main landing page
/ask01 → Initial policy stance
/ask02 → Reasoning selection
/ask02-2 → Custom reasoning
/ask04 → Satisfaction (MN1/MN2)
/ask04-budget → Satisfaction (MN3)
/ask05 → User suggestions
/minigame-mn1 → Policy priorities
/minigame-mn2 → Beneficiary groups
/minigame-mn3 → Budget allocation
/source-selection → Information source
/fake-news → Media literacy test
/budget → Legacy budget game
/end-sequence → Reward & thank you
/end-screen → Final completion
/dashboard → Analytics dashboard
```

### Legacy Support

The system automatically translates old gameID parameters to new routes:

- `?gameID=ask01` → `/ask01`
- `?gameID=Flow_MiniGame_MN1` → `/minigame-mn1`
- etc.

## Key Features

### ✅ Individual Page Editing

- Each route has its own page file in `/pages/`
- Pages can be edited independently
- All functionality preserved

### ✅ Shared State Management

- Session data managed by `useSession` hook
- Navigation handled centrally with route translation
- Real-time event logging maintained

### ✅ Backwards Compatibility

- Old URL parameters automatically redirected
- Existing components work without modification
- Legacy navigation calls translated to new routes

### ✅ Optimized Structure

- Removed redundant components
- Clean separation of concerns
- Proper React Router implementation

## Development Workflow

### Editing Pages

1. Navigate to `/pages/` folder
2. Find the page you want to edit (e.g., `Ask01Page.tsx`)
3. Edit the page while keeping the component imports and props
4. The underlying functionality remains intact

### Adding New Pages

1. Create new page in `/pages/` folder
2. Add route to `App.tsx`
3. Add route translation to `useSession.tsx` if needed

### Session Management

- Use `useSession()` hook for navigation and data
- Use `navigateToPage(path, data)` for navigation
- Session data automatically preserved across routes

## Data Flow

1. **User Actions** → Logged via `dataLogger.js`
2. **Navigation** → Handled by `useSession` hook
3. **State Management** → Centralized in session hooks
4. **Analytics** → Real-time processing in dashboard services

This structure provides maximum flexibility for editing individual pages while maintaining all the complex journey logic and data collection functionality.
