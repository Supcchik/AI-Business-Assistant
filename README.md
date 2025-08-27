# AI Business Assistant

Conversational Generative UI прототип з **orb‑first** shell, **shadcn/ui** компонентами та **Convex** як shared DB.

## 🎯 Мета

Створити прототип "Conversational Generative UI" в Cursor з максимальним використанням shadcn/ui компонентів для швидкої розробки та консистентного дизайну.

## ✨ Особливості

- **Orb-first UI**: Центральний Brain ікон для empty state, малий ікон в Chat Dock для dashboard
- **Conversational Interface**: Текстовий чат з regex intent router
- **shadcn/ui Components**: Використання готових компонентів для швидкої розробки
- **4 Core Views**: Invoices, Invoice Details, Debtors Analytics, Create Invoice Wizard
- **Mock Data**: Реалістичні тестові дані для демонстрації
- **Admin Panel**: Dev tools для seed/reset даних

## 🚀 Швидкий старт

### Вимоги
- Node.js 18+
- npm або yarn

### Встановлення
```bash
# Клонувати репозиторій
git clone <repository-url>
cd ai-dashboard

# Встановити залежності
npm install

# Запустити dev сервер
npm run dev
```

### Відкрити в браузері
- **Головна сторінка**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login (password: `demo123`)

## 🎮 Як використовувати

### Empty State
1. Відкрийте головну сторінку
2. Побачите центральний Brain ікон з текстом "AI is waiting for your commands"
3. Внизу знаходиться Chat Dock

### Перша взаємодія
1. В Chat Dock введіть команду: `Show invoices for 90 days`
2. UI переключиться в dashboard mode
3. Orb зникне з центру та з'явиться в Chat Dock
4. Canvas покаже Invoices Table view

### Доступні команди
- `Show invoices for 90 days` → Invoices Table
- `Open inv-1047` → Invoice Details
- `Top debtors` → Debtors Analytics  
- `Create invoice for client` → Create Invoice Wizard

### Reset Screen
- Натисніть кнопку "Reset screen" в Top Bar
- Повернеться до empty state

## 🏗️ Архітектура

### Структура папок
```
app/
  layout.tsx          # Root layout з Toaster
  page.tsx            # Головна сторінка
  admin/              # Admin routes
    login/page.tsx    # Password gate
    dev/page.tsx      # Dev tools
components/
  ui/                 # shadcn/ui компоненти
  orb/                # Orb компонент
  chat/               # Chat Dock
  canvas/             # Canvas та Views
    views/            # 4 основні view
  TopBar.tsx          # Top navigation
  AppShell.tsx        # Головний shell
stores/
  uiStore.ts          # Zustand store
lib/
  convex.ts           # Convex клієнт
convex/
  schema.ts           # Database schema
  functions/          # Queries/Mutations
middleware.ts         # Password gate
```

### Технології
- **Next.js 14** з App Router
- **TypeScript** для типізації
- **Tailwind CSS** для стилізації
- **shadcn/ui** для готових компонентів
- **Zustand** для state management
- **Convex** для бази даних (поки що mock)
- **Lucide React** для іконок

## 🔧 Розробка

### Встановлення нових shadcn/ui компонентів
```bash
npx shadcn@latest add <component-name>
```

### Структура Convex функцій
- `queries.ts` - Читання даних
- `mutations.ts` - Зміна даних  
- `seed.ts` - Тестові дані

### Mock Data
Проект використовує mock дані для демонстрації:
- 3-4 клієнти
- 30-60 інвойсів за останні 12 місяців
- Реалістичні статуси та суми
- Різні валюти (USD, EUR, UAH)

## 📋 Roadmap

### ✅ Завершено (M1 - Shell & State)
- [x] Next.js 14 + TypeScript + Tailwind
- [x] Всі shadcn/ui компоненти
- [x] Orb empty state + Chat Dock + Top Bar
- [x] Zustand store + resetScreen функціональність
- [x] Regex intent router перемикає views
- [x] 4 основні view компоненти
- [x] Admin panel з password gate

### 🔄 В процесі (M2 - Convex & Data)
- [ ] Convex schema + індекси
- [ ] Seed + resetData з реалістичними даними
- [ ] Queries/mutations для всіх view

### 📅 Планується (M3 - Views Wiring)
- [ ] InvoicesTable підключено до Convex
- [ ] InvoiceDetails підключено до Convex
- [ ] DebtorsAnalytics підключено до Convex
- [ ] Wizard створює Draft через Convex

### 🎨 Майбутнє (M4 - Polish & Dev tools)
- [ ] Framer Motion анімації
- [ ] Voice capture
- [ ] Command palette (Cmd/Ctrl+K)
- [ ] PDF export
- [ ] Tweakcn теми

## 🎨 UI/UX Принципи

### shadcn/ui First
- Максимальне використання готових компонентів
- Мінімум кастомної стилізації
- Консистентний дизайн системи

### Accessibility
- Правильні ARIA labels
- Keyboard navigation
- Focus management

### Responsive Design
- Mobile-first підхід
- Адаптивні layout'и
- Touch-friendly інтерфейс

## 🚨 Відомі обмеження

### Поточна версія
- Convex функції використовують mock дані
- Немає реальної бази даних
- Обмежена валідація форм

### Технічні деталі
- Middleware password gate для демо
- Немає аутентифікації користувачів
- Обмежена error handling

## 🤝 Внесок

1. Fork репозиторію
2. Створіть feature branch
3. Commit зміни
4. Push до branch
5. Створіть Pull Request

## 📄 Ліцензія

MIT License - дивіться LICENSE файл для деталей.

## 🙏 Подяки

- [shadcn/ui](https://ui.shadcn.com/) за готові компоненти
- [Convex](https://convex.dev/) за базу даних
- [Next.js](https://nextjs.org/) за фреймворк
- [Tailwind CSS](https://tailwindcss.com/) за утиліти

---

**Примітка**: Це прототип для демонстрації концепції Conversational Generative UI. Для production використання потрібно додати реальну аутентифікацію, валідацію та error handling.
