import graphene
import register.schema


class Query(register.schema.Query, graphene.ObjectType):
    pass


class Mutation(register.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
