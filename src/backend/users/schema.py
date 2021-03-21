import graphene

# from graphene.types.scalars import String
from six import add_metaclass
from users.models import *
from graphene_django.types import ObjectType

from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations, exceptions
import graphql_social_auth
from neomodel import db
from common.utils import makeMutation, getNodes
from django.utils.translation import gettext as _


class AddressFields(object):
    # TODO: parse StructuredNodes into graphene ObjectTypes
    addressLine1 = graphene.String()
    addressLine2 = graphene.String()
    city = graphene.String()
    zipCode = graphene.String()
    isGated = graphene.Boolean()


class AddressType(graphene.ObjectType, AddressFields):
    # TODO: Add resolution to associated users
    pass



CreateAddress = makeMutation(AddressFields, AddressType, Address)


class Query(UserQuery, MeQuery, ObjectType):
    addresses = graphene.List(AddressType)

    def resolve_addresses(self, info, **kwargs):
        return getNodes(Address)

    # client = graphene.Field(ClientType, id=graphene.Int())
    # clients = graphene.List(ClientType)
    # employee = graphene.Field(EmployeeType, id=graphene.Int())
    # employees = graphene.List(EmployeeType)

    # def resolve_auth(self, info, **kwargs):
    #     return

    # def resolve_client(self, info, **kwargs):
    #     id = kwargs.get('id')
    #     name = kwargs.get('name')
    #     if id is not None:
    #         return Client.objects.get(pk=id)
    #     return None

    # def resolve_client_by_name(self, info, name):
    #     return

    # def resolve_clients(self, info, **kwargs):
    #     return Client.objects.all()

    # def resolve_employee(self, info, **kwargs):
    #     id = kwargs.get('id')

    #     if id is not None:
    #         return Employee.objects.get(pk=id)

    #     return None

    # def resolve_employees(self, info, **kwargs):
    #     return Employee.objects.all()


class DBRegistrationError(exceptions.GraphQLAuthError):
    default_message = _("There was an error adding the user to our database.")


class customRegister(mutations.Register):
    # TODO: modify social auth for extra redundancy checks and DB management
    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        r_val = super().resolve_mutation(root, info, **kwargs)
        # print(r_val.__dict__)
        # print(root)
        # print(info)
        # print(kwargs)
        # print(r_val.success)
        if r_val.success:
            usr = GPUser.objects.get(username=kwargs.get('username'))
            try:
                User(
                    username=kwargs.get('username'),
                    email=kwargs.get('email'),
                    user=usr
                ).save()
            except:
                usr.delete()
                r_val = cls(success=False,
                            errors={'DatabaseError': "Could not add user to database"})
                raise DBRegistrationError

        return r_val


class AuthMutation(graphene.ObjectType):
    # TODO: Make a mutation to make neo4j User object
    register = customRegister.Field()
    # register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_set = mutations.PasswordSet.Field()  # For passwordless registration
    password_change = mutations.PasswordChange.Field()
    update_account = mutations.UpdateAccount.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    send_secondary_email_activation = mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    # django-graphql-jwt inheritances
    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class Mutation(AuthMutation, graphene.ObjectType):
    social_auth = graphql_social_auth.SocialAuth.Field()
    create_address = CreateAddress.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)


# class ClientInput(graphene.InputObjectType):
#     # TODO: Fix Input to reflect finalized client model
#     id = graphene.ID()
#     # name = graphene.String()
#     # email = graphene.String()

# class EmployeeInput(graphene.InputObjectType):
#     # TODO: Fix Input to reflect finalized Employee model
#     id = graphene.ID()
#     name = graphene.String()

# class CreateClient(graphene.Mutation):
#     class Arguments:
#         input = ClientInput(required=True)

#     ok = graphene.Boolean()
#     client = graphene.Field(ClientType)

#     @staticmethod
#     def mutate(root, info, input=None):
#         ok = True
#         client_instance = Client(name=input.name)
#         client_instance.save()
#         return CreateClient(ok=ok, client=client_instance)

# class UpdateClient(graphene.Mutation):
#     class Arguments:
#         id = graphene.Int(required=True)
#         input = ClientInput(required=True)

#     ok = graphene.Boolean()
#     client = graphene.Field(ClientType)

#     @staticmethod
#     def mutate(root, info, id, input=None):
#         ok = False
#         client_instance = Client.objects.get(pk=id)
#         if client_instance:
#             ok = True
#             client_instance.name = input.name
#             client_instance.save()
#             return UpdateClient(ok=ok, client=client_instance)
#         return UpdateClient(ok=ok, client=None)

# class CreateEmployee(graphene.Mutation):
#     class Arguments:
#         input = EmployeeInput(required=True)

#     ok = graphene.Boolean()
#     client = graphene.Field(ClientType)

#     @staticmethod
#     def mutate(root, info, input=None):
#         ok = True
#         employee_instance = Employee(name=input.name)
#         employee_instance.save()
#         return CreateEmployee(ok=ok, employee=employee_instance)

# class UpdateEmployee(graphene.Mutation):
#     class Arguments:
#         id = graphene.Int(required=True)
#         input = EmployeeInput(required=True)

#     ok = graphene.Boolean()
#     employee = graphene.Field(EmployeeType)

#     @staticmethod
#     def mutate(root, info, id, input=None):
#         ok = False
#         employee_instance = Employee.objects.get(pk=id)
#         if employee_instance:
#             ok = True
#             employee_instance.name = input.name
#             employee_instance.save()
#             return UpdateEmployee(ok=ok, employee=employee_instance)
#         return UpdateEmployee(ok=ok, employee=None)
