import graphene
from graphene.types.argument import Argument
from graphene.types.scalars import String
from neomodel import db
from schedule.models import *
from common.utils import modelSchema, getNodes, makeDeletion
from users.schema import UserType


class InclinationMeasure(graphene.Enum):
    L = "low"
    C = "conventional"
    S = "steep"


class AddressFields(object):
    # TODO: parse StructuredNodes into graphene ObjectTypes
    addressLine1 = graphene.String()
    addressLine2 = graphene.String()
    city = graphene.String()
    zipCode = graphene.String()
    isGated = graphene.Boolean()


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


class AddressType(graphene.ObjectType, AddressFields):
    id = graphene.String()
    # TODO: Add resolution to associated users
    pass


AddressInput, CreateAddress = modelSchema(Address, AddressFields, AddressType)
DeleteAddress = makeDeletion(Address, {
    "addressLine1": graphene.String(required=True)
})


class JobType(graphene.ObjectType, JobFields):
    id = graphene.String()
    jid = graphene.String()
    client_made = graphene.Boolean()
    # client = graphene.List(UserType)
    # roofer = graphene.List(UserType)
    # TODO: add resolutions for clients, workers and address


JobInput, CreateJob = modelSchema(Job, JobFields, JobType)
DeleteJob = makeDeletion(Job, {
    "jid": graphene.String(required=True)
})


class EstimateType(graphene.ObjectType, EstimateFields):
    id = graphene.String()
    eid = graphene.String()
    creationDate = graphene.DateTime()
    clientMade = graphene.Boolean()
    # address = graphene.Field(AddressType)
    # job = graphene.Field(JobType)
    # estimator = graphene.List(UserType)
    # TODO: add resolution for estimators, job, address and price


EstimateInput, CreateEstimate = modelSchema(
    Estimate, EstimateFields, EstimateType,
    in_vars={
        "address": AddressInput(),
        "job": JobInput(),
    },
    rel_map={
        "address": Address,
        "job": Job,
    }
)
DeleteEstimate = makeDeletion(Estimate, {
    "eid": graphene.String(required=True)
})


class Query(graphene.ObjectType):
    addresses = graphene.List(AddressType)
    estimates = graphene.List(EstimateType)
    jobs = graphene.List(JobType)
    # jobs = graphene.List(JobType)

    def resolve_addresses(self, info, **kwargs):
        return getNodes(Address)

    def resolve_estimates(self, info, **kwargs):
        return getNodes(Estimate)

    def resolve_jobs(self, info, **kwargs):
        return getNodes(Job)


class Mutation(graphene.ObjectType):
    create_address = CreateAddress.Field()
    create_estimate = CreateEstimate.Field()
    create_job = CreateJob.Field()
    delete_address = DeleteAddress.Field()
    delete_job = DeleteJob.Field()
    delete_estimate = DeleteEstimate.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
