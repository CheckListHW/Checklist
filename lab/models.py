from django.db import models

# Create your models here.
from Checklist.settings import MEDIA_URL, MEDIA_ROOT
from home.models import Stage, Experiment, SubStage


class Samples(models.Model):
    Laboratorian = models.IntegerField()
    Check = models.BooleanField(null='true',)
    Customer = models.CharField(max_length=100, null='true')
    CustomerCode = models.CharField(max_length=100, null='true')
    Deposit = models.CharField(max_length=100, null='true')
    WellNumber = models.CharField(max_length=100, null='true')
    SelectionDate = models.DateField(max_length=100, null='true')
    ActNumber = models.CharField(max_length=100, null='true')
    LabSurname = models.CharField(max_length=100, null='true')
    LabName = models.CharField(max_length=100, null='true')
    LabPatronymic = models.CharField(max_length=100, null='true')
    LabCode = models.CharField(max_length=50, null='true')
    ReceiptDate = models.CharField(max_length=100, null='true')
    Comment = models.CharField(max_length=1000, null='true')


class ExeExperiment(models.Model):
    Samples = models.ForeignKey(Samples, on_delete=models.DO_NOTHING, null='true')
    Laboratorian = models.IntegerField()
    Number = models.IntegerField()
    Name = models.CharField(max_length=20)
    Experiments = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING,  null='true')


class ExeStage(models.Model):
    ExeExperiment = models.ForeignKey(ExeExperiment, on_delete=models.CASCADE, null='true')
    Stage = models.ForeignKey(Stage, on_delete=models.CASCADE, null='true')
    Name = models.CharField(max_length=50, null='true')
    Number = models.IntegerField(null='true')
    Check = models.BooleanField(null='true')
    CheckStuff = models.BooleanField(null='true')
    PreparatoryStage = models.BooleanField(null='true')


class ExeSubStage(models.Model):
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE, null='true')
    SubStage = models.ForeignKey(SubStage, on_delete=models.CASCADE, null='true')
    Parent = models.ForeignKey('self', on_delete=models.CASCADE, null='true')
    Number = models.IntegerField(null='true')
    Criterion = models.CharField(max_length=200, null='true')
    ReplayMessage = models.CharField(max_length=200, null='true')
    Name = models.CharField(max_length=200, null='true')
    Risks = models.CharField(max_length=200, null='true')
    Condition = models.CharField(max_length=200, null='true')
    Attention = models.CharField(max_length=200, null='true')
    Duration = models.FloatField(null='true')
    Picture = models.BooleanField(null='true')
    OtherOption = models.BooleanField(null='true')
    Check = models.BooleanField(null='true')


class Picture(models.Model):
    ExeSubStage = models.ForeignKey(ExeSubStage, on_delete=models.CASCADE, null='true')
    Image = models.ImageField(upload_to=MEDIA_ROOT)


class ExeParameter(models.Model):
    ExeSubStage = models.ForeignKey(ExeSubStage, on_delete=models.CASCADE, null='true')
    ExeMainStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE, null='true')
    ParameterName = models.CharField(max_length=30)
    From = models.FloatField(null='true')
    To = models.FloatField(null='true')
    ExactValue = models.FloatField(null='true')
    Value = models.FloatField(null='true')
    Unit = models.CharField(max_length=30, null='true')
    Equipment = models.CharField(max_length=302, null='true')


class ExeCalcParameter(models.Model):
    ExeMainStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE, null='true')
    ExeSubStage = models.ForeignKey(ExeSubStage, on_delete=models.CASCADE)
    ParameterName = models.CharField(max_length=30)
    Unit = models.CharField(max_length=30, null='true')
    VarName = models.CharField(max_length=30, null='true')
    Period = models.BooleanField(null='true')
    From = models.FloatField(null='true')
    To = models.FloatField(null='true')
    Value = models.FloatField(null='true')


class ExeEquipment(models.Model):
    Check = models.BooleanField(null='true')
    Name = models.CharField(max_length=50)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)


class ExeDishes(models.Model):
    Check = models.BooleanField(null='true')
    Name = models.CharField(max_length=50)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)


class ExeReagents(models.Model):
    Check = models.BooleanField(null='true')
    Name = models.CharField(max_length=50)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)


class ExeProtectiveEquipment(models.Model):
    Check = models.BooleanField(null='true')
    Name = models.CharField(max_length=50)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)


class ExeDoc(models.Model):
    Check = models.BooleanField(null='true')
    Name = models.CharField(max_length=50)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)


class ExeParagraph(models.Model):
    Name = models.CharField(max_length=200)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)
    ExePreparatoryStage = models.IntegerField(null='true')
    ExePreparatoryStageName = models.CharField(max_length=302, null='true')


class ExeCriterion(models.Model):
    Name = models.CharField(max_length=200)
    ExeStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE)
    Answer = models.BooleanField(null='true')


class ExeReplay(models.Model):
    MainStage = models.ForeignKey(ExeStage, on_delete=models.CASCADE, null='true')
    ExeSubStage = models.ForeignKey(ExeSubStage, on_delete=models.CASCADE)
    ReplaySubStage = models.IntegerField(null='true')


class ExePeriod(models.Model):
    ExeCalcParameter = models.ForeignKey(ExeCalcParameter, on_delete=models.CASCADE, null='true')
    Value = models.FloatField(null='true')
    From = models.FloatField(null='true')
    Time = models.FloatField(null='true')
    To = models.FloatField(null='true')