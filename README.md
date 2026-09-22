# Sayaç Takip

Uçtan uca deployment zincirini (GitHub Actions, Docker, Render, GitHub Pages) öğrenmeye yönelik basit bir sayaç/cihaz kayıt uygulaması.

## Canlı adresler

- **Frontend:** https://esraoter.github.io/sayac-takip/
- **Backend API:** https://sayac-takip-backend.onrender.com

## Özellikler

- Cihaz ekleme, listeleme, silme
- Seçilen cihaza okuma (değer + tarih) ekleme
- Negatif okuma değeri reddi (basit doğrulama)

## Teknoloji

- Backend: .NET Web API (in-memory veri deposu)
- Frontend: React + Vite
- CI/CD: GitHub Actions
- Frontend hosting: GitHub Pages
- Backend hosting: Render (free tier)

## Önemli notlar

**Render uyku davranışı:** Backend, Render'ın ücretsiz planında barındırılıyor. 15 dakika boyunca istek almazsa servis uykuya geçer. Uyandıktan sonra ilk istek yaklaşık 1 dakikaya kadar sürebilir — bu bir hata değil, normal davranıştır.

**Veri kalıcılığı yoktur:** Veriler in-memory (bellekte) tutulur. Servis uykuya geçtiğinde veya yeni bir deploy yapıldığında tüm veriler sıfırlanır. Bu beklenen bir davranıştır, projenin amacı veri saklama değil, uçtan uca deployment zincirinin çalışmasıdır.

## Yerelde çalıştırma

**Backend:**

    cd Backend
    dotnet run

**Frontend:**

    cd Frontend
    npm install
    npm run dev

Frontend'in backend'e bağlanabilmesi için `Frontend/.env` dosyasında `VITE_API_URL` değişkeninin tanımlı olması gerekir.