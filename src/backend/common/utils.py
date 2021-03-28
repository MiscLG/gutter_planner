
from django.db.models.base import Model
from neomodel import db
import graphene


# TODO: add python doc descriptions
# GRAPHENE(GRAPHQL) METHODS


def modelSchema(modelobj, fieldsobj, typeobj, in_vars={}, rel_map={}, identifiers=None):
    schema = {
        "input": None,
        "create": None,
        "update": None,
        "delete": None
    }
    schema["input"] = makeInput(modelobj.__name__, fieldsobj, vars=in_vars)
    schema["create"] = makeCreate(schema["input"], typeobj, modelobj, rel_map)
    if identifiers:
        schema["update"] = makeUpdate(
            schema["input"], typeobj, modelobj, identifiers.keys())
        schema["delete"] = makeDeletion(modelobj, identifiers)

    return schema


def makeInput(name, fieldsobj, vars={}):
    if not fieldsobj:
        return type(f"{name}Input", (graphene.InputObjectType,), vars)
    return type(f"{name}Input", (graphene.InputObjectType, fieldsobj), vars)


def makeMutation(name, argscls, mutate_func, mutation_fields):
    return type(name, (graphene.Mutation,), {"Arguments": argscls, "mutate": mutate_func, **mutation_fields})


def makeCreate(inputobj, typeobj, modelobj, rel_map={},):
    name = modelobj.__name__
    l_name = name.lower()
    name_args = f"{l_name}_data"
    # @login_required #may need this in deployment build

    def mutate(root, info, **kwargs):
        data = kwargs[name_args]
        rel_data = {rel: data.pop(rel)
                    for rel in rel_map.keys() if rel in data}
        node = saveDataToModel(data, modelobj)
        rel_items = saveRelationships(node, rel_map, rel_data)
        item = typeobj(**node.__properties__, **rel_items)
        return mutation(**{l_name: item, "ok": True})

    argscls = type("Arguments", (), {name_args: inputobj(required=True)})
    mutation = makeMutation(f"Create{name}", argscls, mutate, {
                            "ok": graphene.Boolean(), l_name: graphene.Field(typeobj), })
    return mutation


def makeUpdate(inputobj, typeobj, modelobj, identifiers, ):
    name = modelobj.__name__
    l_name = name.lower()
    name_args = f"{l_name}_data"
    # @login_required #may need this in deployment build

    def mutate(root, info, **kwargs):
        data = kwargs[name_args]
        ids = copy_with_keys(data, identifiers)
        node = updateNode(modelobj, ids, data)
        print(node)
        item = typeobj(**node[0].__properties__)
        return mutation(**{"message": "Updated successfully!", "ok": True, l_name: item})

    argscls = type("Arguments", (), {name_args: inputobj(required=True)})
    mutation = makeMutation(f"Update{name}", argscls, mutate, {
                            "message": graphene.String(), "ok": graphene.Boolean(), l_name: graphene.Field(typeobj), })
    return mutation


def makeDeletion(modelobj, identifiers):
    # @login_required #may need this in deployment build
    def mutate(root, info, **kwargs):
        message = "Item was deleted successfully!"
        print(kwargs)
        try:
            deletion_item = modelobj.nodes.get_or_none(**kwargs)
            if deletion_item:
                deletion_item.delete()
            else:
                message = "Item with that identifier was not found"
        except:
            return deletion(ok=False, message="Item was not deleted")
        return deletion(ok=True, message=message)

    argscls = type("Arguments", (), identifiers)
    deletion = makeMutation(f"Delete{modelobj.__name__}", argscls, mutate, {
                            "ok": graphene.Boolean(), "message": graphene.String()})
    return deletion


# NEO4J METHODS
@db.transaction
def saveDataToModel(data, modelobj):
    print(data)
    nodes = modelobj.create_or_update(data)
    return nodes[0]


def saveRelationships(node, rel_map, rel_data):
    result_obj = {}
    for relation, classes in rel_map.items():
        if relation in rel_data:
            # TODO:if necessary can specify a recursive call when defining an object
            # that needs a relationship
            try:
                item = getNode(classes[0], rel_data[relation])
            except:
                item = saveDataToModel(rel_data[relation], classes[0])
            getattr(node, relation).connect(item)
            result_obj[relation] = classes[-1](**item.__properties__)
    return result_obj


def getNode(modelobj, identifiers):
    query = dict_to_match_query(identifiers)
    cypher = f'MATCH (n {query}) RETURN n'
    print("Q", cypher)
    res = getNodes(modelobj, custom_cypher=cypher)
    print("RES", res)
    return res[0]  # if len(res) != 0 else None


def updateNode(modelobj, identifiers, data):
    query = dict_to_match_query(identifiers)
    cypher = f'MATCH (n {query}) SET n += $data RETURN n'
    return getNodes(modelobj, custom_cypher=cypher, props={
        "ids": identifiers, "data": data})

# @login_required #may need this in deployment build


def getNodes(modelobj, max_num=5, custom_cypher=None, props=None):
    cypher = custom_cypher or f"MATCH (i:{modelobj.__name__}) RETURN i LIMIT {max_num}"
    results, columns = db.cypher_query(cypher, props)
    return [modelobj.inflate(row[0]) for row in results]

# Generic


def dict_to_match_query(dict):
    query = "{"
    for key, val in dict.items():
        query += f"{key} : '" + val + \
            ("' " if key == list(dict)[-1] else "', ")
    query += "}"
    return query


def copy_with_keys(dict, key_list):
    return {key: dict[key] for key in key_list}


def copy_without_keys(dict, key_list):
    return {key: dict[key] for key in dict if key not in key_list}
