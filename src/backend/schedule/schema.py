import graphene
from users.schema import AddressType
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types.scalars import String
from neomodel import db
from schedule.models import *

# TODO: Must find way to reuse estimatetype vars in Estimate Input


class InclinationMeasure(graphene.Enum):
    L = "low"
    C = "conventional"
    S = "steep"


class EstimateFields(object):
    roofType = graphene.String(required=True)  # can be enum
    ftGutter = graphene.Int(required=True)
    gutterColor = graphene.Int()  # can be enum
    gutterRate = graphene.Float()
    qtyDownspout = graphene.Int(required=True)
    downspoutColor = graphene.Int()  # can be enum
    downspoutRate = graphene.Float()
    roofInclination = InclinationMeasure(required=True)
    numFloors = graphene.Int()
    spaciousGround = graphene.Boolean()
    notes = graphene.String()


class EstimateType(graphene.ObjectType, EstimateFields):
    eid = graphene.String()
    # TODO: add resolution for estimators, job, address and price

    @db.transaction
    def create(self):
        print(self.__dict__)
        Estimate(**self.__dict__).save()


class EstimateInput(graphene.InputObjectType, EstimateFields):
    pass


class CreateEstimate(graphene.Mutation):
    class Arguments:
        e_data = EstimateInput(required=True)

    ok = graphene.Boolean()
    estimate = graphene.Field(EstimateType)

    def mutate(root, info, e_data=None):
        estimate = EstimateType(
            **e_data.__dict__
        )
        estimate.create()
        ok = True
        return CreateEstimate(estimate=estimate, ok=ok)


class Query(ObjectType):
    estimates = graphene.List(EstimateType)

    def resolve_estimates(self, info, **kwargs):
        results, columns = db.cypher_query(
            "MATCH (e:Estimate) RETURN e LIMIT 5")
        print(results)
        items = [Estimate.inflate(row[0]) for row in results]
        print(items[0])
        return items


class Mutation(graphene.ObjectType):
    create_estimate = CreateEstimate.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
