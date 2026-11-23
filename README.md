# КТ 5. Пользователи и отзывы: PostgreSQL + MongoDB

## Почему такие базы

- **User → PostgreSQL**: фиксированный набор полей со строгими типами,
  уникальность email на уровне базы, пользователи — «ядро» данных,
  на которое ссылаются остальные сущности.
- **Review → MongoDB**: отзыв — документ, который со временем обрастает
  новыми полями (фото, плюсы/минусы). Гибкая схема позволяет добавлять
  поля без миграций, а большой поток отзывов хорошо масштабируется.
- Связь: отзыв хранит `userId` — id пользователя из PostgreSQL.

## Запуск

```bash
# 1. Поднять базы (значения совпадают с .env)
docker run --name nest-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
docker run --name nest-mongo -p 27017:27017 -d mongo

# 2. Установить зависимости
npm install

# 3. Запустить приложение
npm run start:dev
```

Настройки подключения — в `.env` (`MONGODB_URI`, `POSTGRES_*`, `PORT`).
Таблица `users` создаётся автоматически при старте (`synchronize: true`, только для разработки).
Если контейнеры уже созданы, но остановлены: `docker start nest-postgres nest-mongo`.

## Что где лежит

| Файл | Назначение |
|---|---|
| `.env` | строки подключения к Mongo и Postgres, порт |
| `src/main.ts` | точка входа, порт через ConfigService |
| `src/app.module.ts` | ConfigModule + подключения обеих баз + UsersModule и ReviewsModule |
| `src/users/user.entity.ts` | сущность TypeORM — таблица `users` |
| `src/users/users.module.ts` | `TypeOrmModule.forFeature([User])` — регистрация репозитория |
| `src/users/users.service.ts` | CRUD через `Repository<User>` + NotFoundException |
| `src/users/users.controller.ts` | маршруты `/users` |
| `src/users/dto/` | CreateUserDto, UpdateUserDto |
| `src/reviews/review.schema.ts` | схема Mongoose (`@Schema`, `@Prop`, SchemaFactory) |
| `src/reviews/reviews.module.ts` | `MongooseModule.forFeature` — регистрация модели |
| `src/reviews/reviews.service.ts` | CRUD через `Model<ReviewDocument>` + агрегация `aggregateReviews` |
| `src/reviews/reviews.controller.ts` | маршруты `/reviews`, включая `/reviews/stats` |
| `src/reviews/dto/` | CreateReviewDto, UpdateReviewDto |

## Эндпоинты

- `/users` — GET (список), GET `/:id`, POST, PATCH `/:id`, DELETE `/:id` — PostgreSQL
- `/reviews` — GET (список), GET `/:id`, POST, PATCH `/:id`, DELETE `/:id` — MongoDB
- `GET /reviews/stats?minRating=3` — агрегация: по каждому пользователю
  количество отзывов и средний рейтинг (`$match` → `$group` → `$sort`),
  только отзывы с рейтингом ≥ minRating (по умолчанию 1)

Несуществующая запись → 404 (NotFoundException) в обоих сервисах.