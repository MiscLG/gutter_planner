
from django.db.models.base import Model
from neomodel import db
import graphene
# from types import MethodType

# GRAPHENE(GRAPHQL) METHODS


def modelSchema(modelobj, fieldsobj, typeobj, in_vars={}, rel_map={}):
    inputobj = makeInput(modelobj.__name__, fieldsobj, in_vars)
    mutation = makeMutation(inputobj, typeobj, modelobj, rel_map)
    return inputobj, mutation


def makeInput(name, fieldsobj, vars={}):
    return type(f"{name}Input", (graphene.InputObjectType, fieldsobj), vars)

# TODO: FIx return type display


def makeMutation(inputobj, typeobj, modelobj, rel_map={}):
    name = modelobj.__name__
    l_name = name.lower()
    name_args = f"{l_name}_data"

    # @db.transaction
    def mutate(root, info, **kwargs):
        try:
            data = kwargs[name_args]
            rel_data = {rel: data.pop(rel)
                        for rel in rel_map.keys() if rel in data}
            # print("DATA", data)
            item = typeobj(**data)
            # print("ITEM", item.__dict__)
            node = saveDataToModel(data, modelobj)
            # print("Hello", node)
            saveRelationships(node, rel_map, rel_data)
        except:
            print(f"Creation went wrong of object of type Create{name}")
            return mutation({l_name: None, "ok": False})
        print(item.__dict__)
        return mutation({l_name: item, "ok": True})

    mutation = type(f"Create{name}", (graphene.Mutation,),
                    {
        "Arguments": type("Arguments", (), {name_args: inputobj(required=True)}),
        "ok": graphene.Boolean(),
        l_name: graphene.Field(typeobj),
        "mutate": mutate
    })
    # print(mutation.__dict__)
    return mutation


# NEO4J METHODS
@db.transaction
def saveDataToModel(data, modelobj):
    # print(typeobj.__dict__)
    node = modelobj(**data)
    node.save()
    return node

# @db.transaction


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
    # print(modelobj.__name__)
    # print(results)
    return [modelobj.inflate(row[0]) for row in results]

# Generic


def copy_with_keys(dict, key_list):
    return {key: dict[key] for key in key_list}


def copy_without_keys(dict, key_list):
    return {key: dict[key] for key in dict if key not in key_list}
