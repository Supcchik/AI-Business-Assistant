# AI Business Assistant Dashboard

Сучасний веб-додаток для управління бізнес-процесами з інтелектуальним AI асистентом.

## 🚀 Особливості

- **AI Assistant** - інтелектуальний помічник з природною мовою
- **Анімований Orb** - красивий UI компонент з різними станами
- **Responsive Design** - адаптивний дизайн для всіх пристроїв
- **Real-time Updates** - оновлення даних в реальному часі
- **Modern UI** - використання shadcn/ui компонентів

## 🛠️ Технології

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Convex
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## 📱 Основні функції

### AI Assistant
- Природна мова для запитів
- Розумне розпізнавання намірів
- Анімовані стани (idle, thinking, loading, success)

### Dashboard Views
- **Invoices** - управління рахунками
- **Analytics** - аналітика та звіти
- **Debtors** - управління заборгованістю
- **Wizard** - створення нових документів

### Orb Component
- Анімований UI елемент
- Різні стани та анімації
- Shared layout transitions
- Accessibility підтримка

## 🚀 Швидкий старт

### Встановлення залежностей
```bash
npm install
```

### Запуск в режимі розробки
```bash
npm run dev
```

### Збірка для продакшену
```bash
npm run build
npm start
```

## 📁 Структура проекту

```
├── app/                    # Next.js App Router
├── components/            # React компоненти
│   ├── ui/               # shadcn/ui компоненти
│   ├── orb/              # Orb компонент
│   ├── chat/             # Chat функціональність
│   └── canvas/           # Dashboard views
├── convex/               # Convex backend
├── lib/                  # Утиліти та хуки
├── stores/               # Zustand store
└── public/               # Статичні файли
```

## 🎨 UI Components

Проект використовує [shadcn/ui](https://ui.shadcn.com/) компоненти:

- Button, Input, Card, Table
- Dialog, Dropdown, Tabs
- Form, Select, Badge
- Theme Provider, Skeleton

## 🔧 Налаштування

### Environment Variables
Створіть `.env.local` файл:
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### Convex Setup
1. Встановіть Convex CLI
2. Налаштуйте проект
3. Додайте URL в environment variables

## 📊 Стани AI Assistant

- **idle** - очікування команд
- **listening** - слухання користувача
- **thinking** - обробка запиту
- **loading** - завантаження даних
- **success** - успішне виконання
- **error** - помилка

## 🎯 Демо команди

```
Show invoices for 90 days
Show debtors analytics
Create new invoice
Show invoice INV-001
```

## 🤝 Внесок

1. Fork проект
2. Створіть feature branch
3. Commit зміни
4. Push в branch
5. Створіть Pull Request

## 📄 Ліцензія

MIT License

## 👨‍💻 Автор

AI Business Assistant Dashboard Team

---

**Примітка**: Це демо проект для демонстрації можливостей AI асистента та сучасних веб-технологій.
