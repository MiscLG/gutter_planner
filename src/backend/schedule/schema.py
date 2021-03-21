import graphene
from graphene.types.argument import Argument
from users.schema import AddressType
from graphene_django.types import DjangoObjectType, ObjectType
from graphene.types.scalars import String
from neomodel import db
from schedule.models import *
from common.utils import makeMutation, getNodes


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


class EstimateType(graphene.ObjectType, EstimateFields):
    eid = graphene.String()
    # TODO: add resolution for estimators, job, address and price


class Query(ObjectType):
    estimates = graphene.List(EstimateType)
    jobs = graphene.List(JobType)

    def resolve_estimates(self, info, **kwargs):
        return getNodes(Estimate)

    def resolve_jobs(self, info, **kwargs):
        return getNodes(Job)


class Mutation(graphene.ObjectType):
    create_estimate = makeMutation(
        EstimateFields, EstimateType, Estimate).Field()
    create_job = makeMutation(JobFields, JobType, Job).Field()


schema = graphene.Schema(query=Query, mutation=Mutation)

# class JobInput(graphene.InputObjectType, JobFields):
#     pass
# class EstimateInput(graphene.InputObjectType, EstimateFields):
#     pass
# class CreateJob(graphene.Mutation):
#     class Arguments:
#         j_data = JobInput(required=True)
#     ok = graphene.Boolean()
#     job = graphene.Field(JobType)
#     def mutate(root, info, j_data=None):
#         job = JobType(
#             **j_data.__dict__
#         )
#         job.create()
#         ok = True
#         return CreateJob(job=job, ok=ok)
# class CreateEstimate(graphene.Mutation):
#     class Arguments:
#         e_data = EstimateInput(required=True)

#     ok = graphene.Boolean()
#     estimate = graphene.Field(EstimateType)

#     def mutate(root, info, e_data=None):
#         estimate = EstimateType(
#             **e_data.__dict__
#         )
#         estimate.create()
#         ok = True
#         return CreateEstimate(estimate=estimate, ok=ok)
