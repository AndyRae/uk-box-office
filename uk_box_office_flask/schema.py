import flask_marshmallow

from uk_box_office_flask import models

ma = flask_marshmallow.Marshmallow()

class WeekSchema(ma.SQLAlchemyAutoSchema):
    class meta():
        model = models.Week
        include_relationships = True

class FilmSchema(ma.SQLAlchemyAutoSchema):
    class meta():
        model = models.Film
        include_relationships = True
    weeks = ma.Nested(WeekSchema, many=True)




    
