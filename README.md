# Contacts App

## Opis projektu

Fullstack aplikacja do zarządzania kontaktami z bezpiecznym systemem autoryzacji opartym na JWT tokenach. Składa się z backendu ASP.NET Core Web API oraz frontendu React z Vite.

Niezalogowany uzytkownik moze przegladac baze danych, zalogowany moze takze dodawac, usuwac badz edytowac istniejace rekordy.
Aby sie zalogowac wprowadz istniejace w bazie danych login i haslo (na poczatku np. anowak@wp.pl, Aaaaaa1!), uwaga - w bazie przechowywane sa zahashowane hasla.
Aby dodac rekord wypelnij pola formularza i nacisnij Add.
Aby edytowac rekord juz isntiejacy wypelnij pola formularza i nacisniej przycisk "Edit" obok wybranego rekordu
Aby usunac nacisnij przycisk "Delete" obok wybranego rekordu.

## Architektura systemu

### Backend

- **Framework**: ASP.NET Core 8.0 Web API
- **Baza danych**: SQLite z Entity Framework Core
- **Autoryzacja**: JWT Bearer tokens
- **Hashowanie haseł**: BCrypt.Net


### Frontend

- **Framework**: React 18+ z Vite
- **Język**: JavaScript/JSX
- **Komunikacja**: Fetch API z JWT autoryzacją


##  Funkcjonalności

-  Rejestracja i logowanie użytkowników
-  Bezpieczne hashowanie haseł (BCrypt)
-  Autoryzacja JWT z automatycznym wylogowaniem
-  CRUD operacje na kontaktach
-  Kategoryzacja kontaktów
-  Responsywny interfejs użytkownika


##  Wymagania systemowe

### Backend

- .NET 8.0 SDK lub nowszy
- SQLite (automatycznie instalowane)


### Frontend

- Node.js 18+
- npm lub yarn


## Instalacja i uruchomienie

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/nickolaus125/Contacts-app.git
cd Contacts-app
```


### 2. Backend (ASP.NET Core)

```bash
# Przejdź do katalogu serwera
cd First_front_back.Server

# Przywróć pakiety NuGet
dotnet restore

# Zbuduj aplikację
dotnet build

# Uruchom aplikację
dotnet run
```

Backend będzie dostępny pod adresem: `https://localhost:7145`

### 3. Frontend (React)

```bash
cd first_front_back.client

npm install

npm run dev
```

Frontend będzie dostępny pod adresem: `http://localhost:5173`

##  Struktura projektu

```
First_front_back/
├── First_front_back.Server/          # Backend ASP.NET Core
│   ├── Controllers/
│   │   └── ContactsController.cs     # API endpoints
│   ├── Data/
│   │   └── First_front_backContext.cs # Entity Framework context
│   ├── Models/
│   │   └── Contact.cs                # Model kontaktu
│   ├── Services/
│   │   ├── IJwtService.cs            # Interfejs JWT service
│   │   └── JwtService.cs             # Implementacja JWT service
│   ├── appsettings.json              # Konfiguracja aplikacji
│   └── Program.cs                    # Punkt wejścia aplikacji
└── first_front_back.client/          # Frontend React
    ├── src/
    │   ├── App.jsx                   # Główny komponent
    │   └── main.jsx                  # Punkt wejścia React
    ├── package.json                  # Zależności npm
    └── vite.config.js               # Konfiguracja Vite
```


##  API Endpoints

| Metoda | Endpoint | Opis |
| :-- | :-- | :-- | :-- |
| `POST` | `/api/contacts/login` | Logowanie użytkownika |
| `GET` | `/api/contacts` | Pobierz wszystkie kontakty | 
| `GET` | `/api/contacts/{id}` | Pobierz kontakt po ID |
| `POST` | `/api/contacts` | Dodaj nowy kontakt | 
| `PUT` | `/api/contacts/{id}` | Aktualizuj kontakt | 
| `DELETE` | `/api/contacts/{id}` | Usuń kontakt |

##  Bezpieczeństwo

### Implementowane zabezpieczenia

- **BCrypt hashowanie haseł** z work factor 12
- **JWT tokeny** z czasem wygaśnięcia 60 minut
- **CORS** skonfigurowany dla komunikacji frontend-backend
- **Autoryzacja Bearer token** na chronionych endpointach
- **Automatyczne wylogowanie** przy wygaśnięciu tokena
- **Walidacja danych** na poziomie modelu i kontrolera


### Konfiguracja JWT (appsettings.json)

```json
{
  "JwtSettings": {
    "SecretKey": "TwojaBardzoDlugaIBezpiecznaWartoscKlucza123456789",
    "Issuer": "ContactsApp",
    "Audience": "ContactsAppUsers",
    "ExpirationInMinutes": 30
  }
}
```


##  Wykorzystane biblioteki

### Backend (NuGet packages)

```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.11" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.3" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.11" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.11" />
```


### Frontend (npm packages)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```


## Kompilacja

### Backend

```bash
cd First_front_back.Server
dotnet publish -c Release -o ./publish
```


### Frontend

```bash
cd first_front_back.client
npm run build
```


##  Baza danych

Aplikacja używa SQLite z automatycznym tworzeniem bazy danych. Plik bazy: `appdata.sqlite`
Baza danych przechowuje informacje o kontaktach oraz liste dostepnych do wyboru kategorii i podkategorii. Szczegoly mozna znalezc w odpowiadajacych im plikach w folderze First_front_back.Server\Models

### Migracje Entity Framework

```bash
dotnet ef migrations add InitialCreate

dotnet ef database update
```

## Użytkowanie

1. **Uruchom backend i frontend** zgodnie z instrukcjami powyżej
2. **Otwórz przeglądarkę** i przejdź do `http://localhost:5173`
3. **Zaloguj się** używając istniejących danych lub zarejestruj nowy kontakt
4. **Zarządzaj kontaktami** - dodawaj, edytuj, usuwaj kontakty
5. **Wyloguj się** gdy skończysz pracę
