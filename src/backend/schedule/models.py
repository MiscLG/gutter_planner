from django.db import models
from neomodel import (StructuredNode, StructuredRel, StringProperty, DateTimeProperty,
                      FloatProperty, IntegerProperty, UniqueIdProperty, BooleanProperty, Relationship, RelationshipTo, RelationshipFrom)
import datetime
# Create your models here.

DS_RATE = 10.00  # should be modified for business model
G_RATE = 10.00  # should be modified for business model


class Address(StructuredNode):
    # use address module form elsewhere
    addressLine1 = StringProperty(required=True, unique_index=True)
    addressLine2 = StringProperty()
    city = StringProperty()
    zipCode = StringProperty(Required=True)
    isGated = BooleanProperty()
    user = Relationship('users.models.User', 'ASSOCIATED_WITH')


class Job(StructuredNode):
    jid = UniqueIdProperty()
    depositPaid = BooleanProperty(required=True)
    dateStarted = DateTimeProperty()
    dateFinished = DateTimeProperty()

    client = RelationshipFrom('users.models.User', 'ORDERS')
    roofer = RelationshipTo('users.models.User', 'ASSIGNED_TO')


class Estimate(StructuredNode):
    eid = UniqueIdProperty()
    roofType = StringProperty(required=True)
    ftGutter = IntegerProperty(required=True)
    gutterColor = IntegerProperty()  # can be a relationship maybe
    gutterRate = FloatProperty(default=G_RATE)
    qtyDownspout = IntegerProperty(required=True)
    downspoutColor = IntegerProperty()  # can be a relationship maybe
    downspoutRate = FloatProperty(default=DS_RATE)
    roofInclination = StringProperty(required=True,
                                     choices={"low": '<15', "conventional": "15-30", "steep": ">30"})
    numFloors = IntegerProperty()
    spaciousGround = BooleanProperty()

    notes = StringProperty()
    creationDate = DateTimeProperty(default_now=True)
    client_made = BooleanProperty(default=True)

    estimator = RelationshipFrom(
        'users.models.User', 'CREATED')
    job = RelationshipFrom(Job, 'ESTIMATED_AS')
    address = Relationship(Address, 'DESIGNATED')

# class EstimateRel(StructuredRel):
#     creationDate = DateTimeProperty(default_now=True)
#     client_made = BooleanProperty(default=True)

# Color Choices may become lists or enums
