import graphene
from graphene.types.scalars import String
from graphene_django.types import DjangoObjectType, ObjectType
from register.models import Client, Employee


class ClientType(DjangoObjectType):
    class Meta:
        model = Client


class EmployeeType(DjangoObjectType):
    class Meta:
        model = Employee


class Query(ObjectType):
    client = graphene.Field(ClientType, id=graphene.Int())
    clients = graphene.List(ClientType)
    employee = graphene.Field(EmployeeType, id=graphene.Int())
    employees = graphene.List(EmployeeType)

    def resolve_auth(self, info, **kwargs):
        return

    def resolve_client(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Client.objects.get(pk=id)
        return None

    def resolve_client_by_name(self, info, name):
        return

    def resolve_clients(self, info, **kwargs):
        return Client.objects.all()

    def resolve_employee(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Employee.objects.get(pk=id)

        return None

    def resolve_employees(self, info, **kwargs):
        return Employee.objects.all()


class ClientInput(graphene.InputObjectType):
    # TODO: Fix Input to reflect finalized client model
    id = graphene.ID()
    name = graphene.String()


class EmployeeInput(graphene.InputObjectType):
    # TODO: Fix Input to reflect finalized Employee model
    id = graphene.ID()
    name = graphene.String()


class CreateClient(graphene.Mutation):
    class Arguments:
        input = ClientInput(required=True)

    ok = graphene.Boolean()
    client = graphene.Field(ClientType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        client_instance = Client(name=input.name)
        client_instance.save()
        return CreateClient(ok=ok, client=client_instance)


class UpdateClient(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = ClientInput(required=True)

    ok = graphene.Boolean()
    client = graphene.Field(ClientType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        client_instance = Client.objects.get(pk=id)
        if client_instance:
            ok = True
            client_instance.name = input.name
            client_instance.save()
            return UpdateClient(ok=ok, client=client_instance)
        return UpdateClient(ok=ok, client=None)


class CreateEmployee(graphene.Mutation):
    class Arguments:
        input = EmployeeInput(required=True)

    ok = graphene.Boolean()
    client = graphene.Field(ClientType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        employee_instance = Employee(name=input.name)
        employee_instance.save()
        return CreateEmployee(ok=ok, employee=employee_instance)


class UpdateEmployee(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = EmployeeInput(required=True)

    ok = graphene.Boolean()
    employee = graphene.Field(EmployeeType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        employee_instance = Employee.objects.get(pk=id)
        if employee_instance:
            ok = True
            employee_instance.name = input.name
            employee_instance.save()
            return UpdateEmployee(ok=ok, employee=employee_instance)
        return UpdateEmployee(ok=ok, employee=None)


class Mutation(graphene.ObjectType):
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
    create_employee = CreateEmployee.Field()
    update_employee = UpdateEmployee.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
