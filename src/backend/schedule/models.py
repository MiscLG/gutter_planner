from django.db import models
from neomodel import (StructuredNode, StructuredRel, StringProperty, DateTimeProperty,
                      FloatProperty, IntegerProperty, UniqueIdProperty, BooleanProperty, Relationship, RelationshipTo, RelationshipFrom)
import datetime

from neomodel.cardinality import OneOrMore, ZeroOrOne
# Create your models here.

DS_RATE = 10.00  # should be modified for business model
G_RATE = 10.00  # should be modified for business model


class Job(StructuredNode):
    jid = UniqueIdProperty()
    depositPaid = BooleanProperty(required=True)
    dateStarted = DateTimeProperty()
    date_finished = DateTimeProperty()

    client = RelationshipFrom('users.User', 'ORDERS')
    roofers = RelationshipTo('users.User', 'ASSIGNED_TO')
    address = Relationship('users.Adress', 'DESIGNATED')


# class EstimateRel(StructuredRel):
#     creationDate = DateTimeProperty(default_now=True)
#     client_made = BooleanProperty(default=True)


class Estimate(StructuredNode):
    eid = UniqueIdProperty()
    roofType = StringProperty(required=True)
    ftGutter = IntegerProperty(required=True)
    gutterColor = StringProperty()  # can be a relationship maybe
    gutterRate = FloatProperty(default=G_RATE)
    qtyDownspout = IntegerProperty(required=True)
    downspoutColor = StringProperty()  # can be a relationship maybe
    downspoutRate = FloatProperty(default=DS_RATE)
    roofInclination = StringProperty(required=True,
                                     choices={"low": '<15', "conventional": "15-30", "steep": ">30"})
    numFloors = IntegerProperty()
    spaciousGround = BooleanProperty()

    notes = StringProperty()
    creationDate = DateTimeProperty(default_now=True)
    client_made = BooleanProperty(default=True)

    estimator = RelationshipFrom(
        'user.User', 'CREATED')
    job = RelationshipFrom(Job, 'ESTIMATED_AS')
