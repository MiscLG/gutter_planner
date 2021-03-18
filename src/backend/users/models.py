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
        blank=False, max_length=254, verbose_name="email_address")

    USERNAME_FIELD = "username"   # e.g: "username", "email"
    EMAIL_FIELD = "email"         # e.g: "email", "primary_email"


class User(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty(max_length=150, unique=True)
    email = EmailProperty(required=True)
    firstName = StringProperty(max_length=MAX_NAME_LENGTH)
    lastName = StringProperty(max_length=MAX_NAME_LENGTH)
    user = models.OneToOneField(GPUser, on_delete=models.CASCADE)


class Address(StructuredNode):
    # use address module form elsewhere
    addressline1 = StringProperty(required=True, unique=True)
    addressline2 = StringProperty()
    city = StringProperty()
    zipCode = StringProperty(Required=True)
    isGated = BooleanProperty()
    user = Relationship('User', 'ASSOCIATED_WITH')
    # line1 = models.CharField(max_length=100)
    # street = models.CharField(max_length=100)
    # city = models.CharField(max_length=100)
    # zip = models.CharField(max_length=12)

    # def _str_(self):
    #     return self.line1, self.street, self.city, self.zip

    # class Meta:
    #     ordering = ('street',)
