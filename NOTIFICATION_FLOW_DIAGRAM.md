# 🎯 Transaction Notification Flow - Visual Guide

## 📱 Complete Transaction Flow with Notifications

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INITIATES TRANSACTION                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐   ┌────▼────┐   ┌─────▼─────┐
              │  Airtime  │   │  Data   │   │ Transfer  │
              │   Modal   │   │  Modal  │   │  Modals   │
              └─────┬─────┘   └────┬────┘   └─────┬─────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      LoadingScreen.tsx        │
                    │   (5 second processing)       │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      PaymentScreen.tsx        │
                    │      (PIN Entry - 4 digits)   │
                    │                               │
                    │   PIN ≠ "0000" → SUCCESS      │
                    │   PIN = "0000" → FAILURE      │
                    └───────────────┬───────────────┘
                                    │
        ┌───────────────────────────▼───────────────────────────┐
        │          TransactionResultScreen.tsx                  │
        │                                                       │
        │  ┌──────────────────────────────────────────────┐   │
        │  │         useEffect Hook Triggers              │   │
        │  │    (Automatic on transaction complete)       │   │
        │  └───────────────────┬──────────────────────────┘   │
        │                      │                               │
        │      ┌───────────────┼───────────────┐              │
        │      │               │               │              │
        │  ┌───▼────┐    ┌────▼─────┐   ┌────▼────┐         │
        │  │ Toast  │    │ Storage  │   │  Badge  │         │
        │  │ Notify │    │   Add    │   │ Update  │         │
        │  └───┬────┘    └────┬─────┘   └────┬────┘         │
        └──────┼──────────────┼──────────────┼───────────────┘
               │              │              │
               │              │              │
        ┌──────▼─────┐ ┌─────▼─────┐ ┌─────▼──────┐
        │            │ │           │ │            │
        │ 🔔 Toast   │ │ 📱 Center │ │ 🔴 Badge   │
        │   Shows    │ │  Stores   │ │  Updates   │
        │            │ │           │ │            │
        └────────────┘ └───────────┘ └────────────┘
```

## 🎨 Notification Components

```
┌─────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         NotificationContext.tsx                     │    │
│  │         (Global State Management)                   │    │
│  │                                                      │    │
│  │  • notifications: StoredNotification[]              │    │
│  │  • activeNotifications: InAppNotification[]         │    │
│  │  • unreadCount: number                              │    │
│  │  • showNotification()                               │    │
│  │  • addNotification()                                │    │
│  │  • markAsRead()                                     │    │
│  │  • deleteNotification()                             │    │
│  └──────────────────┬───────────────────────────────────┘    │
│                     │                                        │
│        ┌────────────┼─────────────┐                         │
│        │            │             │                         │
│  ┌─────▼─────┐ ┌───▼────┐ ┌──────▼─────┐                  │
│  │ Toast     │ │Service │ │   Screen   │                  │
│  │Component  │ │ Logic  │ │Integration │                  │
│  └───────────┘ └────────┘ └────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    TRANSACTION HAPPENS                        │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  TransactionResultScreen receives:                           │
│  • status: 'success' | 'error'                              │
│  • message: string                                           │
│  • transaction: { type, amount, network, contact, ... }      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  useEffect hook extracts:                                    │
│  • Transaction type (Airtime/Data/Internal/Bank)            │
│  • Amount (formatted: ₦X,XXX)                               │
│  • Recipient (phone/usertag/account name)                   │
│  • Status (success/failure)                                  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  Creates notification object:                                │
│  {                                                           │
│    type: 'transaction',                                      │
│    title: 'Airtime Purchase Successful',                    │
│    message: 'You purchased ₦500 MTN airtime...',           │
│    timestamp: 'Just now',                                    │
│    date: 'Today',                                           │
│    read: false,                                              │
│    icon: 'success',                                          │
│    amount: '-₦500'                                          │
│  }                                                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
        ┌───────────┐ ┌──────────┐ ┌────────────┐
        │showNotif  │ │addNotif  │ │Service     │
        │ication()  │ │ication() │ │.notify()   │
        └─────┬─────┘ └────┬─────┘ └─────┬──────┘
              │            │             │
              ▼            ▼             ▼
        ┌───────────┐ ┌──────────┐ ┌────────────┐
        │Toast      │ │Storage   │ │Subscribers │
        │Component  │ │Update    │ │Notified    │
        └───────────┘ └────┬─────┘ └────────────┘
                           │
                           ▼
                    ┌────────────┐
                    │Badge       │
                    │Updates     │
                    └────────────┘
```

## 📊 State Updates

```
BEFORE TRANSACTION:
┌──────────────────────┐
│ unreadCount: 0       │
│ notifications: []    │
│ badge: hidden        │
└──────────────────────┘

AFTER TRANSACTION:
┌──────────────────────┐
│ unreadCount: 1       │ ← Updates
│ notifications: [     │
│   {                  │
│     title: '...',    │ ← New notification added
│     read: false,     │
│     ...              │
│   }                  │
│ ]                    │
│ badge: "1"           │ ← Shows on icon
└──────────────────────┘

USER MARKS AS READ:
┌──────────────────────┐
│ unreadCount: 0       │ ← Decrements
│ notifications: [     │
│   {                  │
│     title: '...',    │
│     read: true,      │ ← Updated
│     ...              │
│   }                  │
│ ]                    │
│ badge: hidden        │ ← Hides
└──────────────────────┘
```

## 🎭 Transaction Type Detection

```
transaction.type === 'Airtime'
    ↓
    ┌───────────────────────────────────┐
    │ "Airtime Purchase Successful"     │
    │ "You purchased ₦X network..."     │
    │ icon: 'success'                   │
    └───────────────────────────────────┘

transaction.type === 'Data'
    ↓
    ┌───────────────────────────────────┐
    │ "Data Purchase Successful"        │
    │ "You purchased Xgb network..."    │
    │ icon: 'success'                   │
    └───────────────────────────────────┘

transaction.type === 'Internal Transfer'
    ↓
    ┌───────────────────────────────────┐
    │ "Money Sent"                      │
    │ "You sent ₦X to @user..."        │
    │ icon: 'sent'                      │
    └───────────────────────────────────┘

transaction.type === 'Bank Transfer'
    ↓
    ┌───────────────────────────────────┐
    │ "Transfer Successful"             │
    │ "Your transfer of ₦X to..."      │
    │ icon: 'sent'                      │
    └───────────────────────────────────┘

status === 'error'
    ↓
    ┌───────────────────────────────────┐
    │ "[Type] Failed"                   │
    │ "Failed to... [reason]"           │
    │ icon: 'failed'                    │
    └───────────────────────────────────┘
```

## 🚀 Execution Timeline

```
0ms    User confirms transaction
       ↓
500ms  LoadingScreen appears
       ↓
5000ms LoadingScreen navigates to PaymentScreen
       ↓
5500ms User enters PIN
       ↓
10000ms PaymentScreen navigates to TransactionResultScreen
       ↓
10001ms useEffect hook fires
       ↓
10002ms showNotification() called
       │   └─→ Toast appears at top (animated slide in)
       │
       ├─→ addNotification() called
       │   └─→ Notification added to center
       │
       └─→ Badge updates
           └─→ HomeScreen icon shows count

10003ms User sees:
        • Green toast at top
        • Success GIF in center
        • Badge on notification icon
        • Transaction in notification center

15003ms Toast auto-dismisses (after 5 seconds)
        • User can swipe up to dismiss earlier
        • Badge remains until marked as read
```

## 🎨 UI Components Involved

```
┌────────────────────────────────────────────────────┐
│  App.tsx                                           │
│  └─ NotificationProvider                           │
│     └─ RootNavigator                               │
│        ├─ App Stack (Tabs)                         │
│        │  ├─ HomeScreen                            │
│        │  │  └─ 🔔³ Badge                          │
│        │  ├─ TransactionsScreen                    │
│        │  └─ SettingsScreen                        │
│        │                                            │
│        ├─ Modal Stack                              │
│        │  ├─ NotificationsScreen                   │
│        │  ├─ AirtimeModal                          │
│        │  ├─ DataModal                             │
│        │  └─ ...                                    │
│        │                                            │
│        └─ Other Screens                            │
│           ├─ LoadingScreen                         │
│           ├─ PaymentScreen                         │
│           └─ TransactionResultScreen 🎯            │
│              └─ useEffect triggers notifications   │
│                                                     │
│     └─ NotificationContainer                       │
│        └─ [NotificationToast] ← Floating          │
└────────────────────────────────────────────────────┘
```

## 🔍 Debug Checklist

```
✅ Is NotificationProvider in App.tsx?
✅ Is NotificationContainer rendered?
✅ Does TransactionResultScreen import useNotifications?
✅ Does transaction object have correct type?
✅ Is status 'success' or 'error'?
✅ Is amount formatted correctly?
✅ Does HomeScreen use unreadCount from context?
✅ Is NotificationsScreen connected to context?
```

## 📈 Success Metrics

```
✓ Toast shows within 1ms of transaction result
✓ Notification stored within 2ms
✓ Badge updates within 3ms
✓ User sees feedback within 10 seconds of starting transaction
✓ Notification persists until marked as read
✓ All transaction types covered
```

---

**This diagram shows the complete flow from transaction initiation to notification delivery.**
