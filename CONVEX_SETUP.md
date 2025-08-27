# Convex Setup Instructions

## 🚀 Налаштування реального Convex проекту

### Крок 1: Створення проекту на Convex Dashboard

1. Відкрийте [Convex Dashboard](https://dashboard.convex.dev)
2. Натисніть "Create Project"
3. Виберіть команду (Personal або створіть нову)
4. Введіть назву проекту: `ai-business-assistant`
5. Виберіть регіон (найближчий до вас)

### Крок 2: Отримання ключів

Після створення проекту ви отримаєте:

1. **Project URL** (наприклад: `https://ai-business-assistant.convex.cloud`)
2. **Deploy Key** (довгий рядок символів)

### Крок 3: Оновлення .env.local

```bash
# Оновіть .env.local з реальними ключами
NEXT_PUBLIC_CONVEX_URL=https://ai-business-assistant.convex.cloud
CONVEX_DEPLOY_KEY=your_deploy_key_here
```

### Крок 4: Заміна mock функцій

1. **convex/functions/queries.ts** - замініть mock на реальні Convex queries
2. **convex/functions/mutations.ts** - замініть mock на реальні Convex mutations  
3. **convex/functions/seed.ts** - замініть mock на реальні Convex seed функції

### Крок 5: Оновлення lib/hooks.ts

Замініть mockConvex на реальні Convex клієнти:

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// Замість mockConvex.listInvoicesByPeriod
export function useInvoices(periodDays: number = 90) {
  return useQuery(api.queries.listInvoicesByPeriod, { periodDays });
}

// Замість mockConvex.createInvoiceWizard
export function useCreateInvoice() {
  const createInvoice = useMutation(api.mutations.createInvoiceWizard);
  // ... rest of the hook
}
```

### Крок 6: Тестування

1. Запустіть `npx convex dev`
2. Перевірте, що всі функції працюють
3. Протестуйте seed даних
4. Перевірте real-time оновлення

---

## 🔧 Поточний стан

**Mock Functions**: ✅ Реалізовано  
**Real Convex**: ⏳ Потребує налаштування  
**Data Integration**: ✅ Готово до підключення  

---

## 📋 Checklist для завершення M2

- [ ] Створити Convex проект
- [ ] Отримати ключі та оновити .env.local
- [ ] Замінити mock функції на реальні
- [ ] Протестувати з реальною базою
- [ ] Завершити M2 - Convex & Data

---

## 🎯 Наступний етап

**M3 - Views Wiring**: Підключення всіх view до реальної Convex бази

---

*Останнє оновлення: Січень 2025*
