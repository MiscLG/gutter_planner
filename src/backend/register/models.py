from django.db import models

# Create your models here.


class Address(models.Model):
    # use address module form elsewhere
    line1 = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    zip = models.CharField(max_length=12)

    def _str_(self):
        return self.line1, self.street, self.city, self.zip

    class Meta:
        ordering = ('street',)


class Client(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    # Change model type
    address = models.ManyToManyField(Address)

    def _str_(self):
        return self.name

    class Meta:
        ordering = ('name',)


class Employee(models.Model):
    name = models.CharField(max_length=100)

    def _str_(self):
        return self.name

    class Meta:
        ordering = ('name',)
