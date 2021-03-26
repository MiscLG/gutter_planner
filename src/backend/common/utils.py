
from django.db.models.base import Model
from neomodel import db
import graphene

# GRAPHENE(GRAPHQL) METHODS


def modelSchema(modelobj, fieldsobj, typeobj, in_vars={}, rel_map={}):
    inputobj = makeInput(modelobj.__name__, fieldsobj, in_vars)
    mutation = makeUpdate(inputobj, typeobj, modelobj, rel_map)
    return inputobj, mutation


def makeInput(name, fieldsobj, vars={}):
    return type(f"{name}Input", (graphene.InputObjectType, fieldsobj), vars)


def makeMutation(name, argscls, mutate_func, mutation_fields):
    return type(name, (graphene.Mutation,), {"Arguments": argscls, "mutate": mutate_func, **mutation_fields})


def makeUpdate(inputobj, typeobj, modelobj, rel_map={},):
    name = modelobj.__name__
    l_name = name.lower()
    name_args = f"{l_name}_data"
    # @login_required #may need this in deployment build

    def mutate(root, info, **kwargs):
        data = kwargs[name_args]
        rel_data = {rel: data.pop(rel)
                    for rel in rel_map.keys() if rel in data}
        print(modelobj.defined_properties())
        node = saveDataToModel(data, modelobj)
        item = typeobj(**node.__properties__)
        saveRelationships(node, rel_map, rel_data)
        return mutation(**{l_name: item, "ok": True})
    # TODO: Make Create an operation argument
    argscls = type("Arguments", (), {name_args: inputobj(required=True)})
    mutation = makeMutation(f"Create{name}", argscls, mutate, {
                            "ok": graphene.Boolean(), l_name: graphene.Field(typeobj), })
    return mutation


def makeDeletion(modelobj, identifiers):
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
    # print(typeobj.__dict__)
    node = modelobj.create_or_update(data)
    print(node)
    node[0].save()
    return node[0]


def saveRelationships(node, rel_map, rel_data):
    # print("GOT TO HERE", rel_data)
    for relation, classes in rel_map.items():
        if relation not in rel_data:
            continue
        new_item = saveDataToModel(rel_data[relation], classes)
        getattr(node, relation).connect(new_item)


def getNodes(modelobj, max_num=5, custom_cypher=None):
    cypher = f"MATCH (i:{modelobj.__name__}) RETURN i LIMIT {max_num}"
    results, columns = db.cypher_query(custom_cypher or cypher)
    return [modelobj.inflate(row[0]) for row in results]

# Generic


def copy_with_keys(dict, key_list):
    return {key: dict[key] for key in key_list}


def copy_without_keys(dict, key_list):
    return {key: dict[key] for key in dict if key not in key_list}
