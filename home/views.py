from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from rest_framework.utils import json
from .models import *


def experiments(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        content = body['Name']
        if len(Experiment.objects.all()) < 1:
            number = 0
        else:
            number = Experiment.objects.order_by('-Number')[0].Number
        exp = Experiment(Name=content, Number=number + 1)
        exp.save()
    return HttpResponse(exp.id)


def stagescrud(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        exp = Experiment.objects.filter(id=body['Experiment'])[0]
        if body['Type'] == 'updt':
            updtstage = Stage.objects.filter(Experiment=exp, PreparatoryStage=body['PreparatoryStage'])
            updtstage = updtstage.order_by('Number')[body['Number']]
            updtstage.Name = body['Name']
            updtstage.save()
        if body['Type'] == 'add':
            if len(Stage.objects.filter(Experiment=exp, PreparatoryStage=body['PreparatoryStage'])) == 0:
                stageNumber = 1
            else:
                stageNumber = \
                    Stage.objects.filter(Experiment=exp, PreparatoryStage=body['PreparatoryStage']).order_by('-Number')[
                        0].Number + 1
            stage = Stage(Name=body['Name'], Experiment=exp, PreparatoryStage=body['PreparatoryStage'],
                          Number=stageNumber)
            stage.save()
        if body['Type'] == 'del':
            delstage = Stage.objects.filter(Experiment=exp, PreparatoryStage=body['PreparatoryStage'])
            delstage = delstage.order_by('Number')[body['Number']]
            if delstage is not None:
                delstage.delete()
    return checkauth(request, 'Editor/Stages.html')


def stages(request):
    Experiments = Experiment.objects.filter(id=request.GET.get('Experiment'))
    if len(Experiments) == 0:
        expname = 'Экперимент не найден!'
        expid = 0
    else:
        expname = Experiments[0].Name
        expid = Experiments[0].id
    data = {'Experiment': expid, 'expname': expname}
    return checkauth(request, 'Editor/Stages.html', data)


def Start(request):
    user = request.user
    if request.method == 'POST' and user.is_authenticated == False:
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(username=username.lower(), password=password)
        if user is not None:
            login(request, user)
        else:
            data = {'message': 'Такого пользователя не существует'}
            return render(request, 'Welcome/StartPage.html', data)
    if user.is_authenticated == True:
        if user.groups.get().name == 'Editors':
            return checkauth(request, 'Editor/Experiments.html')
        if user.groups.get().name == 'Laboratorians':
            return render(request, 'Laboratorian/SelectSample.html')
        if user.groups.get().name == 'Customers':
            return HttpResponseRedirect("/customer/samples")
    return render(request, 'Welcome/StartPage.html')


def delexperiments(request):
    if request.method == 'POST':
        exp = Experiment.objects.filter(id=request.GET.get('Experiment'))
        if len(exp) > 0 and exp[0].id != 1:
            exp[0].delete()
    return checkauth(request, 'Editor/Experiments.html')


def stuffsstage(request):
    stg = Stage.objects.filter(id=request.GET.get('Stage'))[0]
    data = {'Name': stg.Name, 'Stage': stg.id, 'PreparatoryStage': str(request.POST.get('PreparatoryStage')),
            'Experiment': stg.Experiment.id, 'Number': stg.Number}
    return checkauth(request, 'Editor/StuffsStage.html', data)


def substages(request):
    stg = Stage.objects.filter(id=request.GET.get('Stage'))
    if len(stg) == 0:
        return checkauth(request, 'Editor/SubStages.html', {'Name': 'Этап не найден!'})
    stg = stg[0]
    data = {'Name': stg.Name, 'Experiment': stg.Experiment_id,
            'Number': stg.Number, 'Stage': stg.id}
    if stg.PreparatoryStage == True:
        return checkauth(request, 'Editor/SubStagesPrepare.html', data)
    return checkauth(request, 'Editor/SubStages.html', data)


def substagescrud(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        stage = Stage.objects.filter(id=body['Stage'])[0]
        HeadSubStage = SubStage.objects.filter(Parent=None, Main=stage).order_by('Number')
        if body['type'] == 'parallel':
            if body['Head'] == 'y':
                Conditionset = HeadSubStage
            else:
                Subs = SubStage.objects.filter(Parent=HeadSubStage[body['Number']]).order_by('Number')[body['index']]
                Conditionset = SubStage.objects.filter(Parent=Subs).order_by('Number')
            for i in range(len(body['parallel'])):
                x = Conditionset[i]
                x.Condition = body['parallel'][i]
                x.save()
            return checkauth(request, 'Editor/SubStages.html')
        if body['type'] == 'updt':
            forupdt = SubStage.objects.filter(id=body['id'])[0]
            forupdt.Risks = body.get('risks')
            forupdt.Attention = body.get('attention')
            if body.get('duration') != '':
                forupdt.Duration = body.get('duration')
            forupdt.Name = body['Name']
            forupdt.Picture = body.get('picture')
            for i in Parameter.objects.filter(SubStage=forupdt):
                i.delete()
            for i in body.get('param'):
                x = Parameter(MainStage=stage, SubStage=forupdt, ParameterName=i['name'],
                              ExactValue=i.get('value'), Equipment=i['eq'], Unit=i.get('meassure'))
                x.save()
            for i in CalcParameter.objects.filter(SubStage=forupdt):
                i.delete()
            for i in body.get('paramcalc'):
                x = CalcParameter(MainStage=stage, SubStage=forupdt, VarName=i.get('variable'),
                                  ParameterName=i.get('name'), Unit=i.get('meassure'))
                x.save()
            for i in body.get('paramperiod'):
                x = CalcParameter(MainStage=stage, SubStage=forupdt, VarName=i.get('variable'), \
                                  ParameterName=i.get('name'), Unit=i.get('meassure'), Period=True)
                x.save()

            for replay in Replay.objects.filter(SubStage=forupdt):
                replay.delete()
            if body.get('replay').get('check') is not False:
                forupdt.ReplayMessage = body.get('replay').get('message')
                for replay in body.get('replay').get('povtor_podetaps'):
                    if replay is not None:
                        Replay(MainStage=forupdt.Main, SubStage=forupdt, ReplaySubStage=replay).save()
            forupdt.save()
            return checkauth(request, 'Editor/SubStages.html')
        if body['type'] == 'add':
            if len(HeadSubStage) <= body['Main']:
                newSubS = SubStage(Parent=None, Main=stage, Number=0)
                newSubS.save()
                newSubS1 = SubStage(Parent=newSubS, Main=stage, Number=1, Name=body['Name'])
                newSubS1.save()
                Subid = newSubS1.id
            else:
                if body['index'] is None:
                    NumberSubStages = SubStage.objects.filter(Parent=HeadSubStage[body['Main']], Main=stage)
                    NumberSubStage = NumberSubStages.order_by('-Number')[0].Number + 1
                    newSubS = SubStage(Parent=HeadSubStage[body['Main']], Main=stage, Number=NumberSubStage,
                                       Name=body['Name'])
                    SubStage.objects.filter(Parent=HeadSubStage[body['Main']], Main=stage, Number=NumberSubStage,
                                            Name=body['Name'])
                    newSubS.save()
                    Subid = newSubS.id
                else:
                    SubParents = SubStage.objects.filter(Parent=HeadSubStage[body['Main']]).order_by('Number')
                    SubParent = SubParents[body['Number']]
                    HeadSubSubStage = SubStage.objects.filter(Parent=SubParent, Main=stage).order_by('Number')
                    if len(HeadSubSubStage) <= body['index']:
                        newSubStage = SubStage(Parent=SubParent, Main=stage, Number=0)
                        newSubStage.save()
                        newSubStage1 = SubStage(Parent=newSubStage, Main=stage, Number=1, Name=body['Name'])
                        newSubStage1.save()
                        Subid = newSubStage1.id
                    else:
                        SubParents = SubStage.objects.filter(Parent=SubParent, Main=stage).order_by('Number')
                        SubSubParent = SubParents[body['index']]
                        NumberSubStages = SubStage.objects.filter(Parent=SubSubParent, Main=stage)
                        NumberSubStage = NumberSubStages.order_by('-Number')[0].Number
                        newSubStage = SubStage(Parent=SubSubParent, Main=stage, Number=NumberSubStage,
                                               Name=body['Name'])
                        newSubStage.save()
                        Subid = newSubStage.id
            return HttpResponse(Subid)
        if body['type'] == 'del':
            SubStageSon = SubStage.objects.filter(id=body['id'])[0]
            SubStageParent = SubStageSon.Parent
            if len(SubStage.objects.filter(Parent=SubStageParent)) < 2:
                SubStageParent.delete()
            else:
                SubStageSon.delete()
    return HttpResponse(None)


def is_exist(s):
    if s is not None:
        return s
    return None


def minicheckprepare(request):
    stage = Stage.objects.filter(id=request.GET.get('Stage'))[0]
    data = {'Experiment': stage.Experiment_id, 'Stage': stage.id, 'Name': stage.Name}
    return checkauth(request, 'Editor/MiniCheckPrepare.html', data)


def minicheckpreparecrud(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    for criterion in Criterion.objects.filter(Stage_id=body.get('Stage')):
        criterion.delete()
    for criterion in body.get('Criterions'):
        Criterion(Name=criterion, Stage_id=body.get('Stage')).save()
    return HttpResponse('Success')


def stuffscrud(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    if request.method == 'POST' and body.get('Add') == 1:
        for protectEquip in ProtectiveEquipment.objects.filter(Stage_id=body['Stage']):
            protectEquip.delete()
        for doc in Doc.objects.filter(Stage_id=body['Stage']):
            doc.delete()
        for reag in Reagents.objects.filter(Stage_id=body['Stage']):
            reag.delete()
        for dis in Dishes.objects.filter(Stage_id=body['Stage']):
            dis.delete()
        for equip in Equipment.objects.filter(Stage_id=body['Stage']):
            equip.delete()

        for protectEquip in body['ProtectiveEquipment']:
            ProtectiveEquipment(Stage_id=body['Stage'], Name=protectEquip.get('Name')).save()
        for doc in body['Doc']:
            Doc(Stage_id=body['Stage'], Name=doc.get('Name')).save()
        for reag in body['Reagents']:
            Reagents(Stage_id=body['Stage'], Name=reag.get('Name')).save()
        for dis in body['Dishes']:
            Dishes(Stage_id=body['Stage'], Name=dis.get('Name')).save()
        for equip in body['Equipment']:
            Equipment(Stage_id=body['Stage'], Name=equip.get('Name')).save()
    return checkauth(request, 'Editor/StuffsStage.html')


def preparatory(request):
    requestStage = Stage.objects.filter(id=request.GET.get('Stage'))[0]
    data = {'Name': requestStage.Name, 'Experiment': requestStage.Experiment_id,
            'Number': requestStage.Number, 'Stage': requestStage.id}
    return checkauth(request, 'Editor/PreparatoryConnect.html', data)


def preparatorycrud(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        array = body['array']
        stg = Stage.objects.filter(id=body['Stage'])[0]
        Paragraph.objects.filter(Stage=stg).delete()
        for i in array:
            stgpre = Stage.objects.filter(id=i['extra_etap'])
            if len(stgpre) > 0:
                Paragraph(Name=i['name'], Stage=stg, PreparatoryStage=stgpre[0].id,
                          PreparatoryStageName=stgpre[0].Name).save()
            else:
                Paragraph(Name=i['name'], Stage=stg).save()
    return checkauth(request, 'Editor/PreparatoryConnect.html')


# redirect(Start) переходит по адресу /logout, с ним не работает
def LogoutView(request):
    logout(request)
    return redirect(Start)


def checkauth(request, url, data=None):
    if request.user.is_authenticated:
        if request.user.groups.get().name == 'Editors':
            return render(request, url, context=data)
        else:
            return render(request, 'Errors/ErrLaboratorian.html')
    return redirect(Start)
