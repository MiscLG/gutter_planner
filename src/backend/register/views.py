from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello World! Please register to use our service.")
# Create your views here.
