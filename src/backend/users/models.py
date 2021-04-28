from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser
from neomodel import (StructuredNode, StringProperty, EmailProperty,
                      UniqueIdProperty, BooleanProperty, Relationship, RelationshipTo)

# Create your models here.
MAX_NAME_LENGTH = 50


class GPUser(AbstractUser):
    email = models.EmailField(
        blank=False, max_length=254, verbose_name="email_address", unique=True)

    USERNAME_FIELD = "username"   # e.g: "username", "email"
    EMAIL_FIELD = "email"         # e.g: "email", "primary_email"


class User(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty(max_length=150, unique_index=True)
    email = EmailProperty(required=True, unique_index=True)
    firstName = StringProperty(max_length=MAX_NAME_LENGTH)
    lastName = StringProperty(max_length=MAX_NAME_LENGTH)
    user = models.OneToOneField(GPUser, on_delete=models.CASCADE)

    job = RelationshipTo('schedule.models.Job', 'ORDERS')
    address = Relationship('schedule.models.Address', 'ASSOCIATED_WITH')
