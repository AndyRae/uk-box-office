from ukbo import etl, models


def test_init_db_command(runner):
    result = runner.invoke(etl.commands.init_db_command)
    assert result.exit_code == 0
    assert "Initialised the database." in result.output


def test_fill_db_command(app, runner):
    result = runner.invoke(
        etl.commands.fill_db_command, ["--path", "tests/test_data/test.csv"]
    )

    with app.app_context():
        assert len(models.Film.query.all()) == 7
        assert len(models.Distributor.query.all()) == 6
        assert len(models.Country.query.all()) == 2
        assert len(models.Week.query.all()) == 2
        assert len(models.Film_Week.query.all()) == 9

    assert result.exit_code == 0
    assert "Filled the database." in result.output


def test_test_db_command(app, runner):
    result = runner.invoke(
        etl.commands.test_db_command, ["--path", "tests/test_data/test.csv"]
    )

    with app.app_context():
        assert len(models.Film.query.all()) == 7
        assert len(models.Distributor.query.all()) == 6
        assert len(models.Country.query.all()) == 2
        assert len(models.Week.query.all()) == 2
        assert len(models.Film_Week.query.all()) == 9

    assert result.exit_code == 0
    assert "Filled the database with test data." in result.output


def test_seed_films_command(app, runner):
    result = runner.invoke(
        etl.commands.seed_films_command, ["--path", "tests/test_data/test.csv"]
    )

    with app.app_context():
        assert len(models.Film.query.all()) == 7
        assert len(models.Distributor.query.all()) == 6
        assert len(models.Country.query.all()) == 2

    assert result.exit_code == 0
    assert "Seeded films data." in result.output


def test_seed_box_office_command(app, runner):
    result = runner.invoke(
        etl.commands.seed_box_office_command,
        ["--path", "tests/test_data/test.csv", "--year", 2022],
    )

    with app.app_context():
        assert len(models.Week.query.all()) == 2
        assert len(models.Film_Week.query.all()) == 9

    assert result.exit_code == 0
    assert "Seeded box office data" in result.output


def test_seed_admissions_command(app, runner):
    result = runner.invoke(
        etl.commands.seed_admissions_command,
        ["--path", "tests/test_data/admissions.csv"],
    )

    with app.app_context():
        assert len(models.Week.query.all()) == 2

    assert result.exit_code == 0
    assert "Seeded admissions data" in result.output


def test_update_admissions_command(app, runner):
    result = runner.invoke(
        etl.commands.update_admissions_command,
        ["--path", "tests/test_data/admissions.csv"],
    )

    with app.app_context():
        assert len(models.Week.query.all()) == 2

    assert result.exit_code == 0
    assert "Updated admissions data" in result.output
