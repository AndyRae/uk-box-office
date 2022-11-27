from typing import Any, Optional, Type, TypeVar

from ukbo.extensions import db

T = TypeVar("T", bound="PkModel")


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD operations."""

    @classmethod
    def create(cls, commit: bool = True, **kwargs: Any) -> Any:
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        return instance.save() if commit else instance.save(commit=False)

    def update(self, commit: bool = True, **kwargs: Any) -> Any:
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return self.save() if commit else self

    def save(self, commit: bool = True) -> Any:
        """Save the record."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit: bool = True) -> None:
        """Remove the record from the database."""
        db.session.delete(self)
        if commit:
            return db.session.commit()
        return


class Model(CRUDMixin, db.Model):
    """Base model class that includes CRUD convenience methods."""

    __abstract__ = True


class PkModel(Model):
    """Base model class that includes CRUD convenience methods, plus adds a 'primary key' column named ``id``."""

    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)

    @classmethod
    def get_by_id(cls: Type[T], record_id: Any) -> Optional[T]:
        """Get record by ID."""
        if any(
            (
                isinstance(record_id) and record_id.isdigit(),  # type: ignore
                isinstance(record_id, (int, float)),
            )
        ):
            return cls.query.get(int(record_id))
        return None
