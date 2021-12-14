from typing import Any, List, Tuple
from flask import current_app


def add_to_index(index: Any, model: Any) -> Any:
    if not current_app.elasticsearch:  # type: ignore
        return
    payload = {field: getattr(model, field) for field in model.__searchable__}
    current_app.elasticsearch.index(  # type: ignore
        index=index, doc_type=index, id=model.id, body=payload
    )


def remove_from_index(index: Any, model: Any) -> Any:
    if not current_app.elasticsearch:  # type: ignore
        return
    current_app.elasticsearch.delete(  # type: ignore
        index=index, doc_type=index, id=model.id
    )


def query_index(
    index: Any, query: str, page: int, per_page: int
) -> Tuple[List[Any], int]:
    if not current_app.elasticsearch:  # type: ignore
        return [], 0
    search = current_app.elasticsearch.search(  # type: ignore
        index=index,
        doc_type=index,
        body={
            "query": {"multi_match": {"query": query, "fields": ["*"]}},
            "from": (page - 1) * per_page,
            "size": per_page,
        },
    )
    ids = [int(hit["_id"]) for hit in search["hits"]["hits"]]
    return ids, search["hits"]["total"]["value"]
