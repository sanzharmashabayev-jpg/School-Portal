# 🚀 Инструкция по подключению домена и деплою

## Вариант 1: Подключение домена к Supabase (для API)

Если вы хотите использовать свой домен для Supabase API вместо стандартного `*.supabase.co`:

### Шаги:

1. **В панели Supabase:**
   - Перейдите в Settings > API
   - Прокрутите вниз до раздела "Custom Domain"
   - Нажмите "Add Custom Domain"

2. **Настройка DNS на вашем домене:**
   - Войдите в панель управления вашим доменом (где вы купили домен)
   - Добавьте CNAME запись:
     ```
     Type: CNAME
     Name: api (или любое другое поддомен)
     Value: [ваш-проект-id].supabase.co
     TTL: 3600 (или Auto)
     ```

3. **Подтверждение:**
   - Supabase проверит DNS запись (может занять до 24 часов)
   - После проверки ваш домен будет доступен

4. **Обновите .env файл:**
   ```env
   VITE_SUPABASE_URL=https://api.yourdomain.com
   ```

---

## Вариант 2: Деплой веб-приложения на свой домен

### 🔷 Вариант 2A: Деплой на Vercel (Рекомендуется)

**Vercel предоставляет бесплатный хостинг с автоматическим деплоем из GitHub.**

#### Шаги:

1. **Подготовка:**
   ```bash
   npm run build
   ```

2. **Деплой через Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **Или через веб-интерфейс:**
   - Перейдите на https://vercel.com
   - Войдите через GitHub
   - Нажмите "New Project"
   - Подключите ваш GitHub репозиторий
   - Vercel автоматически определит настройки Vite
   - Добавьте переменные окружения:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Нажмите "Deploy"

4. **Подключение собственного домена:**
   - В проекте Vercel перейдите в Settings > Domains
   - Добавьте ваш домен
   - Настройте DNS записи (A или CNAME) по инструкции Vercel

---

### 🔷 Вариант 2B: Деплой на Netlify

1. **Подготовка:**
   ```bash
   npm run build
   ```

2. **Через Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Или через веб-интерфейс:**
   - Перейдите на https://netlify.com
   - Drag & Drop папку `dist` после сборки
   - Или подключите GitHub репозиторий

4. **Настройка переменных окружения:**
   - Site settings > Build & deploy > Environment variables
   - Добавьте `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`

5. **Подключение домена:**
   - Domain settings > Add custom domain
   - Настройте DNS по инструкции Netlify

---

### 🔷 Вариант 2C: Деплой на собственный сервер (VPS/VDS)

#### Требования:
- Сервер с Ubuntu/Debian
- Установленные Node.js и Nginx

#### Шаги:

1. **На сервере:**
   ```bash
   # Клонируйте репозиторий
   git clone https://github.com/your-username/School-Portal.git
   cd School-Portal
   
   # Установите зависимости
   npm install
   
   # Создайте .env файл
   nano .env
   # Добавьте ваши ключи Supabase
   
   # Соберите проект
   npm run build
   ```

2. **Настройка Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       root /path/to/School-Portal/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Для статических файлов
       location /assets {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Настройка SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

4. **Перезапустите Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

---

### 🔷 Вариант 2D: Деплой на GitHub Pages

1. **Установите gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Обновите package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/School-Portal"
   }
   ```

3. **Деплой:**
   ```bash
   npm run deploy
   ```

**⚠️ Важно:** GitHub Pages не поддерживает переменные окружения напрямую. Используйте другой способ деплоя для продакшена.

---

## 📝 Важные замечания

### Настройка переменных окружения на хостинге

Для всех платформ хостинга добавьте эти переменные:

```
VITE_SUPABASE_URL=ваш_url
VITE_SUPABASE_ANON_KEY=ваш_ключ
```

### После деплоя обновите Supabase:

1. В Supabase Dashboard: Settings > Authentication > URL Configuration
2. Добавьте ваш домен в "Site URL"
3. Добавьте в "Redirect URLs":
   - `https://yourdomain.com/**`
   - `https://yourdomain.com/login`
   - `https://yourdomain.com/admin/login`

### Настройка CORS (если нужно):

В Supabase Dashboard: Settings > API > CORS Origins
- Добавьте ваш домен: `https://yourdomain.com`

---

## 🔐 Безопасность

- ✅ Используйте HTTPS (SSL сертификат)
- ✅ Не коммитьте `.env` файл
- ✅ Используйте переменные окружения на хостинге
- ✅ Включите Row Level Security (RLS) в Supabase
- ✅ Настройте правильные CORS настройки

---

## 📚 Полезные ссылки

- [Vercel Документация](https://vercel.com/docs)
- [Netlify Документация](https://docs.netlify.com)
- [Supabase Custom Domain](https://supabase.com/docs/guides/platform/custom-domains)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

