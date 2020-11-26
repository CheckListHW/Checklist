from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework.utils import json
from .models import *

from lab.models import *
from home.models import *
from home.views import Start


def InfoSample(request):
    if request.method == 'GET':
        SampleId = request.GET.get('Sample')
        SampleName = Samples.objects.filter(id=SampleId)
        if len(SampleName) > 0:
            print(SampleName)
            data = {'Sample': SampleId, 'SampleName': SampleName[0].LabCode}
            return checkauth(request, "Customer/InfoSample.html", data)
    return render(request, 'Errors/ErrCustomer.html')


def selectsample(request):
    return checkauth(request, "Customer/SelectSample.html")


def checkauth(request, url, data=None):
    if request.user.is_authenticated:
        print(request.user.groups.get().name)
        if request.user.groups.get().name == 'Customers':
            return render(request, url, context=data)
        else:
            return render(request, 'Errors/ErrCustomer.html')
    return redirect(Start)
