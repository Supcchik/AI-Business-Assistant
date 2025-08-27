# 🐛 Bug Fix: TypeError in InvoicesTableView

## ❌ **Проблема**
```
TypeError: Cannot read properties of undefined (reading 'toLowerCase')
at components/canvas/views/InvoicesTableView.tsx:45:42
```

## 🔍 **Причина**
- `invoice.client` може бути `undefined` або `null`
- Convex query повертає дані з `clientId`, а не з `client` полем
- Інтерфейс `Invoice` не відповідав реальній структурі даних

## ✅ **Виправлення**

### 1. **Оновлено Convex Query (`convex/functions/queries.ts`)**
```typescript
// Enrich invoices with client names
const enrichedInvoices = await Promise.all(
  invoices.map(async (invoice) => {
    const client = await ctx.db.get(invoice.clientId);
    return {
      ...invoice,
      client: client?.name || 'Unknown Client',
    };
  })
);
```

### 2. **Виправлено фільтрацію (`InvoicesTableView.tsx`)**
```typescript
// Before (causing error):
const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     invoice.businessId.toLowerCase().includes(searchTerm.toLowerCase());

// After (safe):
const matchesSearch = (invoice.client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                     (invoice.businessId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
```

### 3. **Оновлено інтерфейс `Invoice`**
```typescript
interface Invoice {
  _id: string;           // Changed from 'id'
  businessId: string;
  client: string;        // Now populated from clientId
  clientId: string;      // Added this field
  issueDate: string;
  dueDate: string;
  status: string;
  currency: string;
  total: number;
  balanceDue: number;
}
```

### 4. **Виправлено ключ таблиці**
```typescript
// Before:
<TableRow key={invoice.id} className="hover:bg-muted/50">

// After:
<TableRow key={invoice._id} className="hover:bg-muted/50">
```

## 🚀 **Результат**
- ✅ Помилка `TypeError` виправлена
- ✅ Головна сторінка завантажується без помилок
- ✅ Convex інтеграція працює правильно
- ✅ Дані правильно обробляються з бази даних

## 🔧 **Технічні деталі**
- Використовуємо **optional chaining** (`?.`) для безпечного доступу до властивостей
- **Fallback** значення (`|| ''`) для випадків, коли дані відсутні
- **Enrichment** даних в Convex query для отримання назв клієнтів
- Правильна **типізація** TypeScript для всіх полів

## 📝 **Висновок**
Помилка була викликана невідповідністю між очікуваною та реальною структурою даних. Виправлення забезпечує:
- Безпечну обробку `undefined`/`null` значень
- Правильну інтеграцію з Convex
- Стабільну роботу UI компонентів
