import graphene
import users.schema
import schedule.schema


class Query(users.schema.Query, schedule.schema.Query, graphene.ObjectType):
    pass


class Mutation(users.schema.Mutation, schedule.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
