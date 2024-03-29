import graphene
from six import add_metaclass
from graphene_django.types import ObjectType
from graphene_django import DjangoObjectType
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations, exceptions
import graphql_social_auth
from django.utils.translation import gettext as _


from neomodel import db
from users.models import *
from common.utils import modelSchema, getNodes, getNode, makeInput


class GPUserType(DjangoObjectType):
    class Meta:
        model = GPUser
        fields = ("username", "email")


class UserType(graphene.ObjectType):
    id = graphene.String()
    uid = graphene.String()
    username = graphene.String()
    email = graphene.String()
    firstName = graphene.String()
    lastName = graphene.String()
    isStaff = graphene.Boolean()

    def resolve_isStaff(root, info):
        usr = GPUser.objects.get(username=root.username)
        return usr.is_staff


class Query(UserQuery, MeQuery, ObjectType):
    user = graphene.Field(UserType, uid=graphene.String(
    ), username=graphene.String(), email=graphene.String())

    def resolve_user(self, info, **kwargs):
        return getNode(User, kwargs)


class DBRegistrationError(exceptions.GraphQLAuthError):
    default_message = _("There was an error adding the user to our database.")


def make_user(kwargs, callback):
    #Work in progress
    raise DBRegistrationError
    usr = GPUser.objects.get(username=kwargs.get('username'))
    try:
        User(
            username=kwargs.get('username'),
            email=kwargs.get('email'),
            user=usr
        ).save()
        return callback
    except:
        usr.delete()
        # r_val = cls(success=False,
        #             errors={'DatabaseError': "Could not add user to database"})
        raise DBRegistrationError


class customRegister(mutations.Register):
    @classmethod
    def resolve_mutation(cls, root, info, **kwargs):
        print(kwargs.get("username"))
        r_val = super().resolve_mutation(root, info, **kwargs)
        usr = GPUser.objects.get(username=kwargs.get('username'))
        if r_val:
            try:
                User(
                    username=kwargs.get('username'),
                    email=kwargs.get('email'),
                    user=usr
                ).save()
                return r_val
            except:
                usr.delete()
                r_val = cls(success=False,
                            errors={'DatabaseError': "Could not add user to database"})
                raise DBRegistrationError


class SocialAuth(graphql_social_auth.SocialAuthMutation):
    user_data = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, social, **kwargs):
        props = {
            "username": social.user.username,
            "email": social.user.email,
            "firstName": social.user.first_name,
            "lastName": social.user.last_name
        }
        usr = UserType(
            **props
        )
        try:
            User(
                **props,
                user=social.user
            ).save()
            return cls(user_data=usr)
        except:
            return cls(user_data=usr)


class AuthMutation(graphene.ObjectType):
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
    social_auth = SocialAuth.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
