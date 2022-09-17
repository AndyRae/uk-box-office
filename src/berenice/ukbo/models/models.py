from typing import Any, Optional, Tuple, Type, TypeVar

from ukbo.extensions import db

from .search import add_to_index, query_index, remove_from_index

T = TypeVar("T", bound="PkModel")


class CRUDMixin(object):
    """Mixin that adds convenience methods for CRUD operations."""

    @classmethod
    def create(cls, commit: bool = True, **kwargs: Any) -> Any:
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        if commit:
            return instance.save()
        return instance.save(commit=False)

    def update(self, commit: bool = True, **kwargs: Any) -> Any:
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        if commit:
            return self.save()
        return self

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


class SearchableMixin(object):
    __tablename__: str
    query: Any
    id: Any

    @classmethod
    def search(
        cls, expression: str, page: int, per_page: int
    ) -> Tuple[Any, int]:
        ids, total = query_index(cls.__tablename__, expression, page, per_page)
        if total == 0:
            return cls.query.filter_by(id=0), 0
        when = [(ids[i], i) for i in range(len(ids))]
        return (
            cls.query.filter(cls.id.in_(ids)).order_by(
                db.case(when, value=cls.id)
            ),
            total,
        )

    @classmethod
    def before_commit(cls, session: Any) -> None:
        session._changes = {
            "add": list(session.new),
            "update": list(session.dirty),
            "delete": list(session.deleted),
        }

    @classmethod
    def after_commit(cls, session: Any) -> None:
        for obj in session._changes["add"]:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes["update"]:
            if isinstance(obj, SearchableMixin):
                add_to_index(obj.__tablename__, obj)
        for obj in session._changes["delete"]:
            if isinstance(obj, SearchableMixin):
                remove_from_index(obj.__tablename__, obj)
        session._changes = None

    @classmethod
    def reindex(cls) -> None:
        for obj in cls.query:
            add_to_index(cls.__tablename__, obj)


db.event.listen(db.session, "before_commit", SearchableMixin.before_commit)
db.event.listen(db.session, "after_commit", SearchableMixin.after_commit)
