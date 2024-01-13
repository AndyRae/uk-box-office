-- CreateEnum
CREATE TYPE "state" AS ENUM ('success', 'warning', 'error');

-- CreateTable
CREATE TABLE "alembic_version" (
    "version_num" VARCHAR(32) NOT NULL,

    CONSTRAINT "alembic_version_pkc" PRIMARY KEY ("version_num")
);

-- CreateTable
CREATE TABLE "countries" (
    "country_id" INTEGER NOT NULL,
    "film_id" INTEGER NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("country_id","film_id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,

    CONSTRAINT "distributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributor_market_share" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "distributor_id" INTEGER NOT NULL,
    "market_share" DOUBLE PRECISION NOT NULL,
    "gross" INTEGER NOT NULL,

    CONSTRAINT "distributor_market_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributors" (
    "film_id" INTEGER NOT NULL,
    "distributor_id" INTEGER NOT NULL,

    CONSTRAINT "distributors_pkey" PRIMARY KEY ("film_id","distributor_id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "area" VARCHAR(160) NOT NULL,
    "message" TEXT,
    "state" "state" NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "film" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "country_id" INTEGER,
    "slug" VARCHAR(300) NOT NULL,

    CONSTRAINT "film_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "film_week" (
    "id" SERIAL NOT NULL,
    "film_id" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "rank" INTEGER NOT NULL,
    "weeks_on_release" INTEGER NOT NULL,
    "number_of_cinemas" INTEGER NOT NULL,
    "weekend_gross" INTEGER NOT NULL,
    "week_gross" INTEGER NOT NULL,
    "total_gross" INTEGER NOT NULL,
    "site_average" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "film_week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "number_of_cinemas" INTEGER,
    "number_of_releases" INTEGER,
    "weekend_gross" INTEGER,
    "week_gross" INTEGER,
    "forecast_high" INTEGER,
    "forecast_medium" INTEGER,
    "forecast_low" INTEGER,
    "admissions" INTEGER,

    CONSTRAINT "week_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_slug_key" ON "country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "distributor_name_key" ON "distributor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "distributor_slug_key" ON "distributor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "distributor_market_share_distributor_id_year_key" ON "distributor_market_share"("distributor_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "film_slug_key" ON "film"("slug");

-- CreateIndex
CREATE INDEX "ix_film_week_date" ON "film_week"("date");

-- CreateIndex
CREATE UNIQUE INDEX "week_date_key" ON "week"("date");

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distributor_market_share" ADD CONSTRAINT "distributor_market_share_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "distributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_distributor_id_fkey" FOREIGN KEY ("distributor_id") REFERENCES "distributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "distributors" ADD CONSTRAINT "distributors_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "film" ADD CONSTRAINT "film_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "film_week" ADD CONSTRAINT "film_week_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "film"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
