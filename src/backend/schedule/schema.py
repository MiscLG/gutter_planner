import graphene
from graphene.types.argument import Argument
from graphene.types.scalars import String
from neomodel import db
from schedule.models import *
from common.utils import modelSchema, getNode, getNodes, makeInput
from users.schema import UserType
from users.models import User

# TODO: Add Graphene descriptions for each object schema

UserInput = makeInput("User", None, vars={
    "username": graphene.String(),
    "email": graphene.String(),
})
SetUser = makeInput("UserID", None, vars={
    "uid": graphene.String()
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


class JobType(graphene.ObjectType, JobFields):
    id = graphene.String()
    jid = graphene.String()
    client_made = graphene.Boolean()
    client = graphene.Field(UserType)
    roofer = graphene.Field(UserType)
    clients = graphene.List(UserType)
    roofers = graphene.List(UserType)

    def resolve_clients(root, info):
        job = Job.nodes.get(jid=root.jid)
        return job.client.all()

    def resolve_roofers(root, info):
        job = Job.nodes.get(jid=root.jid)
        return job.roofer.all()


JobOperations = modelSchema(
    Job, JobFields, JobType,
    in_vars={
        "client": UserInput(),
        "roofer": UserInput(),
    },
    rel_map={
        "client": (User, UserType),
        "roofer": (User, UserType)
    },
    identifiers={
        "jid": graphene.String(required=True)
    },)


class AddressType(graphene.ObjectType, AddressFields):
    id = graphene.String()
    user = graphene.Field(UserType)
    users = graphene.List(UserType)
    jobs = graphene.List(JobType)

    def resolve_users(root, info):
        address = Address.nodes.get(addressLine1=root.addressLine1)
        return address.user.all()

    def resolve_jobs(root, info):
        cypher = f"Match (j:Job)-[:ESTIMATED_WITH]->(e:Estimate)-[:DESIGNATED]->(a:Address {{addressLine1: '{root.addressLine1}'}}) RETURN j "
        return getNodes(Job, custom_cypher=cypher)


AddressOperations = modelSchema(
    Address, AddressFields, AddressType,
    in_vars={
        "user": UserInput(),
    },
    rel_map={
        "user": (User, UserType),
    },
    identifiers={
        "addressLine1": graphene.String(required=True)
    })


class EstimateType(graphene.ObjectType, EstimateFields):
    id = graphene.String()
    eid = graphene.String()
    creationDate = graphene.DateTime()
    clientMade = graphene.Boolean()
    address = graphene.Field(AddressType)
    job = graphene.Field(JobType)
    estimator = graphene.Field(UserType)
    estimators = graphene.List(UserType)

    def resolve_estimators(root, info):
        estimate = Estimate.nodes.get(eid=root.eid)
        return estimate.estimator.all()

    def resolve_job(root, info):
        estimate = Estimate.nodes.get(eid=root.eid)
        print(estimate.job.all())
        return estimate.job.single()

    def resolve_address(root, info):
        estimate = Estimate.nodes.get(eid=root.eid)
        return estimate.address.single()


EstimateOperations = modelSchema(
    Estimate, EstimateFields, EstimateType,
    in_vars={
        "eid": graphene.String(),
        "estimator": SetUser(),
        "address": AddressOperations["input"](),
        "job": JobOperations["set"](),
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
    address = graphene.Field(AddressType, addressLine1=graphene.String())
    addresses = graphene.List(AddressType)
    estimate = graphene.Field(EstimateType, eid=graphene.String())
    estimates = graphene.List(EstimateType)
    job = graphene.Field(JobType, jid=graphene.String())
    jobs = graphene.List(JobType)

    def resolve_address(self, info, **kwargs):
        return getNode(Address, kwargs)

    def resolve_addresses(self, info, **kwargs):
        return getNodes(Address)

    def resolve_estimate(self, info, **kwargs):
        return getNode(Estimate, kwargs)

    def resolve_estimates(self, info, **kwargs):
        return getNodes(Estimate)

    def resolve_job(self, info, **kwargs):
        return getNode(Job, kwargs)

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
