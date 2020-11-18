import datetime

from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework.utils import json

from Checklist.settings import MEDIA_ROOT
from lab.models import *
from home.models import *
from home.views import Start


def moveToExeSub(preSubStage, SubStages, ExeStage1, ParentExeSubStage):
    for i in SubStages:
        if i.Parent == preSubStage:
            ParentExeSubStage1 = ExeSubStage(ExeStage=ExeStage1, Number=i.Number, Criterion=i.Criterion,
                                             Name=i.Name, Risks=i.Risks, Condition=i.Condition, SubStage=i,
                                             Attention=i.Attention, Duration=i.Duration, Picture=i.Picture,
                                             OtherOption=i.OtherOption, Check=False, Parent=ParentExeSubStage,
                                             ReplayMessage=i.ReplayMessage)
            ParentExeSubStage1.save()
            Parametrs = Parameter.objects.filter(SubStage=i)
            CalcParametrs = CalcParameter.objects.filter(SubStage=i)

            for Parametr in Parametrs:
                ExeParameter(ExeSubStage=ParentExeSubStage1,
                             ExeMainStage=ParentExeSubStage1.ExeStage,
                             ParameterName=Parametr.ParameterName,
                             From=Parametr.From,
                             To=Parametr.To,
                             ExactValue=Parametr.ExactValue,
                             Equipment=Parametr.Equipment,
                             Unit=Parametr.Unit).save()

            for CalcParametr in CalcParametrs:
                ExeCalcParameter(ExeSubStage=ParentExeSubStage1,
                                 ExeMainStage=ParentExeSubStage1.ExeStage,
                                 ParameterName=CalcParametr.ParameterName,
                                 VarName=CalcParametr.VarName,
                                 Period=CalcParametr.Period,
                                 Unit=CalcParametr.Unit).save()


            moveToExeSub(i, SubStages, ExeStage1, ParentExeSubStage1)


def moveStuffToExe(NewExeStage, OldStage):
    for Equip in Equipment.objects.filter(Stage=OldStage):
        ExeEquipment(Name=Equip.Name, ExeStage=NewExeStage).save()
    for dis in Dishes.objects.filter(Stage=OldStage):
        ExeDishes(Name=dis.Name, ExeStage=NewExeStage).save()
    for reagent in Reagents.objects.filter(Stage=OldStage):
        ExeReagents(Name=reagent.Name, ExeStage=NewExeStage).save()
    for Protect in ProtectiveEquipment.objects.filter(Stage=OldStage):
        ExeProtectiveEquipment(Name=Protect.Name, ExeStage=NewExeStage).save()
    for doc in Doc.objects.filter(Stage=OldStage):
        ExeDoc(Name=doc.Name, ExeStage=NewExeStage).save()


def stages(request):
    NumberExperiment = 2

    if request.method == 'POST':
        RequestSample = request.POST.get('Sample')
    if request.method == 'GET':
        RequestSample = request.GET.get('Sample')

    if RequestSample is None or RequestSample == '':
        data = {'Message': 'Нет выбранной пробы'}
        return render(request, "Errors/ErrLaboratorian.html", data)
    if request.POST.get("Finish") is not None:
        ExeStageupdt = ExeStage.objects.filter(id=request.POST.get("ExeStage"))[0]
        ExeStageupdt.Check = True
        ExeStageupdt.save()

    '''for ExeExp1 in ExeExperiment.objects.all():
        ExeExp1.delete()'''

    ExeExp = ExeExperiment.objects.filter(Samples_id=RequestSample)
    if len(ExeExp) < 1:
        ExeExperiment(Samples_id=RequestSample, Laboratorian=request.user.id, Number=1).save()
        ExeExp = ExeExperiment.objects.filter(Samples_id=RequestSample)
    ExeExp = ExeExp[0]

    '''for stage in ExeStage.objects.all():
        stage.delete()'''

    ExeStages = ExeStage.objects.filter(ExeExperiment=ExeExp)
    if len(ExeStages) < 1:
        Exp = Experiment.objects.filter(id=NumberExperiment)[0]
        for i in Stage.objects.filter(Experiment=Exp):
            if not i.PreparatoryStage:
                x = ExeStage(Check=False, ExeExperiment=ExeExp, Stage=i,
                             Name=i.Name, Number=i.Number, PreparatoryStage=i.PreparatoryStage)
                x.save()
                moveStuffToExe(x, i)
                SubStages = SubStage.objects.filter(Main=i)
                if len(ExeSubStage.objects.filter(ExeStage=x)) < 1:
                    moveToExeSub(None, SubStages, x, None)
        for ExeStg in ExeStage.objects.filter(ExeExperiment=ExeExp):
            for Para in Paragraph.objects.filter(Stage=ExeStg.Stage):
                StageForExe = Stage.objects.filter(id=Para.PreparatoryStage)
                if len(StageForExe) > 0:
                    x = ExeStage(Check=False, ExeExperiment=ExeExp, Stage=StageForExe[0],
                                 Name=StageForExe[0].Name, Number=StageForExe[0].Number,
                                 PreparatoryStage=StageForExe[0].PreparatoryStage)
                    x.save()
                    moveStuffToExe(x, StageForExe[0])
                    ExeParagraph(Name=Para.Name, ExePreparatoryStageName=Para.PreparatoryStageName,
                                                   ExeStage=ExeStg, ExePreparatoryStage=x.id).save()
                    SubStages = SubStage.objects.filter(Main=x.Stage)
                    if len(ExeSubStage.objects.filter(ExeStage=x)) < 1:
                        moveToExeSub(None, SubStages, x, None)
                else:
                    ExeParagraph(Name=Para.Name, ExeStage=ExeStg, ExePreparatoryStage = 0).save()
        for ExeStg in ExeStage.objects.filter(ExeExperiment=ExeExp):
            for ExeSubStg in ExeSubStage.objects.filter(ExeStage=ExeStg):
                for Repl in Replay.objects.filter(SubStage=ExeSubStg.SubStage):
                    ReplayExeSubStage = ExeSubStage.objects.filter(SubStage_id=Repl.ReplaySubStage, ExeStage=ExeStg)
                    if len(ReplayExeSubStage) > 0:
                        ExeReplay(MainStage=ExeStg,
                                 ExeSubStage=ExeSubStg,
                                 ReplaySubStage=ReplayExeSubStage[0].id).save()
            for crit in Criterion.objects.filter(Stage=ExeStg.Stage):
                ExeCriterion(ExeStage=ExeStg, Name=crit.Name).save()
    SampleName = Samples.objects.filter(id=RequestSample)[0].LabCode
    data = {'Sample': RequestSample, 'ExeExperiment': ExeExp.id, 'SampleName': SampleName}
    return checkauth(request, "Laboratorian/Stages.html", data)


def allpreparestage():
    NumberExperiment = 2
    for delStage in Stage.objects.filter(Number=-1):
        delStage.delete()
    for delExeStage in ExeStage.objects.filter(Number=-1):
        delExeStage.delete()
    allPrepareStage = Stage(Name='Все подготовительные этапы',
          PreparatoryStage=False, Experiment_id=NumberExperiment, Number=-1)
    allPrepareStage.save()

    for prepareStage in Stage.objects.filter(PreparatoryStage=1, Experiment_id=NumberExperiment):
        Paragraph(PreparatoryStage=prepareStage.id, Name=prepareStage.Name,
                  PreparatoryStageName=prepareStage.Name, Stage=allPrepareStage).save()

    ExeExp = ExeExperiment.objects.last()
    ExeStageAll = ExeStage(Check=False, Stage=allPrepareStage, Name=allPrepareStage.Name,
                 Number=allPrepareStage.Number, ExeExperiment=ExeExp,
                 PreparatoryStage=allPrepareStage.PreparatoryStage)
    ExeStageAll.save()
    moveStuffToExe(ExeStageAll, allPrepareStage)
    SubStages = SubStage.objects.filter(Main=allPrepareStage)

    if len(ExeSubStage.objects.filter(ExeStage=ExeStageAll)) < 1:
        moveToExeSub(None, SubStages, ExeStageAll, None)
    for Para in Paragraph.objects.filter(Stage=ExeStageAll.Stage):
        StageForExe = Stage.objects.filter(id=Para.PreparatoryStage)
        if (len(StageForExe) > 0):
            x = ExeStage(Check=False, Stage=StageForExe[0], ExeExperiment=ExeExp,
                         Name=StageForExe[0].Name, Number=-1,
                         PreparatoryStage=StageForExe[0].PreparatoryStage)
            x.save()
            moveStuffToExe(x, StageForExe[0])
            newExeParagraph = ExeParagraph(Name=Para.Name, ExePreparatoryStageName=Para.PreparatoryStageName,
                                           ExeStage=ExeStageAll, ExePreparatoryStage=x.id)
            newExeParagraph.save()
            SubStages = SubStage.objects.filter(Main_id=StageForExe[0])
            if len(ExeSubStage.objects.filter(ExeStage=x)) < 1:
                moveToExeSub(None, SubStages, x, None)
        else:
            ExeParagraph(Name=Para.Name, ExeStage=ExeStageAll, ExePreparatoryStage=0).save()
    for ExeStg1 in ExeStage.objects.filter(Number=-1):
        for crit in Criterion.objects.filter(Stage=ExeStg1.Stage):
            x = ExeCriterion(ExeStage=ExeStg1, Name=crit.Name).save()

def sample(request):
    data = {'Message': 'Заполните всю необходимую информацию о пробе'}
    if request.POST.get('submit') == 'Вернуться назад':
        return checkauth(request, "Laboratorian/SelectSample.html")
    if request.POST.get('submit') == 'Сохранить':
        FormSelectionDate = datetime.date(int(str(request.POST.get('SelectionYear'))),
                                          int(str(request.POST.get('SelectionMonth'))),
                                          int(str(request.POST.get('SelectionDay'))))
        FormReceiptDate = datetime.date(int(str(request.POST.get('ReceiptYear'))),
                                        int(str(request.POST.get('ReceiptMonth'))),
                                        int(str(request.POST.get('ReceiptDay'))))
        Samples(
            Laboratorian=request.user.id,
            Customer=request.POST.get('Customer'),
            CustomerCode=request.POST.get('CustomerCode'),
            Deposit=request.POST.get('Deposit'),
            WellNumber=request.POST.get('WellNumber'),
            SelectionDate=FormSelectionDate,
            ActNumber=request.POST.get('ActNumber'),
            LabSurname=request.POST.get('LabSurname'),
            LabName=request.POST.get('LabName'),
            LabPatronymic=request.POST.get('LabPatronymic'),
            LabCode=request.POST.get('LabCode'),
            ReceiptDate=FormReceiptDate,
            Comment=request.POST.get('Comment'),
        ).save()
        data = {'Message': 'Добвлена проба: ' + request.POST.get('LabCode')}
    return checkauth(request, "Laboratorian/CreateSample.html", data)


def selectsample(request):
    return checkauth(request, "Laboratorian/SelectSample.html")


def dataStuffs(request):

    if request.GET.get("ExeStage") == '-1':
        allpreparestage()
        FindExeStage = ExeStage.objects.filter(Number=-1)
    else:
        FindExeStage = ExeStage.objects.filter(id=request.GET.get("ExeStage"))

    if len(FindExeStage) == 0:
        data = {"Stage": 0, "ExeStageName": 'Этап не найден'}
        return data
    else:
        GetExeExperiment = ExeExperiment.objects.filter(id=FindExeStage[0].ExeExperiment.id)[0]
        data = {"Stage": FindExeStage[0].Stage.id, "ExeStage": FindExeStage[0].id, 'ExeExperiment': GetExeExperiment.id,
                "ExeStageName": FindExeStage[0].Name, 'Sample': GetExeExperiment.Samples.id, 'Number': FindExeStage[0].Number,
                'SampleName': GetExeExperiment.Samples.LabCode}
    return data


def stuffs(request):
    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        if body.get('Finish') is not None:
            ExeStageupdt = ExeStage.objects.filter(id=body.get('ExeStage'))
            if len(ExeStageupdt) >= 1:
                ExeStageupdt[0].CheckStuff = True
                ExeStageupdt[0].save()
        return checkauth(request, "Laboratorian/Stuffs.html")
    data = dataStuffs(request)
    return checkauth(request, "Laboratorian/Stuffs.html", data)


def preparatory(request):
    data = dataStuffs(request)
    subs = ExeSubStage.objects.filter(ExeStage_id=data.get('ExeStage'))
    if request.GET.get("ExeStage") == '-1':
        return checkauth(request, "Laboratorian/Preparatory.html", data)
    if len(subs) < 1:
        data = {'Message': 'Этот подготовительный этап еще создается заходите позже :)'}
        return render(request, "Errors/ErrLaboratorian.html", data)
    return checkauth(request, "Laboratorian/Preparatory.html", data)


def preparatorycrud(request):
    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        if body.get("finish") == "CheckStuff":
            updtExeStage = ExeStage.objects.filter(id=body.get("Stage"))[0]
            updtExeStage.CheckStuff = True
            updtExeStage.save()
        if body.get("finish") == "All":
            PrepareStage = ExeStage.objects.filter(id=body.get("PrepareStage"))[0]
            PrepareStage.Check = True
            PrepareStage.save()
        if body.get("finish") == "Stage":
            StageCheck = ExeStage.objects.filter(id=body.get('id'))[0]
            StageCheck.Check = True
            StageCheck.save()
        if body.get("finish") == "SubStage":
            StageParams = body.get("params")
            ExeStageParams = body.get("planparams")
            SubStageCheck = ExeSubStage.objects.filter(id=body.get('id'))[0]
            SubStageCheck.Check = True
            SubStageCheck.save()
            for StageParam in range(len(StageParams)):
                for SubStageParams in range(len(ExeStageParams[StageParam])):
                    for SubStageParam in range(len(ExeStageParams[StageParam][SubStageParams])):
                        exeStageId = ExeStageParams[StageParam][SubStageParams][SubStageParam].get("id")
                        newValue = StageParams[StageParam][SubStageParams][SubStageParam]
                        updtExeParameter = ExeParameter.objects.filter(id=exeStageId)[0]
                        if newValue.isdigit():
                            updtExeParameter.Value = newValue
                            updtExeParameter.save()
    return checkauth(request, "Laboratorian/Preparatory.html")


def checkcrud(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    data = 'unsuccessful'
    if body.get('type') == 'CheckSub':
        ExeSubStages = ExeSubStage.objects.filter(id=body.get('id'))
        if len(ExeSubStages) > 0:
            ExeSubStages[0].Check = True
            ExeSubStages[0].save()
            if body.get('addParam'):
                addParametr(body)
            data = 'successful'
    return HttpResponse(data)



def addParametr(body):
    for param in body.get('Parameter'):
        updateExeParameter = ExeParameter.objects.filter(id=param.get('id'))
        if (len(updateExeParameter) > 0):
            updateExeParameter[0].Value = param.get('parametr')
            updateExeParameter[0].save()

    for Calcparam in body.get('CalcParameter'):
        updateExeCalcParameter = ExeCalcParameter.objects.filter(id=Calcparam.get('id'))
        if (len(updateExeCalcParameter) > 0):
            updateExeCalcParameter[0].Value = Calcparam.get('parametr')
            updateExeCalcParameter[0].save()

    for Periodparam in body.get('Period'):
        updatePeriodparam = ExeCalcParameter.objects.filter(id=Periodparam.get('id'))
        if (len(updatePeriodparam) > 0):
            for exe in ExePeriod.objects.filter(ExeCalcParameter_id=Periodparam.get('id')):
                exe.delete()
            for parametr1 in Periodparam.get('parametr'):
                newExePeriod = ExePeriod(Value=parametr1.get('value'), Time=parametr1.get('time'),
                                         ExeCalcParameter_id=Periodparam.get('id'))
                newExePeriod.save()

def check(request):
    if request.FILES.get('file') is not None:
        updtExeSubStage = ExeSubStage.objects.filter(id=request.POST.get('id'))
        if (len(updtExeSubStage)>0):
            Picture(Image=request.FILES.get('file'), ExeSubStage=updtExeSubStage[0]).save()
        return HttpResponse('Success')

    ExeStage1 = ExeStage.objects.filter(id=request.GET.get("ExeStage"))
    if len(ExeStage1) < 1:
        data = {'Message': 'Чек-лист подэтапов еще не создан'}
        return render(request, "Errors/ErrLaboratorian.html", data)

    SubStages = SubStage.objects.filter(Main=ExeStage1[0].Stage)
    if len(SubStages) < 1:
        data = {'Message': 'Чек-лист подэтапов еще не создан'}
        return render(request, "Errors/ErrLaboratorian.html", data)
    if len(ExeSubStage.objects.filter(ExeStage=ExeStage1[0])) < 1:
        moveToExeSub(None, SubStages, ExeStage1[0], None)


    CurrentSamples = ExeStage1[0].ExeExperiment.Samples

    data = {"Stage": ExeStage1[0].Stage.id, "ExeStage": ExeStage1[0].id,
            "ExeStageName": ExeStage1[0].Name, 'SampleName': CurrentSamples.LabCode,
            'Sample': CurrentSamples.id, 'ExeExperiment': ExeStage1[0].ExeExperiment.id}
    return checkauth(request, "Laboratorian/Check.html", data)


def checkauth(request, url, data=None):
    if request.user.is_authenticated:
        if request.user.groups.get().name == "Laboratorians":
            return render(request, url, context=data)
        else:
            return render(request, "Errors/ErrLaboratorian.html")
    return redirect(Start)
