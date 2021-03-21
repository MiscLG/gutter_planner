
from django.db.models.base import Model
from neomodel import db
import graphene
# from types import MethodType

# GRAPHENE(GRAPHQL) METHODS


def makeInput(name, fieldsobj):
    return type(f"{name}Input", (graphene.InputObjectType, fieldsobj), {})


def makeMutation(fieldsobj, typeobj, modelobj):
    name = modelobj.__name__
    l_name = name.lower()
    name_args = f"{l_name}_data"
    inputobj = makeInput(name, fieldsobj)

    def mutate(root, info, **kwargs):
        try:
            item = typeobj(**kwargs[name_args].__dict__)
            saveTypeToModel(item, modelobj)
            # item.create()
            return mutation({l_name: item, "ok": True})
        except ValueError as err:
            print(f"Creation went wrong of object of type Create{name}")
            return mutation({l_name: item, "ok": False})

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
def saveTypeToModel(typeobj, modelobj):
    # print(typeobj.__dict__)
    modelobj(**typeobj.__dict__).save()


def getNodes(modelobj, max_num=5, custom_cypher=None):
    cypher = f"MATCH (i:{modelobj.__name__}) RETURN i LIMIT {max_num}"
    results, columns = db.cypher_query(custom_cypher or cypher)
    # print(modelobj.__name__)
    # print(results)
    return [modelobj.inflate(row[0]) for row in results]
