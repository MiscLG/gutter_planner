import graphene
from graphene.types.argument import Argument
from types import MethodType
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


class JobFields(object):
    depositPaid = graphene.Boolean(required=True)
    dateStarted = graphene.DateTime()
    dateFinished = graphene.DateTime()


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


class JobType(graphene.ObjectType, JobFields):
    jid = graphene.String()
    # TODO: add resolutions for clients, workers and address

    @db.transaction
    def create(self):
        print(self.__dict__)
        Job(**self.__dict__).save()


class EstimateType(graphene.ObjectType, EstimateFields):
    eid = graphene.String()
    # TODO: add resolution for estimators, job, address and price

    @db.transaction
    def create(self):
        print(self.__dict__)
        Estimate(**self.__dict__).save()


class JobInput(graphene.InputObjectType, JobFields):
    pass


class EstimateInput(graphene.InputObjectType, EstimateFields):
    pass

# TODO: attempt to make mutation classes in a closure


def makeMutation(name, fieldsobj, typeobj):
    input = type(f"{name}Input", (graphene.InputObjectType, fieldsobj), {})

    mutation = type(f"Create{name}", (graphene.Mutation,),
                    {
        "Arguments": type("Arguments", (), {f"{name}_data": input(required=True)}),
        "ok": graphene.Boolean(),
        f"{name}": graphene.Field(typeobj),
        "mutate": lambda x: x
    })

    def mutate(root, info, data=None):
        item = typeobj(**data.__dict__)
        try:
            item.create()
        except:
            print(f"Creation went wrong of object of type Create{name}")
        return mutation({f"{name}": item, "ok": True})
    mutation.mutate = MethodType(mutate, mutation)
    return mutation


CreateJob = makeMutation("Job", JobFields, JobType)
makeEstimate = makeMutation("Est", EstimateFields, EstimateType)


class CreateJob(graphene.Mutation):
    class Arguments:
        j_data = JobInput(required=True)
    ok = graphene.Boolean()
    job = graphene.Field(JobInput)

    def mutate(root, info, j_data=None):
        job = JobType(
            **j_data.__dict__
        )
        job.create()
        ok = True
        return CreateJob(job=job, ok=ok)


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
    create_job = CreateJob.Field()
    est = makeEstimate.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
