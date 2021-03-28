import graphene
from graphene.types.argument import Argument
from graphene.types.scalars import String
from neomodel import db
from schedule.models import *
from common.utils import modelSchema, getNodes, makeInput
from users.schema import UserType
from users.models import User

# TODO: Add Graphene descriptions for each object schema

UserInput = makeInput("User", None, vars={
    "username": graphene.String(),
    "email": graphene.String()
})


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


AddressOperations = modelSchema(Address, AddressFields, AddressType, identifiers={
    "addressLine1": graphene.String(required=True)
})


class JobType(graphene.ObjectType, JobFields):
    id = graphene.String()
    jid = graphene.String()
    client_made = graphene.Boolean()
    client = graphene.Field(UserType)
    roofer = graphene.Field(UserType)
    # TODO: add resolutions for clients, workers and address


JobOperations = modelSchema(
    Job, JobFields, JobType,
    in_vars={
        "client": UserInput(),
        "roofer": UserInput()
    },
    rel_map={
        "client": (User, UserType),
        "roofer": (User, UserType)
    },
    identifiers={
        "jid": graphene.String(required=True)
    },)


class EstimateType(graphene.ObjectType, EstimateFields):
    id = graphene.String()
    eid = graphene.String()
    creationDate = graphene.DateTime()
    clientMade = graphene.Boolean()
    address = graphene.Field(AddressType)
    job = graphene.Field(JobType)
    estimator = graphene.Field(UserType)
    # TODO: add resolution for estimators, job, address and price


EstimateOperations = modelSchema(
    Estimate, EstimateFields, EstimateType,
    in_vars={
        "eid": graphene.String(),
        "estimator": UserInput(),
        "address": AddressOperations["input"](),
        "job": JobOperations["input"](),
    },
    rel_map={
        "address": (Address, AddressType),
        "job": (Job, JobType),
        "estimator": (User, UserType),
    },
    identifiers={
        "eid": graphene.String(required=True),
    }
)


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
    create_address = AddressOperations["create"].Field()
    create_job = JobOperations["create"].Field()
    create_estimate = EstimateOperations["create"].Field()
    delete_address = AddressOperations["delete"].Field()
    delete_job = JobOperations["delete"].Field()
    delete_estimate = EstimateOperations["delete"].Field()
    update_address = AddressOperations["update"].Field()
    update_job = JobOperations["update"].Field()
    update_estimate = EstimateOperations["update"].Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
